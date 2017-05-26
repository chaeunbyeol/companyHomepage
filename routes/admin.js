var express = require('express');
var router = express.Router();
var pool = require('../config/db')();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.use(session({
    secret: 'sky!@#!$%auto!@#!$&net(*^%$$',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: '172.16.10.32',
        user: 'skyauto',
        password: 'skyauto1!',
        port: 3306,
        database: 'skywebDB'
    })
}));

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id); //식별자
});

passport.deserializeUser(function (id, done) {
    pool.getConnection(function (err, conn) {
        var sqlForSession = 'SELECT * FROM admin WHERE id=?';
        conn.query(sqlForSession, id, function (err, result) {
            if (err) {
                conn.release();
                throw err;
            } else {
                var user = result[0];
                if (user.id === id) {
                    conn.release();
                    return done(null, user);
                }
                conn.release();
            }
        });
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        var user_id = username;
        var user_pwd = password;

        pool.getConnection(function (err, conn) {
            var sqlForLogin = 'SELECT * FROM admin WHERE id=?';
            conn.query(sqlForLogin, [user_id], function (err, results) {
                if (err) {
                    conn.release();
                    return done('해당 유저 없음');
                }

                if (!results) {
                    conn.release();
                    return done(null, false, {message: 'ID 오류'})
                } else {
                    var user = results[0];
                    //로그인 성공
                    if (user.id === user_id && user.pwd === user_pwd) {
                        done(null, user);  // serializeUser
                        console.log('LocalStrategy(로그인성공)', user);
                    } else {
                        // 로그인 실패
                        done(null, false, {message: 'Password 오류'});
                        console.log('로그인 실패');
                    }
                    conn.release();
                }
            });
        });

    }
));

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/admin/notice',
        failureRedirect: '/',
        failureFlash: true
    })
);

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


//notice 목록 ( 관리자 home)
router.get('/notice', function (req, res) {
    if (req.user) {
        pool.getConnection(function (err, conn) {
            var sqlForNoticeList = 'SELECT * FROM notice ORDER BY idx DESC';
            conn.query(sqlForNoticeList, function (err, rows) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.render('admin/noticeList_admin', {
                        _title: "Notice 목록 | 관리자",
                        notices: rows
                    });
                    conn.release();
                }
            });
        });
    } else {

        res.redirect('/');
    }
});

// notice 상세보기
router.get('/notice/detail/:id', function (req, res) {
    if (req.user) {
        pool.getConnection(function (err, conn) {
            var idx = req.params.id;
            var sqlForNoticeDetail = 'SELECT * FROM notice WHERE idx=' + idx;
            conn.query(sqlForNoticeDetail, function (err, row) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.render('admin/noticeDetail_admin', {
                        _title: "Notice 상세보기 | 관리자",
                        notice: row[0]
                    });
                    conn.release();

                }
            })
        })
    } else {
        res.redirect('/');
    }
});

// notice 작성
router.route('/notice/add')
    .get(function (req, res) {
        if (req.user) {
            res.render('admin/noticeAdd_admin', {
                _title: "Notice 등록 | 관리자"
            });
        } else {
            res.redirect('/');
        }
    })
    .post(function (req, res) {
        if (req.user) {
            var title = req.body.title;
            var content = req.body.content;
            var writer = req.body.writer;

            pool.getConnection(function (err, conn) {
                var sqlForPostNoticeCreate = 'INSERT INTO notice(title, content, writer, date) VALUES (?,?,?, NOW())';
                conn.query(sqlForPostNoticeCreate, [title, content, writer], function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.redirect('/admin/notice');
                        conn.release();
                    }
                })
            })
        } else {
            res.redirect('/');
        }
    });

