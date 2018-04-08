var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
var dbConfig = require('../db/dbconfig');
var userSql = require('../db/postsql');
var string = require('../util/stringutil');
var Post = require('../models/post');

var pool = mysql.createPool(dbConfig.mysql);

function post(req, res) {
    var currentUser = req.session.user,
        post = new Post(currentUser.name, req.body.title, req.body.post);
    post.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发布成功!');
        res.redirect('/');//发表成功跳转到主页
    });
}

module.exports = {
    post : post
}