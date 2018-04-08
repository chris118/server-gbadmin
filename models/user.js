var userSql = require('../db/usersql');
var mysql = require('mysql');
var string = require('../util/stringutil');
var dbConfig = require('../db/dbconfig');

var pool = mysql.createPool(dbConfig.mysql);

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.uid = user.uid;
};

User.prototype.save = function (callback) {
    var user = {
        name : this.name,
        password : this.password,
        email : this.email,
      uid: this.uid
    };

    pool.getConnection(function (err, connection) {
        var sql = string.format(userSql.addUser, [user.name, user.password, user.email]);
        console.log('User.save: ' + sql);
        connection.query(sql, function (err, result) {
            if(err){
                return callback(err);
            }else{
                return callback(null, result);
            }
        });
    });
}

User.get = function (name, callback) {
    pool.getConnection(function (err, connection) {
        var sql = string.format(userSql.findUser, [name]);
        console.log('User.get: ' + sql);
        connection.query(sql, function (err, result) {
            if(err){
                return callback(err);
            }else{
                return callback(null, result);
            }
        });
    });
}

module.exports = User;