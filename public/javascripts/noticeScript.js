$(document).ready(function() {
    var num = 50; //number of pixels before modifying styles
    var num2 = 280;

    //id값에 따라서 href 속성 가져옴.

    var td_third = $('#third').attr('href');




        var scP2 = $('section' + td_third).position().top;
    $(".hover").mouseleave(
        function () {
            $(this).removeClass("hover");
        }
    );

    $(window).one('resize',function(){
        $.getScript('../javascripts/noticeScript.js');
    });
    if ($(window).scrollTop() > num2) {
        $('.navbar-fixed-top.dropdown.navFix').addClass('stickyScroll');
        $('#subFix').addClass('stickySc');

    } else {
        $('.navbar-fixed-top.dropdown.navFix').removeClass('stickyScroll');
        $('#subFix').removeClass('stickySc');
    }

    if ($(window).scrollTop() < scP2) {
        $('.sub-nav td a').removeClass('on');
        $('.sub-nav td a#first1').addClass('on');
    }
    else if ($(window).scrollTop() >= scP2) {
        $('.sub-nav td a').removeClass('on');
        $('.sub-nav td a#third').addClass('on');
    }
    $(window).bind('scroll', function () {

        if ($(window).scrollTop() > num2) {
            $('.navbar-fixed-top.dropdown.navFix').addClass('stickyScroll');
            $('#subFix').addClass('stickySc');

        } else {
            $('.navbar-fixed-top.dropdown.navFix').removeClass('stickyScroll');
            $('#subFix').removeClass('stickySc');
        }
        if ($(window).scrollTop() < scP2) {
            $('.sub-nav td a').removeClass('on');
            $('.sub-nav td a#first1').addClass('on');
        }
        else if ($(window).scrollTop() >= scP2) {
            $('.sub-nav td a').removeClass('on');
            $('.sub-nav td a#third').addClass('on');
        }
    });
    $('ul.navbar-nav li a').bind('click', function () {
        if ($(this).closest('.navbar-collapse').hasClass('in')) {
            $(this).closest('.navbar-collapse').removeClass('in');
        }
    });
});