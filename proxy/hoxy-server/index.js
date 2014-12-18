var hoxy = require('hoxy'),
	fs = require('fs'),
	port = 9900,     // TODO: may be pass from command line arguments
	proxy = new hoxy.Proxy().listen(port)
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

	console.log('[' + new Date() + ' ] Intercept adnxs.com: ' + req.url);

	// when fpt jsonp request, overwrtte response
	if (url.indexOf('fpt') === 0 && ys.length === 1) {
		data = fs.readFileSync('data/adnxs.json');
		resp.string = ys[0].replace('callback=', '') + '=' + data;
	}

});
