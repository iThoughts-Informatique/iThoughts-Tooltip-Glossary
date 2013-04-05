<?php
class WPG_Shortcodes Extends WPG{
	function __construct() {
		add_shortcode( 'glossary', array($this, 'glossary') );
	}

	function glossary( $atts, $content='' ){
		global $wpdb, $post, $tcb_wpg_scripts;

		// Global variable that tells WP to print related js files.
		$tcb_wpg_scripts = true;

		// Get WP Glossary opions
		$glossary_options = get_option( 'wp_glossary' );
		$tooltip_option   = $glossary_options['tooltips'] ? $glossary_options['tooltips'] : 'excerpt';
		extract( shortcode_atts( array(
			'id'   => 0,
			'slug' => '',
			'text' => '',
		), $atts) );

		// Set text to default content.
		if ( empty( $text ) ) $text = $content;
	
		// Trivial case
		if ( !empty( $id ) ):
			$post = get_post( $id );
		else :
			if ( empty( $slug ) ):
				if ( empty( $text ) ):
					// No id, slug or text available to identify a glossary term, so return the original content.
					return $content;
				endif;
				$slug = sanitize_title( $text );
			endif;
			$slug = strtolower($slug);
			$id   = $wpdb->get_var( $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type = 'glossary' LIMIT 1", $slug ) );
			$post = get_post( $id );
		endif;
		if ( empty( $post ) ) return $text; // No glossary term found. Return the original text.

		setup_postdata( $post );
		$title = get_the_title();

		if ( empty( $text ) ) $text = $title; // Glossary found, but no text supplied, so use the glossary term's title.

		$href    = get_permalink();
		$tooltip = '';
		$class   = 'glossary-hover';
		switch( $tooltip_option ):
			case 'full':
				$tooltip = strip_tags( get_the_content() );
				break;
			case 'excerpt':
				$tooltip = get_the_excerpt();
				break;
			case 'off':
				$class = 'glossary-term';
				break;
		endswitch;
	
		$link  = '<a class="' . $class . '" href="' . $href . '" title="' . esc_attr($tooltip) . '">' . $text . '</a>';
		wp_reset_postdata();
		return '<span class="wp-glossary">' . $link . '</span>'; // Homemade tooltips

		// Homemade tooltips
	}
}
