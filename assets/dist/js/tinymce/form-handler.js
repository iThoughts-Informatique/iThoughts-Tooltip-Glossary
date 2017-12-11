"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
			}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, l, l.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
		s(r[o]);
	}return s;
})({ 1: [function (require, module, exports) {
		/**
   * @file Client-side scripts for handling tooltip creation wizzard in Wordpress TinyMCE
   *
   * @author Gerkin
   * @copyright 2016 GerkinDevelopment
   * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
   * @package ithoughts-tooltip-glossary
   *
   * @version 2.7.0
   */

		'use strict';

		/*global tinymce:false, iThoughtsTooltipGlossaryEditor: false */

		require('regenerator-runtime/runtime');

		var utils = require('./tinymce-utils');
		var filters = require('./tinymce-filters');

		var ithoughts = iThoughts.v5;
		var itg = iThoughtsTooltipGlossary;
		var itge = iThoughtsTooltipGlossaryEditor;

		var $ = ithoughts.$,
		    $d = ithoughts.$d,
		    $w = ithoughts.$w;


		$d.ready(function () {
			var formType = '';
			// Depending on the ID present, we can deduce if we are in TIP or LIST creation/edition mode.
			if (1 === $('#ithoughts_tt_gl-tooltip-form-container').length) {
				formType = 'TIP';
			} else if (1 === $('#ithoughts_tt_gl-list-form-container').length) {
				formType = 'LIST';
			} else {
				itg.error('Does not contains a tooltip form nor a list form, exit');
				return;
			}
			itg.info("Opening a form for " + formType);

			// ##### `initTab`: Set up a tab switcher element
			/**
   	 * @function initTab
   	 * @description Set up a tab switcher element
   	 * @author Gerkin
   	 * @param {jQuery} jqobj jQuery selector containing the tabs triggers
   	 * @param {Function} [cb] Function to execute with cb( newIndex )
   	 * @returns {undefined}
   	 */
			var initTab = function initTab($tabs, cb) {
				$tabs.click(function onClick() {
					var $this = $(this);
					// First, clean the `active` class on all siblings, then set it only on event emitter
					$this.parent().find('.active').removeClass('active');
					$this.addClass('active');

					// Then, we check the index of the clicked element (`this`) in the parent, and we set active the tab with the same index
					var index = $this.index();
					$this.parent().parent().find(' > .active').removeClass('active');
					$($this.parent().parent().children()[index + 1]).addClass('active');

					// Then we try to call the callback (if set)
					cb && cb(index);
				});
				// Self-set
				$tabs.filter('.active').click();
			};

			// ## Tip form
			if ('TIP' === formType) {
				(function initTipForm() {
					// Define the container for tooltip options in parent scope, so it can be used accross several events
					var tooltipOpts;
					// Initialize the tab switcher between mode Glossary, Tooltip & Mediatip
					initTab($('#ithoughts_tt_gl-tooltip-form .tabs li'), function (index) {
						// Only Glossary tooltip (tab @ index 0) disable the custom link editor
						$('#ithoughts_tt_gl_link').prop('disabled', 0 === index);
					});
					// Initialize the tab switcher of advanced options
					initTab($('#ithoughts_tt_gl-tooltip-form-options .tabs li'));
					// Mode switcher for mediatips.  Hide all except the selected mode
					$('.modeswitcher').on('click keyup change', function switchMode() {
						var id = this.id;
						$("[data-" + id + "]:not([data-" + id + "=\"mediatip-" + this.value + "-type\"])").hide();
						$("[data-" + id + "~=\"mediatip-" + this.value + "-type\"]").show();
					}).keyup();

					// ##### `removeEditor`: Clean an editor
					/**
     	 * @function removeEditor
     	 * @description Clean an editor
     	 * @author gerkin
     	 * @param   {String} editorId Id of the editor to delete
     	 * @returns {undefined}
     	 */
					function removeEditor(editorId) {
						// Sometimes (depending on the browser AFAIK), TinyMCE fails to execute the command to remove an editor. We then have to clean its data manually
						try {
							tinymce.EditorManager.execCommand('mceRemoveEditor', true, editorId);
						} catch (e) {
							iThoughtsTooltipGlossary.warn('Force cleaning needed: ', e);
							tinymce.EditorManager.editors = tinymce.EditorManager.editors.filter(function findEditor(editor) {
								return editor.id !== editorId;
							});
						}
					}
					// ##### `closeForm`: Clean the form, then call the callback function
					/**
     	 * @function closeForm
     	 * @description Clean the form, then call the callback function
     	 * @author gerkin
     	 * @param {Object} data Data of the tooltip
     	 * @returns {undefined}
     	 */
					function closeForm(data) {
						setTimeout(function waitRemoveEditor() {
							removeEditor('ithoughts_tt_gl-tooltip-content');
						}, 500);
						itge.finishTipTinymce(data);
						delete itge.finishTipTinymce;
					}

					// ### TinyMCE editor for Tooltips
					(function initSubEditor($editors) {
						// Initialize the TinyMCE editor inside the Tooltip tab
						$editors.each(function findNewEditor(index, editor) {
							// Find a free id. If our editor does not have an ID, we have to generate one
							while (null == editor.getAttribute('id')) {
								var newId = "editor" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
								// If this editor ID is free, then set it. Else, loop using the parent `while`
								if (0 === $(newId).length) {
									editor.setAttribute('id', newId);
								}
							}
							var editorId = editor.getAttribute('id');
							// Save the current text in the not-yet-TinyMCE editor. It will be used later to restore the content
							var text = editor.value;
							// Do effective call to tinymce & init the editor
							tinymce.init({
								selector: "#" + editorId,
								menubar: false,
								external_plugins: {
									code: itge.base_tinymce + "/code/plugin.min.js",
									wordcount: itge.base_tinymce + "/wordcount/plugin.min.js"
								},
								plugins: 'wplink',
								toolbar: ['styleselect | bold italic underline link | bullist numlist | alignleft aligncenter alignright alignjustify | code'],
								min_height: 70,
								height: 70,
								resize: false
							});
							// **Restore the content**
							var intervalContent = setInterval(function waitSubTinyMCELoaded() {
								var subeditor = tinymce.get(editorId);
								// Check if the subeditor is fully initialized. If that's the case, set its content & clear interval
								if (subeditor && subeditor.getDoc() && subeditor.getBody()) {
									itge.log('Initing subeditor with content ', JSON.stringify(text));
									clearInterval(intervalContent);
									subeditor.setContent(text.replace(/&/g, '&amp;'));
								}
							}, 50);
						});
					})($('#ithoughts_tt_gl-tooltip-form-container .tinymce'));

					// ### Media library for Mediatips
					$('#ithoughts_tt_gl_select_image').click(function selectImage() {
						// On click on `#ithoughts_tt_gl_select_image` (the button in mediatip), use the WP media API to get a media
						// > This code was copy/pasted. It may be improveable
						var mediaFrame = wp.media({
							frame: 'post',
							state: 'insert',
							library: {
								type: ['audio', 'video', 'image']
							},
							multiple: false
						});

						// **On validation of media library**
						mediaFrame.on('insert', function insertImage() {
							// Get the infos of the first selected element
							var json = mediaFrame.state().get('selection').first();
							// If nothing selected, return
							if (null == json) {
								return;
							}
							json = json.toJSON();
							// Encode datas in the JSON input
							$('#image-box-data').val(JSON.stringify({
								url: json.url,
								id: json.id,
								link: json.link
							}));
							// Display selected image
							$('#image-box').html("<img src=\"" + json.url + "\"/>");
							$('#mediatip_caption').val(json.caption);
							$('#ithoughts_tt_gl_link').val(json.link);
						});

						// Open the media library
						mediaFrame.open();
					});

					// ### Autocomplete for Glossaries
					(function initAutoComplete() {
						var input = $('#glossary_term'),
						    completerHolder = $('#glossary_term_completer'),
						    completerHolderContainer = $('.glossary_term_completer_container'),
						    searchedString = '',
						    request = null;

						// ##### `losefocustest`: Check if the completer holder or the input has the focus
						function losefocustest() {
							// The timeout is required to let some time to the browser to change the focus status of the elements
							setTimeout(function waitedForFocus() {
								if (!completerHolder.find('*:focus').length && !input.is(':focus')) {
									// Hide the `completerHolder`
									completerHolderContainer.addClass('hidden');
								}
							}, 100);
						}
						// ##### `searchMatchingRes`: Does all the completion work from retrieved term catalog
						function searchMatchingRes() {
							// First, we filter terms contained in the global hash `iThoughtsTooltipGlossaryEditor`. Those terms will be splitted in 2 categories:
							// * those which **starts** with the searched string
							// * those which **contains** the searched string
							var startsWith = [];
							var contains = [];
							itge.terms.map(function mapTerms(element) {
								var indx = element.title.toLowerCase().indexOf(searchedString);
								if (-1 === indx) {
									indx = element.slug.toLowerCase().indexOf(searchedString);
								}
								if (-1 === indx) {
									return;
								} else if (0 === indx) {
									startsWith.push(element);
									return;
								} else {
									contains.push(element);
								}
							});
							// Then, concat both arrays to have the terms starting with the search before those who just contains the search
							var searchResults = startsWith.concat(contains).filter(function unique(item, pos, self) {
								return self.indexOf(item) === pos;
							});
							// Clean the search result container, then re-fill it with items
							completerHolder.empty();
							var length = searchResults.length;
							if (length > 0) {
								for (var i = 0; i < length; i++) {
									var item = searchResults[i];
									// If WPML is installed, `item` should contain the property `thislang`. If `thislang` is set to false, then the term is in another language than the current one, and we display it with a particular class
									if (typeof item.thislang != 'undefined' && false === item.thislang) {
										completerHolder.append($.parseHTML("<div tabindex=\"0\" class=\"option foreign-language\" data-id=\"" + item.id + "\" data-excerpt=\"" + item.content + "\"><p><b>" + item.title + "</b><br><em>" + item.slug + "</em></p></div>"));
									} else {
										completerHolder.append($.parseHTML("<div tabindex=\"0\" class=\"option\" data-id=\"" + item.id + "\" data-excerpt=\"" + item.content + "\"><p><b>" + item.title + "</b><br><em>" + item.slug + "</em></p></div>"));
									}
								}
							} else {
								completerHolder.append($.parseHTML('<p style="text-align:center"><em>No results</em><p>'));
							}
							// Once we have filled the search result container, display it and recalculate position
							completerHolderContainer.removeClass('hidden');
							setTimeout(resizeWindow, 25);
							// On each result, make them selectable
							completerHolder.find('.option').on('click', function selectCompletion(e) {
								// Set inputs with values provided by the option, then hide the completer holder
								$('[name="glossary_term_id"]').val(e.currentTarget.getAttribute('data-id'));
								input.val($(e.currentTarget).find('p > b').text());
								completerHolderContainer.addClass('hidden');
							});
						}
						// ##### `resizeWindow`: Set styles of the completer holder
						function resizeWindow() {
							// The `completerHolder` element has to be positionned by JS. In fact, to overflow outside from the modal, it must not be a descendent of the modal. Thus, we can't position it via CSS
							var top = completerHolder.offset().top - $w.scrollTop();
							var bottom = $w.height();
							var height = bottom - top;
							completerHolderContainer.css({
								maxHeight: height
							});
						}
						$w.resize(resizeWindow);

						// **Execute the search action**
						input.on('keyup focusin', function focusin() {
							// First, check if we don't have any request currently running. If we have one, we have to `abort()` it
							if (request) {
								request.abort();
							}
							// Then, compose the search string by removing accents or special characters
							searchedString = itge.removeAccents($(this).val().toLowerCase());
							// Filter with already retrieved items. This is used to react before the real request is sent, then resulsq will be replaced with new retrieved ones
							searchMatchingRes();
							// Do the request to get elements
							var $nonce = $('#ithoughts_tt_gl-tooltip-form-container [name="_wpnonce"]');
							request = $.ajax({
								url: itge.admin_ajax,
								method: 'POST',
								dataType: 'json',
								data: {
									action: 'ithoughts_tt_gl_get_terms_list',
									search: searchedString,
									_ajax_nonce: $nonce.val()
								},
								complete: function complete(res) {
									var response = res.responseJSON;
									if ('undefined' == typeof response || !response.success) {
										return;
									}
									$nonce.val(response.data.nonce_refresh);
									// Check if the response contains a different search string as the current one. It serves as an *outdated filter*
									if (response.data.searched !== searchedString) {
										iThoughtsTooltipGlossary.info('Outdated response');
										return;
									}
									// Store terms, then refresh completions
									itge.terms = response.data.terms;
									searchMatchingRes();
								}
							});
						}).on('focusout', losefocustest).on('keyup', function keyup() {
							this.removeAttribute('data-term-id');
						});
					})();

					// ### Set up Advanced Configuration
					(function initAdvancedConfiguration() {
						var $opts = $('#ithoughts_tt_gl-tooltip-form-options'),
						    $tooltip = $('#ithoughts_tt_gl-tooltip-form'),
						    skip = {
							span: false,
							link: false
						},
						    $form = $('#ithoughts_tt_gl-tooltip-form-options form');

						// ##### `getOptsObject`: Get the advanced configuration object
						/**
      	 * @function getOptsObject
      	 * @author agermain
      	 * @returns {Object} Advanced Opts objects
      	 */
						function getOptsObject() {
							var form = $form[0],
							    formElems = form.elements,
							    tristates = {},
							    valid = true,
							    formFields = formElems.length,
							    i = -1,
							    attributes = {},
							    attributesList = $('#attributes-list option').map(function getAttributeValue() {
								return this.value;
							}).toArray(),
							    opts,
							    types = ['span', 'link'];
							// Check the validity in the whole form
							while (++i < formFields && valid) {
								var validity = formElems[i].validity;
								valid &= validity.valid;
								if (!validity.valid) {
									formElems[i].focus();
								}
							}

							// Get tristate values to override default booleans
							$form.find('.ithoughts-tristate').each(function getTristateValue() {
								$.extend(true, tristates, $(this).serializeInputsObject({
									'-1': false,
									0: null,
									1: true
								}[this.dataset.state]));
							});
							// Once we have retrieved all tristate states, we just have to inject it in the form values
							opts = $.extend(true, $form.serializeObject(), tristates);

							// Get the key-value attributes on both link & span
							for (i = 0; i < 2; i++) {
								var type = types[i];
								// Create the store
								attributes[type] = {};
								// Iterate on each category to get the value
								for (var arrK = opts["attributes-" + type + "-key"] || [], arrV = opts["attributes-" + type + "-value"] || [], j = 0, J = Math.min(arrK.length, arrV.length); j < J; j++) {
									if (arrK[j] && arrV[j]) {
										// If the key is not in the list of standard DOM attributes, we have to prefix it
										var prefix = attributesList.indexOf(arrK[j]) > -1 ? '' : 'data-';
										attributes[type][prefix + arrK[j]] = arrV[j];
									}
								}
								// Clean the options object afterwars
								delete opts["attributes-" + type + "-value"];
								delete opts["attributes-" + type + "-key"];
							}
							// Add the attributes in the options object, then return it;
							opts['attributes'] = attributes;
							return opts;
						}
						// ##### `filterPrototypeInputs`: Used in filter to ignore if the element is a prototype. Used in key-value handlings
						/**
      	 * @function filterPrototypeInputs
      	 * @description Filtering function for prototypes. Used in key-value handlings
      	 * @author gerkin
      	 * @returns {Boolean} True if this element is not a prototype
      	 */
						function filterPrototypeInputs() {
							return 0 === $(this).closest('.ithoughts-prototype').length;
						}
						// ##### `checkRemoveAttr`: Remove unused key/value pairs from the key/value editor
						/**
      	 * @function checkRemoveAttr
      	 * @description Remove unused key/value pairs from the key/value editor
      	 * @author gerkin
      	 * @returns {undefined}
      	 */
						function checkRemoveAttr() {
							// Separate the current event emitter event from other input
							var thisInput = $(this),
							    $container = thisInput.parent().parent(),
							    otherInput = $container.find('input').filter(function filterNotThisInput() {
								return this !== thisInput.get(0);
							});

							// Wait to let some time to the browser
							setTimeout(function ensureRemoveContainer() {
								var type = thisInput.closest('.ithoughts-attrs-container').attr('data-attr-family');
								// Test & clean the `skip` flag if required
								if (skip[type]) {
									skip[type] = false;
									return;
								}
								// Filter values
								thisInput.val(thisInput.val().trim());
								otherInput.val(otherInput.val().trim());

								// If both values are empty & none have the focus, then remove the container
								if (!thisInput.val() && !otherInput.val() && document.activeElement !== thisInput.get(0) && document.activeElement !== otherInput.get(0)) {
									$container.remove();
								}
							}, 100);
						}

						$opts.find('input[type="checkbox"].ithoughts-tristate').attr('data-state', function getTristateValue(i, attrVal) {
							return ((attrVal || 0) - 1) % 3 + 2;
						}).change(function onTristateChange() {
							// Do the state rotation
							var s = $(this),
							    ts = ((s.attr('data-state') || 0) - 2) % 3 + 1;
							s.attr('data-state', ts);
							this.checked = 1 === ts;
							this.indeterminate = 0 === ts;
						}).change();
						// Bind GUI to show, close or save options
						$('#ithoughts_tt_gl-tinymce-advanced_options').click(function showAttributesWindow() {
							$opts.show();
							$tooltip.hide();
						});
						$('#ithoughts_tt_gl-tinymce-close-attrs').click(function closeDiscardAttributesWindow() {
							$opts.hide();
							$tooltip.show();
						});
						$('#ithoughts_tt_gl-tinymce-validate-attrs').click(function closeAcceptAttributesWindow() {
							tooltipOpts = getOptsObject();
							$opts.hide();
							$tooltip.show();
						});
						// Bind events for the option that keep the tip opened for some times before closing
						$('#qtip-keep-open').change(function onQtipKeepOpenChange() {
							var modeInput = $('#qtiptrigger'),
							    textInput = $('#qtiptriggerText'),
							    mtInput = $([modeInput, textInput]),
							    oldValue;
							// This option force the opening event to be `click`
							return function lockQtipTrigger() {
								modeInput.prop('disabled', this.checked);
								textInput.prop('disabled', !this.checked);
								mtInput.val(this.checked ? 'click' : oldValue);
								if (this.checked) {
									oldValue = modeInput.value;
								} else {
									modeInput.disabled = !(textInput.disabled = true);
								}
							};
						}());
						// Bind Position selects
						$('[name^="position[my]"]').change(function onPositionMyChange() {
							var base = '#position[my][',
							    inputV = $(base + "1]"),
							    inputH = $(base + "2]"),
							    inputsHV = $(inputH.get(0), inputV.get(0)),
							    inputS = $(base + "invert]");
							return function changePositionMy() {
								inputsHV.prop('required', inputV.val() || inputH.val() || inputS.prop('checked'));
							};
						}());
						$('[name^="position[at]"]').change(function onPositionAtChange() {
							var base = '#position[at][',
							    inputV = $(base + "1]"),
							    inputH = $(base + "2]"),
							    inputsHV = $(inputH.get(0), inputV.get(0));
							return function changePositionMy() {
								inputsHV.prop('required', inputV.val() || inputH.val());
							};
						}());
						// Initialize key/value pairs
						$('.kv-pair-link-attrs-add,.kv-pair-span-attrs-add').bind('mouseup touchend', function onKvPairAdd() {
							var $container = $(this).parent().find('.ithoughts-attrs-container'),
							    $invalidInputs = $container.find('input:invalid').filter(filterPrototypeInputs),
							    type = $container.attr('data-attr-family');
							skip[type] = true;

							// Check if every empty pairs are deleted
							if ($invalidInputs.length > 0) {
								skip[type] = true;
								$invalidInputs.eq(0).focus();
								checkRemoveAttr.call($invalidInputs.get(0));
								skip[type] = false;
								return;
							}

							var $prototype = $container.find('.ithoughts-prototype'),
							    $clone = $prototype.clone().removeClass('ithoughts-prototype'),
							    newIdParts = ["attributes-" + type + "-", "-" + new Date().getTime()];
							// Set the id/for attribute in the template
							$clone.find('.dynamicId').each(function setForOrId() {
								var $this = $(this),
								    newId = newIdParts[0] + ($this.hasClass('dynamicId-key') ? 'key' : 'value') + newIdParts[1];
								$this.attr('LABEL' === this.tagName ? 'for' : 'id', newId);
							});
							$container.append($clone);
							// Enable inputs, then focus the first one
							$clone.find('input').prop('required', true).prop('disabled', false).blur(checkRemoveAttr).eq(0).focus();
							checkRemoveAttr.call($clone.find('input').get(0));
						});
						$('.ithoughts-attrs-container input').blur(checkRemoveAttr);
						tooltipOpts = getOptsObject();
					})();

					// This event listener generate a different tag with a different base url depending on the source of the video.
					$('#mediatip_url_video_link').bind('keyup mouseup change click focusin focusout', function videoUrlChanged() {
						var videodata = null,
						    value = this.value,
						    formatType;
						// Configure sources. See below for usage of those config objects
						var formats = {
							youtube: {
								regex: /^(?:https?:\/\/(?:youtu\.be\/|\w*\.youtube\.\w{2,3}\/watch\?v=)|<iframe .*?src="https?:\/\/\w*\.youtube\.\w{2,3}\/embed\/)([a-zA-Z0-9]*).*$/,
								embed: '<iframe width="512" height="288" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>',
								video: 'https://www.youtube.com/watch?v=$1'
							},
							dailymotion: {
								regex: /^(?:https?:\/\/(?:dai\.ly\/|\w*\.dailymotion\.\w{2,3}\/video\/)|<iframe .*?src=".*?\w*\.dailymotion\.\w{2,3}\/embed\/video\/)([a-zA-Z0-9]*).*/,
								embed: '<iframe width="512" height="288" src="https://www.dailymotion.com/embed/video/$1" frameborder="0" allowfullscreen></iframe>',
								video: 'https://www.dailymotion.com/video/$1'
							},
							direct: {
								regex: /^(.*\.mp4)(\?.*)?$/,
								embed: '<video width="512" height="288" controls="controls"><source src="$1" type="video/mp4" /></video>',
								video: '$1'
							}
						};

						// Iterate on each configured type and try to match with one configured source
						for (var type in formats) {
							formatType = formats[type];
							// If the regex match, then we have found our source. We can then generate the embed tag & the video url
							if (value.match(formatType.regex)) {
								videodata = {
									embed: value.replace(formatType.regex, formatType.embed),
									video: value.replace(formatType.regex, formatType.video)
								};
								break;
							}
						}
						// Set the form inputs with new values. Note that we refresh also the video url input to ensure a consistent formatting
						if (videodata) {
							$('#mediatip_url_video_embed').val(videodata.embed);
							$(this).val(videodata.video);
						}
					}).keyup();

					// On click on the validate button, extract all required data from the form
					$('#ithoughts_tt_gl-tinymce-validate').click(function validate() {
						var data = {
							type: ['glossary', 'tooltip', 'mediatip'][$('.tabs li.active').index()],
							text: $('#ithoughts_tt_gl_text').val(),
							link: $('#ithoughts_tt_gl_link').val(),
							opts: tooltipOpts
						};
						itg.log('Before per-type form data handling:', data);
						// Depending on the target type of the tooltip, we have to retrieve specific data
						switch (data.type) {
							case 'glossary':
								{
									data = $.extend(data, {
										glossary_id: $('[name="glossary_term_id"]').val(),
										// `disable_auto_translation` is related to WPML
										disable_auto_translation: $('[name="glossary_disable_auto_translation"]').is(':checked')
									});
								}break;

							case 'tooltip':
								{
									data = $.extend(data, {
										tooltip_content: tinymce.EditorManager.get('ithoughts_tt_gl-tooltip-content').getContent() || $('#ithoughts_tt_gl-tooltip-content').val()
									});
								}break;

							case 'mediatip':
								{
									data = $.extend(data, {
										mediatip_type: $('#mediatip_type').val()
									});
									// Mediatips has their own switch, depending on the type of media
									switch (data.mediatip_type) {
										case 'localimage':
											{
												data = $.extend(data, {
													mediatip_content: $('#image-box-data').val(),
													mediatip_caption: $('#mediatip_caption').val()
												});
											}break;

										case 'webimage':
											{
												data = $.extend(data, {
													mediatip_content: $('#mediatip_url_image').val(),
													mediatip_caption: $('#mediatip_caption').val()
												});
											}break;

										case 'webvideo':
											{
												data = $.extend(data, {
													mediatip_content: $('#mediatip_url_video_embed').val(),
													mediatip_link: $('#mediatip_url_video_link').val()
												});
											}break;
									}
								}break;
						}
						closeForm(data);
					});
					$('.ithoughts_tt_gl-tinymce-discard').click(closeForm.bind(null, null));
				})();
				// ## List form
			} else if ('LIST' === formType) {
				(function initListForm() {
					initTab($('.tabs li'));

					(function initGroupsPicker() {
						var $ids = $('#groups'),
						    $text = $('#groups_text'),
						    $groupsPicker = $('.groupspicker'),
						    $catchEvent = $([$groupsPicker.get(0), $text.parent().get(0)]),
						    $checkboxes = $('.groupspicker .group-select input');
						$text.focusin(function () {
							$groupsPicker.toggleClass('hidden');

							function catchEvent(e) {
								e.stopImmediatePropagation();
							}
							function hide() {
								$groupsPicker.toggleClass('hidden');
								$catchEvent.off('click', catchEvent);
							}
							$catchEvent.click(catchEvent);
							$w.one('click', hide);
						});
						// Enable glossary group checkboxes (for the group picker)
						$checkboxes.change(function onGroupCheckboxChanged() {
							var $checked = $checkboxes.filter(':checked'),
							    texts = [],
							    ids = [];

							$checked.each(function checkedAppendToArray() {
								texts.push($(this).parent().find('.group-title').text());
								ids.push($(this).val());
							});
							$ids.val(ids.join(','));
							$text.val(texts.join(', '));
						}).change();
					})();

					$('#ithoughts_tt_gl-tinymce-validate').click(function onClickValidate() {
						// Compose basic infos from raw datas
						var data = {
							type: ['atoz', 'list'][$('.tabs li.active').index()],
							alpha: $('#letters').val(),
							group: $('#groups').val(),
							desc: $('#description_mode').val()
						};
						// Remove useless fields
						if (!data.alpha) {
							delete data.alpha;
						}
						if (!data.group) {
							delete data.group;
						}

						// Switch for particular lists (Here, atoz isn't required as it does not have any additionnal parameters. This list may be extended in the future)
						switch (data.type) {
							case 'list':
								{
									$.extend(data, {
										cols: $('#columns_count').val()
									});
								}break;
						}
						// Finally, return the data
						itge.finishListTinymce(data);
					});
					$('.ithoughts_tt_gl-tinymce-discard').click(function onClickDiscard() {
						itge.finishListTinymce();
					});
				})();
			}
		});
	}, { "./tinymce-filters": 2, "./tinymce-utils": 4, "regenerator-runtime/runtime": 5 }], 2: [function (require, module, exports) {
		'use strict';

		var OptArray = require('./tinymce-optarray');
		var utils = require('./tinymce-utils');

		var attrsMatcher = /(data-)?([\w\d\-]+?)="(.+?)"/g;

		var attributesToOpts = function attributesToOpts(attrs, inner) {
			var attrMatched = void 0;
			var handleOpt = maybePrefixOpt(attrs);
			do {
				attrMatched = attrsMatcher.exec(inner);
				if (attrMatched) {
					handleOpt(attrMatched);
				}
			} while (attrMatched);
		};

		var maybePrefixOpt = function maybePrefixOpt(opt) {
			return function (match) {
				var key = utils.maybePrefixAttribute(match[1] + match[2]);
				var value = match[3];
				if (key === 'data-type') {
					return;
				}
				opt.addOpt(key, value);
			};
		};

		module.exports = {
			replace: {
				glossary: function glossary(content) {
					// For [glossary]
					return content.replace(/\[(?:itg-)?(glossary|tooltip|mediatip)(?!_)(.*?)\](.*?)\[\/(?:itg-)?(glossary|tooltip|mediatip)\]/g, function (all, tag, inner, text) {
						var attrs = new OptArray();
						attrs.addOpt('data-type', "ithoughts-tooltip-glossary-" + {
							glossary: 'term',
							tooltip: 'tooltip',
							mediatip: 'mediatip'
						}[tag]);
						attributesToOpts(attrs, inner);
						return "<a " + attrs.toString() + ">" + text + "</a>";
					});
				},
				list: function list(content) {
					// For [glossary_(term_list|atoz)]
					return content.replace(/\[(?:glossary_|itg-)(term_?list|atoz)(?:\s+(.*?))\/\]/g, function (all, tag, inner) {
						var attrs = new OptArray();
						tag = {
							termlist: 'termlist',
							term_list: 'termlist',
							atoz: 'atoz'
						}[tag];
						attrs.addOpt('data-type', "ithoughts-tooltip-glossary-" + tag);
						attributesToOpts(attrs, inner);
						return "<span " + attrs.toString() + ">Glossary " + ('termlist' === tag ? 'List' : 'A-to-Z') + "</span>";
					});
				}
			},
			restore: {
				glossary: function glossary(content) {
					// For [glossary]
					return content.replace(/<a\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term|tooltip|mediatip)")(.*?)>(.*?)<\/a>/g, function (all, type, inner, text) {
						var attrs = new OptArray();
						var tag = "itg-" + {
							term: 'glossary',
							tooltip: 'tooltip',
							mediatip: 'mediatip'
						}[type];
						attributesToOpts(attrs, inner);
						return "[" + tag + " " + attrs.toString() + "]" + text + "[/" + tag + "]";
					});
				},
				list: function list(content) {
					// For [glossary_(term_list|atoz)]
					return content.replace(/<span\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term_list|atoz)")(.*?)>.*?<\/span>/g, function (all, type, inner) {
						var attrs = new OptArray();
						var tag = "itg-" + type;
						attributesToOpts(attrs, inner);
						return "[" + tag + " " + attrs.toString() + "/]";
					});
				}
			}
		};
	}, { "./tinymce-optarray": 3, "./tinymce-utils": 4 }], 3: [function (require, module, exports) {
		'use strict';

		var _iThoughtsTooltipGlos = iThoughtsTooltipGlossary,
		    stripQuotes = _iThoughtsTooltipGlos.stripQuotes;
		var isNA = iThoughts.v5.isNA;

		var OptArray = function () {
			function OptArray() {
				_classCallCheck(this, OptArray);

				this.opts = [];
			}

			_createClass(OptArray, [{
				key: "addOpt",
				value: function addOpt(label, value) {
					var specEncode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

					var resOpt = OptArray.generateAttr(label, value, specEncode);
					if (!isNA(resOpt)) {
						this.opts.push(resOpt);
					}
				}
			}, {
				key: "maybeAddOpt",
				value: function maybeAddOpt(addValue, name, value) {
					if (addValue) {
						this.addOpt(name, value);
					}
				}
			}, {
				key: "toString",
				value: function toString() {
					return this.opts.join(' ');
				}
			}], [{
				key: "generateAttr",
				value: function generateAttr(label, value, specEncode) {
					value = String(value).trim();
					if (!label.match(/^[\w_\-]*$/)) {
						return null;
					}
					return stripQuotes(label.trim(), true) + "=\"" + (!isNA(specEncode) && specEncode ? value.replace(/"/g, '&aquot;').replace(/\n/g, '<br/>') : stripQuotes(value, true)) + "\"";
				}
			}]);

			return OptArray;
		}();

		module.exports = OptArray;
	}, {}], 4: [function (require, module, exports) {
		'use strict';

		var _this = this;

		var removeAccents = require('remove-accents');
		var OptArray = require('./tinymce-optarray');

		var ithoughts = iThoughts.v5;
		var itg = iThoughtsTooltipGlossary;
		var itge = iThoughtsTooltipGlossaryEditor;

		var isNA = ithoughts.isNA;
		var htmlAttrs = ['href'];

		var xhrError = function xhrError(xhr) {
			var editor = itge.editor;
			itg.error('Error while getting TinyMCE form for Tip or List: ', xhr);
			if (403 === xhr.status) {
				var lang = 'ithoughts_tt_gl_tinymce.error.forbidden';
				$($.parseHTML("<p>" + editor.getLang(lang + ".content_1") + "<br/><a href=\"javascript:window.location.href=window.location.href\">" + editor.getLang(lang + ".content_2") + "</a></p>")).dialog({
					title: editor.getLang(lang + ".title"),
					modale: true
				});
			}
		};

		var splitAttr = function splitAttr(attrsStr) {
			var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /[,\.\s]+/;
			return (attrsStr || '').split(separator).map(Function.prototype.call, String.prototype.trim).filter(function (e) {
				return e;
			});
		};

		var extractAttrs = function extractAttrs(node) {
			var ret = {};
			Array.prototype.slice.call(node.attributes, 0).forEach(function (attr) {
				ret[attr.nodeName] = attr.nodeValue;
			});
			return ret;
		};

		var generateTakeAttr = function generateTakeAttr(attrs) {
			// If we received a node instead of an object, extract its attributes
			if (attrs.tagName) {
				attrs = extractAttrs(attrs);
			}
			// Return the picker function
			return function (label) {
				var noDataPrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

				if (!noDataPrefix) {
					label = utils.maybePrefixAttribute(label);
				}
				var val = attrs[label];
				delete attrs[label];
				return val;
			};
		};

		var tristate = function tristate(val) {
			if ('true' === val) {
				return true;
			}
			if ('false' === val) {
				return false;
			}
			return null;
		};

		var sendAjaxQuery = function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(action, data) {
				var nonce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : itge.nonce;
				var loader;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								loader = ithoughts.makeLoader();
								return _context.abrupt("return", new Promise(function (resolve, reject) {
									$.ajax({
										method: 'POST',
										async: true,
										url: itge.admin_ajax,
										//			dataType: 'json',
										data: {
											action: "ithoughts_tt_gl_" + action,
											_wpnonce: nonce,
											data: data
										},
										success: function success(data) {
											loader.remove();
											return resolve(data);
										},
										error: function error(xhr) {
											loader.remove();
											return reject(xhr);
										}
									});
								}));

							case 2:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, _this);
			}));

			return function sendAjaxQuery(_x5, _x6) {
				return _ref.apply(this, arguments);
			};
		}();

		var tipsTypes = ['itg-term', 'itg-tooltip', 'itg-mediatip'];
		var tipsSelector = tipsTypes.map(function (type) {
			return "[data-type=\"" + type + "\"]";
		}).join(',');

		var generateSelObject = function generateSelObject(editor) {
			if (isNA(editor)) {
				var txtarea = $('#content').get(0);
				var sel = {
					html: itge.replaceShortcodes(txtarea.value.substring(txtarea.selectionStart, txtarea.selectionEnd))
				};
				sel.DOM = $.parseHTML(sel.html);
				$.extend(true, sel, {
					start: $(sel.DOM).first().get(0),
					end: $(sel.DOM).last().get(0)
				});
				return sel;
			} else {
				var tinymceSel = editor.selection;
				var _sel = {
					DOM: $(tinymceSel.getNode()).closest(tipsSelector).toArray(),
					html: tinymceSel.getContent({ format: 'html' }),
					start: tinymceSel.getStart(),
					end: tinymceSel.getEnd()
				};
				return _sel;
			}
		};

		var displayInForm = function displayInForm(data) {
			var $newDom = $($.parseHTML(data, true));
			$(document.body).append($newDom.css({
				opacity: 1
			}).animate({
				opacity: 1
			}, 500));
			return $newDom;
		};
		var hideOutForm = function hideOutForm($dom) {
			$dom.animate({
				opacity: 0
			}, 500, function () {
				$dom.remove();
			});
		};

		var editorForms = {
			list: function () {
				var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(selection) {
					var mode, node, values, takeAttr, type, resultDom;
					return regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									itg.info('Selection infos to load LIST: ', selection);
									mode = 'insert_content';
									node = selection.start;
									values = { type: 'atoz', alpha: [], group: [] };

									if (!isNA(selection.start) && selection.start === selection.end) {
										itg.info("Start & End node are the same, operating on a node of type " + node.nodeName);
										if (node && node.nodeName !== '#text') {
											takeAttr = generateTakeAttr(node);
											type = takeAttr('data-type');

											$.extend(values, {
												alpha: splitAttr(takeAttr('data-alpha')),
												group: splitAttr(takeAttr('data-group')),
												desc: takeAttr('data-desc')
											});
											if ('ithoughts-tooltip-glossary-atoz' === type) {
												// Is atoz
												mode = 'load';
												values.type = 'atoz';
											} else if ('ithoughts-tooltip-glossary-term_list' === type) {
												// Is term_list
												mode = 'load';
												values.type = 'list';
												$.extend(values, {
													cols: parseInt(takeAttr('data-cols'))
												});
											}
										}
									}

									_context2.prev = 5;
									_context2.t0 = displayInForm;
									_context2.next = 9;
									return sendAjaxQuery('get_tinymce_list_form', values);

								case 9:
									_context2.t1 = _context2.sent;
									resultDom = (0, _context2.t0)(_context2.t1);
									return _context2.abrupt("return", new Promise(function (resolve) {
										itge.finishListTinymce = function (data) {
											hideOutForm(resultDom);
											if (isNA(data)) {
												return;
											}

											var shortcode = "glossary_" + {
												atoz: 'atoz',
												list: 'term_list'
											}[data.type];
											var tail = mode !== 'load' ? ' ' : '';
											var optArr = new OptArray();

											var attrs = ['alpha', 'group'];
											if ('list' === data.type) {
												attrs.push('cols', 'desc');
											}

											attrs.forEach(function (attr) {
												if (data.hasOwnProperty(attr)) {
													optArr.addOpt(attr, data[attr]);
												}
											});

											var finalContent = "[" + shortcode + " " + optArr.toString() + "/]" + tail;
											itg.log('Final content:', finalContent);
											return resolve({ finalContent: finalContent, mode: mode });
										};
									}));

								case 14:
									_context2.prev = 14;
									_context2.t2 = _context2["catch"](5);

									xhrError(_context2.t2);

								case 17:
								case "end":
									return _context2.stop();
							}
						}
					}, _callee2, this, [[5, 14]]);
				}));

				function list(_x7) {
					return _ref2.apply(this, arguments);
				}

				return list;
			}(),
			tip: function () {
				var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(selection, escapeContent) {
					var node, values, mode, _content, attrs, takeAttr, positionAt, positionMy, myInverted, tooltipContent, i, resultDom;

					return regeneratorRuntime.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
									itg.info('Selection infos to load TIP: ', selection);
									node = selection.start;
									values = {};
									mode = '';

									if (!isNA(selection.start) && selection.start === selection.end) {
										itg.info("Start & End node are the same, operating on a node of type " + node.nodeName);
										_content = node && node.text || selection.html; // Get node text if any or get selection

										itg.log('Loading content: ', _content);
										if (node && node.nodeName !== '#text' && tipsTypes.indexOf(node.getAttribute('data-type')) > -1) {
											// On Glossary Term or Tooltip or Mediatip, load data
											mode = 'load';
											attrs = takeAttr(node);
											takeAttr = generateTakeAttr(attrs);

											// Pick attributes

											positionAt = splitAttr(takeAttr('position-at') || ' ');
											positionMy = splitAttr(takeAttr('position-my') || ' ');
											myInverted = 1 === Math.max(positionMy.indexOf('top'), positionMy.indexOf('bottom')) || 0 === Math.max(positionMy.indexOf('right'), positionMy.indexOf('left'));

											positionAt = {
												1: positionAt[0],
												2: positionAt[1]
											};
											positionMy = {
												1: positionMy[myInverted ? 1 : 0],
												2: positionMy[myInverted ? 0 : 1],
												invert: myInverted ? 'enabled' : undefined
											};

											tooltipContent = takeAttr('tooltip-content');

											if (escapeContent && tooltipContent) {
												tooltipContent = tooltipContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
											}

											// Create the base value object. It will be filled with other attributes
											values = {
												text: _content,
												link: takeAttr('href', true),
												tooltip_content: itg.stripQuotes(tooltipContent || _content, false),
												glossary_id: takeAttr('glossary-id'),
												term_search: itge.removeAccents(_content.toLowerCase()),
												mediatip_type: takeAttr('mediatip-type'),
												mediatip_content: itg.stripQuotes(takeAttr('mediatip-content'), false),
												mediatip_link: takeAttr('mediatip-link'),
												mediatip_caption: takeAttr('mediatip-caption'),
												type: ['glossary', 'tooltip', 'mediatip'][tipsTypes.indexOf(takeAttr('type'))],
												opts: {
													termcontent: takeAttr('termcontent'),
													'qtip-keep-open': 'true' === takeAttr('qtip-keep-open'),
													qtiprounded: tristate(takeAttr('qtiprounded')),
													qtipshadow: tristate(takeAttr('qtipshadow')),
													qtipstyle: takeAttr('qtipstyle'),
													qtiptrigger: takeAttr('qtiptrigger'),
													position: {
														at: positionAt,
														my: positionMy
													},
													attributes: {
														span: {},
														link: {}
													},
													anim: {
														in: takeAttr('animation_in'),
														out: takeAttr('animation_out'),
														time: takeAttr('animation_time')
													},
													maxwidth: takeAttr('tooltip-maxwidth')
												},

												glossary_disable_auto_translation: 'true' === (takeAttr('disable_auto_translation') || false)
											};

											// With all attributes left, append them to the attributes option
											for (i in attrs) {
												if (attrs.hasOwnProperty(i)) {
													if (i.match(/^data-link-/)) {
														values.opts.attributes.link[i.replace(/^data-link-(data-)?/, '')] = attrs[i];
													} else {
														values.opts.attributes.span[i.replace(/^data-/, '')] = attrs[i];
													}
												}
											}
										} else {
											// Create new glossary term
											values = {
												text: '',
												link: '',
												tooltip_content: '',
												glossary_id: null,
												term_search: '',
												mediatip_type: '',
												mediatip_content: '',
												mediatip_caption: '',
												type: 'tooltip',

												glossary_disable_auto_translation: false
											};
											// If something is selected, load the content as text, content for tooltip & search
											if (_content && _content.length > 0) {
												mode = 'replace_content';
												values = $.extend(values, {
													text: _content,
													tooltip_content: _content,
													term_search: itge.removeAccents(_content.toLowerCase())
												});
											} else {
												mode = 'add_content';
											}
										}
									}

									// Then generate form through Ajax

									_context3.prev = 5;
									_context3.next = 8;
									return displayInForm(sendAjaxQuery('get_tinymce_tooltip_form', values));

								case 8:
									resultDom = _context3.sent;
									return _context3.abrupt("return", new Promise(function (resolve) {
										itge.finishListTinymce = function (data) {
											hideOutForm(resultDom);
											itge.info('New tooltip data:', data);
											if (isNA(data)) {
												return;
											}
											var optArr = new OptArray();
											var attributesList = resultDom.find('#attributes-list option').map(function (elem) {
												return elem.value;
											}).toArray();
											var types = ['span', 'link'];
											var shortcode = "itg-" + data.type;
											var tail = mode !== 'load' && 0 === content.length ? ' ' : '';
											// Get new options, or old one
											var opts = data.opts || values.opts;
											var optsAttrs = opts && opts.attributes || {};

											if (!isNA(opts)) {
												optArr.maybeAddOpt(opts['qtip-content'], 'data-termcontent', opts['qtip-content']);
												optArr.maybeAddOpt(opts['qtip-keep-open'], 'data-qtip-keep-open', 'true');
												optArr.maybeAddOpt(!isNA(opts.qtiprounded), 'data-qtiprounded', String(opts.qtiprounded));
												optArr.maybeAddOpt(!isNA(opts.qtipshadow), 'data-qtipshadow', String(opts.qtipshadow));
												optArr.maybeAddOpt(opts.qtipstyle, 'data-qtipstyle', opts.qtipstyle);
												optArr.maybeAddOpt(opts.qtiptrigger, 'data-qtiptrigger', opts.qtiptrigger);
												if (opts.position) {
													if (opts.position.at && opts.position.at[1] && opts.position.at[2]) {
														optArr.addOpt('data-position-at', opts.position.at[1] + " " + opts.position.at[2]);
													}
													if (opts.position.my && opts.position.my[1] && opts.position.my[2]) {
														var my = [opts.position.my[1], opts.position.my[2]];
														if (opts.position.my.invert) {
															my.reverse();
														}
														optArr.addOpt('data-position-my', my.join(' '));
													}
												}
												if (opts.anim) {
													optArr.maybeAddOpt(opts.anim.in, 'data-animation_in', opts.anim.in);
													optArr.maybeAddOpt(opts.anim.out, 'data-animation_out', opts.anim.out);
													optArr.maybeAddOpt(opts.anim.time, 'data-animation_time', opts.anim.time);
												}
												optArr.maybeAddOpt(opts.maxwidth, 'data-tooltip-maxwidth', opts.maxwidth);
												types.forEach(function (type) {
													if (optsAttrs.hasOwnProperty(type)) {
														for (j in optsAttrs[type]) {
															if (optsAttrs[type].hasOwnProperty(j)) {
																var prefix = attributesList.indexOf(j) > -1 && !j.startsWith('data-') ? '' : 'data-';
																var midPart = 'link' === type ? 'link-' : '';
																optArr.addOpt(prefix + midPart + j, optsAttrs[type][j], true);
															}
														}
													}
												});
											}
											optArr.maybeAddOpt(opts.link, 'href', encodeURI(data.link));

											if ('glossary' === data.type) {
												if (!data.glossary_id || !data.text) {
													return;
												} else {
													optArr.addOpt('glossary-id', data.glossary_id);
													if (data.disable_auto_translation) {
														optArr.addOpt('disable_auto_translation', 'true');
													}
												}
											} else if ('tooltip' === data.type) {
												if (!data.tooltip_content || !data.text) {
													return;
												} else {
													addOpt('tooltip-content', escapeContent ? data.tooltip_content.replace(/</g, '&lt;').replace(/>/g, '&gt;') : data.tooltip_content, true);
												}
											} else if ('mediatip' === data.type) {
												if (!data.mediatip_type || !data.mediatip_content || !data.text) {
													return;
												} else {
													addOpt('mediatip-type', data.mediatip_type);
													addOpt('mediatip-content', data.mediatip_content, true);
													if (data.mediatip_caption) {
														addOpt('mediatip-caption', data.mediatip_caption, true);
													}
												}
											}
											var finalContent = "[" + shortcode + " " + optArr.toString() + "]" + data.text + "[/" + shortcode + "]" + tail;
											itg.log('Final content:', finalContent);
											return resolve({ finalContent: finalContent, mode: mode });
										};
									}));

								case 12:
									_context3.prev = 12;
									_context3.t0 = _context3["catch"](5);

									xhrError(_context3.t0);

								case 15:
								case "end":
									return _context3.stop();
							}
						}
					}, _callee3, this, [[5, 12]]);
				}));

				function tip(_x8, _x9) {
					return _ref3.apply(this, arguments);
				}

				return tip;
			}()
		};

		var utils = {
			editorForms: editorForms,
			generateSelObject: generateSelObject,
			sendAjaxQuery: sendAjaxQuery,
			hideOutForm: hideOutForm,
			tipsTypes: tipsTypes,
			tipsSelector: tipsSelector,
			maybePrefixAttribute: function maybePrefixAttribute(attrName) {
				// If the key is not an HTML attribute and is not `data-` prefixed, prefix it
				if (!htmlAttrs.includes(attrName) && !attrName.startsWith('data-')) {
					return " data-" + attrName;
				} else {
					return attrName;
				}
			}
		};

		module.exports = utils;
	}, { "./tinymce-optarray": 3, "remove-accents": 6 }], 5: [function (require, module, exports) {
		(function (global) {
			/**
    * Copyright (c) 2014, Facebook, Inc.
    * All rights reserved.
    *
    * This source code is licensed under the BSD-style license found in the
    * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
    * additional grant of patent rights can be found in the PATENTS file in
    * the same directory.
    */

			!function (global) {
				"use strict";

				var Op = Object.prototype;
				var hasOwn = Op.hasOwnProperty;
				var undefined; // More compressible than void 0.
				var $Symbol = typeof Symbol === "function" ? Symbol : {};
				var iteratorSymbol = $Symbol.iterator || "@@iterator";
				var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
				var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

				var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
				var runtime = global.regeneratorRuntime;
				if (runtime) {
					if (inModule) {
						// If regeneratorRuntime is defined globally and we're in a module,
						// make the exports object identical to regeneratorRuntime.
						module.exports = runtime;
					}
					// Don't bother evaluating the rest of this file if the runtime was
					// already defined globally.
					return;
				}

				// Define the runtime globally (as expected by generated code) as either
				// module.exports (if we're in a module) or a new, empty object.
				runtime = global.regeneratorRuntime = inModule ? module.exports : {};

				function wrap(innerFn, outerFn, self, tryLocsList) {
					// If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
					var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
					var generator = Object.create(protoGenerator.prototype);
					var context = new Context(tryLocsList || []);

					// The ._invoke method unifies the implementations of the .next,
					// .throw, and .return methods.
					generator._invoke = makeInvokeMethod(innerFn, self, context);

					return generator;
				}
				runtime.wrap = wrap;

				// Try/catch helper to minimize deoptimizations. Returns a completion
				// record like context.tryEntries[i].completion. This interface could
				// have been (and was previously) designed to take a closure to be
				// invoked without arguments, but in all the cases we care about we
				// already have an existing method we want to call, so there's no need
				// to create a new function object. We can even get away with assuming
				// the method takes exactly one argument, since that happens to be true
				// in every case, so we don't have to touch the arguments object. The
				// only additional allocation required is the completion record, which
				// has a stable shape and so hopefully should be cheap to allocate.
				function tryCatch(fn, obj, arg) {
					try {
						return { type: "normal", arg: fn.call(obj, arg) };
					} catch (err) {
						return { type: "throw", arg: err };
					}
				}

				var GenStateSuspendedStart = "suspendedStart";
				var GenStateSuspendedYield = "suspendedYield";
				var GenStateExecuting = "executing";
				var GenStateCompleted = "completed";

				// Returning this object from the innerFn has the same effect as
				// breaking out of the dispatch switch statement.
				var ContinueSentinel = {};

				// Dummy constructor functions that we use as the .constructor and
				// .constructor.prototype properties for functions that return Generator
				// objects. For full spec compliance, you may wish to configure your
				// minifier not to mangle the names of these two functions.
				function Generator() {}
				function GeneratorFunction() {}
				function GeneratorFunctionPrototype() {}

				// This is a polyfill for %IteratorPrototype% for environments that
				// don't natively support it.
				var IteratorPrototype = {};
				IteratorPrototype[iteratorSymbol] = function () {
					return this;
				};

				var getProto = Object.getPrototypeOf;
				var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
				if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
					// This environment has a native %IteratorPrototype%; use it instead
					// of the polyfill.
					IteratorPrototype = NativeIteratorPrototype;
				}

				var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
				GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
				GeneratorFunctionPrototype.constructor = GeneratorFunction;
				GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

				// Helper for defining the .next, .throw, and .return methods of the
				// Iterator interface in terms of a single ._invoke method.
				function defineIteratorMethods(prototype) {
					["next", "throw", "return"].forEach(function (method) {
						prototype[method] = function (arg) {
							return this._invoke(method, arg);
						};
					});
				}

				runtime.isGeneratorFunction = function (genFun) {
					var ctor = typeof genFun === "function" && genFun.constructor;
					return ctor ? ctor === GeneratorFunction ||
					// For the native GeneratorFunction constructor, the best we can
					// do is to check its .name property.
					(ctor.displayName || ctor.name) === "GeneratorFunction" : false;
				};

				runtime.mark = function (genFun) {
					if (Object.setPrototypeOf) {
						Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
					} else {
						genFun.__proto__ = GeneratorFunctionPrototype;
						if (!(toStringTagSymbol in genFun)) {
							genFun[toStringTagSymbol] = "GeneratorFunction";
						}
					}
					genFun.prototype = Object.create(Gp);
					return genFun;
				};

				// Within the body of any async function, `await x` is transformed to
				// `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
				// `hasOwn.call(value, "__await")` to determine if the yielded value is
				// meant to be awaited.
				runtime.awrap = function (arg) {
					return { __await: arg };
				};

				function AsyncIterator(generator) {
					function invoke(method, arg, resolve, reject) {
						var record = tryCatch(generator[method], generator, arg);
						if (record.type === "throw") {
							reject(record.arg);
						} else {
							var result = record.arg;
							var value = result.value;
							if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
								return Promise.resolve(value.__await).then(function (value) {
									invoke("next", value, resolve, reject);
								}, function (err) {
									invoke("throw", err, resolve, reject);
								});
							}

							return Promise.resolve(value).then(function (unwrapped) {
								// When a yielded Promise is resolved, its final value becomes
								// the .value of the Promise<{value,done}> result for the
								// current iteration. If the Promise is rejected, however, the
								// result for this iteration will be rejected with the same
								// reason. Note that rejections of yielded Promises are not
								// thrown back into the generator function, as is the case
								// when an awaited Promise is rejected. This difference in
								// behavior between yield and await is important, because it
								// allows the consumer to decide what to do with the yielded
								// rejection (swallow it and continue, manually .throw it back
								// into the generator, abandon iteration, whatever). With
								// await, by contrast, there is no opportunity to examine the
								// rejection reason outside the generator function, so the
								// only option is to throw it from the await expression, and
								// let the generator function handle the exception.
								result.value = unwrapped;
								resolve(result);
							}, reject);
						}
					}

					if (_typeof(global.process) === "object" && global.process.domain) {
						invoke = global.process.domain.bind(invoke);
					}

					var previousPromise;

					function enqueue(method, arg) {
						function callInvokeWithMethodAndArg() {
							return new Promise(function (resolve, reject) {
								invoke(method, arg, resolve, reject);
							});
						}

						return previousPromise =
						// If enqueue has been called before, then we want to wait until
						// all previous Promises have been resolved before calling invoke,
						// so that results are always delivered in the correct order. If
						// enqueue has not been called before, then it is important to
						// call invoke immediately, without waiting on a callback to fire,
						// so that the async generator function has the opportunity to do
						// any necessary setup in a predictable way. This predictability
						// is why the Promise constructor synchronously invokes its
						// executor callback, and why async functions synchronously
						// execute code before the first await. Since we implement simple
						// async functions in terms of async generators, it is especially
						// important to get this right, even though it requires care.
						previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
						// Avoid propagating failures to Promises returned by later
						// invocations of the iterator.
						callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
					}

					// Define the unified helper method that is used to implement .next,
					// .throw, and .return (see defineIteratorMethods).
					this._invoke = enqueue;
				}

				defineIteratorMethods(AsyncIterator.prototype);
				AsyncIterator.prototype[asyncIteratorSymbol] = function () {
					return this;
				};
				runtime.AsyncIterator = AsyncIterator;

				// Note that simple async functions are implemented on top of
				// AsyncIterator objects; they just return a Promise for the value of
				// the final result produced by the iterator.
				runtime.async = function (innerFn, outerFn, self, tryLocsList) {
					var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

					return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
					: iter.next().then(function (result) {
						return result.done ? result.value : iter.next();
					});
				};

				function makeInvokeMethod(innerFn, self, context) {
					var state = GenStateSuspendedStart;

					return function invoke(method, arg) {
						if (state === GenStateExecuting) {
							throw new Error("Generator is already running");
						}

						if (state === GenStateCompleted) {
							if (method === "throw") {
								throw arg;
							}

							// Be forgiving, per 25.3.3.3.3 of the spec:
							// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
							return doneResult();
						}

						context.method = method;
						context.arg = arg;

						while (true) {
							var delegate = context.delegate;
							if (delegate) {
								var delegateResult = maybeInvokeDelegate(delegate, context);
								if (delegateResult) {
									if (delegateResult === ContinueSentinel) continue;
									return delegateResult;
								}
							}

							if (context.method === "next") {
								// Setting context._sent for legacy support of Babel's
								// function.sent implementation.
								context.sent = context._sent = context.arg;
							} else if (context.method === "throw") {
								if (state === GenStateSuspendedStart) {
									state = GenStateCompleted;
									throw context.arg;
								}

								context.dispatchException(context.arg);
							} else if (context.method === "return") {
								context.abrupt("return", context.arg);
							}

							state = GenStateExecuting;

							var record = tryCatch(innerFn, self, context);
							if (record.type === "normal") {
								// If an exception is thrown from innerFn, we leave state ===
								// GenStateExecuting and loop back for another invocation.
								state = context.done ? GenStateCompleted : GenStateSuspendedYield;

								if (record.arg === ContinueSentinel) {
									continue;
								}

								return {
									value: record.arg,
									done: context.done
								};
							} else if (record.type === "throw") {
								state = GenStateCompleted;
								// Dispatch the exception by looping back around to the
								// context.dispatchException(context.arg) call above.
								context.method = "throw";
								context.arg = record.arg;
							}
						}
					};
				}

				// Call delegate.iterator[context.method](context.arg) and handle the
				// result, either by returning a { value, done } result from the
				// delegate iterator, or by modifying context.method and context.arg,
				// setting context.delegate to null, and returning the ContinueSentinel.
				function maybeInvokeDelegate(delegate, context) {
					var method = delegate.iterator[context.method];
					if (method === undefined) {
						// A .throw or .return when the delegate iterator has no .throw
						// method always terminates the yield* loop.
						context.delegate = null;

						if (context.method === "throw") {
							if (delegate.iterator.return) {
								// If the delegate iterator has a return method, give it a
								// chance to clean up.
								context.method = "return";
								context.arg = undefined;
								maybeInvokeDelegate(delegate, context);

								if (context.method === "throw") {
									// If maybeInvokeDelegate(context) changed context.method from
									// "return" to "throw", let that override the TypeError below.
									return ContinueSentinel;
								}
							}

							context.method = "throw";
							context.arg = new TypeError("The iterator does not provide a 'throw' method");
						}

						return ContinueSentinel;
					}

					var record = tryCatch(method, delegate.iterator, context.arg);

					if (record.type === "throw") {
						context.method = "throw";
						context.arg = record.arg;
						context.delegate = null;
						return ContinueSentinel;
					}

					var info = record.arg;

					if (!info) {
						context.method = "throw";
						context.arg = new TypeError("iterator result is not an object");
						context.delegate = null;
						return ContinueSentinel;
					}

					if (info.done) {
						// Assign the result of the finished delegate to the temporary
						// variable specified by delegate.resultName (see delegateYield).
						context[delegate.resultName] = info.value;

						// Resume execution at the desired location (see delegateYield).
						context.next = delegate.nextLoc;

						// If context.method was "throw" but the delegate handled the
						// exception, let the outer generator proceed normally. If
						// context.method was "next", forget context.arg since it has been
						// "consumed" by the delegate iterator. If context.method was
						// "return", allow the original .return call to continue in the
						// outer generator.
						if (context.method !== "return") {
							context.method = "next";
							context.arg = undefined;
						}
					} else {
						// Re-yield the result returned by the delegate method.
						return info;
					}

					// The delegate iterator is finished, so forget it and continue with
					// the outer generator.
					context.delegate = null;
					return ContinueSentinel;
				}

				// Define Generator.prototype.{next,throw,return} in terms of the
				// unified ._invoke helper method.
				defineIteratorMethods(Gp);

				Gp[toStringTagSymbol] = "Generator";

				// A Generator should always return itself as the iterator object when the
				// @@iterator function is called on it. Some browsers' implementations of the
				// iterator prototype chain incorrectly implement this, causing the Generator
				// object to not be returned from this call. This ensures that doesn't happen.
				// See https://github.com/facebook/regenerator/issues/274 for more details.
				Gp[iteratorSymbol] = function () {
					return this;
				};

				Gp.toString = function () {
					return "[object Generator]";
				};

				function pushTryEntry(locs) {
					var entry = { tryLoc: locs[0] };

					if (1 in locs) {
						entry.catchLoc = locs[1];
					}

					if (2 in locs) {
						entry.finallyLoc = locs[2];
						entry.afterLoc = locs[3];
					}

					this.tryEntries.push(entry);
				}

				function resetTryEntry(entry) {
					var record = entry.completion || {};
					record.type = "normal";
					delete record.arg;
					entry.completion = record;
				}

				function Context(tryLocsList) {
					// The root entry object (effectively a try statement without a catch
					// or a finally block) gives us a place to store values thrown from
					// locations where there is no enclosing try statement.
					this.tryEntries = [{ tryLoc: "root" }];
					tryLocsList.forEach(pushTryEntry, this);
					this.reset(true);
				}

				runtime.keys = function (object) {
					var keys = [];
					for (var key in object) {
						keys.push(key);
					}
					keys.reverse();

					// Rather than returning an object with a next method, we keep
					// things simple and return the next function itself.
					return function next() {
						while (keys.length) {
							var key = keys.pop();
							if (key in object) {
								next.value = key;
								next.done = false;
								return next;
							}
						}

						// To avoid creating an additional object, we just hang the .value
						// and .done properties off the next function object itself. This
						// also ensures that the minifier will not anonymize the function.
						next.done = true;
						return next;
					};
				};

				function values(iterable) {
					if (iterable) {
						var iteratorMethod = iterable[iteratorSymbol];
						if (iteratorMethod) {
							return iteratorMethod.call(iterable);
						}

						if (typeof iterable.next === "function") {
							return iterable;
						}

						if (!isNaN(iterable.length)) {
							var i = -1,
							    next = function next() {
								while (++i < iterable.length) {
									if (hasOwn.call(iterable, i)) {
										next.value = iterable[i];
										next.done = false;
										return next;
									}
								}

								next.value = undefined;
								next.done = true;

								return next;
							};

							return next.next = next;
						}
					}

					// Return an iterator with no values.
					return { next: doneResult };
				}
				runtime.values = values;

				function doneResult() {
					return { value: undefined, done: true };
				}

				Context.prototype = {
					constructor: Context,

					reset: function reset(skipTempReset) {
						this.prev = 0;
						this.next = 0;
						// Resetting context._sent for legacy support of Babel's
						// function.sent implementation.
						this.sent = this._sent = undefined;
						this.done = false;
						this.delegate = null;

						this.method = "next";
						this.arg = undefined;

						this.tryEntries.forEach(resetTryEntry);

						if (!skipTempReset) {
							for (var name in this) {
								// Not sure about the optimal order of these conditions:
								if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
									this[name] = undefined;
								}
							}
						}
					},

					stop: function stop() {
						this.done = true;

						var rootEntry = this.tryEntries[0];
						var rootRecord = rootEntry.completion;
						if (rootRecord.type === "throw") {
							throw rootRecord.arg;
						}

						return this.rval;
					},

					dispatchException: function dispatchException(exception) {
						if (this.done) {
							throw exception;
						}

						var context = this;
						function handle(loc, caught) {
							record.type = "throw";
							record.arg = exception;
							context.next = loc;

							if (caught) {
								// If the dispatched exception was caught by a catch block,
								// then let that catch block handle the exception normally.
								context.method = "next";
								context.arg = undefined;
							}

							return !!caught;
						}

						for (var i = this.tryEntries.length - 1; i >= 0; --i) {
							var entry = this.tryEntries[i];
							var record = entry.completion;

							if (entry.tryLoc === "root") {
								// Exception thrown outside of any try block that could handle
								// it, so set the completion value of the entire function to
								// throw the exception.
								return handle("end");
							}

							if (entry.tryLoc <= this.prev) {
								var hasCatch = hasOwn.call(entry, "catchLoc");
								var hasFinally = hasOwn.call(entry, "finallyLoc");

								if (hasCatch && hasFinally) {
									if (this.prev < entry.catchLoc) {
										return handle(entry.catchLoc, true);
									} else if (this.prev < entry.finallyLoc) {
										return handle(entry.finallyLoc);
									}
								} else if (hasCatch) {
									if (this.prev < entry.catchLoc) {
										return handle(entry.catchLoc, true);
									}
								} else if (hasFinally) {
									if (this.prev < entry.finallyLoc) {
										return handle(entry.finallyLoc);
									}
								} else {
									throw new Error("try statement without catch or finally");
								}
							}
						}
					},

					abrupt: function abrupt(type, arg) {
						for (var i = this.tryEntries.length - 1; i >= 0; --i) {
							var entry = this.tryEntries[i];
							if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
								var finallyEntry = entry;
								break;
							}
						}

						if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
							// Ignore the finally entry if control is not jumping to a
							// location outside the try/catch block.
							finallyEntry = null;
						}

						var record = finallyEntry ? finallyEntry.completion : {};
						record.type = type;
						record.arg = arg;

						if (finallyEntry) {
							this.method = "next";
							this.next = finallyEntry.finallyLoc;
							return ContinueSentinel;
						}

						return this.complete(record);
					},

					complete: function complete(record, afterLoc) {
						if (record.type === "throw") {
							throw record.arg;
						}

						if (record.type === "break" || record.type === "continue") {
							this.next = record.arg;
						} else if (record.type === "return") {
							this.rval = this.arg = record.arg;
							this.method = "return";
							this.next = "end";
						} else if (record.type === "normal" && afterLoc) {
							this.next = afterLoc;
						}

						return ContinueSentinel;
					},

					finish: function finish(finallyLoc) {
						for (var i = this.tryEntries.length - 1; i >= 0; --i) {
							var entry = this.tryEntries[i];
							if (entry.finallyLoc === finallyLoc) {
								this.complete(entry.completion, entry.afterLoc);
								resetTryEntry(entry);
								return ContinueSentinel;
							}
						}
					},

					"catch": function _catch(tryLoc) {
						for (var i = this.tryEntries.length - 1; i >= 0; --i) {
							var entry = this.tryEntries[i];
							if (entry.tryLoc === tryLoc) {
								var record = entry.completion;
								if (record.type === "throw") {
									var thrown = record.arg;
									resetTryEntry(entry);
								}
								return thrown;
							}
						}

						// The context.catch method must only be called with a location
						// argument that corresponds to a known catch block.
						throw new Error("illegal catch attempt");
					},

					delegateYield: function delegateYield(iterable, resultName, nextLoc) {
						this.delegate = {
							iterator: values(iterable),
							resultName: resultName,
							nextLoc: nextLoc
						};

						if (this.method === "next") {
							// Deliberately forget the last sent value so that we don't
							// accidentally pass it on to the delegate.
							this.arg = undefined;
						}

						return ContinueSentinel;
					}
				};
			}(
			// Among the various tricks for obtaining a reference to the global
			// object, this seems to be the most reliable technique that does not
			// use indirect eval (which violates Content Security Policy).
			(typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : this);
		}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	}, {}], 6: [function (require, module, exports) {
		var characterMap = {
			"À": "A",
			"Á": "A",
			"Â": "A",
			"Ã": "A",
			"Ä": "A",
			"Å": "A",
			"Ấ": "A",
			"Ắ": "A",
			"Ẳ": "A",
			"Ẵ": "A",
			"Ặ": "A",
			"Æ": "AE",
			"Ầ": "A",
			"Ằ": "A",
			"Ȃ": "A",
			"Ç": "C",
			"Ḉ": "C",
			"È": "E",
			"É": "E",
			"Ê": "E",
			"Ë": "E",
			"Ế": "E",
			"Ḗ": "E",
			"Ề": "E",
			"Ḕ": "E",
			"Ḝ": "E",
			"Ȇ": "E",
			"Ì": "I",
			"Í": "I",
			"Î": "I",
			"Ï": "I",
			"Ḯ": "I",
			"Ȋ": "I",
			"Ð": "D",
			"Ñ": "N",
			"Ò": "O",
			"Ó": "O",
			"Ô": "O",
			"Õ": "O",
			"Ö": "O",
			"Ø": "O",
			"Ố": "O",
			"Ṍ": "O",
			"Ṓ": "O",
			"Ȏ": "O",
			"Ù": "U",
			"Ú": "U",
			"Û": "U",
			"Ü": "U",
			"Ý": "Y",
			"à": "a",
			"á": "a",
			"â": "a",
			"ã": "a",
			"ä": "a",
			"å": "a",
			"ấ": "a",
			"ắ": "a",
			"ẳ": "a",
			"ẵ": "a",
			"ặ": "a",
			"æ": "ae",
			"ầ": "a",
			"ằ": "a",
			"ȃ": "a",
			"ç": "c",
			"ḉ": "c",
			"è": "e",
			"é": "e",
			"ê": "e",
			"ë": "e",
			"ế": "e",
			"ḗ": "e",
			"ề": "e",
			"ḕ": "e",
			"ḝ": "e",
			"ȇ": "e",
			"ì": "i",
			"í": "i",
			"î": "i",
			"ï": "i",
			"ḯ": "i",
			"ȋ": "i",
			"ð": "d",
			"ñ": "n",
			"ò": "o",
			"ó": "o",
			"ô": "o",
			"õ": "o",
			"ö": "o",
			"ø": "o",
			"ố": "o",
			"ṍ": "o",
			"ṓ": "o",
			"ȏ": "o",
			"ù": "u",
			"ú": "u",
			"û": "u",
			"ü": "u",
			"ý": "y",
			"ÿ": "y",
			"Ā": "A",
			"ā": "a",
			"Ă": "A",
			"ă": "a",
			"Ą": "A",
			"ą": "a",
			"Ć": "C",
			"ć": "c",
			"Ĉ": "C",
			"ĉ": "c",
			"Ċ": "C",
			"ċ": "c",
			"Č": "C",
			"č": "c",
			"C̆": "C",
			"c̆": "c",
			"Ď": "D",
			"ď": "d",
			"Đ": "D",
			"đ": "d",
			"Ē": "E",
			"ē": "e",
			"Ĕ": "E",
			"ĕ": "e",
			"Ė": "E",
			"ė": "e",
			"Ę": "E",
			"ę": "e",
			"Ě": "E",
			"ě": "e",
			"Ĝ": "G",
			"Ǵ": "G",
			"ĝ": "g",
			"ǵ": "g",
			"Ğ": "G",
			"ğ": "g",
			"Ġ": "G",
			"ġ": "g",
			"Ģ": "G",
			"ģ": "g",
			"Ĥ": "H",
			"ĥ": "h",
			"Ħ": "H",
			"ħ": "h",
			"Ḫ": "H",
			"ḫ": "h",
			"Ĩ": "I",
			"ĩ": "i",
			"Ī": "I",
			"ī": "i",
			"Ĭ": "I",
			"ĭ": "i",
			"Į": "I",
			"į": "i",
			"İ": "I",
			"ı": "i",
			"Ĳ": "IJ",
			"ĳ": "ij",
			"Ĵ": "J",
			"ĵ": "j",
			"Ķ": "K",
			"ķ": "k",
			"Ḱ": "K",
			"ḱ": "k",
			"K̆": "K",
			"k̆": "k",
			"Ĺ": "L",
			"ĺ": "l",
			"Ļ": "L",
			"ļ": "l",
			"Ľ": "L",
			"ľ": "l",
			"Ŀ": "L",
			"ŀ": "l",
			"Ł": "l",
			"ł": "l",
			"Ḿ": "M",
			"ḿ": "m",
			"M̆": "M",
			"m̆": "m",
			"Ń": "N",
			"ń": "n",
			"Ņ": "N",
			"ņ": "n",
			"Ň": "N",
			"ň": "n",
			"ŉ": "n",
			"N̆": "N",
			"n̆": "n",
			"Ō": "O",
			"ō": "o",
			"Ŏ": "O",
			"ŏ": "o",
			"Ő": "O",
			"ő": "o",
			"Œ": "OE",
			"œ": "oe",
			"P̆": "P",
			"p̆": "p",
			"Ŕ": "R",
			"ŕ": "r",
			"Ŗ": "R",
			"ŗ": "r",
			"Ř": "R",
			"ř": "r",
			"R̆": "R",
			"r̆": "r",
			"Ȓ": "R",
			"ȓ": "r",
			"Ś": "S",
			"ś": "s",
			"Ŝ": "S",
			"ŝ": "s",
			"Ş": "S",
			"Ș": "S",
			"ș": "s",
			"ş": "s",
			"Š": "S",
			"š": "s",
			"Ţ": "T",
			"ţ": "t",
			"ț": "t",
			"Ț": "T",
			"Ť": "T",
			"ť": "t",
			"Ŧ": "T",
			"ŧ": "t",
			"T̆": "T",
			"t̆": "t",
			"Ũ": "U",
			"ũ": "u",
			"Ū": "U",
			"ū": "u",
			"Ŭ": "U",
			"ŭ": "u",
			"Ů": "U",
			"ů": "u",
			"Ű": "U",
			"ű": "u",
			"Ų": "U",
			"ų": "u",
			"Ȗ": "U",
			"ȗ": "u",
			"V̆": "V",
			"v̆": "v",
			"Ŵ": "W",
			"ŵ": "w",
			"Ẃ": "W",
			"ẃ": "w",
			"X̆": "X",
			"x̆": "x",
			"Ŷ": "Y",
			"ŷ": "y",
			"Ÿ": "Y",
			"Y̆": "Y",
			"y̆": "y",
			"Ź": "Z",
			"ź": "z",
			"Ż": "Z",
			"ż": "z",
			"Ž": "Z",
			"ž": "z",
			"ſ": "s",
			"ƒ": "f",
			"Ơ": "O",
			"ơ": "o",
			"Ư": "U",
			"ư": "u",
			"Ǎ": "A",
			"ǎ": "a",
			"Ǐ": "I",
			"ǐ": "i",
			"Ǒ": "O",
			"ǒ": "o",
			"Ǔ": "U",
			"ǔ": "u",
			"Ǖ": "U",
			"ǖ": "u",
			"Ǘ": "U",
			"ǘ": "u",
			"Ǚ": "U",
			"ǚ": "u",
			"Ǜ": "U",
			"ǜ": "u",
			"Ứ": "U",
			"ứ": "u",
			"Ṹ": "U",
			"ṹ": "u",
			"Ǻ": "A",
			"ǻ": "a",
			"Ǽ": "AE",
			"ǽ": "ae",
			"Ǿ": "O",
			"ǿ": "o",
			"Þ": "TH",
			"þ": "th",
			"Ṕ": "P",
			"ṕ": "p",
			"Ṥ": "S",
			"ṥ": "s",
			"X́": "X",
			"x́": "x",
			"Ѓ": "Г",
			"ѓ": "г",
			"Ќ": "К",
			"ќ": "к",
			"A̋": "A",
			"a̋": "a",
			"E̋": "E",
			"e̋": "e",
			"I̋": "I",
			"i̋": "i",
			"Ǹ": "N",
			"ǹ": "n",
			"Ồ": "O",
			"ồ": "o",
			"Ṑ": "O",
			"ṑ": "o",
			"Ừ": "U",
			"ừ": "u",
			"Ẁ": "W",
			"ẁ": "w",
			"Ỳ": "Y",
			"ỳ": "y",
			"Ȁ": "A",
			"ȁ": "a",
			"Ȅ": "E",
			"ȅ": "e",
			"Ȉ": "I",
			"ȉ": "i",
			"Ȍ": "O",
			"ȍ": "o",
			"Ȑ": "R",
			"ȑ": "r",
			"Ȕ": "U",
			"ȕ": "u",
			"B̌": "B",
			"b̌": "b",
			"Č̣": "C",
			"č̣": "c",
			"Ê̌": "E",
			"ê̌": "e",
			"F̌": "F",
			"f̌": "f",
			"Ǧ": "G",
			"ǧ": "g",
			"Ȟ": "H",
			"ȟ": "h",
			"J̌": "J",
			"ǰ": "j",
			"Ǩ": "K",
			"ǩ": "k",
			"M̌": "M",
			"m̌": "m",
			"P̌": "P",
			"p̌": "p",
			"Q̌": "Q",
			"q̌": "q",
			"Ř̩": "R",
			"ř̩": "r",
			"Ṧ": "S",
			"ṧ": "s",
			"V̌": "V",
			"v̌": "v",
			"W̌": "W",
			"w̌": "w",
			"X̌": "X",
			"x̌": "x",
			"Y̌": "Y",
			"y̌": "y",
			"A̧": "A",
			"a̧": "a",
			"B̧": "B",
			"b̧": "b",
			"Ḑ": "D",
			"ḑ": "d",
			"Ȩ": "E",
			"ȩ": "e",
			"Ɛ̧": "E",
			"ɛ̧": "e",
			"Ḩ": "H",
			"ḩ": "h",
			"I̧": "I",
			"i̧": "i",
			"Ɨ̧": "I",
			"ɨ̧": "i",
			"M̧": "M",
			"m̧": "m",
			"O̧": "O",
			"o̧": "o",
			"Q̧": "Q",
			"q̧": "q",
			"U̧": "U",
			"u̧": "u",
			"X̧": "X",
			"x̧": "x",
			"Z̧": "Z",
			"z̧": "z"
		};

		var chars = Object.keys(characterMap).join('|');
		var allAccents = new RegExp(chars, 'g');
		var firstAccent = new RegExp(chars, '');

		var removeAccents = function removeAccents(string) {
			return string.replace(allAccents, function (match) {
				return characterMap[match];
			});
		};

		var hasAccents = function hasAccents(string) {
			return !!string.match(firstAccent);
		};

		module.exports = removeAccents;
		module.exports.has = hasAccents;
		module.exports.remove = removeAccents;
	}, {}] }, {}, [1]);
//# sourceMappingURL=form-handler.js.map
