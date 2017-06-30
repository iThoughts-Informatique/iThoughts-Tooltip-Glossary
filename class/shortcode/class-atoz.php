<?php

/**
 * @file Class file for A-to-Z lists
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

if ( ! class_exists( __NAMESPACE__ . '\\AtoZ' ) ) {
	class AtoZ extends GlossaryList {
		public function __construct() {
			add_shortcode( 'glossary_atoz', array( $this, 'glossary_atoz' ) );
		}

		public function glossary_atoz( $atts, $content = '' ) {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

			$out = $this->init_list_atts( $atts );
			$data = &$out['data'];
			$linkdata = &$out['linkdata'];

			// Sanity check the list of letters (if set by user).
			$alphas = $this->filter_alphas_to_array( isset( $data['handled'] ) && isset( $data['handled']['alpha'] ) && $data['handled']['alpha'] ? $data['handled']['alpha'] : null );
			// Checks for partial listing options (on first letter, or group)
			$group_ids = $this->filter_groupIds_to_array( isset( $data['handled'] ) && isset( $data['handled']['group'] ) ? $data['handled']['group'] : null );

			// Fetch
			$termsInfos = $this->get_microposts( $group_ids,$alphas );
			$terms = &$termsInfos['terms'];
			$count = $termsInfos['count'];

			if ( ! count( $terms ) ) {
				return '<p>' . __( 'There are no glossary items.','ithoughts-tooltip-glossary' ) . '</p>';
			}

			$atoz = array();
			foreach ( $terms as $post ) {
				$title = $post->post_title;
				$alpha = strtoupper( \ithoughts\v5_0\Toolbox::unaccent( mb_substr( $title,0,1, 'UTF-8' ) ) );
				if ( ! preg_match( '/[A-Z]/', $alpha ) ) {
					$alpha = '#';
				}
				$alpha_attribute = $alpha;
				$alpha_attribute = $alpha_attribute == '#' ? 'other' : $alpha_attribute ;

				$link = apply_filters( 'ithoughts_tt_gl_get_glossary_term_element', $post, null, $linkdata );
				$item  = '<li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-' . $alpha_attribute . '">';
				$item .= $link;
				$item .= '</li>';

				$atoz[ $alpha ][] = $item;
			}

			// Menu
			$menu  = '<ul class="glossary-menu-atoz">';
			$range = apply_filters( 'ithoughts_tt_gl_atoz_range', array_keys( $atoz ) );
			foreach ( $range as $alpha ) {
				$count = count( $atoz[ $alpha ] );
				$alpha_attribute = $alpha;
				$alpha_attribute = $alpha_attribute == '#' ? 'other' : $alpha_attribute ;
				$menu .= '<li class="glossary-menu-item atoz-menu-' . $alpha_attribute . ' itg-atoz-clickable itg-atoz-menu-off" title="' . strtoupper( $alpha ) . '" alt="' . esc_attr__( 'Terms','ithoughts-tooltip-glossary' ) . ': ' . $count . '"  data-alpha="' . $alpha_attribute . '">';
				$menu .= '<a href="#' . $alpha_attribute . '">' . strtoupper( $alpha ) . '</a></li>';
			}
			$menu .= '</ul>';

			// Items
			$list = '<div class="itg-glossary-atoz-wrapper">';
			foreach ( $atoz as $alpha => $items ) {
				$alpha_attribute = $alpha;
				$alpha_attribute = $alpha_attribute == '#' ? 'other' : $alpha_attribute ;
				$list .= '<ul class="itg-atoz-items itg-atoz-items-' . $alpha_attribute . ' itg-atoz-items-off">';
				$list .= implode( '', $items );
				$list .= '</ul>';
			}
			$list .= '</div>';

			$clear    = '<div style="clear: both;"></div>';
			$data['attributes']['class'] = 'glossary-atoz-wrapper' . ((isset( $data['attributes']['class'] ) && $data['attributes']['class']) ? ' ' . $data['attributes']['class'] : '');
			$args = \ithoughts\v5_0\Toolbox::concat_attrs( $data['attributes'] );
			$plsclick = apply_filters( 'ithoughts_tt_gl_please_select', '<div class="ithoughts_tt_gl-please-select"><p>' . __( 'Please select from the menu above', 'ithoughts-tooltip-glossary' ) . '</p></div>' );
			// Global variable that tells WP to print related js files.
			$backbone->add_scripts( array( 'qtip', 'atoz' ) );
			return '<div ' . $args . '>' . $menu . $clear . $plsclick . $clear . $list . '</div>';
		} // glossary_atoz
	} // atoz
}// End if().
