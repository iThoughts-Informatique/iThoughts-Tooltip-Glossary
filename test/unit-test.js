const assert = require('assert'),
	  exec = require('child_process').exec;

function slimerScript(scriptPath){
	return function(done) {
		this.timeout(100000);
		return exec(`casperjs --engine=slimerjs unit-test/${scriptPath}`, function(end, stdout, stderr){
			if (end == null || end.code == 0)
				return done(null);
			return done(new Error(stderr || "An error occured"));
		});
	};
}

describe('Admin', function() {
	describe('#setStatus', function() {
		it.skip('should set the plugin as active', slimerScript("admin/setStatus/01-switch.js"));
	});
	describe('#options', function(){
		describe('#persistance', function(){
			describe('#termOptions', function(){
				it('should persist term link');
				it('should persist static term');
				it('should persist load resource');
				it('should persist log level');
				it('should persist base permalink');
				it('should persist taxonomy base');
				it('should persist term content');
				it('should persist comments on term pages');
			});
			describe('#qtip2', function(){
				it('should persist activation trigger');
				it('should persist the style');
				it('should persist the shadow');
				it('should persist rounded corner');
				it('should persist animations');
			});
		});
	});
});

describe('Content', function() {
	describe('#terms', function() {
		it('should create a term', slimerScript("content/terms/01-create1.js"));
		it('should delete all terms', slimerScript("content/terms/02-deleteAll.js"));
		it('should create 5 terms');
		it('should delete 1 term');
		it('should allow comments');
	});
	describe('#groups', function() {
		it('should create a group');
		it('should delete all groups');
		it('should create 3 groups');
		it('should delete 1 group');
	});
	describe('#termGroups', function() {
		/*...*/
	});
});