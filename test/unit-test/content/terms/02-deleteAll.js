var fs = require('fs');
var currentFile = require('system').args[3];
var curFilePath = fs.absolute(currentFile).split('/');
if (curFilePath.length > 1) {
	curFilePath.pop();
	fs.changeWorkingDirectory(curFilePath.join('/'));
}

var config = require("config.json");

var casper = require("initCasper.js");

var postSelector = 'table.wp-list-table.posts tr.type-glossary';
var postsCount;
casper
	.start(`${config.test_site.site_url}/wp-admin`, function() {
	this.fill("#loginform", {
		log: config.test_site.login,
		pwd: config.test_site.password
	}, true);
})
	.thenOpen(`${config.test_site.site_url}/wp-admin/edit.php?post_type=glossary`)
	.then(function(){
	postsCount = this.evaluate(function(postSelector){
		return __utils__.findAll(postSelector).length
	}, postSelector);
})
	.thenClick('#cb-select-all-1', function(){
	this.wait(100);
})
	.then(function(){
	this.fill('#posts-filter', {
		action: 'trash'
	}, true);
})
	.then(function(){
	var count = this.evaluate(function(postSelector){
		return __utils__.findAll(postSelector).length
	}, postSelector);
	if (postsCount == count){
		console.error("No post removed");
		this.exit(1);
	}
});

casper.run();