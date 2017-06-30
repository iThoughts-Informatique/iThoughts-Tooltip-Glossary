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

namespace ithoughts\tooltip_glossary\shortcode;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


if ( ! class_exists( __NAMESPACE__ . '\\Mediatip' ) ) {
	class Mediatip extends \ithoughts\v1_0\Singleton {
		public function __construct() {
			// Shortcode
			add_shortcode( 'itg-mediatip', array( &$this, 'mediatip_shortcode' ) );
			add_shortcode( 'mediatip', array( &$this, 'mediatip_shortcode' ) );

			// Help functions..
			add_action( 'wp_insert_post_data',  array( &$this, 'parse_pseudo_links_to_shortcode' ) );
			add_action( 'edit_post',  array( &$this, 'convert_shortcodes' ) );
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

		/** */
		public function mediatip_shortcode( $atts, $text = '' ) {
			$datas = apply_filters( 'ithoughts_tt_gl-split-args', $atts );

			$mediatipTypes = array( 'localimage','webimage','webvideo' );
			if ( ! isset( $datas['handled']['mediatip-type'] ) ) {
				return $text;
			}
			$mediatipType = $datas['handled']['mediatip-type'];
			if ( ! in_array( $mediatipType, $mediatipTypes ) ) {
				return $text;
			} else {
				$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
				$backbone->add_script( 'qtip' );
			}

			$datas['attributes']['class'] = 'itg-mediatip' . ((isset( $datas['attributes']['class'] ) && $datas['attributes']['class']) ? ' ' . $datas['attributes']['class'] : '');
			$datas['linkAttrs']['title'] = esc_attr( $text );

			switch ( $mediatipType ) {
				case $mediatipTypes[0]:{
					$dat = \ithoughts\v5_0\Toolbox::decode_json_attr( $datas['handled']['mediatip-content'], true );
					// Compat with old format
					if ( $dat == null ) {
						$dat = json_decode( str_replace( '&quot;', '"', $datas['handled']['mediatip-content'] ), true );
					}
					$datas['attributes']['data-mediatip-image'] = htmlentities( $dat['url'] );

					if ( ! (isset( $datas['linkAttrs']['href'] ) && $datas['linkAttrs']['href']) ) {
						$datas['linkAttrs']['href'] = 'javascript:void(0);';
					}

					$linkArgs = \ithoughts\v5_0\Toolbox::concat_attrs( $datas['linkAttrs'] );
					$linkElement   = '<a ' . $linkArgs . '>' . $text . '</a>';

					$args = \ithoughts\v5_0\Toolbox::concat_attrs( $datas['attributes'] );
					// Span that qtip finds
					$span = '<span ' . $args . '>' . $linkElement . '</span>';
					return $span;
				} break;

				case $mediatipTypes[1]:{
					$datas['attributes']['data-mediatip-image'] = htmlentities( $datas['handled']['mediatip-content'] );

					if ( ! (isset( $datas['linkAttrs']['href'] ) && $datas['linkAttrs']['href']) ) {
						$datas['linkAttrs']['href'] = 'javascript:void(0);';
					}

					$linkArgs = \ithoughts\v5_0\Toolbox::concat_attrs( $datas['linkAttrs'] );
					$linkElement   = '<a ' . $linkArgs . '>' . $text . '</a>';

					$args = \ithoughts\v5_0\Toolbox::concat_attrs( $datas['attributes'] );
					// Span that qtip finds
					$span = '<span ' . $args . '>' . $linkElement . '</span>';
					return $span;
				} break;

				case $mediatipTypes[2]:{
					$datas['attributes']['data-mediatip-html'] = $datas['handled']['mediatip-content'];

					if ( ! (isset( $datas['linkAttrs']['href'] ) && $datas['linkAttrs']['href']) ) {
						$datas['linkAttrs']['href'] = 'javascript:void(0);';
					}

					$linkArgs = \ithoughts\v5_0\Toolbox::concat_attrs( $datas['linkAttrs'] );
					$linkElement   = '<a ' . $linkArgs . '>' . $text . '</a>';

					$args = \ithoughts\v5_0\Toolbox::concat_attrs( $datas['attributes'] );
					// Span that qtip finds
					$span = '<span ' . $args . '>' . $linkElement . '</span>';
					return $span;
				} break;

				default:{
					return $text;
				}break;
			}// End switch().
		}
	}
}// End if().
