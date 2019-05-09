import tinymce from 'tinymce';

import { iconSvg, ns } from '@ithoughts/tooltip-glossary/back/common';
import editorConfig from '~editor-config';

import { ETipType, TipForm, TipFormOutput } from './forms';
import tinymcePluginStyles from './tinymce-plugin.scss';

const openTipForm = ( type: ETipType ) => () => {
		const form = TipForm.mount( {
			text: '',
			type,

			onClose: ( isSubmit: boolean, props?: TipFormOutput ) => {
				console.log( { isSubmit, props } );
			},
		} );
	};

tinymce.PluginManager.add( 'ithoughts-tooltip-glossary', editor => {
	const contentCss = editorConfig.manifest['back-editor-classic.css'];
	if ( contentCss ) {
		editor.contentCSS.push( contentCss );
	}

	// Add a button that opens a window
	editor.addButton( ns( 'add-tooltip' ), {
		image: iconSvg,
		title: 'Add a tooltip',

		onclick: openTipForm( ETipType.Tooltip ),
	} );
	// Add the equivalent delete button
	editor.addButton( ns( 'add-glossarytip' ), {
		image: iconSvg,
		title: 'Add a glossary tip',

		onclick: openTipForm( ETipType.Glossarytip ),
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
