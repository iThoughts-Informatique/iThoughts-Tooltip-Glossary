(function() {
    tinyMCE.setToggleable = function(element, editor) {
        return function(){
            var self = this;
            editor.on(element, function(e) {
                self.active(e.active);
            });
        };
    };

    tinymce.PluginManager.add('wpg2tinymce', function(editor, url) {
        // Add a button that opens a window
        editor.addButton('glossaryterm', {
            title : 'Add a Glossary Term',
            image : url + '/icon/glossaryterm.png',
            onclick: glossarytermfct,
            onPostRender: tinymce.setToggleable('glossaryterm', editor)
        });
        var listtab = 0;
        editor.addButton('glossarylist', {
            title : 'Add a Glossary Index',
            image : url + '/icon/glossaryindex.png',
            onPostRender: tinymce.setToggleable('glossarylist', editor),
            onclick: glossarylistfct
        });

        //CSS
        editor.contentCSS.push(url + "/../css/wp-glossary-2-admin.css");

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
                console.log("Same");
                if(sel.getStart().getAttribute("data-type") == "wp-glossary-2-atoz"){ // Is atoz
                    console.log("atoz");
                    mode = "complete";
                    values.type=1;
                    values.atoz = {
                        alpha: sel.getStart().getAttribute("data-alpha"),
                        group: sel.getStart().getAttribute("data-group")
                    };
                } else if(sel.getStart().getAttribute("data-type") == "wp-glossary-2-term_list"){ // Is term_list
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
            listtab = values.type;

            console.log(values);
            editor.windowManager.open({
                title: 'Insert Glossary Index',
                name:"Hellp",
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
                                    listtab = e.originalTarget.id.replace(/^mceu_\d+-t(\d+)$/, "$1");
                                }
                            } catch(e){}// Nothing to do, private
                        },
                        items:[
                            new tinyMCE.ui.Factory.create({
                                type:"form",
                                title: "List",
                                items:[
                                    {
                                        type:"textbox",
                                        label:"Letters",
                                        name:"ll",
                                        value: values.list.alpha,
                                        tooltip:"Letters to be displayed in the list. If not specified, all letters will be displayed"
                                    },
                                    {
                                        type:"textbox",
                                        label:"Columns",
                                        name:"lc",
                                        value: values.list.cols,
                                        tooltip:"Number of columns to show for list"
                                    },
                                    {
                                        type:"listbox",
                                        label:"Description:",
                                        name:"ld",
                                        values:[
                                            {
                                                text:"None",
                                                value:""
                                            },
                                            {
                                                text:"Excerpt",
                                                value:"excerpt"
                                            },
                                            {
                                                text:"Full",
                                                value:"full"
                                            }
                                        ],
                                        value: values.list.desc,
                                        tooltip:"Description mode: Excerpt/Full"
                                    },
                                    {
                                        type:"textbox",
                                        label:"Group",
                                        name:"lg",
                                        value: values.list.group,
                                        tooltip:"Group(s) to list"
                                    }
                                ]
                            }),
                            new tinyMCE.ui.Factory.create({
                                type:"form",
                                title:"A to Z",
                                items: [
                                    {
                                        type:"textbox",
                                        label:"Letters",
                                        name:"al",
                                        value: values.atoz.alpha,
                                        tooltip:"Letters to be displayed in the list. If not specified, all letters will be displayed"
                                    },
                                    {
                                        type:"textbox",
                                        label:"Group",
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
                    console.log(e.data, listtab);
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
            var values = {content:"",slug:""};
            var mode = "";

            sel = editor.selection;
            if(sel.getStart() === sel.getEnd() && sel.getStart().getAttribute("data-type") == "wp-glossary-2-term"){ // On Glossary Term, load data
                mode = "complete";
                values = {content:sel.getStart().textContent, slug: sel.getStart().getAttribute("data-slug") || sel.getStart().textContent};
            } else { //Create new glossary term
                var content = sel.getContent({format: 'text'});
                if(content && content.length > 0){ // If something is selected
                    console.log("Content");
                    values = {
                        content: content,
                        slug: content
                    }
                } else { // If no selection
                    var rng = sel.getRng();
                    //Find immediate next && previous chars
                    var txt = rng.commonAncestorContainer.textContent;
                    var char = /[\w\d]/;
                    var txtl = txt.length;
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
                        values.slug = subtxt;*/
                    } else {
                        // console.log("No content, new");
                    }
                }
            }
            //Todo find glossary posts via AJAX
            editor.windowManager.open({
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
                    }*/
                    editor.insertContent('[glossary slug="'+e.data.slug+'"]'+e.data.text+"[/glossary] ");
                }
            });
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
            if(e.getAttribute("data-type") == "wp-glossary-2-term")
                editor.fire('glossaryterm', {active: true});
            else
                editor.fire('glossaryterm', {active: false});
            if(e.getAttribute("data-type") == "wp-glossary-2-term_list" || e.getAttribute("data-type") == "wp-glossary-2-atoz")
                editor.fire('glossarylist', {active: true});
            else
                editor.fire('glossarylist', {active: false});
        });
    });
})();

replaceShortcodesEl = [
    function(content){ // For [glossary]
        return content.replace( /\[glossary(?!_)(.*?)\](.*?)\[\/glossary\]/g, function( all,inner, text){
            var attrs = {};
            var regex = /([\w\d\-]+?)="(.+?)"/g;
            var matched = null;
            while (matched = regex.exec(inner)) {
                attrs[matched[1]] = matched[2];
            }
            var ret = "<a data-type=\"wp-glossary-2-term\"";
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
            var ret = "<span data-type=\"wp-glossary-2-"+type+"\"";
            for(var i in attrs){
                ret += " data-"+window.encodeURIComponent(i)+"=\""+window.encodeURIComponent(attrs[i])+"\"";
            }
            return ret + ">Glossary Index</span>";
        });
    }
];
restoreShortcodesEl = [
    function(content){ // For [glossary]
        return content.replace( /<a\s+data-type="wp-glossary-2-term"(.*?)>(.*?)<\/a>/g, function( all,inner, text){
            var attrs = {};
            var regex = /data-([\w\d\-]+?)="(.+?)"/g;
            var matched = null;
            while (matched = regex.exec(inner)) {
                attrs[matched[1]] = matched[2];
            }
            var ret = "[glossary";
            for(var i in attrs){
                ret += " "+window.decodeURIComponent(i)+"=\""+window.decodeURIComponent(attrs[i])+"\"";
            }
            return ret + "]" + text + "[/glossary]";
        });
    },
    function(content){ // For [glossary_(term_list|atoz)]
        return content.replace( /<span\s+data-type="wp-glossary-2-(term_list|atoz)"(.*?)>.*<\/span>/g, function( all,type, attrStr){
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