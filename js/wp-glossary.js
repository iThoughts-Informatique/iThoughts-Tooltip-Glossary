jQuery(document).ready(function($){
	$('a.glossary-hover').tooltip();
});

(function($){
  var lastPos;

	$(document).ready(function(){

  // Handle clicking
  $('.atoz-clickable').click(function(){
    lastPos = $(window).scrollTop();
    $('.atoz-clickable').removeClass('atozmenu-on').addClass('atozmenu-off');
    $(this).removeClass('atozmenu-off').addClass('atozmenu-on');
    var alpha = $(this).attr('alpha');
    location.hash = alpha;

    $('.glossary-list').removeClass('atozitems-on').addClass('atozitems-off');
    $('.glossary-list-' + alpha).removeClass('atozitems-off').addClass('atozitems-on');
  });

  // Manual hash change - trigger click
  $(window).bind('hashchange',function(event){
    var alpha = location.hash.replace('#','');
    $(window).scrollTop(lastPos);
    location.hash = alpha;
    $('.atoz-clickable').filter(function(i){return $(this).attr('alpha') == alpha;}).click();
  });

  // Page load hash management:
  //  - Look for first available if none specified
  //  - Trigger click if exists
  var myLocation = document.location.toString();
  var myAlpha    = '';
  if( myLocation.match('#') )
    myAlpha = myLocation.split('#')[1];
  if( ! myAlpha.length )
    myAlpha = $('.atoz-clickable:eq(0)').attr('alpha');
  if( myAlpha.length )
    $('.atoz-clickable').filter(function(i){return $(this).attr('alpha') == myAlpha;}).click();

	});
})(jQuery);