//notice 수정
router.route('/notice/edit/:id')
    .get(function (req, res) {
        if (req.user) {
            var idx = req.params.id;

            pool.getConnection(function (err, conn) {
                var sqlForGetNoticeUpdate = 'SELECT * FROM notice WHERE idx=' + idx;
                conn.query(sqlForGetNoticeUpdate, function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.render('admin/noticeEdit_admin', {
                            _title: "Notice 작성 | 관리자",
                            notice: row[0]
                        });
                        conn.release();
                    }
                })
            })
        } else {
            res.redirect('/');
        }
    })
    .post(function (req, res) {
        if (req.user) {
            var idx = req.params.id;
            var newTitle = req.body.title;
            var newContent = req.body.content;

            pool.getConnection(function (err, conn) {
                var sqlForPostNoticeUpdate = 'UPDATE notice SET title="' + newTitle + '", content= "' + newContent + '" WHERE idx=' + idx;
                conn.query(sqlForPostNoticeUpdate, function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.redirect('/admin/notice/detail/' + idx);
                        conn.release();
                    }
                })
            });
        } else {
            res.redirect('/');
        }
    });

// notice 삭제
router.get('/notice/delete/:id', function (req, res) {
    if (req.user) {
        var idx = req.params.id;
        pool.getConnection(function (err, conn) {
            var sqlForNoticeDelete = 'DELETE FROM notice WHERE idx=' + idx;
            conn.query(sqlForNoticeDelete, function (err, row) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.redirect('/admin/notice');
                    conn.release();
                }
            })
        })
    } else {
        res.redirect('/');
    }
});

//고객문의 목록
router.get('/support', function (req, res) {
    if (req.user) {
        pool.getConnection(function (err, conn) {
            var sqlForInquiryList = 'SELECT * FROM inquiry ORDER BY idx DESC';
            conn.query(sqlForInquiryList, function (err, rows) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.render('admin/supportList_admin', {
                        _title: "고객 문의 목록 | 관리자",
                        inquiries: rows
                    });
                    conn.release();
                }
            });
        });
    } else {
        res.redirect('/');
    }
});

// 고객 문의 상세보기
router.get('/support/detail/:id', function (req, res) {
    if (req.user) {
        var idx = req.params.id;
        pool.getConnection(function (err, conn) {
            var sqlForSupportDetail = 'SELECT * FROM inquiry WHERE idx=' + idx;
            conn.query(sqlForSupportDetail, function (err, row) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.render('admin/supportDetail_admin', {inquiry: row[0]});
                    conn.release();

                }
            })
        });
    } else {
        res.redirect('/');
    }
});

// 고객문의 삭제
router.get('/support/delete/:id', function (req, res) {
    if (req.user) {
        var idx = req.params.id;
        pool.getConnection(function (err, conn) {
            var sqlForSupportDelete = 'DELETE FROM inquiry WHERE idx=' + idx;
            conn.query(sqlForSupportDelete, function (err, row) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.redirect('/admin/support');
                    conn.release();
                }
            })
        })
    } else {
        res.redirect('/');
    }
});

// product 추가
router.route('/product/add')
    .get(function (req, res) {
        if (req.user) {
            res.render('admin/productAdd_admin', {
                _title: "Product & Service 추가 | 관리자"
            });
        } else {
            res.redirect('/');
        }
    })
    .post(function (req, res) {
        if (req.user) {
            var category = parseInt(req.body.category);
            var name = req.body.name;
            var summary = req.body.summary;
            var spec = req.body.spec;

            pool.getConnection(function (err, conn) {
                var sqlForPostProductCreate = 'INSERT INTO product(name, category, spec, summary) VALUES (?,?,?,?)';
                conn.query(sqlForPostProductCreate, [name, category, spec, summary], function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.redirect('/admin/product');
                        conn.release();
                    }
                })
            })
        } else {
            res.redirect('/');
        }
    });


//product 목록
router.get('/product', function (req, res) {
    if (req.user) {
        pool.getConnection(function (err, conn) {
            var sqlForProductList = 'SELECT * FROM product ORDER BY idx';
            conn.query(sqlForProductList, function (err, rows1) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    var sqlForProductCategoryList = 'SELECT * FROM product_category ORDER BY idx';
                    conn.query(sqlForProductCategoryList, function (err, rows2) {
                        if (err) {
                            conn.release();
                            throw err;
                        } else {
                            res.render('admin/productList_admin', {
                                _title: "제품 목록 | 관리자",
                                products: rows1,
                                categories: rows2
                            });
                            conn.release();
                        }
                    });
                }
            });
        });
    } else {
        res.redirect('/');
    }
});

