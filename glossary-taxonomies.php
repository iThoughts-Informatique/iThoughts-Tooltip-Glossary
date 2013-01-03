<?php
add_action( 'init', 'tcb_wpg_register_taxonomy_glossary_group', 0 );
function tcb_wpg_register_taxonomy_glossary_group() {
  $labels = array(
    'name'              => __( 'Glossary Groups',         'wp-glossary' ),
    'singular_name'     => __( 'Glossary Group',          'wp-glossary' ),
    'search_items'      => __( 'Search Glossary Groups',  'wp-glossary' ),
    'all_items'         => __( 'All Glossary Groups',     'wp-glossary' ),
    'parent_item'       => __( 'Parent Glossary Group',   'wp-glossary' ),
    'parent_item_colon' => __( 'Parent Glossary Group:',  'wp-glossary' ),
    'edit_item'         => __( 'Edit Glossary Group',     'wp-glossary' ),
    'update_item'       => __( 'Update Glossary Group',   'wp-glossary' ),
    'add_new_item'      => __( 'Add New Glossary Group',  'wp-glossary' ),
    'new_item_name'     => __( 'New Glossary Group Name', 'wp-glossary' ),
  );

  register_taxonomy( 'wpglossarygroup', array( 'glossary' ), array(
    'hierarchical' => false,
    'labels'       => $labels,
    'show_ui'      => true,
    'query_var'    => true,
    'rewrite'      => array( 'slug' => 'glossary-group' ),
  ) );
}
