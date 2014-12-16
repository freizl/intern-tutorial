define([
    'intern!tdd',
    'intern/chai!assert',
    'require'
], function (tdd, assert, require) {
	tdd.suite('index', function () {

		tdd.test('greeting form', function () {
		    return this.remote
                .get(require.toUrl('index.html'))
                .setFindTimeout(5000)
                .findByCssSelector('body.loaded')
                .findById('nameField')
                .click()
                .type('Elaine')
                .end()
                .findByCssSelector('#loginForm input[type=submit]')
                .click()
                .end()
                .findById('greeting')
                .getVisibleText()
                .then(function (text) {
                    assert.strictEqual(text,
									   'Hello, Elaine!',
									   'Greeting should be displayed when the form is submitted');
                });
		});
	});
});
