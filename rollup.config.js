import { initConfig, camelCase } from './rollup';

export default initConfig({
	environment: 'development',
	bundlesMap: {
		'assets/src/front/index.ts': 'assets/tmp/front.js',
		'assets/src/common/index.ts': 'assets/tmp/common.js',
		'assets/src/back/index.ts': 'assets/tmp/back.js',
	},
	internals: [],
	globals: {
		react: 'React',
		tinymce: 'tinymce',
		underscore: '_',
		jquery: 'jQuery',
		'react-dom': 'ReactDOM',
	},
	virtualModules: {
		modules: ['editor-config'],
		moduleNameFactory: name => `~${name}`,
		globalNameFactory: name => `ithoughtsTooltipGlossary_${camelCase( name )}`
	},
	namedExports: [ 'react', 'react-dom' ],
})
