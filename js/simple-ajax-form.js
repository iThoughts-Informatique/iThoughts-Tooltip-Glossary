/**
 * Generic *SIMPLE* Ajax Form handling
 */
(function($){
	//$.fn.extend
})(jQuery);

jQuery(document).ready(function($){
 $('.simpleajaxform').each(function(){
  $(this).attr('method', 'post');
  var target = $(this).attr('target');
  var func   = $(this).attr('function');
  options    = {};
  if( target || func ){
   if( target ) $('#'+target).html('').hide();
   options = { success: simpleajaxform_success, beforeSubmit: simpleajaxform_submit };
  }
  $(this).ajaxForm(options);
 });
});

/**
 * On submit: clear any previous update and inform we're trying to update
 */
function simpleajaxform_submit(formData, jqForm, options) {
 //if( !jqForm.valid() ) return false;
 target = jqForm.attr('target');

 if( target )
  jQuery('#'+target).html('Updating, please wait...').removeClass('updated').addClass('updating').fadeTo(100,1);
 return true;
}

/**
 * Response: show message and fade it out
 */
function simpleajaxform_success(responseText, statusText, xhr, jQForm){
 if( typeof(jQForm) === 'undefined' )
  jQForm = xhr;

 if( typeof(jQForm) === 'undefined' ){
  alert('Cannot handle response properly');
  return;
 }

 target = jQForm.attr('target');
 if( target )
  jQuery('#'+target).removeClass('updating').addClass('updated').html(responseText);

 hide = jQForm.attr('hide');
 if( hide )
  jQuery('#'+hide).hide();

 handler = jQForm.attr('function');
 if( handler )
  eval( handler+'(responseText, jQForm)' );
}

