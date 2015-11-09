<?php
/**
 * ithoughts-tooltip-glossary Post Types
 */
class ithoughts_tt_gl_Taxonomies Extends ithoughts_tt_gl{
    public static $options;

    public function __construct() {
        self::$options = get_option( 'ithoughts_tt_gl' );
        self::$options["termtype"] = is_string(self::$options["termtype"]) ? self::$options["termtype"] : "glossary";
        self::$options["grouptype"] = is_string(self::$options["grouptype"]) ? self::$options["grouptype"] : "group";
        add_action( 'init', array(&$this, 'register_taxonomies'), 0 );
    }

    public function register_taxonomies(){
        $labels = array(
            'name'              => __( 'Glossary Groups',         'ithoughts_tooltip_glossary' ),
            'singular_name'     => __( 'Glossary Group',          'ithoughts_tooltip_glossary' ),
            'search_items'      => __( 'Search Glossary Groups',  'ithoughts_tooltip_glossary' ),
            'all_items'         => __( 'All Glossary Groups',     'ithoughts_tooltip_glossary' ),
            'parent_item'       => __( 'Parent Glossary Group',   'ithoughts_tooltip_glossary' ),
            'edit_item'         => __( 'Edit Glossary Group',     'ithoughts_tooltip_glossary' ),
            'update_item'       => __( 'Update Glossary Group',   'ithoughts_tooltip_glossary' ),
            'add_new_item'      => __( 'Add New Glossary Group',  'ithoughts_tooltip_glossary' ),
            'new_item_name'     => __( 'New Glossary Group Name', 'ithoughts_tooltip_glossary' ),
            'menu_name' => __('Glossary Groups', 'ithoughts_tooltip_glossary')
        );

        register_taxonomy( 'glossary_group', "glossary", array(
            'hierarchical'      => false,
            'labels'            => $labels,
            'show_ui'           => true,
            'query_var'         => true,
            'show_admin_column' => true,
            'rewrite'           => array( 'slug' => self::$options["termtype"].'/'.self::$options["grouptype"]),
        ) );
    } // register_taxonomies
} // ithoughts_tt_gl_Taxonomies
