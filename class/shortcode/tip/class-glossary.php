<?php
/**
 * Declares filters & shortcodes for glossary components
 *
 * @file Glossary tooltip shortcode class file
 *
 * @author Gerkin
 * @copyright 2016 iThoughts.io
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

namespace ithoughts\tooltip_glossary\shortcode\tip;

use \ithoughts\v6_0\Toolbox as Toolbox;

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );
	wp_die( 'Forbidden' );// Exit if accessed directly.
}


if ( ! class_exists( __NAMESPACE__ . '\\Glossary' ) ) {
	/**
	 * Main class for iThoughts Tooltip Glossary glossary shortcodes & filters
	 *
	 * @author Gerkin
	 */
	class Glossary extends Tip {

		/**
		 * Register filters, actions & shortcodes
		 *
		 * @author Gerkin
		 */
		public function __construct() {
			// Shortcodes.
			add_shortcode( 'itg-glossary', array( &$this, 'glossary_shortcode' ) );
			add_shortcode( 'glossary', array( &$this, 'glossary_shortcode' ) );

			// Actions.
			add_action( 'save_post',  array( &$this, 'save_post_check_for_glossary_usage' ), 20, 2 );
			add_action( 'wp_insert_post_data',  array( &$this, 'parse_pseudo_links_to_shortcode' ) );
			add_action( 'edit_post',  array( &$this, 'convert_shortcodes' ) );
			add_action( 'get_header', array( &$this, 'glossary_usage_reset_for_post' ) );
			add_action( 'wp_footer',  array( &$this, 'glossary_remove_update_marker' ) );

			// Filters.
			add_filter( 'ithoughts_tt_gl_glossary', array( $this, 'generate_glossary' ), 10, 3 );
			add_filter( 'ithoughts_tt_gl_glossary_content', array( $this, 'glossary_content' ) );
			add_filter( 'ithoughts_tt_gl_glossary_excerpt', array( &$this, 'glossary_excerpt' ) );
			add_filter( 'ithoughts_tt_gl_glossary_get_term_attributes', array( &$this, 'get_term_attributes' ), 10, 2 );
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
		public function glossary_shortcode( $attributes, $text = '' ) {
			$id = null;
			if(is_array($attributes)){
				$id = Toolbox::pick_option( $attributes, 'glossary-id', null );
			}
			if($id === null){
				$id = sanitize_title($text);
			} elseif(is_numeric($id)){
				$id = intval($id);
			} elseif(is_string($id)){
				$id = sanitize_title($id);
			}
			return apply_filters( 'ithoughts_tt_gl_glossary', $text, $id, $attributes );
		}

		/**
		 * @description Returns the excerpt sized for tooltip of the given post
		 * @author Gerkin
		 * @param  [WP_Post] \WP_Post $term Glossary term to extract the excerpt from
		 * @return [string] The generated excerpt
		 */
		public function glossary_excerpt( \WP_Post $term ) {
			if ( strlen( $term->post_excerpt ) > 0 ) {
				$content = wpautop( $term->post_excerpt );
			} else {
				$content = wp_trim_words( $term->post_content, 25, '...' );
			}
			$content = strip_shortcodes( $content );
			$content = str_replace( "\n", '<br/>', $content );
			return $content;
		}

		public function glossary_content( $post ) {
			return do_shortcode( apply_filters( 'the_content', $post->post_content ) );
		}

		public function get_term_attributes( $termcontent, \WP_Post $term = null ){
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

			$attributes = array();
			if($term instanceof \WP_Post){
				$attributes['title'] = get_the_title( $term );
				if ( $backbone->get_option('staticterms') ) {
					switch ( $termcontent ) {
						case 'full':{
							$attributes['glossary-content'] = apply_filters( 'ithoughts_tt_gl_glossary_content', $term );
						}break;

						case 'excerpt':{
							$attributes['glossary-content'] = apply_filters( 'ithoughts_tt_gl_glossary_excerpt', $term );
						}break;
					}
				} else {
					if($backbone->get_option('termcontent') !== $termcontent){
						$attributes['termcontent'] = $termcontent;
					}
					$attributes['glossary-id'] = $term->ID;
				}
			} else {
				$attributes['title'] = __('Not found', 'ithoughts-tooltip-glossary');
				if($termcontent !== 'off'){
					$attributes['glossary-content'] = __('Sorry, this glossary does not exists.', 'ithoughts-tooltip-glossary');
				}
			}
			return $attributes;
		}

		private function get_standardized_term($term, $options = array('allowTranslate' => true)){
			$old_term = $term;
			if ( $term instanceof \ithoughts\v1_0\PseudoPost ) {
				$term = $term->to_WP_Post();
			}
			$id = null;
			if ( is_numeric( $term ) ) {
				$id = intval($term);
			} elseif ( $term instanceof \WP_Post ) {
				$id = $term->ID;
			} elseif ( gettype( $term ) == 'array' ) {
				$id = $term['ID'];
			} elseif(is_string($term)){
				global $wpdb;
				$id = $wpdb->get_var("SELECT ID FROM $wpdb->posts WHERE post_name ='".$term."'");
				// Check DB result
				if(is_numeric($id)){
					$id = intval($id);
				} else {
					$id = NULL;
				}
			}
			if($id !== null){
				if ( function_exists( 'icl_object_id' ) && isset($options['allowTranslate']) && $options['allowTranslate'] === true) {
					$id = apply_filters( 'wpml_object_id', $id, 'glossary', true, apply_filters( 'wpml_current_language', null ) );
				}
				$term = get_post( $id );
			} else {
				$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
				$backbone->log( \ithoughts\v6_0\LogLevel::WARN, "Failed to find term that resolved to id $id, related with", $old_term );
				$term = null;
			}
			return $term;
		}

		public function generate_glossary( $text, $term, $attributes = array() ) {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

			$term = $this->get_standardized_term($term, array(
				'allowTranslate' => !(isset( $attributes['disable_auto_translation'] ) && $attributes['disable_auto_translation']),
			));

			// Set classes.
			$attributes['class'] = 'itg-glossary' . ((isset( $attributes['class'] ) && $attributes['class']) ? ' ' . $attributes['class'] : '');
			if(!$term instanceof \WP_Post){
				$attributes['class'] .= ' itg-notfound';
			}

			$datas = apply_filters( 'ithoughts_tt_gl-split-attributes', $attributes );
			$serverSide = array_replace_recursive(array(), $backbone->get_serverside_options(), $datas['serverSide']);

			// Dispatch getting right term in right lang if there is
			if ( function_exists( 'icl_object_id' ) && !$backbone->get_option('staticterms') ) {
				if ( isset( $datas['handled']['disable_auto_translation'] ) && $datas['handled']['disable_auto_translation'] ) {
					$datas['attributes']['disable_auto_translation'] = 'true';
				}
			}

			unset($datas['clientSide']['termcontent']);
			$termcontent = apply_filters('ithoughts_tt_gl_glossary_get_term_attributes', $serverSide['termcontent'], $term);
			$datas['attributes'] = array_replace_recursive($termcontent, $datas['attributes']);

			if ( is_null( $text ) || strlen($text) === 0 ) {
				$text = $termcontent['title'];
			}

			// Set the link (if not overriden)
			if ( ! isset( $datas['attributes']['href'] ) ) {
				if ( $serverSide['termlinkopt'] != 'none' ) { // If there need a link
					if ( null !== $term ) {
						$datas['attributes']['href'] = apply_filters( 'ithoughts_tt_gl_term_link', \ithoughts\v6_0\Toolbox::get_permalink_light( $term, 'glossary' ) );
					} else {
						$backbone->log( \ithoughts\v6_0\LogLevel::WARN, "Tried to call get_permalink_light on NULL term with text \"$text\"." );
					}
				}
			}

			return $this->generate_tip( $text, $datas );
		}
	}
}// End if().
