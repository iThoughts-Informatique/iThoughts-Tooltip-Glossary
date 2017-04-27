const system = require('system');

const casper = require( 'casper' ).create({
	clientScripts: [],
	pageSettings:  {
		loadImages:  true,        // The WebPage instance used by Casper will
		loadPlugins: true,         // use these settings
	},
	logLevel:    'debug',              // Only 'info' level messages will be logged
	//	verbose:     true,                 // log messages will be printed out to the console
	exitOnError: false,
	onError:     function onError() {
		var args = Array.prototype.slice.call(arguments, 1);
		args.unshift(1);
		this.triggerError.apply(this, args );
	},
	httpStatusHandlers: {
		404: function(self, resource) {
			casper.triggerError(-1, '## 404 ## ' + resource.url + ' gave an error (404)');
		},
		500: function(self, resource) {
			casper.triggerError(1, '## 500 ## ' + resource.url + ' gave an error (500)');
		}
	},
});
casper.mouse = require("mouse").create(casper);

console.error = function(str) {
	casper.echo(str, 'ERROR');
}

casper.triggerError = function triggerError(code) {
	this.echo(Array.prototype.slice.call(arguments, 1).join(', '), 'ERROR');
	if (code !== -1) {
		this.exit( 1 );
	}
}
casper.config = require( './config.json' );

module.exports = casper;
