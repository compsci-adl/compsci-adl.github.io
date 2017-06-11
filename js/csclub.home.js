$(document).ready(function() {
    // Nav logo fade in/out
    var topofDiv = $("#header-logo").offset().top; //gets offset of #header-logo
    var height = $("#header-logo").outerHeight(); //gets height of #header-logo
    $(window).scroll(function() {
        if ($(window).scrollTop() > (topofDiv + height)) {
            $("#logo").stop().fadeIn({
                duration: 400
            });
            $(".brand-logo").addClass('with-logo');
        } else {
            $("#logo").stop().fadeOut({
                duration: 400
            });
            $(".brand-logo").removeClass('with-logo');
        }
    });

    $('.header-down-arrow i').on('click', function() {
        $("html, body").animate({
            scrollTop: $("#learn").offset().top - 54
        }, 1100, 'easeInOutQuart');
    });
});

// Header typed text
$(window).on('load', function() {
    // If the site has not been visited, type header text
    // Otherwise, just show the final result
    if (!localStorage.getItem('csclub.org.au_visited') || localStorage.getItem('csclub.org.au_visited') == 'false') {
        $("#tagline").typed({
            strings: [
                "Workshops",
                "Social events",
                "Studying",
                'Computer Science Club<br><span class="flow-text" style="color:#ddd;">The University of Adelaide</span><br><a href="/join" class="typed-button">JOIN TODAY</a>'
            ],
            contentType: 'html',
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 500,
            callback: function() {
                typedCallback();
            }
        });
    } else {
        $('#tagline').html('Computer Science Club<br><span class="flow-text" style="color:#ddd;">The University of Adelaide</span><br><a href="/join" class="typed-button waves-effect waves-light btn">JOIN TODAY</a>');
        $('.header-down-arrow').fadeIn(800);
    }
});

function typedCallback() {
    // When the typed animation completes, add final styles and set local storage
    $('.typed-cursor').addClass('invisible');
    $('.typed-button').addClass('waves-effect waves-light btn');
    $('.header-down-arrow').fadeIn(800);
    // Local storage data to determine if site has been visited before
    localStorage.setItem('csclub.org.au_visited', true);
}
// Shortcut for resetting local storage data (Ctrl+A)
$(document).on('keydown', function(e) {
    if (e.keyCode == 65 && e.ctrlKey) {
        localStorage.removeItem('csclub.org.au_visited');
    }
});
