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
		global.atoz = mod.exports;
	}
})(this, function () {
	/**
  * @file Javascript handler for A-to-Z lists
  *
  * @author Gerkin
  * @copyright 2016 GerkinDevelopment
  * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
  * @package ithoughts-tooltip-glossary
  *
  * @version 2.7.0
  */

	'use strict';

	(function (ithoughts) {
		var lastPos,
		    $ = ithoughts.$,
		    $w = ithoughts.$w,
		    pleaseSelect = $('.ithoughts_tt_gl-please-select'),
		    clickable = $('.itg-atoz-clickable');

		function setShow($parent, alpha) {
			var fct1k, fct2k;
			if (alpha) {
				fct1k = 'removeClass';
				fct2k = 'addClass';
			} else {
				fct1k = 'addClass';
				fct2k = 'removeClass';
			}
			$('.itg-atoz-items')[fct1k]('itg-atoz-items-on')[fct2k]('itg-atoz-items-off');
			$('.ithoughts_tt_gl-please-select')[alpha ? 'hide' : 'show']();
			if (alpha) {
				$('.itg-atoz-items-' + alpha).removeClass('itg-atoz-items-off').addClass('itg-atoz-items-on');
			}
		}
		function setCurrentTab(alpha) {
			pleaseSelect.hide();
			clickable.filter(function filterAlphaTab() {
				return $(this).data('alpha') === alpha;
			}).click();
		}
		ithoughts.$d.ready(function onDocumentReady() {
			var preventHashChange = false;
			// Handle clicking
			$('.itg-atoz-clickable').click(function onClickTab() {
				// Keep track of the scroll
				lastPos = $w.scrollTop();
				$(this).removeClass('itg-atoz-menu-off').addClass('itg-atoz-menu-on');
				$('.itg-atoz-clickable').removeClass('itg-atoz-menu-on').addClass('itg-atoz-menu-off');
				var alpha = $(this).data('alpha');
				preventHashChange = true;
				location.hash = alpha;

				setShow($(this).parent().parent(), alpha);
			});

			// Manual hash change - trigger click
			$w.bind('hashchange', function onHashChange() {
				if (preventHashChange) {
					preventHashChange = false;
				} else {
					var alpha = location.hash.replace('#', '');
					$w.scrollTop(lastPos);
					location.hash = alpha;
					setCurrentTab(alpha);
				}
			});

			// Page load hash management:
			//  - Look for first available if none specified
			//  - Trigger click if exists
			var myLocation = document.location.toString(),
			    myAlpha = '';
			if (myLocation.match('#')) {
				myAlpha = myLocation.split('#')[1];
			}
			if (!myAlpha.length) {
				$('.itg-atoz-items').removeClass('itg-atoz-items-on').addClass('itg-atoz-items-off');
				clickable.removeClass('itg-atoz-menu-on').addClass('itg-atoz-menu-off');
				$('.ithoughts_tt_gl-please-select').show();
			} else {
				setCurrentTab(myAlpha);
			}
		});
	})(ithoughtsCore);
});


},{}]},{},[1]);
