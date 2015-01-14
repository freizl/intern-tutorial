var connect = require('connect'),
	http = require('http'),
	app = connect(),
	R = require('ramda'),
	url = require('url'),
	hoxy = require('hoxy'),
	fs = require('fs'),
	port = 9900,     // TODO: may be pass from command line arguments
	proxy = new hoxy.Proxy().listen(port);

// ====================
// APN
// ====================

proxy.intercept({
	phase: 'request',
	method: 'GET',
	as: 'string',
	host: 'ib.adnxs.com'
}, function(req, resp){

	var url_parts = url.parse(req.url, true),
		data;

	console.log('[' + new Date() + ' ] Intercept adnxs.com: ' + req.url);

	// when fpt jsonp request, overwrtte response
	if (url.indexOf('fpt') === 0 && ys.length === 1) {
		data = fs.readFileSync('data/adnxs.json');
		resp.string = ys[0].replace('callback=', '') + '=' + data;
	}

});


// ====================
// Criteo creatives
// ====================


proxy.intercept({
	phase: 'request',
	method: 'GET',
	host: 'cas.criteo.com'
}, function(req, resp, done){

	var url_parts = url.parse(req.url, true),
		query = url_parts.query,
		file = '/data/criteo_' + query.zoneid + '.js'

	console.log('[' + new Date() + ' ] Intercept cas.criteo.com: ' + req.url);

	this.serve(__dirname + file, done)
});

// ====================
// http server
// ====================

var handlers = {};

function getInterceptHandler (phase) {
	var xs = proxy._intercepts[phase] || [],
		index = xs.length - 1
	return xs[index]
}

function removeInterceptHandler (phase, name) {
	var xs = proxy._intercepts[phase] || [];

	if (!R.isEmpty(xs) && !R.isEmpty(handlers[name])) {
		proxy._intercepts[phase] = R.filter(function (it) {
			return it !== handlers[name]
		})(xs)
	}
}

function addMock (name, opts, handler) {

	if (name) {
		proxy.intercept(opts, handler)
		handlers[name] = getInterceptHandler('request')
		return 'add intercept success for: ' + name
	} else {
		return 'NO intercept added without specify a name'
	}
}


app.use('/mockCriteo', function(req, res, next){
	var url_parts = url.parse(req.url, true),
		query = url_parts.query,
		name = query.name,
		content = query.content || '', // sample: criteo300=1;criteo728=1;criteo160=1;
		result = addMock(name, {
			phase: 'request',
			method: 'GET',
			as: 'string',
			host: 'rtax.criteo.com'
		}, function (req, resp){

			console.log('[' + new Date() + ' ] Intercept rtax.criteo.com: ' + req.url);

			resp.headers['content-type'] = 'text/javascript'
			resp.string = "crtg_content = '" + content + "'; (function(){document.cookie = 'crtg_rta=' + escape(crtg_content) + '; path=/; expires=Wed, 11 Feb 2016 19:02:31 GMT; domain=localhost';})();"
		});

	console.log(">>> Mock request: ", name, content);
	res.end(result)
	next();
})
app.use('/removeMock', function(req, res, next){

	var url_parts = url.parse(req.url, true),
		query = url_parts.query,
		name = query.name,
		phase = query.phase || 'request'

	if (!!query.name && handlers[name]) {
		removeInterceptHandler(phase, name)
		console.log(">>> rm mock request: ", name);
		res.end('intercepts have been removed: ' + name)
	} else {
		res.end('nothing will be removed for ' + name)
	}

	next();
})

http.createServer(app).listen(3000)
