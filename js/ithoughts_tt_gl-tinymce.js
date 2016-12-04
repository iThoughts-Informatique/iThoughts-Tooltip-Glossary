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
        i_t_g			= ithoughts_tt_gl,
        i_t_g_e         = ithoughts_tt_gl_editor,
        prefix1			= 'ithoughts_tt_gl',
        prefix2			= prefix1 + '_tinymce',
        prefix3			= "ithoughts-tooltip-glossary",
        prefix4			= "ithoughts_tooltip_glossary",
        stripQuotes		= i_t_g.stripQuotes,
        isNA			= ithoughts.isNA,
        htmlAttrs		= ["href"],
        tipsTypes		= ["ithoughts-tooltip-glossary-term", "ithoughts-tooltip-glossary-tooltip", "ithoughts-tooltip-glossary-mediatip"],
        tipsSelector	= tipsTypes.map(function (e) { return '[data-type="' + e + '"]'; }).join(',');

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


        function generateSelObject(){
            console.log(editor.selection.getRng());
            var sel = {
                DOM: $(editor.selection.getNode()).closest(tipsSelector).toArray()
            };
            sel.html = $(sel.DOM).prop("outerHTML")
            sel.start = editor.selection.getStart();
            sel.end = editor.selection.getEnd();
            return sel;
        }

        // Add a button that opens a window
        editor.addButton('glossaryterm', {
            title :         editor.getLang(prefix2 + '.add_tooltip'),
            image :         url + '/icon/glossaryterm.png',
            onPostRender:   setToggleable('glossaryterm', editor),
            onclick:        function(){
                i_t_g_e.editorForms.tip(generateSelObject(), function(outStr){
                    editor.insertContent(outStr);
                })
            },
        });
        // Add the equivalent delete button
        editor.addButton('glossaryterm-d', {
            title :         editor.getLang(prefix2 + '.remove_tooltip'),
            image :         url + '/icon/glossaryterm-d.png',
            onPostRender:   setToggleable('glossaryterm-d', editor),
            onclick:        glossarytermremovefct,
        });

        var listtabI = 0;
        editor.addButton('glossarylist', {
            title:			editor.getLang(prefix2 + '.add_index'),
            image:			url + '/icon/glossaryindex.png',
            onPostRender:	setToggleable('glossarylist', editor),
            onclick:		function(){
                var sel = {
                    selection: editor.selection
                };
                sel.start = sel.selection.getStart();
                sel.end = sel.selection.getEnd();
                sel.DOM = $.parseHTML(sel.selection);
                i_t_g_e.editorForms.list(generateSelObject(), function(outStr){
                    editor.insertContent(outStr);
                })
            },
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