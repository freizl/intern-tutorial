define([
	'intern!tdd',
	'intern/chai!assert',
	'require',
	'intern/dojo/promise/all',
	'intern/dojo/node!leadfoot/helpers/pollUntil'
], function (tdd, assert, require, all, pollUntil) {
	tdd.suite('cbsi', function () {

		tdd.test('gamefaqs.com', function () {
			return this.remote
				.get(require.toUrl('tests/functional/cx-cbsi.html'))

				.getPageTitle()
				.then(function (text) {
					assert.strictEqual(text, 'cbsi:gamefaqs.com/asection@300x250');
				})

				// jsonwire:: setImplicitWaitTimeout
				// FIXME: the test result vary per time waiting
				.setTimeout('implicit', 5000)

				.findAllByTagName('iframe')
				.then(function (frames) {
					// frames is Array<Element>
					assert(!!frames, 'shall exists frames');
					var srcs = frames.map(function (x) { return x.getAttribute('src')})
					return all(srcs);
				})

				.then(function (srcs) {

					var i = 0,
						xs = srcs.filter(function (x) { return !!x; }),
						len = xs.length,
						helixFramesCount = 0,
						requestFrameSrc,
						clearFrameSrc,
						src;

					for (i = 0; i<len; i++) {
						src = xs[i];
						if (src.indexOf('helix.beanstock.co/request') > 0) {
							requestFrameSrc = src;
							helixFramesCount++;
						} else if (src.indexOf('helix.beanstock.co/clear') > 0) {
							clearFrameSrc = src;
							helixFramesCount++;
						}
					}

					assert.strictEqual(helixFramesCount, 2, 'shall have at least two frames of helix');
					assert(requestFrameSrc, 'request frame exists');
					assert(clearFrameSrc, 'clear frame exists');

				})
			;
		});
	});
});
