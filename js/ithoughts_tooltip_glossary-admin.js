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

window.refloat;
window.updateStyle;
(function(){
    $d.ready(function(){
        $("#qtiprounded").bind("change blur keyup mouseup", window.updateStyle);
        $("#qtipshadow").bind("change blur keyup mouseup", window.updateStyle);
        $("#qtipstyle").bind("change blur keyup mouseup", window.updateStyle);
        $("#qtipstylecustom").bind("change blur keyup mouseup", function(e){window.updateStyle(e, $("#qtipstylecustom").val());});

        var updateActivationPreview = (function(){
            var target = null;
            var contentI = $("#tooltips");
            var triggerI = $("#qtiptrigger");
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
        $("#tooltips").bind("change blur keyup mouseup", updateActivationPreview);
        $("#qtiptrigger").bind("change blur keyup mouseup", updateActivationPreview);
    });
})();
  