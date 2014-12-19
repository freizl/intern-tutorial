define([
	'intern!tdd',
	'intern/chai!assert',
	'require',
	'intern/dojo/request',
	'intern/dojo/promise/all',
	'intern/dojo/node!leadfoot/helpers/pollUntil'
], function (tdd, assert, require, request, all, pollUntil) {

	var proxyUrl = 'http://localhost:8080/proxy/9876',
		harUrl = proxyUrl + '/har';


	tdd.suite('cbsi', function () {

		tdd.before(function () {
			console.log(">>>>> start testing");
		})
		tdd.after(function () {
			console.log(">>>>> after testing");
		})

		tdd.test('gamefaqs.com', function () {

			// Start HAR capture request
			// FIXME: could be combined with `this.remote` ??
			request.put(harUrl, {
				headers: {initialPageRef: 'testcase_cx-cbsi-gamefaqs'}
			}).then(function  () {
				console.log("===== started har capture request");
			})

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

				// verify HAR
				.then(function () {
					return request.get(harUrl);
				})
				.then(function (response) {
					var resp = JSON.parse(response);

					//console.log("====== 1", resp.log.entries);
					if (!!resp && !!resp.log && resp.log.entries) {
						var xs = resp.log.entries.filter(urlInExpectDomains);
						console.log("====== 2", xs);

						assert(xs.length >= (expectDomains.length+1), 'at least 3+ requests have been made.')
					} else {
						return request.get(harUrl);
					}
				})
			;
		});
	});

	var expectDomains = ['helix.beanstock.co',
						 'ib.adnxs.com'
						];

	function urlInExpectDomains (page) {
		var xs = expectDomains.filter(function (x) { return page.request.url.indexOf(x) >= 0; });
		return xs.length >= 1;
	}

});
