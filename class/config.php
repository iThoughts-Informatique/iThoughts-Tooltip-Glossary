<?php

use \ithoughts\v6_0\LogLevel as LogLevel;
use \ithoughts\tooltip_glossary\Backbone as Backbone;

return array(
	'version'		=> array(
		'default'		=> '-1',
		'type'			=> 0,
	),
	'glossary-contenttype'		=> array(
		'default'		=> 'excerpt',
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
);