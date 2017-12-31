const TEST_REGEXP = /test\-.+\.js$/i;
const allTestFiles = [];

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(file => {
	if (TEST_REGEXP.test(file)) {
		// Normalize paths to RequireJS module names.
		// If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
		// then do not normalize the paths
		const normalizedTestModule = file.replace(/\.js$/, '');
		console.log(normalizedTestModule, file)
		allTestFiles.push(normalizedTestModule);
	}
});

requirejs.config({
	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: '/base/assets/build/js',

	paths: {
		'regenerator-runtime/runtime': '/base/node_modules/regenerator-runtime/runtime',
		jQuery: '/base/node_modules/jquery/dist/jquery.min',
		tinymce: '/base/node_modules/tinymce/tinymce.min',
		iThoughts: '/base/submodules/iThoughts-WordPress-Plugin-Toolbox/js/dist/ithoughts-core',
		itgMain: 'main',
		tinymcePlugin: 'tinymce/tinymce',
	},
	// example of using a couple of path translations (paths), to allow us to refer to different library dependencies, without using relative paths
	shim: {
		jQuery: {
			exports: 'jQuery',
		},
		iThoughts: {
			//Once loaded, use the global 'iThoughts' as the
			//module value.
			exports: 'iThoughts',
			deps: ['jQuery']
		},
		itgMain: {
			deps: ['iThoughts', 'tinymce'],
		},
		tinymcePlugin: {
			deps: ['iThoughts', 'tinymce'],
		},
	},

	// dynamically load all test files
	deps: allTestFiles,

	// we have to kickoff jasmine, as it is asynchronous
	callback: window.__karma__.start,
});