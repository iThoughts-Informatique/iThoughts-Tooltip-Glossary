<?php
/**
 * Declares filters & shortcodes for gloss components
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


if ( ! class_exists( __NAMESPACE__ . '\\Gloss' ) ) {
	require_once(dirname(__FILE__).'/class-tip.php');
	/**
	 * Main class for iThoughts Tooltip Glossary gloss shortcodes & filters
	 *
	 * @author Gerkin
	 */
	class Gloss extends Tip {
		const GLOSS_MODE_NONE = 'none';
		const GLOSS_MODE_EXCERPT = 'excerpt';
		const GLOSS_MODE_FULL = 'full';

		/**
		 * Register filters, actions & shortcodes
		 *
		 * @author Gerkin
		 */
		public function __construct($backbone) {
			parent::__construct($backbone);
			// Shortcodes.
			add_shortcode( 'itg-gloss', array( &$this, 'gloss_shortcode' ) );

			// Filters.
			add_filter( 'ithoughts_tt_gl_gloss', array( $this, 'generate_gloss' ), 10, 3 );
			add_filter( 'ithoughts_tt_gl_gloss_content', array( $this, 'gloss_content' ) );
			add_filter( 'ithoughts_tt_gl_gloss_excerpt', array( &$this, 'gloss_excerpt' ) );
			add_filter( 'ithoughts_tt_gl_gloss_attributes', array( &$this, 'gloss_attributes' ), 10, 2 );
		}

		/** */
		public function gloss_shortcode( $attributes, $text = '' ) {
			$id = null;
			if(is_array($attributes)){
				$id = Toolbox::pick_option( $attributes, 'gloss-id', null );
			} else {
				$attributes = array();
			}
			if($id === null){
				$id = sanitize_title($text);
			} elseif(is_numeric($id)){
				$id = intval($id);
			} elseif(is_string($id)){
				$id = sanitize_title($id);
			}
			return apply_filters( 'ithoughts_tt_gl_gloss', $text, $id, $attributes );
		}

		/**
		 * @description Returns the excerpt sized for tooltip of the given post
		 * @author Gerkin
		 * @param  [WP_Post] \WP_Post $term Glossary term to extract the excerpt from
		 * @return [string] The generated excerpt
		 */
		public function gloss_excerpt( \WP_Post $term ) {
			if ( strlen( $term->post_excerpt ) > 0 ) {
				$content = wpautop( $term->post_excerpt );
			} else {
				$content = wp_trim_words( $term->post_content, 25, '...' );
			}
			$content = strip_shortcodes( $content );
			$content = str_replace( "\n", '<br/>', $content );
			return $content;
		}

		public function gloss_content( $post ) {
			return do_shortcode( apply_filters( 'the_content', $post->post_content ) );
		}

		public function gloss_attributes( $contenttype, \WP_Post $term = null ){
			$attributes = array();
			if($term instanceof \WP_Post){
				$attributes['title'] = get_the_title( $term );
				if ( $this->backbone->get_option('staticterms') ) {
					switch ( $contenttype ) {
						case 'full':{
							$attributes['gloss-content'] = apply_filters( 'ithoughts_tt_gl_gloss_content', $term );
						}break;

						case 'excerpt':{
							$attributes['gloss-content'] = apply_filters( 'ithoughts_tt_gl_gloss_excerpt', $term );
						}break;
					}
				} else {
					if($this->backbone->get_option('gloss-contenttype') !== $contenttype){
						$attributes['gloss-contenttype'] = $contenttype;
					}
					$attributes['gloss-id'] = $term->ID;
				}
			} else {
				$attributes['title'] = __('Not found', 'ithoughts-tooltip-glossary');
				if($contenttype !== 'off'){
					$attributes['gloss-content'] = __('Sorry, this gloss does not exists.', 'ithoughts-tooltip-glossary');
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
				$this->backbone->log( \ithoughts\v6_0\LogLevel::WARN, "Failed to find term that resolved to id $id, related with", $old_term );
				$term = null;
			}
			return $term;
		}

		public function generate_gloss( $text, $term, $attributes = array() ) {
			$term = $this->get_standardized_term($term, array(
				'allowTranslate' => !(isset( $attributes['disable_auto_translation'] ) && $attributes['disable_auto_translation']),
			));

			// Set classes.
			$attributes['class'] = 'itg-gloss' . ((isset( $attributes['class'] ) && $attributes['class']) ? ' ' . $attributes['class'] : '');
			if(!$term instanceof \WP_Post){
				$attributes['class'] .= ' itg-invalid';
			}

			$datas = apply_filters( 'ithoughts_tt_gl-split-attributes', $attributes );
			$serverSide = array_replace_recursive(array(), $this->backbone->get_serverside_options(), $datas['serverSide']);

			// Dispatch getting right term in right lang if there is
			if ( function_exists( 'icl_object_id' ) && !$this->backbone->get_option('staticterms') ) {
				if ( isset( $datas['handled']['disable_auto_translation'] ) && $datas['handled']['disable_auto_translation'] ) {
					$datas['attributes']['disable_auto_translation'] = 'true';
				}
			}

			unset($datas['clientSide']['gloss-contenttype']);
			$contenttype = apply_filters('ithoughts_tt_gl_gloss_attributes', $serverSide['gloss-contenttype'], $term);
			$datas['attributes'] = array_replace_recursive($contenttype, $datas['attributes']);

			if ( is_null( $text ) || strlen($text) === 0 ) {
				$text = $contenttype['title'];
			}

			// Set the link (if not overriden)
			if ( ! isset( $datas['attributes']['href'] ) ) {
				if ( $serverSide['termlinkopt'] != 'none' ) { // If there need a link
					if ( null !== $term ) {
						$datas['attributes']['href'] = apply_filters( 'ithoughts_tt_gl_term_link', \ithoughts\v6_0\Toolbox::get_permalink_light( $term, 'glossary' ) );
					} else {
						$this->backbone->log( \ithoughts\v6_0\LogLevel::WARN, "Tried to call get_permalink_light on NULL term with text \"$text\"." );
					}
				}
			}

			return $this->generate_tip( $text, $datas );
		}
	}
}// End if().
