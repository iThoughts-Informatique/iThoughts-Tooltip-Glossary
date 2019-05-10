import { Editor } from 'tinymce';

import { iconSvg, ns } from '@ithoughts/tooltip-glossary/back/common';

export const registerButtons = ( editor: Editor ) => {
	// Add a button that opens a window
	editor.addButton( ns( 'add-tooltip' ), {
		image: iconSvg,
		title: 'Add a tooltip',

		cmd: ns( 'open-tooltip-form' ),
	} );
	// Add the equivalent delete button
	editor.addButton( ns( 'add-glossarytip' ), {
		image: iconSvg,
		title: 'Add a glossary tip',

		cmd: ns( 'open-glossarytip-form' ),
	} );

	editor.addButton( ns( 'remove-tip' ), {
		image: iconSvg,
		title: 'Remove a tip',

		onclick: () => {
			console.log( 'triggered' );
		},
	} );

	editor.addButton( ns( 'add-list' ), {
		image: iconSvg,
		title: 'Add a glossary list',

		onclick: () => {
			console.log( 'triggered' );
		},
	} );
};
