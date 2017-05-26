module.exports = function () {
    var mysql = require('mysql');

    var pool = mysql.createPool({
        host: '172.16.10.32',
        port : 3306,
        user : 'skyauto',
        password : 'skyauto1!',
        database:'skywebDB',
        connectionLimit:20,
        waitForConnections:false
    });

    return pool;
};
