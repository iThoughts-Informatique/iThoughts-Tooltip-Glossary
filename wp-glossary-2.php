<?php
/**
 * Plugin Name: WP Glossary 2
 * Plugin URI: http://wordpress.org/extend/plugins/wp-glossary-2/
 * Description: Build a glossary of terms and link your post content to it.
 * Author: TCBarrett
 * Version: 3.1.1.2
 * Author URI: http://www.tcbarrett.com/
 * Text Domain: wp-glossary-2
 * Domain Path: /lang/
 */
global $wpg2_glossary_count, $wpg2_doing_shortcode;
$wpg2_glossary_count = 0;
        

//if( function_exists('add_action') ):
require_once( dirname(__FILE__) . '/class/wpg2.class.php' );
require_once( dirname(__FILE__) . '/class/wpg2-admin.class.php' );
require_once( dirname(__FILE__) . '/fn-lib.php' );
require_once( dirname(__FILE__) . '/ajax.php' );

new wpg2( dirname(__FILE__) );
new wpg2_Admin( dirname(__FILE__) );

// add_action( 'admin_init', 'tcb_wpg2_test' );
function tcb_wpg2_test(){
        $options = get_option( 'wp_glossary_2' );
        $options["termtype"] = $options["termtype"] || "glossary";
	if( $prefix = $_GET['populate'] ):
		for( $i = 1; $i < 99; $i++ ):
			wp_insert_post( array('post_type'=>"glossary", 'post_title'=>$prefix . '-' . $i, 'post_status'=>'publish') );
		endfor;
	endif;
}
