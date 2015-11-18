ithoughts_tt_gl["initStyleEditor"] = function($){
    $('.color-field').wpColorPicker();
    gradX('.gradient-picker');



    {
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
        /*/
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
            /**/
        {
            $("input[pattern]").on("change keyup click", function(e){
                console.log(e.target.validity.patternMismatch);
                if(e.target.value.match(new RegExp(e.target.getAttribute("pattern")))){
                    console.log("Valid");
                    if($(e.target).qtip('api')){
                        console.log("Ok, destroy");
                        $(e.target).qtip('api').destroy();
                    }
                } else {
                    console.log("Invalid");
                    e.target.removeAttribute("title");
                    if($(e.target).qtip('api')){
                        console.log("Edit tooltip");
                        $(e.target).qtip('api').set("content.text", e.target.getAttribute("data-pattern-infos"));
                    } else {
                        console.log("Create tooltip");
                        $(e.target).qtip({
                            content:{
                                text: e.target.getAttribute("data-pattern-infos"),
                                title: {
                                    text: "Invalid format"
                                }
                            },
                            hide: "focusout",
                            position:{
                                at:"center right",
                                my:"bottom left",
                                viewport: $("body"),
                                container: $("#ithoughts_tooltip_glossary-tipsContainer")
                            },
                            show:{
                                ready:true,
                                event:"focusin"
                            }
                        });
                    }
                }
                console.log(e);
            });
        }
    }
}