<?php

class ithoughts_tt_gl_Shortcodes_tooltip extends ithoughts_tt_gl_interface{
	public function __construct() {
		// Shortcode
		add_shortcode( "ithoughts_tooltip_glossary-tooltip", array(&$this, "tooltip") );
		add_shortcode( "tooltip", array(&$this, "tooltip") );

		// Help functions..
		add_action( 'wp_insert_post_data',  array(&$this, 'parse_pseudo_links_to_shortcode'));
		add_action( 'edit_post',  array(&$this, 'convert_shortcodes'));
	}

	public function parse_pseudo_links_to_shortcode( $data ){
		$data['post_content'] = preg_replace('/<a\s+?data-tooltip-content=\\\\"(.+?)\\\\".*>(.*?)<\/a>/', '[ithoughts_tooltip_glossary-tooltip content="$1"]$2[/ithoughts_tooltip_glossary-tooltip]', $data['post_content']);
		return $data;
	}

	public function convert_shortcodes($post_id){
		$post = get_post($post_id);
		$post->post_content = preg_replace('/\[ithoughts_tooltip_glossary-tooltip(.*?)(?: content="(.+?)")(.*?)\](.+?)\[\/ithoughts_tooltip_glossary-tooltip\]/', '<a data-tooltip-content="$2" $1 $3>$4</a>', $post->post_content);
		return $post;
	}

	/** */
	public function tooltip( $atts, $text='' ){
		global $wpdb, $ithoughts_tt_gl_tooltip_count, $post, $ithoughts_tt_gl_doing_shortcode;
		$ithoughts_tt_gl_tooltip_count++;

		// Get iThoughts Tooltip Glossary options
		$opts = get_option( 'ithoughts_tt_gl', array() );

		// JS data to pass through to jQuery libraries
		$jsdata = array();

		// Let shortcode attributes override general settings
		foreach( $opts as $k => $v ):
		if( isset($atts[$k]) ):
		$jsdata[] = 'data-' . $k . '="' . trim( esc_attr($atts[$k]) ) . '"';
		$opts[$k] = trim( $atts[$k] );
		endif;
		endforeach;

		$content = (isset($atts["tooltip-content"]) && $atts["tooltip-content"]) ? $atts["tooltip-content"] : "";

		// Set text to default to content. This allows syntax like: [glossary]Cheddar[/glossary]
		if( empty($content) ) $content = $text;

		parent::$scripts['qtip'] = true;

		// qtip jquery data
		$jsdata[] = 'data-tooltip-content="' . str_replace('"', '\\"', $content) . '"';

		$link   = '<a href="javascript:void(0)" title="' . esc_attr($text) . '">' . $text . '</a>';
		// Span that qtip finds
		$class = "ithoughts_tooltip_glossary-tooltip".((isset($atts["class"]) && $atts["class"]) ? " ".$atts["class"] : "");
		$span = '<span class="'.$class.'" '.implode(' ',$jsdata).'>' . $link . '</span>';

		return $span;
	}
}
