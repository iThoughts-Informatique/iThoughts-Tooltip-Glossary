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

namespace ithoughts\tooltip_glossary\shortcode;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


if ( ! class_exists( __NAMESPACE__ . '\\Tooltip' ) ) {
	class Tooltip extends \ithoughts\v1_0\Singleton {
		public function __construct() {
			// Shortcode
			add_shortcode( 'itg-tooltip', array( &$this, 'tooltip_shortcode' ) );
			add_shortcode( 'tooltip', array( &$this, 'tooltip_shortcode' ) );

			// Help functions..
			add_action( 'wp_insert_post_data',  array( &$this, 'parse_pseudo_links_to_shortcode' ) );
			add_action( 'edit_post',  array( &$this, 'convert_shortcodes' ) );

			add_filter( 'ithoughts-tt-gl_tooltip', array( &$this, 'generateTooltip' ), 1000, 3 );
		}

		public function parse_pseudo_links_to_shortcode( $data ) {
			$data['post_content'] = preg_replace( '/<a\s+?data-tooltip-content=\\\\"(.+?)\\\\".*>(.*?)<\/a>/', '[itg-tooltip content="$1"]$2[/itg-tooltip]', $data['post_content'] );
			return $data;
		}

		public function convert_shortcodes( $post_id ) {
			$post = get_post( $post_id );
			$post->post_content = preg_replace( '/\[itg-tooltip(.*?)(?: content="(.+?)")(.*?)\](.+?)\[\/itg-tooltip\]/', '<a data-tooltip-content="$2" $1 $3>$4</a>', $post->post_content );
			return $post;
		}

		/** */
		public function tooltip_shortcode( $atts, $text = '' ) {
			$datas = apply_filters( 'ithoughts_tt_gl-split-args', $atts );

			$content = (isset( $datas['handled']['tooltip-content'] ) && $datas['handled']['tooltip-content']) ? $datas['handled']['tooltip-content'] : '';

			return apply_filters( 'ithoughts-tt-gl_tooltip', $text, $content, $datas );
		}

		/**
		 * Create a tooltip HTML markup with given text content $text, tooltip content $tip & provided options $options
		 *
		 * @author Gerkin
		 * @param  string  $text    Text content of the highlighted word
		 * @param  string  $tip     Text content into the tooltip
		 * @param  [array] $options Attributes & other options modifying the behaviour of the HTML generation. Usually provided by filter `ithoughts_tt_gl-split-args`
		 * @return string The formatted HTML markup
		 */
		public function generateTooltip( $text, $tip, $options = array(
			'linkAttrs' => array(),
			'attributes' => array(),
		) ) {
			// Set text to default to content. This allows syntax like: [glossary]Cheddar[/glossary]
			if ( empty( $tip ) ) { $tip = $text;
			}

			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			$backbone->add_script( 'qtip' );

			// qtip jquery data
			if ( ! (isset( $options['linkAttrs']['href'] ) && $options['linkAttrs']['href']) ) {
				$options['linkAttrs']['href'] = 'javascript:void(0);';
			}
			if ( ! (isset( $datas['linkAttrs']['title'] ) && $options['linkAttrs']['title']) ) {
				$options['linkAttrs']['title'] = esc_attr( $text );
			}

			$linkArgs = \ithoughts\v5_0\Toolbox::concat_attrs( $options['linkAttrs'] );
			$link   = '<a ' . $linkArgs . '>' . $text . '</a>';
			// Span that qtip finds
			$options['attributes']['class'] = 'itg-tooltip' . ((isset( $options['attributes']['class'] ) && $options['attributes']['class']) ? ' ' . $options['attributes']['class'] : '');
			$args = \ithoughts\v5_0\Toolbox::concat_attrs( $options['attributes'] );
			$span = '<span ' . $args . ' data-tooltip-content="' . do_shortcode( $tip ) . '">' . $link . '</span>';

			return $span;
		}
	}
}// End if().
