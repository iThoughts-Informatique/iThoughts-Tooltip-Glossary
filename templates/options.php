<?php

/**
 * @file Template file for options form
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
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

							<p style="font-size:17px;"><em><?php _e("Need help? Check out the full plugin manual at ", 'ithoughts-tooltip-glossary' ); ?><a href="https://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/" target="_blank">GerkinDevelopment.net</a>.</em></p>
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
													<label for="staticterms"><?php _e('Static terms', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo apply_filters('ithoughts-tt-gl_tooltip', '('.__("infos", 'ithoughts-tooltip-glossary' ).')', __('Include term content directly into the pages to avoid use of Ajax. This can slow down your page generation.', 'ithoughts-tooltip-glossary' ), array("attributes" => array('tooltip-nosolo'=>"true"))); ?>
														
														
												</th>
												<td>
													<?php echo $optionsInputs["staticterms"]; ?>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="forceloadresources"><?php _e('Force load resources', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo apply_filters('ithoughts-tt-gl_tooltip', '('.__("infos", 'ithoughts-tooltip-glossary' ).')', __('Load scripts on every pages, even if not required. This option can be useful if some cache plugins are active, or if you think that scripts are not loaded when required.', 'ithoughts-tooltip-glossary' ), array("attributes" => array('tooltip-nosolo'=>"true"))); ?>:</label>
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
											<tr>
												<th>
													<label for="termscomment"><?php _e('Enable comments on glossary terms', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<?php echo $optionsInputs["termscomment"]; ?><p><em><strong>Note: </strong>You may need to enable manually the comments on each glossary terms posted before enabling this option.</em></p>
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
															<label for="qtipshadow"><?php _e('Tooltip shadow', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo apply_filters('ithoughts-tt-gl_tooltip','('.__("infos", 'ithoughts-tooltip-glossary' ).')', __('This option can be overriden by some tooltip styles.', 'ithoughts-tooltip-glossary' ), array("attributes" => array('tooltip-nosolo'=>"true"))); ?>:</label>
														</th>
														<td>
															<?php echo $optionsInputs["qtipshadow"]; ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="qtiprounded"><?php _e('Rounded corners', 'ithoughts-tooltip-glossary' ); ?>&nbsp;
														<?php echo apply_filters('ithoughts-tt-gl_tooltip','('.__("infos", 'ithoughts-tooltip-glossary' ).')', __('This option can be overriden by some tooltip styles.', 'ithoughts-tooltip-glossary' ), array("attributes" => array('tooltip-nosolo'=>"true"))); ?>:</label>
														</th>
														<td>
															<?php echo $optionsInputs["qtiprounded"]; ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="anims"><?php _e('Animations', 'ithoughts-tooltip-glossary' ); ?></label>
														</th>
														<td>
															<label for="anim_in"><?php _e('Animation in', 'ithoughts-tooltip-glossary' ); ?>:&nbsp;<?php echo $optionsInputs["anim_in"]; ?></label><br/>
															<label for="anim_out"><?php _e('Animation out', 'ithoughts-tooltip-glossary' ); ?>:&nbsp;<?php echo $optionsInputs["anim_out"]; ?></label><br/>
															<label for="anim_time"><?php _e('Animation duration', 'ithoughts-tooltip-glossary' ); ?>:&nbsp;<?php echo $optionsInputs["anim_time"]; ?>ms</label>
														</td>
													</tr>
												</tbody>
											</table>


										</div>
										<div style="flex:1 1 auto;;position:relative;">
											<div id="floater" style="display:flex;flex-direction:row;width:100%;">
												<p style="flex:1 1 auto;text-align:center">
													<span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-autoshow="true" data-tooltip-prerender="true" data-tooltip-id="exampleStyle" data-tooltip-nosolo="true" data-tooltip-nohide="true" data-tooltip-content="<?php _e('This is an example tooltip, with content such as <a>a tag for link</a>, <em>em tag for emphasis</em>, <b>b tag for bold</b> and <i>i tag for italic</i>', 'ithoughts-tooltip-glossary' ); ?>"><a href="javascript:void(0)" title=""><?php _e('Example Tooltip', 'ithoughts-tooltip-glossary' ); ?></a></span>
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