
(function($){ //create closure so we can safely use $ as alias for jQuery

    $(document).ready(function() {
        "use strict";

        /*-----------------------------------------------------------------------------------*/
        /*  Superfish Menu
        /*-----------------------------------------------------------------------------------*/
        // initialise plugin
        var example = $('.sf-menu').superfish({
            //add options here if required
            delay:       100,
            speed:       'fast',
            autoArrows:  false  
        }); 

        /*-----------------------------------------------------------------------------------*/
        /*  bxSlider
        /*-----------------------------------------------------------------------------------*/
        $('#featured-content .bxslider').show().bxSlider({
            auto: true,
            preloadImages: 'all',
            pause: '6000',
            autoHover: true,
            adaptiveHeight: true,
            mode: 'fade',
            onSliderLoad: function(){ 
                $("#featured-content .bxslider").css("display", "block");
                $("#featured-content .bxslider").css("visibility", "visible");  
                $('#featured-content .entry-header').fadeIn("100");
                $('#featured-content .gradient').fadeIn("100"); 
                $(".featured-right").css("display", "block");                                   
                $(".ribbon").fadeIn('1000');                   
            }
        });                           

        $('.gallery-slider').show().bxSlider({
            auto: true,
            preloadImages: 'all',
            pause: '6000',
            autoHover: true,
            adaptiveHeight: true,
            mode: 'fade',
            onSliderLoad: function(){ 
                $(".single #primary .bx-wrapper").css("visibility", "visible");
                $(".single #primary .gallery-slider").css("display", "block");
            }
        });  

        /*-----------------------------------------------------------------------------------*/
        /*  Back to Top
        /*-----------------------------------------------------------------------------------*/
        // hide #back-top first
        $("#back-top").hide();

        $(function () {
            // fade in #back-top
            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $('#back-top').fadeIn('200');
                } else {
                    $('#back-top').fadeOut('200');
                }
            });

            // scroll body to 0px on click
            $('#back-top a').click(function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 400);
                return false;
            });
        });   

        /*-----------------------------------------------------------------------------------*/
        /*  Misc.
        /*-----------------------------------------------------------------------------------*/       
         $('.widget_ad .widget-title').fadeIn("100"); 

        /*-----------------------------------------------------------------------------------*/
        /*  Mobile Menu & Search
        /*-----------------------------------------------------------------------------------*/

        /* Mobile Menu */
        $('.slicknav_btn').click(function(){

            $('.header-search').slideUp('fast', function() {});
            $('.search-icon > .genericon-search').removeClass('active');
            $('.search-icon > .genericon-close').removeClass('active');

        });

        /* Mobile Search */
        $('.search-icon > .genericon-search').click(function(){

            $('.header-search').slideDown('fast', function() {});
            $('.search-icon > .genericon-search').toggleClass('active');
            $('.search-icon > .genericon-close').toggleClass('active');

            $('.slicknav_btn').removeClass('slicknav_open');
            $('.slicknav_nav').addClass('slicknav_hidden');
            $('.slicknav_nav').css('display','none');

        });

        $('.search-icon > .genericon-close').click(function(){

            $('.header-search').slideUp('fast', function() {});
            $('.search-icon > .genericon-search').toggleClass('active');
            $('.search-icon > .genericon-close').toggleClass('active');

            $('.slicknav_btn').removeClass('slicknav_open');
            $('.slicknav_nav').addClass('slicknav_hidden');  
            $('.slicknav_nav').css('display','none');

        });          


    });

})(jQuery);
