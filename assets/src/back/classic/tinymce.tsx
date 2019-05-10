import tinymce from 'tinymce';

import { ns } from '@ithoughts/tooltip-glossary/back/common';
import editorConfig from '~editor-config';

import { registerButtons } from './buttons';
import { registerCommands } from './commands';

import './tinymce-plugin.scss';

tinymce.PluginManager.add( ns(), editor => {
	// Avoid issue with rollup-plugin-json-manifest
	const editorStylesheetUrl = editorConfig.manifest['back-editor-classic' + '.css'];
	if ( editorStylesheetUrl ) {
		editor.contentCSS.push( editorStylesheetUrl );
	}

	registerCommands( editor );
	registerButtons( editor );
} );
