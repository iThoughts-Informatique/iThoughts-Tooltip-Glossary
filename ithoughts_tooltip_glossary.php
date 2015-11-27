<?php
/*
Plugin Name: iThoughts Tooltip Glossary
Plugin URI:  http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Description: Create beautiful tooltips for descriptions or glossary terms easily
Version:     2.1.2
Author:      Gerkin
License:     GPLv2 or later
Text Domain: ithoughts_tooltip_glossary
Domain Path: /lang
*/

$ithoughts_tt_gl_scritpts = array();
require_once( dirname(__FILE__) . '/fn-lib.php' );
require_once( dirname(__FILE__) . '/class/ithoughts_tt_gl.class.php' );
new ithoughts_tt_gl( dirname(__FILE__) );
if(is_admin()){
	require_once( dirname(__FILE__) . '/class/ithoughts_tt_gl-admin.class.php' );
	new ithoughts_tt_gl_Admin();
}
