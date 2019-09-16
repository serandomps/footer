var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');

dust.loadSource(dust.compile(require('./template.html'), 'footer'));

module.exports = function (ctx, container, options, done) {
    var sandbox = container.sandbox;
    dust.render('footer', serand.pack({
        year: moment().year(),
        privacy: 'accounts:///privacy',
        terms: 'accounts:///terms'
    }, container), function (err, out) {
        if (err) {
            return done(err);
        }
        sandbox.append(out);
        done(null, function () {
            $('.footer', sandbox).remove();
        });
    });
};
