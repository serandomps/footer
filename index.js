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

        var pages = function (total, active) {
            var el = $('.pages', fixed);
            el.find('.total').html(total).end()
                .find('.active').html(active).end()
                .removeClass('hidden');
        };

        var scrolled = function (o) {
            if (o.docHeight < 2 * o.winHeight) {
                fixed.addClass('hidden');
                $('.top', fixed).addClass('hidden');
                $('.bottom', fixed).addClass('hidden');
                return;
            }
            fixed.removeClass('hidden');
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
