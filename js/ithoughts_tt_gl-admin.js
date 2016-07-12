/**
 * @file Old file. To merge
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.5.0
 */

(function(ithoughts){
    var $ = ithoughts.$;
    ithoughts.$d.ready(function(){
        var u = window.updateStyle,
            e = "change blur keyup mouseup",
            updateActivationPreview = (function(){
            var target = null,
                contentI = $("#tooltips"),
                triggerI = $("#qtiptrigger");
            return function(){
                if(target == null)
                    target = $("#qtip-exampleActivate");
                try{
                    target.qtip('option', 'show.event', triggerI.val()).qtip('option', 'hide', (triggerI == 'responsive') ? "responsiveout" : 'mouseleave');
                } catch(e){
                    console.log(e);
                }
            }
        })();
        $("#qtiprounded,#qtipshadow,#qtipstyle").bind(e, u);
        $("#qtipstylecustom").bind(e, function(e){u(e, $("#qtipstylecustom").val());});
        $("#tooltips,#qtiptrigger").bind(e, updateActivationPreview);
    });
})(Ithoughts);
