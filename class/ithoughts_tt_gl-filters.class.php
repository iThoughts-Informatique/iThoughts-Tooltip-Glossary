<?php

class ithoughts_tt_gl_filters extends ithoughts_tt_gl_interface{
	public function __construct(){
		add_filter("ithoughts_tt_gl-term-excerpt", array(&$this, "getTermExcerpt"));
		add_filter("ithoughts-split-args", array(&$this, "splitArgs"), 10, 3);
		add_filter("ithoughts-join-args", array(&$this, "joinArgs"), 10, 1);
	}

	public function getTermExcerpt(WP_Post $term){
		if( $term->excerpt ){
			$content = wpautop( $term->post_excerpt );
		} else {
			$content = wp_trim_words($term->post_content, 25, '...');
		}
		return $content;
	}

	/**
 *	Return array(
 *		"handled"		=> array(),
 *		"attributes"	=> array(),
 *		"option"		=> array()
 *	)
 */
	// TODO apply filter for each shortcode
	// TODO use override options
	public function splitArgs($attributes, array $handled = array(), array $overridableOptions = array()){
		$attrs = array(
			"width",
			"height",
			"class",
			"id",
			"style",
			"/^aria-/",
			"/^data-/"
		);
		$attsLength = count($attrs);
		$res = array(
			"handled"		=> array(),
			"attributes"	=> array(),
			"options"		=> array()
		);
		foreach($attributes as $key => $value){
			if(array_search($key, $handled) !== false){
				$res["handled"][$key] = $value;
			} else if(array_search($key, $overridableOptions) !== false){
				$res["options"][$key] = $value;
			} else {
				$i = -1;
				$match = false;
				while(++$i < $attsLength && !$match){
					$attr = $attrs[$i];
					if(count($attr) > 1 && $attr[0] == "/" && $attr[count($attr) - 1] == "/"){
						if(preg_match($attributes[$i], $key)){
							$res["attributes"][$key] = $value;
							$match = true;
						}
					} else {
						if($key === $attrs[$i]){
							$res["attributes"][$key] = $value;
							$match = true;
						}
					}
				}
				if(!$match){
					$res["attributes"]["data-".$key] = $value;
				}
			}
		}
		return $res;
	}
	
	public function joinArgs($args){
		$ret = "";
		foreach($args as $key => $value){
			$ret .= "$key=\"".ithoughts_tt_gl_stipQuotes($value, true)."\" ";
		}
		return $ret;
	}
}