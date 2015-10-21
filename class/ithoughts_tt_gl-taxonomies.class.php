<?php
/**
 * ithoughts-tooltip-glossary Post Types
 */
class ithoughts_tt_gl_Taxonomies Extends ithoughts_tt_gl{
    public static $options;
    
 	public function __construct() {
        self::$options = get_option( 'wp_glossary_2' );
        self::$options["termtype"] = is_string(self::$options["termtype"]) ? self::$options["termtype"] : "glossary";
		add_action( 'init', array(&$this, 'register_taxonomies'), 0 );
	}

	public function register_taxonomies(){
		$labels = array(
			'name'              => __( 'Glossary Groups',         'ithoughts-tooltip-glossary' ),
			'singular_name'     => __( 'Glossary Group',          'ithoughts-tooltip-glossary' ),
			'search_items'      => __( 'Search Glossary Groups',  'ithoughts-tooltip-glossary' ),
			'all_items'         => __( 'All Glossary Groups',     'ithoughts-tooltip-glossary' ),
			'parent_item'       => __( 'Parent Glossary Group',   'ithoughts-tooltip-glossary' ),
			'parent_item_colon' => __( 'Parent Glossary Group:',  'ithoughts-tooltip-glossary' ),
			'edit_item'         => __( 'Edit Glossary Group',     'ithoughts-tooltip-glossary' ),
			'update_item'       => __( 'Update Glossary Group',   'ithoughts-tooltip-glossary' ),
			'add_new_item'      => __( 'Add New Glossary Group',  'ithoughts-tooltip-glossary' ),
			'new_item_name'     => __( 'New Glossary Group Name', 'ithoughts-tooltip-glossary' ),
		);
	
		register_taxonomy( 'ithoughts_tt_gllossarygroup', array( self::$options["termtype"] ), array(
			'hierarchical'      => false,
			'labels'            => $labels,
			'show_ui'           => true,
			'query_var'         => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => __('glossary/group', 'ithoughts-tooltip-glossary') ),
		) );
	} // register_taxonomies
} // ithoughts_tt_gl_Taxonomies
