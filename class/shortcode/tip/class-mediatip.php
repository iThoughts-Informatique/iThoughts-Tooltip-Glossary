<?php

/**
 * @file Class file for mediatip shortcode
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


if ( ! class_exists( __NAMESPACE__ . '\\Mediatip' ) ) {
	class Mediatip extends Tip {
		public function __construct() {
			// Shortcode
			add_shortcode( 'itg-mediatip', array( &$this, 'mediatip_shortcode' ) );
			add_shortcode( 'mediatip', array( &$this, 'mediatip_shortcode' ) );

			// Actions.
			add_action( 'wp_insert_post_data',  array( &$this, 'parse_pseudo_links_to_shortcode' ) );
			add_action( 'edit_post',  array( &$this, 'convert_shortcodes' ) );

			// Filters.
			add_filter( 'mediatip-localimage',      array( $this, 'transform_source_localimage' ), 10, 1 );
			add_filter( 'mediatip-webimage',        array( $this, 'transform_source_webimage' ), 10, 1 );
			add_filter( 'mediatip-webvideo',        array( $this, 'transform_source_webvideo' ), 10, 1 );
			add_filter( 'ithoughts_tt_gl_mediatip', array( $this, 'generate_mediatip' ), 10, 5 );
		}

		public function parse_pseudo_links_to_shortcode( $data ) {
			$data['post_content'] = preg_replace( '/<a(?=[^>]*data-type="ithoughts-tooltip-glossary-mediatip")(.*?)(?:(?:(?:data-type="([^"]*)")|(?:data-link="([^"]*)")|(?:data-image="([^"]*)")|(?:data-imageid="([^"]*)"))\s*)+(.*?)>(.*?)<\/a>/', '  [itg-mediatip link="$3" image="$4" imageid="$5" $1 $6]$7[/itg-mediatip]', $data['post_content'] );
			return $data;
		}

		public function convert_shortcodes( $post_id ) {
			$post = get_post( $post_id );
			$post->post_content = preg_replace( '/\[itg-mediatip(.*?)(?:(?:(?:link="([^"]*)")|(?:image="([^"]*)")|(?:imageid="([^"]*)"))\s*)+(.*?)\](.*?)\[\/itg-mediatip\]/', '<a data-type="ithoughts-tooltip-glossary-mediatip" data-link="$2" data-image="$3" data-imageid="$4" $1 $5]$6</a>', $post->post_content );
			return $post;
		}

		public function transform_source_localimage($source){
			if(is_numeric($source)){
				$source = wp_get_attachment_image_src(intval($source));
				if($source){
					return $source[0];
				}
			} else {
				$json = \ithoughts\v6_0\Toolbox::decode_json_attr( $source, true );
				// Compat with old format
				if ( $json == null ) {
					$json = json_decode( str_replace( '&quot;', '"', $source ), true );
				}
				var_dump($json);
				return htmlentities( $json['url'] );
			}
			return false;
		}

		public function transform_source_webimage($source){
			return htmlentities($source );
		}

		public function transform_source_webvideo($source){
			return $source;
		}

		/** */
		public function mediatip_shortcode( $attributes, $text = '' ) {
			$source_type = isset( $attributes['mediatip-type'] ) ? $attributes['mediatip-type'] : null;
			unset($attributes['mediatip-type']);
			$source = isset( $attributes['mediatip-source']) ? $attributes['mediatip-source'] : null;
			unset($attributes['mediatip-source']);
			$caption = isset( $attributes['mediatip-caption']) ? $attributes['mediatip-caption'] : false;
			unset($attributes['mediatip-caption']);

			return apply_filters( 'ithoughts_tt_gl_mediatip', $text, $source_type, $source, $caption, $attributes );
		}

		public function generate_mediatip( $text, $source_type, $source, $caption = false, $attributes = array() ) {
			// Set classes.
			$attributes['class'] = 'itg-mediatip' . ((isset( $attributes['class'] ) && $attributes['class']) ? ' ' . $attributes['class'] : '');
			if($caption){
				$attributes['mediatip-caption'] = $caption;
			}

			$datas = apply_filters( 'ithoughts_tt_gl-split-attributes', $attributes );

			$filter_name = "mediatip-$source_type";
			if($source_type !== false && has_filter($filter_name) && $source !== null){
				$source = apply_filters($filter_name, $source);
				$datas['attributes']['mediatip-source'] = $source;
				$datas['attributes']['mediatip-type'] = $source_type;
			} else {
				$datas['attributes']['class'] .= ' itg-notfound';
			}

			return $this->generate_tip( $text, $datas );
		}
	}
}// End if().
