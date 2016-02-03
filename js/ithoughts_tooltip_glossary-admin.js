window.refloat;
window.updateStyle;
(function(){
    $d.ready(function(){
        window.updateStyle = (function(){
            var target = null;
            var styleI = $("#qtipstyle");
            var shadowI = $("#qtipshadow");
            var roundedI = $("#qtiprounded");
            return function(event, themename){
				if(typeof themename == "undefined")
					themename = styleI.val();
                if(target == null)
                    target = $("#qtip-exampleStyle");
                var style = [
                    "ithoughts_tt_gl-tooltip",
                    "qtip-pos-br",
                    "qtip-"+themename
                ];
                if(shadowI.is(':checked'))
                    style.push("qtip-shadow");
                if(roundedI.is(':checked'))
                    style.push("qtip-rounded");
                target.qtip('option', 'style.classes', style.join(" "));
            }
        })();
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

        var updateFloaterPosition = (function(){
            var min;
            var centerOffset;
            var max;
            return function(event,floaterObj, redim){
                if(redim === true || typeof min === "undefined" || typeof max === "undefined" || typeof centerOffset === "undefined"){
                    min = floaterObj.container.offset().top;
                    max = floaterObj.container.outerHeight(true) - floaterObj.body.outerHeight(true);
                    centerOffset = ($w.outerHeight(true) - floaterObj.body.outerHeight(true)) / 2;
                }
                var baseOffset = $w.scrollTop() - min;
                var offset = Math.min(Math.max(baseOffset + centerOffset,0), max);
                floaterObj.body.css("top", offset + "px");
            }
        })();

        var floater = {body: $("#floater")};
        floater["container"] = floater.body.parent();
        floater.body.css("position","absolute");
        $d.scroll(function(e){updateFloaterPosition(e,floater);});
        $w.resize(function(e){updateFloaterPosition(e,floater, true);}).resize();
        window.refloat = function(elem){
            setTimeout(function(){/*
                if($(elem).parent().prop('id') === "ithoughts_tt_gllossary_options_2")
                    $("#qtip-exampleStyle").qtip("api").toggle(!$(elem).parent().hasClass("closed"));*/
                updateFloaterPosition(null,floater,true);
                $w.scroll();
            }, 25);
        }

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
