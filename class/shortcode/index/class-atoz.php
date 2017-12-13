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
		const LIST_MODE_MICROPOST	= 1;
		const LIST_MODE_WPPOST		= 2;

		const LIST_MODE_NONE		= 1;
		const LIST_MODE_TIP			= 3;
		const LIST_MODE_EXCERPT		= 2;
		const LIST_MODE_FULL		= 4;

		public function __construct() {
			add_shortcode( 'glossary_atoz', array( $this, 'glossary_atoz' ) );
			add_shortcode( 'itg-atoz', array( $this, 'glossary_atoz' ) );
		}

		public function glossary_atoz( $atts, $content = '' ) {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

			$out = $this->init_list_atts( $atts );
			$data = &$out['data'];
			$options = array_replace_recursive(array(), $backbone->get_serverside_options(), $data['options']);
			$linkdata = &$out['linkdata'];

			$mode;
			switch($data["handled"]["desc"]){
				case 'none':{
					$mode = self::LIST_MODE_NONE;
				} break;

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
					$mode = self::LIST_MODE_TIP;
				}
			}

			// Sanity check the list of letters (if set by user).
			$alphas = $this->filter_alphas_to_array( isset( $data['handled'] ) && isset( $data['handled']['alpha'] ) && $data['handled']['alpha'] ? $data['handled']['alpha'] : null );
			// Checks for partial listing options (on first letter, or group)
			$group_ids = $this->filter_groupIds_to_array(isset($data['handled']) && isset($data['handled']['group']) ? $data['handled']['group'] : null);

			//$terms;
			$count;

			// Define default desc to tips. Will generate tooltips
			// If no content is required, use microposts. Else, use normal terms
			if($mode & self::LIST_MODE_MICROPOST){
				// Add qtip script only if loading tooltips
				if($mode === self::LIST_MODE_TIP){
					$backbone->add_script('qtip');
				}

				// Fetch microposts
				$termsInfos = $this->get_microposts($group_ids,$alphas);
				//$terms = &$termsInfos["terms"];
			} else {
				// Fetch full posts
				$linkdata = apply_filters("ithoughts_tt_gl-split-attributes", $linkdata);
				$termsInfos = $this->get_lists_terms($group_ids,$alphas);
				//$terms = $this->dispatch_per_char($termsInfos["terms"], 0, "WP_Post");
			}
			$terms = &$termsInfos["terms"];
			$count = $termsInfos["count"];

			if( !count($terms) )
				return '<p>'.__('There are no glossary items.','ithoughts-tooltip-glossary').'</p>';

			$atoz = array();

			switch($mode) {
				case self::LIST_MODE_TIP:{
					foreach( $terms as $post ) {
						$title = $post->post_title;
						$alpha = strtoupper( Toolbox::unaccent(mb_substr($title,0,1, "UTF-8")) );
						if(!preg_match("/[A-Z]/", $alpha))
							$alpha = "#";
						$alpha_attribute = $alpha;
						$alpha_attribute = $alpha_attribute == "#" ? "other" : $alpha_attribute ;

						$link = apply_filters("ithoughts_tt_gl_get_glossary_term_element", $post, null, $linkdata);
						$item  = '<li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-' . $alpha_attribute . '">';
						$item .= $link;
						$item .= '</li>';

						$atoz[$alpha][] = $item;
					}
				} break;
				case self::LIST_MODE_FULL:{
					foreach( $terms as $post ) {
						$title = $post->post_title;
						$alpha = strtoupper( Toolbox::unaccent(mb_substr($title,0,1, "UTF-8")) );
						if(!preg_match("/[A-Z]/", $alpha)){
							$alpha = "#";
						}
						$alpha_attribute = $alpha;
						$alpha_attribute = $alpha_attribute == "#" ? "other" : $alpha_attribute ;

						$href  = apply_filters( 'ithoughts_tt_gl_term_link',  Toolbox::get_permalink_light($post, "glossary") );
						$target = "";
						if( $options["termlinkopt"] !== 'none' ){
							$linkAttrs["target"] = "_blank";
						}
						$linkAttrs["href"] = &$href;
						$args = Toolbox::concat_attrs( $linkAttrs);
						$item  = '<span class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-' . $alpha_attribute . '">';
						$link   = '<header class="entry-header"><h5 class="entry-title"><a '.$args.' title="'. $title .'">' . $title . '</a></h5></header>';
						$content = '<div class="entry-content clearfix"><p>' . $post->post_content . '</p></div>';
						$item .= $link;
						$item .= $content;
						$item .= '</span><br>';

						$atoz[$alpha][] = $item;
					}
				} break;
				case self::LIST_MODE_EXCERPT:{
					foreach( $terms as $post ) {
						$title = $post->post_title;
						$alpha = strtoupper( Toolbox::unaccent(mb_substr($title,0,1, "UTF-8")) );
						if(!preg_match("/[A-Z]/", $alpha)){
							$alpha = "#";
						}
						$alpha_attribute = $alpha;
						$alpha_attribute = $alpha_attribute == "#" ? "other" : $alpha_attribute ;

						$href  = apply_filters( 'ithoughts_tt_gl_term_link',  Toolbox::get_permalink_light($post, "glossary") );
						$target = "";
						if( $options["termlinkopt"] != 'none' ){
							$linkAttrs["target"] = "_blank";
						}
						$linkAttrs["href"] = &$href;
						$args = Toolbox::concat_attrs( $linkAttrs);
						$item  = '<span class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-' . $alpha_attribute . '">';
						$link   = '<header class="entry-header"><h5 class="entry-title"><a '.$args.' title="'. $title .'">' . $title . '</a></h5></header>';
						$content = '<div class="entry-content clearfix"><p>' . apply_filters("ithoughts_tt_gl-term-excerpt", $post) . '</p></div>';
						$item .= $link;
						$item .= $content;
						$item .= '</span><br>';

						$atoz[$alpha][] = $item;
					}
				} break;
				case self::LIST_MODE_NONE:{ //This part's not working--not sure why
					foreach( $terms as $post ) {
						$title = $post->post_title;
						$alpha = strtoupper( Toolbox::unaccent(mb_substr($title,0,1, "UTF-8")) );
						if(!preg_match("/[A-Z]/", $alpha)){
							$alpha = "#";
						}
						$alpha_attribute = $alpha;
						$alpha_attribute = $alpha_attribute == "#" ? "other" : $alpha_attribute ;

						$href  = apply_filters( 'ithoughts_tt_gl_term_link',  Toolbox::get_permalink_light($post, "glossary") );
						$target = "";
						if( $options["termlinkopt"] != 'none' ){
							$linkAttrs["target"] = "_blank";
						}
						$linkAttrs["href"] = &$href;
						$args = Toolbox::concat_attrs( $linkAttrs);
						$item  = '<span class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-' . $alpha_attribute . '">';
						$link   = '<a '.$args.'>' . $title . '</a>';
						$content = '<br>' . '<span class="glossary-item-desc">' . apply_filters("ithoughts_tt_gl-term-excerpt", $post) . '</span>';
						$item .= $link;
						$item .= $content;
						$item .= '</span>';

						$atoz[$alpha][] = $item;
					}
				} break;
			}

			// Menu
			$menu  = '<ul class="glossary-menu-atoz">';
			$range = apply_filters( 'ithoughts_tt_gl_atoz_range', array_keys( $atoz ) );
			foreach ( $range as $alpha ) {
				$count = count( $atoz[ $alpha ] );
				$alpha_attribute = $alpha;
				$alpha_attribute = $alpha_attribute == '#' ? 'other' : $alpha_attribute ;
				$menu .= '<li class="glossary-menu-item atoz-menu-' . $alpha_attribute . ' itg-atoz-clickable itg-atoz-menu-off" title="' . strtoupper( $alpha ) . '" alt="' . esc_attr__( 'Terms','ithoughts-tooltip-glossary' ) . ': ' . $count . '"  data-alpha="' . $alpha_attribute . '">';
				$menu .= '<a href="#' . $alpha_attribute . '">' . strtoupper($alpha) . '</a></li>';
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
			$data['attributes']['class'] = 'glossary-atoz-wrapper' . ( (isset( $data['attributes']['class'] ) && $data['attributes']['class']) ? ' ' . $data['attributes']['class'] : '');
			$args = Toolbox::concat_attrs( $data['attributes'] );
			$plsclick = apply_filters( 'ithoughts_tt_gl_please_select', '<div class="ithoughts_tt_gl-please-select"><p>' . __( 'Please select from the menu above', 'ithoughts-tooltip-glossary' ) . '</p></div>' );
			// Global variable that tells WP to print related js files.
			$backbone->add_script( 'atoz' );
			return '<div ' . $args . '>' . $menu . $clear . $plsclick . $clear . $list . '</div>';
		} // glossary_atoz
	} // atoz
}
