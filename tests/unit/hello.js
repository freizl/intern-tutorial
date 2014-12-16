define([
    'intern!tdd',
    'intern/chai!assert',
    'app/hello'
], function (tdd, assert, hello) {

	tdd.suite('Say hello', function () {

		tdd.test('greeting', function () {
			var expected = hello.greet('Beanstock Media');
			assert.strictEqual(expected, 'Hello, Beanstock Media!', 'shall be able to greet')
		})

		tdd.test('default world', function () {
			var expected = hello.greet();
			assert.strictEqual(expected, 'Hello, world!', 'shall be able to greet')
		})
	})

});
