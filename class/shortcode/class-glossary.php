<?php

/**
 * @file Glossary tooltip shortcode class file
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


if ( ! class_exists( __NAMESPACE__ . '\\Glossary' ) ) {
	class Glossary extends \ithoughts\v1_0\Singleton {
		public function __construct() {
			// Shortcode
			add_shortcode( 'itg-glossary', array( &$this, 'glossary_shortcode' ) );
			add_shortcode( 'glossary', array( &$this, 'glossary_shortcode' ) );

			// Help functions..
			add_action( 'save_post',  array( &$this, 'save_post_check_for_glossary_usage' ), 20, 2 );
			add_action( 'wp_insert_post_data',  array( &$this, 'parse_pseudo_links_to_shortcode' ) );
			add_action( 'edit_post',  array( &$this, 'convert_shortcodes' ) );
			add_action( 'get_header', array( &$this, 'glossary_usage_reset_for_post' ) );
			add_action( 'wp_footer',  array( &$this, 'glossary_remove_update_marker' ) );

			add_filter( 'ithoughts_tt_gl_get_glossary_term_element', array( $this, 'ithoughts_tt_gl_get_glossary_term_element' ), 10, 3 );
			add_filter( 'ithoughts_tt_gl-term-content', array( $this, 'termContent' ) );
		}

		private function get_glossary_term_element_array( $term, $text = null, $datas = array() ) {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			if ( function_exists( 'icl_object_id' ) ) { // If WPML &...
				if ( ! (isset( $datas['handled']['disable_auto_translation'] ) && $datas['handled']['disable_auto_translation']) ) { // ... we want auto translate
					// Re-fallback on main method with ID
					return $this->ithoughts_tt_gl_get_glossary_term_element( $term['ID'], $text, $datas );
				}
			}
			if ( $backbone->get_option( 'staticterms' ) ) {
				$content;
				$termcontent;
				if ( isset( $datas['attributes']['termcontent'] ) ) {
					$termcontent = $datas['attributes']['termcontent'];
					unset( $datas['attributes']['termcontent'] );
				} else {
					$termcontent = $datas['options']['termcontent'];
				}
				switch ( $termcontent ) {
					case 'full':{
						if ( isset( $term['post_content'] ) && $term['post_content'] ) {
							$content = $term['post_content'];
						} else {
							return ithoughts_tt_gl_get_glossary_term_element( $term['ID'], $text, $datas );
						}
					}break;

					case 'excerpt':{
						if ( (isset( $term['post_excerpt'] ) && $term['post_excerpt']) || (isset( $term['post_content'] ) && $term['post_content']) ) {
							// Do
							$termObj = new \WP_Post( (object) $term );
							$content = apply_filters( 'ithoughts_tt_gl-term-excerpt', $termObj );
						} else {
							// Fallback on default
							return ithoughts_tt_gl_get_glossary_term_element( $term['ID'], $text, $datas );
						}
					}break;

					case 'off':{
						$content = '';
					}break;
				}
				$content = str_replace( "\n", '<br>', $content );
				$datas['attributes']['data-term-content'] = $content;
				// If we have enough data to take the excerpt or autogen one...
			} else {
				$datas['attributes']['data-termid'] = $term['ID'];
				if ( is_null( $text ) && isset( $term['post_title'] ) ) {
					$text = $term['post_title'];
				}
			}// End if().

			$href = 'javascript::void(0)';
			if ( $datas['options']['termlinkopt'] != 'none' ) {// If theere need a link
				if ( $term['post_name'] ) {
					$href   = apply_filters( 'ithoughts_tt_gl_term_link', \ithoughts\v5_0\Toolbox::get_permalink_light( $term, 'glossary' ) );
				} else {
					$href   = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink( $term['ID'] ) );
				}
			}
			$datas['linkAttrs']['href'] = $href;

			$link;
			if ( ! (isset( $datas['linkAttrs']['title'] ) && $datas['linkAttrs']['title']) ) {
				$datas['linkAttrs']['title'] = $text;
			}
			if ( $datas['options']['termlinkopt'] == 'blank' ) {
				$datas['linkAttrs']['target'] = '_blank';
			}

			$linkArgs = \ithoughts\v5_0\Toolbox::concat_attrs( $datas['linkAttrs'] );
			$linkElement   = '<a ' . $linkArgs . '>' . $text . '</a>';

			$datas['attributes']['class'] = 'itg-glossary' . ((isset( $datas['attributes']['class'] ) && $datas['attributes']['class']) ? ' ' . $datas['attributes']['class'] : '');
			$args = \ithoughts\v5_0\Toolbox::concat_attrs( $datas['attributes'] );

			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			$backbone->add_script( 'qtip' );

			return '<span ' . $args . '>' . $linkElement . '</span>';
		}

		public function ithoughts_tt_gl_get_glossary_term_element( $term, $text = null, $options = array() ) {
			if ( $term instanceof \ithoughts\v1_0\PseudoPost ) {
				$term = $term->to_WP_Post();
			}
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			$datas = apply_filters( 'ithoughts_tt_gl-split-args', $options );
			if ( gettype( $term ) == 'array' ) {
				return $this->get_glossary_term_element_array( $term, $text, $datas );
			}

			// Dispatch getting right term in right lang if there is
			if ( function_exists( 'icl_object_id' ) ) {
				if ( isset( $datas['handled']['disable_auto_translation'] ) && $datas['handled']['disable_auto_translation'] ) {
					$datas['attributes']['data-disable_auto_translation'] = 'true';
				}
				if ( ! (isset( $datas['handled']['disable_auto_translation'] ) && $datas['handled']['disable_auto_translation']) ) {
					if ( is_numeric( $term ) ) {
						$term = get_post( apply_filters('ithoughts_tt_gl_wpml_get_term_current_language', intval($term)) );
					} else if ( ! ($term instanceof \WP_Post) ) {
						// Error
						return $text;
					} else if ( $term instanceof \WP_Post ) {
						$term = get_post( apply_filters('ithoughts_tt_gl_wpml_get_term_current_language', $term->ID) );
					}
				} else {
					if ( is_numeric( $term ) ) {
						$term = get_post( $term );
					} else if ( ! ($term instanceof \WP_Post) ) {
						// Error
						return $text;
					}
				}
			} else {
				if ( is_numeric( $term ) ) {
					$term = get_post( $term );
				} else if ( ! ($term instanceof \WP_Post) ) {
					// Error
					return $text;
				}
			}

			if ( $backbone->get_option( 'staticterms' ) ) {
				if ( ! ($term instanceof \WP_Post) ) {
					// Error
					return $text;
				}
				if ( is_null( $text ) ) {
					$text = $term->post_title;
				}

				$datas['attributes']['data-term-title'] = esc_attr( $term->post_title );

				$content;
				$termcontent;
				if ( isset( $datas['attributes']['termcontent'] ) ) {
					$termcontent = $datas['attributes']['termcontent'];
					unset( $datas['attributes']['data-termcontent'] );
				} else {
					$termcontent = $datas['options']['termcontent'];
				}

				switch ( $termcontent ) {
					case 'full':{
						$content = apply_filters( 'ithoughts_tt_gl-term-content', $term );
					}break;

					case 'excerpt':{
						$content = apply_filters( 'ithoughts_tt_gl-term-excerpt', $term );
					}break;

					case 'off':{
						$content = '';
					}break;
				}
				$content = str_replace( "\n", '<br>', $content );
				$datas['attributes']['data-term-content'] = $content;
			} else {
				if ( $datas['options']['termcontent'] ) {
					$datas['attributes']['data-termcontent'] = $datas['options']['termcontent'];
				}
				if ( $term instanceof \WP_Post ) {
					$datas['attributes']['data-termid'] = $term->ID;
					if ( is_null( $text ) ) {
						$text = get_the_title( $term );
					}
				}
			}// End if().

			if ( ! isset( $datas['linkAttrs']['href'] ) ) {
				$href = 'javascript::void(0)';
				if ( $datas['options']['termlinkopt'] != 'none' ) { // If theere need a link
					$href   = apply_filters( 'ithoughts_tt_gl_term_link', \ithoughts\v5_0\Toolbox::get_permalink_light( $term,'glossary' ) );
				}
				$datas['linkAttrs']['href'] = $href;
			}

			$link;
			if ( ! (isset( $datas['linkAttrs']['title'] ) && $datas['linkAttrs']['title']) ) {
				$datas['linkAttrs']['title'] = $text;
			}
			if ( $datas['options']['termlinkopt'] == 'blank' ) {
				$datas['linkAttrs']['target'] = '_blank';
			}

			$linkArgs = \ithoughts\v5_0\Toolbox::concat_attrs( $datas['linkAttrs'] );
			$linkElement   = '<a ' . $linkArgs . '>' . $text . '</a>';

			$datas['attributes']['class'] = 'itg-glossary' . ((isset( $datas['attributes']['class'] ) && $datas['attributes']['class']) ? ' ' . $datas['attributes']['class'] : '');
			$args = \ithoughts\v5_0\Toolbox::concat_attrs( $datas['attributes'] );

			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			$backbone->add_script( 'qtip' );

			return '<span ' . $args . '>' . $linkElement . '</span>';
		}

		public function parse_pseudo_links_to_shortcode( $data ) {
			$data['post_content'] = preg_replace( '/<a\s+?data-ithoughts_tt_gl-glossary-slug=\\\\"(.+?)\\\\".*>(.*?)<\/a>/', '[itg-glossary slug="$1"]$2[/itg-glossary]', $data['post_content'] );
			return $data;
		}

		public function convert_shortcodes( $post_id ) {
			$post = get_post( $post_id );
			$post->post_content = preg_replace( '/\[itg-glossary(.*?)(?: slug="(.+?)")(.*?)\](.+?)\[\/itg-glossary\]/', '<a data-ithoughts_tt_gl-glossary-slug="$2" $1 $3>$4</a>', $post->post_content );
			return $post;
		}

		/**
		 * If post has glossary shortcode in it when it is saved, mark the post as needing be updated
		 */
		public function save_post_check_for_glossary_usage( $post_id, $post ) {
			$glossary_options = get_option( 'iThoughtsTooltipGlossary' );
			$termusage        = isset( $glossary_options['termusage'] )  ? $glossary_options['termusage']   : 'on';

			if ( $termusage != 'on' ) {
				return $post_id;
			}

			if ( ! wp_is_post_revision( $post_id ) ) {
				if ( strpos( $post->post_content,'[itg-glossary ' ) !== false || strpos( $post->post_content,'[itg-glossary]' ) !== false ) {
					update_post_meta( $post_id, 'ithoughts_tt_gl_update_term_usage', current_time( 'mysql' ) );
				} else {
					if ( get_post_meta( $post_id, 'ithoughts_tt_gl_has_terms', $single = true ) ) {
						// Also posts that used to have terms should be updated.
						delete_post_meta( $post_id, 'ithoughts_tt_gl_has_terms' );
						update_post_meta( $post_id, 'ithoughts_tt_gl_update_term_usage', current_time( 'mysql' ) );
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
		public function glossary_usage_reset_for_post() {
			global $post;
			if ( is_singular() && get_post_meta( $post->ID, 'ithoughts_tt_gl_update_term_usage' ) ) :
				// Find all glossary terms that have this post noted.
				$args = array(
				'post_type'   => 'glossary',
				'numberposts' => -1,
				'post_status' => 'publish',
				'meta_query'  => array( array(
					'key'   => 'ithoughts_tt_gl_term_used',
					'value' => $post->ID,
					'type'  => 'DECIMAL',
				),
				),
				);
				$terms = get_posts( $args );
				foreach ( $terms as $term ) :
					// Delete the meta entry
					delete_post_meta( $term->ID, 'ithoughts_tt_gl_term_used', $post->ID );
			endforeach;
			endif;
		}

		/** */
		public function glossary_remove_update_marker() {
			/*
			global $post;
			if( is_singular() && get_post_meta( $post->ID, 'ithoughts_tt_gl_update_term_usage') ):
			delete_post_meta( $post->ID, 'ithoughts_tt_gl_update_term_usage' );
			endif;*/
		}

		/** */
		public function glossary_shortcode( $atts, $text = '' ) {

			if ( ! isset( $atts['glossary-id'] ) || ! $atts['glossary-id'] ) {
				return $text;
			}
			$id = $atts['glossary-id'];
			return apply_filters( 'ithoughts_tt_gl_get_glossary_term_element', $id, $text, $atts );
		}

		public function termContent( $post ) {
			return do_shortcode( apply_filters( 'the_content', $post->post_content ) );
		}
	}
}// End if().
