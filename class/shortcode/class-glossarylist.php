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


namespace ithoughts\tooltip_glossary\shortcode;

use \ithoughts\v5_0\Toolbox as TB;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * @description Base class for lists.
 */
if ( ! class_exists( __NAMESPACE__ . '\\GlossaryList' ) ) {
	abstract class GlossaryList extends \ithoughts\v1_0\Singleton {

		/**
		 * Sort attributes, prepare linkdata & get posts
		 *
		 * @author Gerkin
		 * @param Array $atts Attributes set on shortcode call
		 */
		final protected function init_list_atts( $atts ) {
			// Parse attributes and sort them
			$data = apply_filters( 'ithoughts_tt_gl-split-args', $atts );

			// Copy & filter glossary options
			$linkdata = $data;
			$linkdata['disable_auto_translation'] = true;
			unset( $linkdata['attributes'] );
			unset( $linkdata['handled'] );
			foreach ( $linkdata['linkAttrs'] as $key => $linkAttr ) {
				$linkdata['linkAttrs'][ 'link-' . $key ] = $linkAttr;
				unset( $linkdata['linkAttrs'][ $key ] );
			}
			$linkdata = \ithoughts\v5_0\Toolbox::array_flatten( $linkdata );

			return array(
				'data' => &$data,
				'linkdata' => &$linkdata,
			);
		}

		protected function get_lists_terms( $group_ids = null, $alphas = null ) {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

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
			if ( $group_ids ) {
				$tax_query = array();
				// If search for ungrouped
				if ( ($noGroup = array_search( 0, $group_ids )) !== false ) {
					// Get all terms
					unset( $group_ids[ $noGroup ] );
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
				if ( count( $group_ids ) > 0 ) {
					$tax_query[] = array(
						'taxonomy' => 'glossary_group',
						'field'    => 'id',
						'terms'    => $group_ids,
					);
				}
				$args['tax_query'] = $tax_query;
			}
			$query = new \WP_Query( $args );
			$glossaries = get_posts( $args );

			$filteredGlossaries;
			if ( $alphas && count( $alphas ) > 0 ) {
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

			return array(
				'terms' => &$filteredGlossaries,
				'count' => $query->found_posts,
			);
		}

		final protected function get_microposts( $groups = false, $alphas = false ) {
			global $wpdb;
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
			if ( $groups !== false && count( $groups ) > 0 ) {
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
			if ( $groups !== false && count( $groups ) > 0 ) {
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
			if ( count( $alphas ) > 0 ) {
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
			// \ithoughts\v5_0\Toolbox::prettyDump($querySelect, $queryCount);
			$res = $wpdb->get_results( $querySelect, ARRAY_A );
			$ret = array();
			foreach ( $res as $micropost ) {
				$ret[] = new \ithoughts\tooltip_glossary\MicroPost( $micropost );
			}

			$return = array(
				'terms' => $ret,
				'count' => $wpdb->get_var( $queryCount ),
			);

			return $return;
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

		final protected function filter_alphas_to_array( $alphasStr = null ) {
			// Sanity check the list of letters (if set by user).
			$alphas = array();
			if ( $alphasStr != null ) {
				$alpha_list = array_unique( str_split( $alphasStr ) );
				foreach ( $alpha_list as $alpha_item ) {
					$alphas[] = $this->get_type_char( $alpha_item );
				} // End foreach().
				$alphas = array_unique( $alphas );
			}
			$alphas = count( $alphas ) > 0 ? $alphas : null;
			return $alphas;
		}

		final protected function filter_groupIds_to_array( $group_idsStr = null ) {
			// Sanity check the groups (if set by user).
			$group_ids = null;
			if ( $group_idsStr != null ) {
				$group_ids = array_unique( array_map( 'trim', explode( ',', $group_idsStr ) ) );
			}
			return $group_ids;
		}

		final protected function dispatch_per_char( &$terms, $index = null, $type = null ) {
			if ( $index == null ) {
				$index = 0;
			}
			if ( $type == null ) {
				$type = gettype( $terms[0] ) == 'object' ? get_class( $terms[0] ) : gettype( $terms[0] );
			}

			$sorted = array();
			switch ( $type ) {
				case 'WP_Post':{
					foreach ( $terms as &$post ) {
						$title      = $post->post_title;
						$titlealpha = $this->get_type_char( $title, $index );
						if ( ! isset( $sorted[ $titlealpha ] ) ) {
							$sorted[ $titlealpha ] = array();
						}
						$sorted[ $titlealpha ][] = &$post;
					}
				} break;

				case 'array':{
					foreach ( $terms as &$post ) {
						$title      = $post['post_title'];
						$titlealpha = $this->get_type_char( $title, $index );
						if ( ! isset( $sorted[ $titlealpha ] ) ) {
							$sorted[ $titlealpha ] = array();
						}
						$sorted[ $titlealpha ][] = &$post;
					}
				} break;
			}

			return $sorted;
		}

		/**
		 * @description Extracts the index symbol corresponding to the given string at given index. Concretely, it will return the unaccented letter uppercase or # symbol.
		 * @param string  $string The string to analyze
		 * @param integer $index  The index in the string to check
		 * @return string	The extracted char
		 */
		final protected function get_type_char( $string, $index = null ) {
			if ( $index == null ) {
				$index = 0;
			}

			$stringAlpha = strtoupper( \ithoughts\v5_0\Toolbox::unaccent( mb_substr( $string,$index,1, 'UTF-8' ) ) );
			if ( ! preg_match( '/[A-Z]/', $stringAlpha ) ) {
				return '#';
			}
			return $stringAlpha;
		}

		final protected function generate_pagination( $count ) {

		}
	}
}// End if().
