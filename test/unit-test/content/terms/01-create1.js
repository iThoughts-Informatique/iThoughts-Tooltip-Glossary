var fs = require('fs');
var currentFile = require('system').args[3];
var curFilePath = fs.absolute(currentFile).split('/');
while (curFilePath[curFilePath.length - 1] != 'test') {
	curFilePath.pop();
}
fs.changeWorkingDirectory(curFilePath.join('/'));

var casper = require("./initCasper.js");
var config = casper.config;

var postSelector = 'table.wp-list-table.posts tr.type-glossary';
var postsCount;

casper
	.start(config.test_site.site_url + '/wp-admin', function() {
	this.fill("#loginform", {
		log: config.test_site.login,
		pwd: config.test_site.password
	}, true);
})
	.thenOpen(config.test_site.site_url + '/wp-admin/edit.php?post_type=glossary')
	.then(function(){
	postsCount = this.evaluate(function(postSelector){
		return __utils__.findAll(postSelector).length
	}, postSelector)
})
	.thenOpen(config.test_site.site_url + '/wp-admin/post-new.php?post_type=glossary', function(){
	this.fill("#post", {
		post_title: "My first test of term",
		content: "<p><b>My first term</b> content</p>"
	});
})
	.thenClick("#publish", function(){
	var url = this.getCurrentUrl(),
		idMatch = url.match(/post=(\d+)/);
	if (!idMatch){
		console.error("Unable to retrieve new term id");
		this.exit(1);
	}
})
	.thenOpen(config.test_site.site_url + '/wp-admin/edit.php?post_type=glossary')
	.then(function(){
	var count = this.evaluate(function(postSelector){
		return __utils__.findAll(postSelector).length
	}, postSelector);
	if (count == postsCount){
		console.error("No post created");
		this.exit(1);
	}
});

casper.run();