<?php
/*
Plugin Name: WP Glossary
Plugin URI: http://wordpress.org/extend/plugins/wp-glossary/
Description: Build a glossary of terms and link your post content to it.
Author: TCBarrett
Version: 1.1
Author URI: http://www.tcbarrett.com
*/
define( 'TCBWPGPLUGINDIR', dirname( __FILE__ ) );

// get_post_type_archive_link()

include_once( TCBWPGPLUGINDIR . '/glossary-posttype.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-shortcode.php' );
include_once( TCBWPGPLUGINDIR . '/glossaries-shortcode.php' );

add_action( 'wp_enqueue_scripts', 'tcb_wpg_enqueue_scripts' );
function tcb_wpg_enqueue_scripts(){
	//wp_enqueue_script( 'tcb-wpg', plugins_url('css/wp-glossary.css',dirname(__FILE__)) );
	wp_enqueue_style( 'tcb-wpg', home_url('wp-content/plugins/wp-glossary/css/wp-glossary.css') );
	//wp_enqueue_script( 'jquery-tooltip', plugins_url('/js/jquery.tools.min.js', dirname(__FILE__)) );
	wp_enqueue_script( 'jquery-tooltip', home_url('wp-content/plugins/wp-glossary/js/jquery.tools.min.js') );
	wp_enqueue_script( 'wp-glossary', home_url('wp-content/plugins/wp-glossary/js/wp-glossary.js') );
}


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
