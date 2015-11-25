(function($){
	$(document).ready(function(){
		//Generic tab switching
		$('.tabs li').click(function(event){
			if($(this).hasClass('active')){
				return;
			}
			$(this).parent().find('.active').removeClass('active');
			$(this).addClass('active');

			$(event.target).parent().parent().find(' > .active').removeClass('active');
			$($(event.target).parent().parent().children()[$(event.target).index() + 1]).addClass('active');
		});

		var editor = tinymce.init({
			selector: "#ithoughts_tt_gl-tooltip-form-container .tinymce",
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

		// Mode switcher
		$(".modeswitcher").on("click keyup", function(){
			var id = this.id;
			$('[data-' + id + ']:not([data-' + id + '="mediatip-' + this.value + '-type"])').hide();
			$('[data-' + id + '="mediatip-' + this.value + '-type"]').show();
		}).keyup();;

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
				console.log(json);

				if (0 > jQuery.trim(json.url.length)) {
					return;
				}

				jQuery("#image-box-data").val(JSON.stringify({
					url:json.url,
					id: json.id,
					link: json.link
				}));
				jQuery('#image-box')[0].innerHTML = '<img src="' + json.url + '"/>';
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
			function resizeWindow(){
				var top = completerHolder.offset().top;
				var bottom = $(window).height() + $(window).scrollTop();
			}
			$(window).resize(resizeWindow);

			function losefocustest(){
				if(!completerHolder.find("*:focus") && !input.is(":focus")){
					completerHolder.addClass("hidden");
				}
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
						completerHolder.append($.parseHTML('<div tabindex="0" class="option" data-id="' + item.id + '" data-excerpt="' + item.content + '"><p><b>' + item.title + '</b><br><em>' + item.slug + '</em></p></div>'));
					}
				} else {
					completerHolder.append($.parseHTML('<p style="text-align:center"><em>No results</em><p>'));
				}
				completerHolder.removeClass("hidden");
				setTimeout(resizeWindow,25);
				completerHolder.find(".option").on("focusout", losefocustest).on("click", function(e){
					$('[name="glossary_term_id"]').val(e.currentTarget.getAttribute("data-id"));
					input[0].value = $(e.currentTarget).find("p > b").text();
					completerHolder.addClass("hidden");
				});
			}
			var request = null;
			input.on("keyup focusin", function(){
				if(request)
					request.abort();
				searchedString = removeAccents($(this).val().toLowerCase());
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
							console.log("Outdated response");
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
					text: $("#itghouts_tt_gl_text").val()
				}
				switch(data.type){
					case "glossary":{
						data = $.extend(data, {
							glossary_id: $('[name="glossary_term_id"]').val()
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
									mediatip_content: $("#image-box-data").val()
								});
							}break;

							case "webimage":{
								data = $.extend(data, {
									mediatip_content: $("#mediatip_url_image").val()
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
				$("#ithoughts_tt_gl-tooltip-form-container")[0].finish(data);
			});
			$(".ithoughts_tt_gl-tinymce-discard").click(function(){
				setTimeout(function(){removeEditor('ithoughts_tt_gl-tooltip-content')}, 500);
				$("#ithoughts_tt_gl-tooltip-form-container")[0].finish()
			});
		}

		// Refactor urls of mediatips
		{
			$("#mediatip_url_video_link").bind("keyup mouseup change click focusin focusout", function(){
				var videodata = null;
				var formats = {
					direct: {
						regex: /^(.*\.mp4)(\?.*)?$/,
						embed: '<video width="400" height="222" controls="controls"><source src="$1" type="video/mp4" /></video>',
						video: '$1'
					},
					youtube: {
						regex: /^(?:https?:\/\/(?:youtu\.be\/|\w*\.youtube\.\w{2,3}\/watch\?v=)|<iframe .*?src="https?:\/\/\w*\.youtube\.\w{2,3}\/embed\/)([a-zA-Z0-9]*).*$/,
						embed: '<iframe width="420" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>',
						video: 'https://www.youtube.com/watch?v=$1'
					},
					dailymotion: {
						regex: /^(?:https?:\/\/(?:dai\.ly\/|\w*\.dailymotion\.\w{2,3}\/video\/)|<iframe .*?src=".*?\w*\.dailymotion\.\w{2,3}\/embed\/video\/)([a-zA-Z0-9]*).*/,
						embed: '<iframe width="420" height="315" src="https://www.dailymotion.com/embed/video/$1" frameborder="0" allowfullscreen></iframe>',
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
	});
})(jQuery);