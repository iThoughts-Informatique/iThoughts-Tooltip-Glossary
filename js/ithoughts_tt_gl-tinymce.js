makeSortString = (function() {
    var translate_re = /[¹²³áàâãäåaaaÀÁÂÃÄÅAAAÆccç©CCÇÐÐèéê?ëeeeeeÈÊË?EEEEE€gGiìíîïìiiiÌÍÎÏ?ÌIIIlLnnñNNÑòóôõöoooøÒÓÔÕÖOOOØŒr®Ršs?ßŠS?ùúûüuuuuÙÚÛÜUUUUýÿÝŸžzzŽZZ]/g;
    var translate = {
"¹":"1","²":"2","³":"3","á":"a","à":"a","â":"a","ã":"a","ä":"a","å":"a","a":"a","a":"a","a":"a","À":"a","Á":"a","Â":"a","Ã":"a","Ä":"a","Å":"a","A":"a","A":"a",
"A":"a","Æ":"a","c":"c","c":"c","ç":"c","©":"c","C":"c","C":"c","Ç":"c","Ð":"d","Ð":"d","è":"e","é":"e","ê":"e","?":"e","ë":"e","e":"e","e":"e","e":"e","e":"e",
"e":"e","È":"e","Ê":"e","Ë":"e","?":"e","E":"e","E":"e","E":"e","E":"e","E":"e","€":"e","g":"g","G":"g","i":"i","ì":"i","í":"i","î":"i","ï":"i","ì":"i","i":"i",
"i":"i","i":"i","Ì":"i","Í":"i","Î":"i","Ï":"i","?":"i","Ì":"i","I":"i","I":"i","I":"i","l":"l","L":"l","n":"n","n":"n","ñ":"n","N":"n","N":"n","Ñ":"n","ò":"o",
"ó":"o","ô":"o","õ":"o","ö":"o","o":"o","o":"o","o":"o","ø":"o","Ò":"o","Ó":"o","Ô":"o","Õ":"o","Ö":"o","O":"o","O":"o","O":"o","Ø":"o","Œ":"o","r":"r","®":"r",
"R":"r","š":"s","s":"s","?":"s","ß":"s","Š":"s","S":"s","?":"s","ù":"u","ú":"u","û":"u","ü":"u","u":"u","u":"u","u":"u","u":"u","Ù":"u","Ú":"u","Û":"u","Ü":"u",
"U":"u","U":"u","U":"u","U":"u","ý":"y","ÿ":"y","Ý":"y","Ÿ":"y","ž":"z","z":"z","z":"z","Ž":"z","Z":"z","Z":"z"
    };
    return function(s) {
        return(s.replace(translate_re, function(match){return translate[match];}) );
    }
})();

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
        // Add a button that opens a window
        editor.addButton('glossaryterm', {
            title : editor.getLang('ithoughts_tt_gl_tinymce.add_tooltip'),
            image : url + '/icon/glossaryterm.png',
            onclick: glossarytermfct,
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
            var mode = "";

            sel = editor.selection;
            if(sel.getStart() === sel.getEnd()){
                if(sel.getStart().getAttribute("data-type") == "ithoughts-tooltip-glossary-atoz"){ // Is atoz
                    console.log("atoz");
                    mode = "complete";
                    values.type=1;
                    values.atoz = {
                        alpha: sel.getStart().getAttribute("data-alpha"),
                        group: sel.getStart().getAttribute("data-group")
                    };
                } else if(sel.getStart().getAttribute("data-type") == "ithoughts-tooltip-glossary-term_list"){ // Is term_list
                    console.log("term_list");
                    mode = "complete";
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

            console.log(values);
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
                                if(e.originalTarget.id.match(/^mceu_\d+-t(\d+)$/)){
                                    listtabI = e.originalTarget.id.replace(/^mceu_\d+-t(\d+)$/, "$1");
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
                    console.log(e.data, listtab, mode);
                    if(mode == "complete")
                        sel.select(sel.getStart());
                    switch(listtab){
                        case 0:{
                            var opts = [];
                            if(!!e.data['ll'])
                                opts.push('alpha="' + e.data['ll'] + '"');
                            if(!!e.data['lg'])
                                opts.push('group="' + e.data['lg'] + '"');
                            if(!!e.data['lc'])
                                opts.push('cols="' + e.data['lc'] + '"');
                            if(!!e.data['ld'])
                                opts.push('desc="' + e.data['ld'] + '"');
                            console.log(opts);
                            editor.insertContent('[glossary_term_list' + ((opts.length > 0) ? ' ' + opts.join(' ') : '') + ' /]');
                        } break;
                        case 1:{
                            var opts = [];
                            if(!!e.data['al'])
                                opts.push('alpha="' + e.data['al'] + '"');
                            if(!!e.data['ag'])
                                opts.push('group="' + e.data['ag'] + '"');
                            console.log(opts);
                            editor.insertContent('[glossary_atoz' + ((opts.length > 0) ? ' ' + opts.join(' ') : '') + ' /]');
                        } break;
                    }
                }
            });
        }

        function glossarytermfct(event){
            //var values = {content:"",slug:""};
            var values = {
                glossary: "",
                tooltip: "",
                mediatip: {
                    image: "",
                    id: "",
                    link: ""
                },
                text: "",
                type: 0
            };
            var mode = "";

            sel = editor.selection;
            var types = ["ithoughts-tooltip-glossary-term", "ithoughts-tooltip-glossary-tooltip", "ithoughts-tooltip-glossary-mediatip"]
            if(sel.getStart() === sel.getEnd()){
                if(types.indexOf(sel.getStart().getAttribute("data-type")) > -1){ // On Glossary Term or Tooltip or Mediatip, load data
                    mode = "complete";
                    values= {
                        text: sel.getStart().textContent,
                        content: ((sel.getStart().getAttribute("data-content")) ? window.decodeURIComponent(sel.getStart().getAttribute("data-content")) : null) || sel.getStart().textContent,
                        glossary: sel.getStart().getAttribute("data-slug") || sel.getStart().textContent,
                        mediatip: {
                            image: window.decodeURIComponent(sel.getStart().getAttribute("data-image")),
                            id: sel.getStart().getAttribute("data-imageid"),
                            link: window.decodeURIComponent(sel.getStart().getAttribute("data-link"))
                        },
                        type: types.indexOf(sel.getStart().getAttribute("data-type"))
                    };
                } else { //Create new glossary term
                    var content = sel.getContent({format: 'text'});
                    if(content && content.length > 0){ // If something is selected
                        console.log("Content");
                        values= {
                            text: content,
                            content: content,
                            glossary: content,
                            mediatip: {
                                image: "",
                                id: "",
                                link: ""
                            },
                            type: 1
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
                        console.log(resJson);
                        var terms = Object.keys(resJson.data).sort(function(a,b){
                            a = makeSortString(a.toLowerCase());
                            b = makeSortString(b.toLowerCase());
                            if(a < b){
                                return -1;
                            } else if(a > b){
                                return 1;
                            }
                            return 0;
                        });
                        console.log(terms);
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
                                            if(e.originalTarget.id.match(/^mceu_\d+-t(\d+)$/)){
                                                listtabT = e.originalTarget.id.replace(/^mceu_\d+-t(\d+)$/, "$1");
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
                                                            console.log({
                                                                text: key,
                                                                value: obj["slug"],
                                                                tooltip: obj["content"]
                                                            });
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
                                                        console.log(onclickEntryPoint);

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
                                if(mode == "complete")
                                    sel.select(sel.getStart());
                                else if(mode.indexOf("extend") > -1){
                                    rng = sel.getRng(true);
                                    var arr = JSON.parse(mode.match(/extend(.*)$/)[1]);
                                    var text = rng.commonAncestorContainer.textContent;
                                    rng.commonAncestorContainer.textContent = text.slice(0, arr[0]) + text.slice(arr[1], text.length - 1);
                                    console.log(rng, arr);
                                    editor.fire("DblClick");
                                }
                                switch(parseInt(listtabT)){
                                    case 0: {
                                        if(e.data.gt.trim() == "" || e.data.gs == "")
                                            return;
                                        else
                                            editor.insertContent('[ithoughts_tooltip_glossary-glossary slug="'+e.data.gs+'"]'+e.data.gt.trim()+"[/ithoughts_tooltip_glossary-glossary] ");
                                    } break;

                                    case 1: {
                                        if(e.data.tc.trim() == "" || e.data.tt.trim() == "")
                                            return;
                                        else
                                            editor.insertContent('[ithoughts_tooltip_glossary-tooltip content="'+e.data.tc.trim()+'"]'+e.data.tt.trim()+"[/ithoughts_tooltip_glossary-tooltip] ");
                                    } break;

                                    case 2: {
                                        try{
                                            console.log(e.data);
                                            if(e.data.mc.trim() == "" || e.data.mt.trim() == "")
                                                return;
                                            var imgdata = JSON.parse(e.data.mc);
                                            console.log(imgdata);
                                            editor.insertContent('[ithoughts_tooltip_glossary-mediatip link="'+imgdata.link+'" image="'+imgdata.url+'" imageid="'+imgdata.id+'"]'+e.data.mt.trim()+"[/ithoughts_tooltip_glossary-tooltip] ");
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
                ret += " data-"+window.encodeURIComponent(i)+"=\""+window.encodeURIComponent(attrs[i])+"\"";
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
                ret += " data-"+window.encodeURIComponent(i)+"=\""+window.encodeURIComponent(attrs[i])+"\"";
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