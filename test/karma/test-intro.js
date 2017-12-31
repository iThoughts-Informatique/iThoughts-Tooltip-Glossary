window.iThoughtsTooltipGlossary = {};
window.iThoughtsTooltipGlossaryEditor = {};

define(['itgMain', 'tinymcePlugin'], function(){
	console.log(arguments, {
		iThoughtsTooltipGlossary,
		iThoughtsTooltipGlossaryEditor,
	})
	describe('Testing TinyMCE plugin utilities', () => {
		describe('Replace shortcodes with TinyMCE HTML (itge.replaceShortcodes)', () => {
			it('Check function defined', () => {
				expect(window.iThoughtsTooltipGlossaryEditor).to.have.property('replaceShortcodes');
				expect(window.iThoughtsTooltipGlossaryEditor.replaceShortcodes).to.be.a('function');
			});
			const replaceShortcodes = window.iThoughtsTooltipGlossaryEditor.replaceShortcodes;
			it('Gloss replace', () => {
				expect(replaceShortcodes('[itg-gloss gloss-id="1"]Hello[/itg-gloss]')).to.eql('<a data-gloss-id="1" data-type="itg-gloss">Hello</a>');
				expect(replaceShortcodes('[itg-gloss gloss-id="1" gloss-contenttype="full"]Hello[/itg-gloss]')).to.eql('<a data-gloss-contenttype="full" data-gloss-id="1" data-type="itg-gloss">Hello</a>');
			});
		})
	})
});