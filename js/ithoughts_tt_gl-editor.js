/*global Ithoughts, ithoughts_tt_gl, tinyMCE, tinymce */
/*jslint regexp: true */

/**
 * @function initTinyMCEPlugin
 * @description Namespace & register both term & list TinyMCE plugins for iThoughts Tooltip Glossary
 * @param {Object} ithoughts Appropriate version of iThoughts Tooltip Glossary helper
 */
(function initTinyMCEPlugin(ithoughts) {
    'use strict';

    ithoughts.$d.ready(function(){
        var $       = ithoughts.$,
            $w				= ithoughts.$w,
            i_t_g = ithoughts_tt_gl,
            i_t_g_e = ithoughts_tt_gl_editor,
            stripQuotes		= i_t_g.stripQuotes,
            prefix1	= 'ithoughts_tt_gl',
            prefix4			= "ithoughts_tooltip_glossary",
            tipsTypes		= ["ithoughts-tooltip-glossary-term", "ithoughts-tooltip-glossary-tooltip", "ithoughts-tooltip-glossary-mediatip"],
            isNA			= ithoughts.isNA;

        ithoughts.initLoggers(i_t_g_e, "iThoughts Tooltip Glossary", i_t_g_e.jslog);
        i_t_g_e.removeAccents = function (s) {
            var translate_re	= /[¹²³áàâãäåaaaÀÁÂÃÄÅAAAÆccç©CCÇÐÐèéê?ëeeeeeÈÊË?EEEEE€gGiìíîïìiiiÌÍÎÏ?ÌIIIlLnnñNNÑòóôõöoooøÒÓÔÕÖOOOØŒr®Ršs?ßŠS?ùúûüuuuuÙÚÛÜUUUUýÿÝŸžzzŽZZ]/g,
                translate		= {"¹":  "1", "²": "2", "³": "3", "á": "a", "à": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", a: "a", "À": "a", "Á": "a", "Â": "a", "Ã": "a", "Ä": "a", "Å": "a", A: "a", "Æ": "a", c: "c", "ç": "c", "©": "c", C: "c", "Ç": "c", "Ð": "d", "è": "e", "é": "e", "ê": "e", "?": "s", "ë": "e", e: "e", "È": "e", "Ê": "e", "Ë": "e", E: "e", "€": "e", g: "g", G: "g", i: "i", "ì": "i", "í": "i", "î": "i", "ï": "i", "Ì": "i", "Í": "i", "Î": "i", "Ï": "i", I: "i", l: "l", L: "l", n: "n", "ñ": "n", N: "n", "Ñ": "n", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", o: "o", "ø": "o", "Ò": "o", "Ó": "o", "Ô": "o", "Õ": "o", "Ö": "o", O: "o", "Ø": "o", "Œ": "o", r: "r", "®": "r", R: "r", "š": "s", s: "s", "ß": "s", "Š": "s", S: "s", "ù": "u", "ú": "u", "û": "u", "ü": "u", u: "u", "Ù": "u", "Ú": "u", "Û": "u", "Ü": "u", U: "u", "ý": "y", "ÿ": "y", "Ý": "y", "Ÿ": "y", "ž": "z", z: "z", "Ž": "z", Z: "z"};
            return s.replace(translate_re, function (match) {
                return translate[match];
            });
        };

        console.log("Initing editor forms")

        i_t_g_e.editorForms = {
            list: function glossarylistfct(selection, callback, event) {
                i_t_g_e.info("Selection infos to load TIP: ", selection);
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
                                        }
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
                            return callback('[glossary_term_list' + ((opts.length > 0) ? ' ' + opts.join(' ') : '') + ' /]');
                        } else if (listtabIInt === 1) {
                            opts = [];
                            if (!!data.al) { opts.push('alpha="' + stripQuotes(data.al, true) + '"'); }
                            if (!!data.ag) { opts.push('group="' + stripQuotes(data.ag, true) + '"'); }
                            return callback('[glossary_atoz' + ((opts.length > 0) ? ' ' + opts.join(' ') : '') + ' /]');
                        }
                    }
                });
            },
            tip: function glossarytermfct(selection, callback, event) {
                i_t_g_e.info("Selection infos to load TIP: ", selection);
                var values	= {},
                    sel		= selection,
                    $node	= $(selection.DOM),
                    node	= selection.DOM,
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
                if (sel.start === sel.end) {
                    i_t_g_e.log("Start & End node are the same, operating on a node of type " + sel.start.nodeName);
                    content = (sel.start && sel.start.text) || sel.html; // Get node text if any or get selection
                    if (sel.start && sel.start.nodeName != "#text" && tipsTypes.indexOf(sel.start.getAttribute("data-type")) > -1) { // On Glossary Term or Tooltip or Mediatip, load data
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
                            term_search:						i_t_g_e.removeAccents(content.toLowerCase()),
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
                                term_search:						i_t_g_e.removeAccents(content.toLowerCase()),
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
                                term_search:						i_t_g_e.removeAccents(content.toLowerCase()),
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
                    url:		i_t_g_e.admin_ajax,
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


                        i_t_g_e.finishTinymce = (function finishTinyMCE() {
                            var domC = newDom;
                            return function handleFormSubmitted(data) {
                                i_t_g_e.info("New tooltip data:", data);
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
                                    i_t_g_e.error('Unhandled mode "extend" during writing of new tooltip shortcode');/*
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
                                i_t_g_e.log("Final content:", finalContent)
                                return callback(finalContent);
                            };
                        }());
                    },
                    error: function TinyMCEFormAjaxedError() {
                        console.error("Error while getting TinyMCE form.", arguments);
                    }
                });
            }
        };




        QTags.addButton( 'ithoughts_tt_gl-glossary', 'ITG Term', '[ithoughts_tooltip_glossary-glossary glossary-id=""]', '[/ithoughts_tooltip_glossary-glossary]', 'iThoughts Tooltip Glossary term', 'Add a glossary tooltip', null);
        QTags.addButton( 'ithoughts_tt_gl-tooltip', 'ITG Tooltip', '[ithoughts_tooltip_glossary-tooltip href="" tooltip-content=""]', '[/ithoughts_tooltip_glossary-tooltip]', 'iThoughts Tooltip Glossary tooltip', 'Add a tooltip', null);
        QTags.addButton( 'ithoughts_tt_gl-mediatip', 'ITG Mediatip', '[ithoughts_tooltip_glossary-mediatip href="" mediatip-type="webimage" mediatip-content="" mediatip-caption=""]', '[/ithoughts_tooltip_glossary-mediatip]', 'iThoughts Tooltip Glossary mediatip', 'Add a mediatip', null);



        function generateSelObject(){
            var txtarea = $("#content").get(0);
            var sel = {
                html: txtarea.value.substring(txtarea.selectionStart, txtarea.selectionEnd)
            };
            sel.DOM = $.parseHTML(sel.html);
            sel.start = $(sel.DOM).first().get(0);
            sel.end = $(sel.DOM).last().get(0);
            return sel;
        }
        QTags.addButton( 'ithoughts_tt_gl-tip', 'ITG Tip', function(){
            i_t_g_e.editorForms.tip(generateSelObject(), QTags.insertContent)
        });
        QTags.addButton( 'ithoughts_tt_gl-list', 'ITG List', function(){
            i_t_g_e.editorForms.list(generateSelObject(), QTags.insertContent)
        });
    });
})(Ithoughts.v4);