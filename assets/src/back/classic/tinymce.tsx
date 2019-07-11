import tinymce, { Editor } from 'tinymce';

import { ns, Omit } from '@ithoughts/tooltip-glossary/back/common';
import { makeHtmlElement } from '@ithoughts/tooltip-glossary/common';
import { initTooltip } from '@ithoughts/tooltip-glossary/front';
import editorConfig from '~editor-config';

import { registerButtons } from './buttons';
import { registerCommands } from './commands';
import './tinymce-plugin.scss';
import { getEditorTip } from './utils';

type OverridableCss = Omit<CSSStyleDeclaration, 'length' | 'parentRule'>;

export let tipsContainer: HTMLElement | undefined;
export const plugin = async ( editor: Editor ) => {
	( window as any ).editor = editor;
	// Avoid issue with rollup-plugin-json-manifest
	const editorStylesheetUrl = editorConfig.manifest['back-editor-classic' + '.css'];
	if ( editorStylesheetUrl ) {
		editor.contentCSS.push( editorStylesheetUrl );
	}

	// tslint:disable-next-line: no-inferred-empty-object-type
	editor.on( 'init', ( ...args: any[] ) => {
		tipsContainer = makeHtmlElement( { tag: 'div', content: '', attributes: { id: 'tips-container' }} );
		document.body.appendChild( tipsContainer );

		( Object.entries( {
			bottom: '0px',
			left: '0px',
			right: '0px',
			top: '0px',

			pointerEvents: 'none',
			position: 'absolute',
		} as OverridableCss ) as Array<[keyof OverridableCss, string]> ).forEach( ( [prop, val] ) => {
			tipsContainer!.style[prop] = val;
		} );

		// Init existing tips
		const tips = getEditorTip( editor );
		tips.forEach( tip => initTooltip( tip, tipsContainer, true ) );
	} );

	registerCommands( editor );
	const { addTooltip, removeTip } = await registerButtons( editor );

	removeTip.disabled( false );
	addTooltip.disabled( true );
};
tinymce.PluginManager.add( ns(), plugin );
