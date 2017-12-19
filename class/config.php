<?php

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );
	wp_die( 'Forbidden' );// Exit if accessed directly
}

use \ithoughts\v6_0\LogLevel as LogLevel;
use \ithoughts\tooltip_glossary\Backbone as Backbone;

require_once( $this->base_class_path . '/shortcode/index/class-glosseslist.php' );
use ithoughts\tooltip_glossary\shortcode\index\GlossesList as GlossesList;

require_once( $this->base_class_path . '/shortcode/tip/class-gloss.php' );
use ithoughts\tooltip_glossary\shortcode\tip\Gloss as Gloss;

return array(
	'version'		=> array(
		'default'		=> '-1',
		'type'			=> 0,
	),
	'gloss-contenttype'		=> array(
		'default'		=> Gloss::GLOSS_MODE_EXCERPT,
		'type'			=> Backbone::SERVER_OVR | Backbone::CLIENT_OVR,
	),
	'termscomment'		=> array(
		'default'		=> false,
		'type'			=> 0,
	),
	'termtype'		=> array(
		'default'		=> 'glossary',
		'type'			=> 0,
	),
	'grouptype'		=> array(
		'default'		=> 'group',
		'type'			=> 0,
	),
	'qtipstyle'		=> array(
		'default'		=> 'cream',
		'type'			=> Backbone::CLIENT_OVR,
	),
	'termlinkopt'	=> array(
		'default'		=> 'standard',
		'type'			=> Backbone::SERVER_OVR,
	),
	'qtiptrigger'	=> array(
		'default'		=> 'click',
		'type'			=> Backbone::CLIENT_OVR,
	),
	'qtipshadow'	=> array(
		'default'		=> true,
		'type'			=> Backbone::CLIENT_OVR,
	),
	'qtiprounded'	=> array(
		'default'		=> false,
		'type'			=> Backbone::CLIENT_OVR,
	),
	'staticterms'	=> array(
		'default'		=> false,
		'type'			=> 0,
	),
	'forceloadresources'	=> array(
		'default'		=> false,
		'type'			=> 0,
	),
	'verbosity'	=> array(
		'default'		=> LogLevel::ERROR,
		'type'			=> 0,
	),
	'anim_in'		=> array(
		'default'		=> 'none',
		'type'			=> Backbone::CLIENT_OVR,
	),
	'anim_out'		=> array(
		'default'		=> 'none',
		'type'			=> Backbone::CLIENT_OVR,
	),
	'anim_time'		=> array(
		'default'		=> 500,
		'type'			=> Backbone::CLIENT_OVR,
	),
	'custom_styles_path'	=> array(
		'default'		=> null,
		'type'			=> 0,
	),
	'lists_size'			=> array(
		'default'		=> -1,
		'type'			=> Backbone::SERVER_OVR,
	),
	'exclude_search'	=> array(
		'default'		=> false,
		'type'			=> 0,
	),
	// NEW in 4.0.0
	'use_cdn'		=> array(
		'default'		=> false,
		'type'			=> 0,
	),
	'glossary-index'		=> array(
		'default'		=> false,
		'type'			=> 0,
	),
	'list-contenttype'		=> array(
		'default'		=> GlossesList::LIST_MODE_TIP,
		'type'			=> Backbone::SERVER_OVR,
	),
);