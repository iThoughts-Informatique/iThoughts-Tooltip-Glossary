<?php
/**
 * Plugin Name: WP Glossary
 * Plugin URI: http://wordpress.org/extend/plugins/wp-glossary/
 * Description: Build a glossary of terms and link your post content to it.
 * Author: TCBarrett
 * Version: 1.5.1
 * Author URI: http://www.tcbarrett.com/
 * Text Domain: wp-glossary
 * Domain Path: /lang/
 */
define( 'TCBWPGPLUGINDIR', dirname( __FILE__ ) );

include_once( TCBWPGPLUGINDIR . '/glossary-library.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-posttype.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-taxonomies.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-shortcode.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-term-list-shortcode.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-atoz-shortcode.php' );
include_once( TCBWPGPLUGINDIR . '/glossary-menu-options.php' );

add_action( 'pre_get_posts', 'tcb_wpg_amend_archive_query' );
function tcb_wpg_amend_archive_query( $query ){
	if( is_post_type_archive('glossary') ):
		$glossary_options = get_option( 'wp_glossary' );
		$archive          = $glossary_options['alphaarchive'] ? $glossary_options['alphaarchive'] : 'standard';
		if( $archive == 'alphabet' ):
			$query->set( 'orderby', 'title' );
			$query->set( 'order',   'ASC' );
			return;
		endif;
	endif;
}

add_action( 'plugins_loaded', 'tcb_wpg_localisation' );
function tcb_wpg_localisation() {
	load_plugin_textdomain( 'wp-glossary', false, dirname(plugin_basename(__FILE__)) . '/lang/' );
}

// Register tooltip scripts
add_action( 'init', 'tcb_wpg_register_scripts' );
function tcb_wpg_register_scripts(){
	wp_register_script( 'jquery-tooltip', plugins_url('js/jquery.tools.min.js', __FILE__), array('jquery') );
	wp_register_script( 'wp-glossary-js', plugins_url('js/wp-glossary.js',      __FILE__), array('jquery-tooltip') );
	wp_register_script( 'simple-ajax',    plugins_url('js/simple-ajax-form.js', __FILE__), array('jquery-form') );
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

// Admin scripts
add_action( 'admin_enqueue_scripts', 'tcb_wpg_admin_enqueue_scripts' );
function tcb_wpg_admin_enqueue_scripts(){
	wp_enqueue_script( 'simple-ajax' );
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
