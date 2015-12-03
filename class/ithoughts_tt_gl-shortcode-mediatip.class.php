<?php

class ithoughts_tt_gl_Shortcodes_mediatip extends ithoughts_tt_gl_interface{
	public function __construct() {
		// Shortcode
		add_shortcode( "ithoughts_tooltip_glossary-mediatip", array(&$this, "mediatip") );
		add_shortcode( "mediatip", array(&$this, "mediatip") );

		// Help functions..
		add_action( 'wp_insert_post_data',  array(&$this, 'parse_pseudo_links_to_shortcode'));
		add_action( 'edit_post',  array(&$this, 'convert_shortcodes'));
	}

	public function parse_pseudo_links_to_shortcode( $data ){
		$data['post_content'] = preg_replace('/<a(?=[^>]*data-type="ithoughts-tooltip-glossary-mediatip")(.*?)(?:(?:(?:data-type="([^"]*)")|(?:data-link="([^"]*)")|(?:data-image="([^"]*)")|(?:data-imageid="([^"]*)"))\s*)+(.*?)>(.*?)<\/a>/', '  [ithoughts_tooltip_glossary-mediatip link="$3" image="$4" imageid="$5" $1 $6]$7[/ithoughts_tooltip_glossary-mediatip]', $data['post_content']);
		return $data;
	}

	public function convert_shortcodes($post_id){
		$post = get_post($post_id);
		$post->post_content = preg_replace('/\[ithoughts_tooltip_glossary-mediatip(.*?)(?:(?:(?:link="([^"]*)")|(?:image="([^"]*)")|(?:imageid="([^"]*)"))\s*)+(.*?)\](.*?)\[\/ithoughts_tooltip_glossary-mediatip\]/', '<a data-type="ithoughts-tooltip-glossary-mediatip" data-link="$2" data-image="$3" data-imageid="$4" $1 $5]$6</a>', $post->post_content);
		return $post;
	}

	/** */
	public function mediatip( $atts, $text='' ){
		global $wpdb, $ithoughts_tt_gl_tooltip_count, $post, $ithoughts_tt_gl_doing_shortcode;
		$ithoughts_tt_gl_tooltip_count++;

		// Get iThoughts Tooltip Glossary options
		$opts = get_option( 'ithoughts_tt_gl', array() );

		// JS data to pass through to jQuery libraries
		$jsdata = array();

		// Let shortcode attributes override general settings
		foreach( $opts as $k => $v ){
			if( isset($atts[$k]) ){
				$jsdata[] = 'data-' . $k . '="' . trim( esc_attr($atts[$k]) ) . '"';
				$opts[$k] = trim( $atts[$k] );
			}
		}
		$linkopt          = isset($opts['termlinkopt']) ? $opts['termlinkopt'] : 'standard';

		$mediatipTypes = array("localimage","webimage","webvideo");
		if(!isset($atts["mediatip-type"]))
			return $text;
		if(!in_array($atts["mediatip-type"], $mediatipTypes))
			return $text;
		
		$mediatipType = $atts["mediatip-type"];
		if(array_search($mediatipType, $mediatipTypes) !== false)
			parent::$scripts['qtip'] = true;
		switch($mediatipType){
			case $mediatipTypes[0]:{
				$dat = ithoughts_tt_gl_decode_json_attr($atts["mediatip-content"]);
				$jsdata[] = 'data-mediatip-image="' . htmlentities($dat['url']) . '"';

				$linkElement   = '<a href="' . $dat['link']. '" title="' . esc_attr($text) . '">' . $text . '</a>';
				// Span that qtip finds
				$span = '<span class="ithoughts_tooltip_glossary-mediatip" '.implode(' ',$jsdata).'>' . $linkElement . '</span>';
				return $span;
			} break;

			case $mediatipTypes[1]:{
				$jsdata[] = 'data-mediatip-image="' . htmlentities($atts["mediatip-content"]) . '"';

				$linkElement   = '<a href="javascript:void(0);" title="' . esc_attr($text) . '">' . $text . '</a>';
				// Span that qtip finds
				$span = '<span class="ithoughts_tooltip_glossary-mediatip" '.implode(' ',$jsdata).'>' . $linkElement . '</span>';
				return $span;
			} break;

			case $mediatipTypes[2]:{
				$jsdata[] = 'data-mediatip-html="' . str_replace('"', '&quot;', $atts["mediatip-content"]) . '"';

				$linkElement   = '<a href="javascript:void(0);" title="' . esc_attr($text) . '">' . $text . '</a>';
				// Span that qtip finds
				$span = '<span class="ithoughts_tooltip_glossary-mediatip" '.implode(' ',$jsdata).'>' . $linkElement . '</span>';
				return $span;
			} break;

			default:{
				return $text;
			}break;
		}
	}
}
