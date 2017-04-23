/**
 * @file NodeJS test script for loading from Wikipedia a random article
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://tldrlegal.com/license/mit-license MIT
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

/* global $: false, Node: false */

var wikiApi = require('casper').create({
	clientScripts:  [],
	pageSettings: {
		loadImages:  true,        // The WebPage instance used by Casper will
		loadPlugins: true,         // use these settings
	},
	logLevel: 'silent',              // Only 'info' level messages will be logged
	verbose: false,                 // log messages will be printed out to the console

	exitOnError: false,
	onError: function(){},
});
wikiApi.start('https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=revisions|images&rvprop=content&grnlimit=1', function(){
	var journalJson = JSON.parse(this.getPageContent());
	var wikiArticle = 'https://en.wikipedia.org/?curid=' + Object.keys(journalJson.query.pages)[0];
	this.thenOpen(wikiArticle).then(function(){
		var extractedData = {
			title: this.getElementInfo('#firstHeading').text,
			content: this.evaluate(function(){
				var contentSelector = '#mw-content-text';

				// Purge useless content
				$('.navbox, noscript, script, #contentSub, #jump-to-nav', contentSelector).remove();

				// Purge comments
				function removeComments(elements){
					Array.prototype.slice.call(elements, 0).forEach(function(elem){
						if(elem.nodeType === Node.COMMENT_NODE) {
							$(elem).remove();
						} else {
							removeComments(elem.childNodes);
						}
					});
				}
				removeComments($(contentSelector));

				// Remove all attrs
				function removeAllAttrs(element) {
					for (var i= element.attributes.length; i-->0;){
						var attrName = element.attributes[i].name;
						if(attrName == 'href'){
							var attrValue = element.getAttribute(attrName);
							if(attrValue[0] === '/'){
								element.setAttribute(attrName, 'https://en.wikipedia.org' + attrValue);
							}
						} else {
							element.removeAttribute(attrName);
						}
					}
				}
				$('#mw-content-text *').each(function() {      // iterate over all elements
					removeAllAttrs(this);     // remove all attributes
				});

				return $(contentSelector)[0].innerHTML.replace(/([\s\n])[\s\n]+/g, '$1');
			}),
		};
		console.log(JSON.stringify(extractedData));
		//            wikiApi.echo('Exited');
		//wikiApi.die();
	});
});
wikiApi.run();