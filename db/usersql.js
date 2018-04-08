var UserSql = {
    queryAll:'SELECT * FROM user',
    findUser:'SELECT * FROM user WHERE name = \'{0}\'',
    addUser: 'INSERT INTO user (name, password, email) VALUES (\'{0}\', \'{1}\', \'{2}\')'
};

module.exports = UserSql;