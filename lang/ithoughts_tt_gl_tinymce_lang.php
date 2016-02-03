<?php # -*- coding: utf-8 -*-

// This file is based on wp-includes/js/tinymce/langs/wp-langs.php

if ( ! defined( 'ABSPATH' ) )
    exit;

if ( ! class_exists( '_WP_Editors' ) )
    require( ABSPATH . WPINC . '/class-wp-editor.php' );

function ithoughts_tt_gl_tinymce_plugin_translation() {
    $strings = array(
        "add_tooltip" => __('Add a Tooltip', 'ithoughts-tooltip-glossary' ),
        "insert_tooltip" => __('Insert Tooltip', 'ithoughts-tooltip-glossary' ),
        "text" => __('Text', 'ithoughts-tooltip-glossary' ),
        "text_explain" => __('Text to display as link', 'ithoughts-tooltip-glossary' ),
        "glossary_term" => __('Glossary Term', 'ithoughts-tooltip-glossary' ),
        "term" => __('Term', 'ithoughts-tooltip-glossary' ),
        "tooltip" => __('Tooltip', 'ithoughts-tooltip-glossary' ),
        "content" => __('Content', 'ithoughts-tooltip-glossary' ),
        "content_explain" => __('Content to display into the tooltip. Supports HTML Markup', 'ithoughts-tooltip-glossary' ),
        "mediatip" => __('Mediatip', 'ithoughts-tooltip-glossary' ),
        "select_image" => __('Select an image', 'ithoughts-tooltip-glossary' ),
        
        
        "add_index" => __('Add a Glossary Index', 'ithoughts-tooltip-glossary' ),
        "insert_index" => __('Insert Glossary Index', 'ithoughts-tooltip-glossary' ),
        "list" => __('List', 'ithoughts-tooltip-glossary' ),
        "atoz" => __('A to Z', 'ithoughts-tooltip-glossary' ),
        "letters" => __('Letters', 'ithoughts-tooltip-glossary' ),
        "letters_explain" => __('Letters to be displayed in the list. If not specified, all letters will be displayed', 'ithoughts-tooltip-glossary' ),
        "columns" => __('Columns', 'ithoughts-tooltip-glossary' ),
        "columns_explain" => __('Number of columns to show for list', 'ithoughts-tooltip-glossary' ),
        "group" => __('Group', 'ithoughts-tooltip-glossary' ),
        "group_explain" => __('Group(s) to list', 'ithoughts-tooltip-glossary' ),
        "description" => __('Description', 'ithoughts-tooltip-glossary' ),
        "description_explain" => __("Description mode: Full/Excerpt/None", 'ithoughts-tooltip-glossary' ),
        "full" => __('Full', 'ithoughts-tooltip-glossary' ),
        "excerpt" => __('Excerpt', 'ithoughts-tooltip-glossary' ),
        "glossarytips" => __('Glossary Tooltips', 'ithoughts-tooltip-glossary' ),
    );
    $locale = _WP_Editors::$mce_locale;
    $translated = 'tinyMCE.addI18n("' . $locale . '.ithoughts_tt_gl_tinymce", ' . json_encode( $strings ) . ");\n";

     return $translated;
}

$strings = ithoughts_tt_gl_tinymce_plugin_translation();

