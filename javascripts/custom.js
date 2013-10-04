$(document).ready(function() {
    $(window).scroll(function() {
        var scrollVal = $(this).scrollTop();
        if (scrollVal > 220) {
        $('.cta-mini').fadeIn('fast');
            /* $('.banner-wrapper').css({'position': 'fixed','top': '-1px','z-index': '3'});
            $('.content-wrapper').css({'margin-top': '216px'});
            $('.content-wrapper-pages aside').css({'position': 'fixed','top': '0'}); */
        } else {
            $('.cta-mini').fadeOut('fast');
            /* $('.banner-wrapper').css({'position': 'static','top': 'auto','z-index': 'auto'});
            $('.content-wrapper').css({'margin-top': 'auto'});
            $('.content-wrapper-pages aside').css({'position': 'static','top': 'auto'}); */
        }
    });
    /* Apply active class to nav item on scroll */
    var sections = $(".content-wrapper-pages h2");
    var navigation_links = $("aside nav a");
    
    sections.waypoint({
        handler: function(direction) {
            var active_section;
            active_section = $(this);
            if (direction == 'up') {
              var active_id = active_section.attr("id");
              active_section = $('#'+active_id).waypoint('prev');
            }
            var active_link = $('aside nav a[href="#' + active_section.attr("id") + '"]');
            navigation_links.removeClass("active");
            active_link.addClass("active");
        },
        offset: 91
    });
    /* Anchor link smooth scrolling */
    $(function() {
        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') || location.hostname === this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 91
                    }, 400);
                    return false;
                }
            }
        });
    });
    /* Show confirm message on marketing signup submit */
    $("#ss-form").submit(function() {
        $(".signup input").hide();
        $("#ss-form-response").fadeIn();
    });
});