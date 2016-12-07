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
        i_t_g_e	= ithoughts_tt_gl_editor;
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
                request = null,
                advOpts = {};

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
                searchedString = i_t_g_e.removeAccents($(this).val().toLowerCase());
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
                    link: $("#ithoughts_tt_gl_link").val(),
                    opts: advOpts
                }
                i_t_g_e.log("Before per-type form data handling:",data);
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
                i_t_g_e.finishTinymce(data);
            });
            $("#ithoughts_tt_gl-tinymce-discard").click(function(){
                setTimeout(function(){removeEditor('ithoughts_tt_gl-tooltip-content')}, 500);
                i_t_g_e.finishTinymce();
            });
            (function initAdvancedOptions(){
                $(".ithoughts-tristate").each(function(){
                    var t = this,
                        $t = $(t);

                    // From https://css-tricks.com/indeterminate-checkboxes/
                    $t.click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        
                        console.log(t, $t.data()["state"])
                        switch($t.data()["state"]) {
                                // unchecked, going indeterminate
                            case -1:
                                $t.data('state',0);
                                t.checked = false;
                                t.indeterminate = true;
                                break;

                                // indeterminate, going checked
                            case 0:
                                $t.data('state',1);
                                t.checked = true;
                                t.indeterminate = false;
                                break;

                                // checked, going unchecked
                            default:
                                $t.data('state',-1);
                                t.checked = false;
                                t.indeterminate = false;
                        }
                    });
                })
                var advOptsForm = $("#ithoughts_tt_gl-advancedOptions-form"),
                    advOptsContainer = $("#ithoughts_tt_gl-tooltip-form-options");
                $("#ithoughts_tt_gl-tinymce-advancedOptions").click(function(){
                    advOptsContainer.toggle();
                });
                $("#ithoughts_tt_gl-tinymce-options-discard").click(function(){
                    advOptsContainer.hide();
                });
                $("#ithoughts_tt_gl-tinymce-options-validate").click(function(){
                    advOpts = advOptsForm.serializeObject();
                    i_t_g_e.info("Tooltip advanced options:", advOpts);
                    advOptsContainer.hide();
                });
            }());
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

		(function initAdvancedConfiguration(){
			var $opts = $("#ithoughts_tt_gl-tooltip-form-options"),
					span:false,
				skip = {
					link:false
			$opts.find('input[type="checkbox"].ithoughts-tristate').attr("data-state", function(i, attrVal){
				};
			}).change(function(e){
				return ((attrVal || 0) - 1) % 3 + 2;
				var s = $(this),
					ts = ((s.attr("data-state")||0) - 2) % 3 + 1;
				s.attr("data-state", ts);
				this.checked = ts == 1;
				this.indeterminate = ts == 0;
			}).change();

				return $(this).closest('.ithoughts-prototype').length === 0;
			function filterPrototypeInputs(){
			}
			function checkRemoveAttr(){
				var thisInput = $(this),
					$container = thisInput.parent().parent(),
					otherInput = $container.find("input").filter(function(){
					});
						return this != thisInput.get(0);

				setTimeout(function(){

					var type = thisInput.closest(".ithoughts-attrs-container").attr("data-attr-family");


						skip[type] = false;
					if(skip[type]){
					}
						return;
					thisInput.val(thisInput.val().trim());
					otherInput.val(otherInput.val().trim());


				},100);
					}
					if(!thisInput.val() && !otherInput.val() && document.activeElement != thisInput.get(0) && document.activeElement != otherInput.get(0)){
						$container.remove();
			}
			$("#ithoughts_tt_gl-tinymce-advanced_options").click(function showAttributesWindow(){
				$opts.show(); 
			});
			$("#ithoughts_tt_gl-tinymce-close-attrs").click(function closeDiscardAttributesWindow(){
			});
				$opts.hide();
			$("#ithoughts_tt_gl-tinymce-validate-attrs").click(function closeAcceptAttributesWindow(){
					form = $form[0],
				var $form = $("#ithoughts_tt_gl-tooltip-form-options form"),
					formElems = form.elements,
					tristates = {},
					valid = true,
					formFields = formElems.length,
					i = -1,
					attributesList = $("#attributes-list option").map(function(){
				if(!valid) return;
					}
				}
						formElems[i].focus();
					if(!validity.valid){
					var validity = formElems[i].validity;
					valid &= validity.valid;
				while(++i < formFields && valid){
					}).toArray();
						return this.value;
					attributes = {},

				$form.find(".ithoughts-tristate").each(function(){
					$.extend(true, tristates, $(this).serializeInputsObject({"-1": false, 0: null, 1: true}[this.dataset.state]));
				});
				tooltipOpts = $.extend(true, $form.serializeObject(), tristates);


				for(var types = ["span", "link"], i = 0; i < 2; i++){
					attributes[types[i]] = {};
					for(var arrK = tooltipOpts['attributes-' + types[i] + "-key"] || [],
						arrK.length,
						arrV = tooltipOpts['attributes-' + types[i] + "-value"] || [], j = 0, J = Math.min(
						arrV.length
					); j < J; j++){
						if(arrK[j] && arrV[j]){
							attributes[types[i]][prefix + arrK[j]] = arrV[j];
							var prefix = attributesList.indexOf(arrK[j]) > -1 ? "" : 'data-';
						}
					}
					delete tooltipOpts['attributes-' + types[i] + "-value"];
					delete tooltipOpts['attributes-' + types[i] + "-key"];
				}

				tooltipOpts["attributes"] = attributes;

				$opts.hide();
			});
			$("#qtip-keep-open").change(function(){
				var modeInput = ithoughts.gei("qtiptrigger"),
					textInput = ithoughts.gei("qtiptriggerText"),
					oldValue;
				return function lockQtipTrigger(){
					if(this.checked){
						oldValue = modeInput.value;
						modeInput.disabled = !(textInput.disabled = false);
						modeInput.value = (textInput.value = "click");
						modeInput.value = (textInput.value = oldValue);
					} else {
						modeInput.disabled = !(textInput.disabled = true);
					}
				}
			}());
			$('[name^="position[my]"]').change(function(){
				var base = 'position[my][',
					inputV = gei(base + '1]'),
					inputH = gei(base + '2]'),
				return function changePositionMy(){
					inputS = gei(base + 'invert]');
					inputV.required = inputH.required = inputV.value || inputH.value || inputS.checked;
			}());
				}
			$('[name^="position[at]"]').change(function(){
				var base = 'position[at][',
					inputV = gei(base + '1]'),
				return function changePositionMy(){
					inputH = gei(base + '2]');
					inputV.required = inputH.required = inputV.value || inputH.value;
			}());
				}
			$("#kv-pair-link-attrs-add,#kv-pair-span-attrs-add").bind("mousedown touchstart", function(){
				var $container = $(this).parent().find(".ithoughts-attrs-container"),
					type = $container.attr("data-attr-family");

			}).bind("mouseup touchend", function(){
				skip[type] = true;
				var $container = $(this).parent().find(".ithoughts-attrs-container"),
					$invalidInputs = $container.find("input:invalid").filter(filterPrototypeInputs),
					type = $container.attr("data-attr-family");

				if($invalidInputs.length > 0){
					skip[type] = true;
					$invalidInputs.eq(0).focus();
					checkRemoveAttr.call($invalidInputs.get(0));
					return;
				skip[type] = false;
				}

					$clone = $prototype.clone().removeClass("ithoughts-prototype"),
				var $prototype = $container.find(".ithoughts-prototype"),
					newIdParts = [
						'-'+(new Date().getTime())
						'attributes-'+type+'-',
					];
				$clone.find('.dynamicId').each(function(){
					var $this = $(this),
					$this.attr(this.tagName == "LABEL" ? "for" : "id", newId)
						newId = newIdParts[0] + ($this.hasClass("dynamicId-key") ? 'key' : 'value') + newIdParts[1];
				});
				$clone.find("input").prop("required", true).prop("disabled", false);
				$container.append($clone);
				$clone.find("input").blur(checkRemoveAttr).eq(0).focus();
				checkRemoveAttr.call($clone.find("input").get(0));
			});
			$(".ithoughts-attrs-container input").blur(checkRemoveAttr);
		})();
    });
})(Ithoughts.v4);