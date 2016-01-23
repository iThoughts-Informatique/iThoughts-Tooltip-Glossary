ithoughts_tt_gl["initStyleEditor"] = function($){
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


	var $form = $("#customizing-form");
	var form = $form[0];
	$form.find("input, select, textarea").bind("change", generateCSS);
	function generateCSS(){
		$('#copyclip').prop("disabled", true);
		var isValid = true;
		$form.find("input, select, textarea").each(function(index, elem){
			if(!isValid) return;
			isValid &= elem.checkValidity();
			if(!elem.checkValidity()){
				console.log(elem.name, "is invalid");
				elem.focus();
				return;
			}
		});
		if(!isValid) return;
		$('#copyclip').prop("disabled", false);

		var out = {
			global: {},
			title: {},
			content: {},
			unclassed: {}
		};

		var types = {
			"g_": "global",
			"c_": "content",
			"t_": "title",
		}
		var properties = {/*
			bt: function(type, value){
				return "background:%VAL%;".replace(
					/%VAL%/g,
					(function(){
						switch(value){
							case "plain":{
								return form[type + "plain"].value;
							} break;

							case "gradient":{
							} break;
						}
					})()
				);
			},*/
			plain: "background:%VAL%",
			"sh-e": function(type, value, elem){
				return "-webkit-box-shadow:%VAL%;box-shadow:%VAL%".replace(
					/%VAL%/g,
					(function(){
						if(elem.checked){
							return [form["sh-h"], form["sh-w"], form["sh-s"], form["sh-c"]].map(function(elem){return elem.value}).join(" ") + (form["sh-i"].checked ? " inset" : "");
						} else
							return "none";
					})()
				)
			},
			tce: "color:%VAL%",
			pd: "padding:%VAL%",
			"border-w": function(type, value, elem){
				out["unclassed"]["tipcolor"] = "background-color: " + form["border-c"].value;
				return "border:%VAL%;".replace(
					/%VAL%/g,
					(function(){
						return [form["border-w"], form["border-s"], form["border-c"]].map(function(elem){return elem.value}).join(" ");
					})()
				);
			},
			ts: "font-size:%VAL%",
			tf: function(type, value, elem){
				return "font-family:\"" + decodeURIComponent(value) + "\",sans-serif"
			},
			lh: "line-height:%VAL%",
			tc: "color:%VAL%",
			ta: "text-align:%VAL%",
			custom: "%VAL%"
		};

		$form.find("input, select, textarea").each(function(index, elem){
			// console.log(index, elem);
			var cutprop = elem.name.match(/^(.*?_)?([\w\d\-]*)$/);
			var property = cutprop[2];
			var type = cutprop[1];
			type = (typeof types[type] != "undefined" && types[type]) ? types[type] : "unclassed"; 
			// console.log(elem.name, property);
			if(typeof properties[property] != "undefined" && properties[property]){
				if(typeof properties[property] == "string"){
					out[type][property] = properties[property].replace(/%VAL%/g, elem.value);
				} else if(typeof properties[property] == "function"){
					out[type][property] = properties[property](
						function(t){
							if(typeof t == "undefined" || t == null)
								return "unclassed";
							else
								return t;
						}(Object.keys(types).filter(function(key) {return types[key] === type})[0]),
						elem.value,
						elem
					);
				} else {
					console.warn("Unhandled property type",typeof properties[property], "for property", property);
				}
			}
		});
		console.log(out);

		var selectors = {
			"global" : ".qtip-" + form.theme_name.value,
			"title" : ".qtip-" + form.theme_name.value + " .qtip-titlebar",
			"content" : ".qtip-" + form.theme_name.value + " .qtip-content"
		}
		var style = "";

		(out["global"]["box-shadow"] = out["unclassed"]["sh-e"]) && delete out["unclassed"]["sh-e"];
		(out["global"]["border"] = out["unclassed"]["border-w"]) && delete out["unclassed"]["border-w"];

		for(var selector in selectors){
			style += selectors[selector] + "{";
			for(var key in out[selector]){
				if(out[selector][key] && out[selector][key].length > 0)
					style += "\n\t" + out[selector][key] + ";";
			}
			style += "\n}\n\n";
		}
		if(out['unclassed']["custom"] && out['unclassed']["custom"].length > 0){
			style += out['unclassed']["custom"]
		}
		if(out['unclassed']["tipcolor"] && out['unclassed']["tipcolor"].length > 0){
			style += selectors["global"] + " .qtip-tip{\n\t" + out['unclassed']["tipcolor"] + "\n}\n\n";
		}
		if(out['unclassed']["tce"] && out['unclassed']["tce"].length > 0){
			var splitter = ","
			var joiner = splitter + selectors["content"] + " ";
			style += (joiner + ["a","em"].join(joiner)).slice(splitter.length) + "{\n\t" + out['unclassed']["tce"] + "\n}\n\n";
		}

		form.outputcss.value = style;
		var styleTag = $("#ithoughts_tt_gl-custom_theme");
		if(styleTag.length == 0){
			styleTag = $($.parseHTML('<style id="ithoughts_tt_gl-custom_theme"></style>'));
			$('body').append(styleTag);
		}
		styleTag[0].innerHTML = style;

		window.updateStyle(null, form.theme_name.value);
	}
	$("#compilecss").bind("click", function(e){
		e.preventDefault();

		generateCSS();
	});
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
}