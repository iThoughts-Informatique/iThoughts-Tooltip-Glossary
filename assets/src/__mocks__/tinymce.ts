import tinymce from 'tinymce';
import { Dictionary } from 'underscore';

export const plugins: Dictionary<( editor: tinymce.Editor, url: string ) => void> = {};
export default {
	PluginManager: {
		add( id: string, init: ( editor: tinymce.Editor, url: string ) => void ) {
			plugins[id] = init;
		},
	},
} ;
