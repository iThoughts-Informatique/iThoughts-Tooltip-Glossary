(function(){
	var lastPos;

	$d.ready(function(){

		var preventHashChange = false;
		// Handle clicking
		$('.atoz-clickable').click(function(){
			lastPos = $w.scrollTop();
			$('.atoz-clickable').removeClass('atozmenu-on').addClass('atozmenu-off');
			$(this).removeClass('atozmenu-off').addClass('atozmenu-on');
			var alpha = $(this).data('alpha');
			preventHashChange = true;
			location.hash = alpha;

			$parent = $(this).parent().parent();
			$parent.find('.glossary-atoz').removeClass('atozitems-on').addClass('atozitems-off');
			$parent.find('.glossary-atoz-' + alpha).removeClass('atozitems-off').addClass('atozitems-on');
			$parent.find('.ithoughts_tt_gl-please-select').hide();
		});

		// Manual hash change - trigger click
		$w.bind('hashchange',function(event){
			if(preventHashChange){
				preventHashChange = false;
			} else {
				var alpha = location.hash.replace('#','');
				$w.scrollTop(lastPos);
				location.hash = alpha;
				$('.atoz-clickable').filter(function(i){return $(this).data('alpha') == alpha;}).click();
				$('.ithoughts_tt_gl-please-select').hide();
			}
		});

		// Page load hash management:
		//  - Look for first available if none specified
		//  - Trigger click if exists
		var myLocation = document.location.toString();
		var myAlpha    = '';
		if( myLocation.match('#') )
			myAlpha = myLocation.split('#')[1];
		if( ! myAlpha.length ){
			//myAlpha = $('.atoz-clickable:eq(0)').data('alpha');
			$('.atoz-clickable').removeClass('atozmenu-on').addClass('atozmenu-off');
			$('.glossary-atoz').removeClass('atozitems-on').addClass('atozitems-off');
			$('.ithoughts_tt_gl-please-select').show();
		}
		if( myAlpha.length ){
			$('.ithoughts_tt_gl-please-select').hide();
			$('.atoz-clickable').filter(function(i){return $(this).data('alpha') == myAlpha;}).click();
		}

	});
})();
