<?php

/**
 * @file Template file for options form
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.5.0
 */



if ( ! defined( 'ABSPATH' ) ) { 
    exit; // Exit if accessed directly
}

?>
<div class="wrap">
	<div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50 metabox-holder">
		<div class="meta-box-inside admin-help">
			<div class="icon32" id="icon-options-general">
				<br>
			</div>
			<h2><?php _e('Options', 'ithoughts-tooltip-glossary' ); ?></h2>
			<div id="dashboard-widgets-wrap">
				<div id="dashboard-widgets">
					<div id="normal-sortables" class=""><!--Old removed classes: "meta-box-sortables ui-sortable"-->
						<form action="<?php echo $ajax; ?>" method="post" class="simpleajaxform" data-target="update-response">

							<p style="font-size:17px;"><em><?php _e("Need help? Check out the full plugin manual at ", 'ithoughts-tooltip-glossary' ); ?> <a href="https://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/" target="_blank">GerkinDevelopment.net</a>.</em></p>
							<p><strong><?php _e("Note", 'ithoughts-tooltip-glossary' ); ?>:</strong>&nbsp;<?php _e("Labels in <span class=\"nonoverridable\">red</span> indicate global options, not overridable by tips.", 'ithoughts-tooltip-glossary' ); ?></p>

							<div id="ithoughts_tt_gllossary_options_1" class="postbox">
								<div class="handlediv" title="Cliquer pour inverser."><br></div><h3 class="hndle"><span><?php _e('Term Options', 'ithoughts-tooltip-glossary' ); ?></span></h3>
								<div class="inside">
									<table class="form-table">
										<tbody>
											<tr>
												<th>
													<label for="termlinkopt"><?php _e('Term link', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<?php echo $optionsInputs["termlinkopt"]; ?>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="staticterms"><?php _e('Static terms', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-nosolo="true" <?php echo \ithoughts\v1_2\Toolbox::concat_attrs(array("data-tooltip-content" => __('Include term content directly into the pages to avoid use of Ajax. This can slow down your page generation.', 'ithoughts-tooltip-glossary' ))); ?>><a href="javascript:void(0)">(<?php _e('infos', 'ithoughts-tooltip-glossary' ); ?>)</a></span>:</label>
												</th>
												<td>
													<?php echo $optionsInputs["staticterms"]; ?>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="forceloadresources"><?php _e('Force load resources', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-nosolo="true" <?php echo \ithoughts\v1_2\Toolbox::concat_attrs(array("data-tooltip-content" => __('Load scripts on every pages, even if not required. This option can be useful if some cache plugins are active, or if you think that scripts are not loaded when required.', 'ithoughts-tooltip-glossary' ))); ?>><a href="javascript:void(0)">(<?php _e('infos', 'ithoughts-tooltip-glossary' ); ?>)</a></span>:</label>
												</th>
												<td>
													<?php echo $optionsInputs["forceloadresources"]; ?>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="termtype"><?php _e('Base Permalink', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<code>/</code><?php echo $optionsInputs["termtype"]; ?><code>/</code>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="grouptype"><?php _e('Taxonomy group prefix', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<code>/<?php echo $options["termtype"]; ?>/</code><?php echo $optionsInputs["grouptype"]; ?><code>/</code>
												</td>
											</tr>
											<tr>
												<th>
													<label for="termcontent"><?php _e('Glossary Tip Content', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<?php echo $optionsInputs["termcontent"]; ?>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>

							<div class="postbox" id="ithoughts_tt_gllossary_options_2">
								<div class="handlediv" title="Cliquer pour inverser." onclick="window.refloat(this);"><br></div><h3 onclick="window.refloat(this);" class="hndle"><span><?php _e('qTip2 Tooltip Options', 'ithoughts-tooltip-glossary' ); ?></span></h3>
								<div class="inside">
									<div style="display:flex;flex-direction:row;flex-wrap:wrap;">
										<div style="flex:1 1 auto;">


											<p><?php _e('iThoughts Tooltip Glossary uses the jQuery based <a href="http://qtip2.com/">qTip2</a> library for tooltips', 'ithoughts-tooltip-glossary' ); ?></p>
											<table class="form-table">
												<tbody>
													<tr>
														<th>
															<label for="qtiptrigger"><?php _e('Tooltip activation', 'ithoughts-tooltip-glossary' ); ?>:</label>
														</th>
														<td>
															<?php echo $optionsInputs["qtiptrigger"]; ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="qtipstyle"><?php _e('Tooltip Style (qTip)', 'ithoughts-tooltip-glossary' ); ?>:</label>
														</th>
														<td>
															<?php echo $optionsInputs["qtipstyle"]; ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="qtipshadow"><?php _e('Tooltip shadow', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-nosolo="true" <?php echo \ithoughts\v1_2\Toolbox::concat_attrs(array("data-tooltip-content" => __('This option can be overriden by some tooltip styles.', 'ithoughts-tooltip-glossary' ))); ?>><a href="javascript:void(0)">(<?php _e('infos', 'ithoughts-tooltip-glossary' ); ?>)</a></span>:</label>
														</th>
														<td>
															<?php echo $optionsInputs["qtipshadow"]; ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="qtiprounded"><?php _e('Rounded corners', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-nosolo="true" <?php echo \ithoughts\v1_2\Toolbox::concat_attrs(array("data-tooltip-content" => __('This option can be overriden by some tooltip styles.', 'ithoughts-tooltip-glossary' ))); ?>><a href="javascript:void(0)">(<?php _e('infos', 'ithoughts-tooltip-glossary' ); ?>)</a></span>:</label>
														</th>
														<td>
															<?php echo $optionsInputs["qtiprounded"]; ?>
														</td>
													</tr>
												</tbody>
											</table>


										</div>
										<div style="flex:1 1 auto;;position:relative;">
											<div id="floater" style="display:flex;flex-direction:row;width:100%;">
												<!--<p style="flex:1 1 auto;text-align:center">
<span class="ithoughts_tt_gl-tooltip" data-tooltip-nosolo="true" data-tooltip-id="exampleActivate" data-tooltip-content="<?php echo rawurlencode(__('The <b>tooltip</b> or <b>infotip</b> or a <b>hint</b> is a common <a href="/wiki/Graphical_user_interface" title="Graphical user interface">graphical user interface</a> element. It is used in conjunction with a <a href="/wiki/Cursor_(computers)" title="Cursor (computers)" class="mw-redirect">cursor</a>, usually a <a href="/wiki/Pointer_(graphical_user_interfaces)" title="Pointer (graphical user interfaces)">pointer</a>. The user hovers the pointer over an item, without clicking it, and a tooltip may appear—a small "<a href="/wiki/Hoverbox" title="Hoverbox">hover box</a>" with information about the item being hovered over.<sup id="cite_ref-1" class="reference"><a href="#cite_note-1"><span>[</span>1<span>]</span></a></sup> <sup id="cite_ref-2" class="reference"><a href="#cite_note-2"><span>[</span>2<span>]</span></a></sup>Tooltips do not usually appear on <a href="/wiki/Mobile_operating_system" title="Mobile operating system">mobile operating systems</a>, because there is no cursor (though tooltips may be displayed when using a <a href="/wiki/Mouse_(computing)" title="Mouse (computing)">mouse</a>).', 'ithoughts-tooltip-glossary' )); ?>"><a href="javascript:void(0)" title=""><?php _e('Activate me', 'ithoughts-tooltip-glossary' ); ?></a></span>
</p>-->
												<p style="flex:1 1 auto;text-align:center">
													<span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-autoshow="true" data-tooltip-id="exampleStyle" data-tooltip-nosolo="true" data-tooltip-nohide="true" data-tooltip-content="<?php _e('This is an example tooltip, with content such as <a>a tag for link</a>, <em>em tag for emphasis</em>, <b>b tag for bold</b> and <i>i tag for italic</i>', 'ithoughts-tooltip-glossary' ); ?>"><a href="javascript:void(0)" title=""><?php _e('Example Tooltip', 'ithoughts-tooltip-glossary' ); ?></a></span>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<p>
								<input autocomplete="off" type="hidden" name="action" value="ithoughts_tt_gl_update_options"/>
								<button name="submit" class="alignleft button-primary"><?php _e('Update Options', 'ithoughts-tooltip-glossary' ); ?></button>
							</p>

						</form>
						<div id="update-response" class="clear confweb-update"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>