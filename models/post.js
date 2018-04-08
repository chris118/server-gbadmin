var postSql = require('../db/postsql');
var mysql = require('mysql');
var stringutil = require('../util/stringutil');
var dateutil = require('../util/dateutil');
var dbConfig = require('../db/dbconfig');

var pool = mysql.createPool(dbConfig.mysql);

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
};

Post.prototype.save = function (callback) {
    var date = new Date();
    var dateStr = dateutil.format(date, "yyyy-MM-dd HH:mm:ss");
    var post = {
        name: this.name,
        time: dateStr,
        title: this.title,
        post: this.post
    };

    pool.getConnection(function (err, connection) {
        var sql = stringutil.format(postSql.addPost, [post.name, post.time, post.title, post.post]);
        console.log('Post.save: ' + sql);
        connection.query(sql, function (err, result) {
            console.log('Post.save: ' + err);
            if(err){
                return callback(err);
            }else{
                return callback(null, result);
            }
        });
    });
}

Post.get = function (name, callback) {
    pool.getConnection(function (err, connection) {
        var sql = postSql.queryAll;
        console.log('Post.get: ' + sql);
        connection.query(sql, function (err, result) {
            if(err){
                return callback(err);
            }else{
                var formatPosts = Array();
                for(var i = 0; i < result.length; i++){
                    console.log(result[i]);
                    result[i].time = dateutil.format(result[i].time, 'yyyy-MM-dd HH:mm:ss');
                    formatPosts.push(result[i]);
                }

                return callback(null, formatPosts);
            }
        });
    });
}

module.exports = Post;
