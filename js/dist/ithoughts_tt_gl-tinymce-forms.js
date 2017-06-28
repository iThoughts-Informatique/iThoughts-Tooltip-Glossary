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

(function selfCalling(ithoughts) {

	// As usual, assign our most comon globals usage to local ones for minification
	var $ = ithoughts.$,
	    $d = ithoughts.$d,
	    $w = ithoughts.$w,
	    itge = iThoughtsTooltipGlossaryEditor;
	$d.ready(function onDocumentReady() {
		var formType = '';
		// Depending on the ID present, we can deduce if we are in TIP or LIST creation/edition mode.
		if (1 === $('#ithoughts_tt_gl-tooltip-form-container').length) {
			formType = 'TIP';
		} else if (1 === $('#ithoughts_tt_gl-list-form-container').length) {
			formType = 'LIST';
		} else {
			itge.error('Does not contains a tooltip form nor a list form, exit');
			return;
		}

		// ##### `initTab`: Set up a tab switcher element
		/**
   * @function initTab
   * @description Set up a tab switcher element
   * @author Gerkin
   * @param {jQuery} jqobj jQuery selector containing the tabs triggers
   * @param {Function} [cb] Function to execute with cb( newIndex )
   * @returns {undefined}
   */
		function initTab(jqobj, cb) {
			jqobj.click(function onClickTab() {
				// First, clean the `active` class on all siblings, then set it only on event emitter
				$(this).parent().find('.active').removeClass('active');
				$(this).addClass('active');

				// Then, we check the index of the clicked element (`this`) in the parent, and we set active the tab with the same index
				var index = $(this).index();
				$(this).parent().parent().find(' > .active').removeClass('active');
				$($(this).parent().parent().children()[index + 1]).addClass('active');

				// Then we try to call the callback (if set)
				cb && cb(index);
			});
			// Self-set
			jqobj.filter('.active').click();
		}

		// ## Tip form
		if ('TIP' === formType) {
			(function initTipForm() {
				// Define the container for tooltip options in parent scope, so it can be used accross several events
				var tooltipOpts;
				// Initialize the tab switcher between mode Glossary, Tooltip & Mediatip
				initTab($('#ithoughts_tt_gl-tooltip-form .tabs li'), function callback(index) {
					// Only Glossary tooltip (tab @ index 0) disable the custom link editor
					$('#ithoughts_tt_gl_link').prop('disabled', 0 === index);
				});
				// Initialize the tab switcher of advanced options
				initTab($('#ithoughts_tt_gl-tooltip-form-options .tabs li'));
				// Mode switcher for mediatips.  Hide all except the selected mode
				$('.modeswitcher').on('click keyup', function switchMode() {
					var id = this.id;
					$('[data-' + id + ']:not([data-' + id + '="mediatip-' + this.value + '-type"])').hide();
					$('[data-' + id + '~="mediatip-' + this.value + '-type"]').show();
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
				}

				// ### TinyMCE editor for Tooltips
				(function initSubEditor($editors) {
					// Initialize the TinyMCE editor inside the Tooltip tab
					$editors.each(function findNewEditor(index, editor) {
						// Find a free id. If our editor does not have an ID, we have to generate one
						while (null == editor.getAttribute('id')) {
							var newId = 'editor' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
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
							selector: '#' + editorId,
							menubar: false,
							external_plugins: {
								code: itge.base_tinymce + '/code/plugin.min.js',
								wordcount: itge.base_tinymce + '/wordcount/plugin.min.js'
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
						$('#image-box').html('<img src="' + json.url + '"/>');
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
									completerHolder.append($.parseHTML('<div tabindex="0" class="option foreign-language" data-id="' + item.id + '" data-excerpt="' + item.content + '"><p><b>' + item.title + '</b><br><em>' + item.slug + '</em></p></div>'));
								} else {
									completerHolder.append($.parseHTML('<div tabindex="0" class="option" data-id="' + item.id + '" data-excerpt="' + item.content + '"><p><b>' + item.title + '</b><br><em>' + item.slug + '</em></p></div>'));
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
						request = $.ajax({
							url: itge.admin_ajax,
							method: 'POST',
							dataType: 'json',
							data: {
								action: 'ithoughts_tt_gl_get_terms_list',
								search: searchedString
							},
							complete: function complete(res) {
								var response = res.responseJSON;
								if ('undefined' == typeof response || !response.success) {
									return;
								}
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
							for (var arrK = opts['attributes-' + type + '-key'] || [], arrV = opts['attributes-' + type + '-value'] || [], j = 0, J = Math.min(arrK.length, arrV.length); j < J; j++) {
								if (arrK[j] && arrV[j]) {
									// If the key is not in the list of standard DOM attributes, we have to prefix it
									var prefix = attributesList.indexOf(arrK[j]) > -1 ? '' : 'data-';
									attributes[type][prefix + arrK[j]] = arrV[j];
								}
							}
							// Clean the options object afterwars
							delete opts['attributes-' + type + '-value'];
							delete opts['attributes-' + type + '-key'];
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
						    inputV = $(base + '1]'),
						    inputH = $(base + '2]'),
						    inputsHV = $(inputH.get(0), inputV.get(0)),
						    inputS = $(base + 'invert]');
						return function changePositionMy() {
							inputsHV.prop('required', inputV.val() || inputH.val() || inputS.prop('checked'));
						};
					}());
					$('[name^="position[at]"]').change(function onPositionAtChange() {
						var base = '#position[at][',
						    inputV = $(base + '1]'),
						    inputH = $(base + '2]'),
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
						    newIdParts = ['attributes-' + type + '-', '-' + new Date().getTime()];
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
					itge.log('Before per-type form data handling:', data);
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
					$text.focusin(function onGroupsPickerFocus() {
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
						group: $('#groups').val()
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
									desc: $('#description_mode').val(),
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
})(iThoughts.v5);
//# sourceMappingURL=ithoughts_tt_gl-tinymce-forms.js.map
