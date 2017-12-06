<?php
/**
 * Generates the script, defining our animation functions
 *
 * @file Template file for TinyMCE "Insert a tooltip" editor
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 3.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );
	wp_die( 'Forbidden' );// Exit if accessed directly.
}

if ( count( $anims_custom_in ) > 0 || count( $anims_custom_out ) > 0 ) {
	
?>
<script id="ithoughts_tt_gl-custom-anims">iThoughtsTooltipGlossary.animationFunctions = jQuery.extend(!0,iThoughtsTooltipGlossary.animationFunctions,{<?php
	if ( $anims_custom_in_count > 0 ) {
		echo 'in:{';
		foreach ( $anims_custom_in as $name => $anim_infos ) {
			echo '"' . esc_js( $name ) . '":' . esc_js( $anim_infos['js'] ) . ',';
		}
		echo '},';
	}
	if ( $anims_custom_out_count > 0 ) {
		echo 'out:{';
		foreach ( $anims_custom_out as $name => $anim_infos ) {
			echo '"' . esc_js( $name ) . '":' . esc_js( $anim_infos['js'] ) . ',';
		}
		echo '},';
	}
		?>});</script>
<?php
	
}