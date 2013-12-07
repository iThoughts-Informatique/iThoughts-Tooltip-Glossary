(function($){
	$(document).ready(function(){
		$('span[class*=wpg-tooltip]').each(function(){
      var ajaxPostData = $.extend( {action: 'wpg_get_term_details'}, $(this).data() );
			var qtipstyle    = $(this).data('qtipstyle');

			// If set to click, disable glossary link
			if( WPG.qtiptrigger == 'click' ){
				$(this).children('a').click(function(e){
					e.preventDefault();
				});
			}

			$(this).qtip({
				content: {
					text: 'Loading glossary term',
					ajax: {
						url     : WPG.admin_ajax,
						type    : 'POST',
						data    : ajaxPostData,
						dataType: 'json',
						loading : false,
						success : function(resp, status){
							if( resp.success ) {
								this.set( 'content.title', resp.data.title );
								this.set( 'content.text',  resp.data.content );
							} else {
								this.set( 'content.text', 'Error' );
							}
						}
					},
					title: { text: 'Glossary Title' }
				},
				prerender: true,
				position: {
					at      : 'bottom center', // Position the tooltip above the link
					my      : 'top center',
					viewport: $(window),       // Keep the tooltip on-screen at all times
					effect  : false            // Disable positioning animation
				},
				show: {
					when: { event: WPG.qtiptrigger },
					solo:  true // Only show one tooltip at a time
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
