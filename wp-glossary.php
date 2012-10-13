<?php
/*
Plugin Name: WP Glossary
Plugin URI: http://wordpress.org/extend/plugins/wp-glossary/
Description: Build a glossary of terms and link your post content to it.
Author: TCBarrett
Version: 1.3.3
Author URI: http://www.tcbarrett.com/
*/
define( 'TCBWPGPLUGINDIR', dirname( __FILE__ ) );

include_once( TCBWPGPLUGINDIR . '/glossary-posttype.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-shortcode.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-term-list-shortcode.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-atoz-shortcode.php' );

add_action( 'init', 'tcb_wpg_localisation' );
function tcb_wpg_localisation() {
	load_plugin_textdomain( 'wp-glossary', false, plugin_dir_path(__FILE__) . 'lang/' );
}

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

// Check version update 
add_action( 'admin_init', 'tcb_wpg_version_update_check' );
function tcb_wpg_version_update_check(){
  $plugin          = get_plugin_data( __FILE__ );
  $in_file_version = $plugin->Version;
  $optionkey       = "tcb_vesion_check_glossary";
  $in_db_version   = get_option( $optionkey, 0 );


  $version_diff = version_compare( $in_db_version, $in_file_version );
  if( !$version_diff )
		return; // No change

  do_action( 'tcb_wpg_version_update', $in_file_version, $in_db_version );

  update_option( $optionkey, $in_file_version );
}
add_action( 'tcb_wpg_version_update', 'tcb_wpg_flush_rewrite_rules' );
function tcb_wpg_flush_rewrite_rules(){
	flush_rewrite_rules();
}

/** */
register_activation_hook( __FILE__, 'tcb_glossary_activation_hook' );
function tcb_glossary_activation_hook(){
	// Some discussion about how rewrite rule flushing needs to be done twice.
	flush_rewrite_rules();
	flush_rewrite_rules();
}
/** */
register_deactivation_hook( __FILE__, 'tcb_glossary_deactivation_hook' );
function tcb_glossary_deactivation_hook(){
	flush_rewrite_rules();
}
