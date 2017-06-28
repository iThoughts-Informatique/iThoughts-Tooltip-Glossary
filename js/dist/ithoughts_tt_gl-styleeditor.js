/**
 * @file Client-side style-editor logic
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

'use strict';

(function selfCalling(ithoughts) {
	var $ = ithoughts.$,
	    itg = iThoughtsTooltipGlossary,
	    $themeName,
	    $themeSelect;

	ithoughts.$d.ready(function onDocumentReady() {
		$themeSelect = $('[name="theme_select"]');
		$themeName = $('[name="theme_name"]');
		$('[data-tooltip-id="exampleStyle"]').qtip('api').show();
		var ajaxCallback = function ajaxCallback(res) {
			if (res.valid) {
				if (res.hasOwnProperty('css') && res.hasOwnProperty('theme_name')) {
					// This is a preview
					try {
						itg.log('Received CSS response from server:', res);
						var styleTag = $('#ithoughts_tt_gl-custom_theme');
						if (0 === styleTag.length) {
							styleTag = $($.parseHTML('<style id="ithoughts_tt_gl-custom_theme"></style>'));
							$('body').append(styleTag);
						}
						styleTag[0].innerHTML = res.css;

						itg.updateStyle(true, res.theme_name, $('#qtip-exampleStyle'));
					} catch (e) {
						itg.error('Error during setting preview style:', e);
					}
				} else {
					// This is a save
					var name = $themeName.val();
					if (0 === $themeSelect.find('option[value="' + name + '"]').length) {
						$themeSelect.append('<option value="' + name + '">' + name + '</option>');
						$themeSelect.val(name).change();
					}
				}
			} else {
				itg.error('Error while getting preview style', res);
			}
		};
		$('#LESS-form')[0].simple_ajax_callback = ajaxCallback;
		$themeSelect.change(function onThemeChange() {
			$(this).parent().find('button').prop('disabled', !this.value);
		}).change();
	});
})(iThoughts.v5);
//# sourceMappingURL=ithoughts_tt_gl-styleeditor.js.map
