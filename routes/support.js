var express = require('express');
var router = express.Router();
var pool = require('../config/db')();

router.get('/', function (req, res, next) {
    res.render('support/support');
});

// 고객문의 작성
router.post('/add', function (req, res) {
    var writer = req.body.writer;
    var writer_phone = req.body.writer_phone;
    var content = req.body.content;

    pool.getConnection(function (err, conn) {
        var sqlForPostSupportCreate = 'INSERT INTO inquiry(writer, writer_phone, content, date) VALUES (?,?,?, NOW())';
        conn.query(sqlForPostSupportCreate, [writer, writer_phone, content], function (err, row) {
            if (err) {
                conn.release();
                throw err;
            } else {
                res.redirect('/support');
                conn.release();
            }
        });
    });
});

module.exports = router;
