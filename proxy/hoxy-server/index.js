var connect = require('connect');
var http = require('http')
var app = connect()


var hoxy = require('hoxy'),
	fs = require('fs'),
	port = 9900,     // TODO: may be pass from command line arguments
	proxy = new hoxy.Proxy().listen(port)
	;

// ====================
// APN
// ====================

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


// ====================
// Criteo
// ====================

proxy.intercept({
	phase: 'request',
	method: 'GET',
	as: 'string',
	host: 'rtax.criteo.com'
}, function(req, resp){

	console.log('[' + new Date() + ' ] Intercept rtax.criteo.com: ' + req.url);

	resp.headers['content-type'] = 'text/javascript'
	resp.string = "crtg_content = 'criteo300=1'; (function(){document.cookie = 'crtg_rta=' + escape(crtg_content) + '; path=/; expires=Wed, 11 Feb 2016 19:02:31 GMT; domain=localhost';})();"
});

proxy.intercept({
	phase: 'request',
	method: 'GET',
	as: 'string',
	host: 'cas.criteo.com'
}, function(req, resp){

	console.log('[' + new Date() + ' ] Intercept cas.criteo.com: ' + req.url);

	var data = fs.readFileSync('data/criteo.js');
	//console.log(data);
	resp.headers['content-type'] = 'text/javascript'
	resp.headers['by-proxy'] = 'hoxy'
	resp.string = data
});

// ====================
// http server
// ====================

app.use(function(req, res){
	// TODO: Enable / Disable new intercept rules
	res.end('Hello from Connect!\n');
})
http.createServer(app).listen(3000)
