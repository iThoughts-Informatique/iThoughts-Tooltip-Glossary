import { initConfig, camelCase, wpModuleToGlobal } from './rollup';

export default initConfig({
	environment: 'development',
	bundlesMap: {
		'assets/src/front/index.ts': 'assets/tmp/front.js',
		'assets/src/common/index.ts': 'assets/tmp/common.js',
		'assets/src/back/index.ts': 'assets/tmp/back.js',
	},
	internals: ['react-modal', 'react-tabs', 'react-autocomplete', 'autobind-decorator', 'debounce'],
	globals: {
		react: 'React',
		tinymce: 'tinymce',
		underscore: '_',
		jquery: 'jQuery',
        'react-dom': 'ReactDOM',
        backbone: 'Backbone',
	},
	virtualModules: {
		modules: ['editor-config', '@wordpress/api'],
		moduleNameFactory: name => name.startsWith('@wordpress/') ? name : `~${name}`,
		globalNameFactory: name => name.startsWith('@wordpress/') ?
			wpModuleToGlobal( name ) :
			`ithoughtsTooltipGlossary_${camelCase( name )}`
	},
	namedExports: [ 'react', 'react-dom', 'debounce' ],
})
