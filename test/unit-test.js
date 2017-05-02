/* global describe: false, it: false */

const exec = require( 'child_process' ).exec;

function slimerScript( scriptPath ) {
	return function slimerScriptDo( done ) {
		this.timeout( 100000 );
		return exec( `casperjs --engine=slimerjs unit-test/${scriptPath}`, function onCasperjsEnds( end, stdout, stderr ) {
			var text = stderr + stdout.replace( /## (\d+) ## /g, '' ).replace( /\u001b\[.*?m/g, '' );
			if ( null === end || 0 === end.code )				{
				return done( null );
			}
			return done( new Error( text || 'An error occured' ));
		});
	};
}

describe( 'Admin', function adminTests() {
	it( 'should set the plugin as active', slimerScript( 'admin/01-setStatus.js' ));
	describe( '#options', function adminOptionsTests() {
		it( 'should persist term options', slimerScript( 'admin/options/01-persistTermOptions.js' ));
		it( 'should persist qtip2 options', slimerScript( 'admin/options/02-persistQtip2Options.js' ));
		it( 'should check if both triggers works' );
		it( 'should check if animations work' );
		it( 'should check if tooltip classes works (shadow, rounded, style)' );
	});
});

describe( 'Content', function contentTests() {
	describe( '#terms', function contentTermsTests() {
		it( 'should create a term', slimerScript( 'content/terms/01-create1.js' ));
		it( 'should delete all terms', slimerScript( 'content/terms/02-deleteAll.js' ));
		it( 'should create 5 terms', slimerScript( 'content/terms/03-create5.js' ));
		it( 'should delete 1 term', slimerScript( 'content/terms/04-delete1.js' ));
	});
	describe( '#groups', function contentGroupsTests() {
		it( 'should create a group' );
		it( 'should delete all groups' );
		it( 'should create 3 groups' );
		it( 'should delete 1 group' );
	});
	describe( '#termGroups', function contentTermsGroupsTests() {
		/*...*/
	});
});

describe( 'Features', function featuresTests() {
	describe( 'Tips', function featuresTipsTests() {
		it( 'should see tooltips', slimerScript( 'features/tips/01-tooltips.js' ));
		it( 'should see mediatips', slimerScript( 'features/tips/02-mediatips.js' ));
		it( 'should see glossary tips', slimerScript( 'features/tips/03-glossarytips.js' ));
	});
	describe.skip( 'Lists' );
	describe.skip( 'Index page' );
	describe.skip( 'TinyMCE' );
	describe.skip( 'Random term widget' );
	describe.skip( 'Custom styles' );
	describe.skip( 'Auto link' );
	describe.skip( 'Usage list' );
});
