var PostSql = {
    queryAll:'SELECT * FROM post',
    findPost:'SELECT * FROM post WHERE name = \'{0}\'',
    addPost: 'INSERT INTO post (name, time, title, post) VALUES (\'{0}\', \'{1}\', \'{2}\', \'{3}\')'
};

module.exports = PostSql;