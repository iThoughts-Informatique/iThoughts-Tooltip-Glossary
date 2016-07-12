/**
 * @file Interface between plugin formatted data and qTip API
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.5.0
 */

function stripQuotes(string, encode){
    if(typeof string != "string")
        return "";
    if(encode)
        return string/*.replace(/&/g, "&amp;")*/.replace(/"/g, "&aquot;").replace(/\n/g, "<br/>");
    else
        return string.replace(/<br\/>/g, "\n").replace(/&aquot;/g, '"')/*.replace(/&amp;/g, "&")*/;
}

ithoughts_tt_gl = ithoughts_tt_gl || {};
ithoughts_tt_gl.doInitTooltips = (function(ithoughts){
    var tooltipsContainer,
        $ = ithoughts.$,
        $w = ithoughts.$w,
        $d = ithoughts.$d,
        i_t_g = ithoughts_tt_gl,
        isNA = ithoughts.isNA;
    return function(){
        //Create container
        if(isNA(tooltipsContainer)){
            tooltipsContainer = $($.parseHTML('<div id="ithoughts_tooltip_glossary-tipsContainer"></div>'));
            $(document.body).append(tooltipsContainer);
        }
        var evts = {
            start: ithoughts.isIos ? "mousedown" : "touchstart",
            end: ithoughts.isIos ? "mouseup" : "touchend"
        }
        if(ithoughts.isIos)
            $("body").css({cursor: "pointer"});

        $('span[class^=ithoughts_tooltip_glossary-]').each(function(){
            var qtipstyle	= ($(this).data('qtipstyle')) ? $(this).data('qtipstyle') : i_t_g.qtipstyle;
            var termcontent	= ($(this).data('termcontent')) ? $(this).data('termcontent') : i_t_g.termcontent;
            var qtipshadow	= ($(this).data('qtipshadown')) ? $(this).data('qtipshadown') : i_t_g.qtipshadown;
            qtipshadow = qtipshadow === "true" || qtipshadow === "1";
            var qtiprounded	= ($(this).data('qtiprounded')) ? $(this).data('qtiprounded') : i_t_g.qtiprounded;
            qtiprounded = qtiprounded === "true" || qtiprounded === "1";
            var qtiptrigger = ($(this).data('qtiptrigger')) ? $(this).data('qtiptrigger') : i_t_g.qtiptrigger;

            // If set to click, disable glossary link
            if( qtiptrigger == 'click' ){
                var self = $(this);
                self.children('a').click(function(e){
                    if(self.touch != 1){
                        e.preventDefault();
                        self.touch = 1;
                    }
                }).mouseleave(function(){
                    self.touch = 0;
                });

            } else if( qtiptrigger == 'responsive' ){
                var self = $(this);
                self.touch = ithoughts.baseTouch;

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

            var tipClass;
            if(this.getAttribute("data-tooltip-theme")){
                tipClass = "qtip-"+this.getAttribute("data-tooltip-theme") + (qtipshadow ? " qtip-shadow" : "" ) + (qtiprounded ? " qtip-rounded" : "" ) + " " ;
            } else if(this.getAttribute("data-tooltip-classes")){
                tipClass = this.getAttribute("data-tooltip-classes");
            } else {
                tipClass = 'qtip-' + qtipstyle + (qtipshadow ? " qtip-shadow" : "" ) + (qtiprounded ? " qtip-rounded" : "" ) + " " ;
            }
            var specific;
            if($(this).hasClass("ithoughts_tooltip_glossary-glossary")){
                if(this.getAttribute("data-termid") && termcontent != "off"){
                    var ajaxPostData = {
                        action: 'ithoughts_tt_gl_get_term_details',
                        content: termcontent,
                        termid: $(this).data()["termid"]
                    };
                    if(this.getAttribute("data-disable_auto_translation") == "true")
                        ajaxPostData["disable_auto_translation"] = true;
                    specific = {
                        content: {
                            text: i_t_g.lang.qtip.pleasewait_ajaxload.content,
                            ajax: {
                                url     : i_t_g.admin_ajax,
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
                            title: { text: i_t_g.lang.qtip.pleasewait_ajaxload.title }
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
                        text: stripQuotes(this.getAttribute("data-tooltip-content"), false)/*.replace(/&/g, "&amp;")*/,
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
                    if(typeof i_t_g.qtip_filters != "undefined" && i_t_g.qtip_filters && typeof i_t_g.qtip_filters.mediatip != "undefined" && i_t_g.qtip_filters.mediatip && i_t_g.qtip_filters.mediatip.length > 0){
                        for(var i = 0; i < i_t_g.qtip_filters.mediatip.length; i++){
                            attrs = $.extend(attrs, i_t_g.qtip_filters.mediatip[i]($(this)));
                        }
                    }
                    var attrsStr = "";
                    for(var key in attrs){
                        attrsStr += key + '="' + attrs[key] + '" ';
                    }
                    specific.content["text"] = "<img " + attrsStr + ">";
                    var caption = this.getAttribute("data-mediatip-caption");
                    if(caption){
                        specific.content["text"] += '<div class="ithoughts_tt_gl-caption">' + caption.replace(/&aquot;/g, '"') + '</div>';
                    }
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
        });
    }
}(Ithoughts));

(function(ithoughts){
    var redimWait,
        $ = ithoughts.$,
        $w = ithoughts.$w;

    function dom2string(who){
        var tmp = $(document.createElement("div"));
        $(tmp).append($(who));
        var tmp = tmp.html();
        return tmp;
    }

    $w.resize(function(){
        clearTimeout(redimWait);
        redimWait = setTimeout(redimVid,100);
    });
    function redimVid(video){
        var h = ithoughts.$w.height();
        var w = ithoughts.$w.width();
        var i= 0;
        var dims = [[512,288],[256,144]];
        for(var l = dims.length;i < l;i++){
            if(w > dims[i][0] && h > dims[i][1]) break;
        }
        i = Math.min(dims.length, Math.max(0,i));
        var optDims = dims[i];
        if(typeof video == "undefined" && typeof optDims != "undefined"){
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

    ithoughts.$d.ready(function(){
        ithoughts_tt_gl.doInitTooltips();
    });
})(Ithoughts);
