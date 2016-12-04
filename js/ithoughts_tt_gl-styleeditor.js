/**
 * @file Client-side style-editor logic
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 */

(function(ithoughts){
	'use strict';
	var $ = ithoughts.$;
	
    ithoughts.$d.ready(function(){
        $("#LESS-form")[0].simple_ajax_callback = function(res){
            if(res.valid){
                var styleTag = $("#ithoughts_tt_gl-custom_theme");
                if(styleTag.length == 0){
                    styleTag = $($.parseHTML('<style id="ithoughts_tt_gl-custom_theme"></style>'));
                    $('body').append(styleTag);
                }
                styleTag[0].innerHTML = res.css;

                window.updateStyle(null, res.theme_name);
            } else {
                console.error("Error while getting preview style",res);
            }
        };
        {
            var theme = $('[name="themename"]').val()
            if(theme != "" && theme){
                window.updateStyle(null, theme);
            }
        }
        $('[name="themename"]').change(function(){
            $(this).parent().find("button").prop("disabled", !this.value);
        }).change();
    });
})(Ithoughts.v4)