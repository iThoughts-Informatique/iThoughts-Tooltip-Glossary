/**
 * @file Client-side scripts for handling tooltip creation wizzard in Wordpress TinyMCE
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 */

(function(ithoughts){
	'use strict';

	var $		= ithoughts.$,
		$d		= ithoughts.$d,
		$w		= ithoughts.$w,
		i_t_g	= ithoughts_tt_gl;
	$d.ready(function(){
		//Generic tab switching
		$('.tabs li').click(function(event){
			if($(this).hasClass('active')){
				return;
			}
			$(this).parent().find('.active').removeClass('active');
			$(this).addClass('active');

			$(event.target).parent().parent().find(' > .active').removeClass('active');
			var index = $(event.target).index();
			$($(event.target).parent().parent().children()[index + 1]).addClass('active');

			var linkInput = $("#ithoughts_tt_gl_link");
            // Only Glossary tooltip (tab @ index 0) disable the custom link editor
			linkInput.prop("disabled", index == 0);
		});

		var $editors = $("#ithoughts_tt_gl-tooltip-form-container .tinymce");
		$editors.each(function(index, editor){
			var text = editor.value;
			while(editor.getAttribute("id") == null){
				var newId = "editor" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
				if(!$(newId).length){
					editor.setAttribute("id", newId);
				}
			}
			var editorId = editor.getAttribute("id");
			tinymce.init({
				selector: "#" + editorId,
				menubar: false,
				external_plugins: {
					code: ithoughts_tt_gl_tinymce_form.base_tinymce + "/code/plugin.min.js",
					wordcount: ithoughts_tt_gl_tinymce_form.base_tinymce + "/wordcount/plugin.min.js"
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
			onclickEntryPoint = this;

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
				$('#image-box').html('<img src="' + json.url + '"/>');
				$('#mediatip_caption').val(json.caption);
				$("#ithoughts_tt_gl_link").val(json.link);
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

			var input = $("#glossary_term"),
                completerHolder = $("#glossary_term_completer"),
                completerHolderContainer = $("#glossary_term_completer_container"),
                searchedString = "",
                request = null;
            
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
				ithoughts_tt_gl_tinymce_form.terms.map(function(element){
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
			input.on("keyup focusin", function(){
				if(request)
					request.abort();
				searchedString = i_t_g.removeAccents($(this).val().toLowerCase());
				request = $.ajax({
						url: ithoughts_tt_gl_tinymce_form.admin_ajax,
						method: "POST",
						dataType:"json",
						data:{
							action: "ithoughts_tt_gl_get_terms_list",
							search: searchedString
						},
						complete: function(res){
							var response = res.responseJSON;
							if(typeof response == "undefined" || !response.success)
								return;
							if(response.data.searched != searchedString){
								console.info("Outdated response");
								return;
							}
							ithoughts_tt_gl_tinymce_form.terms = response.data.terms;
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
					text: $("#ithoughts_tt_gl_text").val(),
					link: $("#ithoughts_tt_gl_link").val()
				}
                i_t_g.log("Before per-type form data handling:",data);
				switch(data.type){
					case "glossary":{
						data = $.extend(data, {
							glossary_id: $('[name="glossary_term_id"]').val(),
							disable_auto_translation: $('[name="glossary_disable_auto_translation"]').is(':checked')
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
			$("#ithoughts_tt_gl-tinymce-discard").click(function(){
				setTimeout(function(){removeEditor('ithoughts_tt_gl-tooltip-content')}, 500);
				ithoughts_tt_gl.finishTinymce();
			});
		}

		// Refactor urls of mediatips
		{
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
		}

		// Init attrs adders
		{
			var elems = ["span","link"];
			elems.forEach(function(elem){
				$("#kv-pair-"+elem+"-attrs-add").click((function(){
					var elemKey = $("#attributes-"+elem+"-key");
					var elemValue = $("#attributes-"+elem+"-value");
					var targetContainer = $("#kv-pair-"+elem+"-attrs")
					return function(){
						if(elemKey.val().length > 0){
							var newElem = '<div id="' + elemKey.val() + '"><button class="delete button" type="button">x</button><div class="kv"><p class="key">' + elemKey.val() + '<p class="value">' + elemValue.val() + '</p></div></div>';
							elemKey.val("");
							elemValue.val("");
							newElem = $($.parseHTML(newElem));
							newElem.find(".delete").click(function(){
								newElem.remove();
							});
							targetContainer.append(newElem);
						}
					};
				})());
			});
		}
	});
})(Ithoughts.v4);