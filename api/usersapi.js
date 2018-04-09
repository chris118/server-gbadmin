var express = require('express');
var mysql = require('mysql');
var crypto = require('crypto');
var dbConfig = require('../db/dbconfig');
var userSql = require('../db/usersql');
var string = require('../util/stringutil');
var User = require('../models/user');


var pool = mysql.createPool(dbConfig.mysql);


function users(req, res) {
  pool.getConnection(function (err, connection) {
    connection.query(userSql.queryAll, function (err, result) {
      string.responseJson(res, result);
    });
  });
}

function register(req, res) {
  var name = req.body.name;
  var password = req.body.password;
  var repeat_password = req.body.repeat_password;
  var email = req.body.email;

  console.log('password: ' + password);
  console.log('repeat_password: ' + repeat_password);

  //检验用户两次输入的密码是否一致
  if (password != repeat_password) {
    req.flash('error', '两次输入密码不一样');
    return res.redirect('/register');
  }

  //生成密码的 md5 值
  var md5 = crypto.createHash('md5');
  password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
    name: name,
    password: password,
    email: email
  });

  //检查用户名是否已经存在
  User.get(name, function (err, result) {
    console.log("User.get err: ", err);
    if (err) {
      req.flash(err);
      return res.redirect('/register');
    }
    console.log("User.get result", result);
    if (result.length > 0) {
      req.flash('error', '用户已存在!');
      return res.redirect('/register');//返回注册页
    }
    newUser.save(function (err, result) {
      console.log("newUser.save err", err);
      if (err) {
        req.flash('error', err);
        return res.redirect('/register');//注册失败返回主册页
      }
      console.log("newUser.user", newUser);
      req.session.user = newUser;//用户信息存入 session
      req.flash('success', '注册成功!');
      res.redirect('/');//注册成功后返回主页
    });
  });
}

function login(req, res) {
  console.log(req.body);
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('hex');
  var name = req.body.name;
  console.log("name: ", name);
  console.log("password : ", password);

  //检查用户名是否已经存在
  User.get(name, function (err, result) {
    console.log("User.get err: ", err);
    if (err) {
      string.responseJson(res, '用户不存在!');
      return;
    }
    console.log("User.get result", result);
    if (result.length == 0) {
      string.responseJson(res, '用户不存在!');
      return;
    }

    //检查密码是否一致
    console.log("User.get password", result[0]);
    if (result[0].password != password) {
      req.flash('error', '密码错误!');
      string.responseJson(res, '密码不一致!');
      return;
    }
    //用户名密码都匹配后，将用户信息存入 session
    var user = new User({
      name: result[0].name,
      //password: result[0].password,
      email: result[0].email,
      uid: result[0].uid
    });
    req.session.user = user;
    string.responseJson(res, user);
    // req.flash('success', '登陆成功!');
    // res.redirect('/');//登陆成功后跳转到主页
  });
}

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!');
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!');
    res.redirect('back');
  }
  next();
}

module.exports = {
  users: users,
  register: register,
  login: login,
  checkLogin: checkLogin,
  checkNotLogin: checkNotLogin
}