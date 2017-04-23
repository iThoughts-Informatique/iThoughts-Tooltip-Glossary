/* global __utils__: false */

var fs = require('fs');
var currentFile = require('system').args[3];
var curFilePath = fs.absolute(currentFile).split('/');
if (curFilePath.length > 1) {
	curFilePath.pop();
	fs.changeWorkingDirectory(curFilePath.join('/'));
}

var config = require('config.json');

var casper = require('initCasper.js');

casper.start(config.test_site.site_url + '/wp-admin', function() {
	this.fill('#loginform', {
		log: config.test_site.login,
		pwd: config.test_site.password,
	}, true);
}).then(function(){
	this.open(this.evaluate(function(){
		return __utils__.findOne('#menu-plugins > a').href;
	})).then(function(){
		if (!this.exists('table.plugins tr[data-slug="ithoughts-tooltip-glossary"]'))
			this.exit(3);
		if (this.exists('table.plugins tr[data-slug="ithoughts-tooltip-glossary"].inactive')){
			this.thenClick('tr[data-slug="ithoughts-tooltip-glossary"] .activate a', function(){
				if(this.exists('#message.error')){
					this.exit(1);
				}
				doToggle.call(this);
			});
		} else {
			doToggle.call(this);
		}
	});
});

function doToggle(){
	if (!this.exists('table.plugins tr[data-slug="ithoughts-tooltip-glossary"].active')){
		this.exit(1);
	} else {
		this.thenClick('tr[data-slug="ithoughts-tooltip-glossary"] .deactivate a', function(){
			if(this.exists('#message.error')){
				this.exit(1);
			}
			if (!this.exists('table.plugins tr[data-slug="ithoughts-tooltip-glossary"].inactive')){
				this.exit(1);
			} else {
				this.thenClick('tr[data-slug="ithoughts-tooltip-glossary"] .activate a', function(){
					if(this.exists('#message.error')){
						this.exit(1);
					}
				});
			}
		});
	}
}

casper.run();