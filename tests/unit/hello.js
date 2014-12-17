define([
    'intern!tdd',
    'intern/chai!assert',
    'app/hello'
], function (tdd, assert, hello) {

	tdd.suite('Say hello', function () {

		tdd.before(function () {
			console.log(" 111 : before test once");
		})

		tdd.after(function () {
			console.log(" 999 : after test once");
		})

		tdd.beforeEach(function () {
			console.log(" 333 : before each test");
		})

		tdd.afterEach(function () {
			console.log(" 555 : after each test ");
		})

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
