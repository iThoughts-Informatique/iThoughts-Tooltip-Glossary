<?php

/**
 * @file Include file for plugin
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 3.0.2
 */


/*
Plugin Name: iThoughts Tooltip Glossary
Plugin URI:  http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Description: Create beautiful tooltips for descriptions or glossary terms easily
Version:     3.0.2
Author:      Gerkin
License:     GPLv3
Text Domain: ithoughts-tooltip-glossary
Domain Path: /lang
*/

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly
}

require_once( dirname( __FILE__ ) . '/submodules/iThoughts-WordPress-Plugin-Toolbox/includer.php' );
require_once( dirname( __FILE__ ) . '/class/class-backbone.php' );
ithoughts\tooltip_glossary\Backbone::get_instance( __FILE__ );
if ( is_admin() ) {
	require_once( dirname( __FILE__ ) . '/class/class-admin.php' );
	ithoughts\tooltip_glossary\Admin::get_instance();
}
