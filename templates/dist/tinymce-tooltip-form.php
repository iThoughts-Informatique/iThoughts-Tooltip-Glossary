<?php
/**
 * This file is processed then sent via AJAX when adding/editing a tooltip
 *
 * @file Template file for TinyMCE "Insert a tooltip" editor
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.5.0
 */

use \ithoughts\tooltip_glossary\Backbone as Backbone;

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );
	wp_die( 'Forbidden' );// Exit if accessed directly.
}

?> <div id="ithoughts_tt_gl-tooltip-form-container"><div id="pseudohead"><link rel="stylesheet" id="ithoughts_tt_gl-tinymce_form-css" href="<?php echo esc_url( Backbone::get_instance()->get_resource( 'ithoughts_tooltip_glossary-tinymce_form-css' )->get_file_url() ); ?>" type="text/css" media="all"><script type="text/javascript" src="<?php echo esc_url( Backbone::get_instance()->get_resource( 'ithoughts-simple-ajax-v5' )->get_file_url() ); ?>" defer="defer"></script><script type="text/javascript" src="<?php echo esc_url( Backbone::get_instance()->get_resource( 'ithoughts_tooltip_glossary-tinymce_form' )->get_file_url() ); ?>?v=3.0.1" defer="defer"></script><script type="text/javascript" src="<?php echo esc_url( Backbone::get_instance()->get_resource( 'ithoughts_tooltip_glossary-qtip' )->get_file_url() ); ?>" defer="defer"></script><script>iThoughtsTooltipGlossaryEditor.terms = <?php echo wp_json_encode( $terms ); ?>;</script></div><div aria-label="<?php esc_html_e( 'Insert a Tooltip', 'ithoughts-tooltip-glossary' ); ?>" role="dialog" style="border-width: 1px; z-index: 100101" class="itg-panel itg-floatpanel itg-window itg-in" hidefocus="1" id="ithoughts_tt_gl-tooltip-form"><div class="itg-reset" role="application"><div class="itg-window-head"><div class="itg-title"> <?php esc_html_e( 'Insert a Tooltip', 'ithoughts-tooltip-glossary' ); ?> </div><button aria-hidden="true" class="itg-close ithoughts_tt_gl-tinymce-discard" type="button">×</button></div><div class="itg-window-body"><div class="itg-form itg-first itg-last"><div class="" style="height: 100%"><form> <?php wp_nonce_field( 'ithoughts_tt_gl-get_terms_list' ) ?> <div style="padding:10px;flex:0 0 auto"><table><tr><td><label for="<?php echo esc_attr($inputs['tag-text']->get_id()); ?>"> <?php esc_html_e( 'Text', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['tag-text']->do_print(); ?> </td></tr><tr><td><label for="<?php echo esc_attr($inputs['tag-link']->get_id()); ?>"> <?php esc_html_e( 'Link', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['tag-link']->do_print(); ?> </td></tr></table></div><div class="tab-container"><ul class="tabs" role="tablist"><li class="<?php echo ('gloss' === $data['type']) ? 'active' : ''; ?>" role="tab" tabindex="-1"> <?php esc_html_e( 'Gloss', 'ithoughts-tooltip-glossary' ); ?> </li><li class="<?php echo ('tooltip' === $data['type']) ? 'active' : ''; ?>" role="tab" tabindex="-1"> <?php esc_html_e( 'Tooltip', 'ithoughts-tooltip-glossary' ); ?> </li><li class="<?php echo ('mediatip' === $data['type']) ? 'active' : ''; ?>" role="tab" tabindex="-1"> <?php esc_html_e( 'Mediatip', 'ithoughts-tooltip-glossary' ); ?> </li><li class="topLiner"></li></ul><div class="tab"><table> <?php
										if ( function_exists( 'icl_object_id' ) ) {
										?> <tr><td colspan="2"><b><?php esc_html_e( 'Note:', 'ithoughts-tooltip-glossary' ); ?></b><br> <?php esc_html_e( 'During search, terms appearing with a <span class="foreign-language">yellow background</span> are not available in current language.', 'ithoughts-tooltip-glossary' ); ?> </td></tr> <?php
										}
										?> <tr><td><label for="<?php echo esc_attr($inputs['gloss-title']->get_id()) ?>"> <?php esc_html_e( 'Term', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['gloss-title']->do_print() ?> <div class="gloss-title_completer_container" class="hidden"><div id="gloss-title_completer" class="completer"></div></div> <?php $inputs['gloss-id']->do_print() ?> </td></tr> <?php
	if ( function_exists( 'icl_object_id' ) ) {
										?> <tr><td><label for="<?php echo esc_attr($inputs['disable_auto_translation']->get_id()) ?>"> <?php esc_html_e( 'Disable<br/>auto-translation', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['disable_auto_translation']->do_print() ?> </td></tr> <?php
	}
										?> </table></div><div class="tab"><table><tr><td colspan="2"><label for="<?php echo esc_attr($inputs['tooltip-content']->get_id()) ?>"> <?php esc_html_e( 'Content', 'ithoughts-tooltip-glossary' ); ?> </label><div style="margin:0 -11px"> <?php $inputs['tooltip-content']->do_print() ?> </div></td></tr></table></div><div class="tab"><table><tr><td><label for="mediatip_type"> <?php esc_html_e( 'Mediatip type', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['mediatip_type']->do_print(); ?> </td></tr><tr data-mediatip_type="mediatip-localimage-type"><td colspan="2"><div class="image-box" id="image-box"> <?php
													if ( isset( $data['mediatip_content']['url'] ) && $data['mediatip_content']['url'] ) {
													?> <img src="<?php echo esc_attr( esc_url( $data['mediatip_content']['url'] ) ); ?>"> <?php
													}
													?> </div><input id="image-box-data" type="hidden" value="<?php echo esc_attr( $data['mediatip_content_json'] ); ?>"><div class="itg-widget itg-btn itg-last itg-btn-has-text" role="button" style="width: 100%; height: 30px" tabindex="-1"><button role="presentation" style="height: 100%; width: 100%" tabindex="-1" type="button" id="ithoughts_tt_gl_select_image"> <?php esc_html_e( 'Select an image', 'ithoughts-tooltip-glossary' ); ?> </button></div></td></tr><tr data-mediatip_type="mediatip-webimage-type"><td><label for="<?php echo esc_attr($inputs['mediatip_url_image']->get_id()); ?>"> <?php esc_html_e( 'Image url', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['mediatip_url_image']->do_print(); ?> </td></tr><tr data-mediatip_type="mediatip-webimage-type mediatip-localimage-type"><td><label for="<?php echo esc_attr($inputs['mediatip-caption']->get_id()); ?>"> <?php esc_html_e( 'Caption', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['mediatip-caption']->do_print(); ?> </td></tr><tr data-mediatip_type="mediatip-webvideo-type"><td><label for="<?php echo esc_attr($inputs['mediatip_url_video_link']->get_id()); ?>"> <?php esc_html_e( 'Video integration code', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['mediatip_url_video_link']->do_print(); ?> <?php $inputs['mediatip_url_video_embed']->do_print(); ?> </td></tr></table></div></div></form></div></div></div><div class="itg-panel itg-foot" tabindex="-1" role="group"><div class=""><div class="itg-btn itg-first itg-btn-has-text" role="button" tabindex="-1" style="float:left"><button role="presentation" style="height: 100%; width: 100%" tabindex="-1" type="button" id="ithoughts_tt_gl-tinymce-advanced_options"> <?php esc_html_e( 'Advanced attributes', 'ithoughts-tooltip-glossary' ); ?> </button></div><div class="itg-btn itg-primary itg-btn-has-text" role="button" tabindex="-1"><button role="presentation" style="height: 100%; width: 100%" tabindex="-1" type="button" id="ithoughts_tt_gl-tinymce-validate"> <?php esc_html_e( 'Ok', 'ithoughts-tooltip-glossary' ); ?> </button></div><div class="itg-btn itg-last itg-btn-has-text" role="button" tabindex="-1"><button role="presentation" style="height: 100%; width: 100%" tabindex="-1" type="button" class="ithoughts_tt_gl-tinymce-discard"> <?php esc_html_e( 'Discard', 'ithoughts-tooltip-glossary' ); ?> </button></div></div></div></div></div><div aria-label="<?php esc_html_e( 'Tooltip options', 'ithoughts-tooltip-glossary' ); ?>" role="dialog" style="border-width: 1px; z-index: 9999999; display:none" class="itg-panel itg-floatpanel itg-window itg-in" hidefocus="1" id="ithoughts_tt_gl-tooltip-form-options"><div class="itg-reset" role="application"><div class="itg-window-head"><div class="itg-title"> <?php esc_html_e( 'Tooltip options', 'ithoughts-tooltip-glossary' ); ?> </div><button aria-hidden="true" class="itg-close ithoughts_tt_gl-tinymce-discard" type="button">×</button></div><div class="itg-window-body"><div class="itg-form itg-first itg-last"><div class="" style="height: 100%"><form><div style="flex:0 0 auto"><div class="tab-container"><ul class="tabs" role="tablist"><li role="tab" tabindex="-1" class="active"> <?php esc_html_e( 'Customize', 'ithoughts-tooltip-glossary' ); ?> </li><li role="tab" tabindex="-1"> <?php esc_html_e( 'Attributes', 'ithoughts-tooltip-glossary' ); ?> </li><li class="topLiner"></li></ul><div class="tab active"><table><tr><td><label for="<?php echo esc_attr($inputs['gloss-contenttype']->get_id()); ?>"> <?php esc_html_e( 'Tooltip content', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['gloss-contenttype']->do_print(); ?> </td></tr><tr><td><label for="<?php echo esc_attr($inputs['tip-keep-open']->get_id()); ?>"> <?php
														$tooltip = apply_filters( 'ithoughts_tt_gl_tooltip', esc_html__( 'Delay tooltip hide', 'ithoughts-tooltip-glossary' ), esc_html__( 'Add a timer of 500ms before hiding the tooltip. This allow the user to click into the tip. This option is enabled by default for video mediatips.', 'ithoughts-tooltip-glossary' ) );
														echo wp_kses(
															$tooltip,
															array(
																'span' => array(
																	'tip-nosolo' => true,
																	'class' => true,
																	'data-tooltip-content' => true,
																),
																'a' => array(
																	'href' => true,
																),
															)
														); ?> </label></td><td> <?php $inputs['tip-keep-open']->do_print(); ?> </td></tr><tr><td><label for="<?php echo esc_attr($inputs['tip-trigger']->get_id()); ?>"> <?php esc_html_e( 'Tooltip trigger', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['tip-trigger']->do_print(); ?> <?php $inputs['tip-triggerText']->do_print(); ?> </td></tr><tr><td><label for="<?php echo esc_attr($inputs['tip-style']->get_id()); ?>"> <?php esc_html_e( 'Tooltip style', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['tip-style']->do_print(); ?> </td></tr><tr><td><label for="<?php echo esc_attr($inputs['tip-shadow']->get_id()); ?>"> <?php esc_html_e( 'Tooltip shadow', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['tip-shadow']->do_print(); ?> </td></tr><tr><td><label for="<?php echo esc_attr($inputs['tip-rounded']->get_id()); ?>"> <?php esc_html_e( 'Rounded corners', 'ithoughts-tooltip-glossary' ); ?> </label></td><td> <?php $inputs['tip-rounded']->do_print(); ?> </td></tr><tr><td><label for="position_my"> <?php
														$tooltip = apply_filters( 'ithoughts_tt_gl_tooltip', esc_html__( 'Position of the tip', 'ithoughts-tooltip-glossary' ), esc_html__( 'Position of the sharp tip around the tooltip. By default, the main axis is vertical', 'ithoughts-tooltip-glossary' ) );
														echo wp_kses(
															$tooltip,
															array(
																'span' => array(
																	'tip-nosolo' => true,
																	'class' => true,
																	'data-tooltip-content' => true,
																),
																'a' => array(
																	'href' => true,
																),
															)
														); ?> </label></td><td><div style="display:inline"> <?php $inputs['position']['my'][1]->do_print(); ?> </div><div style="display:inline"> <?php $inputs['position']['my'][2]->do_print(); ?> </div><label for="position_my_invert"><?php
														$inputs['position']['my']['invert']->do_print();
														esc_html_e( 'Invert main axis', 'ithoughts-tooltip-glossary' );
														?></label></td></tr><tr><td><label for="position_at"> <?php
														$tooltip = apply_filters( 'ithoughts_tt_gl_tooltip', esc_html__( 'Position of the tooltip', 'ithoughts-tooltip-glossary' ), esc_html__( 'Position of the tooltip around the target area', 'ithoughts-tooltip-glossary' ) );
														echo wp_kses(
															$tooltip,
															array(
																'span' => array(
																	'tip-nosolo' => true,
																	'class' => true,
																	'data-tooltip-content' => true,
																),
																'a' => array(
																	'href' => true,
																),
															)
														); ?> </label></td><td><div style="display:inline"> <?php $inputs['position']['at'][1]->do_print(); ?> </div><div style="display:inline"> <?php $inputs['position']['at'][2]->do_print(); ?> </div></td></tr><tr><td><label for="in_out"> <?php esc_html_e( 'Animations', 'ithoughts-tooltip-glossary' ); ?> </label></td><td><label for="anim[in]"><?php esc_html_e( 'In', 'ithoughts-tooltip-glossary' ); ?>:&nbsp;<?php $inputs['anim']['in']->do_print(); ?></label>&nbsp;&nbsp;<label for="anim[out]"><?php esc_html_e( 'Out', 'ithoughts-tooltip-glossary' ); ?>:&nbsp;<?php $inputs['anim']['out']->do_print(); ?></label>&nbsp;&nbsp;<label for="anim[time]"><?php esc_html_e( 'Duration', 'ithoughts-tooltip-glossary' ); ?>:&nbsp;<?php $inputs['anim']['time']->do_print(); ?>ms</label></td></tr><tr><td><label for="<?php echo esc_attr($inputs['maxwidth']->get_id()); ?>"> <?php
														$tooltip = apply_filters( 'ithoughts_tt_gl_tooltip', esc_html__( 'Max width', 'ithoughts-tooltip-glossary' ), esc_html__( 'Maximum width of the tooltip. The default value of this property is 280px. Be carefull about this option: a too high value may overflow outside small devices.', 'ithoughts-tooltip-glossary' ) );
														echo wp_kses(
															$tooltip,
															array(
																'span' => array(
																	'tip-nosolo' => true,
																	'class' => true,
																	'data-tooltip-content' => true,
																),
																'a' => array(
																	'href' => true,
																),
															)
														); ?> </label></td><td> <?php $inputs['maxwidth']->do_print(); ?> </td></tr></table></div><div class="tab"><table><tr><td colspan="2"><datalist id="attributes-list"> <?php
														foreach ( $attrs as $attr ) {
														?><option value="<?php
															echo esc_attr( $attr );
															?>"><?php
														}
														?> </datalist><div class="ithoughts_tt_gl-attrs-table"><h3 style="text-align: center"><b> <?php esc_html_e( 'Attributes', 'ithoughts-tooltip-glossary' ); ?> </b></h3><div><h4 style="text-align: center"><b> <?php esc_html_e( 'Span attribute', 'ithoughts-tooltip-glossary' ); ?> </b></h4><hr><div><div><div class="ithoughts-attrs-container" data-attr-family="span"> <?php
																		$i = 0;
																		foreach ( $opts['attributes']['span'] as $key => $value ) {
																		?> <div class="attribute-name-val <?php echo ((0 === $i) ? 'ithoughts-prototype' : ''); ?>"><div class="kv-pair"><label for="attributes-span-key-<?php echo absint( $i ); ?>" class="dynamicId dynamicId-key"> <?php esc_html_e( 'Key', 'ithoughts-tooltip-glossary' ); ?> </label><input type="text" <?php echo (0 === $i) ? 'disabled' : ''; ?> class="dynamicId dynamicId-key" value="<?php echo esc_attr( $key ); ?>" autocomplete="off" list="attributes-list" name="attributes-span-key[]" id="attributes-span-key-<?php echo absint( $i ); ?>"></div><div class="kv-pair"><label for="attributes-span-value-<?php echo absint( $i ); ?>" class="dynamicId dynamicId-value"> <?php esc_html_e( 'Value', 'ithoughts-tooltip-glossary' ); ?> </label><input type="text" <?php echo (0 === $i) ? 'disabled' : ''; ?> class="dynamicId dynamicId-value" value="<?php echo esc_attr( $value ); ?>" autocomplete="off" name="attributes-span-value[]" id="attributes-span-value-<?php echo absint( $i ); ?>"></div></div> <?php
																			$i++;
																		} ?> </div><div style="clear:both"></div><button type="button" class="kv-pair-span-attrs-add" class="button button-primary button-large"><?php esc_html_e( 'Add', 'ithoughts-tooltip-glossary' ); ?></button></div></div></div><div><h4 style="text-align: center"><b> <?php esc_html_e( 'Link attribute', 'ithoughts-tooltip-glossary' ); ?> </b></h4><hr><div><div><div class="ithoughts-attrs-container" data-attr-family="link"> <?php
																		$i = 0;
																		foreach ( $opts['attributes']['link'] as $key => $value ) {
																		?> <div class="attribute-name-val <?php echo (0 === $i) ? 'ithoughts-prototype' : ''; ?>"><div class="kv-pair"><label for="attributes-link-key-<?php echo absint( $i ); ?>" class="dynamicId dynamicId-key"> <?php esc_html_e( 'Key', 'ithoughts-tooltip-glossary' ); ?> </label><input type="text" <?php echo (0 === $i) ? 'disabled' : ''; ?> class="dynamicId dynamicId-key" value="<?php echo esc_attr( $key ); ?>" autocomplete="off" list="attributes-list" name="attributes-link-key[]" id="attributes-link-key-<?php echo absint( $i ); ?>"></div><div class="kv-pair"><label for="attributes-link-value-<?php echo absint( $i ); ?>" class="dynamicId dynamicId-value"> <?php esc_html_e( 'Value', 'ithoughts-tooltip-glossary' ); ?> </label><input type="text" <?php echo (0 === $i) ? 'disabled' : ''; ?> class="dynamicId dynamicId-value" value="<?php echo esc_attr( $value ); ?>" autocomplete="off" name="attributes-link-value[]" id="attributes-link-value-<?php echo absint( $i ); ?>"></div></div> <?php
																			$i++;
																		} ?> </div><div style="clear:both"></div><button type="button" class="kv-pair-link-attrs-add" class="button button-primary button-large"><?php esc_html_e( 'Add', 'ithoughts-tooltip-glossary' ); ?></button></div></div></div></div></td></tr></table></div></div></div></form></div></div></div><div class="itg-panel itg-foot" tabindex="-1" role="group"><div class=""><div class="itg-btn itg-primary itg-first itg-btn-has-text" role="button" tabindex="-1"><button role="presentation" style="height: 100%; width: 100%" tabindex="-1" type="button" id="ithoughts_tt_gl-tinymce-validate-attrs"> <?php esc_html_e( 'Ok', 'ithoughts-tooltip-glossary' ); ?> </button></div><div class="itg-btn itg-last itg-btn-has-text" role="button" tabindex="-1"><button role="presentation" style="height: 100%; width: 100%" tabindex="-1" type="button" id="ithoughts_tt_gl-tinymce-close-attrs"> <?php esc_html_e( 'Close', 'ithoughts-tooltip-glossary' ); ?> </button></div></div></div></div></div><div style="z-index: 100100" class="itg-modal-block" class="itg-reset itg-fade itg-in"></div></div>