// product 상세보기
router.get('/product/detail/:id', function (req, res) {
    if (req.user) {
        var idx = req.params.id;
        pool.getConnection(function (err, conn) {
            var sqlForProductDetail = 'SELECT * FROM product WHERE idx=' + idx;
            conn.query(sqlForProductDetail, function (err, row) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.render('admin/productDetail_admin', {
                        _title: "Product&Service 상세보기",
                        product: row[0]
                    });
                    conn.release();
                }
            });
        });
    } else {
        res.redirect('/');
    }
});

// product 삭제
router.get('/support/delete/:id', function (req, res) {
    if (req.user) {
        var idx = req.params.id;
        pool.getConnection(function (err, conn) {
            var sqlForProductDelete = 'DELETE FROM product WHERE idx=' + idx;
            conn.query(sqlForProductDelete, function (err, row) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.redirect('/admin/support');
                    conn.release();
                }
            })
        })
    } else {
        res.redirect('/');
    }
});

//product 수정
router.route('/product/edit/:id')
    .get(function (req, res) {
        if (req.user) {
            var idx = req.params.id;
            pool.getConnection(function (err, conn) {
                var sqlForGetProductUpdate = 'SELECT * FROM product WHERE idx=' + idx;
                conn.query(sqlForGetProductUpdate, function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.render('admin/productEdit_admin', {
                            _title: "Product&Service 수정 | 관리자",
                            product: row[0]
                        });
                        conn.release();
                    }
                })
            })
        } else {
            res.redirect('/');
        }
    })
    .post(function (req, res) {
        if (req.user) {
            var idx = req.params.id;
            var newSummary = req.body.summary;
            var newSpec = req.body.spec;
            //이미지

            pool.getConnection(function (err, conn) {
                var sqlForPostProductUpdate = 'UPDATE product SET summary=? , spec=? WHERE idx=?';
                conn.query(sqlForPostProductUpdate, [newSummary, newSpec, idx], function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.redirect('/admin/product/detail/' + idx);
                        conn.release();
                    }
                })
            });
        } else {
            res.redirect('/');
        }
    });

// product 제품군 추가
router.route('/category/add')
    .get(function (req, res) {
        if (req.user) {
            res.render('admin/productCategoryAdd_admin', {
                _title: "Product & Service 추가 | 관리자"
            });
        } else {
            res.redirect('/');
        }
    })
    .post(function (req, res) {
        if (req.user) {
            var category = req.body.category;
            var summary = req.body.summary;

            pool.getConnection(function (err, conn) {
                var sqlForPostProductCategoryCreate = 'INSERT INTO product_category(category, summary) VALUES (?,?)';
                conn.query(sqlForPostProductCategoryCreate, [category, summary], function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.redirect('/admin/product');
                        conn.release();
                    }
                })
            })
        } else {
            res.redirect('/');
        }
    });


// Product & Service 제품군 내용 수정 (Main 페이지)
router.route('/category/edit/:id')
    .get(function (req, res) {
        if (req.user) {
            var idx = req.params.id;

            pool.getConnection(function (err, conn) {
                var sqlForSelectProductCategory = 'SELECT * FROM product_category WHERE idx=' + idx;
                conn.query(sqlForSelectProductCategory, function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.render('admin/productCategoryEdit_admin', {
                            _title: "제품군 수정 | 관리자",
                            category: row[0]
                        });
                        conn.release();
                    }
                });
            });
        } else {
            res.redirect('/');
        }
    })
    .post(function (req, res) {
        if (req.user) {
            var idx = req.params.id;
            var newSummary = req.body.summary;
            var newCategory = req.body.category;

            pool.getConnection(function (err, conn) {
                var sqlForPostProductCategoryUpdate = 'UPDATE product_category SET category=?, summary=? WHERE idx=?';
                conn.query(sqlForPostProductCategoryUpdate, [newCategory, newSummary, idx], function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.redirect('/admin/product');
                        conn.release();
                    }
                });
            });
        } else {
            res.redirect('/');
        }
    });

