(function() {
    tinymce.PluginManager.add('wpg2tinymce', function(editor, url) {
        // Add a button that opens a window
        console.log("Init");
        console.log(editor, url);
        editor.addButton('glossaryitem', {
            title : 'Add a Glossary Term',
            image : url + '/icon/glossaryterm.png',
            onclick: function(){
                var content = editor.selection.getContent();
                if(content){
                    console.log("Glossary item from", content);
                } else {
                    console.log("Select glossary item");
                }
            }
        });

        editor.addButton('glossarylist', {
            title : 'Add a Glossary Index',
            image : url + '/icon/glossaryindex.png',
            onclick: function(){
                var content = editor.selection.getContent();
                console.log("Glossary Index", content);
            }
        });
        editor.addButton('example', {
            text: 'My button',
            icon: false,
            onclick: function() {
                // Open window
                editor.windowManager.open({
                    title: 'Example plugin',
                    body: [
                        {type: 'textbox', name: 'title', label: 'Title'}
                    ],
                    onsubmit: function(e) {
                        // Insert content when the window form is submitted
                        editor.insertContent('Title: ' + e.data.title);
                    }
                });
            }
        });

        // Adds a menu item to the tools menu
        editor.addMenuItem('example', {
            text: 'Example plugin',
            context: 'tools',
            onclick: function() {
                // Open window with a specific url
                editor.windowManager.open({
                    title: 'TinyMCE site',
                    url: 'http://www.tinymce.com',
                    width: 800,
                    height: 600,
                    buttons: [{
                        text: 'Close',
                        onclick: 'close'
                    }]
                });
            }
        });
    });

    console.log("Ok go");
    console.log(tinymce.PluginManager);
    tinymce.create('tinymce.plugins.wpg2tinymce', {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */
        init : function(ed, url) {
            console.log("Init");
            console.log(url);
            ed.addButton('glossaryitem', {
                title : 'Add a Glossary Term',
                cmd : 'glossaryitem',
                image : url + '/1.jpg'
            });

            ed.addButton('glossarylist', {
                title : 'Add a Glossary Index',
                cmd : 'glossarylist',
                image : url + '/2.jpg'
            });
        },

        /**
         * Creates control instances based in the incomming name. This method is normally not
         * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
         * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
         * method can be used to create those.
         *
         * @param {String} n Name of the control to create.
         * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
         * @return {tinymce.ui.Control} New control instance or null if no control was created.
         */
        createControl : function(n, cm) {
            console.log("cc");
            return null;
        },

        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         *
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo : function() {
            console.log("Info");
            return {
                longname : 'WP Glossary 2 Buttons',
                author : 'Lee',
                authorurl : 'http://wp.tutsplus.com/author/leepham',
                infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/example',
                version : "0.1"
            };
        }
    });

    // Register plugin
    /*
    tinymce.PluginManager.add( 'wpg2-tinymce', tinymce.plugins["wpg2tinymce"] );
    tinymce.PluginManager.add( 'wpg2-tinymce', tinymce.plugins["example"] );*/
})();