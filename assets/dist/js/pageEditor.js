(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define([], factory);
	} else if (typeof exports !== "undefined") {
		factory();
	} else {
		var mod = {
			exports: {}
		};
		factory();
		global.pageEditor = mod.exports;
	}
})(this, function () {
	'use strict';

	var ithoughts = iThoughts.v5;
	var itg = iThoughtsTooltipGlossary;

	var $ = ithoughts.$;


	itg.indexPageEditor = function () {
		itg.info('Started index page editor');

		var $template = $('#itg-index-page');
		var modalApi = itg.modalFromTemplate($template);
		// Wait for tooltip initialization
		ithoughts.waitFor(modalApi.elements, 'content', function () {
			var $form = $(modalApi.elements.content).find('form');
			$form.simpleAjaxForm({
				callback: function callback() {
					console.log('CB', arguments);
				},
				error: function error(_error) {
					itg.error('Error during ajax post for page creation:', _error);
					itg.growl('Error', 'Error during page creation: ' + _error.statusText, false);
				}
			});
		});
	};
});


},{}]},{},[1]);
