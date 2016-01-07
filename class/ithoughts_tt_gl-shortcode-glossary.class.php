<?php

class ithoughts_tt_gl_Shortcodes_glossary extends ithoughts_tt_gl_interface{
	public function __construct() {
		// Shortcode
		add_shortcode( "ithoughts_tooltip_glossary-glossary", array(&$this, "glossary") );
		add_shortcode( "glossary", array(&$this, "glossary") );

		// Help functions..
		add_action( 'save_post',  array(&$this, 'save_post_check_for_glossary_usage'), 20, 2 );
		add_action( 'wp_insert_post_data',  array(&$this, 'parse_pseudo_links_to_shortcode'));
		add_action( 'edit_post',  array(&$this, 'convert_shortcodes'));
		add_action( 'get_header', array(&$this, 'glossary_usage_reset_for_post') );
		add_action( 'wp_footer',  array(&$this, 'glossary_remove_update_marker') );
	}

	public function parse_pseudo_links_to_shortcode( $data ){
		$data['post_content'] = preg_replace('/<a\s+?data-ithoughts_tt_gl-glossary-slug=\\\\"(.+?)\\\\".*>(.*?)<\/a>/', '[ithoughts_tooltip_glossary-glossary slug="$1"]$2[/ithoughts_tooltip_glossary-glossary]', $data['post_content']);
		return $data;
	}

	public function convert_shortcodes($post_id){
		$post = get_post($post_id);
		$post->post_content = preg_replace('/\[ithoughts_tooltip_glossary-glossary(.*?)(?: slug="(.+?)")(.*?)\](.+?)\[\/ithoughts_tooltip_glossary-glossary\]/', '<a data-ithoughts_tt_gl-glossary-slug="$2" $1 $3>$4</a>', $post->post_content);
		return $post;
	}

	/** 
	 * If post has glossary shortcode in it when it is saved, mark the post as needing be updated
	 */
	public function save_post_check_for_glossary_usage( $post_id, $post ){
		$glossary_options = get_option( 'ithoughts_tt_gl' );
		$termusage        = isset($glossary_options['termusage'] )  ? $glossary_options['termusage']   : 'on';

		if( $termusage != 'on' )
			return $post_id;

		if( !wp_is_post_revision($post_id)  ){
			if( strpos($post->post_content,'[ithoughts_tooltip_glossary-glossary ') !== false || strpos($post->post_content,'[ithoughts_tooltip_glossary-glossary]') !== false ){
				update_post_meta( $post_id, 'ithoughts_tt_gl_update_term_usage', current_time('mysql') );
			} else {
				if(get_post_meta( $post_id, 'ithoughts_tt_gl_has_terms', $single=true) ){
					// Also posts that used to have terms should be updated.
					delete_post_meta( $post_id, 'ithoughts_tt_gl_has_terms' );
					update_post_meta( $post_id, 'ithoughts_tt_gl_update_term_usage', current_time('mysql') );
				}
			}
		}
		return $post;
	}

	/** 
	 * If current post (or page or whatever) has been marked as needing updating,
	 *  then delete all the meta entries for this post.
	 * These are stored on the glossary term meta
	 */
	public function glossary_usage_reset_for_post(){
		global $post;
		if( is_singular() && get_post_meta( $post->ID, 'ithoughts_tt_gl_update_term_usage') ):
		// Find all glossary terms that have this post noted.
		$args = array(
			'post_type'   => "glossary",
			'numberposts' => -1,
			'post_status' => 'publish',
			'meta_query'  => array( array(
				'key'   => 'ithoughts_tt_gl_term_used',
				'value' => $post->ID,
				'type'  => 'DECIMAL'
			) )
		);
		$terms = get_posts( $args );
		foreach( $terms as $term ):
		// Delete the meta entry
		delete_post_meta( $term->ID, 'ithoughts_tt_gl_term_used', $post->ID );
		endforeach;
		endif;
	}

