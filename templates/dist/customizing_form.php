<?php

/**
 * @file Template file for the style editor
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


$url;
switch(substr(get_locale(), 0, 2)) {
	case "fr":
		$url = "https://www.gerkindevelopment.net/portfolio/ithoughts-tooltip-glossary/";
		break;

	default:
		$url = "https://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/";
		break;
}
?> <div class="wrap"><div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50 metabox-holder"><div class="meta-box-inside admin-help"><div class="icon32" id="icon-options-general"><br></div><h2><?php esc_html_e('Theme editor', 'ithoughts-tooltip-glossary' ); ?></h2><div id="dashboard-widgets-wrap"><div class="dashboard-widgets"><p style="font-size:17px"><em><?php printf(
	wp_kses(
		__(
			'Need help? Check out the full plugin manual at <a href="%s">GerkinDevelopment.net</a>.', 'ithoughts-tooltip-glossary'
		),
		array(
			'a' => array(
				'href' => array()
			)
		)
	),
	esc_url($url)
); ?></em></p><div style="display:flex;flex-direction:row;flex-wrap:wrap"><div id="normal-sortables" class="" style="flex:1 1 auto"><div class="postbox"><h3 class="hndle"><span><?php esc_html_e('Load a theme', 'ithoughts-tooltip-glossary' ); ?></span></h3><div class="inside"><form id="ithoughts_loadtheme" method="get"><input type="hidden" name="page" value="ithoughts-tooltip-glossary-themes"><label for="theme_select"><?php esc_html_e('Theme to load', 'ithoughts-tooltip-glossary' ); ?></label> <?php echo $inputs["theme_select"]; ?> <button type="submit" name="action" class="button button-primary" value="load"><?php esc_html_e('Load', 'ithoughts-tooltip-glossary' ); ?></button> <button type="submit" class="button button-secondary" name="action" value="delete" onclick="var themename=gei('themename');return ((themename&&themename.value&&(themename=themename.value))?confirm('<?php esc_html_e('Are you sure you want to delete the theme %s?', 'ithoughts-tooltip-glossary'); ?>'.replace('%s', themename)):false);"><?php esc_html_e('Delete', 'ithoughts-tooltip-glossary' ); ?></button></form></div></div><form method="get"><input type="hidden" name="page" value="ithoughts-tooltip-glossary-themes"> <button type="submit" name="action" class="button button-secondary floatright" value="recompile" style="width:100%;margin:0 auto 25px;padding: 25px;line-height: 0"><?php _e('Recompile all stylesheets', 'ithoughts-tooltip-glossary' ); ?></button></form><div class="postbox" id="ithoughts-tt-gl-lesseditor"><h3 class="hndle"><span><?php _e('LESS editor', 'ithoughts-tooltip-glossary' ); ?></span></h3><div class="inside"><form id="LESS-form" class="less-form simpleajaxform" action="<?php echo admin_url( 'admin-ajax.php' ); ?>" method="post" data-target="update-response"><input type="hidden" name="action" id="action"> <?php echo $inputs["splittedHead"]; ?> <?php echo $inputs["file"]; ?> <table class="form-table stripped"><tr><th><?php _e("Theme name", "ithoughts-tooltip-glossary"); ?></th><td><?php echo $inputs["themename"]; ?></td></tr><tr><th><?php _e("Theme content", "ithoughts-tooltip-glossary"); ?></th><td><?php echo $inputs["content"]; ?></td></tr><tr><td colspan="2"><div><button name="actionB" value="ithoughts_tt_gl_theme_save" id="compilecss" class="alignleft button button-primary" style="display:inline-block;width:50%;text-align:center"><?php _e("Save theme", 'ithoughts-tooltip-glossary' ); ?></button> <button name="actionB" value="ithoughts_tt_gl_theme_preview" id="previewcss" class="alignleft button" style="display:inline-block;width:50%;text-align:center"><?php _e("Preview", 'ithoughts-tooltip-glossary' ); ?></button></div></td></tr><tr><td colspan="2"><div id="update-response" class="clear confweb-update"></div></td></tr></table></form></div></div></div><div style="flex:1 1 auto;position:relative"><div id="floater" style="display:flex;flex-direction:row;width:100%"><p style="flex:1 1 auto;text-align:center"><span class="itg-tooltip" data-tooltip-autoshow="true" data-qtipstyle="<?php echo $themename; ?>" data-tooltip-id="exampleStyle" data-tooltip-nosolo="true" data-tooltip-nohide="true" data-tooltip-content="<?php _e('This is an example tooltip, with content such as <a>a tag for link</a>, <em>em tag for emphasis</em>, <b>b tag for bold</b> and <i>i tag for italic</i>', 'ithoughts-tooltip-glossary' ); ?>"><a href="javascript:void(0)" title=""><?php _e('Example Tooltip', 'ithoughts-tooltip-glossary' ); ?></a></span></p></div></div></div></div></div></div></div></div>