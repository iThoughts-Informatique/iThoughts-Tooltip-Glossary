function stripQuotes(string, encode){
	if(encode)
		return string/*.replace(/&/g, "&amp;")*/.replace(/"/g, "&quot;").replace(/\n/g, "<br/>");
	else
		return string.replace(/<br\/>/g, "\n").replace(/&quot;/g, '"')/*.replace(/&amp;/g, "&")*/;
}

(function($){
	var isIos = navigator.userAgent.match(/(iPad|iPhone|iPod)/g); // Used to enable some iOS specific piece of code to catch click on body, for example
	var baseTouch = (isIos || navigator.userAgent.match(/(Android|webOS|BlackBerry)/i) ) ? 1 : 0;

	function dom2string(who){
		var tmp = $(document.createElement("div"));
		$(tmp).append($(who));
		var tmp=tmp.html();
		return(tmp);
	}

	var redimWait;
	$(window).resize(function(){
		clearTimeout(redimWait);
		redimWait = setTimeout(redimVid,100);
	});
	function redimVid(video){
		var h = $(window).height();
		var w = $(window).width();
		var i= 0;
		var dims = [[512,288],[256,144]];
		for(var l = dims.length;i < l;i++){
			if(w > dims[i][0] && h > dims[i][1]) break;
		}
		console.log("Optimal dims:",dims[i]);
		var optDims = dims[i];
		if(typeof video == "undefined"){
			$(".ithoughts_tt_gl-video").prop({width:optDims[0],height:optDims[1]});
			$(".ithoughts_tt_gl-video_tip").each(function(){
				var api = $(this).qtip("api");/**/
				var state = api.disabled;
				api.enable();/**/
				api.reposition();/**/
				api.disable(state);/**/
			}).css({width:optDims[0],height:optDims[1]});
		} else {
			video.prop({width:optDims[0],height:optDims[1]}).addClass("ithoughts_tt_gl-video");
			return {dims: {width:optDims[0],height:optDims[1]}, text: dom2string(video)};
		}
	}

	$(document).ready(function(){
		//Create container
		tooltipsContainer = $($.parseHTML('<div id="ithoughts_tooltip_glossary-tipsContainer"></div>'));
		$(document.body).append(tooltipsContainer);
		var evts = {
			start: isIos ? "mousedown" : "touchstart",
			end: isIos ? "mouseup" : "touchend"
		}
		if(isIos)
			$("body").css({cursor: "pointer"});

		$('span[class^=ithoughts_tooltip_glossary-]').each(function(){
			var qtipstyle	= ($(this).data('qtipstyle')) ? $(this).data('qtipstyle') : ithoughts_tt_gl.qtipstyle;
			var termcontent	= ($(this).data('termcontent')) ? $(this).data('termcontent') : ithoughts_tt_gl.termcontent;
			var qtipshadow	= ($(this).data('qtipshadown')) ? $(this).data('qtipshadown') : ithoughts_tt_gl.qtipshadown;
			qtipshadow = qtipshadow === "true" || qtipshadow === "1";
			var qtiprounded	= ($(this).data('qtiprounded')) ? $(this).data('qtiprounded') : ithoughts_tt_gl.qtiprounded;
			qtiprounded = qtiprounded === "true" || qtiprounded === "1";
			var qtiptrigger = ($(this).data('qtiptrigger')) ? $(this).data('qtiptrigger') : ithoughts_tt_gl.qtiptrigger;

			// If set to click, disable glossary link
			if( qtiptrigger == 'click' ){
				$(this).children('a').click(function(e){
					e.preventDefault();
				});
			} else if( qtiptrigger == 'responsive' ){
				var self = $(this);
				self.touch = baseTouch;

				//Detect touch/click out
				$("body").bind("click touch", function(event) {
					if($(event.target).closest(self).length == 0) {
						self.data("expanded", false);
						self.triggerHandler("responsiveout");
					}
				});

				self.children('a').click(function(e){
					if(!self.data("expanded") && self.touch != 0){
						self.data("expanded", true);
						self.triggerHandler("responsive");
						e.preventDefault();
					}
				}).bind(evts.start, function(e){
					self.touch = 1
				}).bind(evts.end, function(e){
					self.touch = 2;
				}).bind("mouseover focus", function(e){
					self.triggerHandler("responsive");
				}).bind("mouseleave focusout", function(e){
					self.triggerHandler("responsiveout");
				})
			}

			var tipClass = 'qtip-' + qtipstyle + (qtipshadow ? " qtip-shadow" : "" ) + (qtiprounded ? " qtip-rounded" : "" ) + " " ;
			var specific;
			if($(this).hasClass("ithoughts_tooltip_glossary-glossary")){
				if(this.getAttribute("data-termid") && termcontent != "off"){
					var ajaxPostData = {
						action: 'ithoughts_tt_gl_get_term_details',
						content: termcontent,
						termid: $(this).data()["termid"]
					};
					specific = {
						content: {
							text: 'Loading glossary term',
							ajax: {
								url     : ithoughts_tt_gl.admin_ajax,
								type    : 'POST',
								data    : ajaxPostData,
								dataType: 'json',
								loading : false,
								success : function(resp, status){
									if( resp.success ) {
										this.set( 'content.title', resp.data.title );
										this.set( 'content.text',  resp.data.content );
									} else {
										this.set( 'content.text', 'Error' );
									}
								}
							},
							title: { text: 'Please wait' }
						},
						style: {
							classes: tipClass + "ithoughts_tooltip_glossary-glossary"
						}
					};
				} else if (this.getAttribute("data-term-content") && this.getAttribute("data-term-title")){
					specific = {
						content: {
							title: {text: this.getAttribute("data-term-title")},
							text: this.getAttribute("data-term-content")
						},
						style: {
							classes: tipClass + "ithoughts_tooltip_glossary-glossary"
						}
					};
				}
			} else if($(this).hasClass("ithoughts_tooltip_glossary-tooltip")){
				specific = {
					style: {
						classes: tipClass + "ithoughts_tooltip_glossary-tooltip"
					},
					content: {
						text: stripQuotes(this.getAttribute("data-tooltip-content"), false),
						title: { text: $(this).text() }
					}
				};
			} else if($(this).hasClass("ithoughts_tooltip_glossary-mediatip")){
				specific = {
					style: {
						classes: tipClass + "ithoughts_tooltip_glossary-mediatip",
						//width:"350px"
					},
					position:{
						adjust: {
							scroll: false
						}
					},
					content: {
						text: "",
						title: {
							text: $(this).text()
						}
					},
					hide: {
						fixed: true,
						delay: 100
					},
					events:{
						show: function(){
							$(this).qtip().reposition();
						}
					}
				};
				if(this.getAttribute("data-mediatip-image")){
					var attrs = {
						src: this.getAttribute("data-mediatip-image"),
						alt: $(this).text()
					}
					if(typeof ithoughts_tt_gl.qtip_filters != "undefined" && ithoughts_tt_gl.qtip_filters && typeof ithoughts_tt_gl.qtip_filters.mediatip != "undefined" && ithoughts_tt_gl.qtip_filters.mediatip && ithoughts_tt_gl.qtip_filters.mediatip.length > 0){
						for(var i = 0; i < ithoughts_tt_gl.qtip_filters.mediatip.length; i++){
							attrs = $.extend(attrs, ithoughts_tt_gl.qtip_filters.mediatip[i]($(this)));
						}
					}
					var attrsStr = "";
					for(var key in attrs){
						attrsStr += key + '="' + attrs[key] + '" ';
					}
					specific.content["text"] = "<img " + attrsStr + ">"
				} else if(this.getAttribute("data-mediatip-html")){
					var redimedInfos = (function(element){
						if(element.length == 1 && ((element[0].nodeName == "IFRAME" && element[0].src.match(/youtube|dailymotion/)) || element[0].nodeName == "VIDEO")){
							return redimVid(element);
						}
					})($($.parseHTML(this.getAttribute("data-mediatip-html").replace('&quot;', '"').trim())));
					specific.content["text"] = redimedInfos["text"];
					specific.content.title.text = '<span class="ithoughts_tooltip_glossary_pin_container"><svg viewBox="0 0 26 26" class="ithoughts_tooltip_glossary_pin"><use xlink:href="#icon-pin"></use></svg></span><span class="ithoughts_tt_gl-title_with_pin">' + specific.content.title.text + "</span>";
					specific.style.classes += " ithoughts_tt_gl-force_no_pad ithoughts_tt_gl-video_tip ithoughts_tt_gl-with_pin"
					specific.style.width = redimedInfos["dims"]["width"];
					specific.events["render"] = function(event, api) {
						// Grab the tooltip element from the API elements object
						// Notice the 'tooltip' prefix of the event name!
						api.elements.title.find(".ithoughts_tooltip_glossary_pin_container").click(function(){
							$(this).toggleClass("pined");
							if($(this).hasClass("pined"))
								api.disable();
							else
								api.enable();
						})

					}
				}
			} else
				return;

			if(this.getAttribute("data-tooltip-autoshow") == "true")
				specific["show"] = $.extend(true, specific["show"], {ready: true});
			if(this.getAttribute("data-tooltip-nosolo") == "true")
				specific["show"] = $.extend(true, specific["show"], {solo: false});
			if(this.getAttribute("data-tooltip-nohide") == "true")
				specific = $.extend(true, specific, {hide: "someevent", show: {event: "someevent"}});
			if(this.getAttribute("data-tooltip-id"))
				specific = $.extend(true, specific, {id: this.getAttribute("data-tooltip-id")});

			var opts = $.extend(true, {
				prerender: true,
				position: {
					at      : 'top center', // Position the tooltip above the link
					my      : 'bottom center',
					viewport: $("body"),       // Keep the tooltip on-screen at all times
					effect  : false,           // Disable positioning animation
					container: tooltipsContainer
				},
				show: {
					event: qtiptrigger,
					solo:  true // Only show one tooltip at a time
				},
				//hide: 'unfocus',
				hide: (qtiptrigger == 'responsive') ? "responsiveout" : 'mouseleave',
				style: tipClass
			}, specific);
			$(this).qtip(opts);

			//Remove title for tooltip, causing double tooltip
			$(this).find("a[title]").removeAttr("title");


			glossaryIndex = $("#glossary-index");
			// Tile-based glossary
			if(glossaryIndex){
				var bodydiv = glossaryIndex.find("#glossary-container");
				switch(glossaryIndex.data("type")){
					case "tile":{
						var headTiles = glossaryIndex.find("header p[data-empty=\"false\"]");
						headTiles.click(function(e){
							glossaryIndex.find('article[data-active="true"]').attr("data-active", false);
							var newDisplayed = glossaryIndex.find('article[data-chartype="' + $(e.target).data("chartype") + '"]');
							newDisplayed.attr("data-active", "true");
							bodydiv.animate({
								height: newDisplayed.outerHeight(true)
							},{
								duration: 500,
								queue: false,
								step:function(){
									bodydiv.css("overflow","visible");
								},
								complete: function() {
									bodydiv.css("overflow","visible");
								}
							});
						});
					} break;
				}
			}
		});
	});
})(jQuery);
