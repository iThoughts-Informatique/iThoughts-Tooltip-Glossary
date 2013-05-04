/**
 * Simple jQuery extension to AjaxiFy a form
 */
(function($){
	$.fn.extend({
		simpleAjaxForm: function( opts ){
			var defaults = { validate: false };
			var options  = $.extend( defaults, opts );
			return this.each(function(){
				var $form = $(this);
				var formopts = $.extend({
					target:   $form.data('target'),
					callback: $form.data('callback'),
					validate: $form.data('validate')
				}, options);
				if( formopts.target && $('#'+formopts.target).length ){
					$('#'+formopts.target).html('').hide();
				}

				$form.ajaxForm({
					beforeSubmit: function(formData, jqForm, options) {
						//if( !jqForm.valid() ) return false;
						if( formopts.target && $('#'+formopts.target).length ){
							$('#'+formopts.target).html('<p>Updating, please wait...</p>').removeClass('updated').addClass('updating').fadeTo(100,1);
						}
						return true;
					},
					success: function(responseText, statusText, xhr, jQForm){
						if( typeof(jQForm) === 'undefined' )
							jQForm = xhr;

						if( typeof(jQForm) === 'undefined' ){
							$form.append('<div class="error"><p>Cannot handle response properly</p></div>');
							return;
						}

						if( formopts.target && $('#'+formopts.target).length ){
							$('#'+formopts.target).removeClass('updating').addClass('updated').html(responseText);
						}
					}	
				});
			});
		}
	});
})(jQuery);

(function($){
	$(document).ready(function(){
		$('.simpleajaxform').simpleAjaxForm();
	});
})(jQuery);
