import tinymce from 'tinymce';

import { iconSvg } from '../../../images';
import backCss from '../../../styles/tinymce-plugin.scss';
import { ns } from '../../settings';
import { ETipType, TipForm } from './forms';

tinymce.PluginManager.add( 'ithoughts-tooltip-glossary', editor => {
	editor.contentCSS.push( backCss );

	// Add a button that opens a window
	editor.addButton( ns( 'add-tooltip' ), {
		image: iconSvg,
		title: 'Add a tooltip',

		onclick: () => {
			console.log( 'triggered' );
			const form = TipForm.selfMount( { text: '', type: ETipType.Tooltip } );
		},
	} );
	// Add the equivalent delete button
	editor.addButton( ns( 'add-glossarytip' ), {
		image: iconSvg,
		title: 'Add a glossary tip',

		onclick: () => {
			console.log( 'triggered' );
			const form = TipForm.selfMount( { text: '', type: ETipType.Glossarytip } );
		},
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
} );
