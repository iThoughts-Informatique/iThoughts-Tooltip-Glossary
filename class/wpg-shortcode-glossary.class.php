<?php
class WPG_Shortcodes Extends WPG{
	public function __construct() {
		add_shortcode( 'glossary', array($this, 'glossary') );
	}

	public function glossary( $atts, $content='' ){
		global $wpdb, $tcb_wpg_scripts, $wpg_glossary_count;

		$wpg_glossary_count++;

		// Global variable that tells WP to print related js files.
		$tcb_wpg_scripts = true;

		// Get WP Glossary options
		$glossary_options = get_option( 'wp_glossary' );

		// JS data to pass through to jQuery libraries
		$jsdata = array();

		// Let shortcode attributes override general settings
		foreach( $glossary_options as $k => $v ):
			if( isset($atts[$k]) ):
				$jsdata[] = 'data-' . $k . '="' . trim( esc_attr($atts[$k]) ) . '"';
				$glossary_options[$k] = trim( $atts[$k] );
			endif;
		endforeach;
		$tooltip_option   = isset($glossary_options['tooltips'])    ? $glossary_options['tooltips']    : 'excerpt';
		$qtipstyle        = isset($glossary_options['qtipstyle'])   ? $glossary_options['qtipstyle']   : 'cream';
		$linkopt          = isset($glossary_options['termlinkopt']) ? $glossary_options['termlinkopt'] : 'standard';

		

		extract( shortcode_atts( array(
			'id'   => 0,
			'slug' => '',
			'text' => '',
		), $atts) );

		// Set text to default content.
		if( empty($text) ) $text = $content;

		$glossary = false;
	
		// Trivial case
		if( !empty($id) ):
			$glossary = get_post( $id );
		else :
			if( empty($slug) ):
				if( empty($text) ):
					// No id, slug or text available to identify a glossary term, so return the original content.
					return $content;
				endif;
				$slug = sanitize_title( $text );
			endif;
			$slug      = strtolower($slug);
			$sqlstring = "SELECT ID FROM {$wpdb->posts} WHERE post_name='%s' AND post_type='glossary' LIMIT 1";
			$id        = $wpdb->get_var( $wpdb->prepare( $sqlstring, $slug ) );
			if( $id ):
				$glossary = get_post( $id );
			endif;
		endif;
		if( empty($glossary) ) return $text; // No glossary term found. Return the original text.

		setup_postdata( $glossary );
		$title = get_the_title();

		if( empty($text) ) $text = $title; // Glossary found, but no text supplied, so use the glossary term's title.

		$href    = get_permalink( $glossary->ID );
		$tooltip = '';
		$class   = 'glossary-hover';
		switch( $tooltip_option ):
			case 'full':
				$tooltip = ($qtipstyle=='off') ? strip_tags(get_the_content()) : apply_filters('the_content', get_the_content());
				break;
			case 'excerpt':
				$excerpt = apply_filters( 'get_the_excerpt', $glossary->post_excerpt );
				$tooltip = ($qtipstyle=='off') ? $excerpt : wpautop($excerpt);
				break;
			case 'off':
				$class = 'glossary-term';
				break;
		endswitch;

		$target = ($linkopt == 'blank') ? 'target="_blank"'  : '';
		$href   = ($linkopt != 'none')  ? 'href="'.$href.'"' : '';

		$link  = '<a class="' . $class . '" '.$target.' '.$href.' title="' . esc_attr($tooltip) . '" '.implode(' ',$jsdata).'>' . $text . '</a>';
		wp_reset_postdata();
		return '<span class="wp-glossary">' . $link . '</span>'; 
	}
}
