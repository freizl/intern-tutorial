define([
    'intern!tdd',
    'intern/chai!assert',
    'require',
    'intern/dojo/node!leadfoot/helpers/pollUntil'
], function (tdd, assert, require, pollUntil) {
    tdd.suite('cbsi', function () {

        tdd.test('gamefaqs.com', function () {
            return this.remote
                .get(require.toUrl('tests/functional/cx-cbsi.html'))
                .getPageTitle()
                .then(function (text) {
                    assert.strictEqual(text, 'cbsi:gamefaqs.com/asection@300x250');
                });
        });
    });
});
