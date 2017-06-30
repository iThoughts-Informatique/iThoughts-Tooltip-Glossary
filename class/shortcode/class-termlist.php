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


/**
 * @copyright 2015-2016 iThoughts Informatique
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 */

namespace ithoughts\tooltip_glossary\shortcode;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! class_exists( __NAMESPACE__ . '\\TermList' ) ) {
	class TermList extends GlossaryList {
		const LIST_MODE_MICROPOST	= 1;
		const LIST_MODE_WPPOST		= 2;

		const LIST_MODE_NONE		= 1;
		const LIST_MODE_TIP			= 3;
		const LIST_MODE_EXCERPT		= 2;
		const LIST_MODE_FULL		= 4;



		public function __construct() {
			add_shortcode( 'glossary_term_list', array( $this, 'glossary_term_list' ) );
		}

		public function glossary_term_list( $atts, $content = '' ) {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

			// Split atts between 2 lists: one for each link, and one for the list
			$out = $this->init_list_atts( $atts );
			$data = &$out['data'];
			$linkdata = &$out['linkdata'];

			$mode;
			switch ( $data['handled']['desc'] ) {
				case 'none':{
					$mode = self::LIST_MODE_NONE;
				}break;

				case 'tip':{
					$mode = self::LIST_MODE_TIP;
				} break;

				case 'excerpt':{
					$mode = self::LIST_MODE_EXCERPT;
				} break;

				case 'full':{
					$mode = self::LIST_MODE_FULL;
				} break;

				default:{
					$mode = self::LIST_MODE_NONE;
				}
				}

				// Sanity check the list of letters (if set by user).
				$alphas = $this->filter_alphas_to_array( isset( $data['handled'] ) && isset( $data['handled']['alpha'] ) && $data['handled']['alpha'] ? $data['handled']['alpha'] : null );
				// Checks for partial listing options (on first letter, or group)
				$group_ids = $this->filter_groupIds_to_array( isset( $data['handled'] ) && isset( $data['handled']['group'] ) ? $data['handled']['group'] : null );

				$terms;
				$count;

				// Define default desc to none. Will generate a simple link
				// If no content is required, use microposts. Else, use normal terms
				if ( $mode & self::LIST_MODE_MICROPOST ) {
					// Add qtip script only if loading tooltips
					if ( $mode === self::LIST_MODE_TIP ) {
						\ithoughts\tooltip_glossary\Backbone::get_instance()->add_script( 'qtip' );
					}

					// Fetch microposts
					$termsInfos = $this->get_microposts( $group_ids,$alphas );
				} else {
					// Fetch full posts
					$linkdata = apply_filters( 'ithoughts_tt_gl-split-args', $linkdata );
					$termsInfos = $this->get_lists_terms( $group_ids,$alphas );
				}

				$terms = $this->dispatch_per_char( $termsInfos['terms'], 0, 'WP_Post' );
				$count = $termsInfos['count'];

				// Go through all glossaries, and restrict to alpha list if supplied.
				$lists = array();
				$countItems = 0;
				foreach ( $terms as $char => $terms_char ) {
					if ( count( $alphas ) == 0 || in_array( $char, $alphas ) ) {
						$lists[] = "<li class=\"glossary-item-header\">$char</li>";
						$countItems++;

						foreach ( $terms_char as $term ) {
							$countItems++;
							$term_standardized_post; // If only microposts were retrieved, cast them in WP_Post (usable by standard methods)
							if ( $mode & self::LIST_MODE_MICROPOST ) {
								$term_standardized_post = $term->to_WP_Post();
							} else {
								$term_standardized_post = &$term;
							}
							$linkAttrs = (isset( $linkdata['linkAttrs'] ) && is_array( $linkdata['linkAttrs'] )) ? $linkdata['linkAttrs'] : $linkdata;
							$linkAttrs['title'] = esc_attr( $term_standardized_post->post_title );
							$linkAttrs['alt'] = esc_attr( $term_standardized_post->post_title );

							$link = '';
							$content = '';
							switch ( $mode ) {
								case self::LIST_MODE_NONE:{
									$href  = apply_filters( 'ithoughts_tt_gl_term_link',  \ithoughts\v5_0\Toolbox::get_permalink_light( $term_standardized_post, 'glossary' ) );
									$target = '';
									if ( $data['options']['termlinkopt'] != 'none' ) {
										$linkAttrs['target'] = '_blank';
									}
									$linkAttrs['href'] = &$href;
									$args = \ithoughts\v5_0\Toolbox::concat_attrs( $linkAttrs );
									$link   = '<a ' . $args . '>' . $term_standardized_post->post_title . '</a>';
								}break;

								case self::LIST_MODE_TIP:{
									$link = apply_filters( 'ithoughts_tt_gl_get_glossary_term_element', $term_standardized_post, null, $linkdata );
								} break;

								case self::LIST_MODE_EXCERPT:{
									$href  = apply_filters( 'ithoughts_tt_gl_term_link',  \ithoughts\v5_0\Toolbox::get_permalink_light( $term_standardized_post, 'glossary' ) );
									$target = '';
									if ( $data['options']['termlinkopt'] != 'none' ) {
										$linkAttrs['target'] = '_blank';
									}
									$linkAttrs['href'] = &$href;
									$args = \ithoughts\v5_0\Toolbox::concat_attrs( $linkAttrs );
									$link   = '<a ' . $args . '>' . $term_standardized_post->post_title . '</a>';
									$content = '<br>' . '<span class="glossary-item-desc">' . apply_filters( 'ithoughts_tt_gl-term-excerpt', $term_standardized_post ) . '</span>';
								} break;

								case self::LIST_MODE_FULL:{
									$href  = apply_filters( 'ithoughts_tt_gl_term_link',  \ithoughts\v5_0\Toolbox::get_permalink_light( $term_standardized_post, 'glossary' ) );
									$target = '';
									if ( $data['options']['termlinkopt'] != 'none' ) {
										$linkAttrs['target'] = '_blank';
									}
									$linkAttrs['href'] = &$href;
									$args = \ithoughts\v5_0\Toolbox::concat_attrs( $linkAttrs );
									$link   = '<a ' . $args . '>' . $term_standardized_post->post_title . '</a>';
									$content = '<br>' . '<span class="glossary-item-desc">' . $term->post_content . '</span>';
								} break;
							}// End switch().

							$lists[]  = "<li class=\"glossary-item\">$link$content</li>";
						}// End foreach().
					}// End if().
				}// End foreach().
				if ( ! isset( $data['handled']['cols'] ) || $data['handled']['cols'] == 0 || $data['handled']['cols'] === false ) {
					$data['handled']['cols'] = 1; // set col size to all items
				}
				$chunked;
				if ( $data['handled']['cols'] != 1 ) {
					$termsPerChunkFloat = $countItems / $data['handled']['cols'];
					$termsPerChunk = intval( $termsPerChunkFloat );
					if ( $termsPerChunkFloat != $termsPerChunk ) {
						$termsPerChunk++;
					}

					if ( $termsPerChunk < 1 ) {
						$termsPerChunk = 1;
					}
					$chunked = array_chunk( $lists, $termsPerChunk );
				} else {
					$chunked = array( &$lists );
				}

				$data['attributes']['class'] = 'glossary-list-details' . ((isset( $data['attributes']['class'] ) && $data['attributes']['class']) ? ' ' . $data['attributes']['class'] : '');
				/*
				if(isset($data["handled"]["masonry"])){
				$data["attributes"]["class"] .= " masonry";
				$data["attributes"]["class"] = trim($data["attributes"]["class"]);
				$data["attributes"]["data-cols"] = $data["handled"]["cols"];
				}*/
				$args = \ithoughts\v5_0\Toolbox::concat_attrs( $data['attributes'] );

				$return = '<div ' . $args . '>';
				if ( isset( $data['handled']['masonry'] ) ) {/*
					\ithoughts\tooltip_glossary\Backbone::get_instance()->add_script('list');
					$return .= '<ul class="glossary-list">';
					foreach( $chunked as $col => $items ){
					$return .= implode( '', $items );
					}
					$return .= '</ul>';*/
				} else {
					foreach ( $chunked as $col => $items ) {
						$return .= '<ul class="glossary-list">';
						$return .= implode( '', $items );
						$return .= '</ul>';
					}
				}
				$return .= '</div>';

				return $return;
		} // glossary_term_list
	} // termlist
}// End if().
