(function() {
    tinyMCE.setToggleable = function(element, editor) {
        return function(){
            var self = this;
            editor.on(element, function(e) {
                self.active(e.active);
            });
        };
    };

    tinymce.PluginManager.add('ithoughts_tt_gl_tinymce', function(editor, url) {
        editorG = editor;
        // Add a button that opens a window
        editor.addButton('glossaryterm', {
            title : editor.getLang('ithoughts_tt_gl_tinymce.add_tooltip'),
            image : url + '/icon/glossaryterm.png',
            onclick: glossarytermfct2,
            onPostRender: tinymce.setToggleable('glossaryterm', editor)
        });
        var listtab = 0;
        editor.addButton('glossarylist', {
            title :editor.getLang('ithoughts_tt_gl_tinymce.add_index'),
            image : url + '/icon/glossaryindex.png',
            onPostRender: tinymce.setToggleable('glossarylist', editor),
            onclick: glossarylistfct
        });

        //CSS
        editor.contentCSS.push(url + "/../css/ithoughts_tooltip_glossary-admin.css");

        //fcts
        function glossarylistfct(event){
            var values = {
                list: {
                    alpha: "",
                    cols: "",
                    desc: "",
                    group: ""
                },
                atoz: {
                    group: "",
                    alpha: "",
                },
                type: 0
            };
            var mode = "insert_content";

            sel = editor.selection;
            if(sel.getStart() === sel.getEnd()){
                if(sel.getStart().getAttribute("data-type") == "ithoughts-tooltip-glossary-atoz"){ // Is atoz
                    mode = "load";
                    values.type=1;
                    values.atoz = {
                        alpha: sel.getStart().getAttribute("data-alpha"),
                        group: sel.getStart().getAttribute("data-group")
                    };
                } else if(sel.getStart().getAttribute("data-type") == "ithoughts-tooltip-glossary-term_list"){ // Is term_list
                    mode = "load";
                    values.type=0;
                    values.list = {
                        alpha: sel.getStart().getAttribute("data-alpha"),
                        cols: sel.getStart().getAttribute("data-cols"),
                        desc: sel.getStart().getAttribute("data-desc"),
                        group: sel.getStart().getAttribute("data-group")
                    };
                }
            }
            listtabI = values.type;

            console.log("Mode:", mode);
            console.log("Values:",values);
            editor.windowManager.open({
                title: editor.getLang('ithoughts_tt_gl_tinymce.insert_index'),
                margin: "0 0 0 0",
                padding: "0 0 0 0",
                border: "0 0 0 0",
                body: [
                    new tinyMCE.ui.TabPanel({
                        margin: "0 0 0 0",
                        padding: "0 0 0 0",
                        border: "0 0 0 0",
                        onclick: function(e){
                            try{
                                if(e.target.id.match(/^mceu_\d+-t(\d+)$/)){
                                    listtabI = e.target.id.replace(/^mceu_\d+-t(\d+)$/, "$1");
                                }
                            } catch(e){}// Nothing to do, private
                        },
                        items:[
                            new tinyMCE.ui.Factory.create({
                                type:"form",
                                title: editor.getLang('ithoughts_tt_gl_tinymce.list'),
                                items:[
                                    {
                                        type:"textbox",
                                        label:editor.getLang('ithoughts_tt_gl_tinymce.letters'),
                                        name:"ll",
                                        value: values.list.alpha,
                                        tooltip:editor.getLang('ithoughts_tt_gl_tinymce.letters_explain')
                                    },
                                    {
                                        type:"textbox",
                                        label:editor.getLang('ithoughts_tt_gl_tinymce.columns'),
                                        name:"lc",
                                        value: values.list.cols,
                                        tooltip:editor.getLang('ithoughts_tt_gl_tinymce.columns_explain')
                                    },
                                    {
                                        type:"listbox",
                                        label:editor.getLang('ithoughts_tt_gl_tinymce.description'),
                                        name:"ld",
                                        values:[
                                            {
                                                text:"None",
                                                value:""
                                            },
                                            {
                                                text:editor.getLang('ithoughts_tt_gl_tinymce.excerpt'),
                                                value:"excerpt"
                                            },
                                            {
                                                text:editor.getLang('ithoughts_tt_gl_tinymce.full'),
                                                value:"full"
                                            },
                                            {
                                                text:editor.getLang('ithoughts_tt_gl_tinymce.glossarytips'),
                                                value:"glossarytips"
                                            }
                                        ],
                                        value: values.list.desc,
                                        tooltip:editor.getLang('ithoughts_tt_gl_tinymce.description_explain')
                                    },
                                    {
                                        type:"textbox",
                                        label:editor.getLang('ithoughts_tt_gl_tinymce.group'),
                                        name:"lg",
                                        value: values.list.group,
                                        tooltip:editor.getLang('ithoughts_tt_gl_tinymce.group_explain')
                                    }
                                ]
                            }),
                            new tinyMCE.ui.Factory.create({
                                type:"form",
                                title:editor.getLang('ithoughts_tt_gl_tinymce.atoz'),
                                items: [
                                    {
                                        type:"textbox",
                                        label:editor.getLang('ithoughts_tt_gl_tinymce.letters'),
                                        name:"al",
                                        value: values.atoz.alpha,
                                        tooltip:editor.getLang('ithoughts_tt_gl_tinymce.letters_explain')
                                    },
                                    {
                                        type:"textbox",
                                        label:editor.getLang('ithoughts_tt_gl_tinymce.group'),
                                        name:"ag",
                                        value: values.atoz.group,
                                        tooltip:editor.getLang('ithoughts_tt_gl_tinymce.group_explain')
                                    }
                                ]
                            })
                        ],
                        activeTab:values.type
                    })
                ],
                onsubmit: function(e) {
                    console.log(e.data, listtab);
                    if(mode == "load")
                        sel.select(sel.getStart());
                    switch(parseInt(listtab)){
                        case 0:{
                            var opts = [];
                            if(!!e.data['ll'])
                                opts.push('alpha="' + stripQuotes(e.data['ll'], true) + '"');
                            if(!!e.data['lg'])
                                opts.push('group="' + stripQuotes(e.data['lg'], true) + '"');
                            if(!!e.data['lc'])
                                opts.push('cols="' + stripQuotes(e.data['lc'], true) + '"');
                            if(!!e.data['ld'])
                                opts.push('desc="' + stripQuotes(e.data['ld'], true) + '"');
                            editor.insertContent('[glossary_term_list' + ((opts.length > 0) ? ' ' + opts.join(' ') : '') + ' /]');
                        } break;
                        case 1:{
                            var opts = [];
                            if(!!e.data['al'])
                                opts.push('alpha="' + stripQuotes(e.data['al'], true) + '"');
                            if(!!e.data['ag'])
                                opts.push('group="' + stripQuotes(e.data['ag'], true) + '"');
                            editor.insertContent('[glossary_atoz' + ((opts.length > 0) ? ' ' + opts.join(' ') : '') + ' /]');
                        } break;
                    }
                }
            });
        }

        function glossarytermfct2(event){/**/
            var values = {
            };
            var sel = editor.selection;
            var mode = "";
            var types = ["ithoughts-tooltip-glossary-term", "ithoughts-tooltip-glossary-tooltip", "ithoughts-tooltip-glossary-mediatip"]
            if(sel.getStart() === sel.getEnd()){
                var content = sel.getContent({format: 'text'});
                if(types.indexOf(sel.getStart().getAttribute("data-type")) > -1){ // On Glossary Term or Tooltip or Mediatip, load data
                    mode = "load";
                    values= {
                        text: content,
                        tooltip_content: ((sel.getStart().getAttribute("data-tooltip-content")) ? window.decodeURIComponent(sel.getStart().getAttribute("data-tooltip-content")) : null) || content,
                        glossary_id: sel.getStart().getAttribute("data-glossary-id"),
                        term_search: removeAccents(content.toLowerCase()),
                        mediatip_type: sel.getStart().getAttribute("data-mediatip-type"),
                        mediatip_content: sel.getStart().getAttribute("data-mediatip-content"),
                        mediatip_link: sel.getStart().getAttribute("data-mediatip-link"),
                        type: ["glossary", "tooltip", "mediatip"][types.indexOf(sel.getStart().getAttribute("data-type"))]
                    };
                } else { //Create new glossary term
                    if(content && content.length > 0){ // If something is selected
                        mode = "insert_content"
                        values= {
                            text: content,
                            tooltip_content: content,
                            glossary_id: null,
                            term_search: removeAccents(content.toLowerCase()),
                            mediatip_type: "",
                            mediatip_content: "",
                            type: "tooltip"
                        };
                    } else { // If no selection
                        var rng = sel.getRng();
                        //Find immediate next && previous chars
                        var txt = rng.commonAncestorContainer.textContent;
                        var char = /[\w\d]/;
                        var txtl = txt.length;/*
                    if(txtl > rng.startOffset && txt[rng.startOffset - 1].match(char) && txt[rng.startOffset].match(char)){ // If in a word, extend to whole 
                        // console.log("No content, extend");
                        /*var start = rng.startOffset;
                        while(start > 0 && txt[start - 1].match(char))
                            start--;
                        var end = rng.startOffset;
                        while(end < txtl && txt[end].match(char))
                            end++;
                        mode = "extend" + JSON.stringify([start,end]);
                        // find for first & last char of word-;
                        var subtxt = txt.slice(start, end);
                        values.content = subtxt;
                        values.slug = subtxt;
                    } else {
                        // console.log("No content, new");
                    }*/
                    }
                }
            }



            jQuery.post(ithoughts_tt_gl.admin_ajax, {action: "ithoughts_tt_gl_get_tinymce_tooltip_form", data: values}, function(out){
                //console.log(out);
                var newDom = jQuery(jQuery.parseHTML(out, true)).css({zIndex: 1000, position: "absolute",opacity: 0});
                var h = 300;
                var w = 455;
                var popupTooltip = newDom.find("#ithoughts_tt_gl-tooltip-form");
                jQuery(window).on("resize", function(){
                    popupTooltip.css({width:w + "px", height:h+"px", left: (jQuery(window).width() - w)/2 + "px", top: (jQuery(window).height() - h)/2 + "px"});
                }).resize();
                jQuery('body').append(newDom.animate({opacity:1}, 500));
                newDom[0].finish = (function(){
                    var domC = newDom;
                    return function(data){
                        domC.animate({opacity:0}, 500, function(){
                            domC.remove();
                        });
                        if(typeof data == "undefined")
                            return;
                        // Insert content when the window form is submitted
                        if(mode == "load")
                            sel.select(sel.getStart());
                        else if(mode.indexOf("extend") > -1){
                            rng = sel.getRng(true);
                            var arr = JSON.parse(mode.match(/extend(.*)$/)[1]);
                            var text = rng.commonAncestorContainer.textContent;
                            rng.commonAncestorContainer.textContent = text.slice(0, arr[0]) + text.slice(arr[1], text.length - 1);
                            editor.fire("DblClick");
                        }
                        switch(data.type){
                            case "glossary": {
                                if(data.term_id == "" || data.text == "")
                                    return;
                                else
                                    editor.insertContent('[ithoughts_tooltip_glossary-glossary glossary-id="'+data.term_id+'"]'+data.text+"[/ithoughts_tooltip_glossary-glossary]" + ((mode != "load") ? " " : ""));
                            } break;

                            case "tooltip": {
                                if(data.tooltip_content == "" || data.text == "")
                                    return;
                                else
                                    editor.insertContent('[ithoughts_tooltip_glossary-tooltip tooltip-content="'+stripQuotes(data.tooltip_content.trim(), true)+'"]'+data.text+"[/ithoughts_tooltip_glossary-tooltip]" + ((mode != "load") ? " " : ""));
                            } break;

                            case "mediatip": {
                                if(data.mediatip_type == "" || data.mediatip_content == "" || data.text == "")
                                    return;
                                else
                                    editor.insertContent('[ithoughts_tooltip_glossary-mediatip mediatip-type="' + data.mediatip_type + '" mediatip-content="' + stripQuotes(data.mediatip_content, true) + '" mediatip-link="' + data.mediatip_link + '"]'+data.text+"[/ithoughts_tooltip_glossary-mediatip]" + ((mode != "load") ? " " : ""));
                            } break;
                        }
                    }
                })();
            });
            /*/
            var field_name="test";
            editor.windowManager.open(
                {
                    title: "Insert a Tooltip",
                    url: ithoughts_tt_gl.admin_ajax + "?action=ithoughts_tt_gl_get_tinymce_tooltip_form",
                    width: 400,
                    height: 300,
                    popup_css: "no",
                    resizable: true,
                    buttons: [
                        {
                            text: 'Insert',
                            classes: 'widget btn primary first abs-layout-item',
                            disabled: false,
                            onclick: function(){
                                console.log(top.tinymce.activeEditor.windowManager.getParams());
                            },
                            id: 'insertButton'
                        },
                        {
                            text: 'Close',
                            onclick: 'close',
                            window : window,
                            input : field_name
                        }
                    ]
                },
                {
                    oninsert: function(url) {
                        console.log(url);
                        window.document.getElementById(field_name).value = url; 
                    },
                    onselect: function() {
                        // 
                    },
                }
            );/**/
        }


        function glossarytermfct(event){
            //var values = {content:"",slug:""};

            console.log("Mode:", mode);
            console.log("Values:",values);
            //Retrieve list of glossary terms
            jQuery.ajax({
                url: ithoughts_tt_gl.admin_ajax,
                contentType:"json",
                data:{action: "ithoughts_tt_gl_get_terms_list"},
                complete: function(res){
                    var resJson = res.responseJSON
                    if(typeof resJson == "undefined" || resJson.success != true){
                        console.error(ithoughts_tt_gl.admin_ajax, res);
                        throw "Error while retrieving list of terms";
                    } else {
                        var terms = Object.keys(resJson.data).sort(function(a,b){
                            a = removeAccents(a.toLowerCase());
                            b = removeAccents(b.toLowerCase());
                            if(a < b){
                                return -1;
                            } else if(a > b){
                                return 1;
                            }
                            return 0;
                        });
                        listtabT = values.type;

                        //Todo find glossary posts via AJAX
                        editor.windowManager.open({
                            title: editor.getLang('ithoughts_tt_gl_tinymce.insert_tooltip'),
                            name:"tooltip",
                            margin: "0 0 0 0",
                            padding: "0 0 0 0",
                            border: "0 0 0 0",
                            body: [
                                new tinyMCE.ui.TabPanel({
                                    margin: "0 0 0 0",
                                    padding: "0 0 0 0",
                                    border: "0 0 0 0",
                                    onclick: function(e){
                                        try{
                                            if(e.target.id.match(/^mceu_\d+-t(\d+)$/)){
                                                listtabT = e.target.id.replace(/^mceu_\d+-t(\d+)$/, "$1");
                                            }
                                        } catch(e){}// Nothing to do, private
                                    },
                                    items:[
                                        new tinyMCE.ui.Factory.create({
                                            type:"form",
                                            title:editor.getLang('ithoughts_tt_gl_tinymce.glossary_term'),
                                            items: [
                                                {
                                                    type:"textbox",
                                                    label:editor.getLang('ithoughts_tt_gl_tinymce.text'),
                                                    name:"gt",
                                                    value: values.text,
                                                    tooltip:editor.getLang('ithoughts_tt_gl_tinymce.text_explain') || "Text to display"
                                                },
                                                {
                                                    type: "listbox",
                                                    label: editor.getLang('ithoughts_tt_gl_tinymce.term'),
                                                    name: "gs",
                                                    value: values.glossary,
                                                    values: [{text: "", value: "", tooltip: "Empty"}].concat(
                                                        terms.map(function(key){
                                                            var obj = resJson.data[key];
                                                            return {
                                                                text: key,
                                                                value: obj["slug"],
                                                                tooltip: obj["content"]
                                                            };
                                                        })
                                                    )
                                                }
                                            ]
                                        }),
                                        new tinyMCE.ui.Factory.create({
                                            type:"form",
                                            title: editor.getLang('ithoughts_tt_gl_tinymce.tooltip'),
                                            items:[
                                                {
                                                    type:"textbox",
                                                    label:editor.getLang('ithoughts_tt_gl_tinymce.text'),
                                                    name:"tt",
                                                    value: values.text,
                                                    tooltip:editor.getLang('ithoughts_tt_gl_tinymce.text_explain') || "Text to display"
                                                },
                                                {
                                                    type:"textbox",
                                                    label:editor.getLang('ithoughts_tt_gl_tinymce.content'),
                                                    name:"tc",
                                                    value: values.content,
                                                    tooltip:editor.getLang('ithoughts_tt_gl_tinymce.content_explain') || "Text into the tooltip"
                                                }
                                            ]
                                        }),
                                        new tinyMCE.ui.Factory.create({
                                            type:"form",
                                            title: editor.getLang('ithoughts_tt_gl_tinymce.mediatip'),
                                            items:[
                                                {
                                                    type:"textbox",
                                                    label:editor.getLang('ithoughts_tt_gl_tinymce.text'),
                                                    name:"mt",
                                                    value: values.text,
                                                    tooltip:editor.getLang('ithoughts_tt_gl_tinymce.text_explain') || "Text to display"
                                                },
                                                {
                                                    type: "container",
                                                    onpostrender: function(){
                                                        if(values.mediatip.image != "" && values.mediatip.link != "" && values.mediatip.id != "" && values.mediatip.image && values.mediatip.link && values.mediatip.id)
                                                            jQuery('#image-box-body')[0].innerHTML = '<img src="' + window.decodeURIComponent(values.mediatip.image) + '"/>';
                                                    },
                                                    id: "image-box",
                                                    minHeight: "150",
                                                    maxHeight: "150",
                                                    maxWidth: "300",
                                                    style: "text-align: center;margin:0 auto"
                                                },
                                                {
                                                    type: "textbox",
                                                    value: (function(){
                                                        if(values.mediatip.image != "" && values.mediatip.link != "" && values.mediatip.id != "" && values.mediatip.image && values.mediatip.link && values.mediatip.id)
                                                            return JSON.stringify({
                                                                url:values.mediatip.image,
                                                                id: values.mediatip.id,
                                                                link:values.mediatip.link
                                                            });
                                                        else
                                                            return "";
                                                    })(),
                                                    hidden: true,
                                                    name:"mc",
                                                    id: "image-box-id"

                                                },
                                                {
                                                    type: 'button',
                                                    name: 'select-image',
                                                    text: editor.getLang('ithoughts_tt_gl_tinymce.select_image'),
                                                    onclick: function() {
                                                        onclickEntryPoint = this;

                                                        window.mb = window.mb || {};

                                                        window.mb.frame = wp.media({
                                                            frame: 'post',
                                                            state: 'insert',
                                                            library : {
                                                                type : ["audio", "video",'image']
                                                            },
                                                            multiple: false
                                                        });

                                                        window.mb.frame.on('insert', function() {
                                                            var json = window.mb.frame.state().get('selection').first().toJSON();
                                                            console.log(json);

                                                            if (0 > jQuery.trim(json.url.length)) {
                                                                return;
                                                            }

                                                            jQuery("#image-box-id").val(JSON.stringify({
                                                                url:json.url,
                                                                id: json.id,
                                                                link: json.link
                                                            }));
                                                            jQuery('#image-box-body')[0].innerHTML = '<img src="' + json.url + '"/>';
                                                        });

                                                        window.mb.frame.open();
                                                    }
                                                }/*
                                                {
                                                    type:"textbox",
                                                    label:editor.getLang('ithoughts_tt_gl_tinymce.mediatip'),
                                                    name:"mc",
                                                    value: values.mediatip,
                                                    tooltip:"Media content of the tooltip"
                                                }*/
                                            ]
                                        })
                                    ],
                                    activeTab:values.type
                                })
                            ],
                            onsubmit: function(e) {
                                console.log(e.data, listtabT);
                                // Insert content when the window form is submitted
                                if(mode == "load")
                                    sel.select(sel.getStart());
                                else if(mode.indexOf("extend") > -1){
                                    rng = sel.getRng(true);
                                    var arr = JSON.parse(mode.match(/extend(.*)$/)[1]);
                                    var text = rng.commonAncestorContainer.textContent;
                                    rng.commonAncestorContainer.textContent = text.slice(0, arr[0]) + text.slice(arr[1], text.length - 1);
                                    editor.fire("DblClick");
                                }
                                switch(parseInt(listtabT)){
                                    case 0: {
                                        if(e.data.gt.trim() == "" || e.data.gs == "")
                                            return;
                                        else
                                            editor.insertContent('[ithoughts_tooltip_glossary-glossary slug="'+stripQuotes(e.data.gs, true)+'"]'+e.data.gt.trim()+"[/ithoughts_tooltip_glossary-glossary] ");
                                    } break;

                                    case 1: {
                                        if(e.data.tc.trim() == "" || e.data.tt.trim() == "")
                                            return;
                                        else
                                            editor.insertContent('[ithoughts_tooltip_glossary-tooltip content="'+stripQuotes(e.data.tc.trim(), true)+'"]'+e.data.tt.trim()+"[/ithoughts_tooltip_glossary-tooltip] ");
                                    } break;

                                    case 2: {
                                        try{
                                            if(e.data.mc.trim() == "" || e.data.mt.trim() == "")
                                                return;
                                            var imgdata = JSON.parse(e.data.mc);
                                            console.log(imgdata);
                                            editor.insertContent('[ithoughts_tooltip_glossary-mediatip link="'+stripQuotes(imgdata.link, true)+'" image="'+stripQuotes(imgdata.url, true)+'" imageid="'+stripQuotes(imgdata.id, true)+'"]'+e.data.mt.trim()+"[/ithoughts_tooltip_glossary-mediatip] ");
                                        } catch(e){
                                            console.error("Error with serialized data", e);
                                            return;
                                        }
                                    } break;
                                }
                            }
                        });
                    }
                }
            });/*



                title: 'Insert Glossary Term',
                body: [
                    {type: 'textbox', name: 'text', label: 'Text', value: values.content},
                    {type: 'textbox', name: 'slug', label: 'Slug', value: values.slug}
                ],
                onsubmit: function(e) {
                    if(e.data.slug == "")
                        e.data.slug = e.data.text;
                    // Insert content when the window form is submitted
                    if(mode == "complete")
                        sel.select(sel.getStart());/*
                    else if(mode.indexOf("extend") > -1){
                        rng = sel.getRng(true);
                        var arr = JSON.parse(mode.match(/extend(.*)$/)[1]);
                        var text = rng.commonAncestorContainer.textContent;
                        rng.commonAncestorContainer.textContent = text.slice(0, arr[0]) + text.slice(arr[1], text.length - 1);
                        console.log(rng, arr);
                        editor.fire("DblClick");
                    }/**//*
                    editor.insertContent('[glossary slug="'+e.data.slug+'"]'+e.data.text+"[/glossary] ");
                }
            });*/
        }

        //replace from shortcode to displayable html content
        editor.on('BeforeSetcontent', function(event){
            event.content = replaceShortcodes( event.content );
        });
        //replace from displayable html content to shortcode
        editor.on('GetContent', function(event){
            event.content = restoreShortcodes(event.content);
        });

        editor.onNodeChange.add(function(ed, cm, e) {
            if(e.getAttribute("data-type") == "ithoughts-tooltip-glossary-term" || e.getAttribute("data-type") == "ithoughts-tooltip-glossary-tooltip" || e.getAttribute("data-type") == "ithoughts-tooltip-glossary-mediatip")
                editor.fire('glossaryterm', {active: true});
            else
                editor.fire('glossaryterm', {active: false});
            if(e.getAttribute("data-type") == "ithoughts-tooltip-glossary-term_list" || e.getAttribute("data-type") == "ithoughts-tooltip-glossary-atoz")
                editor.fire('glossarylist', {active: true});
            else
                editor.fire('glossarylist', {active: false});
        });
    });
})();

