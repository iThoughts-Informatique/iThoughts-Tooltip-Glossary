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

namespace ithoughts\tooltip_glossary\shortcode\index;

use \ithoughts\v6_0\Toolbox as Toolbox;

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );wp_die("Forbidden");// Exit if accessed directly
}

if ( ! class_exists( __NAMESPACE__ . '\\AtoZ' ) ) {
	class AtoZ extends GlossaryList {
		public function __construct() {
			add_shortcode( 'glossary_atoz', array( $this, 'do_shortcode' ) );
			add_shortcode( 'itg-atoz', array( $this, 'do_shortcode' ) );

			parent::__construct('atoz', true);
		}

		public function generate_list( $text = '', $groups = array(), $letters = array(), $options = array() ) {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

			$options = apply_filters( 'ithoughts_tt_gl-split-attributes', $options );
			$server_options = array_replace_recursive(array(), $backbone->get_serverside_options(), $options['serverSide']);

			$filter = "ithoughts_tt_gl_list_{$server_options['list-contenttype']}";
			$posts = array();
			if(has_filter($filter)){
				$posts = apply_filters($filter, $groups, $letters);
			}
			// Make groups
			$paged = $this->group_posts_by_alpha($posts);
			$posts = null;

			// Menu
			$menu  = '<ul class="glossary-menu-atoz">';
			foreach ( $paged as $alpha => $pages ) {
				$count = count( $pages );
				$alpha_attribute = $alpha == '#' ? 'other' : $alpha ;
				$menu .= '<li class="glossary-menu-item atoz-menu-' . $alpha_attribute . ' itg-atoz-clickable itg-atoz-menu-off" title="' . strtoupper( $alpha ) . ': ' . sprintf( esc_attr( _n( '%d term begining with character "%s"', '%d terms begining with character "%s"', $count, 'ithoughts-tooltip-glossary' ) ), $count, $alpha ) . '"  data-alpha="' . $alpha_attribute . '">';
				$menu .= '<a href="#' . $alpha_attribute . '">' . strtoupper($alpha) . '</a></li>';
			}
			$menu .= '</ul>';

			// Items
			$list = '<div class="atoz-wrapper">';
			foreach ( $paged as $alpha => $items ) {
				$alpha_attribute = $alpha == '#' ? 'other' : $alpha ;
				$list .= '<ul class="itg-atoz-items itg-atoz-items-' . $alpha_attribute . ' itg-atoz-items-off">';
				foreach($items as $item){
					$alpha_attribute = $alpha === "#" ? "other" : $alpha;
					$list  .= '<li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-' . $alpha_attribute . '">'.$item.'</li>';
				}
				$list .= '</ul>';
			}
			$list .= '</div>';

			$clear    = '<div style="clear: both;"></div>';

			$options['attributes']['class'] = 'itg-glossary-atoz' . ( (isset( $options['attributes']['class'] ) && $options['attributes']['class']) ? ' ' . $options['attributes']['class'] : '');
			$args = Toolbox::concat_attrs( $options['attributes'] );
			$plsclick = apply_filters( 'ithoughts_tt_gl_please_select', '<div class="ithoughts_tt_gl-please-select"><p>' . __( 'Please select from the menu above', 'ithoughts-tooltip-glossary' ) . '</p></div>' );

			// Global variable that tells WP to print related js files.
			$backbone->add_script( 'atoz' );
			return '<div' . $args . '>' . $menu . $clear . $plsclick . $clear . $list . '</div>';
		}
	}
}
