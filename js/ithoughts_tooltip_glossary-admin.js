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

        $("#ithoughts_tt_gl-customstyle").click(function(){
            var self = $(this).find(".inside .ajaxContainer");
            if($(self).children().length === 0){
				/*/
				$(self).append($.parseHTML("<iframe src=\"" + ithoughts_tt_gl.admin_ajax + "?action=ithoughts_tt_gl_get_customizing_form\"></iframe>"));
				/*/
                $.post(ithoughts_tt_gl.admin_ajax, {action: "ithoughts_tt_gl_get_customizing_form"}, function(output){
                    $(self).append($.parseHTML(output, true));
                    ithoughts_tt_gl["initStyleEditor"]($);
                });
				/**/
			} else
                console.log("Already filled");
        });
    });
})();
