import { Editor } from 'tinymce';

export default {
	PluginManager: {
		add: jest.fn(),
	},
} ;
export const makeMockEditor = () => ( {
	contentCSS: [],
	getContentAreaContainer: jest.fn(),
	on: jest.fn(),
	selection: {
		getRng: jest.fn(),
	},
} as any as Editor );
