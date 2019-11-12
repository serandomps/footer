var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');

dust.loadSource(dust.compile(require('./template.html'), 'footer'));

module.exports = function (ctx, container, options, done) {
    var sandbox = container.sandbox;
    dust.render('footer', serand.pack({
        year: moment().year(),
        privacy: 'www:///privacy',
        terms: 'www:///terms'
    }, container), function (err, out) {
        if (err) {
            return done(err);
        }
        var fixed = $('.fixed', sandbox.append(out));

        $('.top', fixed).on('click', function () {
            utils.emit('serand', 'scroll top');
        });

        $('.bottom', fixed).on('click', function () {
            utils.emit('serand', 'scroll bottom');
        });

        var displayHandler;

        var scrollTop = 0;

        var pages = function (total, active) {
            var el = $('.pages', fixed);
            el.find('.total').html(total).end()
                .find('.active').html(active).end()
                .removeClass('hidden');
        };

        var scrolled = function (o) {
            var top = scrollTop;
            scrollTop = o.scrollTop;
            if (o.docHeight < 2 * o.winHeight) {
                fixed.addClass('hidden');
                $('.top', fixed).addClass('hidden');
                $('.bottom', fixed).addClass('hidden');
                return;
            }
            var winWidth = o.winWidth;
            if (winWidth < 1300) {
                if (Math.abs(o.scrollTop - top) * winWidth < 10000) {
                    // possible manual read
                    return;
                }
                clearTimeout(displayHandler);
                displayHandler = setTimeout(function () {
                    fixed.addClass('fade');
                }, 2000);
            } else {
                clearTimeout(displayHandler);
            }
            fixed.removeClass('hidden fade');
            if (o.scrollTop < o.winHeight) {
                $('.top', fixed).addClass('hidden');
                $('.bottom', fixed).removeClass('hidden');
                return;
            }
            $('.top', fixed).removeClass('hidden');
            $('.bottom', fixed).addClass('hidden');
        };

        utils.on('footer', 'pages', pages);
        utils.on('serand', 'scrolled', scrolled);

        done(null, function () {
            utils.off('footer', 'pages', pages);
            utils.off('footer', 'scrolled', scrolled);
            $('.footer', sandbox).remove();
        });
    });
};
