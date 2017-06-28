/**
 * @file Handles the dialog logic between server updates operations and client
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

'use strict';

/* global postboxes:false, iThoughtsTooltipGlossaryUpdater: false */

(function selfCalling(ithoughts) {

	var $ = ithoughts.$,
	    qs = ithoughts.qs,
	    updater = iThoughtsTooltipGlossaryUpdater,
	    pagenow = updater.pagenow,
	    progress,
	    text,
	    initData,
	    verboseArea,
	    updaterSection;
	delete updater.pagenow;

	function printError(error, data) {
		verboseArea = '<div class="update-nag error"><p>An error occured during the update. Please see below for details</p></div><div class="verboseContainer postbox"><div class="handlediv"></div><h4 class="hndle ui-sortable-handle">Logs</h4><div class="inside"><pre class="verboseArea">' + error.stack + 'Response from server: ' + JSON.stringify(data, null, 4) + '</pre></div></div>';
		updaterSection.append(verboseArea);
	}

	function runUpdate(progression) {
		$.post(iThoughtsTooltipGlossary.admin_ajax, {
			action: 'ithoughts_tt_gl_update',
			data: {
				versions: updater,
				progression: progression,
				maxAdvancement: initData.max
			}
		}, function onUpdateRun(out) {
			if (verboseArea.parentElement.scrollTop > verboseArea.parentElement.scrollHeight - verboseArea.parentElement.clientHeight - 50) {
				verboseArea.parentElement.scrollTop = verboseArea.parentElement.scrollHeight;
			}
			var scrollValOld = verboseArea.parentElement.scrollHeight - verboseArea.parentElement.clientHeight;
			try {
				progress.value = out.data.progression;
				text.innerHTML = progress.value + '/' + initData.max + ' (<em>' + ('' + parseInt(progress.value / initData.max * 100)).slice(0, 3) + '%</em>)';
				if (out.data.verbose) {
					for (var i = 0, j = out.data.verbose.length; i < j; i++) {
						$(verboseArea).append($.parseHTML('<p class="' + out.data.verbose[i].type + '">' + out.data.verbose[i].text + '</p>'));
					}
				}
				if (verboseArea.parentElement.scrollTop > scrollValOld - 50) {
					verboseArea.parentElement.scrollTop = verboseArea.parentElement.scrollHeight;
				}
				if (out.data.progression < initData.max) {
					runUpdate(out.data.progression);
				} else {
					updater.from = initData.targetversion;
					ithoughts.$.post(iThoughtsTooltipGlossary.admin_ajax, {
						action: 'ithoughts_tt_gl_update_done',
						data: {
							newversion: updater.from
						}
					}, function onUpdateDone(serverResponse) {
						if (serverResponse.success) {
							initUpdate(updater);
						} else {
							var messageEnd = '<hr/><h4>' + out.data.title + '</h4><p>' + out.data.text + '</p>';
							updaterSection.append(messageEnd);
						}
					});
				}
			} catch (e) {
				printError(e, out);
			}
		});
	}

	function initUpdate(versions) {
		$.post(iThoughtsTooltipGlossary.admin_ajax, {
			action: 'ithoughts_tt_gl_update',
			data: {
				versions: versions,
				progression: -1,
				maxAdvancement: -1
			}
		}, function onUpdateInit(out) {
			updaterSection = $('#Updater');
			try {
				if ('undefined' === typeof out || 'undefined' === typeof out.data) {
					throw new Error('Empty server response');
				}
				verboseArea = '<div class="verboseContainer postbox closed"><div class="handlediv" title="Cliquer pour inverser."></div><h4 class="hndle ui-sortable-handle">Logs</h4><div class="inside"><pre class="verboseArea">';
				if (out.data.verbose) {
					for (var i = 0, j = out.data.verbose.length; i < j; i++) {
						verboseArea += '<p class="' + out.data.verbose[i].type + '">' + out.data.verbose[i].text + '</p>';
					}
				}
				verboseArea += '</pre></div></div>';
				if (out.data.Ended) {
					updaterSection.append($.parseHTML('<article data-version="ended"><h3>' + out.data.title + '</h3><p class="updatedescription">' + out.data.text + '</p></article>'));
					postboxes.add_postbox_toggles(pagenow);
				} else {
					updaterSection.append($.parseHTML('<article data-version="' + out.data.targetversion + '"><h3>V' + out.data.targetversion + '</h3><p class="updatedescription">' + out.data.text + '</p><progress class="updateprogress" min="0" max="' + out.data.max + '" value="0"></progress><span class="updateprogresstext">0/' + out.data.max + ' (<em>0%</em>)</span>' + verboseArea + '</article>'));
					postboxes.add_postbox_toggles(pagenow);
					initData = out.data;
					progress = qs('[data-version="' + out.data.targetversion + '"] .updateprogress');
					text = qs('[data-version="' + out.data.targetversion + '"] .updateprogresstext');
					verboseArea = qs('[data-version="' + out.data.targetversion + '"] .verboseArea');

					runUpdate(0);
				}
			} catch (e) {
				printError(e, out);
			}
		});
	}
	initUpdate(updater);
})(iThoughts.v5);
//# sourceMappingURL=ithoughts_tt_gl-updater.js.map
