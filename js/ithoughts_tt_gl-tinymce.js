/**
 * @file TinyMCE plugin scripts
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
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
            event.content = i_t_g_e.replaceShortcodes(event.content);
        }).on('GetContent', function i_t_g_GetContent(event) { //replace from displayable html content to shortcode
            event.content = i_t_g_e.restoreShortcodes(event.content);
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
            var tinymceSel = editor.selection,
                sel = {
                DOM: $(tinymceSel.getNode()).closest(tipsSelector).toArray()
            };
            sel.html = tinymceSel.getContent({format : 'html'});
            sel.start = tinymceSel.getStart();
            sel.end = tinymceSel.getEnd();
            return sel;
        }
        function insertInTinyMCE(shortcode, mode){
            // Insert content when the window form is submitted
            if (mode === "load") {
                editor.selection.select(editor.selection.getStart());
            } else if (mode.indexOf("extend") > -1) {
                i_t_g_e.error('Unhandled mode "extend" during writing of new tooltip shortcode');/*
								rng = sel.getRng(true);
								arr = JSON.parse(mode.match(/extend(.*)$/)[1]);
								text = rng.commonAncestorContainer.textContent;
								rng.commonAncestorContainer.textContent = text.slice(0, arr[0]) + text.slice(arr[1], text.length - 1);
								editor.fire("DblClick");*/
            }
            editor.insertContent(shortcode);
        }

        // Add a button that opens a window
        editor.addButton('glossaryterm', {
            title :         editor.getLang(prefix2 + '.add_tooltip'),
            image :         url + '/icon/glossaryterm.png',
            onPostRender:   setToggleable('glossaryterm', editor),
            onclick:        function(){
                i_t_g_e.editorForms.tip(generateSelObject(), insertInTinyMCE)
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
                i_t_g_e.editorForms.list(generateSelObject(), insertInTinyMCE)
            },
        });
    });
}(Ithoughts.v4));