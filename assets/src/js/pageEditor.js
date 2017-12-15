'use strict';

const ithoughts = iThoughts.v5;
const itg       = iThoughtsTooltipGlossary;

const {$} = ithoughts;

itg.indexPageEditor = () => {
	itg.info('Started index page editor');

	const $template = $('#itg-index-page');
	itg.modalFromTemplate($template);
}
