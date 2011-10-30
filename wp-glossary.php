<?php
/*
Plugin Name: WP Glossary
Plugin URI: http://wordpress.org/extend/plugins/wp-glossary/
Description: Build a glossary of terms and link your post content to it.
Author: TCBarrett
Version: 0.1
Author URI: http://www.tcbarrett.com
*/
define( 'GLOSARYPLUGINDIR', dirname( __FILE__ ) );
define( 'GLOSARYPLUGINURL', plugin_dir_url( __FILE__ ) );

include_once( GLOSARYPLUGINDIR . '/glossary-posttype.php' );
include_once( GLOSARYPLUGINDIR . '/glossary-shortcode.php' );
