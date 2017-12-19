<?php

/**
 * @file Base class file for lists
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */


namespace ithoughts\tooltip_glossary\shortcode\index;

use \ithoughts\v6_0\Toolbox as Toolbox;

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );
	wp_die( 'Forbidden' );// Exit if accessed directly
}

/**
 * @description Base class for lists.
 */
if ( ! class_exists( __NAMESPACE__ . '\\GlossesList' ) ) {
	abstract class GlossesList extends \ithoughts\v1_0\Singleton {
		const LIST_MODE_LINK    = 'link';
		const LIST_MODE_TIP     = 'tip';
		const LIST_MODE_EXCERPT = 'excerpt';
		const LIST_MODE_FULL    = 'full';
		
		private $type;
		
		protected $backbone;

		public function __construct($backbone, $type, $register_comon_filters = false){
			$this->type = $type;
			$this->backbone = $backbone;
			
			add_filter( 'ithoughts_tt_gl_'.$this->type, array( &$this, 'generate_list' ), 1000, 4 );
			if($register_comon_filters){
				add_filter('ithoughts_tt_gl_list_'.self::LIST_MODE_LINK,    array(&$this, 'list_'.self::LIST_MODE_LINK),  1000, 3);
				add_filter('ithoughts_tt_gl_list_'.self::LIST_MODE_TIP,     array(&$this, 'list_'.self::LIST_MODE_TIP),    1000, 3);
				add_filter('ithoughts_tt_gl_list_'.self::LIST_MODE_EXCERPT, array(&$this, 'list_'.self::LIST_MODE_EXCERPT),  1000, 3);
				add_filter('ithoughts_tt_gl_list_'.self::LIST_MODE_FULL,    array(&$this, 'list_'.self::LIST_MODE_FULL),  1000, 3);
			}
		}

		abstract protected function generate_list();




		public function list_link($groups, $letters, $attributes = array()){
			$posts = $this->get_microposts($groups,$letters);
			// Transform posts
			$postsContents = array();
			foreach($posts as $post){
				$postsContents[$post->post_name] = $this->list_item_link($post, $attributes);
			}
			return $postsContents;
		}

		public function list_tip($groups, $letters, $attributes = array()){
			if($this->backbone->get_option('staticterms') === true){
				$posts = $this->get_lists_terms($groups,$letters);
			} else {
				$posts = $this->get_microposts($groups, $letters);
			}
			// Transform posts
			$postsContents = array();
			foreach($posts as $post){
				$postsContents[$post->post_name] = $this->list_item_tip($post, $attributes);
			}
			return $postsContents;
		}

		public function list_excerpt($groups, $letters, $attributes = array()){
			$posts = $this->get_lists_terms($groups,$letters);
			// Transform posts
			$postsContents = array();
			foreach($posts as $post){
				$postsContents[$post->post_name] = $this->list_item_excerpt($post, $attributes);
			}
			return $postsContents;
		}

		public function list_full($groups, $letters, $attributes = array()){
			$posts = $this->get_lists_terms($groups,$letters);
			// Transform posts
			$postsContents = array();
			foreach($posts as $post){
				$postsContents[$post->post_name] = $this->list_item_full($post, $attributes);
			}
			return $postsContents;
		}

		private function list_item_link($post, $attributes = array()){
			$title = $post->post_title;
			$href  = apply_filters( 'ithoughts_tt_gl_term_link',  Toolbox::get_permalink_light($post, "glossary") );
			
			$content   = '<a title="'. $title .'" href="'.$href.'">' . $title . '</a>';
			return apply_filters('ithoughts_tt_gl_list_item_'.self::LIST_MODE_LINK,    $content, $attributes);
		}

		private function list_item_tip($post, $attributes = array()){
			$content = apply_filters('ithoughts_tt_gl_gloss', NULL, $post);
			return apply_filters('ithoughts_tt_gl_list_item_'.self::LIST_MODE_TIP,     $content, $attributes);
		}

		private function list_item_excerpt($post, $attributes = array()){
			$title = $post->post_title;
			$href  = apply_filters( 'ithoughts_tt_gl_term_link',  Toolbox::get_permalink_light($post, "glossary") );

			$content   = '<header class="entry-header"><h5 class="entry-title"><a title="'. $title .'" href="'.$href.'">' . $title . '</a></h5></header>';
			$content .= '<div class="entry-content clearfix"><p>' . apply_filters('get_the_excerpt',$post->post_content) . '</p></div>';
			return apply_filters('ithoughts_tt_gl_list_item_'.self::LIST_MODE_EXCERPT, $content, $attributes);
		}

		private function list_item_full($post, $attributes = array()){
			$title = $post->post_title;
			$href  = apply_filters( 'ithoughts_tt_gl_term_link',  Toolbox::get_permalink_light($post, "glossary") );

			$content   = '<header class="entry-header"><h5 class="entry-title"><a title="'. $title .'" href="'.$href.'">' . $title . '</a></h5></header>';
			$content .= '<div class="entry-content clearfix"><p>' . apply_filters('get_the_content',$post->post_content) . '</p></div>';
			return apply_filters('ithoughts_tt_gl_list_item_'.self::LIST_MODE_FULL,    $content, $attributes);
		}
		
		
		public function do_shortcode( $attributes, $text = '' ) {
			if($attributes === ''){
				$attributes = array();
			}

			// Checks for partial listing options by group
			$groups = Toolbox::str_split_trim(Toolbox::pick_option( $attributes, 'groups', '' ), ',');
			// Sanity check the list of letters (if set by user).
			$alphas = Toolbox::str_split_trim(Toolbox::pick_option( $attributes, 'alphas', ''), '' );

			return apply_filters( 'ithoughts_tt_gl_'.$this->type, null, $groups, $alphas, $attributes );
		}
		
		
		
		protected function group_posts_by_alpha(array $posts){
			$paged = array();
			foreach( $posts as $post_name => $post ) {
				$alpha = strtoupper( Toolbox::unaccent(mb_substr($post_name,0,1, "UTF-8")) );
				if(!preg_match("/[A-Z]/", $alpha)){
					$alpha = "#";
				}

				if(!isset($paged[$alpha])){
					$paged[$alpha] = array();
				}
				$paged[$alpha][$post_name] = $post;
			}
			return $paged;
		}
		
		

		protected function get_lists_terms( $groups = array(), $alphas = array() ) {
			// Post status array depending on user capabilities
			$statii = array( 'publish' );
			if ( current_user_can( 'read_private_posts' ) ) {
				$statii[] = 'private';
			}

			$args = array(
				'post_type'           => 'glossary',
				'posts_per_page'      => -1,
				'orderby'             => 'title',
				'order'               => 'ASC',
				'ignore_sticky_posts' => 1,
				'post_status'         => $statii,
			);
			if ( function_exists( 'icl_object_id' ) ) {
				$args['suppress_filters'] = 0;
			}

			// Restrict list to specific glossary group or groups
			if ( is_array($groups) && count( $groups ) > 0 ) {
				$tax_query = array();
				// If search for ungrouped
				if ( ($noGroup = array_search( 0, $groups )) !== false ) {
					// Get all terms
					unset( $groups[ $noGroup ] );
					$groups = get_terms(array(
						'taxonomy'		=> 'glossary_group',
						'hide_empty'	=> false,
					));
					// Exclude them
					$tax_query[] = array(
						'taxonomy'	=> 'glossary_group',
						'field'		=> 'id',
						'terms'		=> $groups,
						'operator'	=> 'NOT IN',
					);
				}
				if ( count( $groups ) > 0 ) {
					$tax_query[] = array(
						'taxonomy' => 'glossary_group',
						'field'    => 'id',
						'terms'    => $groups,
					);
				}
				$args['tax_query'] = $tax_query;
			}
			$query = new \WP_Query( $args );
			$glossaries = get_posts( $args );

			$filteredGlossaries;
			if ( is_array($alphas) && count( $alphas ) > 0 ) {
				$filteredGlossaries = array();
				$regexStr = '/' . $this->alpha_array_to_regex_str( $alphas ) . '/';
				foreach ( $glossaries as $glossary ) {
					if ( preg_match( $regexStr, $glossary->post_title ) ) {
						$filteredGlossaries[] = &$glossary;
					}
				}
			} else {
				$filteredGlossaries = &$glossaries;
			}

			return $filteredGlossaries;
		}

		final protected function get_microposts( $groups = array(), $alphas = array() ) {
			global $wpdb;
			
			require_once( $this->backbone->get_base_class_path() . '/class-micropost.php' );
			$fields = \ithoughts\tooltip_glossary\MicroPost::getFields();
			$table = "{$wpdb->prefix}posts";
			$queryComponents = array();

			// Static select
			$queryComponents['pre'] = '
SELECT DISTINCT
    ';

			// Posts table name
			$queryComponents['from'] = "
FROM
	$table AS p";

			// WPML support
			if ( function_exists( 'icl_object_id' ) ) { // Add join to current language for WPML
				$queryComponents['from'] .= "
JOIN {$wpdb->prefix}icl_translations t
ON
	p.ID = t.element_id AND
	t.element_type = CONCAT('post_', p.post_type)";
			}

			// Group join
			if ( is_array($groups) && count( $groups ) > 0 ) {
				$queryComponents['from'] .= "
LEFT JOIN {$wpdb->prefix}term_relationships AS r
ON
	p.ID = r.object_id";
			}

			// Selection criteria (post type + post status)
			$queryComponents['where'] = "
WHERE
	p.post_type = 'glossary' AND
	(
		";
			$statii = array( 'publish' );
			if ( current_user_can( 'read_private_posts' ) ) {
				$statii[] = 'private';
			}
			$loopIndicator = false;
			foreach ( $statii as $status ) {
				if ( $loopIndicator ) {
					$queryComponents['where'] .= ' OR
        ';
				}
				$loopIndicator = true;
				$queryComponents['where'] .= "p.post_status='$status'";
			}
			$queryComponents['where'] .= '
    )';

			// Selection criteria (lang translate)
			if ( function_exists( 'icl_object_id' ) ) { // Select only current language
				$queryComponents['where'] .= " AND
	t.language_code = '" . ICL_LANGUAGE_CODE . "'";
			}

			// Selection criteria (group)
			if ( is_array($groups) && count( $groups ) > 0 ) {
				$queryComponents['where'] .= ' AND
    ';
				$hasNoGroup = in_array( 0, $groups );
				$groups = array_diff( $groups, array( 0 ) );
				$pre = '';
				$join = '';
				$post = '';
				if ( $hasNoGroup && count( $groups ) > 0 ) {
					$pre = '(
        ';
					$join = ' OR
        ';
					$post = ')';
				}
				$queryComponents['where'] .= $pre;
				if ( $hasNoGroup ) {
					'r.term_taxonomy_id IS NULL' . $join;
				}
				if ( count( $groups ) > 0 ) {
					$queryComponents['where'] .= 'r.term_taxonomy_id in (' . implode( ',',$groups ) . ')';
				}
				$queryComponents['where'] .= $post;
			}

			// Selection criteria (first letter)
			if ( is_array($alphas) && count( $alphas ) > 0 ) {
				$regexStr = $this->alpha_array_to_regex_str( $alphas );
				$queryComponents['where'] .= " AND
	p.post_title REGEXP '$regexStr'";
			}

			// Sort
			$queryComponents['order'] = '
ORDER BY
    p.post_title ASC';

			$selectFields = '';
			$loopIndicator = false;
			foreach ( $fields as $field ) {
				if ( $loopIndicator ) {
					$selectFields .= ',
                    ';
				}
				$loopIndicator = true;
				$selectFields .= "p.$field";
			}

			$querySelect = $queryComponents['pre'] . $selectFields . $queryComponents['from'] . $queryComponents['where'] . $queryComponents['order'];
			$queryCount = $queryComponents['pre'] . 'COUNT(*)' . $queryComponents['from'] . $queryComponents['where'] . $queryComponents['order'];
			// Toolbox::prettyDump($querySelect, $queryCount);
			$res = $wpdb->get_results( $querySelect, ARRAY_A );
			$micro_posts = array();
			foreach ( $res as $micropost ) {
				$micro_posts[] = new \ithoughts\tooltip_glossary\MicroPost( $micropost );
			}
			return $micro_posts;
		}

		private function alpha_array_to_regex_str( $alphas ) {
			$specIndex = array_search( '#', $alphas );
			$regexStr = '^(';
			if ( $specIndex !== false ) {
				unset( $alphas[ $specIndex ] );
				$regexStr .= '[^A-Za-z]';
			}
			if ( count( $alphas ) > 0 ) {
				if ( $specIndex !== false ) {
					$regexStr .= '|';
				}
				if ( count( $alphas ) > 1 ) {
					$regexStr .= '[' . implode( '', $alphas ) . ']';
				} else {
					$regexStr .= $alphas[0];
				}
			}
			$regexStr .= ')';
			return $regexStr;
		}
	}
}// End if().
