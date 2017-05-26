var express = require('express');
var router = express.Router();
var pool = require('../config/db')();

/* GET home page. */
router.get('/', function (req, res, next) {
    pool.getConnection(function (err, conn) {
        var sqlForProductSummary = 'SELECT * FROM product_category';
        conn.query(sqlForProductSummary, function (err, rows) {
            if (err) {
                conn.release();
                throw err;
            } else {
                res.render('index', {
                    _title: 'SKY AutoNet',
                    categories: rows
                });
                conn.release();
            }
        });
    })
})

module.exports = router;