	/** */
	public function glossary_remove_update_marker(){
		/*
        global $post;
        if( is_singular() && get_post_meta( $post->ID, 'ithoughts_tt_gl_update_term_usage') ):
        delete_post_meta( $post->ID, 'ithoughts_tt_gl_update_term_usage' );
        endif;*/
	}

	/** */
	public function glossary( $atts, $text='' ){

		if(!isset($atts['glossary-id']) || !$atts['glossary-id'])
			return $text;
		$id = $atts['glossary-id'];
		return apply_filters("ithoughts_tt_gl_get_glossary_term_element", $id, $text, $atts);
	}
}

class ithoughts_tt_gl_glossary_filters extends ithoughts_tt_gl_interface{
	public function __construct(){
		add_filter("ithoughts_tt_gl_get_glossary_term_element", array($this, "ithoughts_tt_gl_get_glossary_term_element"), 10, 3);
	}

	public function ithoughts_tt_gl_get_glossary_term_element($term, $text = null, $options = array()){
		$datas = apply_filters("ithoughts_tt_gl-split-args", $options);

		if($datas["options"]['staticterms']){
			if(is_numeric($term)){
				$term = get_post($term);
			} else if(!($term instanceof WP_Post)){
				// Error
				return $text;
			}
			if(is_null($text))
				$text = $term->post_title;

			$datas["attributes"]['data-term-title'] = esc_attr($term->post_title);

			$content;
			$termcontent;
			if(isset($datas["attributes"]["termcontent"])){
				$termcontent = $datas["attributes"]["termcontent"];
				unset($datas["attributes"]["termcontent"]);
			} else {
				$termcontent = $datas["options"]["termcontent"];
			}
			switch( $termcontent ){
				case 'full':{
					$content = $term->post_content;
				}break;

				case 'excerpt':{
					$content = apply_filters("ithoughts_tt_gl-term-excerpt", $term);
				}break;

				case 'off':{
					$content = "";
				}break;
			}
			$content = str_replace("\n", "<br>", $content);
			$datas["attributes"]['data-term-content'] = $content;
		} else {
			if($term instanceof WP_Post){
				$datas["attributes"]['data-termid'] = $term->ID;
				if(is_null($text))
					$text = get_the_title($term);
			} else if(is_numeric($term)){
				$datas["attributes"]['data-termid'] = $term;
				if(is_null($text))
					$text = $term->post_title;
			}
		}

		$href="javascript::void(0)";
		if($term instanceof WP_Post){
			if($datas["options"]["termlinkopt"] != "none")// If theere need a link
				$href   = apply_filters( 'ithoughts_tt_gl_term_link', get_permalink($term) );
		} else if(is_numeric($term)){
			if($datas["options"]["termlinkopt"] != "none")// If theere need a link
				$href   = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($term) );
		}


		$link;
		$datas["linkAttrs"]["title"] = $text;
		switch($datas["options"]["termlinkopt"]){
			case "blank":{
				$datas["linkAttrs"]["href"] = $href;
				$datas["linkAttrs"]["target"] = "_blank";
			}break;
			case "none":{
				$datas["linkAttrs"]["href"] = "javascript::void(0);";
			}break;
			case "standard":{
				$datas["linkAttrs"]["href"] = $href;
				$href   = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($term) );
			}break;
		}


		$linkArgs = ithoughts_toolbox::concat_attrs( $datas["linkAttrs"]);
		$linkElement   = '<a '.$linkArgs.'>' . $text . '</a>';

		$datas["attributes"]["class"] = "ithoughts_tooltip_glossary-glossary".((isset($datas["attributes"]["class"]) && $datas["attributes"]["class"]) ? " ".$datas["attributes"]["class"] : "");
		$args = ithoughts_toolbox::concat_attrs( $datas["attributes"]);
		
		parent::$scripts['qtip'] = true;
		
		return '<span '.$args.'>' . $linkElement . '</span>';
	}
}