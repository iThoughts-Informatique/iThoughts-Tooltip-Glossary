<?php
/*
Plugin Name: iThoughts Tooltip Glossary
Plugin URI:  http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Description: Create beautiful tooltips for descriptions or glossary terms easily
Version:     2.0.2
Author:      Gerkin
License:     GPLv2 or later
Text Domain: ithoughts_tooltip_glossary
Domain Path: /lang
*/

global $ithoughts_tt_gl_glossary_count, $ithoughts_tt_gl_doing_shortcode;
$ithoughts_tt_gl_glossary_count = 0;
        

//if( function_exists('add_action') ):
require_once( dirname(__FILE__) . '/class/ithoughts_tt_gl.class.php' );
require_once( dirname(__FILE__) . '/class/ithoughts_tt_gl-admin.class.php' );
require_once( dirname(__FILE__) . '/fn-lib.php' );
require_once( dirname(__FILE__) . '/ajax.php' );

new ithoughts_tt_gl( dirname(__FILE__) );
new ithoughts_tt_gl_Admin( dirname(__FILE__) );

// add_action( 'admin_init', 'tcb_ithoughts_tt_gl_test' );
function tcb_ithoughts_tt_gl_test(){
        $options = get_option( 'ithoughts_tt_gl' );
        $options["termtype"] = $options["termtype"] || "glossary";
	if( $prefix = $_GET['populate'] ):
		for( $i = 1; $i < 99; $i++ ):
			wp_insert_post( array('post_type'=>"glossary", 'post_title'=>$prefix . '-' . $i, 'post_status'=>'publish') );
		endfor;
	endif;
}
