<?php
/**
 * Glossary post type
 *
 * Post type to handle glossary terms.
 */
add_action( 'init', 'tcb_glossary_register_posttype_glossary' );
function tcb_glossary_register_posttype_glossary() {
  register_post_type( 'glossary',
    array(
      'public'               => true,
      'menu_position'        => 105,
			'has_archive'          => true,
      'supports'             => array( 'title', 'editor', 'thumbnail' ),
      'labels' => array(
        'name'               => __( 'Glossary Terms' ),
        'singular_name'      => __( 'Glossary Term' ),
        'add_new'            => __( 'Add New Term' ),
        'add_new_item'       => __( 'Add New Glossary Term' ),
        'edit_item'          => __( 'Edit Glossary Term' ),
        'new_item'           => __( 'Add New Glossary Term' ),
        'view_item'          => __( 'View Glossary Term' ),
        'search_items'       => __( 'Search Glossary Terms' ),
        'not_found'          => __( 'No Glossary Terms found' ),
        'not_found_in_trash' => __( 'No Glossary Terms found in trash' )
      ),
    )
  );
}
