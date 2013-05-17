<?php
/**
 * WP-Glossary Post Types
 */
class WPG_Taxonomies Extends WPG{
 	public function __construct() {
		add_action( 'init', array(&$this, 'register_taxonomies'), 0 );
	}

	public function register_taxonomies(){
		$labels = array(
			'name'              => __( 'Glossary Groups',         WPG_TEXTDOMAIN ),
			'singular_name'     => __( 'Glossary Group',          WPG_TEXTDOMAIN ),
			'search_items'      => __( 'Search Glossary Groups',  WPG_TEXTDOMAIN ),
			'all_items'         => __( 'All Glossary Groups',     WPG_TEXTDOMAIN ),
			'parent_item'       => __( 'Parent Glossary Group',   WPG_TEXTDOMAIN ),
			'parent_item_colon' => __( 'Parent Glossary Group:',  WPG_TEXTDOMAIN ),
			'edit_item'         => __( 'Edit Glossary Group',     WPG_TEXTDOMAIN ),
			'update_item'       => __( 'Update Glossary Group',   WPG_TEXTDOMAIN ),
			'add_new_item'      => __( 'Add New Glossary Group',  WPG_TEXTDOMAIN ),
			'new_item_name'     => __( 'New Glossary Group Name', WPG_TEXTDOMAIN ),
		);
	
		register_taxonomy( 'wpglossarygroup', array( 'glossary' ), array(
			'hierarchical'      => false,
			'labels'            => $labels,
			'show_ui'           => true,
			'query_var'         => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => __('glossary/group', WPG_TEXTDOMAIN) ),
		) );
	} // register_taxonomies
} // WPG_Taxonomies
