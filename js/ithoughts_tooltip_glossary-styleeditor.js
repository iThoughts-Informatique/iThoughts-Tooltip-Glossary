(function(){
	$d.ready(function(){
		var langTools = ace.require("ace/ext/language_tools");

		$(".simpleajaxform")[0].simple_ajax_callback = function(res){
			console.log("Callback", res);
			if(res.valid){
				var styleTag = $("#ithoughts_tt_gl-custom_theme");
				if(styleTag.length == 0){
					styleTag = $($.parseHTML('<style id="ithoughts_tt_gl-custom_theme"></style>'));
					$('body').append(styleTag);
				}
				styleTag[0].innerHTML = res.css;

				window.updateStyle(null, res.theme_name);
			}
		};
		console.log($(".simpleajaxform")[0]);

		(["g_custom","t_custom","c_custom"]).map(function(elem){
			var editor = ace.edit(elem);
			setAceOpts(editor);
			var textarea = $("[data-ace-id=\"" + elem + "\"]");
			editor.getSession().on('change', function () {
				textarea.val(editor.getSession().getValue());
			});
		})

		function setAceOpts(editor){
			editor.setTheme("ace/theme/monokai");
			editor.getSession().setMode("ace/mode/less");
			editor.getSession().setUseWrapMode(true);
			console.log(editor.getSession().getState());
			//editor.setState("css");
			editor.setShowPrintMargin(false);
			editor.setOptions({
				tooltipFollowsMouse: true,
				displayIndentGuides: true,
				fontSize: "20px",
				cursorStyle: "wide",
				highlightSelectedWord: true,
				highlightActiveLine: true,
				behavioursEnabled: true,
				showFoldWidgets: true,
				enableBasicAutocompletion: true,
				enableSnippets: true,
				enableLiveAutocompletion: true
			});
		}

		window.refloat();
		$('.color-field').each(function(index, elem){
			elem.setAttribute("name", elem.getAttribute("name"));
			var hidden = elem.cloneNode(true);
			$(elem).parent().append($(hidden).css("display", "none").prop("name", $(hidden).prop("name") + "_hidden").prop("id", $(hidden).prop("id") + "_hidden"));
			Object.defineProperty(elem,"value",{
				get:function(){
					return this.getAttribute("value");
				},
				set:function(val){

					//update value of myInputVisible on myInput set
					hidden.value = val;

					// handle value change here
					this.setAttribute("value",val);

					//fire the event
					if ("createEvent" in document) {  //NON IE browsers
						var evt = document.createEvent("HTMLEvents");
						evt.initEvent("change", false, true);
						elem.dispatchEvent(evt);
					}
					else {  //IE
						var evt = document.createEventObject();
						elem.fireEvent("onchange", evt);
					}
				}
			});
		}).wpColorPicker();
		/*	var prefixes = ["t","c","g"];
	for(var i = 0,l = prefixes.length; i < l; i++){
		gradX('#' + prefixes[i] + '_grad',{
			sliders: [
				{
					color: "rgb(0,0,0)",
					position: 0
				},
				{
					color: "rgb(255,255,255)",
					position: 100
				}
			]
		});
	}*/



		{
			/* Init mode switchers */
			{
				function childAtDepth(selector, target, maxdepth){
					var found = false;
					var cdepth = 0;
					do{
						var ntarget = target.find(selector);
						if(ntarget.length > 0){
							found = true;
							target = ntarget;
						} else {
							target = $(target.parent());
							cdepth++;
						}
					} while(cdepth <= maxdepth && !found);
					if(found)
						return target;
					return false;
				}


				var depth = 2;
				$('select.modeswitcher').each(function(index, elem){
					$(elem).bind("keydown click change", function(e){
						var target = $(this);
						var mode = $(this).val();
						var notmode = [];
						{
							var notmodes = $(this).find("option");
							for(var i = 0; i < notmodes.length; i++){
								notmode.push(notmodes[i].getAttribute("value"));
							}
						}
						notmode = notmode.filter(function(elem){
							return elem != mode;
						});
						var found = false;
						var cdepth = 0;
						var count = notmode.length;
						for(var i = 0; i < count; i++){
							var deactivated = childAtDepth('[data-switcher-mode="' + notmode[i] + '"]', target, depth);
							if(deactivated)
								deactivated.css("display", "none");
						}
						var activated = childAtDepth('[data-switcher-mode="' + mode + '"]', target, depth);
						if(activated === false){
							console.warn("Can't find switcher-mode " + mode + '" at max-depth ' + depth + ' for element', this);
							return;
						} else {
							activated.css("display", "block");
						}
					}).change();
				});
			}

			// Postboxes
			{
				$("#customizing-form .postbox").each(function(index, elem){
					$(elem).find(".hndle").click(function(){
						$(elem).toggleClass("closed");
					})
				});
			}

			/* Get fonts for font selectors */
			/**/
			{
				// Firest, we need to reload all stylesheets in cross-origin to access rules
				function listFontFaceRules(){
					var fonts = {};
					var il = document.styleSheets.length;
					for(var i = 0; i < il; i++){
						try{
							var stylesheet = document.styleSheets[i].cssRules;
							var jl;
							if(typeof stylesheet != "undefined" && stylesheet)
								jl = stylesheet.length;
							else
								jl = 0;
							for(var j = 0; j < jl; j++){
								var rule = stylesheet[j];
								if(rule instanceof CSSFontFaceRule){
									if(!fonts[rule.style.getPropertyValue("font-family")]){
										fonts[rule.style.getPropertyValue("font-family")] = {};
									}
									if(!fonts[rule.style.getPropertyValue("font-family")][rule.style.getPropertyValue("font-style")]){
										fonts[rule.style.getPropertyValue("font-family")][rule.style.getPropertyValue("font-style")] = [];
									}
									fonts[rule.style.getPropertyValue("font-family")][rule.style.getPropertyValue("font-style")].push(rule.style.getPropertyValue("font-weight"));
								}
							}
						} catch(e){
							console.error("Error while retrieving font list", e, i);
							continue;
						}
					}
					var out = {};
					for(var family in fonts){
						var out2 = {};
						var familyT = fonts[family];
						for(var familySub in familyT){
							var familySubT = familyT[familySub];
							if(family != ""){
								var outFamilySubT = (function() {
									var a = [];
									for (var i=0, l=familySubT.length; i<l; i++)
										if (a.indexOf(familySubT[i]) === -1)
											a.push(familySubT[i]);
									return a;
								})().filter(function(el){
									return el !== "";
								});
								if(outFamilySubT.length > 0){
									var newObj = {};
									var renamedFamily = family.replace(/^['"]?(.+?)['"]?$/, "$1");
									newObj[renamedFamily] = {};
									newObj[renamedFamily][familySub] = outFamilySubT;
									out = $.extend(out, newObj);
								}
							}
						}
					}
					console.log("Fonts available:",out);
					for(var family in out){
						$('[name$="_tf"]').append($.parseHTML('<option value="' + encodeURIComponent(family) + '">' + family + '</option>'));
					}
					$('[name$="_tf"] option[value=""]').text("Please select...");
				}
				var waitFor = [];
				var stylesContainer = $($.parseHTML('<div id="ithoughts_tt_gl_stylesheets"></div>'));
				$("body").append(stylesContainer);
				$("link[rel=\"stylesheet\"]").each(function(index, elem){
					var newelem = $(elem).clone();
					newelem[0].setAttribute("crossorigin", "anonymous");
					var newhref = newelem[0].getAttribute("href") + "#";
					waitFor.push(newhref);
					newelem[0].setAttribute("href", newhref);
					stylesContainer.append(newelem);
					newelem[0].onload = function(e){
						waitFor.splice(waitFor.indexOf(e.target.getAttribute("href")), 1);
						if(waitFor.length == 0)
							listFontFaceRules();
					}
				});
			}
			/**/

			{
				$("input[pattern]").on("change keyup click", function(e){
					if(e.target.value.match(new RegExp(e.target.getAttribute("pattern")))){
						if($(e.target).qtip('api')){
							$(e.target).qtip('api').destroy();
						}
					} else {
						e.target.removeAttribute("title");
						if($(e.target).qtip('api')){
							$(e.target).qtip('api').set("content.text", e.target.getAttribute("data-pattern-infos"));
						} else {
							$(e.target).qtip({
								content:{
									text: e.target.getAttribute("data-pattern-infos"),
									title: {
										text: "Invalid format"
									}
								},
								hide: "focusout",
								position:{
									at:"center right",
									my:"bottom left",
									viewport: $("body"),
									container: $("#ithoughts_tooltip_glossary-tipsContainer")
								},
								show:{
									ready:true,
									event:"focusin"
								}
							});
						}
					}
				});
			}
		}

		/* Init child form controllers */
		{
			$("[data-child-form-controled]").each(function(index, element){
				var groupname = element.getAttribute("data-child-form-controled");
				$(element).bind("click change", function(){
					var isActive = element.checked;
					$('[data-child-form="' + groupname + '-true"]').prop("disabled", !isActive);
					$('[data-child-form="' + groupname + '-false"]').prop("disabled", isActive);
				}).change();
			});
		}
		$("#copyclip").bind("click", function(e){
			e.preventDefault();

			form.outputcss.select();
			var res = $("#copyclipres");
			if(document.queryCommandSupported('copy') && document.execCommand('copy')){
				res.text(res[0].getAttribute("data-text-success")).removeClass().addClass("updated");
			} else {
				res.text(res[0].getAttribute("data-text-error")).removeClass().addClass("error");
			}
			if ( document.selection ) {
				document.selection.empty();
			} else if ( window.getSelection ) {
				window.getSelection().removeAllRanges();
			}
		});

		{
			var theme = $('[name="themename"]').val()
			if(theme != "" && theme){
				console.log("Setting theme", theme);
				window.updateStyle(null, theme);
			}
		}
	});
})()