<?php

/**
 * @file Include file for plugin
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.6.3
 */


/*
Plugin Name: iThoughts Tooltip Glossary
Plugin URI:  http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Description: Create beautiful tooltips for descriptions or glossary terms easily
Version:     2.6.3
Author:      Gerkin
License:     GPLv2 or later
Text Domain: ithoughts-tooltip-glossary
Domain Path: /lang
*/

if ( ! defined( 'ABSPATH' ) ) { 
    exit; // Exit if accessed directly
}

require_once( dirname(__FILE__) . '/submodules/iThoughts-WordPress-Plugin-Toolbox/class/includer.php' );
require_once( dirname(__FILE__) . '/class/Backbone.class.php' );
ithoughts\tooltip_glossary\Backbone::get_instance( __FILE__ );
if(is_admin()){
	require_once( dirname(__FILE__) . '/class/Admin.class.php' );
	ithoughts\tooltip_glossary\Admin::get_instance();
}
