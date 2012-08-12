<?php
/*
Plugin Name: WP Glossary
Plugin URI: http://wordpress.org/extend/plugins/wp-glossary/
Description: Build a glossary of terms and link your post content to it.
Author: TCBarrett
Version: 1.1.3
Author URI: http://www.tcbarrett.com
*/
define( 'TCBWPGPLUGINDIR', dirname( __FILE__ ) );

include_once( TCBWPGPLUGINDIR . '/glossary-posttype.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-shortcode.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-term-list-shortcode.php' );

// Register tooltip scripts
add_action( 'init', 'tcb_wpg_register_scripts' );
function tcb_wpg_register_scripts(){
	wp_register_script( 'jquery-tooltip', plugins_url('js/jquery.tools.min.js', __FILE__), array('jquery') );
	wp_register_script( 'wp-glossary-js', plugins_url('js/wp-glossary.js',      __FILE__), array('jquery-tooltip') );
}

// Print tooltip scripts
add_action( 'wp_footer', 'tcb_wpg_print_scripts' );
function tcb_wpg_print_scripts(){
	global $tcb_wpg_scripts;
	if( !$tcb_wpg_scripts ) return;

	wp_print_scripts( 'wp-glossary-js' );
}

// Minimal styling
add_action( 'wp_enqueue_scripts', 'tcb_wpg_enqueue_scripts' );
function tcb_wpg_enqueue_scripts(){
	wp_enqueue_style( 'wp-glossary-css', plugins_url('css/wp-glossary.css', __FILE__) );
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
