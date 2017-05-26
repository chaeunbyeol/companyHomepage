var appMaster;
appMaster = {
    smoothScroll: function () {
        // Smooth Scrolling
        $('a[href*=#]:not([href=#carousel-example-generic])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {

                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    },

    animateScript: function () {
        $('.scrollpoint.sp-effect1').waypoint(function () {
            $(this).toggleClass('active');
            $(this).toggleClass('animated fadeInLeft');
        }, {offset: '100%'});
        $('.scrollpoint.sp-effect2').waypoint(function () {
            $(this).toggleClass('active');
            $(this).toggleClass('animated fadeInRight');
        }, {offset: '100%'});
        $('.scrollpoint.sp-effect3').waypoint(function () {
            $(this).toggleClass('active');
            $(this).toggleClass('animated fadeInDown');
        }, {offset: '100%'});
        $('.scrollpoint.sp-effect4').waypoint(function () {
            $(this).toggleClass('active');
            $(this).toggleClass('animated fadeIn');
        }, {offset: '100%'});
        $('.scrollpoint.sp-effect5').waypoint(function () {
            $(this).toggleClass('active');
            $(this).toggleClass('animated fadeInUp');
        }, {offset: '100%'});
    },


    scrollMenu: function () {
        {
            var num = 50; //number of pixels before modifying styles
            var num2 = 280;
            var footer = $('footer').position().top-700;
            $('.navbar-fixed-top').addClass('fixedTopBg');

            if ($(window).scrollTop() > num) {
                $('nav').addClass('scrolled');
                $('#logo').attr('src', "/images/logo2.png");
                $('.dropdown-toggle').css('color', '#666666');

            }
            $(window).bind('scroll', function () {
                if ($(window).scrollTop() > num) {
                    $('nav').addClass('scrolled');
                    $('.navbar-fixed-top').addClass('fixedTopBgW');
                    $('.sub-nav').addClass('subTopPadding');
                    $('#logo').attr('src', "/images/logo2.png");
                    $('.dropdown-toggle').css('color', '#666666');
                    $('#fabutton').css('color','#666666');
                    $('#log-btn').css('color','#666666');

                } else {
                    $('nav').removeClass('scrolled');
                    $('.sub-nav').removeClass('subTopPadding');
                    $('.navbar-fixed-top').addClass('fixedTopBg');
                    $('#logo').attr('src', "/images/logo.png");
                    $('.dropdown-toggle').css('color', 'white');
                    $('#fabutton').css('color','#FFFFFF');
                    $('#log-btn').css('color','#FFFFFF');
                }
                if($(window).scrollTop() >= footer){
                    $('#top-btn').css('color','#ffffff');
                }
                else{
                    $('#top-btn').css('color','#337ab7');
                }

            });
            $('ul.navbar-nav li a').bind('click', function () {
                if ($(this).closest('.navbar-collapse').hasClass('in')) {
                    $(this).closest('.navbar-collapse').removeClass('in');
                }
            });
        }
    }
    ,    placeHold: function () {
        // run Placeholdem on all elements with placeholders
        Placeholdem(document.querySelectorAll('[placeholder]'));
    }
}

; // AppMaster


$(document).ready(function () {

    appMaster.smoothScroll();

    appMaster.animateScript();

    appMaster.scrollMenu();

    appMaster.placeHold();

});


$(document).ready(function () {
        var num = 0;
        $(".dropdown").hover(
            function () {
                $('.dropdown-menu', this).not('.in .dropdown-menu').stop(true, true);
                $('.navbar-fixed-top').removeClass('fixedTopBgW');
                $('.navbar-fixed-top').removeClass('fixedTopBg');
                $('.navbar-fixed-top').css('background-color', '#FFFFFF');
                $('.navbar-fixed-top').addClass('fixedTopBgW');
                $('#fabutton').css('color','#666666');
                $('#log-btn').css('color','#666666');
                if ($(window).scrollTop() > num) {

                    $('.navbar-fixed-top').addClass('fixedTopBgW');
                    $('.dropdown-toggle').css('color', '#666666');
                }
                else {

                    $('.navbar-fixed-top').addClass('fixedTopBgW');
                    $('.dropdown-toggle').css('color', '#666666');
                }
                $(this).toggleClass('open');
                $('#logo').attr('src', "/images/logo2.png");
            },
            function () {
                $('.dropdown-menu', this).not('.in .dropdown-menu').stop(true, true);
                //$('.navbar-fixed-top').css('background', 'none');
                if ($(window).scrollTop() > num) {
                    $('.navbar-fixed-top').addClass('fixedTopBgW');
                    $('.dropdown-toggle').css('color', '#666666');
                    $('#fabutton').css('color','#666666');
                    $('#log-btn').css('color','#666666');
                }
                else {
                    $('.navbar-fixed-top').addClass('fixedTopBg');
                    $('.dropdown-toggle').css('color', 'white');
                    $('#logo').attr('src', "/images/logo.png");
                    $('#fabutton').css('color','#FFFFFF');
                    $('#log-btn').css('color','#FFFFFF');
                }


                $(this).toggleClass('open');
            }
        )
    }
)