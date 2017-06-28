<?php

/**
 * @file Language file to interface with Javascript
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.5.0
 */

# -*- coding: utf-8 -*-

// This file is based on wp-includes/ext/tinymce/langs/wp-langs.php

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! class_exists( '_WP_Editors' ) )
	require( ABSPATH . WPINC . '/class-wp-editor.php' );

function ithoughts_tt_gl_tinymce_plugin_translation() {
	$strings = array(
		"add_index"			=> __('Add a Glossary Index', 'ithoughts-tooltip-glossary' ),
		"add_tooltip"		=> __('Add a Tooltip', 'ithoughts-tooltip-glossary' ),
		"remove_tooltip"	=> __('Remove a Tooltip', 'ithoughts-tooltip-glossary' ),
	);

	$locale = _WP_Editors::$mce_locale;
	$translated = 'tinyMCE.addI18n("' . $locale . '.ithoughts_tt_gl_tinymce", ' . json_encode( $strings ) . ");\n";

	return $translated;
}

$strings = ithoughts_tt_gl_tinymce_plugin_translation();

