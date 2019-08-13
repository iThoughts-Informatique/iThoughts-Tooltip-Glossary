import { initConfig, camelCase, wpModuleToGlobal } from './rollup';

export default initConfig({
	environment: 'development',
	bundlesMap: {
		'assets/src/front/index.ts': {
			file: 'assets/tmp/front.js',
			asVirtualModule: '@ithoughts/tooltip-glossary/front',
		},
		'assets/src/common/index.ts': {
			file: 'assets/tmp/common.js',
			asVirtualModule: '@ithoughts/tooltip-glossary/common',
		},
		'assets/src/back/common/index.ts': {
			file: 'assets/tmp/back-common.js',
			asVirtualModule: '@ithoughts/tooltip-glossary/back/common',
		},
		'assets/src/back/classic/index.ts': {
			file: 'assets/tmp/back-editor-classic.js',
			asVirtualModule: '@ithoughts/tooltip-glossary/back/classic',
		},
	},
	internals: ['react-modal', 'react-tabs', 'react-autocomplete', 'autobind-decorator', 'debounce', 'html-element-attributes', 'tippy.js', 'escape-string-regexp', 'iter-tools'],
    externals: ['@wordpress/qtags'],
	globals: {
		react: 'React',
		tinymce: 'tinymce',
		underscore: '_',
		jquery: 'jQuery',
		'react-dom': 'ReactDOM',
		backbone: 'Backbone',
		'@wordpress/qtags': 'QTags',
	},
	virtualModules: {
		modules: ['editor-config', '@wordpress/api'],
		/**
		 * @param {string} name
		 */
		moduleNameFactory: name => name.startsWith('@wordpress/') ? name : `~${name}`,
		/**
		 * @param {string} name
		 */
		globalNameFactory: name => name.startsWith('@wordpress/') ?
			wpModuleToGlobal( name ) :
			`ithoughtsTooltipGlossary_${camelCase( name )}`
	},
	namedExports: [ 'react', 'react-dom', 'debounce' ],
})
