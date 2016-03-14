<?php
/**
  * @copyright 2015-2016 iThoughts Informatique
  * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
  */

namespace ithoughts\tooltip_glossary\shortcode;

/**
 * @description Base class for lists.
 */
abstract class GlossaryList extends \ithoughts\v1_0\Singleton{

	/**
	 * Sort attributes, prepare linkdata & get posts
	 * @author Gerkin
	 * @param Array $atts Attributes set on shortcode call
	 */
	final protected function init_list_atts($atts){
		// Parse attributes and sort them
		$data = apply_filters("ithoughts_tt_gl-split-args", $atts);

		// Copy & filter glossary options
		$linkdata = $data;
		$linkdata["disable_auto_translation"] = true;
		unset($linkdata["attributes"]);
		unset($linkdata["handled"]);
		foreach($linkdata["linkAttrs"] as $key => $linkAttr){
			$linkdata["linkAttrs"]["link-".$key] = $linkAttr;
			unset($linkdata["linkAttrs"][$key]);
		}
		$linkdata = \ithoughts\v1_1\Toolbox::array_flatten($linkdata);

		return array(
			"data" => &$data,
			"linkdata" => &$linkdata
		);
	}

	protected function get_lists_terms($group_slugs = NULL, $pagination = NULL){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

		// Post status array depending on user capabilities
		$statii = array( 'publish' );
		if( current_user_can('read_private_posts') ){
			$statii[] = 'private';
		}

		if($pagination == NULL)
			$pagination = $backbone->get_option("lists_size");

		$args = array(
			'post_type'           => "glossary",
			'posts_per_page'      => $pagination,
			'orderby'             => 'title',
			'order'               => 'ASC',
			'ignore_sticky_posts' => 1,
			'post_status'         => $statii,
		);
		if(function_exists('icl_object_id')){
			$args['suppress_filters'] = 0;
		}

		// Restrict list to specific glossary group or groups
		if( $group_slugs ){
			$tax_query = array(
				'taxonomy' => 'glossary_group',
				'field'    => 'slug',
				'terms'    => $group_slugs,
			);
			$args['tax_query'] = array( $tax_query );
		}
		$query = new \WP_Query($args);
		echo "<pre>".$query->request."</pre><br/>";
		$glossaries = get_posts( $args );

		return array(
			"terms" => &$glossaries,
			"count" => $query->found_posts
		);
	}

	final protected function get_lists_fields($fields){
		global $wpdb;
		$table = "{$wpdb->prefix}posts";
		$queryComponents = array();
		$queryComponents["pre"] = "
SELECT
	";
		$queryComponents["from"] = "
FROM
	$table AS p";
		if(function_exists('icl_object_id')){ // Add join to current language for WPML
			$queryComponents["from"] .= "
	JOIN devblog_icl_translations t
	ON
		p.ID = t.element_id AND
		t.element_type = CONCAT('post_', p.post_type)";
		}
		$queryComponents["where"] = "
WHERE
	p.post_type = 'glossary' AND
	(
		";
		$statii = array( 'publish' );
		if( current_user_can('read_private_posts') ){
			$statii[] = 'private';
		}
		$loopIndicator = false;
		foreach($statii as $status){
			if($loopIndicator)
				$queryComponents["where"] .= " OR
		";
			$loopIndicator = true;
			$queryComponents["where"] .= "p.post_status='$status'";
		}
		$queryComponents["where"] .= "
	)";
		if(function_exists('icl_object_id')){ // Select only current language
			$queryComponents["where"] .= " AND
	t.language_code = '".ICL_LANGUAGE_CODE."'";
		}
		$queryComponents["order"] = "
ORDER BY
	p.post_title ASC";


		$selectFields = "";
		$loopIndicator = false;
		foreach($fields as $field){
			if($loopIndicator)
				$selectFields .= ",
	";
			$loopIndicator = true;
			$selectFields .= "p.$field";
		}

		$querySelect = $queryComponents["pre"].$selectFields.$queryComponents["from"].$queryComponents["where"].$queryComponents["order"];
		$queryCount = $queryComponents["pre"]."COUNT(*)".$queryComponents["from"].$queryComponents["where"].$queryComponents["order"];

		$return = array(
			"terms" => $wpdb->get_results($querySelect, ARRAY_A),
			"count" => $wpdb->get_var($queryCount)
		);
		/*echo "<pre>$querySelect</pre>";
		echo "<pre>";
		print_r($return["terms"]);
		echo "</pre><br/>";
		echo "<pre>$queryCount</pre>";
		echo "<pre>";
		print_r($return["count"]);
		echo "</pre><br/>";*/

		return $return;
	}

	final protected function dispatch_per_char(&$terms, $index = NULL, $type = NULL){
		if($index == NULL)
			$index = 0;
		if($type == NULL)
			$type = gettype($terms[0]) == "object" ? get_class($terms[0]) : gettype($terms[0]);

		$sorted = array();
		switch($type){
			case "WP_Post":{
				foreach($terms as &$post){
					$title      = $post->post_title;
					$titlealpha = $this->get_type_char($title, $index);
					if(!isset($sorted[$titlealpha]))
						$sorted[$titlealpha] = array();
					$sorted[$titlealpha][] = &$post;
				}
			} break;

			case "array":{
				foreach($terms as &$post){
					$title      = $post["post_title"];
					$titlealpha = $this->get_type_char($title, $index);
					if(!isset($sorted[$titlealpha]))
						$sorted[$titlealpha] = array();
					$sorted[$titlealpha][] = &$post;
				}
			} break;
		}

		return $sorted;
	}

	/**
	 * @description Extracts the index symbol corresponding to the given string at given index. Concretely, it will return the unaccented letter uppercase or # symbol.
	 * @param string	$string	The string to analyze
	 * @param integer	$index	The index in the string to check
	 * @return string	The extracted char
	 */
	final private function get_type_char($string, $index = NULL){
		if($index == NULL)
			$index = 0;

		$stringAlpha = strtoupper( \ithoughts\v1_1\Toolbox::unaccent(mb_substr($string,$index,1, "UTF-8")) );
		if(!preg_match("/[A-Z]/", $stringAlpha)){
			return "#";
		}
		return $stringAlpha;
	}

	final protected function generate_pagination($count){

	}
}