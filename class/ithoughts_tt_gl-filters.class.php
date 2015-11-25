<?php

class ithoughts_tt_gl_filters extends ithoughts_tt_gl_interface{
	public function __construct(){
		add_filter("ithoughts_tt_gl-term-excerpt", array(&$this, "getTermExcerpt"));
	}

	public function getTermExcerpt(WP_Post $term){
		if( $term->excerpt ){
			$content = wpautop( $term->post_excerpt );
		} else {
			$content = wp_trim_words($term->post_content, 25, '...');
		}
		return $content;
	}
}