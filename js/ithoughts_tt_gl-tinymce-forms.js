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

/*global tinymce:false, ithoughts_tt_gl_editor: false */

(function(ithoughts){
	'use strict';

	var $		= ithoughts.$,
		$d		= ithoughts.$d,
		$w		= ithoughts.$w,
		i_t_g_e	= ithoughts_tt_gl_editor;
	$d.ready(function(){
		var formType = '';
		if($('#ithoughts_tt_gl-tooltip-form-container').length){
			formType = 'TIP';
		} else if($('#ithoughts_tt_gl-list-form-container').length){
			formType = 'LIST';
		} else {
			return;
		}

		//Generic tab switching
		function initTab(jqobj, cb){
			jqobj.click(function(event){
				$(this).parent().find('.active').removeClass('active');
				$(this).addClass('active');

				$(event.target).parent().parent().find(' > .active').removeClass('active');
				var index = $(event.target).index();
				$($(event.target).parent().parent().children()[index + 1]).addClass('active');

				cb && cb(index);
			});
			jqobj.filter('.active').click();
		}

		if(formType == 'TIP'){
			(function initTipForm(){
				initTab($('#ithoughts_tt_gl-tooltip-form .tabs li'), function(index){
					var linkInput = $('#ithoughts_tt_gl_link');
					// Only Glossary tooltip (tab @ index 0) disable the custom link editor
					linkInput.prop('disabled', index == 0);
				});
				initTab($('#ithoughts_tt_gl-tooltip-form-options .tabs li'));
				var $editors = $('#ithoughts_tt_gl-tooltip-form-container .tinymce');
				$editors.each(function(index, editor){
					var text = editor.value;
					while(editor.getAttribute('id') == null){
						var newId = 'editor' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
						if(!$(newId).length){
							editor.setAttribute('id', newId);
						}
					}
					var editorId = editor.getAttribute('id');
					tinymce.init({
						selector: '#' + editorId,
						menubar: false,
						external_plugins: {
							code: i_t_g_e.base_tinymce + '/code/plugin.min.js',
							wordcount: i_t_g_e.base_tinymce + '/wordcount/plugin.min.js',
						},
						plugins: 'wplink',
						toolbar: [
							'styleselect | bold italic underline link | bullist numlist | alignleft aligncenter alignright alignjustify | code',
						],
						min_height:70,
						height: 70,
						resize: false,
					});
					var intervalContent = setInterval(function(){
						var subeditor = tinymce.get(editorId);
						if(subeditor && subeditor.getDoc() && subeditor.getBody()){
							i_t_g_e.log('Initing subeditor with content ', JSON.stringify(text));
							clearInterval(intervalContent);
							subeditor.setContent(text.replace(/&/g, '&amp;'));
						}
					},50);
				});

				// Mode switcher
				$('.modeswitcher').on('click keyup', function(){
					var id = this.id;
					$('[data-' + id + ']:not([data-' + id + '="mediatip-' + this.value + '-type"])').hide();
					$('[data-' + id + '~="mediatip-' + this.value + '-type"]').show();
				}).keyup();

				// Image selector
				$('#ithoughts_tt_gl_select_image').click(function() {
					window.mb = window.mb || {};

					window.mb.frame = wp.media({
						frame: 'post',
						state: 'insert',
						library : {
							type : ['audio', 'video','image'],
						},
						multiple: false,
					});

					window.mb.frame.on('insert', function() {
						var json = window.mb.frame.state().get('selection').first().toJSON();

						if (0 > $.trim(json.url.length)) {
							return;
						}

						$('#image-box-data').val(JSON.stringify({
							url:json.url,
							id: json.id,
							link: json.link,
						}));
						$('#image-box').html('<img src="' + json.url + '"/>');
						$('#mediatip_caption').val(json.caption);
						$('#ithoughts_tt_gl_link').val(json.link);
					});

					window.mb.frame.open();
				});

				// ## Autocomplete for glossary term
				var input = $('#glossary_term'),
					completerHolder = $('#glossary_term_completer'),
					completerHolderContainer = $('#glossary_term_completer_container'),
					searchedString = '',
					request = null,
					tooltipOpts;

				// ##### `resizeWindow`: Set styles of the completer holder 
				function resizeWindow(){
					// The `completerHolder` element has to be positionned by JS. In fact, to overflow outside from the modal, it must not be a descendent of the modal. Thus, we can't position it via CSS
					var top = completerHolder.offset().top - $w.scrollTop();
					var bottom = $w.height();
					var height = bottom - top;
					completerHolderContainer.css({maxHeight: height});
				}
				$w.resize(resizeWindow);

				// ##### `losefocustest`: Check if the completer holder or the input has the focus 
				function losefocustest(){
					// The timeout is required to let some time to the browser to change the focus status of the elements
					setTimeout(function(){
						if(!completerHolder.find('*:focus').length && !input.is(':focus')){
							// Hide the `completerHolder`
							completerHolderContainer.addClass('hidden');
						}
					},100);
				}
				// ##### `removeEditor`: Clean an editor
				function removeEditor(editorId){
					// Sometimes (depending on the browser AFAIK), TinyMCE fails to execute the command to remove an editor. We then have to clean its data manually
					try{
						tinymce.EditorManager.execCommand('mceRemoveEditor',true, editorId);
					} catch(e){
						ithoughts_tt_gl.warn('Force cleaning needed: ',e);
						tinymce.EditorManager.editors = tinymce.EditorManager.editors.filter(function(editor){
							return editor.id != editorId;
						});
					}
				}

				// ##### `searchMatchingRes`: Does all the completion work from retrieved term catalog
				function searchMatchingRes(){
					// First, we filter terms contained in the global hash `ithoughts_tt_gl_editor`. Those terms will be splitted in 2 categories:
					// * those which **starts** with the searched string
					// * those which **contains** the searched string
					var startsWith = [];
					var contains = [];
					i_t_g_e.terms.map(function(element){
						var indx = element.title.toLowerCase().indexOf(searchedString);
						if(indx == -1)
							indx = element.slug.toLowerCase().indexOf(searchedString);
						if(indx == -1) {
							return;
						} else if(indx == 0){
							startsWith.push(element);
							return;
						} else {
							contains.push(element);
						}
					});
					// Then, concat both arrays to have the terms starting with the search before those who just contains the search
					var searchResults = startsWith.concat(contains).filter(function(item, pos, self) {
						return self.indexOf(item) == pos;
					});
					// Clean the search result container, then re-fill it with items
					completerHolder.empty();
					var length = searchResults.length;
					if(length > 0){
						for(var i = 0; i < length; i++){
							var item = searchResults[i];
							// If WPML is installed, `item` should contain the property `thislang`. If `thislang` is set to false, then the term is in another language than the current one, and we display it with a particular class
							if(typeof item.thislang != 'undefined' && item.thislang === false)
								completerHolder.append($.parseHTML('<div tabindex="0" class="option foreign-language" data-id="' + item.id + '" data-excerpt="' + item.content + '"><p><b>' + item.title + '</b><br><em>' + item.slug + '</em></p></div>'));
							else
								completerHolder.append($.parseHTML('<div tabindex="0" class="option" data-id="' + item.id + '" data-excerpt="' + item.content + '"><p><b>' + item.title + '</b><br><em>' + item.slug + '</em></p></div>'));
						}
					} else {
						completerHolder.append($.parseHTML('<p style="text-align:center"><em>No results</em><p>'));
					}
					// Once we have filled the search result container, display it and recalculate position
					completerHolderContainer.removeClass('hidden');
					setTimeout(resizeWindow,25);
					// On each result, make them selectable
					completerHolder.find('.option').on('click', function(e){
						// Set inputs with values provided by the option, then hide the completer holder
						$('[name="glossary_term_id"]').val(e.currentTarget.getAttribute('data-id'));
						input.val($(e.currentTarget).find('p > b').text());
						completerHolderContainer.addClass('hidden');
					});

				}
				input.on('keyup focusin', function(){
					if(request)
						request.abort();
					searchedString = i_t_g_e.removeAccents($(this).val().toLowerCase());
					request = $.ajax({
						url: i_t_g_e.admin_ajax,
						method: 'POST',
						dataType:'json',
						data:{
							action: 'ithoughts_tt_gl_get_terms_list',
							search: searchedString,
						},
						complete: function(res){
							var response = res.responseJSON;
							if(typeof response == 'undefined' || !response.success)
								return;
							if(response.data.searched != searchedString){
								ithoughts_tt_gl.info('Outdated response');
								return;
							}
							i_t_g_e.terms = response.data.terms;
							searchMatchingRes();
						},
					});
					searchMatchingRes();
				}).on('focusout', losefocustest).on('keyup', function(){
					this.removeAttribute('data-term-id');
				});
				$('#ithoughts_tt_gl-tinymce-validate').click(function(){
					var data = {
						type: ['glossary', 'tooltip', 'mediatip'][$('.tabs li.active').index()],
						text: $('#ithoughts_tt_gl_text').val(),
						link: $('#ithoughts_tt_gl_link').val(),
						opts: tooltipOpts,
					};
					i_t_g_e.log('Before per-type form data handling:',data);
					switch(data.type){
						case 'glossary':{
							data = $.extend(data, {
								glossary_id: $('[name="glossary_term_id"]').val(),
								disable_auto_translation: $('[name="glossary_disable_auto_translation"]').is(':checked'),
							});
						}break;

						case 'tooltip':{
							data = $.extend(data, {
								tooltip_content: tinymce.EditorManager.get('ithoughts_tt_gl-tooltip-content').getContent() || $('#ithoughts_tt_gl-tooltip-content').val(),
							});
						}break;

						case 'mediatip':{
							data = $.extend(data, {
								mediatip_type: $('#mediatip_type').val(),
							});
							switch(data.mediatip_type){
								case 'localimage':{
									data = $.extend(data, {
										mediatip_content: $('#image-box-data').val(),
										mediatip_caption: $('#mediatip_caption').val(),
									});
								}break;

								case 'webimage':{
									data = $.extend(data, {
										mediatip_content: $('#mediatip_url_image').val(),
										mediatip_caption: $('#mediatip_caption').val(),
									});
								}break;

								case 'webvideo':{
									data = $.extend(data, {
										mediatip_content: $('#mediatip_url_video_embed').val(),
										mediatip_link: $('#mediatip_url_video_link').val(),
									});
								}break;
							}
						}break;
					}
					//setTimeout(tinymce.EditorManager.get('ithoughts_tt_gl-tooltip-content').remove, 500);
					setTimeout(function(){removeEditor('ithoughts_tt_gl-tooltip-content');}, 500);
					i_t_g_e.finishTipTinymce(data);
				});
				$('.ithoughts_tt_gl-tinymce-discard').click(function(){
					setTimeout(function(){removeEditor('ithoughts_tt_gl-tooltip-content');}, 500);
					i_t_g_e.finishTipTinymce();
				});

				// Refactor urls of mediatips
				{
					$('#mediatip_url_video_link').bind('keyup mouseup change click focusin focusout', function(){
						var videodata = null;
						var formats = {
							direct: {
								regex: /^(.*\.mp4)(\?.*)?$/,
								embed: '<video width="512" height="288" controls="controls"><source src="$1" type="video/mp4" /></video>',
								video: '$1',
							},
							youtube: {
								regex: /^(?:https?:\/\/(?:youtu\.be\/|\w*\.youtube\.\w{2,3}\/watch\?v=)|<iframe .*?src="https?:\/\/\w*\.youtube\.\w{2,3}\/embed\/)([a-zA-Z0-9]*).*$/,
								embed: '<iframe width="512" height="288" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>',
								video: 'https://www.youtube.com/watch?v=$1',
							},
							dailymotion: {
								regex: /^(?:https?:\/\/(?:dai\.ly\/|\w*\.dailymotion\.\w{2,3}\/video\/)|<iframe .*?src=".*?\w*\.dailymotion\.\w{2,3}\/embed\/video\/)([a-zA-Z0-9]*).*/,
								embed: '<iframe width="512" height="288" src="https://www.dailymotion.com/embed/video/$1" frameborder="0" allowfullscreen></iframe>',
								video: 'https://www.dailymotion.com/video/$1',
							},
						};

						for(var type in formats){
							if(this.value.match(formats[type].regex)){
								videodata = {
									embed: this.value.replace(formats[type].regex, formats[type].embed),
									video: this.value.replace(formats[type].regex, formats[type].video),
								};
								break;
							}
						}
						if(videodata){
							$('#mediatip_url_video_embed').val(videodata.embed);
							$('#mediatip_url_video_link').val(videodata.video);
						}
					}).keyup();
				}

				(function initAdvancedConfiguration(){
					var $opts = $('#ithoughts_tt_gl-tooltip-form-options'),
						$tooltip = $('#ithoughts_tt_gl-tooltip-form'),
						skip = {
							span:false,
							link:false,
						},
						$form = $('#ithoughts_tt_gl-tooltip-form-options form');

					function getOptsObject(){
						var form = $form[0],
							formElems = form.elements,
							tristates = {},
							valid = true,
							formFields = formElems.length,
							i = -1,
							attributes = {},
							attributesList = $('#attributes-list option').map(function(){
								return this.value;
							}).toArray(),
							opts,
							types = ['span', 'link'];
						while(++i < formFields && valid){
							var validity = formElems[i].validity;
							valid &= validity.valid;
							if(!validity.valid){
								formElems[i].focus();
							}
						}

						$form.find('.ithoughts-tristate').each(function(){
							$.extend(true, tristates, $(this).serializeInputsObject({'-1': false, 0: null, 1: true}[this.dataset.state]));
						});
						opts = $.extend(true, $form.serializeObject(), tristates);


						for(i = 0; i < 2; i++){
							var type = types[i];
							attributes[type] = {};
							for(var arrK = opts['attributes-' + type + '-key'] || [],
								arrV = opts['attributes-' + type + '-value'] || [], j = 0, J = Math.min(
								arrK.length,
								arrV.length
							); j < J; j++){
								if(arrK[j] && arrV[j]){
									var prefix = attributesList.indexOf(arrK[j]) > -1 ? '' : 'data-';
									attributes[type][prefix + arrK[j]] = arrV[j];
								}
							}
							delete opts['attributes-' + type + '-value'];
							delete opts['attributes-' + type + '-key'];

						}
						opts['attributes'] = attributes;
						return opts;
					}
					function filterPrototypeInputs(){
						return $(this).closest('.ithoughts-prototype').length === 0;
					}
					function checkRemoveAttr(){
						var thisInput = $(this),
							$container = thisInput.parent().parent(),
							otherInput = $container.find('input').filter(function(){
								return this != thisInput.get(0);
							});

						setTimeout(function(){

							var type = thisInput.closest('.ithoughts-attrs-container').attr('data-attr-family');


							if(skip[type]){
								skip[type] = false;
								return;
							}
							thisInput.val(thisInput.val().trim());
							otherInput.val(otherInput.val().trim());

							if(!thisInput.val() && !otherInput.val() && document.activeElement != thisInput.get(0) && document.activeElement != otherInput.get(0)){
								$container.remove();
							}
						},100);
					}

					$opts.find('input[type="checkbox"].ithoughts-tristate').attr('data-state', function(i, attrVal){
						return ((attrVal || 0) - 1) % 3 + 2;
					}).change(function(){
						var s = $(this),
							ts = ((s.attr('data-state')||0) - 2) % 3 + 1;
						s.attr('data-state', ts);
						this.checked = ts == 1;
						this.indeterminate = ts == 0;
					}).change();
					tooltipOpts = getOptsObject();
					$('#ithoughts_tt_gl-tinymce-advanced_options').click(function showAttributesWindow(){
						$opts.show();
						$tooltip.hide();
					});
					$('#ithoughts_tt_gl-tinymce-close-attrs').click(function closeDiscardAttributesWindow(){
						$opts.hide();
						$tooltip.show();
					});
					$('#ithoughts_tt_gl-tinymce-validate-attrs').click(function closeAcceptAttributesWindow(){
						tooltipOpts = getOptsObject();
						$opts.hide();
						$tooltip.show();
					});
					$('#qtip-keep-open').change(function(){
						var modeInput = $('#qtiptrigger'),
							textInput = $('#qtiptriggerText'),
							mtInput = $([modeInput, textInput]),
							oldValue;
						return function lockQtipTrigger(){
							modeInput.prop('disabled', this.checked);
							textInput.prop('disabled', !this.checked);
							mtInput.val(this.checked ? 'click' : oldValue);
							if(this.checked){
								oldValue = modeInput.value;
							} else {
								modeInput.disabled = !(textInput.disabled = true);
							}
						};
					}());
					$('[name^="position[my]"]').change(function(){
						var base = '#position[my][',
							inputV = $(base + '1]'),
							inputH = $(base + '2]'),
							inputsHV = $(inputH.get(0), inputV.get(0)),
							inputS = $(base + 'invert]');
						return function changePositionMy(){
							inputsHV.prop('required', inputV.val() || inputH.val() || inputS.prop('checked'));
						};
					}());
					$('[name^="position[at]"]').change(function(){
						var base = '#position[at][',
							inputV = $(base + '1]'),
							inputH = $(base + '2]'),
							inputsHV = $(inputH.get(0), inputV.get(0));
						return function changePositionMy(){
							inputsHV.prop('required', inputV.val() || inputH.val());
						};
					}());
					$('#kv-pair-link-attrs-add,#kv-pair-span-attrs-add').bind('mouseup touchend', function(){
						skip[type] = true;
						var $container = $(this).parent().find('.ithoughts-attrs-container'),
							$invalidInputs = $container.find('input:invalid').filter(filterPrototypeInputs),
							type = $container.attr('data-attr-family');

						if($invalidInputs.length > 0){
							skip[type] = true;
							$invalidInputs.eq(0).focus();
							checkRemoveAttr.call($invalidInputs.get(0));
							skip[type] = false;
							return;
						}

						var $prototype = $container.find('.ithoughts-prototype'),
							$clone = $prototype.clone().removeClass('ithoughts-prototype'),
							newIdParts = [
								'attributes-'+type+'-',
								'-'+(new Date().getTime()),
							];
						$clone.find('.dynamicId').each(function(){
							var $this = $(this),
								newId = newIdParts[0] + ($this.hasClass('dynamicId-key') ? 'key' : 'value') + newIdParts[1];
							$this.attr(this.tagName == 'LABEL' ? 'for' : 'id', newId);
						});
						$clone.find('input').prop('required', true).prop('disabled', false);
						$container.append($clone);
						$clone.find('input').blur(checkRemoveAttr).eq(0).focus();
						checkRemoveAttr.call($clone.find('input').get(0));
					});
					$('.ithoughts-attrs-container input').blur(checkRemoveAttr);
				})();
			}());
		} else if(formType == 'LIST'){
			(function initListForm(){
				initTab($('.tabs li'));

				(function initGroupsPicker(){
					var $ids = $('#groups'),
						$text = $('#groups_text'),
						$groupsPicker = $('#groupspicker'),
						$catchEvent = $([$groupsPicker.get(0), $text.parent().get(0)]),
						$checkboxes = $('#groupspicker .group-select input');
					$text.focusin(function(){
						$groupsPicker.toggleClass('hidden');

						function hide(){
							$groupsPicker.toggleClass('hidden');
							$catchEvent.off('click', catchEvent);
						}
						function catchEvent(e){
							e.stopImmediatePropagation();
						}
						$catchEvent.click(catchEvent);
						$w.one('click', hide);
					});
					$checkboxes.change(function(){
						var $checked = $checkboxes.filter(':checked'),
							texts = [],
							ids = [];

						$checked.each(function(){
							texts.push($(this).parent().find('.group-title').text());
							ids.push($(this).val());
						});
						$ids.val(ids.join(','));
						$text.val(texts.join(', '));
					}).change();
				}());

				$('#ithoughts_tt_gl-tinymce-validate').click(function(){
					var data = {
						type: ['atoz', 'list'][$('.tabs li.active').index()],
						alpha: $('#letters').val(),
						group: $('#groups').val(),
					};
					if(!data.alpha) delete data.alpha;
					if(!data.group) delete data.group;

					switch(data.type){
						case 'list':{
							$.extend(data, {
								desc: $('#description_mode').val(),
								cols: $('#columns_count').val(),
							});
						} break;
					}
					i_t_g_e.finishListTinymce(data);
				});
				$('.ithoughts_tt_gl-tinymce-discard').click(function(){
					i_t_g_e.finishListTinymce();
				});
			}());
		}
	});
})(Ithoughts.v4);