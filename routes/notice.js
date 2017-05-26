var express = require('express');
var router = express.Router();
var pool = require('../config/db')();

//notice 페이지
router.get('/', function (req, res, next) {
    pool.getConnection(function (err, conn) {
        var sqlForNoticeList = 'SELECT * FROM notice ORDER BY idx DESC';
        conn.query(sqlForNoticeList, function (err, notices) {
            if (err) {
                conn.release();
                throw err;
            } else {
                var sqlForNewsList = 'SELECT * FROM news ORDER BY idx DESC';
                conn.query(sqlForNewsList, function (err, news) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.render('notice/notice', {
                            _title: '공지사항 | SKYAutoNet',
                            notices: notices,
                            news: news
                        });
                        conn.release();
                    }
                });
            }
        });
    });
});
//notice 자세히 보기
router.get('/detail/:id', function (req, res, next) {
    var idx = req.params.id;

    pool.getConnection(function (err, conn) {
        var sqlForNoticeDetail = 'SELECT * FROM notice WHERE idx=' + idx;
        conn.query(sqlForNoticeDetail, function (err, row) {
            if (err) {
                conn.release();
                throw err;
            } else {
                res.render('notice/noticeDetail', {title: row[0].title, notice: row[0]});
                conn.release();
            }
        });
    });
});

//news 자세히 보기
router.get('/news/detail/:id', function (req, res, next) {
    var idx = req.params.id;

    pool.getConnection(function (err, conn) {
        var sqlForNewsDetail = 'SELECT * FROM news WHERE idx=' + idx;
        conn.query(sqlForNewsDetail, function (err, row) {
            if (err) {
                conn.release();
                throw err;
            } else {
                res.render('notice/newsDetail', {title: row[0].title, news: row[0]});
                conn.release();
            }
        });
    });
});

module.exports = router;
