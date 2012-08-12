<?php
/**
 * Glossary shortcode
 *
 * Links post content to glossary terms, using a varierty of glosssary attributes.
 */
add_shortcode( 'glossary', 'tcb_glossary_handle_shortcode' );
function tcb_glossary_handle_shortcode( $atts, $content='' ){
	global $wpdb;

	extract( shortcode_atts( array(
	 'id'   => 0,
	 'slug' => '',
	 'text' => '',
	), $atts) );

	// Set text to default content.
	if ( empty( $text ) ) $text = $content;

	// Trivial case
	if ( !empty( $id ) ){
		$glossaryterm = get_post($id);
	}
	else {
		if ( empty( $slug ) ){
			if ( empty( $text ) ){
				// No id, slug or text available to identify a glossary term, so return the original content.
				return $content;
			}
			$slug = sanitize_title( $text );
		}
		$slug         = strtolower($slug);
		$glossaryterm = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->posts} WHERE post_name = %s AND post_type = 'glossary'", $slug ) );
	}
	if ( empty( $glossaryterm ) ) return $text; // No glossary term found. Return the original text.
	if ( empty( $text ) )         $text = $glossaryterm->post_title; // Glossary found, but no text supplied, so use the glossary term's title.
	
	$href    = get_permalink( $glossaryterm->ID );
	$title   = $glossaryterm->post_title;
	$excerpt = apply_filters( 'the_excerpt', $glossaryterm->post_excerpt );
	$tooltip = strip_tags( $glossaryterm->post_content );

	//$link = '<span style="display:none;" class="glossary-tooltip">'.$excerpt.'</span><a class="glossary-hover" href="'.$href.'" title="'.$title.'">'.$text.'</a>';
	$link  = '<a class="glossary-hover" href="' . $href . '" title="' . esc_attr($tooltip) . '">' . $text . '</a>';
	//$link  = '<a class="glossary-hover" href="' . $href . '" title="' . $title . '">' . $text . '</a>';
	//$hover = '<span class="glossary-hover-text">' . apply_filters('the_content', $glossaryterm->post_content) . '</span>';
	return '<span class="wp-glossary">' . $link . $hover . '</span>';
}
