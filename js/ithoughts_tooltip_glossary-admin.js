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

        $('.color-field').wpColorPicker();
        gradX('.gradient-picker');



        /* Init mode switchers */
        {
            function childAtDepth(selector, target, maxdepth){
                var found = false;
                var cdepth = 0;
                do{
                    var ntarget = target.find(selector);
                    if(ntarget.length > 0){
                        found = true;
                        target = ntarget;
                    } else {
                        target = $(target.parent());
                        cdepth++;
                    }
                } while(cdepth <= maxdepth && !found);
                if(found)
                    return target;
                return false;
            }


            var depth = 2;
            $('select.modeswitcher').on("keydown click change", function(e){
                var target = $(this);
                var mode = $(this).val();
                var notmode = [];
                {
                    var notmodes = $(this).find("option");
                    for(var i = 0; i < notmodes.length; i++){
                        notmode.push(notmodes[i].getAttribute("value"));
                    }
                }
                notmode = notmode.filter(function(elem){
                    return elem != mode;
                });
                var found = false;
                var cdepth = 0;
                var count = notmode.length;
                for(var i = 0; i < count; i++){
                    var deactivated = childAtDepth('[data-switcher-mode="' + notmode[i] + '"]', target, depth);
                    deactivated.css("display", "none");
                }
                var activated = childAtDepth('[data-switcher-mode="' + mode + '"]', target, depth);
                activated.css("display", "block");
                if(activated === false){
                    console.warn("Can't find switcher-mode " + mode + '" at max-depth ' + depth + ' for element', this);
                    return;
                }
            }).change();
        }

        /* Get fonts for font selectors */
        {
            // Firest, we need to reload all stylesheets in cross-origin to access rules
            function listFontFaceRules(){
                var fonts = {};
                var il = document.styleSheets.length;
                for(var i = 0; i < il; i++){
                    try{
                        var stylesheet = document.styleSheets[i].cssRules;
                        var jl = stylesheet.length;
                        for(var j = 0; j < jl; j++){
                            var rule = stylesheet[j];
                            if(rule instanceof CSSFontFaceRule){
                                console.log(rule, rule.style.getPropertyValue("font-style"), rule.style.getPropertyValue("font-weight"), rule.style.getPropertyValue("src"));
                                if(!fonts[rule.style.getPropertyValue("font-family")]){
                                    fonts[rule.style.getPropertyValue("font-family")] = {};
                                }
                                if(!fonts[rule.style.getPropertyValue("font-family")][rule.style.getPropertyValue("font-style")]){
                                    fonts[rule.style.getPropertyValue("font-family")][rule.style.getPropertyValue("font-style")] = [];
                                }
                                fonts[rule.style.getPropertyValue("font-family")][rule.style.getPropertyValue("font-style")].push(rule.style.getPropertyValue("font-weight"));
                            }
                        }
                    } catch(e){
                        console.error(e, i);
                        continue;
                    }
                }
                console.log(fonts);
            }
            var waitFor = [];
            $("link[rel=\"stylesheet\"]").each(function(index, elem){
                elem.setAttribute("crossorigin", "anonymous");
                var newhref = elem.getAttribute("href") + "#";
                waitFor.push(newhref);
                elem.setAttribute("href", newhref);
                elem.onload = function(e){
                    waitFor.splice(waitFor.indexOf(e.target.getAttribute("href")), 1);
                    if(waitFor.length == 0)
                        listFontFaceRules();
                }
            });
        }
    });
})(jQuery);
