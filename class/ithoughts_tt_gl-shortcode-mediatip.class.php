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
		$datas = apply_filters("ithoughts_tt_gl-split-args", $atts);

		$mediatipTypes = array("localimage","webimage","webvideo");
		if(!isset($datas["handled"]["mediatip-type"]))
			return $text;
		$mediatipType = $datas["handled"]["mediatip-type"];
		if(!in_array($mediatipType, $mediatipTypes))
			return $text;
		else
			parent::$scripts['qtip'] = true;

		$datas["attributes"]["class"] = "ithoughts_tooltip_glossary-mediatip".((isset($datas["attributes"]["class"]) && $datas["attributes"]["class"]) ? " ".$datas["attributes"]["class"] : "");
		$datas["linkAttrs"]["title"] = esc_attr($text);

		switch($mediatipType){
			case $mediatipTypes[0]:{
				$dat = ithoughts_toolbox::decode_json_attr($datas["handled"]["mediatip-content"]);
				$datas["attributes"]['data-mediatip-image'] = htmlentities($dat['url']);

				$datas["linkAttrs"]["href"] = $dat['link'];

				$linkArgs = ithoughts_toolbox::concat_attrs( $datas["linkAttrs"]);
				$linkElement   = '<a '.$linkArgs.'>' . $text . '</a>';

				$args = ithoughts_toolbox::concat_attrs( $datas["attributes"]);
				// Span that qtip finds
				$span = '<span '.$args.'>' . $linkElement . '</span>';
				return $span;
			} break;

			case $mediatipTypes[1]:{
				$datas["attributes"]['data-mediatip-image'] = htmlentities($datas["handled"]["mediatip-content"]);

				$datas["linkAttrs"]["href"] = 'javascript:void(0);';

				$linkArgs = ithoughts_toolbox::concat_attrs( $datas["linkAttrs"]);
				$linkElement   = '<a '.$linkArgs.'>' . $text . '</a>';

				$args = ithoughts_toolbox::concat_attrs( $datas["attributes"]);
				// Span that qtip finds
				$span = '<span '.$args.'>' . $linkElement . '</span>';
				return $span;
			} break;

			case $mediatipTypes[2]:{
				$datas["attributes"]['data-mediatip-html'] = $datas["handled"]["mediatip-content"];

				$datas["linkAttrs"]["href"] = 'javascript:void(0);';

				$linkArgs = ithoughts_toolbox::concat_attrs( $datas["linkAttrs"]);
				$linkElement   = '<a '.$linkArgs.'>' . $text . '</a>';

				$args = ithoughts_toolbox::concat_attrs( $datas["attributes"]);
				// Span that qtip finds
				$span = '<span '.$args.'>' . $linkElement . '</span>';
				return $span;
			} break;

			default:{
				return $text;
			}break;
		}
	}
}
