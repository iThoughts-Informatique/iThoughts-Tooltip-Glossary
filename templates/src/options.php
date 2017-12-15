<?php
/**
 * Template file for managing iThoughts Tooltip Glossary options.
 *
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
	status_header( 403 );
	wp_die( 'Forbidden' );// Exit if accessed directly.
}

?>
<div class="wrap">
	<div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50 metabox-holder">
		<div class="meta-box-inside admin-help">
			<div class="icon32" id="icon-options-general">
				<br>
			</div>
			<h2><?php esc_html_e( 'Options', 'ithoughts-tooltip-glossary' ); ?></h2>
			<div id="dashboard-widgets-wrap">
				<div id="dashboard-widgets">
					<div id="normal-sortables" class=""><!--Old removed classes: "meta-box-sortables ui-sortable"-->
						<form action="<?php echo esc_url( $ajax ); ?>" method="post" class="simpleajaxform" data-target="update-response">
							<?php wp_nonce_field( 'ithoughts_tt_gl-update_options' ); ?>
							<p style="font-size:17px;">
								<em><?php
								printf(
									wp_kses(
										/* translators: %s: Documentation URL */
										__(
											'Need help? Check out the full plugin manual at <a href="%s">GerkinDevelopment.net</a>.',
											'ithoughts-tooltip-glossary'
										),
										array(
											'a' => array(
												'href' => array(),
											),
										)
									),
									esc_url( $url )
								); ?></em>
							</p>
							<p><strong><?php esc_html_e( 'Note', 'ithoughts-tooltip-glossary' ); ?>:</strong>&nbsp;<?php
								echo wp_kses( __( 'Labels in <span class=\"nonoverridable\">red</span> indicate global options, not overridable by tips.', 'ithoughts-tooltip-glossary' ), array(
									'span' => array(
										'class' => array(),
									),
								) ); ?></p>
							<div id="ithoughts_tt_gllossary_options_1" class="postbox">
								<div class="handlediv" title="Cliquer pour inverser."><br></div><h3 class="hndle"><span><?php esc_html_e('Glossary options', 'ithoughts-tooltip-glossary'); ?></span></h3>
								<div class="inside">
									<table class="form-table">
										<tbody>
											<tr>
												<th>
													<label for="<?php echo esc_attr($options_inputs['glossary-contenttype']->get_id()); ?>"><?php esc_html_e( 'Glossary Tip Content', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<?php $options_inputs['glossary-contenttype']->print(); ?>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="<?php echo esc_attr($options_inputs['termtype']->get_id()); ?>"><?php esc_html_e( 'Base Permalink', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<code>/</code><?php $options_inputs['termtype']->print(); ?><code>/</code>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="<?php echo esc_attr($options_inputs['grouptype']->get_id()); ?>"><?php esc_html_e( 'Taxonomy group prefix', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<code>/<?php echo esc_html( $options['termtype'] ); ?>/</code><?php $options_inputs['grouptype']->print(); ?><code>/</code>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="<?php echo esc_attr($options_inputs['glossary-index']->get_id()); ?>"><?php esc_html_e( 'Glossary Index page', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<?php $options_inputs['glossary-index']->print(); ?>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="<?php echo esc_attr($options_inputs['exclude_search']->get_id()); ?>"><?php esc_html_e( 'Exclude from search', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<?php $options_inputs['exclude_search']->print(); ?>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="<?php echo esc_attr($options_inputs['termscomment']->get_id()); ?>"><?php esc_html_e( 'Enable comments on glossary terms', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<?php $options_inputs['termscomment']->print(); ?><p><em><strong><?php esc_html_e( 'Note:', 'ithoughts-tooltip-glossary' ); ?> </strong><?php esc_html_e( 'You may need to enable manually the comments on each glossary terms posted before enabling this option.', 'ithoughts-tooltip-glossary' ); ?></em></p>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="<?php echo esc_attr($options_inputs['staticterms']->get_id()); ?>"><?php esc_html_e( 'Static terms', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php
														$tooltip = apply_filters( 'ithoughts_tt_gl_tooltip', '(' . esc_html__( 'infos', 'ithoughts-tooltip-glossary' ) . ')', esc_html__( 'Include term content directly into the pages to avoid use of Ajax. This can slow down your page generation.', 'ithoughts-tooltip-glossary' ), array(
															'tip-nosolo' => 'true',
														) );
														echo wp_kses(
															$tooltip,
															array(
																'span' => array(
																	'data-tip-nosolo' => true,
																	'class' => true,
																	'data-tooltip-content' => true,
																),
																'a' => array(
																	'href' => true,
																),
															)
														); ?>


														</th>
												<td>
													<?php $options_inputs['staticterms']->print(); ?>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							
							
							<div id="ithoughts_tt_gllossary_options_2" class="postbox">
								<div class="handlediv" title="Cliquer pour inverser."><br></div><h3 class="hndle"><span><?php esc_html_e('General options options', 'ithoughts-tooltip-glossary'); ?></span></h3>
								<div class="inside">
									<table class="form-table">
											<tr>
												<th>
													<label for="<?php echo esc_attr($options_inputs['termlinkopt']->get_id()); ?>"><?php esc_html_e( 'Term link', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<?php $options_inputs['termlinkopt']->print(); ?>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="<?php echo esc_attr($options_inputs['forceloadresources']->get_id()); ?>"><?php esc_html_e( 'Force load resources', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php
														$tooltip = apply_filters( 'ithoughts_tt_gl_tooltip', '(' . esc_html__( 'infos', 'ithoughts-tooltip-glossary' ) . ')', esc_html__( 'Load scripts on every pages, even if not required. This option can be useful if some cache plugins are active, or if you think that scripts are not loaded when required.', 'ithoughts-tooltip-glossary' ), array(
															'tip-nosolo' => 'true',
														) );
														echo wp_kses(
															$tooltip,
															array(
																'span' => array(
																	'data-tip-nosolo' => true,
																	'class' => true,
																	'data-tooltip-content' => true,
																),
																'a' => array(
																	'href' => true,
																),
															)
														); ?>:</label>
												</th>
												<td>
													<?php $options_inputs['forceloadresources']->print(); ?>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="<?php echo esc_attr($options_inputs['use_cdn']->get_id()); ?>"><?php esc_html_e( 'Use CDN for library files', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<?php $options_inputs['use_cdn']->print(); ?><p>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="<?php echo esc_attr($options_inputs['verbosity']->get_id()); ?>"><?php esc_html_e( 'Log level', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php
														$tooltip = apply_filters(
															'ithoughts_tt_gl_tooltip',
															'(' . esc_html__( 'infos', 'ithoughts-tooltip-glossary' ) . ')',
															wp_kses(
																__('Print more infos to the browser console & the server logs.<ul>
<li>"Silent" will output nothing. Use it if all works fine and you are in production site</li>
<li>"Errors" will only output if something was wrong. This is recomended on most sites</li>
<li>"Warnings" should be used on test sites</li>
<li>"Infos" is the mode to use when asking for help on support thread, except if we ask you to use the mode "All"</li>
<li>"All" will print many informations usefull for advanced debugging, but also a lot of trash. Post your logs in this mode ONLY if asked by the maintainer</li>
</ul>.', 'ithoughts-tooltip-glossary'),
																array(
																	'ul' => array(),
																	'li' => array(),
																)
															),
															array(
																'tip-nosolo' => 'true',
																'qtip-keep-open' => 'true',
															)
														);
														echo wp_kses(
															$tooltip,
															array(
																'span' => array(
																	'data-tip-nosolo' => true,
																	'class' => true,
																	'data-tooltip-content' => true,
																),
																'a' => array(
																	'href' => true,
																),
															)
														); ?>:</label>
												</th>
												<td>
													<?php $options_inputs['verbosity']->print(); ?>&nbsp;<label for="<?php echo esc_attr($options_inputs['verbosity']->get_id()); ?>" id="ithoughts_tt_gl-verbosity_label" style="display:inline-block;line-height:27px;vertical-align:top;" data-labels='["<?php esc_attr_e( 'Silent', 'ithoughts-tooltip-glossary' ); ?>","<?php esc_attr_e( 'Errors', 'ithoughts-tooltip-glossary' ); ?>","<?php esc_attr_e( 'Warnings', 'ithoughts-tooltip-glossary' ); ?>","<?php esc_attr_e( 'Infos', 'ithoughts-tooltip-glossary' ); ?>","<?php esc_attr_e( 'All', 'ithoughts-tooltip-glossary' ); ?>"]'></label>
												</td>
											</tr>
											<tr class="nonoverridable">
												<th>
													<label for="itg-purge"><?php esc_html_e( 'Empty log file', 'ithoughts-tooltip-glossary' ); ?>:</label>
												</th>
												<td>
													<button id="itg-purge" role="button" class="button button-link-delete"><?php esc_html_e( 'Empty', 'ithoughts-tooltip-glossary' ); ?></button>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>

							<div class="postbox" id="ithoughts_tt_gllossary_options_2">
								<div class="handlediv" title="Cliquer pour inverser." onclick="window.refloat(this);"><br></div><h3 onclick="window.refloat(this);" class="hndle"><span><?php esc_html_e( 'qTip2 Tooltip Options', 'ithoughts-tooltip-glossary' ); ?></span></h3>
								<div class="inside">
									<div style="display:flex;flex-direction:row;flex-wrap:wrap;">
										<div style="flex:1 1 auto;">


											<p><?php
												printf( wp_kses( __( 'iThoughts Tooltip Glossary uses the jQuery based <a href="http://qtip2.com/">qTip2</a> library for tooltips.', 'ithoughts-tooltip-glossary' ), array(
													'a' => array(
														'href' => array(),
													),
												) ) ); ?></p>
											<table class="form-table">
												<tbody>
													<tr>
														<th>
															<label for="<?php echo esc_attr($options_inputs['qtiptrigger']->get_id()); ?>"><?php esc_html_e( 'Tooltip activation', 'ithoughts-tooltip-glossary' ); ?>:</label>
														</th>
														<td>
															<?php $options_inputs['qtiptrigger']->print(); ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="<?php echo esc_attr($options_inputs['qtipstyle']->get_id()); ?>"><?php esc_html_e( 'Tooltip Style (qTip)', 'ithoughts-tooltip-glossary' ); ?>:</label>
														</th>
														<td>
															<?php $options_inputs['qtipstyle']->print(); ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="<?php echo esc_attr($options_inputs['qtipshadow']->get_id()); ?>"><?php esc_html_e( 'Tooltip shadow', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php
																$tooltip = apply_filters( 'ithoughts_tt_gl_tooltip','(' . esc_html__( 'infos', 'ithoughts-tooltip-glossary' ) . ')', esc_html__( 'This option can be overriden by some tooltip styles.', 'ithoughts-tooltip-glossary' ), array(
																	'tip-nosolo' => 'true',
																) );
																echo wp_kses(
																	$tooltip,
																	array(
																		'span' => array(
																			'data-tip-nosolo' => true,
																			'class' => true,
																			'data-tooltip-content' => true,
																		),
																		'a' => array(
																			'href' => true,
																		),
																	)
																); ?>:</label>
														</th>
														<td>
															<?php $options_inputs['qtipshadow']->print(); ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="<?php echo esc_attr($options_inputs['qtiprounded']->get_id()); ?>"><?php esc_html_e( 'Rounded corners', 'ithoughts-tooltip-glossary' ); ?>&nbsp;
																<?php
																$tooltip = apply_filters( 'ithoughts_tt_gl_tooltip','(' . esc_html__( 'infos', 'ithoughts-tooltip-glossary' ) . ')', esc_html__( 'This option can be overriden by some tooltip styles.', 'ithoughts-tooltip-glossary' ), array(
																	'tip-nosolo' => 'true',
																) );
																echo wp_kses(
																	$tooltip,
																	array(
																		'span' => array(
																			'data-tip-nosolo' => true,
																			'class' => true,
																			'data-tooltip-content' => true,
																		),
																		'a' => array(
																			'href' => true,
																		),
																	)
																); ?>:</label>
														</th>
														<td>
															<?php $options_inputs['qtiprounded']->print(); ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="anims"><?php esc_html_e( 'Animations', 'ithoughts-tooltip-glossary' ); ?></label>
														</th>
														<td>
															<label for="<?php echo esc_attr($options_inputs['anim_in']->get_id()); ?>"><?php esc_html_e( 'Animation in', 'ithoughts-tooltip-glossary' ); ?>:&nbsp;<?php $options_inputs['anim_in']->print(); ?></label><br/>
															<label for="<?php echo esc_attr($options_inputs['anim_out']->get_id()); ?>"><?php esc_html_e( 'Animation out', 'ithoughts-tooltip-glossary' ); ?>:&nbsp;<?php $options_inputs['anim_out']->print(); ?></label><br/>
															<label for="<?php echo esc_attr($options_inputs['anim_time']->get_id()); ?>"><?php esc_html_e( 'Animation duration', 'ithoughts-tooltip-glossary' ); ?>:&nbsp;<?php $options_inputs['anim_time']->print(); ?>ms</label>
														</td>
													</tr>
												</tbody>
											</table>


										</div>
										<div style="flex:1 1 auto;;position:relative;">
											<div id="floater" style="display:flex;flex-direction:row;width:100%;">
												<p style="flex:1 1 auto;text-align:center;">
													<?php echo apply_filters('ithoughts_tt_gl_tooltip', esc_html__( 'Example Tooltip', 'ithoughts-tooltip-glossary' ), wp_kses( __( 'This is an example tooltip, with content such as <a>a tag for link</a>, <em>em tag for emphasis</em>, <b>b tag for bold</b> and <i>i tag for italic</i>', 'ithoughts-tooltip-glossary' ), array(
	'a' => array(),
	'em' => array(),
	'b' => array(),
	'i' => array(),
) ), array(
	'id'            => 'qtip-exampleStyle',
	'tip-autoshow'  => 'true',
	'tip-prerender' => 'true',
	'tip-id'        => 'exampleStyle',
	'tip-nosolo'    => 'true',
	'tip-nohide'    => 'true',
)); ?>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<p>
								<input autocomplete="off" type="hidden" name="action" value="ithoughts_tt_gl_update_options"/>
								<button name="submit" class="alignleft button-primary"><?php esc_html_e( 'Update Options', 'ithoughts-tooltip-glossary' ); ?></button>
							</p>

						</form>
						<div id="update-response" class="clear confweb-update"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
