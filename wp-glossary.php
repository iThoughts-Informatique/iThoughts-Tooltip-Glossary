<?php
/*
Plugin Name: WP Glossary
Plugin URI: http://wordpress.org/extend/plugins/wp-glossary/
Description: Build a glossary of terms and link your post content to it.
Author: TCBarrett
Version: 1.0
Author URI: http://www.tcbarrett.com
*/
define( 'GLOSARYPLUGINDIR', dirname( __FILE__ ) );
define( 'GLOSARYPLUGINURL', plugin_dir_url( __FILE__ ) );

// get_post_type_archive_link()

include_once( GLOSARYPLUGINDIR . '/glossary-posttype.php' );
include_once( GLOSARYPLUGINDIR . '/glossary-shortcode.php' );


/** */
register_activation_hook( __FILE__, 'tcb_glossary_activation_hook' );
function tcb_glossary_activation_hook(){
	flush_rewrite_rules( $hard=false );
}


/** */
register_deactivation_hook( __FILE__, 'tcb_glossary_deactivation_hook' );
function tcb_glossary_deactivation_hook(){
	flush_rewrite_rules( $hard=false );
}
