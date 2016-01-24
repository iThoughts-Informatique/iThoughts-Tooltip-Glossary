(function() {
	tinyMCE.setToggleable = function(element, editor) {
		return function(){
			var self = this;
			editor.on(element, function(e) {
				self.active(e.active);
			});
		};
	};

	tinymce.PluginManager.add('ithoughts_tt_gl_tinymce', function(editor, url) {
		editorG = editor;
		// Add a button that opens a window
		editor.addButton('glossaryterm', {
			title : editor.getLang('ithoughts_tt_gl_tinymce.add_tooltip'),
			image : url + '/icon/glossaryterm.png',
			onclick: glossarytermfct,
			onPostRender: tinymce.setToggleable('glossaryterm', editor)
		});
		var listtabI = 0;
		editor.addButton('glossarylist', {
			title :editor.getLang('ithoughts_tt_gl_tinymce.add_index'),
			image : url + '/icon/glossaryindex.png',
			onPostRender: tinymce.setToggleable('glossarylist', editor),
			onclick: glossarylistfct
		});

		//CSS
		editor.contentCSS.push(url + "/../css/ithoughts_tooltip_glossary-admin.css?v=2.1.7");

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
				},
				type: 0
			};
			var mode = "insert_content";

			sel = editor.selection;
			if(sel.getStart() === sel.getEnd()){
				if(sel.getStart().getAttribute("data-type") == "ithoughts-tooltip-glossary-atoz"){ // Is atoz
					mode = "load";
					values.type=1;
					values.atoz = {
						alpha: sel.getStart().getAttribute("data-alpha"),
						group: sel.getStart().getAttribute("data-group")
					};
				} else if(sel.getStart().getAttribute("data-type") == "ithoughts-tooltip-glossary-term_list"){ // Is term_list
					mode = "load";
					values.type=0;
					values.list = {
						alpha: sel.getStart().getAttribute("data-alpha"),
						cols: sel.getStart().getAttribute("data-cols"),
						desc: sel.getStart().getAttribute("data-desc"),
						group: sel.getStart().getAttribute("data-group")
					};
				}
			}
			listtabI = values.type;

			editor.windowManager.open({
				title: editor.getLang('ithoughts_tt_gl_tinymce.insert_index'),
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
								title: editor.getLang('ithoughts_tt_gl_tinymce.list'),
								items:[
									{
										type:"textbox",
										label:editor.getLang('ithoughts_tt_gl_tinymce.letters'),
										name:"ll",
										value: values.list.alpha,
										tooltip:editor.getLang('ithoughts_tt_gl_tinymce.letters_explain')
									},
									{
										type:"textbox",
										label:editor.getLang('ithoughts_tt_gl_tinymce.columns'),
										name:"lc",
										value: values.list.cols,
										tooltip:editor.getLang('ithoughts_tt_gl_tinymce.columns_explain')
									},
									{
										type:"listbox",
										label:editor.getLang('ithoughts_tt_gl_tinymce.description'),
										name:"ld",
										values:[
											{
												text:"None",
												value:""
											},
											{
												text:editor.getLang('ithoughts_tt_gl_tinymce.excerpt'),
												value:"excerpt"
											},
											{
												text:editor.getLang('ithoughts_tt_gl_tinymce.full'),
												value:"full"
											},
											{
												text:editor.getLang('ithoughts_tt_gl_tinymce.glossarytips'),
												value:"glossarytips"
											}
										],
										value: values.list.desc,
										tooltip:editor.getLang('ithoughts_tt_gl_tinymce.description_explain')
									},
									{
										type:"textbox",
										label:editor.getLang('ithoughts_tt_gl_tinymce.group'),
										name:"lg",
										value: values.list.group,
										tooltip:editor.getLang('ithoughts_tt_gl_tinymce.group_explain')
									}
								]
							}),
							new tinyMCE.ui.Factory.create({
								type:"form",
								title:editor.getLang('ithoughts_tt_gl_tinymce.atoz'),
								items: [
									{
										type:"textbox",
										label:editor.getLang('ithoughts_tt_gl_tinymce.letters'),
										name:"al",
										value: values.atoz.alpha,
										tooltip:editor.getLang('ithoughts_tt_gl_tinymce.letters_explain')
									},
									{
										type:"textbox",
										label:editor.getLang('ithoughts_tt_gl_tinymce.group'),
										name:"ag",
										value: values.atoz.group,
										tooltip:editor.getLang('ithoughts_tt_gl_tinymce.group_explain')
									}
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
			var values = {
			};
			var sel = editor.selection;
			var mode = "";
			var types = ["ithoughts-tooltip-glossary-term", "ithoughts-tooltip-glossary-tooltip", "ithoughts-tooltip-glossary-mediatip"]
			if(sel.getStart() === sel.getEnd()){
				var content = sel.getContent({format: 'text'});
				if(types.indexOf(sel.getStart().getAttribute("data-type")) > -1){ // On Glossary Term or Tooltip or Mediatip, load data
					mode = "load";
					var el = sel.getStart();
					values= {
						text: content,
						tooltip_content: stripQuotes(((el.getAttribute("data-tooltip-content")) ? (el.getAttribute("data-tooltip-content")) : null) || content, false),
						glossary_id: el.getAttribute("data-glossary-id"),
						term_search: removeAccents(content.toLowerCase()),
						mediatip_type: el.getAttribute("data-mediatip-type"),
						mediatip_content: stripQuotes(el.getAttribute("data-mediatip-content"), false),
						mediatip_link: el.getAttribute("data-mediatip-link"),
						mediatip_caption: el.getAttribute("data-mediatip-caption"), 
						type: ["glossary", "tooltip", "mediatip"][types.indexOf(el.getAttribute("data-type"))]
					};
				} else { //Create new glossary term
					if(content && content.length > 0){ // If something is selected
						mode = "insert_content"
						values= {
							text: content,
							tooltip_content: content,
							glossary_id: null,
							term_search: removeAccents(content.toLowerCase()),
							mediatip_type: "",
							mediatip_content: "",
							mediatip_caption: "",
							type: "tooltip"
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
			jQuery.post(ithoughts_tt_gl.admin_ajax, {action: "ithoughts_tt_gl_get_tinymce_tooltip_form", data: values}, function(out){
				//console.log(out);
				var newDom = jQuery(jQuery.parseHTML(out, true)).css({opacity: 0});
				var h = 400;
				var w = 455;
				var popupTooltip = newDom.find("#ithoughts_tt_gl-tooltip-form");
				jQuery(window).on("resize", function(){
					popupTooltip.css({width:w + "px", height:h+"px", left: (jQuery(window).width() - w)/2 + "px", top: (jQuery(window).height() - h)/2 + "px"});
				}).resize();
				jQuery('body').append(newDom.animate({opacity:1}, 500));
				newDom[0].finish = (function(){
					var domC = newDom;
					return function(data){
						console.log(data);
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
							var arr = JSON.parse(mode.match(/extend(.*)$/)[1]);
							var text = rng.commonAncestorContainer.textContent;
							rng.commonAncestorContainer.textContent = text.slice(0, arr[0]) + text.slice(arr[1], text.length - 1);
							editor.fire("DblClick");
						}
						switch(data.type){
							case "glossary": {
								if(data.term_id == "" || data.text == "")
									return;
								else
									editor.insertContent('[ithoughts_tooltip_glossary-glossary glossary-id="'+data.glossary_id+'"]'+data.text+"[/ithoughts_tooltip_glossary-glossary]" + ((mode != "load") ? " " : ""));
							} break;

							case "tooltip": {
								if(data.tooltip_content == "" || data.text == "")
									return;
								else
									editor.insertContent('[ithoughts_tooltip_glossary-tooltip tooltip-content="'+stripQuotes(data.tooltip_content.trim(), true)+'"]'+data.text+"[/ithoughts_tooltip_glossary-tooltip]" + ((mode != "load") ? " " : ""));
							} break;

							case "mediatip": {
								if(data.mediatip_type == "" || data.mediatip_content == "" || data.text == "")
									return;
								else
									editor.insertContent('[ithoughts_tooltip_glossary-mediatip mediatip-type="' + data.mediatip_type + '" mediatip-content="' + stripQuotes(data.mediatip_content, true) + '" mediatip-link="' + data.mediatip_link + '"' + (data.mediatip_caption.length > 0 ? ' mediatip-caption="' + stripQuotes(data.mediatip_caption, true) + '"' : "") + ']'+data.text+"[/ithoughts_tooltip_glossary-mediatip]" + ((mode != "load") ? " " : ""));
							} break;
						}
					}
				})();
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
			if(e.getAttribute("data-type") == "ithoughts-tooltip-glossary-term" || e.getAttribute("data-type") == "ithoughts-tooltip-glossary-tooltip" || e.getAttribute("data-type") == "ithoughts-tooltip-glossary-mediatip")
				editor.fire('glossaryterm', {active: true});
			else
				editor.fire('glossaryterm', {active: false});
			if(e.getAttribute("data-type") == "ithoughts-tooltip-glossary-term_list" || e.getAttribute("data-type") == "ithoughts-tooltip-glossary-atoz")
				editor.fire('glossarylist', {active: true});
			else
				editor.fire('glossarylist', {active: false});
		});
	});
})();

replaceShortcodesEl = [
	function(content){ // For [glossary]
		return content.replace( /\[(?:ithoughts_tooltip_glossary-)?(glossary|tooltip|mediatip)(?!_)(.*?)\](.*?)\[\/(?:ithoughts_tooltip_glossary-)?(glossary|tooltip|mediatip)\]/g, function( all,balise,inner, text){
			var attrs = {};
			var regex = /([\w\d\-]+?)="(.+?)"/g;
			var matched = null;
			while (matched = regex.exec(inner)) {
				attrs[matched[1]] = matched[2];
			}
			var ret = "<a data-type=\"ithoughts-tooltip-glossary-"+["term","tooltip","mediatip"][["glossary","tooltip","mediatip"].indexOf(balise)]+ "\"";
			for(var i in attrs){
				ret += " data-"+i+"=\""+attrs[i]+"\"";
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
			var ret = "<span data-type=\"ithoughts-tooltip-glossary-"+type+"\"";
			for(var i in attrs){
				ret += " data-"+i+"=\""+attrs[i]+"\"";
			}
			return ret + ">Glossary " + ((type == "term_list") ? "List" : "A-to-Z") + "</span>";
		});
	}
];
restoreShortcodesEl = [
	function(content){ // For [glossary]
		return content.replace( /<a\s+data-type="ithoughts-tooltip-glossary-(term|tooltip|mediatip)"(.*?)>(.*?)<\/a>/g, function( all,type,inner, text){
			var attrs = {};
			var regex = /data-([\w\d\-]+?)="(.+?)"/g;
			var matched = null;
			while (matched = regex.exec(inner)) {
				attrs[matched[1]] = matched[2];
			}
			var b = ["glossary","tooltip","mediatip"][["term","tooltip","mediatip"].indexOf(type)];
			var ret = "[ithoughts_tooltip_glossary-" + b;
			for(var i in attrs){
				ret += " "+i+"=\""+attrs[i]+"\"";
			}
			return ret + "]" + text + "[/ithoughts_tooltip_glossary-"+b+"]";
		});
	},
	function(content){ // For [glossary_(term_list|atoz)]
		return content.replace( /<span\s+data-type="ithoughts-tooltip-glossary-(term_list|atoz)"(.*?)>.*?<\/span>/g, function( all,type, attrStr){
			var attrs = {};
			var regex = /data-([\w\d\-]+?)="(.+?)"/g;
			var matched = null;
			while (matched = regex.exec(attrStr)) {
				attrs[matched[1]] = matched[2];
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
	var repLength = replaceShortcodesEl.length;
	for(var i = 0; i < repLength; i++){
		content = replaceShortcodesEl[i](content);
	}
	return content;
}

function restoreShortcodes( content ) {
	var resLength = restoreShortcodesEl.length;
	for(var i = 0; i < resLength; i++){
		content = restoreShortcodesEl[i](content);
	}
	return content;
}

function replaceHtmlAmp(string){
	console.log(string);
	return string.replace(/&amp;/g, "&");
}