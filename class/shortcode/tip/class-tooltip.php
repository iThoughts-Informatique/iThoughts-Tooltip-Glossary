<?php

/**
 * @file Class file for HTML tooltips shortcode
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

namespace ithoughts\tooltip_glossary\shortcode\tip;

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );
	wp_die( 'Forbidden' );// Exit if accessed directly
}


if ( ! class_exists( __NAMESPACE__ . '\\Tooltip' ) ) {
	class Tooltip extends Tip {
		public function __construct() {
			// Shortcode
			add_shortcode( 'itg-tooltip', array( &$this, 'tooltip_shortcode' ) );
			add_shortcode( 'tooltip', array( &$this, 'tooltip_shortcode' ) );

			// Help functions..
			add_action( 'wp_insert_post_data',  array( &$this, 'parse_pseudo_links_to_shortcode' ) );
			add_action( 'edit_post',  array( &$this, 'convert_shortcodes' ) );

			add_filter( 'ithoughts_tt_gl_tooltip', array( &$this, 'generate_tooltip' ), 1000, 3 );
		}

		public function shortcode_to_tinymce_dom($str){
			return preg_replace( '/<a\s+?data-tooltip-content=\\\\"(.+?)\\\\".*>(.*?)<\/a>/', '[itg-tooltip content="$1"]$2[/itg-tooltip]', $str );
		}

		public function tinymce_dom_to_shortcode($str){
			return preg_replace( '/\[itg-tooltip(.*?)(?: content="(.+?)")(.*?)\](.+?)\[\/itg-tooltip\]/', '<a data-tooltip-content="$2" $1 $3>$4</a>', $str );
		}

		public function parse_pseudo_links_to_shortcode( $data ) {
			$data['post_content'] = $this->shortcode_to_tinymce_dom( $data['post_content'] );
			return $data;
		}

		public function convert_shortcodes( $post_id, $post = NULL ) {
			if(NULL === $post){
				$post = get_post( $post_id );
			}
			$post->post_content = $this->tinymce_dom_to_shortcode( $post->post_content );
			return $post;
		}

		/** */
		public function tooltip_shortcode( $attributes, $text = '' ) {
			$tip_content = (isset( $attributes['tooltip-content'] ) && is_string($attributes['tooltip-content'])) ? $attributes['tooltip-content'] : $text;
			unset($attributes['tooltip-content']);

			return apply_filters( 'ithoughts_tt_gl_tooltip', $text, $tip_content, $attributes );
		}

		/**
		 * Create a tooltip HTML markup with given text content $text, tooltip content $tip & provided options $options
		 *
		 * @author Gerkin
		 * @param  string  $text       Text content of the highlighted word
		 * @param  string  $tip_content        Text content into the tooltip
		 * @param  [array] $attributes Attributes & other options modifying the behaviour of the HTML generation. Usually provided by filter `ithoughts_tt_gl-split-attributes`
		 * @return string The formatted HTML markup
		 */
		public function generate_tooltip( $text, $tip_content, $attributes = array() ) {
			// Span that qtip finds
			$attributes['class'] = 'itg-tooltip' . ((isset( $attributes['class'] ) && $attributes['class']) ? ' ' . $attributes['class'] : '');
			
			$datas = apply_filters( 'ithoughts_tt_gl-split-attributes', $attributes );
			$datas['attributes']['tooltip-content'] = esc_attr( do_shortcode( $tip_content) );

			return $this->generate_tip($text, $datas);
		}
	}
}// End if().
