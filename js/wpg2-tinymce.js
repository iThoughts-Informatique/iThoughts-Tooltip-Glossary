(function() {
    tinymce.PluginManager.add('wpg2tinymce', function(editor, url) {
        // Add a button that opens a window
        editor.addButton('glossaryitem', {
            title : 'Add a Glossary Term',
            image : url + '/icon/glossaryterm.png',
            onclick: function(){
                var content = editor.selection.getContent() || "";
                editor.windowManager.open({
                    title: 'Insert glossary term',
                    body: [
                        {type: 'textbox', name: 'text', label: 'Text', value: content},
                        {type: 'textbox', name: 'slug', label: 'Slug', value: content}
                    ],
                    onsubmit: function(e) {
                        if(e.data.slug == "")
                            e.data.slug = e.data.text;
                        // Insert content when the window form is submitted
                        editor.insertContent('<a data-wpg2-glossary-slug="'+e.data.slug+'">'+e.data.text+"</a> ");
                    }
                });
            }
        });

        editor.addButton('glossarylist', {
            title : 'Add a Glossary Index',
            image : url + '/icon/glossaryindex.png',
            onclick: function(){
                (function(){
                    editor.windowManager.open({
                        title: 'Insert glossary term',
                        body: [
                            {
                                type: 'listbox',
                                name: 'slug',
                                label: 'Slug',
                                values: [
                                    {text: 'Left', value: 'left'},
                                    {text: 'Right', value: 'right'},
                                    {text: 'Center', value: 'center'}
                                ],
                                multiple: true
                            }
                        ],
                        onsubmit: function(e) {
                            if(e.data.slug == "")
                                e.data.slug = e.data.text;
                            // Insert content when the window form is submitted
                            editor.insertContent('<a data-wpg2-glossary-slug="'+e.data.slug+'">'+e.data.text+"</a> ");
                        }
                    });
                })
            }
        });

        console.log(editor);
        editor.contentCSS.push(url + "/../css/wp-glossary-2-admin.css");
    });
})();