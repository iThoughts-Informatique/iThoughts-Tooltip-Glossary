<?php
/**
  * @copyright 2015-2016 iThoughts Informatique
  * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
  */

namespace ithoughts\tooltip_glossary\shortcode;

if ( ! defined( 'ABSPATH' ) ) { 
	exit; // Exit if accessed directly
}

if(!class_exists(__NAMESPACE__."\\AtoZ")){
	class AtoZ extends GlossaryList{
		public function __construct() {
			add_shortcode( 'glossary_atoz', array($this, 'glossary_atoz') );
		}

		public function glossary_atoz( $atts, $content='' ){
			$out = $this->init_list_atts($atts);
			$data = &$out["data"];
			$linkdata = &$out["linkdata"];
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

			$termsInfos = $this->get_miscroposts();
			$terms = &$termsInfos["terms"];
			$count = $termsInfos["count"];

			if( !count($terms) )
				return '<p>'.__('There are no glossary items.','ithoughts-tooltip-glossary').'</p>';

			$atoz = array();
			foreach( $terms as $post ) {
				$title = $post->post_title;
				$alpha = strtoupper( \ithoughts\v1_2\Toolbox::unaccent(mb_substr($title,0,1, "UTF-8")) );
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

			// Menu
			$menu  = '<ul class="glossary-menu-atoz">';
			$range = apply_filters( 'ithoughts_tt_gl_atoz_range', array_keys($atoz) );
			foreach( $range as $alpha ) {
				$count = count( $atoz[$alpha] );
				$alpha_attribute = $alpha;
				$alpha_attribute = $alpha_attribute == "#" ? "other" : $alpha_attribute ;
				$menu .= '<li class="glossary-menu-item atoz-menu-' . $alpha_attribute . ' atoz-clickable atozmenu-off" title="" alt="' . esc_attr__('Terms','ithoughts_tooltip_glossary') . ': ' . $count . '"  data-alpha="' . $alpha_attribute . '">';
				$menu .= '<a href="#' . $alpha_attribute . '">' . strtoupper($alpha) . '</a></li>';
			}
			$menu .= '</ul>';

			// Items
			$list = '<div class="glossary-atoz-wrapper">';
			foreach( $atoz as $alpha => $items ) {
				$alpha_attribute = $alpha;
				$alpha_attribute = $alpha_attribute == "#" ? "other" : $alpha_attribute ;
				$list .= '<ul class="glossary-atoz glossary-atoz-' . $alpha_attribute . ' atozitems-off">';
				$list .= implode( '', $items );
				$list .= '</ul>';
			}
			$list .= '</div>';

			$clear    = '<div style="clear: both;"></div>';
			$data["attributes"]["class"] = "glossary-atoz-wrapper".((isset($data["attributes"]["class"]) && $data["attributes"]["class"]) ? " ".$data["attributes"]["class"] : "");
			$args = \ithoughts\v1_2\Toolbox::concat_attrs( $data["attributes"]);
			$plsclick = apply_filters( 'ithoughts_tt_gl_please_select', '<div class="ithoughts_tt_gl-please-select"><p>' . __('Please select from the menu above', 'ithoughts-tooltip-glossary' ) . '</p></div>' );
			// Global variable that tells WP to print related js files.
			$backbone->add_scripts(array('qtip','atoz'));
			return '<div '.$args.'>' . $menu . $clear . $plsclick . $clear . $list . '</div>';
		} // glossary_atoz
	} // atoz
}