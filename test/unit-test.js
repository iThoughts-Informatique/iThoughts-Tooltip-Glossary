/* global describe: false, it: false */

const exec = require( 'child_process' ).exec;

function slimerScript( scriptPath ) {
	return function slimerScriptDo( done ) {
		this.timeout( 100000 );
		return exec( `casperjs --engine=slimerjs unit-test/${scriptPath}`, function onCasperjsEnds( end, stdout, stderr ) {
			var text = stdout.replace(/## (\d+) ## /g, "").replace(/\u001b\[.*?m/g, '');
			if ( null === end || 0 === end.code )				{
				return done( null );
			}
			return done( new Error( text || 'An error occured' ));
		});
	};
}

describe( 'Admin', function adminTests() {
	describe( '#setStatus', function adminSetStatusTests() {
		it( 'should set the plugin as active', slimerScript( 'admin/setStatus/01-switch.js' ));
	});
	describe( '#options', function adminOptionsTests() {
		describe( '#persistance', function adminOptionsPersistanceTests() {
			describe( '#termOptions', function adminOptionsPersistanceTermOptionsTests() {
				it( 'should persist term link' );
				it( 'should persist static term' );
				it( 'should persist load resource' );
				it( 'should persist log level' );
				it( 'should persist base permalink' );
				it( 'should persist taxonomy base' );
				it( 'should persist term content' );
				it( 'should persist comments on term pages' );
			});
			describe( '#qtip2', function adminOptionsPersistanceQtip2Tests() {
				it( 'should persist activation trigger' );
				it( 'should persist the style' );
				it( 'should persist the shadow' );
				it( 'should persist rounded corner' );
				it( 'should persist animations' );
			});
		});
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
