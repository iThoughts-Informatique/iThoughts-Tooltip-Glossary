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
			'supports'             => array( 'title', 'editor', 'thumbnail', 'author', 'excerpt' ),
			'labels' => array(
				'name'               => __( 'Glossary Terms',                   'wp-glossary' ),
				'singular_name'      => __( 'Glossary Term',                    'wp-glossary' ),
				'add_new'            => __( 'Add New Term',                     'wp-glossary' ),
				'add_new_item'       => __( 'Add New Glossary Term',            'wp-glossary' ),
				'edit_item'          => __( 'Edit Glossary Term',               'wp-glossary' ),
				'new_item'           => __( 'Add New Glossary Term',            'wp-glossary' ),
				'view_item'          => __( 'View Glossary Term',               'wp-glossary' ),
				'search_items'       => __( 'Search Glossary Terms',            'wp-glossary' ),
				'not_found'          => __( 'No Glossary Terms found',          'wp-glossary' ),
				'not_found_in_trash' => __( 'No Glossary Terms found in trash', 'wp-glossary' )
			),
			'register_meta_box_cb' => 'tcb_glossary_meta_boxes',
			'rewrite'              => array('slug' => __('glossary', 'wp-glossary')), // Permalinks format

		)
	);
}

function tcb_glossary_meta_boxes(){
	add_meta_box( 'tcbwpg_references', __('Glossary Term Reference', 'wp-glossary'),  'tcb_glossary_mb_references', 'glossary', 'normal', 'high' );
}

function tcb_glossary_mb_references(){
	global $post;

	if( $reference = get_post_meta( $post->ID, 'tcbwpg_reference', $single=true ) ) :
		if( empty($reference) ) $reference = array();
		extract( shortcode_atts(array('title'=>'', 'link'=>''), $reference) );
	endif;
	
	echo '<label class="tcbwpg-admin">' . __('Title:','wp-glossary') . ' <input name="tcbwpg_reference_title" size="30" value="' . $title . '" /></label><br>';
	echo '<label class="tcbwpg-admin">' . __('Link:','wp-glossary') . ' <input name="tcbwpg_reference_link" size="50" value="' . $link . '" /></label>';
	wp_nonce_field( plugin_basename(__FILE__), 'glossary_edit_nonce' );
}

add_action( 'save_post', 'tcb_wpg_save_meta', 10, 2 );
function tcb_wpg_save_meta( $post_id, $post ){
	$slug = 'glossary';

	$_POST += array( "{$slug}_edit_nonce"=>'' );

	if( $slug != $_POST['post_type'] )
		return;

	if( !current_user_can('edit_post', $post_id) )
		return;

	if( wp_is_post_revision($post) )
		return;

	if( !wp_verify_nonce($_POST["{$slug}_edit_nonce"], plugin_basename(__FILE__)) )
		return;

	$title = $_POST['tcbwpg_reference_title'];
	$link  = $_POST['tcbwpg_reference_link'];

	$title = trim( $title );
	$link  = trim( $link );
	if( $link ) :
		if( !preg_match('/^http/', $link) )
			$link = 'http://' . $link;
		if( filter_var($link, FILTER_VALIDATE_URL) === FALSE ) 
			$link = '';
	endif;

	$reference = array( 'title'=>$title, 'link'=>$link );
	error_log( print_r($reference,1) );
	update_post_meta( $post_id, 'tcbwpg_reference', $reference );
	return $post_id;
}

add_filter( 'the_content', 'tcb_wpg_term_references' );
function tcb_wpg_term_references( $content ){
	global $post;
	if( is_single() && 'glossary'==get_post_type() ) :
		if( $reference = get_post_meta($post->ID, 'tcbwpg_reference', $single=true) ):
			extract( $reference );
			if( empty($title) && empty($link) )
				return $content;
			if( empty($title) )
				$title = $link;
			if( $link ) 
				$title = '<a class="glossary-reference-link" target="_blank" href="' . $link . '">' . $title . '</a>';
			$content .= '<div class="glossary-references"><h4>' . __('Reference:', 'wp-glossary') . ' ' . $title . '</h4></div>';
		endif;
	endif;
	return $content;
}
