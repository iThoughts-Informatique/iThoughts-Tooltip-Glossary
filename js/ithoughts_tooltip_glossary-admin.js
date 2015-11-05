(function($){
    $(document).ready(function(){
        var updateStyle = (function(){
            var target = null;
            var styleI = $("#qtipstyle");
            var shadowI = $("#qtipshadow");
            var roundedI = $("#qtiprounded");
            return function(){
                if(target == null)
                    target = $("#qtip-exampleStyle");
                var style = [
                    "ithoughts_tt_gl-tooltip",
                    "qtip-pos-br",
                    "qtip-"+styleI.val()
                ];
                if(shadowI.is(':checked'))
                    style.push("qtip-shadow");
                if(roundedI.is(':checked'))
                    style.push("qtip-rounded");
                target.qtip('option', 'style.classes', style.join(" "));
            }
        })();
        $("#qtipstyle").bind("change blur keyup mouseup", updateStyle);
        $("#qtiprounded").bind("change blur keyup mouseup", updateStyle);
        $("#qtipshadow").bind("change blur keyup mouseup", updateStyle);
        
        var updateActivationPreview = (function(){
            var target = null;
            var contentI = $("#tooltips");
            var triggerI = $("#qtiptrigger");
            return function(){
                if(target == null)
                    target = $("#qtip-exampleActivate");
                target.qtip('option', 'show.event', triggerI.val()).qtip('otpion', 'hide', (triggerI == 'responsive') ? "responsiveout" : 'mouseleave');
            }
        })();
        $("#tooltips").bind("change blur keyup mouseup", updateActivationPreview);
        $("#qtiptrigger").bind("change blur keyup mouseup", updateActivationPreview);
    });
})(jQuery);
