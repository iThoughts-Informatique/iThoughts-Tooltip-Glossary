/**
 * @file TinyMCE plugin scripts
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
 * @package ithoughts-tooltip-glossary
 *
 */

(function(ithoughts) {
	'use strict';

	var $ = ithoughts.$,
		$w = ithoughts.$w,
		i_t_g = ithoughts_tt_gl,
		prefix1 = 'ithoughts_tt_gl',
		prefix2 = prefix1+'_tinymce',
		prefix3 = "ithoughts-tooltip-glossary",
		prefix4 = "ithoughts_tooltip_glossary",
		stripQuotes = i_t_g.stripQuotes,
		isNA = ithoughts.isNA;

	tinyMCE.setToggleable = function(element, editor) {
		return function(){
			var self = this;
			editor.on(element, function(e) {
				self.active(e.active);
			});
		};
	};

	tinymce.PluginManager.add(prefix2, function registerTinyMCEPlugin(editor, url) {
		// Add a button that opens a window
		editor.addButton('glossaryterm', {
			title : editor.getLang(prefix2+'.add_tooltip'),
			image : url + '/icon/glossaryterm.png',
			onclick: glossarytermfct,
			onPostRender: tinymce.setToggleable('glossaryterm', editor)
		});
		var listtabI = 0;
		editor.addButton('glossarylist', {
			title :editor.getLang(prefix2+'.add_index'),
			image : url + '/icon/glossaryindex.png',
			onPostRender: tinymce.setToggleable('glossarylist', editor),
			onclick: glossarylistfct
		});

		//CSS
		editor.contentCSS.push(url + "/../css/"+prefix1+"-admin.css?v=2.1.7");

		//fcts
		function glossarylistfct(event){
			var values = {
				list: {
					alpha: "",
					cols: "",
					desc: "",
					group: ""
				},
				atoz: {
					group: "",
					alpha: "",
					lazy: true
				},
				type: 0
			};
			var mode = "insert_content";

			sel = editor.selection;
			var ce = sel.getStart();
			if(ce === sel.getEnd()){
				if(ce.getAttribute("data-type") == "ithoughts-tooltip-glossary-atoz"){ // Is atoz
					mode = "load";
					values.type=1;
					values.atoz = {
						alpha: ce.getAttribute("data-alpha"),
						group: ce.getAttribute("data-group"),
						lazy: ce.getAttribute("data-lazy") === "true"
					};
				} else if(ce.getAttribute("data-type") == "ithoughts-tooltip-glossary-term_list"){ // Is term_list
					mode = "load";
					values.type=0;
					values.list = {
						alpha: ce.getAttribute("data-alpha"),
						cols: ce.getAttribute("data-cols"),
						desc: ce.getAttribute("data-desc"),
						group: ce.getAttribute("data-group")
					};
				}
			}
			listtabI = values.type;

			editor.windowManager.open({
				title: editor.getLang(prefix2+'.insert_index'),
				margin: "0 0 0 0",
				padding: "0 0 0 0",
				border: "0 0 0 0",
				body: [
					new tinyMCE.ui.TabPanel({
						margin: "0 0 0 0",
						padding: "0 0 0 0",
						border: "0 0 0 0",
						onclick: function(e){
							try{
								if(e.target.id.match(/^mceu_\d+-t(\d+)$/)){
									listtabI = e.target.id.replace(/^mceu_\d+-t(\d+)$/, "$1");
								}
							} catch(e){}// Nothing to do, private
						},
						items:[
							new tinyMCE.ui.Factory.create({
								type:"form",
								title: editor.getLang(prefix2+'.list'),
								items:[
									{
										type:"textbox",
										label:editor.getLang(prefix2+'.letters'),
										name:"ll",
										value: values.list.alpha,
										tooltip:editor.getLang(prefix2+'.letters_explain')
									},
									{
										type:"textbox",
										label:editor.getLang(prefix2+'.columns'),
										name:"lc",
										value: values.list.cols,
										tooltip:editor.getLang(prefix2+'.columns_explain')
									},
									{
										type:"listbox",
										label:editor.getLang(prefix2+'.description'),
										name:"ld",
										values:[
											{
												text:"None",
												value:""
											},
											{
												text:editor.getLang(prefix2+'.excerpt'),
												value:"excerpt"
											},
											{
												text:editor.getLang(prefix2+'.full'),
												value:"full"
											},
											{
												text:editor.getLang(prefix2+'.glossarytips'),
												value:"glossarytips"
											}
										],
										value: values.list.desc,
										tooltip:editor.getLang(prefix2+'.description_explain')
									},
									{
										type:"textbox",
										label:editor.getLang(prefix2+'.group'),
										name:"lg",
										value: values.list.group,
										tooltip:editor.getLang(prefix2+'.group_explain')
									}
								]
							}),
							new tinyMCE.ui.Factory.create({
								type:"form",
								title:editor.getLang(prefix2+'.atoz'),
								items: [
									{
										type:"textbox",
										label:editor.getLang(prefix2+'.letters'),
										name:"al",
										value: values.atoz.alpha,
										tooltip:editor.getLang(prefix2+'.letters_explain')
									},
									{
										type:"textbox",
										label:editor.getLang(prefix2+'.group'),
										name:"ag",
										value: values.atoz.group,
										tooltip:editor.getLang(prefix2+'.group_explain')
									}/*,
									{
										type: "checkbox",
										label:editor.getLang(prefix2+'.lazy'),
										name:"az",
										checked: values.atoz.lazy,
										tooltip:editor.getLang(prefix2+'.lazy_explain')
									}*/
								]
							})
						],
						activeTab:values.type
					})
				],
				onsubmit: function(e) {
					if(mode == "load")
						sel.select(sel.getStart());
					switch(parseInt(listtabI)){
						case 0:{
							var opts = [];
							if(!!e.data['ll'])
								opts.push('alpha="' + stripQuotes(e.data['ll'], true) + '"');
							if(!!e.data['lg'])
								opts.push('group="' + stripQuotes(e.data['lg'], true) + '"');
							if(!!e.data['lc'])
								opts.push('cols="' + stripQuotes(e.data['lc'], true) + '"');
							if(!!e.data['ld'])
								opts.push('desc="' + stripQuotes(e.data['ld'], true) + '"');
							editor.insertContent('[glossary_term_list' + ((opts.length > 0) ? ' ' + opts.join(' ') : '') + ' /]');
						} break;
						case 1:{
							var opts = [];
							if(!!e.data['al'])
								opts.push('alpha="' + stripQuotes(e.data['al'], true) + '"');
							if(!!e.data['ag'])
								opts.push('group="' + stripQuotes(e.data['ag'], true) + '"');
							editor.insertContent('[glossary_atoz' + ((opts.length > 0) ? ' ' + opts.join(' ') : '') + ' /]');
						} break;
					}
				}
			});
		}

		function glossarytermfct(event){/**/
			var values = {},
				sel = editor.selection,
				mode = "",
				types = ["ithoughts-tooltip-glossary-term", "ithoughts-tooltip-glossary-tooltip", "ithoughts-tooltip-glossary-mediatip"]
			if(sel.getStart() === sel.getEnd()){
				var content = sel.getContent({format: 'text'});
				if(types.indexOf(sel.getStart().getAttribute("data-type")) > -1){ // On Glossary Term or Tooltip or Mediatip, load data
					mode = "load";
					var el = sel.getStart(),
						$el = $(el),
						attrs = {};
					for (var att, i = 0, atts = el.attributes, n = atts.length; i < n; i++){
						att = atts[i];
						attrs[att.nodeName] = att.nodeValue;
					}
					function takeAttr(label, nodata){
						if(isNA(nodata) || !nodata)
							label = "data-" + label;
						var val = attrs[label];
						delete attrs[label];
						return val;
					}


					var position_at = (takeAttr("position-at") || ' ').split(" "),
						position_my = (takeAttr("position-my") || ' ').split(" "),
						my_inverted = (Math.max(position_my.indexOf("top"), position_my.indexOf("bottom")) === 1) || (Math.max(position_my.indexOf("right"), position_my.indexOf("left")) === 0);
					position_at = {
						1: position_at[0],
						2: position_at[1],
					}
					position_my = {
						1: position_my[my_inverted ? 1 : 0],
						2: position_my[my_inverted ? 0 : 1],
						invert: my_inverted ? "enabled" : undefined
					}

					function tristate(val){
						if(val === "true")
							return true;
						if(val === "false")
							return false;
						return null;
					}


					values = {
						text: content,
						link: takeAttr("href",true),
						tooltip_content: stripQuotes(takeAttr("tooltip-content") || content, false),
						glossary_id: takeAttr("glossary-id"),
						term_search: ithoughts.removeAccents(content.toLowerCase()),
						mediatip_type: takeAttr("mediatip-type"),
						mediatip_content: stripQuotes(takeAttr("mediatip-content"), false),
						mediatip_link: takeAttr("mediatip-link"),
						mediatip_caption: takeAttr("mediatip-caption"), 
						type: ["glossary", "tooltip", "mediatip"][types.indexOf(takeAttr("type"))],
						glossary_disable_auto_translation: (takeAttr("disable_auto_translation") || false) === "true",
						opts: {
							termcontent: takeAttr('termcontent'),
							'qtip-keep-open': takeAttr('qtip-keep-open') === "true",
							qtiprounded: tristate(takeAttr('qtiprounded')),
							qtipshadow: tristate(takeAttr('qtipshadow')),
							qtipstyle: takeAttr('qtipstyle'),
							qtiptrigger: takeAttr('qtiptrigger'),
							position: {
								at: position_at,
								my: position_my
							},
							attributes: {
								span: {},
								link: {}
							},
							anim: {
								in: takeAttr("animation_in"),
								out: takeAttr("animation_out"),
								time: takeAttr("animation_time"),
							},
							maxwidth: takeAttr("tooltip-maxwidth")
						}
					};
					console.log("Values:", values);
					for(var i in attrs){
						if(i.match(/^data-link-/)){
							values.opts.attributes.link[i.replace(/^data-link-/,'')] = attrs[i];
						} else {
							values.opts.attributes.span[i.replace(/^data-/,'')] = attrs[i];
						}
					}
				} else { //Create new glossary term
					if(content && content.length > 0){ // If something is selected
						mode = "insert_content"
						values= {
							text: content,
							link: '',
							tooltip_content: content,
							glossary_id: null,
							term_search: ithoughts.removeAccents(content.toLowerCase()),
							mediatip_type: "",
							mediatip_content: "",
							mediatip_caption: "",
							type: "tooltip",
							glossary_disable_auto_translation: false
						};
					} else { // If no selection
						var rng = sel.getRng();
						//Find immediate next && previous chars
						var txt = rng.commonAncestorContainer.textContent;
						var char = /[\w\d]/;
						var txtl = txt.length;
					}
				}
			}
			$.ajax({
				method: 'POST',
				async: true,
				url: i_t_g.admin_ajax,
				data: {
					action: prefix1+"_get_tinymce_tooltip_form",
					data: values
				},
				success: function createTinyMCEFormAjaxed(out){
					var newDom = $($.parseHTML(out, true)),
						h = 400,
						w = 455,
						popupTooltip = newDom.find("#"+prefix1+"-tooltip-form"),
						popupTooltipOptions = newDom.find("#"+prefix1+"-tooltip-form-options");
					$w.on("resize", function resizeTinyMCEForm(){
						var opts = {width:w + "px", height:h+"px", left: ($w.width() - w)/2 + "px", top: ($w.height() - h)/2 + "px"};
						popupTooltip.css(opts);
						popupTooltipOptions.css(opts);
					}).resize();

					$(document.body).append(newDom.css({opacity: 0}).animate({opacity:1}, 500));


					i_t_g.finishTinymce = (function finishTinyMCE(){
						var domC = newDom;
						return function(data){
							console.log(data);
							var attributesList = domC.find("#attributes-list option").map(function(){
								return this.value;
							}).toArray();
							domC.animate({opacity:0}, 500, function(){
								domC.remove();
							});
							if(typeof data == "undefined")
								return;
							// Insert content when the window form is submitted
							if(mode == "load")
								sel.select(sel.getStart());
							else if(mode.indexOf("extend") > -1){
								rng = sel.getRng(true);
								var arr = JSON.parse(mode.match(/extend(.*)$/)[1]),
									text = rng.commonAncestorContainer.textContent;
								rng.commonAncestorContainer.textContent = text.slice(0, arr[0]) + text.slice(arr[1], text.length - 1);
								editor.fire("DblClick");
							}

							var optsStrs = [],
								opts = data.opts || values.opts;
							console.log("Opts",data.opts, values.opts);
							function generateAttr(label,value,specEncode){
								value = (value + "").trim();
								if(!label.match(/^[\w_\-]*$/))
									return null;
								return stripQuotes(label.trim(), true)+'="' + (!isNA(specEncode) && specEncode ? value.replace(/"/g, "&aquot;").replace(/\n/g, "<br/>") : stripQuotes(value, true)) + '"';
							}
							function addOpt(label,value, specEncode){
								optsStrs.push(generateAttr(label,value,specEncode));
								optsStrs = optsStrs.filter(function(val){
									return !isNA(val);
								});
							}

							console.log("Before add opts", opts);

							if(!isNA(opts)){
								if(opts["qtip-content"]){
									addOpt('data-termcontent', opts["qtip-content"]);
								}
								if(opts["qtip-keep-open"]){
									addOpt('data-qtip-keep-open', "true");
								}
								if(!isNA(opts["qtiprounded"])){
									addOpt("data-qtiprounded", opts["qtiprounded"] + "")
								}
								if(!isNA(opts["qtipshadow"])){
									addOpt("data-qtipshadow", opts["qtipshadow"] + "");
								}
								if(opts["qtipstyle"]){
									addOpt("data-qtipstyle", opts["qtipstyle"]);
								}
								if(opts["qtiptrigger"]){
									addOpt("data-qtiptrigger", opts["qtiptrigger"]);
								}
								if(opts["position"]){
									if(opts["position"]["at"] && opts["position"]["at"][1] && opts["position"]["at"][2]){
										addOpt("data-position-at", opts["position"]["at"][1] + " " + opts["position"]["at"][2]);
									}
									if(opts["position"]["my"] && opts["position"]["my"][1] && opts["position"]["my"][2]){
										var my = [opts["position"]["my"][1],opts["position"]["my"][2]];
										if(opts["position"]["my"]["invert"])
											my.reverse();
										addOpt("data-position-my", my.join(" "));
									}
								}
								if(opts["anim"]){
									if(opts["anim"]["in"]){
										addOpt("data-animation_in", opts["anim"]["in"]);
									}
									if(opts["anim"]["out"]){
										addOpt("data-animation_out", opts["anim"]["out"]);
									}
									if(opts["anim"]["time"]){
										addOpt("data-animation_time", opts["anim"]["time"]);
									}
								}
								if(opts["maxwidth"]){
									addOpt("data-tooltip-maxwidth", opts["maxwidth"]);
								}
								for(var types = ["span", "link"], i = 0; i < 2; i++){
									for(var j in opts["attributes"][types[i]]){
										if(j && opts["attributes"][types[i]][j]){
											console.log(j, opts["attributes"][types[i]][j]);
											var prefix = attributesList.indexOf(j) > -1 ? "" : 'data-',
												midPart = types[i] == "link" ? 'link-' : '';
											addOpt(prefix + midPart + j, opts["attributes"][types[i]][j], true);
										}
									}
								}
							}
							if(data.link){
								addOpt('href', encodeURI(data.link));
							}

							console.log(optsStrs);

							switch(data.type){
								case "glossary": {
									if(data.term_id == "" || data.text == ""){
										return;
									}else{
										addOpt("glossary-id", data.glossary_id);
										if(data.disable_auto_translation){
											addOpt("disable_auto_translation", "true");
										}
										editor.insertContent('['+prefix4+'-glossary ' + optsStrs.join(" ") + ']'+data.text+"[/"+prefix4+"-glossary]" + ((mode != "load") ? " " : ""));
									}
								} break;

								case "tooltip": {
									if(data.tooltip_content == "" || data.text == ""){
										return;
									}else{
										addOpt("tooltip-content", data.tooltip_content, true);
										editor.insertContent('['+prefix4+'-tooltip ' + optsStrs.join(" ") + ']'+data.text+"[/"+prefix4+"-tooltip]" + ((mode != "load") ? " " : ""));
									}
								} break;

								case "mediatip": {
									if(data.mediatip_type == "" || data.mediatip_content == "" || data.text == ""){
										return;
									}else{
										addOpt("mediatip-type",data.mediatip_type);
										addOpt("mediatip-content",data.mediatip_content, true);
										addOpt("mediatip-link", data.mediatip_link);
										if(data.mediatip_caption){
											addOpt("mediatip-caption", data.mediatip_caption, true);
										}
										editor.insertContent('['+prefix4+'-mediatip ' + optsStrs.join(" ") + ']'+data.text+"[/"+prefix4+"-mediatip]" + ((mode != "load") ? " " : ""));
									}
								} break;
							}
						}
					}());
				},
				error: function TinyMCEFormAjaxedError(){
					console.error("Error while getting TinyMCE form.",arguments);
				}
			});
		}

		//replace from shortcode to displayable html content
		editor.on('BeforeSetcontent', function(event){
			event.content = replaceShortcodes( event.content );
		});
		//replace from displayable html content to shortcode
		editor.on('GetContent', function(event){
			event.content = restoreShortcodes(event.content);
		});

		editor.onNodeChange.add(function(ed, cm, e) {
			if(e.getAttribute("data-type") == prefix3+"-term" || e.getAttribute("data-type") == prefix3+"-tooltip" || e.getAttribute("data-type") == prefix3+"-mediatip")
				editor.fire('glossaryterm', {active: true});
			else
				editor.fire('glossaryterm', {active: false});
			if(e.getAttribute("data-type") == prefix3+"-term_list" || e.getAttribute("data-type") == prefix3+"-atoz")
				editor.fire('glossarylist', {active: true});
			else
				editor.fire('glossarylist', {active: false});
		});
	});

	var htmlAttrs = ["href"];
	ithoughts.replaceShortcodesEl = [
		function(content){ // For [glossary]
			return content.replace( /\[(?:ithoughts_tooltip_glossary-)?(glossary|tooltip|mediatip)(?!_)(.*?)\](.*?)\[\/(?:ithoughts_tooltip_glossary-)?(glossary|tooltip|mediatip)\]/g, function( all,balise,inner, text){
				var attrs = {};
				var regex = /([\w\d\-]+?)="(.+?)"/g;
				var matched = null;
				while (matched = regex.exec(inner)) {
					attrs[matched[1]] = matched[2];
				}
				var ret = "<a data-type=\""+prefix3+"-"+["term","tooltip","mediatip"][["glossary","tooltip","mediatip"].indexOf(balise)]+ "\"";
				for(var i in attrs){
					if(htmlAttrs.indexOf(i) > -1 || i.indexOf("data-") == 0){
						ret += " "+i+"=\""+attrs[i]+"\"";
					} else {
						ret += " data-"+i+"=\""+attrs[i]+"\"";
					}
				}
				return ret + ">" + text + "</a>";
			});
		},
		function(content){ // For [glossary_(term_list|atoz)]
			return content.replace( /\[glossary_(term_list|atoz)(.*?)\/\]/g, function( all,type, attrStr){
				var attrs = {};
				var regex = /([\w\d\-]+?)="(.+?)"/g;
				var matched = null;
				while (matched = regex.exec(attrStr)) {
					attrs[matched[1]] = matched[2];
				}
				var ret = "<span data-type=\""+prefix3+"-"+type+"\"";
				for(var i in attrs){
					if(htmlAttrs.indexOf(i) > -1 || i.indexOf("data-") == 0){
						ret += " "+i+"=\""+attrs[i]+"\"";
					} else {
						ret += " data-"+i+"=\""+attrs[i]+"\"";
					}
				}
				return ret + ">Glossary " + ((type == "term_list") ? "List" : "A-to-Z") + "</span>";
			});
		}
	];
	ithoughts.restoreShortcodesEl = [
		function(content){ // For [glossary]
			return content.replace( /<a\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term|tooltip|mediatip)")(.*?)>(.*?)<\/a>/g, function( all,type,inner, text){
				var attrs = {};
				var regex = /(data-)?([\w\d\-]+?)="(.+?)"/g;
				var matched = null;
				while (matched = regex.exec(inner)) {
					if(matched[1] == "data-" && matched[2] == "type"){
						continue;
					} else {
						if(htmlAttrs.indexOf(matched[2]) > -1 && typeof matched[1] != "undefined"){
							attrs[matched[1] + matched[2]] = matched[3];
						} else {
							attrs[matched[2]] = matched[3];
						}
					}
				}
				var b = ["glossary","tooltip","mediatip"][["term","tooltip","mediatip"].indexOf(type)];
				var ret = "["+prefix4+"-" + b;
				for(var i in attrs){
					ret += " "+i+"=\""+attrs[i]+"\"";
				}
				return ret + "]" + text + "[/"+prefix4+"-"+b+"]";
			});
		},
		function(content){ // For [glossary_(term_list|atoz)]
			return content.replace( /<span\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term_list|atoz)")(.*?)>.*?<\/span>/g, function( all,type, attrStr){
				var attrs = {};
				var regex = /(data-)?([\w\d\-]+?)="(.+?)"/g;
				var matched = null;
				while (matched = regex.exec(attrStr)) {
					if(matched[1] == "data-" && matched[2] == "type"){
						continue;
					} else {
						if(htmlAttrs.indexOf(i) > -1 && typeof matched[1] != "undefined"){
							attrs[matched[1] + matched[2]] = matched[3];
						} else {
							attrs[matched[2]] = matched[3];
						}	
					}
				}
				var ret = "[glossary_" + type;
				for(var i in attrs){
					ret += " "+i+"=\""+attrs[i]+"\"";
				}
				return ret + "/]";
			});
		}
	];

	function replaceShortcodes( content ) {
		var repLength = ithoughts.replaceShortcodesEl.length;
		for(var i = 0; i < repLength; i++){
			content = ithoughts.replaceShortcodesEl[i](content);
		}
		return content;
	}
	function restoreShortcodes( content ) {
		var resLength = ithoughts.restoreShortcodesEl.length;
		for(var i = 0; i < resLength; i++){
			content = ithoughts.restoreShortcodesEl[i](content);
		}
		return content;
	}

	function replaceHtmlAmp(string){
		return string.replace(/&amp;/g, "&");
	}
})(Ithoughts);