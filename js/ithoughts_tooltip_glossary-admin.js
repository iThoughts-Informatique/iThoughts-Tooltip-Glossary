window.refloat;
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
                try{
                    target.qtip('option', 'show.event', triggerI.val()).qtip('option', 'hide', (triggerI == 'responsive') ? "responsiveout" : 'mouseleave');
                } catch(e){
                    console.log(e);
                }
            }
        })();
        $("#tooltips").bind("change blur keyup mouseup", updateActivationPreview);
        $("#qtiptrigger").bind("change blur keyup mouseup", updateActivationPreview);

        var updateFloaterPosition = (function(){
            var min;
            var centerOffset;
            var max;
            return function(event,floaterObj, redim){
                if(redim === true || typeof min === "undefined" || typeof max === "undefined" || typeof centerOffset === "undefined"){
                    min = floaterObj.container.offset().top;
                    max = floaterObj.container.outerHeight(true) - floaterObj.body.outerHeight(true);
                    centerOffset = ($(window).outerHeight(true) - floaterObj.body.outerHeight(true)) / 2;
                }
                var baseOffset = $(window).scrollTop() - min;
                var offset = Math.min(Math.max(baseOffset + centerOffset,0), max);
                floaterObj.body.css("top", offset + "px");
            }
        })();

        var floater = {body: $("#floater")};
        floater["container"] = floater.body.parent();
        floater.body.css("position","absolute");
        $(document).scroll(function(e){updateFloaterPosition(e,floater);});
        $(window).resize(function(e){updateFloaterPosition(e,floater, true);}).resize();
        window.refloat = function(elem){
            setTimeout(function(){/*
                if($(elem).parent().prop('id') === "ithoughts_tt_gllossary_options_2")
                    $("#qtip-exampleStyle").qtip("api").toggle(!$(elem).parent().hasClass("closed"));*/
                updateFloaterPosition(null,floater,true);
                $(window).scroll();
            }, 25);
        }

        $("#ithoughts_tt_gl-customstyle").click(function(){
            var self = $(this).find(".inside .ajaxContainer");
            if($(self).children().length === 0)
                $.post(ithoughts_tt_gl.admin_ajax, {action: "ithoughts_tt_gl_get_customizing_form"}, function(output){
                    $(self).append($.parseHTML(output.data));
                    ithoughts_tt_gl["initStyleEditor"]($);
                });
            else
                console.log("Already filled");
        });
    });
})(jQuery);
