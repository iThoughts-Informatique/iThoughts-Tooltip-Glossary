const casper = require('casper').create({
	clientScripts:  [],
	pageSettings: {
		loadImages:  true,        // The WebPage instance used by Casper will
		loadPlugins: true,         // use these settings
	},
	logLevel: 'debug',              // Only 'info' level messages will be logged
	verbose: true,                 // log messages will be printed out to the console
	exitOnError: false,
	onError: function(){
		console.log(arguments.toString());
	},
});

casper.config = require('./config.json');

module.exports = casper;