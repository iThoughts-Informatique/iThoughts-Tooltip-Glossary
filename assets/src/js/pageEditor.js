'use strict';

const ithoughts = iThoughts.v5;
const itg       = iThoughtsTooltipGlossary;

const {$} = ithoughts;

itg.indexPageEditor = () => {
	itg.info( 'Started index page editor' );

	const $template = $( '#itg-index-page' );
	const modalApi = itg.modalFromTemplate( $template );
	// Wait for tooltip initialization
	ithoughts.waitFor(modalApi.elements, 'content', () => {
		const $form = $(modalApi.elements.content).find('form');
		$form.simpleAjaxForm({
			callback(){
				console.log('CB', arguments)
			},
			error(error){
				itg.error('Error during ajax post for page creation:', error);
				itg.growl('Error', `Error during page creation: ${error.statusText}`, false);
			}
		});
	});
};
