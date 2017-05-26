var express = require('express');
var router = express.Router();
var pool = require('../config/db')();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
//
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

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

// router.use(passport.initialize());
// router.use(passport.session());
//
// passport.serializeUser(function(user, done) {
//     console.log('serialize');
//     done(null, user);
// });
//
// // 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
// passport.deserializeUser(function(user, done) {
//     console.log('deserialize');
//     console.log(user);
//     done(null, user);
// });

// passport.use(new LocalStrategy({
//         usernameField : 'userid',
//         passwordField : 'password',
//         passReqToCallback : true
//     }
//     ,function(req,userid, password, done) {
//         if(userid=='hello' && password=='world'){
//             var user = { 'userid':'hello',
//                 'email':'hello@world.com'};
//             return done(null,user);
//         }else{
//             return done(null,false);
//         }
//     }
// ));
//
// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         var user_id = username;
//         var user_pwd = password;
//
//         pool.getConnection(function (err, conn) {
//             var sqlForLogin = 'SELECT * FROM admin WHERE id=?';
//             conn.query(sqlForLogin, [user_id], function (err, rows) {
//                 if (err) {
//                     conn.release();
//                     return done('There is no user.');
//                 } else {
//                     //로그인 성공
//                     if (rows[0].id === user_id && rows[0].pwd === user_pwd) {
//                         done(null, rows[0]);
//                         console.log('user_id', username);
//                         console.log('user_pwd', password);
//                     } else {  // 로그인 실패
//                         done(null, false);
//                         console.log('로그인 실패');
//                     }
//                     conn.release();
//                 }
//             });
//         });
//         done(null, false);
//     }
// ));
//
// router.post('/login',
//     passport.authenticate('local', {
//         successRedirect: '/admin/notice',
//         failureRedirect: '/',
//         failureFlash: false
//     }));



//관리자 로그인
router.post('/login', function (req, res, next) {
    var user_id = req.body.id;
    var user_pwd = req.body.pwd;

    pool.getConnection(function (err, conn) {
        var sqlForLogin = 'SELECT * FROM admin';
        conn.query(sqlForLogin, function (err, rows) {
            if (err) {
                conn.release();
                throw err;
            } else {
                if (rows[0].id === user_id && rows[0].pwd === user_pwd) {
                    req.session.name = '관리자';
                    req.session.save(function () {
                        res.redirect('/admin/notice');
                    })
                } else {
                    console.log("아이디/비번 오류");
                    res.redirect("/");
                }
                conn.release();
            }
        });
    });
});

// 로그아웃
router.get('/logout', function (req, res) {
    delete req.session.name;
    res.redirect('/');
});

module.exports = router;
