(function() {
  tinymce.create('tinymce.plugins.wpglossary', {
    init : function(ed, url) {
    },
    createControl : function(n, cm) {
      if(n=='wpglossary'){
        var mlb = cm.createListBox('wpglossary', {
          title    : 'wpglossary',
          onselect : function(v) {
            if(tinyMCE.activeEditor.selection.getContent() == ''){
              tinyMCE.activeEditor.selection.setContent( v )
            }
          }
        });

        jQuery.each( WPG.tinymce_dropdown, function(k,v){
          mlb.add( k, v );
        });
        return mlb;
      }
    return null;
    }
  });
  tinymce.PluginManager.add('wpglossary', tinymce.plugins.wpglossary);
})();
