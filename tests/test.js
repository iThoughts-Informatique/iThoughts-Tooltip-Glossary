/**
 * @file Headless main testfile for iThoughts Tooltip Glossary
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://tldrlegal.com/license/mit-license MIT
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

var casper = require('casper').create({
    clientScripts:  [],
    pageSettings: {
        loadImages:  true,        // The WebPage instance used by Casper will
        loadPlugins: true         // use these settings
    },
    logLevel: "debug",              // Only "info" level messages will be logged
    verbose: true,                 // log messages will be printed out to the console

    exitOnError: false,
    onError: function(){
        console.log(arguments.toString());
    }
});

// N/A on slimerjs
var child_process = require("child_process");

var utils = require('utils');
var beforeTestPluginStatus,
    pluginsAdminUrl,
    menuPageSelector;

function QSCount(selector){
    utils.dump("Searching for " + selector);
    var infos = casper.getElementsInfo(selector);
    console.log(JSON.stringify(infos));
    console.log(count + " elements match '" + selector + "'");
    return count;
}

var config = require("config.json");

console.log("Config: " + JSON.stringify(config, null, 4));

menuPageSelector = "#toplevel_page_"+config.plugin.slug;

casper.start(config.test_site.site_url + "/wp-admin", function() {
    this.fill("#loginform", {
        log: config.test_site.login,
        pwd: config.test_site.password
    }, true);
}).then(checkPlugin);

function checkPlugin(){
    console.log("Inspecting menu page " + menuPageSelector)
    var has_iThoughts_tt_gl = this.exists(menuPageSelector);
    if(has_iThoughts_tt_gl){
        beforeTestPluginStatus = true;
        console.log(config.plugin.name + " is ENABLED");
    } else {
        beforeTestPluginStatus = false;
        console.log(config.plugin.name + " is DISABLED");
        pluginsAdminUrl = this.evaluate(function(){
            return __utils__.findOne("#menu-plugins > a").href;
        });
        console.log("Admin plugins is at " + pluginsAdminUrl);
        this.open(pluginsAdminUrl).then(function(){
            var activationSelector = '[data-slug="'+config.plugin.slug+'"] .activate a';
            console.log("Plugin activation link selector: " + activationSelector);
            if(this.exists(activationSelector)){
                this.click(activationSelector);
            } else {
                console.error("UNABLE TO ACTIVATE PLUGIN! Maybe it is not installed?");
                casper.die("Error: plugin is not activable");
            }
        });
    }
    this.then(doTest);

    if(beforeTestPluginStatus == false){
        this.open(pluginsAdminUrl).then(function(){
            var deactivationSelector = '[data-slug="'+config.plugin.slug+'"] .deactivate a';
            console.log("Plugin deactivation link selector: " + deactivationSelector);
            if(this.exists(deactivationSelector)){
                this.click(deactivationSelector);
            } else {
                console.error("UNABLE TO DEACTIVATE PLUGIN!");
                casper.die("Error: plugin is not deactivable");
            }
        });
    }
}

function loadRandomWikipedia(callback){
    var wikiApi = require('casper').create({
        clientScripts:  [],
        pageSettings: {
            loadImages:  true,        // The WebPage instance used by Casper will
            loadPlugins: true         // use these settings
        },
        logLevel: "debug",              // Only "info" level messages will be logged
        verbose: true,                 // log messages will be printed out to the console

        exitOnError: false,
        onError: function(){
            console.log(arguments.toString());
        }
    });
    wikiApi.start("https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=revisions|images&rvprop=content&grnlimit=1", function(){
        var journalJson = JSON.parse(this.getPageContent());
        var wikiArticle = "https://en.wikipedia.org/?curid=" + Object.keys(journalJson.query.pages)[0];
        this.thenOpen(wikiArticle).then(function(){
            var extractedData = {
                title: this.getElementInfo("#firstHeading").text,
                content: this.evaluate(function(){
                    var contentSelector = "#mw-content-text";

                    // Purge useless content
                    $(".navbox, noscript, script, #contentSub, #jump-to-nav", contentSelector).remove();

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
                            if(attrName == "href"){
                                var attrValue = element.getAttribute(attrName);
                                if(attrValue[0] === "/"){
                                    element.setAttribute(attrName, "https://en.wikipedia.org" + attrValue);
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
                })
            };
            wikiApi.echo("Successfully retrieved article infos");
            wikiApi.clear();
            wikiApi.page.close();
            wikiApi.wait(999999999);
            delete wikiApi;
//            wikiApi.echo("Exited");
            //wikiApi.die();
            return callback(extractedData);
        });
    });
    wikiApi.run();
}

function doTest(){
    this.then(testTerms);
}

function testTerms(){
    console.log("Testing terms");
    var termsListUrl = this.evaluate(function(menuPageSelector){
        return __utils__.findOne(menuPageSelector + ' a[href^="edit.php"]').href;
    }, menuPageSelector);
    console.log("Terms list url: " + termsListUrl);
    this.open(termsListUrl).then(testTermCreate);

    function testTermCreate(){
        // Load random Wikipedia page
        var articleContent = false;
        loadRandomWikipedia(function(out){
            console.log("Finished load random wikipedia")
            articleContent = out;
        });

        // Prepare to load term editor
        this.thenClick('h1 a').then(function(){
            this.waitFor(function(){
                console.log("Doing test returns " + (!!articleContent ? "true" : "false"));
                return !!articleContent;
            }, function then(){
                console.log("Then");
                console.log(JSON.stringify(articleContent));
                // Set Tinymce content
                this.thenEvaluate(function(content){
                    tinyMCE.activeEditor.setContent(content);
                }, articleContent.content).wait(10000);
                // Set post title
                this.then(function(){
                    this.fill('#post', {
                        post_title: articleContent.title
                    }, false);
                }).wait(10000);
            }, function timeout() { // step to execute if check has failed
                console.log("Timeout");
                this.echo("Can't load Wikipedia article").exit();
            });
        });
    }
}

console.log("Initial parsing OK, go run");

casper.run();