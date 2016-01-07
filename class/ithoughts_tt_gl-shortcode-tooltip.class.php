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
		$datas = apply_filters("ithoughts_tt_gl-split-args", $atts);

		$content = (isset($datas["handled"]["tooltip-content"]) && $datas["handled"]["tooltip-content"]) ? $datas["handled"]["tooltip-content"] : "";

		// Set text to default to content. This allows syntax like: [glossary]Cheddar[/glossary]
		if( empty($content) ) $content = $text;

		parent::$scripts['qtip'] = true;

		// qtip jquery data
		$datas["attributes"]["data-tooltip-content"] = do_shortcode($content);
		
		$datas["linkAttrs"]["href"] = "javascript:void(0)";
		$datas["linkAttrs"]["title"] = esc_attr($text);

		$linkArgs = ithoughts_toolbox::concat_attrs( $datas["linkAttrs"]);
		$link   = '<a '.$linkArgs.'>' . $text . '</a>';
		// Span that qtip finds
		$datas["attributes"]["class"] = "ithoughts_tooltip_glossary-tooltip".((isset($datas["attributes"]["class"]) && $datas["attributes"]["class"]) ? " ".$datas["attributes"]["class"] : "");
		$args = ithoughts_toolbox::concat_attrs( $datas["attributes"]);
		$span = '<span '.$args.'>' . $link . '</span>';

		return $span;
	}
}
