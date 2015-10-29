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

        eddd = editor;
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
                        title: "Hello",
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
                                        tooltip:"Letters to be displayed in the list. If not specified, all letters will be displayed"
                                    },
                                    {
                                        type:"textbox",
                                        label:editor.getLang('ithoughts_tt_gl_tinymce.columns'),
                                        name:"lc",
                                        value: values.list.cols,
                                        tooltip:"Number of columns to show for list"
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
                                            }
                                        ],
                                        value: values.list.desc,
                                        tooltip:"Description mode: Excerpt/Full"
                                    },
                                    {
                                        type:"textbox",
                                        label:editor.getLang('ithoughts_tt_gl_tinymce.group'),
                                        name:"lg",
                                        value: values.list.group,
                                        tooltip:"Group(s) to list"
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
                                        tooltip:"Letters to be displayed in the list. If not specified, all letters will be displayed"
                                    },
                                    {
                                        type:"textbox",
                                        label:editor.getLang('ithoughts_tt_gl_tinymce.group'),
                                        name:"ag",
                                        value: values.atoz.group,
                                        tooltip:"Group(s) to list"
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
                tt: {
                    t: "",
                    c: ""
                },
                gl: {
                    t: "",
                    s: "",
                },
                type: 0
            };
            var mode = "";

            sel = editor.selection;
            if(sel.getStart() === sel.getEnd()){
                if(sel.getStart().getAttribute("data-type") == "ithoughts-tooltip-glossary-term" || sel.getStart().getAttribute("data-type") == "ithoughts-tooltip-glossary-tooltip"){ // On Glossary Term or Tooltip, load data
                    mode = "complete";
                    values= {
                        tt: {
                            t:sel.getStart().textContent,
                            c: window.decodeURIComponent(sel.getStart().getAttribute("data-content")) || sel.getStart().textContent
                        },
                        gl: {
                            t:sel.getStart().textContent,
                            s: sel.getStart().getAttribute("data-slug") || sel.getStart().textContent
                        },
                        type: (sel.getStart().getAttribute("data-type") == "ithoughts-tooltip-glossary-term") ? 0 : 1
                    }
                } else { //Create new glossary term
                    var content = sel.getContent({format: 'text'});
                    if(content && content.length > 0){ // If something is selected
                        console.log("Content");
                        values = {
                            tt: {
                                t:content,
                                c:content
                            },
                            gl: {
                                t:content,
                                s:content
                            },
                            type:1
                        }
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
                        listtabT = values.type;

                        //Todo find glossary posts via AJAX
                        editor.windowManager.open({
                            title: 'Insert Tooltip',
                            name:"tooltip",
                            margin: "0 0 0 0",
                            padding: "0 0 0 0",
                            border: "0 0 0 0",
                            body: [
                                new tinyMCE.ui.TabPanel({
                                    title: "Tooltip",
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
                                            title:"Glossary Term",
                                            items: [
                                                {
                                                    type:"textbox",
                                                    label:editor.getLang('ithoughts_tt_gl_tinymce.text'),
                                                    name:"gt",
                                                    value: values.gl.t,
                                                    tooltip:"Text to display"
                                                },/*
                                                {
                                                    type:"textbox",
                                                    label:"Slug",
                                                    name:"ag",
                                                    value: values.gl.s,
                                                    tooltip:"Slug of term"
                                                },*/
                                                {
                                                    type: "listbox",
                                                    label: editor.getLang('ithoughts_tt_gl_tinymce.term'),
                                                    name: "gs",
                                                    value: values.gl.s,
                                                    values: [{text: "", value: "", tooltip: "Empty"}].concat(
                                                        Object.keys(resJson.data).map(function(key){
                                                            console.log(key);
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
                                            title: "Tooltip",
                                            items:[
                                                {
                                                    type:"textbox",
                                                    label:editor.getLang('ithoughts_tt_gl_tinymce.text'),
                                                    name:"tt",
                                                    value: values.tt.t,
                                                    tooltip:"Text to display"
                                                },
                                                {
                                                    type:"textbox",
                                                    label:editor.getLang('ithoughts_tt_gl_tinymce.content'),
                                                    name:"tc",
                                                    value: values.tt.c,
                                                    tooltip:"Text into the tooltip"
                                                }
                                            ]
                                        })
                                    ],
                                    activeTab:values.type
                                })
                            ],
                            onsubmit: function(e) {
                                console.log(e.data);
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
                                if(listtabT == 0){
                                    if(e.data.gt.trim() == "" || e.data.gs == "")
                                        return;
                                    else
                                        editor.insertContent('[glossary slug="'+e.data.gs+'"]'+e.data.gt.trim()+"[/glossary] ");
                                } else {
                                    if(e.data.tc.trim() == "" || e.data.tt.trim() == "")
                                        return;
                                    else
                                        editor.insertContent('[tooltip content="'+e.data.tc.trim()+'"]'+e.data.tt.trim()+"[/tooltip] ");
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
            if(e.getAttribute("data-type") == "ithoughts-tooltip-glossary-term" || e.getAttribute("data-type") == "ithoughts-tooltip-glossary-tooltip")
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
        return content.replace( /\[(glossary|tooltip)(?!_)(.*?)\](.*?)\[\/(glossary|tooltip)\]/g, function( all,balise,inner, text){
            var attrs = {};
            var regex = /([\w\d\-]+?)="(.+?)"/g;
            var matched = null;
            while (matched = regex.exec(inner)) {
                attrs[matched[1]] = matched[2];
            }
            var ret = "<a data-type=\"ithoughts-tooltip-glossary-"+((balise=="glossary") ? "term" : "tooltip") + "\"";
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
        return content.replace( /<a\s+data-type="ithoughts-tooltip-glossary-(term|tooltip)"(.*?)>(.*?)<\/a>/g, function( all,type,inner, text){
            var attrs = {};
            var regex = /data-([\w\d\-]+?)="(.+?)"/g;
            var matched = null;
            while (matched = regex.exec(inner)) {
                attrs[matched[1]] = matched[2];
            }
            var b = ((type == "term") ? "glossary" : "tooltip");
            var ret = "[" + b;
            for(var i in attrs){
                ret += " "+window.decodeURIComponent(i)+"=\""+window.decodeURIComponent(attrs[i])+"\"";
            }
            return ret + "]" + text + "[/"+b+"]";
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