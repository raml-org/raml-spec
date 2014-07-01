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
    /*
    Apply active class to nav item on scroll
    */
    var sections = $(".content-wrapper-pages h2");
    var navigation_links = $("aside nav a");
    
    sections.waypoint({
        handler: function(direction) {
            var active_section;
            active_section = $(this);
            if (direction === 'up') {
              var active_id = active_section.attr("id");
              active_section = $('#'+active_id).waypoint('prev');
            }
            var active_link = $('aside nav a[href="#' + active_section.attr("id") + '"]');
            navigation_links.removeClass("active");
            active_link.addClass("active");
        },
        offset: 95
    });
    /*
    Anchor link smooth scrolling
    */
    if ($('#section-projects').length < 1) {
      $(function() {
          $('a[href*=#]:not([href=#])').click(function() {
              if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') || location.hostname === this.hostname) {
                  var target = $(this.hash);
                  target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                  if (target.length) {
                      $('html,body').animate({
                          scrollTop: target.offset().top - 95
                      }, 400);
                      return false;
                  }
              }
          });
      });
    }
    /*
    Add active class to last nav item on scroll to bottom
    */
    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() == $(document).height()) {
        $('aside nav a').removeClass('active');
        $('aside nav ul:first-of-type li:last-child a').addClass('active');
      }
    });
    /*
    Show confirm message on marketing signup submit
    */
    $("#ss-form").submit(function() {
        $(".signup input").hide();
        $("#ss-form-response").fadeIn();
    });
    /*
    Copy to clipboard
    */
    $(function() {
      $('.copy-clipboard').clipboard({
              path: 'jquery.clipboard.swf',
              copy: function() {
                  $('.copy-clipboard span').fadeIn('fast');
                  return $('#home .content code').text();
              }
      });
    });
    
    /* Project page */
    if ($('#section-projects').length > 0) {
      $('.projects-subnav a').click(function() {
        var section = $(this).attr('href').replace('#', '');
        window.location.hash = section;
        project_activate_section();
        return false;
      });
    }
    var project_activate_section = function() {
      section = window.location.hash.substring(1);
      if (!section) return;
      var orig_section = '';
      if (section.indexOf('-') >= 0) {
        orig_section = section;
        var sections = section.split('-');
        section = sections[0];
        
      }
      $('.projects-subnav a').removeClass('active').each(function() {
        if ($(this).attr('href') == '#'+section) {
          $(this).addClass('active');
        }
      });
      $('#section-projects section').hide();
      $('#section-'+section).show();
      if (orig_section && $('#'+orig_section).length > 0) {
        $('html,body').animate({
          scrollTop: $('#'+orig_section).offset().top - 95
        }, 400);
      }
    };
    project_activate_section();
});