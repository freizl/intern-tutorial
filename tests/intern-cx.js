// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define({
	proxyPort: 9000,
	proxyUrl: 'http://localhost:9000/',

	capabilities: {
		'selenium-version': '2.41.0'
	},

	environments: [
		{ browserName: 'chrome', version: '34', platform: [ 'Linux' ] }
	],

	maxConcurrency: 3,

	tunnel: 'SauceLabsTunnel',
	tunnelOptions: {
		port: 4466,
		proxy: 'http://localhost:8081',
		username: 'jason-beanstock',
		accessKey: 'xxxxxxxxxxxxxxxxxx'
	},

	useLoader: {
		'host-node': 'dojo/dojo',
		'host-browser': 'node_modules/dojo/dojo.js'
	},

	loader: {
		packages: [ { name: 'app', location: 'app' } ]
	},

	suites: [],

	functionalSuites: [ 'tests/functional/cx-cbsi' ],

	excludeInstrumentation: /^(?:tests|node_modules)\//
});
