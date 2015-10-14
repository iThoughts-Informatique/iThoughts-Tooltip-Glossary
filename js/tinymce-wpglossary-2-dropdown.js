(function() {
  tinymce.create('tinymce.plugins.wpg2lossary', {
    init : function(ed, url) {
    },
    createControl : function(n, cm) {
      if(n=='wpg2lossary'){
        var mlb = cm.createListBox('wpg2lossary', {
          title    : 'wpg2lossary',
          onselect : function(v) {
            if(tinyMCE.activeEditor.selection.getContent() == ''){
              tinyMCE.activeEditor.selection.setContent( v )
            }
          }
        });

        jQuery.each( wpg2.tinymce_dropdown, function(k,v){
          mlb.add( k, v );
        });
        return mlb;
      }
    return null;
    }
  });
  tinymce.PluginManager.add('wpg2lossary', tinymce.plugins.wpg2lossary);
})();
