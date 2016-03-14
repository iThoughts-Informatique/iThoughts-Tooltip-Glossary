<?php
/**
  * @copyright 2015-2016 iThoughts Informatique
  * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
  */

namespace ithoughts\tooltip_glossary\shortcode;

class TermList extends GlossaryList{
	public function __construct() {
		add_shortcode( 'glossary_term_list', array($this, 'glossary_term_list') );
	}

	public function glossary_term_list( $atts, $content='' ){
		$out = $this->init_list_atts($atts);
		$data = &$out["data"];
		$linkdata = &$out["linkdata"];


		// Sanity check the list of letters (if set by user).
		$alphas = array();
		if( isset($data["handled"]["alpha"]) && $data["handled"]["alpha"] ) {
			$alpha_list = str_split($data["handled"]["alpha"]);
			foreach( $alpha_list as $alpha_item ) {
				$alphas[] = $this->get_type_char($alpha_item);
			} //alpha_list
		}
		$alphas = array_unique( $alphas );

		$terms;
		$count;
		if(!isset($data["handled"]["desc"]))
			$data["handled"]["desc"] = NULL;
		if($data["handled"]["desc"] === "glossarytips"){
			\ithoughts\tooltip_glossary\Backbone::get_instance()->add_script('qtip');

			$termsInfos = $this->get_lists_fields(array("ID", "post_title","post_name"));
			$terms = $this->dispatch_per_char($termsInfos["terms"], 0, "array");
			$count = $termsInfos["count"];
		} else {
			$linkdata = apply_filters("ithoughts_tt_gl-split-args", $linkdata);
			$termsInfos = $this->get_lists_terms();
			$terms = $this->dispatch_per_char($termsInfos["terms"], 0, "WP_Post");
			$count = $termsInfos["count"];
		}

		// Go through all glossaries, and restrict to alpha list if supplied.
		$lists = array();
		$countItems = 0;
		foreach( $terms as $char => $terms_char ) {
			if(count($alphas) == 0 || in_array($char, $alphas)){
				$lists[] = "<li class=\"glossary-item-header\">$char</li>";
				$countItems++;

				foreach( $terms_char as $term ){
					$countItems++;
					$title;
					if($data["handled"]["desc"] === "glossarytips"){
						$title = $term["post_title"];
					} else {
						$title = $term->post_title;
					}
					$linkAttrs = (isset($linkdata["linkAttrs"]) && is_array($linkdata["linkAttrs"])) ? $linkdata["linkAttrs"] : $linkdata;
					$linkAttrs["title"] = esc_attr($title);
					$linkAttrs["alt"] = esc_attr($title);

					$link;
					$content = "";
					switch($data["handled"]["desc"]){
						case 'excerpt':{
							$href  = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($term->ID) );
							$target = "";
							if( $data["options"]["termlinkopt"] != 'none' ){
								$linkAttrs["target"] = "_blank";
							}
							$linkAttrs["href"] = $href;
							$args = \ithoughts\v1_1\Toolbox::concat_attrs( $linkAttrs);
							$link   = '<a '.$args.'>' . $title . '</a>';
							$content = '<br>' . '<span class="glossary-item-desc">' . apply_filters("ithoughts_tt_gl-term-excerpt", $post) . '</span>';
						} break;

						case 'full':{
							$href  = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($term->ID) );
							$target = "";
							if( $data["options"]["termlinkopt"] != 'none' ){
								$linkAttrs["target"] = "_blank";
							}
							$linkAttrs["href"] = $href;
							$args = \ithoughts\v1_1\Toolbox::concat_attrs( $linkAttrs);
							$link   = '<a '.$args.'>' . $title . '</a>';
							$cargs = \ithoughts\v1_1\Toolbox::concat_attrs( $attrs);
							$content = '<br>' . '<span class="glossary-item-desc">' . $post->post_content . '</span>';
						} break;
						case 'glossarytips':{
							$link = apply_filters("ithoughts_tt_gl_get_glossary_term_element", $term, NULL, $linkdata);
						} break;

						case NULL:{
							$href  = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($post->ID) );
							$target = "";
							if( $data["options"]["termlinkopt"] != 'none' ){
								$linkAttrs["target"] = "_blank";
							}
							$linkAttrs["href"] = $href;
							$args = \ithoughts\v1_1\Toolbox::concat_attrs( $linkAttrs);
							$link   = '<a '.$args.'>' . $title . '</a>';
						}break;
					}

					$lists[]  = "<li class=\"glossary-item\">$link$content</li>";
				}
			}
		}
		if( !isset($data["handled"]["cols"]) || $data["handled"]["cols"] == 0 || $data["handled"]["cols"] === false ){
			$data["handled"]["cols"] = 1; // set col size to all items
		}
		if($data["handled"]["cols"] != 1){
			$termsPerChunkFloat = $countItems / $data["handled"]["cols"];
			$termsPerChunk = intval($termsPerChunkFloat);
			if($termsPerChunkFloat != $termsPerChunk)
				$termsPerChunk++;
			var_dump($countItems);
			var_dump($termsPerChunk);

			$lists = array_chunk($lists, $termsPerChunk);
		} else {
			$lists = array(&$lists);
		}

		$data["attributes"]["class"] = "glossary-list-details".((isset($data["attributes"]["class"]) && $data["attributes"]["class"]) ? " ".$data["attributes"]["class"] : "");
		if(isset($data["handled"]["masonry"])){
			$data["attributes"]["class"] .= " masonry";
			$data["attributes"]["class"] = trim($data["attributes"]["class"]);
			$data["attributes"]["data-cols"] = $data["handled"]["cols"];
		}
		$args = \ithoughts\v1_1\Toolbox::concat_attrs( $data["attributes"]);

		$return = '<div '.$args.'>';
		if(isset($data["handled"]["masonry"])){
			\ithoughts\tooltip_glossary\Backbone::get_instance()->add_script('list');
			$return .= '<ul class="glossary-list">';
			foreach( $lists as $col => $items ){
				$return .= implode( '', $items );
			}
			$return .= '</ul>';
		} else {
			foreach( $lists as $col => $items ){
				$return .= '<ul class="glossary-list">';
				$return .= implode( '', $items );
				$return .= '</ul>';
			}
		}
		$return .= '</div>';

		return $return;
	} // glossary_term_list
} // termlist
