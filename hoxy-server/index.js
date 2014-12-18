var hoxy = require('hoxy'),
	fs = require('fs'),
	proxy = new hoxy.Proxy().listen(9876)
	;

proxy.intercept({
	phase: 'request',
	method: 'GET',
	as: 'string',
	host: 'ib.adnxs.com'
}, function(req, resp){

	var url = req.url,
		xs = url.split('&'),
		ys = xs.filter(function (x) { return x.indexOf('callback') === 0;}),
		data
		;

	console.log('Intercept adnxs.com: ' + req.url);

	// when fpt jsonp request, overwrtte response
	if (url.indexOf('fpt') === 0 && ys.length === 1) {
		data = fs.readFileSync('data/adnxs.json');
		resp.string = ys[0].replace('callback=', '') + '=' + data;
	}

});
