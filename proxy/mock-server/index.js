var mockserver = require('mockserver-grunt'),
    mockServer = require('mockserver-client'),
    request = require('request');


// ==================================================
// System code
// ==================================================

function foo (callback) {

	request('http://localhost:8899/fpt', function (error, response, body) {
		console.log("====", error);
		if (!error && response.statusCode == 200) {
			console.log(body);
		}
		callback();
	})

}

// ==================================================
// MOCK
// ==================================================

mockserver.start_mockserver({
    serverPort: 1080,
    proxyPort: 1090,
    verbose: true
}).then(function () {

	var mockServerClient = mockServer.mockServerClient, // MockServer client
		proxyClient = mockServer.proxyClient // proxy client
	;

	mockServerClient("localhost", "8899").mockAnyResponse({
		"httpRequest": {
			"method": "GET",
			"path": "/fpt"
		},
		"httpResponse": {
			"statusCode": 200,
			"headers": [
				{
					"name": "Content-Type",
					"values": ["application/json; charset=utf-8"]
				},
				{
					"name": "bsm-header",
					"values": ["howard street"]
				}
			],
			"body": JSON.stringify({ message: "good weather in the city." })
		}
		//"times": {
		//    "remainingTimes": 1,
		//    "unlimited": false
		//}
	});

	// ==================================================
	// TEST
	// ==================================================

	var s = new Date().getTime(),
		i = 0;
	{
		i++;
	} while ((new Date().getTime()) - s <= 1000)

	foo(function () { mockserver.stop_mockserver(); });

})
