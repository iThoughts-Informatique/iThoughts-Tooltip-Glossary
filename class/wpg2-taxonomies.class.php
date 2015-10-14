<?php
/**
 * wp-glossary-2 Post Types
 */
class wpg2_Taxonomies Extends wpg2{
    public static $options;
    
 	public function __construct() {
        self::$options = get_option( 'wp_glossary_2' );
        self::$options["termtype"] = is_string(self::$options["termtype"]) ? self::$options["termtype"] : "glossary";
		add_action( 'init', array(&$this, 'register_taxonomies'), 0 );
	}

	public function register_taxonomies(){
		$labels = array(
			'name'              => __( 'Glossary Groups',         'wp-glossary-2' ),
			'singular_name'     => __( 'Glossary Group',          'wp-glossary-2' ),
			'search_items'      => __( 'Search Glossary Groups',  'wp-glossary-2' ),
			'all_items'         => __( 'All Glossary Groups',     'wp-glossary-2' ),
			'parent_item'       => __( 'Parent Glossary Group',   'wp-glossary-2' ),
			'parent_item_colon' => __( 'Parent Glossary Group:',  'wp-glossary-2' ),
			'edit_item'         => __( 'Edit Glossary Group',     'wp-glossary-2' ),
			'update_item'       => __( 'Update Glossary Group',   'wp-glossary-2' ),
			'add_new_item'      => __( 'Add New Glossary Group',  'wp-glossary-2' ),
			'new_item_name'     => __( 'New Glossary Group Name', 'wp-glossary-2' ),
		);
	
		register_taxonomy( 'wpg2lossarygroup', array( self::$options["termtype"] ), array(
			'hierarchical'      => false,
			'labels'            => $labels,
			'show_ui'           => true,
			'query_var'         => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => __('glossary/group', 'wp-glossary-2') ),
		) );
	} // register_taxonomies
} // wpg2_Taxonomies
