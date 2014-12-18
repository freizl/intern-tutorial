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
				// FIXME:
			    // 1. the test result vary per time waiting. How to increase timeout to SauceLab??
				// 2. dont work with local chrome driver??
				.setTimeout('implicit', 6000)

				// pollUntil
			    // FIXME: this just doesn't work as expected.
				// .then(pollUntil('return document.getElementsByTagName("div") >= 1;',
				// 	 [],
				// 	 8000,
				// 	 1000))

				.findAllByTagName('iframe')
				.then(function (frames) {
					// frames is Array<Element>
					assert(!!frames, 'shall exists frames');
					var srcs = frames.map(function (x) { return x.getAttribute('src')})
					return all(srcs);
				})

				.then(function (srcs) {
					//console.log(">>> srcs: ", srcs);

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
						} else if (src.indexOf('helix.beanstock.co/cleared') > 0) {
							clearFrameSrc = src;
							helixFramesCount++;
						}
					}

					assert.strictEqual(helixFramesCount, 2, 'shall have at least two frames of helix');
					assert(requestFrameSrc, 'request frame exists');
					assert(clearFrameSrc, 'clear frame exists');

				})

				.execute(function () {
					if (window.performance && window.performance.getEntries) {
						var items = window.performance
								.getEntries()
								.filter(function (x) { return x.name.indexOf('ib.adnxs.com') > 0;});
						return {support: true, items: items}
					} else {
						return {support: false};
					}

				})
				.then(function (result) {
					if (result.support) {
						assert(result.items.length >= 1, 'shall have adnxs request');
					} else {
						assert(true, 'resource timing API is not supported. no further assertion');
					}
				})
			;
		});
	});
});
