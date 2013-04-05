<?php
/**
 * Plugin Name: WP Glossary
 * Plugin URI: http://wordpress.org/extend/plugins/wp-glossary/
 * Description: Build a glossary of terms and link your post content to it.
 * Author: TCBarrett
 * Version: 2.0
 * Author URI: http://www.tcbarrett.com/
 * Text Domain: wp-glossary
 * Domain Path: /lang/
 */
define( 'WPG_TEXTDOMAIN', 'wp-glossary' );

require_once( dirname(__FILE__) . '/class/wpg.class.php' );
require_once( dirname(__FILE__) . '/class/wpg-admin.class.php' );
require_once( dirname(__FILE__) . '/fn-lib.php' );

new WPG( dirname(__FILE__) );
new WPG_Admin();
