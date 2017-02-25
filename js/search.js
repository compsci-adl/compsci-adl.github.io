(function($) {
    $(document).ready(function() {
        window.index = lunr(function() {
            this.field('title', {
                boost: 10
            });
            this.field('body');
            this.ref('id');
        });
        window.index.pipeline.reset();

        window.store = [{
                title: 'About',
                body: 'About club services, committee members, FAQ',
                href: 'https://csclub.org.au/about',
                target: '_self',
                colour: 'pink'
            },
            {
                title: 'Contact',
                body: 'Want to get in touch with us?',
                href: 'https://csclub.org.au/contact',
                target: '_self',
                colour: 'dark'
            },
            {
                title: 'FAQ',
                body: 'Frequently asked questions and other information.',
                href: 'https://csclub.org.au/about#faq',
                target: '_self',
                colour: 'pink'
            },
            {
                title: 'Committee Members',
                body: 'Members of the committee including the president, vice-president, treasurer, secretary, and four general members.',
                href: 'https://csclub.org.au/about#committee',
                target: '_self',
                colour: 'pink'
            },
            {
                title: 'President',
                body: 'Members of the committee including the president, vice-president, treasurer, secretary, and four general members.',
                href: 'https://csclub.org.au/about#committee',
                target: '_self',
                colour: 'pink'
            },
            {
                title: 'Vice president',
                body: 'Members of the committee including the president, vice-president, treasurer, secretary, and four general members.',
                href: 'https://csclub.org.au/about#committee',
                target: '_self',
                colour: 'pink'
            },
            {
                title: 'Treasurer',
                body: 'Members of the committee including the president, vice-president, treasurer, secretary, and four general members.',
                href: 'https://csclub.org.au/about#committee',
                target: '_self',
                colour: 'pink'
            },
            {
                title: 'Secretary',
                body: 'Members of the committee including the president, vice-president, treasurer, secretary, and four general members.',
                href: 'https://csclub.org.au/about#committee',
                target: '_self',
                colour: 'pink'
            },
            {
                title: 'General committee',
                body: 'Members of the committee including the president, vice-president, treasurer, secretary, and four general members.',
                href: 'https://csclub.org.au/about#committee',
                target: '_self',
                colour: 'pink'
            },
            {
                title: 'CS Club Slack',
                body: 'The Computer Science Club\'s Slack server is a friendly place to chat with current and past members.',
                href: 'https://csclub.org.au/about#slack',
                target: '_self',
                colour: 'pink'
            },
            {
                title: 'Members',
                body: 'Members will have access to:...',
                href: 'https://csclub.org.au/about',
                target: '_self',
                colour: 'pink'
            },
            {
                title: 'Join',
                body: 'Become a CS Club member.',
                href: 'https://csclub.org.au/join',
                target: '_self',
                colour: 'yellow'
            },
            {
                title: 'Sign up',
                body: 'Become a CS Club member.',
                href: 'https://csclub.org.au/join',
                target: '_self',
                colour: 'yellow'
            },
            {
                title: 'Register',
                body: 'Become a CS Club member.',
                href: 'https://csclub.org.au/join',
                target: '_self',
                colour: 'yellow'
            },
            {
                title: 'Membership',
                body: 'Become a CS Club member.',
                href: 'https://csclub.org.au/join',
                target: '_self',
                colour: 'yellow'
            },
            {
                title: 'Membership cost',
                body: 'Membership costs $5.',
                href: 'https://csclub.org.au/join',
                target: '_self',
                colour: 'yellow'
            },
            {
                title: 'First year students',
                body: 'If you are a first year student there are many activities held by the club at the start of the year specifically for you...',
                href: 'https://csclub.org.au/#first-years',
                target: '_self',
                colour: 'blue'
            },
            {
                title: 'GitHub',
                body: 'Visit the CS Club GitHub page.',
                href: 'https://github.com/compsci-adl',
                target: '_blank',
                colour: 'blue'
            },
            {
                title: 'Facebook Page',
                body: 'Like and follow the CS Club Facebook page to keep up with events and general discussions.',
                href: 'https://www.facebook.com/compsci.adl',
                target: '_blank',
                colour: 'blue'
            },
            {
                title: 'Social events',
                body: 'Events such as meet and greets, games/movie nights, BBQs, and pub crawls are just some of the social events the club runs each year.',
                href: 'https://csclub.org.au/#socialise',
                target: '_self',
                colour: 'blue'
            }
        ];

        window.store.forEach(function(entry, index) {
            window.index.add({
                id: index,
                href: entry.href,
                title: entry.title,
                body: entry.body
            });
        });

        // icon click
        $('.search-wrapper i.material-icons').on('click', function() {
            if ($('.search-results .focused').length) {
                $('.search-results .focused').first()[0].click();
            } else if ($('.search-results').children().length) {
                $('.search-results').children().first()[0].click();
            }
        });

        var renderResults = function(results) {
            var resultsContainer = $('.search-results');
            resultsContainer.empty();
            Array.prototype.forEach.call(results, function(result) {
                var resultDiv = $('<a href=' + result[2] + ' target=' + result[3] + '>' + '<span class="search-title">' + result[0] + '</span><span class="search-href truncate cs-' + result[4] + '">' + result[2] + '</span><span class="search-body truncate">' + result[1] + '</span></a>');
                resultsContainer.append(resultDiv);
            });
            $('.search-results').each(function(index, value) {
                focused = $(value).children().first();
                focused.addClass('focused');
            });
        };

        var debounce = function(fn) {
            var timeout;
            return function() {
                var args = Array.prototype.slice.call(arguments),
                    ctx = this;

                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    fn.apply(ctx, args);
                }, 100);
            };
        };

        $('input.search').focus(function() {
            $(this).parent().addClass('focused');
        });
        $('input.search').blur(function() {
            if (!$(this).val()) {
                $(this).parent().removeClass('focused');
            }
        });

        $('input.search').bind('keyup', debounce(function(e) {
            if ($(this).val() < 2) {
                renderResults([]);
                return;
            }

            if (e.which === 38 || e.which === 40 || e.keyCode === 13) return;

            var query = $(this).val();
            var results = window.index.search(query).slice(0, 4).map(function(result) {
                var entry = window.store[result.ref];
                return [entry.title, entry.body, entry.href, entry.target, entry.colour];
            });
            renderResults(results);
        }));


        $('input.search').bind('keydown', debounce(function(e) {
            // Escape.
            if (e.keyCode === 27) {
                $(this).val('');
                $(this).blur();
                renderResults([]);
                return;
            } else if (e.keyCode === 13) {
                // enter
                if ($('.search-results .focused').length) {
                    $('.search-results .focused').first()[0].click();
                } else if ($('.search-results').children().length) {
                    $('.search-results').children().first()[0].click();
                }
                return;
            }

            // Arrow keys.
            var focused;
            switch (e.which) {
                case 38: // up
                    if ($('.search-results .focused').length) {
                        focused = $('.search-results .focused');
                        focused.removeClass('focused');
                        focused.prev().addClass('focused');
                    }
                    break;

                case 40: // down
                    if (!$('.search-results .focused').length) {
                        focused = $('.search-results').children().first();
                        focused.addClass('focused');
                    } else {
                        focused = $('.search-results .focused');
                        if (focused.next().length) {
                            focused.removeClass('focused');
                            focused.next().addClass('focused');
                        }
                    }
                    break;

                default:
                    return; // exit this handler for other keys
            }
            e.preventDefault();
        }));
    });
}(jQuery));
