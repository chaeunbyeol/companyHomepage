var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('company/company', {_title:'회사 소개 | SKY AutoNet'});
});


module.exports = router;