// product 제품군 삭제
router.get('/category/delete/:id', function (req, res) {
    if (req.user) {
        var idx = req.params.id;
        pool.getConnection(function (err, conn) {
            var sqlForProductCategoryDelete = 'DELETE FROM product_category WHERE idx=' + idx;
            conn.query(sqlForProductCategoryDelete, function (err, row) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.redirect('/admin/product');
                    conn.release();
                }
            })
        })
    } else {
        res.redirect('/');
    }
});

//news 목록
router.get('/news', function (req, res) {
    if (req.user) {
        pool.getConnection(function (err, conn) {
            var sqlForInquiryList = 'SELECT * FROM news ORDER BY idx DESC';
            conn.query(sqlForInquiryList, function (err, rows) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.render('admin/newsList_admin', {
                        _title: "News 목록 | 관리자",
                        newslist: rows
                    });
                    conn.release();
                }
            });
        });
    } else {
        res.redirect('/');
    }
});


// news 추가
router.route('/news/add')
    .get(function (req, res) {
        if (req.user) {
            res.render('admin/newsAdd_admin', {
                _title: "News 추가 | 관리자"
            });
        } else {
            res.redirect('/');
        }
    })
    .post(function (req, res) {
        if (req.user) {
            var title = req.body.title;
            var writer = req.body.writer;
            var content = req.body.content;
            //이미지도 추가해야함
            pool.getConnection(function (err, conn) {
                var sqlForPostNewsCreate = 'INSERT INTO news(title, writer, content, date) VALUES (?,?,?,NOW())';
                conn.query(sqlForPostNewsCreate, [title, writer, content], function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.redirect('/admin/news');
                        conn.release();
                    }
                })
            });
        } else {
            res.redirect('/');
        }
    });

// news 상세보기
router.get('/news/detail/:id', function (req, res) {
    if (req.user) {
        var idx = req.params.id;
        pool.getConnection(function (err, conn) {
            var sqlForNewsDetail = 'SELECT * FROM news WHERE idx=' + idx;
            conn.query(sqlForNewsDetail, function (err, row) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.render('admin/newsDetail_admin', {
                        _title: "News 상세보기", news: row[0]
                    });
                    conn.release();
                }
            });
        });
    } else {
        res.redirect('/');
    }
});

//news 수정
router.route('/news/edit/:id')
    .get(function (req, res) {
        if (req.user) {
            var idx = req.params.id;

            pool.getConnection(function (err, conn) {
                var sqlForGetNewsUpdate = 'SELECT * FROM news WHERE idx=' + idx;
                conn.query(sqlForGetNewsUpdate, function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.render('admin/newsEdit_admin', {
                            _title: "News 수정 | 관리자",
                            news: row[0]
                        });
                        conn.release();
                    }
                });
            });
        } else {
            res.redirect('/');
        }
    })
    .post(function (req, res) {
        if (req.user) {
            var idx = req.params.id;
            var newTitle = req.body.title;
            var newContent = req.body.content;

            pool.getConnection(function (err, conn) {
                var sqlForPostProductUpdate = 'UPDATE news SET title=? , content=? WHERE idx=?';
                conn.query(sqlForPostProductUpdate, [newTitle, newContent, idx], function (err, row) {
                    if (err) {
                        conn.release();
                        throw err;
                    } else {
                        res.redirect('/admin/news/detail/' + idx);
                        conn.release();
                    }
                });
            });
        } else {
            res.redirect('/');
        }
    });

// news 삭제
router.get('/news/delete/:id', function (req, res) {
    if (req.user) {
        var idx = req.params.id;

        pool.getConnection(function (err, conn) {
            var sqlForNewsDelete = 'DELETE FROM news WHERE idx=' + idx;
            conn.query(sqlForNewsDelete, function (err, row) {
                if (err) {
                    conn.release();
                    throw err;
                } else {
                    res.redirect('/admin/news');
                    conn.release();
                }
            });
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;