/**
 * @file Client-side scripts for handling tooltip creation wizzard in Wordpress TinyMCE
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.5.0
 */

/*jslint plusplus: true*/
/*globals Ithoughts, ithoughts_tt_gl*/

(function (ithoughts) {
	'use strict';

	var $ = ithoughts.$,
		$w = ithoughts.$w,
		i_t_g = ithoughts_tt_gl,
		tooltipOpts,
		gei = ithoughts.gei,
		qs = ithoughts.qs,
		searchedString;

	/**
	 * @function setTabSpecificBehavior
	 * @inner
	 * @description For the tooltip editing form, define custom behavior of components depending on tab selected. For example, add or remove the warning tooltip over the link input
	 * @author Gerkin
	 * @param {number} index Index of the tab
	 */
	function setTabSpecificBehavior(index) {
		var linkInput = $("#ithoughts_tt_gl_link");
		switch (index) {
			case 0:
				linkInput.qtip({
					show: {
						event: "focus"
					},
					hide: {
						event: "blur"
					},
					content: {
						title: linkInput.attr("data-warning-title"),
						button: true,
						text: linkInput.attr("data-warning-text")
					},
					position:{
						container: $("#ithoughts_tt_gl-tooltip-form")
					}
				});
				break;

			case 1:
				linkInput.qtip('destroy', true);
				break;

			case 2:
				linkInput.qtip('destroy', true);
				break;
		}
	}

	ithoughts.$d.ready(function(){
		ithoughts_tt_gl.doInitTooltips();

		//Generic tab switching
		$('.tabs li').click(function(event){
			var index = $(event.target).index();
			if($(this).hasClass('active')){ // If switching to the same tab
				return;
			}
			$(this).parent().find('.active').removeClass('active');
			$(this).addClass('active');

			$(event.target).parent().parent().find(' > .active').removeClass('active');
			$($(event.target).parent().parent().children()[index + 1]).addClass('active');
		});
		$('#ithoughts_tt_gl-tabs-mode').click(function(event){
			if($(this).hasClass('active')){ // If switching to the same tab
				return;
			}
			setTabSpecificBehavior($(event.target).index());
		});

		var startTabIndex = parseInt($("#ithoughts_tt_gl-tabs-mode").attr("data-init-tab-index")) || 0;
		setTabSpecificBehavior(startTabIndex);
		$($('#ithoughts_tt_gl-tabs-mode').children()[startTabIndex]).click();

		var $editors = $("#ithoughts_tt_gl-tooltip-form-container .tinymce");
		$editors.each(function(index, editor){
			var text = editor.value;
			while(editor.getAttribute("id") == null){
				var newId = "editor" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
				if(!gei(newId)){
					editor.setAttribute("id", newId);
				}
			}
			var editorId = editor.getAttribute("id");
			tinymce.init({
				selector: "#" + editorId,
				menubar: false,
				external_plugins: {
					code: ithoughts.tinymce.base_tinymce + "/code/plugin.min.js",
					wordcount: ithoughts.tinymce.base_tinymce + "/wordcount/plugin.min.js"
				},
				plugins: "wplink",
				toolbar: [
					"styleselect | bold italic underline link | bullist numlist | alignleft aligncenter alignright alignjustify | code"
				],
				min_height:70,
				height: 70,
				resize:false
			});
			var intervalContent = setInterval(function(){
				if(tinymce.get(editorId)){
					clearInterval(intervalContent);
					tinymce.get(editorId).setContent(text.replace(/&/g, "&amp;"));
				}
			},50);
		});

		// Mode switcher
		$(".modeswitcher").on("click keyup", function(){
			var id = this.id;
			$('[data-' + id + ']:not([data-' + id + '="mediatip-' + this.value + '-type"])').hide();
			$('[data-' + id + '~="mediatip-' + this.value + '-type"]').show();
		}).keyup();

		// Image selector
		$("#ithoughts_tt_gl_select_image").click(function() {
			var onclickEntryPoint = this;

			window.mb = window.mb || {};

			window.mb.frame = wp.media({
				frame: 'post',
				state: 'insert',
				library : {
					type : ["audio", "video",'image']
				},
				multiple: false
			});

			window.mb.frame.on('insert', function() {
				var json = window.mb.frame.state().get('selection').first().toJSON();

				if (0 > $.trim(json.url.length)) {
					return;
				}

				$("#image-box-data").val(JSON.stringify({
					url:json.url,
					id: json.id,
					link: json.link
				}));
				gei('image-box').innerHTML = '<img src="' + json.url + '"/>';
				gei('mediatip_caption').value = json.caption;
				gei("ithoughts_tt_gl_link").value = json.link;
			});

			window.mb.frame.open();
		});

		// Autocomplete for glossary term
		{
			function removeEditor(editorId){
				try{
					tinymce.EditorManager.execCommand('mceRemoveEditor',true, editorId);
				} catch(e){
					console.warn("Force cleaning needed: ",e);
					tinymce.EditorManager.editors = tinymce.EditorManager.editors.filter(function(editor){
						return editor.id != editorId;
					});
				}
			}

			var input = $("#glossary_term");
			var completerHolder = $("#glossary_term_completer");
			var completerHolderContainer = $("#glossary_term_completer_container");
			function resizeWindow(){
				var top = completerHolder.offset().top - $w.scrollTop();
				var bottom = $w.height();
				var height = bottom - top;
				completerHolderContainer.css({maxHeight: height});
			}
			$w.resize(resizeWindow);

			function losefocustest(){
				setTimeout(function(){
					if(!completerHolder.find("*:focus").length && !input.is(":focus")){
						completerHolderContainer.addClass("hidden");
					}
				},100);
			};
			function searchMatchingRes(){
				var startsWith = [];
				var contains = [];
				ithoughts.tinymce.terms.map(function(element){
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
				var searchResults = startsWith.concat(contains);
				completerHolder.empty();
				var length = searchResults.length;
				if(length > 0){
					for(var i = 0; i < length; i++){
						var item = searchResults[i];
						if(typeof item.thislang != "undefined" && !item.thislang)
							completerHolder.append($.parseHTML('<div tabindex="0" class="option foreign-language" data-id="' + item.id + '" data-excerpt="' + item.content + '"><p><b>' + item.title + '</b><br><em>' + item.slug + '</em></p></div>'));
						else
							completerHolder.append($.parseHTML('<div tabindex="0" class="option" data-id="' + item.id + '" data-excerpt="' + item.content + '"><p><b>' + item.title + '</b><br><em>' + item.slug + '</em></p></div>'));
					}
				} else {
					completerHolder.append($.parseHTML('<p style="text-align:center"><em>No results</em><p>'));
				}
				completerHolderContainer.removeClass("hidden");
				setTimeout(resizeWindow,25);
				completerHolder.find(".option").on("click", function(e){
					$('[name="glossary_term_id"]').val(e.currentTarget.getAttribute("data-id"));
					input[0].value = $(e.currentTarget).find("p > b").text();
					completerHolderContainer.addClass("hidden");
				});
			}
			var request = null;
			input.on("keyup focusin", function(){
				if(request)
					request.abort();
				searchedString = ithoughts.removeAccents($(this).val().toLowerCase());
				request = $.ajax({
					url: ithoughts.tinymce.admin_ajax,
					method: "POST",
					dataType:"json",
					data:{
						action: "ithoughts_tt_gl_get_terms_list",
						search: searchedString
					},
					complete: function(res){
						var response = res.responseJSON;
						if(typeof response == "undefined" || !response.success){
							console.error("Response is not a valid JSON");
							return;
						}
						if(response.data.searched != searchedString){
							console.info("Outdated response");
							return;
						}
						ithoughts.tinymce.terms = response.data.terms;
						searchMatchingRes();
					}
				});
				searchMatchingRes();
			}).on("focusout", losefocustest).on("keyup", function(){
				this.removeAttribute("data-term-id");
			});
			$("#ithoughts_tt_gl-tinymce-validate").click(function(){
				var data = {
					type: ["glossary", "tooltip", "mediatip"][$('.tabs li.active').index()],
					text: gei("ithoughts_tt_gl_text").value,
					link: gei("ithoughts_tt_gl_link").value,
					opts: tooltipOpts
				}
				switch(data.type){
					case "glossary":{
						data = $.extend(data, {
							glossary_id: $('[name="glossary_term_id"]').val(),
							disable_auto_translation: (function(elem){if(elem)return elem.checked;else return false})(qs('[name="glossary_disable_auto_translation"]'))
						});
					}break;

					case "tooltip":{
						data = $.extend(data, {
							tooltip_content: tinymce.EditorManager.get('ithoughts_tt_gl-tooltip-content').getContent() || $("#ithoughts_tt_gl-tooltip-content").val()
						});
					}break;

					case "mediatip":{
						data = $.extend(data, {
							mediatip_type: $("#mediatip_type").val()
						});
						switch(data.mediatip_type){
							case "localimage":{
								data = $.extend(data, {
									mediatip_content: $("#image-box-data").val(),
									mediatip_caption: $("#mediatip_caption").val()
								});
							}break;

							case "webimage":{
								data = $.extend(data, {
									mediatip_content: $("#mediatip_url_image").val(),
									mediatip_caption: $("#mediatip_caption").val()
								});
							}break;

							case "webvideo":{
								data = $.extend(data, {
									mediatip_content: $("#mediatip_url_video_embed").val(),
									mediatip_link: $("#mediatip_url_video_link").val()
								});
							}break;
						}
					}break;
				}
				//setTimeout(tinymce.EditorManager.get('ithoughts_tt_gl-tooltip-content').remove, 500);
				setTimeout(function(){removeEditor('ithoughts_tt_gl-tooltip-content')}, 500);
				ithoughts_tt_gl.finishTinymce(data);
			});
			$(".ithoughts_tt_gl-tinymce-discard").click(function(){
				setTimeout(function(){removeEditor('ithoughts_tt_gl-tooltip-content')}, 500);
				ithoughts_tt_gl.finishTinymce()
			});
		}

		// Refactor urls of mediatips
		(function refactorVideosUrls(){
			$("#mediatip_url_video_link").bind("keyup mouseup change click focusin focusout", function(){
				var videodata = null;
				var formats = {
					direct: {
						regex: /^(.*\.mp4)(\?.*)?$/,
						embed: '<video width="512" height="288" controls="controls"><source src="$1" type="video/mp4" /></video>',
						video: '$1'
					},
					youtube: {
						regex: /^(?:https?:\/\/(?:youtu\.be\/|\w*\.youtube\.\w{2,3}\/watch\?v=)|<iframe .*?src="https?:\/\/\w*\.youtube\.\w{2,3}\/embed\/)([a-zA-Z0-9]*).*$/,
						embed: '<iframe width="512" height="288" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>',
						video: 'https://www.youtube.com/watch?v=$1'
					},
					dailymotion: {
						regex: /^(?:https?:\/\/(?:dai\.ly\/|\w*\.dailymotion\.\w{2,3}\/video\/)|<iframe .*?src=".*?\w*\.dailymotion\.\w{2,3}\/embed\/video\/)([a-zA-Z0-9]*).*/,
						embed: '<iframe width="512" height="288" src="https://www.dailymotion.com/embed/video/$1" frameborder="0" allowfullscreen></iframe>',
						video: 'https://www.dailymotion.com/video/$1'
					}
				};

				for(var type in formats){
					if(this.value.match(formats[type].regex)){
						videodata = {
							embed: this.value.replace(formats[type].regex, formats[type].embed),
							video: this.value.replace(formats[type].regex, formats[type].video)
						};
						break;
					}
				}
				if(videodata){
					$("#mediatip_url_video_embed").val(videodata.embed);
					$("#mediatip_url_video_link").val(videodata.video);
				}
			}).keyup();
		})();

		// Init close/validate buttons for advanced tooltip configuration
		(function initAdvancedConfiguration(){
			var $opts = $("#ithoughts_tt_gl-tooltip-form-options"),
				skip = {
					span:false,
					link:false
				};
			$opts.find('input[type="checkbox"].ithoughts-tristate').attr("data-state", function(i, attrVal){
				return ((attrVal || 0) - 1) % 3 + 2;
			}).change(function(e){
				var s = $(this),
					ts = ((s.attr("data-state")||0) - 2) % 3 + 1;
				console.log(ts);
				s.attr("data-state", ts);
				this.indeterminate = ts == 0;
				this.checked = ts == 1;
			}).change();

			function filterPrototypeInputs(){
				return $(this).closest('.ithoughts-prototype').length === 0;
			}
			function checkRemoveAttr(){
				var thisInput = $(this),
					$container = thisInput.parent().parent(),
					otherInput = $container.find("input").filter(function(){
						return this != thisInput.get(0);
					});


				setTimeout(function(){
					var type = thisInput.closest(".ithoughts-attrs-container").attr("data-attr-family");


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
			$("#ithoughts_tt_gl-tinymce-advanced_options").click(function showAttributesWindow(){
				$opts.show(); 
			});
			$("#ithoughts_tt_gl-tinymce-close-attrs").click(function closeDiscardAttributesWindow(){
				$opts.hide();
			});
			$("#ithoughts_tt_gl-tinymce-validate-attrs").click(function closeAcceptAttributesWindow(){
				var $form = $("#ithoughts_tt_gl-tooltip-form-options form"),
					form = $form[0],
					formElems = form.elements,
					formFields = formElems.length,
					tristates = {},
					valid = true,
					i = -1,
					attributes = {},
					attributesList = $("#attributes-list option").map(function(){
						return this.value;
					}).toArray();
				while(++i < formFields && valid){
					var validity = formElems[i].validity;
					valid &= validity.valid;
					if(!validity.valid){
						console.log("Form field invalid", formElems[i], validity);
						formElems[i].focus();
					}
				}
				if(!valid) return;

				$form.find(".ithoughts-tristate").each(function(){
					console.log($(this).serializeInputsObject({"-1": false, 0: null, 1: true}[this.dataset.state]));
					$.extend(true, tristates, $(this).serializeInputsObject({"-1": false, 0: null, 1: true}[this.dataset.state]));
				});
				tooltipOpts = $.extend(true, $form.serializeObject(), tristates);


				for(var types = ["span", "link"], i = 0; i < 2; i++){
					attributes[types[i]] = {};
					for(var arrK = tooltipOpts['attributes-' + types[i] + "-key"] || [],
						arrV = tooltipOpts['attributes-' + types[i] + "-value"] || [], j = 0, J = Math.min(
						arrK.length,
						arrV.length
					); j < J; j++){
						if(arrK[j] && arrV[j]){
							var prefix = attributesList.indexOf(arrK[j]) > -1 ? "" : 'data-';
							attributes[types[i]][prefix + arrK[j]] = arrV[j];
						}
					}
					delete tooltipOpts['attributes-' + types[i] + "-key"];
					delete tooltipOpts['attributes-' + types[i] + "-value"];
				}
				tooltipOpts["attributes"] = attributes;


				console.log(tooltipOpts);
				$opts.hide();
			});
			$("#qtip-keep-open").change(function(){
				var modeInput = ithoughts.gei("qtiptrigger"),
					textInput = ithoughts.gei("qtiptriggerText"),
					oldValue;
				return function lockQtipTrigger(){
					if(this.checked){
						oldValue = modeInput.value;
						modeInput.value = (textInput.value = "click");
						modeInput.disabled = !(textInput.disabled = false);
					} else {
						modeInput.value = (textInput.value = oldValue);
						modeInput.disabled = !(textInput.disabled = true);
					}
				}
			}());
			$('[name^="position[my]"]').change(function(){
				var base = 'position[my][',
					inputV = gei(base + '1]'),
					inputH = gei(base + '2]'),
					inputS = gei(base + 'invert]');
				return function changePositionMy(){
					inputV.required = inputH.required = inputV.value || inputH.value || inputS.checked;
				}
			}());
			$('[name^="position[at]"]').change(function(){
				var base = 'position[at][',
					inputV = gei(base + '1]'),
					inputH = gei(base + '2]');
				return function changePositionMy(){
					inputV.required = inputH.required = inputV.value || inputH.value;
				}
			}());
			$("#kv-pair-link-attrs-add,#kv-pair-span-attrs-add").bind("mousedown touchstart", function(){
				var $container = $(this).parent().find(".ithoughts-attrs-container"),
					type = $container.attr("data-attr-family");

				skip[type] = true;
			}).bind("mouseup touchend", function(){
				var $container = $(this).parent().find(".ithoughts-attrs-container"),
					$invalidInputs = $container.find("input:invalid").filter(filterPrototypeInputs),
					type = $container.attr("data-attr-family");

				if($invalidInputs.length > 0){
					skip[type] = true;
					$invalidInputs.eq(0).focus();
					checkRemoveAttr.call($invalidInputs.get(0));
					return;
				}
				skip[type] = false;

				var $prototype = $container.find(".ithoughts-prototype"),
					$clone = $prototype.clone().removeClass("ithoughts-prototype"),
					newIdParts = [
						'attributes-'+type+'-',
						'-'+(new Date().getTime())
					];
				$clone.find('.dynamicId').each(function(){
					var $this = $(this),
						newId = newIdParts[0] + ($this.hasClass("dynamicId-key") ? 'key' : 'value') + newIdParts[1];
					$this.attr(this.tagName == "LABEL" ? "for" : "id", newId)
				});
				$clone.find("input").prop("required", true).prop("disabled", false);
				$container.append($clone);
				$clone.find("input").blur(checkRemoveAttr).eq(0).focus();
				checkRemoveAttr.call($clone.find("input").get(0));
			});
			$(".ithoughts-attrs-container input").blur(checkRemoveAttr);
		})();
	});
})(Ithoughts);