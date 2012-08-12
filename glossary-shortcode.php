<?php
/**
 * Glossary shortcode
 *
 * Links post content to glossary terms, using a varierty of glosssary attributes.
 */
add_shortcode( 'glossary', 'tcb_glossary_handle_shortcode' );
function tcb_glossary_handle_shortcode( $atts, $content='' ){
	global $wpdb, $post, $tcb_wpg_scripts;

	// Global variable that tells WP to print related js files.
	$tcb_wpg_scripts = true;

	extract( shortcode_atts( array(
	 'id'   => 0,
	 'slug' => '',
	 'text' => '',
	), $atts) );

	// Set text to default content.
	if ( empty( $text ) ) $text = $content;

	// Trivial case
	if ( !empty( $id ) ){
		$post = get_post( $id );
	}
	else {
		if ( empty( $slug ) ){
			if ( empty( $text ) ){
				// No id, slug or text available to identify a glossary term, so return the original content.
				return $content;
			}
			$slug = sanitize_title( $text );
		}
		$slug = strtolower($slug);
		$id   = $wpdb->get_var( $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type = 'glossary' LIMIT 1", $slug ) );
		$post = get_post( $id );
	}
	if ( empty( $post ) ) return $text; // No glossary term found. Return the original text.

	setup_postdata( $post );
	$title = get_the_title();

	if ( empty( $text ) ) $text = $title; // Glossary found, but no text supplied, so use the glossary term's title.
	
	$href    = get_permalink();
	//$excerpt = apply_filters( 'the_excerpt', $glossaryterm->post_excerpt );
	$excerpt = get_the_excerpt();
	$tooltip = $excerpt ? $excerpt : strip_tags( get_the_content() );

	$link  = '<a class="glossary-hover" href="' . $href . '" title="' . esc_attr($tooltip) . '">' . $text . '</a>';
	wp_reset_postdata();
	return '<span class="wp-glossary">' . $link . $hover . '</span>'; // Homemade tooltips

	// Homemade tooltips
	//$link = '<span style="display:none;" class="glossary-tooltip">'.$excerpt.'</span><a class="glossary-hover" href="'.$href.'" title="'.$title.'">'.$text.'</a>';
	//return $link;
}
