(function($){
	$(document).ready(function(){
		$('span[class*=wpg-tooltip]').each(function(){
      var ajaxPostData = $.extend( {action: 'wpg_get_term_details'}, $(this).data() );
			var qtipstyle    = $(this).data('qtipstyle');
			$(this).qtip({
				content: {
					text: 'Loading glossary term',
					ajax: {
						url     : WPG.admin_ajax,
						type    : 'POST',
						data    : ajaxPostData,
						dataType: 'json',
						success : function(data, status){
							var response = data.success;
							if( data.success ) {
								this.set( 'content.title.text', data.data.title );
								this.set( 'content.text',       data.data.content );
							} else {
								this.set( 'content.text', 'Error' );
							}
						}
					},
					title: { text: 'Glossary Title' }
				},
				position: {
					at      : 'bottom center', // Position the tooltip above the link
					my      : 'top center',
					viewport: $(window),       // Keep the tooltip on-screen at all times
					effect  : false            // Disable positioning animation
				},
				show: {
					solo: true // Only show one tooltip at a time
				},
				//hide: 'unfocus',
				hide: 'mouseleave',
				style: { 
					classes: 'qtip-'+qtipstyle+' qtip-shadow qtip-rounded'
				}
			})
		});
	});
})(jQuery);
