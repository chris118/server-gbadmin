var express = require('express');
var users = require('./users');
var posts = require('./posts');
var Post = require('../models/post');

var usersapi = require('../api/usersapi');

var stringutil = require('../util/stringutil');

module.exports = function (app) {
    app.get('/', function (req, res) {
        Post.get(null, function (err, posts) {
            if (err) {
                posts = [];
            }
            console.log(posts);
            res.render('index', {
                title: '主页',
                user: req.session.user,
                posts: posts,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    app.get('/login', users.checkNotLogin);
    app.get('/login', function (req, res) {
        // res.sendFile('./login.html');
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()});
    });

    app.get('/register', users.checkNotLogin);
    app.get('/register', function (req, res) {
        res.render('register', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/logout', users.checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');//登出成功后跳转到主页
    })

    app.get('/post', users.checkLogin);
    app.get('/post', function (req, res) {
        res.render('post', {
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })

    // app.get('/posts', users.checkLogin);
    app.get('/posts', function (req, res) {
        Post.get(null, function (err, posts) {
            if (err) {
                posts = [];
            }
            console.log(posts);
            stringutil.responseJson(res, posts);
        });
    })

    app.post('/register', users.checkNotLogin);
    app.post('/register', users.register);

    // app.post('/login', users.checkNotLogin);
    app.post('/login', users.login);

    app.post('/post', users.checkLogin);
    app.post('/post', posts.post);

    app.get('/users', users.users);


    //api
    app.post('/api/login', usersapi.login);
    app.get('/api/logout', function (req, res) {
    req.session.user = null;
    stringutil.responseJson(res, '登出成功!');
  })
};
