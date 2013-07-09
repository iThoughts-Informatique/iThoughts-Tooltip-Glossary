<?php
add_action( 'wp_ajax_nopriv_wpg_get_term_details', 'wp_ajax_nopriv_wpg_get_term_details' );
add_action( 'wp_ajax_wpg_get_term_details',        'wp_ajax_nopriv_wpg_get_term_details' );
function wp_ajax_nopriv_wpg_get_term_details(){

	// Sanity and security checks:
	//  - we have a termid (post id)
  //  - it is post of type 'glossary' (don't display other post types!)
	//  - it has status 'publish' (only display published terms)
	$term = null;
	if( isset($_POST['termid']) && $termid=$_POST['termid'] ):
		$termid = intval( $termid );
		$termob = get_post( $termid );
		if( get_post_type($termob) && get_post_type($termob) == 'glossary' && $termob->post_status == 'publish' ):
			$term = $termob;
		endif;
	endif;

	// Fail if no term found (either due to bad set up, or someone trying to be sneaky!)
	if( !$term )
		wp_send_json_error();

	// Title
	$title = $term->post_title;

	// Don't display password protected items.
	if( post_password_required($termid) ):
		wp_send_json_success( array('title'=>$title, 'content'=>'<p>Protected glossary term</p>') );
	endif;

	// Content
	switch( $_POST['content'] ):
		case 'excerpt':
			if( has_excerpt($termid) ):
				$content = apply_filters( 'get_the_excerpt', $termob->post_excerpt );
				$content = wpautop( $content );
			endif;
			break;
	endswitch;

	// No content found, assume due to clash in settings and fetch full post content just in case.
	if( empty($content) )
		$content = apply_filters( 'the_content', $term->post_content );
			
	wp_send_json_success( array('title'=>$title, 'content'=>$content) );
}
