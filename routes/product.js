var express = require('express');
var router = express.Router();
var pool = require('../config/db')();

//product 목록
router.get('/', function (req, res, next) {
    pool.getConnection(function (err, conn) {
        var sqlForSelectTelematics = 'SELECT * FROM product WHERE category = 1';
        conn.query(sqlForSelectTelematics, function (err, telematics) {
            if (err) {
                conn.release();
                throw err;
            } else {
                var sqlForSelectControls = 'SELECT * FROM product WHERE category = 2';
                conn.query(sqlForSelectControls, function (err, controls) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        var sqlForSelectWebscans = 'SELECT * FROM product WHERE category = 3';
                        conn.query(sqlForSelectWebscans, function (err, webscans) {
                            if (err) {
                                conn.release();
                                throw err;
                            } else {
                                var sqlForSelectTerminals = 'SELECT * FROM product WHERE category = 4';
                                conn.query(sqlForSelectTerminals, function (err, terminals) {
                                    if (err) {
                                        conn.release();
                                        throw err;
                                    } else {
                                        res.render('product/product', {
                                            _title:"Product & Service",
                                            telematics: telematics,
                                            controls: controls,
                                            webscans: webscans,
                                            terminals: terminals
                                        });
                                    }
                                })
                                conn.release();
                            }
                        });
                    }
                });
            }
        });
    });
});

router.get('/detail/:id', function (req, res, next) {
    var idx = req.params.id;

    pool.getConnection(function (err, conn) {
        var sqlForSelectProductDetail = 'SELECT * FROM product WHERE idx=?';
        conn.query(sqlForSelectProductDetail, [idx], function (err, rows) {
            if (err) {
                conn.release();
                throw err;
            } else {
                res.render('product/detail', {
                    _title: rows[0].name + '상세보기',
                    product: rows[0]
                });
                conn.release();
            }
        });
    })
});

module.exports = router;
