<?php

/**
 * @file Class file for standard list
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

if ( ! class_exists( __NAMESPACE__ . '\\Glossary' ) ) {
	class Glossary extends TermsList {
		public function __construct() {
			add_shortcode( 'itg-glossary', array( $this, 'do_shortcode' ) );

			parent::__construct('glossary');
		}

		public function generate_list( $text = '', $groups = array(), $letters = array(), $options = array() ) {
			$options = apply_filters( 'ithoughts_tt_gl-split-attributes', $options );
			$server_options = array_replace_recursive(array(), $this->backbone->get_serverside_options(), $options['serverSide']);

			$filter = "ithoughts_tt_gl_list_{$server_options['list-contenttype']}";
			$posts = array();
			if(has_filter($filter)){
				$posts = apply_filters($filter, $groups, $letters);
			}
			$posts_count = count($posts);
			// Make groups
			$paged = $this->group_posts_by_alpha($posts);
			$posts = null;

			$index_items = array();
			foreach ( $paged as $alpha => $pages ) {
				$index_items[] = '<li class="glossary-item-header">'.$alpha.'</li>';
				foreach($pages as $name => $page){
					$index_items[]  = '<li class="glossary-item">'.$page.'</li>';
				}
			}
			//			Toolbox::pretty_log($index_items);

			if ( ! isset( $options['handled']['cols'] ) || $options['handled']['cols'] == 0 || $options['handled']['cols'] === false ) {
				$options['handled']['cols'] = 1; // set col size to all items
			}
			$chunked;
			if ( $options['handled']['cols'] != 1 ) {
				$terms_per_chunk_float = $posts_count / $options['handled']['cols'];
				$terms_per_chunk = intval( $terms_per_chunk_float );
				if ( $terms_per_chunk_float != $terms_per_chunk ) {
					$terms_per_chunk++;
				}

				if ( $terms_per_chunk < 1 ) {
					$terms_per_chunk = 1;
				}
				$chunked = array_chunk( $index_items, $terms_per_chunk );
			} else {
				$chunked = array( &$index_items );
			}

			$output = '';
			foreach ( $chunked as $col => $items ) {
				$output .= '<ul class="glossary-list">';
				$output .= implode( '', $items );
				$output .= '</ul>';
			}


			$options['attributes']['class'] = 'glossary-list-details' . ((isset( $options['attributes']['class'] ) && $options['attributes']['class']) ? ' ' . $options['attributes']['class'] : '');
			$args = \ithoughts\v6_0\Toolbox::concat_attrs( $options['attributes'] );
			return '<div' . $args . '>'.$output.'</div>';
		}
	}
}// End if().
