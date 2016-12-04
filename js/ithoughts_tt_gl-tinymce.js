/**
 * @file TinyMCE plugin scripts
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.5.0
 */

/*global Ithoughts, ithoughts_tt_gl, tinyMCE, tinymce */
/*jslint regexp: true */

/**
 * @function initTinyMCEPlugin
 * @description Namespace & register both term & list TinyMCE plugins for iThoughts Tooltip Glossary
 * @param {Object} ithoughts Appropriate version of iThoughts Tooltip Glossary helper
 */
(function initTinyMCEPlugin(ithoughts) {
    'use strict';

    var $				= ithoughts.$,
        $w				= ithoughts.$w,
        i_t_g			= ithoughts_tt_gl,
        prefix1			= 'ithoughts_tt_gl',
        prefix2			= prefix1 + '_tinymce',
        prefix3			= "ithoughts-tooltip-glossary",
        prefix4			= "ithoughts_tooltip_glossary",
        stripQuotes		= i_t_g.stripQuotes,
        isNA			= ithoughts.isNA,
        translate_re	= /[¹²³áàâãäåaaaÀÁÂÃÄÅAAAÆccç©CCÇÐÐèéê?ëeeeeeÈÊË?EEEEE€gGiìíîïìiiiÌÍÎÏ?ÌIIIlLnnñNNÑòóôõöoooøÒÓÔÕÖOOOØŒr®Ršs?ßŠS?ùúûüuuuuÙÚÛÜUUUUýÿÝŸžzzŽZZ]/g,
        translate		= {"¹":  "1", "²": "2", "³": "3", "á": "a", "à": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", a: "a", "À": "a", "Á": "a", "Â": "a", "Ã": "a", "Ä": "a", "Å": "a", A: "a", "Æ": "a", c: "c", "ç": "c", "©": "c", C: "c", "Ç": "c", "Ð": "d", "è": "e", "é": "e", "ê": "e", "?": "s", "ë": "e", e: "e", "È": "e", "Ê": "e", "Ë": "e", E: "e", "€": "e", g: "g", G: "g", i: "i", "ì": "i", "í": "i", "î": "i", "ï": "i", "Ì": "i", "Í": "i", "Î": "i", "Ï": "i", I: "i", l: "l", L: "l", n: "n", "ñ": "n", N: "n", "Ñ": "n", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", o: "o", "ø": "o", "Ò": "o", "Ó": "o", "Ô": "o", "Õ": "o", "Ö": "o", O: "o", "Ø": "o", "Œ": "o", r: "r", "®": "r", R: "r", "š": "s", s: "s", "ß": "s", "Š": "s", S: "s", "ù": "u", "ú": "u", "û": "u", "ü": "u", u: "u", "Ù": "u", "Ú": "u", "Û": "u", "Ü": "u", U: "u", "ý": "y", "ÿ": "y", "Ý": "y", "Ÿ": "y", "ž": "z", z: "z", "Ž": "z", Z: "z"},
        htmlAttrs		= ["href"],
        tipsTypes		= ["ithoughts-tooltip-glossary-term", "ithoughts-tooltip-glossary-tooltip", "ithoughts-tooltip-glossary-mediatip"],
        tipsSelector	= tipsTypes.map(function (e) { return '[data-type="' + e + '"]'; }).join(',');
    i_t_g.removeAccents = function (s) {
        return s.replace(translate_re, function (match) {
            return translate[match];
        });
    };

    function setToggleable(element, editor) {
        return function () {
            var self = this;
            editor.on(element, function (e) {
                self.active(e.active);
            });
        };
    };

    function replaceShortcodes(content) {
        var repLength = ithoughts.replaceShortcodesEl.length,
            i = -1;
        while ((i += 1) < repLength) {
            content = ithoughts.replaceShortcodesEl[i](content);
        }
        return content;
    }
    function restoreShortcodes(content) {
        var resLength = ithoughts.restoreShortcodesEl.length,
            i = -1;
        while ((i += 1) < resLength) {
            content = ithoughts.restoreShortcodesEl[i](content);
        }
        return content;
    }
    function replaceHtmlAmp(string) {
        return string.replace(/&amp;/g, "&");
    }

    tinymce.PluginManager.add(prefix2, function registerTinyMCEPlugin(editor, url) {
        //CSS
        editor.contentCSS.push(url + "/../css/" + prefix1 + "-admin.css?v=2.1.7");

        function getLang(str) {
            editor.getLang(prefix2 + str);
        }

        //fcts
        function glossarylistfct(event) {
            var mode = "insert_content",
                values = {
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
                },
                sel = editor.selection,
                ce = sel.getStart(),
                listtabI;
            if (ce === sel.getEnd()) {
                if (ce.getAttribute("data-type") === "ithoughts-tooltip-glossary-atoz") { // Is atoz
                    mode = "load";
                    values.type = 1;
                    values.atoz = {
                        alpha: ce.getAttribute("data-alpha"),
                        group: ce.getAttribute("data-group"),
                        lazy: ce.getAttribute("data-lazy") === "true"
                    };
                } else if (ce.getAttribute("data-type") === "ithoughts-tooltip-glossary-term_list") { // Is term_list
                    mode = "load";
                    values.type = 0;
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
                title: editor.getLang(prefix2 + '.insert_index'),
                margin:		"0 0 0 0",
                padding:	"0 0 0 0",
                border:		"0 0 0 0",
                body:		[
                    new tinyMCE.ui.TabPanel({
                        margin:		"0 0 0 0",
                        padding:	"0 0 0 0",
                        border:		"0 0 0 0",
                        onclick:	function (event) {
                            try {
                                if (event.target.id.match(/^mceu_\d+-t(\d+)$/)) {
                                    listtabI = event.target.id.replace(/^mceu_\d+-t(\d+)$/, "$1");
                                }
                            } catch (e) {}// Nothing to do, private
                        },
                        items:		[
                            new tinyMCE.ui.Factory.create({
                                type:	"form",
                                title:	editor.getLang(prefix2 + '.list'),
                                items:	[
                                    {
                                        type:		"textbox",
                                        label:		editor.getLang(prefix2 + '.letters'),
                                        name:		"ll",
                                        value:		values.list.alpha,
                                        tooltip:	editor.getLang(prefix2 + '.letters_explain')
                                    },
                                    {
                                        type:		"textbox",
                                        label:		editor.getLang(prefix2 + '.columns'),
                                        name:		"lc",
                                        value:		values.list.cols,
                                        tooltip:	editor.getLang(prefix2 + '.columns_explain')
                                    },
                                    {
                                        type:		"listbox",
                                        label:		editor.getLang(prefix2 + '.description'),
                                        name:		"ld",
                                        values:		[
                                            {
                                                text:	"None",
                                                value:	""
                                            },
                                            {
                                                text:	editor.getLang(prefix2 + '.excerpt'),
                                                value:	"excerpt"
                                            },
                                            {
                                                text:	editor.getLang(prefix2 + '.full'),
                                                value:	"full"
                                            },
                                            {
                                                text:	editor.getLang(prefix2 + '.glossarytips'),
                                                value:	"glossarytips"
                                            }
                                        ],
                                        value:		values.list.desc,
                                        tooltip:	editor.getLang(prefix2 + '.description_explain')
                                    },
                                    {
                                        type:		"textbox",
                                        label:		editor.getLang(prefix2 + '.group'),
                                        name:		"lg",
                                        value:		values.list.group,
                                        tooltip:	editor.getLang(prefix2 + '.group_explain')
                                    }
                                ]
                            }),
                            new tinyMCE.ui.Factory.create({
                                type:	"form",
                                title:	editor.getLang(prefix2 + '.atoz'),
                                items:	[
                                    {
                                        type:		"textbox",
                                        label:		editor.getLang(prefix2 + '.letters'),
                                        name:		"al",
                                        value:		values.atoz.alpha,
                                        tooltip:	editor.getLang(prefix2 + '.letters_explain')
                                    },
                                    {
                                        type:		"textbox",
                                        label:		editor.getLang(prefix2 + '.group'),
                                        name:		"ag",
                                        value:		values.atoz.group,
                                        tooltip:	editor.getLang(prefix2 + '.group_explain')
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
                        activeTab:	values.type
                    })
                ],
                onsubmit: function (e) {
                    if (mode === "load") {
                        sel.select(sel.getStart());
                    }
                    var listtabIInt = parseInt(listtabI, 10),
                        opts,
                        data = e.data;
                    if (listtabIInt === 0) {
                        opts = [];
                        if (!!data.ll) { opts.push('alpha="' + stripQuotes(data.ll, true) + '"'); }
                        if (!!data.lg) { opts.push('group="' + stripQuotes(data.lg, true) + '"'); }
                        if (!!data.lc) { opts.push('cols="' + stripQuotes(data.lc, true) + '"'); }
                        if (!!data.ld) { opts.push('desc="' + stripQuotes(data.ld, true) + '"'); }
                        editor.insertContent('[glossary_term_list' + ((opts.length > 0) ? ' ' + opts.join(' ') : '') + ' /]');
                    } else if (listtabIInt === 1) {
                        opts = [];
                        if (!!data.al) { opts.push('alpha="' + stripQuotes(data.al, true) + '"'); }
                        if (!!data.ag) { opts.push('group="' + stripQuotes(data.ag, true) + '"'); }
                        editor.insertContent('[glossary_atoz' + ((opts.length > 0) ? ' ' + opts.join(' ') : '') + ' /]');
                    }
                }
            });
        }

        function glossarytermfct(event) {
            var values	= {},
                sel		= editor.selection,
                $node	= $(sel.getNode()).closest(tipsSelector),
                node	= $node.get(0),
                mode	= "",
                i		= -1,
                content,
                atts,
                attsLength,
                attrs,
                att,
                takeAttr,
                position_at,
                position_my,
                my_inverted,
                tristate;
            if (sel.getStart() === sel.getEnd()) {
                content = (node && node.text) || sel.getContent(); // Get node text if any or get selection
                if (node && tipsTypes.indexOf(node.getAttribute("data-type")) > -1) { // On Glossary Term or Tooltip or Mediatip, load data
                    mode = "load";
                    attrs = {};
                    atts = node.attributes;
                    attsLength = atts.length;
                    while ((i += 1) < attsLength) {
                        att = atts[i];
                        attrs[att.nodeName] = att.nodeValue;
                    }
                    takeAttr = function (label, nodata) {
                        if (isNA(nodata) || !nodata) { label = "data-" + label; }
                        var val = attrs[label];
                        delete attrs[label];
                        return val;
                    };


                    position_at = (takeAttr("position-at") || ' ').split(" ");
                    position_my = (takeAttr("position-my") || ' ').split(" ");
                    my_inverted = (Math.max(position_my.indexOf("top"), position_my.indexOf("bottom")) === 1) || (Math.max(position_my.indexOf("right"), position_my.indexOf("left")) === 0);
                    position_at = {
                        1: position_at[0],
                        2: position_at[1]
                    };
                    position_my = {
                        1: position_my[my_inverted ? 1 : 0],
                        2: position_my[my_inverted ? 0 : 1],
                        invert: my_inverted ? "enabled" : undefined
                    };

                    tristate = function (val) {
                        if (val === "true") { return true; }
                        if (val === "false") { return false; }
                        return null;
                    };


                    values = {
                        text:								content,
                        link:								takeAttr("href", true),
                        tooltip_content:					stripQuotes(takeAttr("tooltip-content") || content, false),
                        glossary_id:						takeAttr("glossary-id"),
                        term_search:						i_t_g.removeAccents(content.toLowerCase()),
                        mediatip_type:						takeAttr("mediatip-type"),
                        mediatip_content:					stripQuotes(takeAttr("mediatip-content"), false),
                        mediatip_link:						takeAttr("mediatip-link"),
                        mediatip_caption:					takeAttr("mediatip-caption"),
                        type:								["glossary", "tooltip", "mediatip"][tipsTypes.indexOf(takeAttr("type"))],
                        glossary_disable_auto_translation:	(takeAttr("disable_auto_translation") || false) === "true",
                        opts:								{
                            termcontent:		takeAttr('termcontent'),
                            'qtip-keep-open':	takeAttr('qtip-keep-open') === "true",
                            qtiprounded:		tristate(takeAttr('qtiprounded')),
                            qtipshadow:			tristate(takeAttr('qtipshadow')),
                            qtipstyle:			takeAttr('qtipstyle'),
                            qtiptrigger:		takeAttr('qtiptrigger'),
                            position:	{
                                at:	position_at,
                                my:	position_my
                            },
                            attributes:			{
                                span:	{},
                                link:	{}
                            },
                            anim:				{
                                'in':	takeAttr("animation_in"),
                                out:	takeAttr("animation_out"),
                                time:	takeAttr("animation_time")
                            },
                            maxwidth:			takeAttr("tooltip-maxwidth")
                        }
                    };
                    for (i in attrs) {
                        if (attrs.hasOwnProperty(i)) {
                            if (i.match(/^data-link-/)) {
                                values.opts.attributes.link[i.replace(/^data-link-/, '')] = attrs[i];
                            } else {
                                values.opts.attributes.span[i.replace(/^data-/, '')] = attrs[i];
                            }
                        }
                    }
                } else { //Create new glossary term
                    if (content && content.length > 0) { // If something is selected
                        mode	= "replace_content";
                        values	= {
                            text:								content,
                            link:								'',
                            tooltip_content:					content,
                            glossary_id:						null,
                            term_search:						i_t_g.removeAccents(content.toLowerCase()),
                            mediatip_type:						"",
                            mediatip_content:					"",
                            mediatip_caption:					"",
                            type:								"tooltip",
                            glossary_disable_auto_translation:	false
                        };
                    } else { // If no selection
                        //Find immediate next && previous chars
                        mode	= "add_content";
                        values	= {
                            text:								'',
                            link:								'',
                            tooltip_content:					'',
                            glossary_id:						null,
                            term_search:						i_t_g.removeAccents(content.toLowerCase()),
                            mediatip_type:						"",
                            mediatip_content:					"",
                            mediatip_caption:					"",
                            type:								"tooltip",
                            glossary_disable_auto_translation:	false
                        };
                    }
                }
            }
            // Then generate form through Ajax
            $.ajax({
                method:		'POST',
                async:		true,
                url:		i_t_g.admin_ajax,
                data:		{
                    action:	prefix1 + "_get_tinymce_tooltip_form",
                    data:	values
                },
                success:	function createTinyMCEFormAjaxed(out) {
                    var newDom = $($.parseHTML(out, true)),
                        h = 400,
                        w = 455,
                        popupTooltip = newDom.find("#" + prefix1 + "-tooltip-form"),
                        popupTooltipOptions = newDom.find("#" + prefix1 + "-tooltip-form-options");
                    $w.on("resize", function resizeTinyMCEForm() {
                        var opts = {
                            width:	w + "px",
                            height:	h + "px",
                            left:	(($w.width() - w) / 2) + "px",
                            top:	(($w.height() - h) / 2) + "px"
                        };
                        popupTooltip.css(opts);
                        popupTooltipOptions.css(opts);
                    }).resize();

                    $(document.body).append(newDom.css({opacity: 0}).animate({opacity: 1}, 500));


                    i_t_g.finishTinymce = (function finishTinyMCE() {
                        var domC = newDom;
                        return function handleFormSubmitted(data) {
                            i_t_g.info("New tooltip data:", data);
                            domC.animate({opacity: 0}, 500, function () {
                                domC.remove();
                            });
                            if (typeof data === "undefined") { return; }
                            var arr,
                                text,
                                attributesList	= domC.find("#attributes-list option").map(function () {
                                    return this.value;
                                }).toArray(),
                                optsStrs		= [],
                                opts			= data.opts || values.opts,
                                generateAttr	= function generateAttr(label, value, specEncode) {
                                    value = String(value).trim();
                                    if (!label.match(/^[\w_\-]*$/)) { return null; }
                                    return stripQuotes(label.trim(), true) + '="' + (!isNA(specEncode) && specEncode ? value.replace(/"/g, "&aquot;").replace(/\n/g, "<br/>") : stripQuotes(value, true)) + '"';
                                },
                                addOpt			= function addOpt(label, value, specEncode) {
                                    optsStrs.push(generateAttr(label, value, specEncode));
                                    optsStrs = optsStrs.filter(function (val) {
                                        return !isNA(val);
                                    });
                                },
                                my,
                                types			= ["span", "link"],
                                typesLength		= types.length,
                                i				= -1,
                                j,
                                prefix,
                                midPart,
                                optsAttrs		= (opts && opts.attributes) || {},
                                shortcode		= prefix4 + '-' + data.type,
                                tail			= (mode !== "load" && content.length === 0) ? " " : "";

                            // Insert content when the window form is submitted
                            if (mode === "load") {
                                sel.select(sel.getStart());
                            } else if (mode.indexOf("extend") > -1) {
                                i_t_g.error('Unhandled mode "extend" during writing of new tooltip shortcode');/*
								rng = sel.getRng(true);
								arr = JSON.parse(mode.match(/extend(.*)$/)[1]);
								text = rng.commonAncestorContainer.textContent;
								rng.commonAncestorContainer.textContent = text.slice(0, arr[0]) + text.slice(arr[1], text.length - 1);
								editor.fire("DblClick");*/
                            }

                            if (!isNA(opts)) {
                                if (opts['qtip-content']) {
                                    addOpt('data-termcontent', opts['qtip-content']);
                                }
                                if (opts['qtip-keep-open']) {
                                    addOpt('data-qtip-keep-open', "true");
                                }
                                if (!isNA(opts.qtiprounded)) {
                                    addOpt("data-qtiprounded", String(opts.qtiprounded));
                                }
                                if (!isNA(opts.qtipshadow)) {
                                    addOpt("data-qtipshadow", String(opts.qtipshadow));
                                }
                                if (opts.qtipstyle) {
                                    addOpt("data-qtipstyle", opts.qtipstyle);
                                }
                                if (opts.qtiptrigger) {
                                    addOpt("data-qtiptrigger", opts.qtiptrigger);
                                }
                                if (opts.position) {
                                    if (opts.position.at && opts.position.at[1] && opts.position.at[2]) {
                                        addOpt("data-position-at", opts.position.at[1] + " " + opts.position.at[2]);
                                    }
                                    if (opts.position.my && opts.position.my[1] && opts.position.my[2]) {
                                        my = [opts.position.my[1], opts.position.my[2]];
                                        if (opts.position.my.invert) { my.reverse(); }
                                        addOpt("data-position-my", my.join(" "));
                                    }
                                }
                                if (opts.anim) {
                                    if (opts.anim['in']) {
                                        addOpt("data-animation_in", opts.anim['in']);
                                    }
                                    if (opts.anim.out) {
                                        addOpt("data-animation_out", opts.anim.out);
                                    }
                                    if (opts.anim.time) {
                                        addOpt("data-animation_time", opts.anim.time);
                                    }
                                }
                                if (opts.maxwidth) {
                                    addOpt("data-tooltip-maxwidth", opts.maxwidth);
                                }
                                while ((i += 1) < typesLength) {
                                    if (optsAttrs.hasOwnProperty(i)) {
                                        for (j in optsAttrs[types[i]]) {
                                            if (optsAttrs[types[i]].hasOwnProperty(j)) {
                                                prefix = attributesList.indexOf(j) > -1 ? "" : 'data-';
                                                midPart = types[i] === "link" ? 'link-' : '';
                                                addOpt(prefix + midPart + j, optsAttrs[types[i]][j], true);
                                            }
                                        }
                                    }
                                }
                            }
                            if (data.link) {
                                addOpt('href', encodeURI(data.link));
                            }

                            if (data.type === "glossary") {
                                if (!data.glossary_id || !data.text) {
                                    return;
                                } else {
                                    addOpt("glossary-id", data.glossary_id);
                                    if (data.disable_auto_translation) {
                                        addOpt("disable_auto_translation", "true");
                                    }
                                }
                            } else if (data.type === "tooltip") {
                                if (!data.tooltip_content || !data.text) {
                                    return;
                                } else {
                                    addOpt("tooltip-content", data.tooltip_content, true);
                                }
                            } else if (data.type === "mediatip") {
                                if (!data.mediatip_type || !data.mediatip_content || !data.text) {
                                    return;
                                } else {
                                    addOpt("mediatip-type", data.mediatip_type);
                                    addOpt("mediatip-content", data.mediatip_content, true);
                                    if (data.mediatip_caption) {
                                        addOpt("mediatip-caption", data.mediatip_caption, true);
                                    }
                                }
                            }
                            var finalContent = '[' + shortcode + ' ' + optsStrs.join(" ") + ']' + data.text + "[/" + shortcode + "]" + tail;
                            i_t_g.log("Final content:", finalContent)
                            editor.insertContent(finalContent);
                        };
                    }());
                },
                error: function TinyMCEFormAjaxedError() {
                    console.error("Error while getting TinyMCE form.", arguments);
                }
            });
        }

        function glossarytermremovefct(event) {
            var currentNode = editor.selection.getNode(),
                $currentNode = $(currentNode),
                $node = $currentNode.closest(tipsSelector),
                node = $node.get(0);
            if(!node){
                return;
            }
            var html = node.innerHTML;
            $node.replaceWith(html);
        }

        editor.on('BeforeSetcontent', function i_t_g_BeforeSetcontent(event) { //replace from shortcode to displayable html content
            event.content = replaceShortcodes(event.content);
        }).on('GetContent', function i_t_g_GetContent(event) { //replace from displayable html content to shortcode
            event.content = restoreShortcodes(event.content);
        }).on('NodeChange', function (event) {
            var element = event.element;
            if ($(element).closest(tipsSelector).length > 0) {
                editor.fire('glossaryterm', {active: true});
                editor.fire('glossaryterm-d', {active: true});
            } else {
                editor.fire('glossaryterm', {active: false});
                editor.fire('glossaryterm-d', {active: false});
            }
            if ([prefix3 + "-term_list", prefix3 + "-atoz"].indexOf(element.getAttribute("data-type")) !== -1) {
                editor.fire('glossarylist', {active: true});
            } else {
                editor.fire('glossarylist', {active: false});
            }
        });


        // Add a button that opens a window
        editor.addButton('glossaryterm', {
            title : editor.getLang(prefix2 + '.add_tooltip'),
            image : url + '/icon/glossaryterm.png',
            onclick: glossarytermfct,
            onPostRender: setToggleable('glossaryterm', editor)
        });
        // Add the equivalent delete button
        editor.addButton('glossaryterm-d', {
            title : editor.getLang(prefix2 + '.remove_tooltip'),
            image : url + '/icon/glossaryterm-d.png',
            onclick: glossarytermremovefct,
            onPostRender: setToggleable('glossaryterm-d', editor)
        });

        var listtabI = 0;
        editor.addButton('glossarylist', {
            title:			editor.getLang(prefix2 + '.add_index'),
            image:			url + '/icon/glossaryindex.png',
            onPostRender:	setToggleable('glossarylist', editor),
            onclick:		glossarylistfct
        });
    });

    ithoughts.replaceShortcodesEl = [
        function (content) { // For [glossary]
            return content.replace(/\[(?:ithoughts_tooltip_glossary-)?(glossary|tooltip|mediatip)(?!_)(.*?)\](.*?)\[\/(?:ithoughts_tooltip_glossary-)?(glossary|tooltip|mediatip)\]/g, function (all, balise, inner, text) {
                var attrs	= {},
                    regex	= /([\w\d\-]+?)="(.+?)"/g,
                    matched	= null,
                    ret		= '<a data-type="' + prefix3 + '-' + {glossary: "term", tooltip: "tooltip", mediatip: "mediatip"}[balise] + '"',
                    i;
                while (Boolean(matched = regex.exec(inner)) === true) {
                    attrs[matched[1]] = matched[2];
                }
                for (i in attrs) {
                    if (attrs.hasOwnProperty(i)) {
                        if (htmlAttrs.indexOf(i) > -1 || i.indexOf("data-") === 0) {
                            ret += ' ' + i + '="' + attrs[i] + '"';
                        } else {
                            ret += ' data-' + i + '="' + attrs[i] + '"';
                        }
                    }
                }
                return ret + ">" + text + "</a>";
            });
        },
        function (content) { // For [glossary_(term_list|atoz)]
            return content.replace(/\[glossary_(term_list|atoz)(.*?)\/\]/g, function (all, type, attrStr) {
                var attrs	= {},
                    regex	= /([\w\d\-]+?)="(.+?)"/g,
                    matched	= null,
                    ret		= '<span data-type="' + prefix3 + '-' + type + '"',
                    i;
                while (Boolean(matched = regex.exec(attrStr)) === true) {
                    attrs[matched[1]] = matched[2];
                }
                for (i in attrs) {
                    if (attrs.hasOwnProperty(i)) {
                        if (htmlAttrs.indexOf(i) > -1 || i.indexOf("data-") === 0) {
                            ret += ' ' + i + '="' + attrs[i] + '"';
                        } else {
                            ret += ' data-' + i + '="' + attrs[i] + '"';
                        }
                    }
                }
                return ret + '>Glossary ' + ((type === "term_list") ? 'List' : 'A-to-Z') + '</span>';
            });
        }
    ];
    ithoughts.restoreShortcodesEl = [
        function (content) { // For [glossary]
            return content.replace(/<a\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term|tooltip|mediatip)")(.*?)>(.*?)<\/a>/g, function (all, type, inner, text) {
                var attrs	= {},
                    regex	= /(data-)?([\w\d\-]+?)="(.+?)"/g,
                    matched	= null,
                    b		= {term: "glossary", tooltip: "tooltip", mediatip: "mediatip"}[type],
                    ret		= "[" + prefix4 + "-" + b,
                    i;
                while (Boolean(matched = regex.exec(inner)) === true) {
                    if (matched[1] !== "data-" || matched[2] !== "type") {
                        if (htmlAttrs.indexOf(matched[2]) > -1 && typeof matched[1] !== "undefined") {
                            attrs[matched[1] + matched[2]] = matched[3];
                        } else {
                            attrs[matched[2]] = matched[3];
                        }
                    }
                }
                for (i in attrs) {
                    if (attrs.hasOwnProperty(i)) { ret += " " + i + '="' + attrs[i] + '"'; }
                }
                return ret + "]" + text + "[/" + prefix4 + "-" + b + "]";
            });
        },
        function (content) { // For [glossary_(term_list|atoz)]
            return content.replace(/<span\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term_list|atoz)")(.*?)>.*?<\/span>/g, function (all, type, attrStr) {
                var attrs	= {},
                    regex	= /(data-)?([\w\d\-]+?)="(.+?)"/g,
                    matched	= null,
                    ret		= "[glossary_" + type,
                    i;
                while (Boolean(matched = regex.exec(attrStr)) === true) {
                    if (matched[1] !== "data-" || matched[2] !== "type") {
                        if (htmlAttrs.indexOf(i) > -1 && typeof matched[1] !== "undefined") {
                            attrs[matched[1] + matched[2]] = matched[3];
                        } else {
                            attrs[matched[2]] = matched[3];
                        }
                    }
                }
                for (i in attrs) {
                    if (attrs.hasOwnProperty(i)) { ret += " " + i + '="' + attrs[i] + '"'; }
                }
                return ret + "/]";
            });
        }
    ];
}(Ithoughts.v4));