function stripQuotes(string, encode){
    if(encode)
        return string.replace(/"/g, "&quot;");
    else
        return string.replace(/&quot;/g, '"');
}
replaceShortcodesEl = [
    function(content){ // For [glossary]
        return content.replace( /\[(?:ithoughts_tooltip_glossary-)?(glossary|tooltip|mediatip)(?!_)(.*?)\](.*?)\[\/(?:ithoughts_tooltip_glossary-)?(glossary|tooltip|mediatip)\]/g, function( all,balise,inner, text){
            var attrs = {};
            var regex = /([\w\d\-]+?)="(.+?)"/g;
            var matched = null;
            while (matched = regex.exec(inner)) {
                attrs[matched[1]] = matched[2];
            }
            var ret = "<a data-type=\"ithoughts-tooltip-glossary-"+["term","tooltip","mediatip"][["glossary","tooltip","mediatip"].indexOf(balise)]+ "\"";
            for(var i in attrs){
                ret += " data-"+i+"=\""+stripQuotes(attrs[i], true)+"\"";
            }
            return ret + ">" + text + "</a>";
        });
    },
    function(content){ // For [glossary_(term_list|atoz)]
        return content.replace( /\[glossary_(term_list|atoz)(.*?)\/\]/g, function( all,type, attrStr){
            var attrs = {};
            var regex = /([\w\d\-]+?)="(.+?)"/g;
            var matched = null;
            while (matched = regex.exec(attrStr)) {
                attrs[matched[1]] = matched[2];
            }
            var ret = "<span data-type=\"ithoughts-tooltip-glossary-"+type+"\"";
            for(var i in attrs){
                ret += " data-"+i+"=\""+stripQuotes(attrs[i], true)+"\"";
            }
            return ret + ">Glossary " + ((type == "term_list") ? "List" : "A-to-Z") + "</span>";
        });
    }
];
restoreShortcodesEl = [
    function(content){ // For [glossary]
        return content.replace( /<a\s+data-type="ithoughts-tooltip-glossary-(term|tooltip|mediatip)"(.*?)>(.*?)<\/a>/g, function( all,type,inner, text){
            var attrs = {};
            var regex = /data-([\w\d\-]+?)="(.+?)"/g;
            var matched = null;
            while (matched = regex.exec(inner)) {
                attrs[matched[1]] = matched[2];
            }
            var b = ["glossary","tooltip","mediatip"][["term","tooltip","mediatip"].indexOf(type)];
            var ret = "[ithoughts_tooltip_glossary-" + b;
            for(var i in attrs){
                ret += " "+window.decodeURIComponent(i)+"=\""+window.decodeURIComponent(attrs[i])+"\"";
            }
            return ret + "]" + text + "[/ithoughts_tooltip_glossary-"+b+"]";
        });
    },
    function(content){ // For [glossary_(term_list|atoz)]
        return content.replace( /<span\s+data-type="ithoughts-tooltip-glossary-(term_list|atoz)"(.*?)>.*?<\/span>/g, function( all,type, attrStr){
            var attrs = {};
            var regex = /data-([\w\d\-]+?)="(.+?)"/g;
            var matched = null;
            while (matched = regex.exec(attrStr)) {
                attrs[matched[1]] = matched[2];
            }
            var ret = "[glossary_" + type;
            for(var i in attrs){
                ret += " "+window.decodeURIComponent(i)+"=\""+window.decodeURIComponent(attrs[i])+"\"";
            }
            return ret + "/]";
        });
    }
];

function replaceShortcodes( content ) {
    var repLength = replaceShortcodesEl.length;
    for(var i = 0; i < repLength; i++){
        content = replaceShortcodesEl[i](content);
    }
    return content;
}

function restoreShortcodes( content ) {
    var resLength = restoreShortcodesEl.length;
    for(var i = 0; i < resLength; i++){
        content = restoreShortcodesEl[i](content);
    }
    return content;
}