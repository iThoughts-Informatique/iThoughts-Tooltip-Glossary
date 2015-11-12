<?php # -*- coding: utf-8 -*-

// This file is based on wp-includes/js/tinymce/langs/wp-langs.php

if ( ! defined( 'ABSPATH' ) )
    exit;

if ( ! class_exists( '_WP_Editors' ) )
    require( ABSPATH . WPINC . '/class-wp-editor.php' );

function my_custom_tinymce_plugin_translation() {
    $strings = array(
        "add_tooltip" => __('Add a Tooltip','ithoughts_tooltip_glossary'),
        "insert_tooltip" => __('Insert Tooltip','ithoughts_tooltip_glossary'),
        "text" => __('Text','ithoughts_tooltip_glossary'),
        "text_explain" => __('Text to display as link','ithoughts_tooltip_glossary'),
        "glossary_term" => __('Glossary Term','ithoughts_tooltip_glossary'),
        "term" => __('Term','ithoughts_tooltip_glossary'),
        "tooltip" => __('Tooltip','ithoughts_tooltip_glossary'),
        "content" => __('Content','ithoughts_tooltip_glossary'),
        "content_explain" => __('Content to display into the tooltip. Supports HTML Markup','ithoughts_tooltip_glossary'),
        "mediatip" => __('Mediatip','ithoughts_tooltip_glossary'),
        "select_image" => __('Select an image','ithoughts_tooltip_glossary'),
        
        
        "add_index" => __('Add a Glossary Index','ithoughts_tooltip_glossary'),
        "insert_index" => __('Insert Glossary Index','ithoughts_tooltip_glossary'),
        "list" => __('List','ithoughts_tooltip_glossary'),
        "atoz" => __('A to Z','ithoughts_tooltip_glossary'),
        "letters" => __('Letters','ithoughts_tooltip_glossary'),
        "letters_explain" => __('Letters to be displayed in the list. If not specified, all letters will be displayed','ithoughts_tooltip_glossary'),
        "columns" => __('Columns','ithoughts_tooltip_glossary'),
        "columns_explain" => __('Number of columns to show for list','ithoughts_tooltip_glossary'),
        "group" => __('Group','ithoughts_tooltip_glossary'),
        "group_explain" => __('Group(s) to list','ithoughts_tooltip_glossary'),
        "description" => __('Description','ithoughts_tooltip_glossary'),
        "description_explain" => __("Description mode: Full/Excerpt/None",'ithoughts_tooltip_glossary'),
        "full" => __('Full','ithoughts_tooltip_glossary'),
        "excerpt" => __('Excerpt','ithoughts_tooltip_glossary'),
        "glossarytips" => __('Glossary Tooltips','ithoughts_tooltip_glossary'),
    );
    $locale = _WP_Editors::$mce_locale;
    $translated = 'tinyMCE.addI18n("' . $locale . '.ithoughts_tt_gl_tinymce", ' . json_encode( $strings ) . ");\n";

     return $translated;
}

$strings = my_custom_tinymce_plugin_translation();

