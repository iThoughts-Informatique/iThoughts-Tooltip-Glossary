<?php

/**
 * @file Class files registering & containing comon filters
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.5.0
 */


/**
 * @copyright 2015-2016 iThoughts Informatique
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 */

namespace ithoughts\tooltip_glossary;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! class_exists( __NAMESPACE__ . '\\Filters' ) ) {
	class Filters extends \ithoughts\v1_0\Singleton {
		public function __construct() {
			add_filter( 'ithoughts_tt_gl-term-excerpt', array( &$this, 'getTermExcerpt' ) );
			add_filter( 'ithoughts-split-args', array( &$this, 'splitArgs' ), 10, 5 );
			add_filter( 'ithoughts-join-args', array( &$this, 'joinArgs' ), 10, 1 );
			add_filter( 'ithoughts_tt_gl-split-args', array( &$this, 'ithoughts_tt_gl_splitArgs' ), 10, 1 );

			add_filter( 'ithoughts_tt_gl_tooltip_anim_out', array( &$this, 'checkAnimsInfosOut' ), 10000000, 2 );
			add_filter( 'ithoughts_tt_gl_tooltip_anim_in', array( &$this, 'checkAnimsInfosIn' ), 10000000, 2 );
			add_filter( 'ithoughts_tt_gl_wpml_get_term_current_language', array(&$this, 'wpml_get_term_current_language'), 10, 1);
		}

		/**
		 * @description Returns the excerpt sized for tooltip of the given post
		 * @author Gerkin
		 * @param  [WP_Post] \WP_Post $term Glossary term to extract the excerpt from
		 * @return [string] The generated excerpt
		 */
		public function getTermExcerpt( \WP_Post $term ) {
			if ( strlen( $term->post_excerpt ) > 0 ) {
				$content = wpautop( $term->post_excerpt );
			} else {
				$content = wp_trim_words( $term->post_content, 25, '...' );
			}
			return $content;
		}

		/**
		 * Return array(
		 * "handled"				=> array(),
		 * "attributes"			=> array(),
		 * "overridesServer"		=> array(),
		 * "overridesClient"		=> array()
		 * ). Put all given attributes in the appropriated category, and with prefix they need
		 *
		 * @author Gerkin
		 * @param  string[]     $attributes                           Attributes to dispatch in categories
		 * @param  string[]   [ $handled = array()]                  Attributes name/regex to store into "handled" subcategory
		 * @param  string[]   [ $overridableOptionsServer = array()] Attributes name/regex to store into "overridesServer" subcategory
		 * @param  string[]   [ $overridableOptionsClient = array()] Attributes name/regex to store into "overridesClient" subcategory
		 * @param  boolean      $fuseClientSideWithArgs = true        If set to true, category overridesClient & Attributes will be merged
		 * @return string[][]                                       Sorted attributes
		 */
		public function splitArgs( $attributes, array $handled = array(), array $overridableOptionsServer = array(), array $overridableOptionsClient = array(), $fuseClientSideWithArgs = true ) {
			$attrs = array(
				'abbr',
			'accept-charset',
			'accept',
			'accesskey',
			'action',
			'align',
			'alt',
			'archive',
			'axis',
				'border',
				'cellpadding',
			'cellspacing',
			'char',
			'charoff',
			'charset',
			'checked',
			'cite',
			'class',
			'classid',
			'codebase',
			'codetype',
			'cols',
			'colspan',
			'content',
			'coords',
				'data',
			'datetime',
			'declare',
			'defer',
			'dir',
			'disabled',
				'enctype',
				'for',
			'frame',
			'frameborder',
				'headers',
			'height',
			'href',
			'hreflang',
			'http-equiv',
				'id',
			'ismap',
				'label',
			'lang',
			'longdesc',
				'marginheight',
			'marginwidth',
			'maxlength',
			'media',
			'method',
			'multiple',
				'name',
			'nohref',
			'noresize',
				'onblur',
			'onchange',
			'onclick',
			'ondblclick',
			'onfocus',
			'onkeydown',
			'onkeypress',
			'onkeyup',
			'onload',
			'onmousedown',
			'onmousemove',
			'onmouseout',
			'onmouseover',
			'onmouseup',
			'onreset',
			'onselect',
			'onsubmit',
			'onunload',
				'profile',
				'readonly',
			'rel',
			'rev',
			'rows',
			'rowspan',
			'rules',
				'scheme',
			'scope',
			'scrolling',
			'selected',
			'shape',
			'size',
			'span',
			'src',
			'standby',
			'style',
			'summary',
				'tabindex',
			'target',
			'title',
			'type',
				'usemap',
				'valign',
			'value',
			'valuetype',
				'width',
				'/^aria-/',
				'/^data-/',
			);
			$attsLength = count( $attrs );
			$res = array(
				'handled'				=> array(),
				'attributes'			=> array(),
				'overridesServer'		=> array(),
				'overridesClient'		=> array(),
			);
			if ( is_array( $attributes ) ) {
				foreach ( $attributes as $key => $value ) {
					// $attributes is a single-level array containing key-value HTML tag potential attributes with $key and $value
					if ( array_search( $key, $handled ) !== false ) { // This is a know `handled` attribute
						$res['handled'][ $key ] = $value;
					} else if ( array_search( $key, $overridableOptionsServer ) !== false ) { // This is a know `overridable from server` attribute
						$res['overridesServer'][ $key ] = $value;
					} else if ( array_search( $key, $overridableOptionsClient ) !== false ) { // This is a know `overridable from client` attribute
						$res['overridesClient'][ $key ] = $value;
					} else { // It does not belongs to any special categories
						$i = -1;
						$match = false;
						while ( ++$i < $attsLength && ! $match ) { // Loop through known HTML attributes
							$attr = $attrs[ $i ];
							if ( strlen( $attr ) > 1 && $attr[0] == '/' && $attr[ count( $attr ) - 1 ] == '/' ) { // If this tested HTML attribute is a regex
								if ( preg_match( $attrs[ $i ], $key ) ) { // If our `$key` match with the test attribute
									$res['attributes'][ $key ] = $value; // Add it without any prefix
									$match = true;
								}
							} else { // Else, this is a string
								if ( $key === $attrs[ $i ] ) { // If our `$key` is the same as tested attribute
									$res['attributes'][ $key ] = $value; // Add it without any prefix
									$match = true;
								}
							}
						}
						if ( ! $match ) { // This attribute does not match any known HTML standard attributes
							$res['attributes'][ 'data-' . $key ] = $value; // Assign it prefixed
						}
					}
				}
			}
			$ret;
			if ( $fuseClientSideWithArgs ) {
				$ret = array(
					'handled' => $res['handled'],
					'attributes' => array_merge( $res['attributes'], $res['overridesClient'] ),
					'overridesServer' => $res['overridesServer'],
				);
			} else {
				$ret = $res;
			}
			return $ret;
		}

		public function ithoughts_tt_gl_splitArgs( $atts ) {
			$ret = array();

			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			$datas = apply_filters( 'ithoughts-split-args', $atts, $backbone->get_handled_attributes(), $backbone->get_server_side_overridable(), $backbone->get_client_side_overridable(), false );

			$ret['options'] = apply_filters( 'ithoughts_tt_gl_get_overriden_opts', $datas['overridesServer'], false );

			$linkAttrs = array();
			foreach ( $datas['attributes'] as $key => $value ) {// Extract /^link-/ datas
				if ( strpos( $key, 'data-link-' ) === 0 ) {
					$linkAttrs[ substr( $key, 10 ) ] = $value;
					unset( $datas['attributes'][ $key ] );
				}
			}
			$ret['linkAttrs'] = apply_filters( 'ithoughts-split-args', $linkAttrs );
			$ret['linkAttrs'] = $ret['linkAttrs']['attributes'];

			$overridesClient = apply_filters( 'ithoughts_tt_gl_get_overriden_opts', $datas['overridesClient'], true );
			$overridesDataPrefixed = array();
			foreach ( $overridesClient as $override => $value ) {
				$overridesDataPrefixed[ 'data-' . $override ] = $value;
			};
			$ret['attributes'] = array_merge( $datas['attributes'], $overridesDataPrefixed );

			$ret['handled'] = $datas['handled'];

			if ( isset( $ret['attributes']['href'] ) && ! isset( $ret['linkAttrs']['href'] ) ) {
				$ret['linkAttrs']['href'] = $ret['attributes']['href'];
				unset( $ret['attributes']['href'] );
			}

			return $ret;
		}

		private function getAnimsOut( $anims ) {
			$anims = array(
				'none' => array(
					'text' => __( 'None', 'ithoughts-tooltip-glossary' ),
					'description' => '',
					'js' => '',
				),
				'unhook' => array(
					'text' => __( 'Unhook', 'ithoughts-tooltip-glossary' ),
					'description' => '',
					'js' => '',
				),
				'flee' => array(
					'text' => __( 'Flee', 'ithoughts-tooltip-glossary' ),
					'description' => '',
					'js' => '',
				),
				'zoomout' => array(
					'text' => __( 'Zoom out', 'ithoughts-tooltip-glossary' ),
					'description' => '',
					'js' => '',
				),
				'disappear' => array(
					'text' => __( 'Disappear', 'ithoughts-tooltip-glossary' ),
					'description' => '',
					'js' => '',
				),
			) + $anims;

			return $anims;
		}
		private function getAnimsIn( $anims ) {
			$anims = array(
				'none' => array(
					'text' => __( 'None', 'ithoughts-tooltip-glossary' ),
					'description' => '',
					'js' => '',
				),
				'zoomin' => array(
					'text' => __( 'Zoom in', 'ithoughts-tooltip-glossary' ),
					'description' => '',
					'js' => '',
				),
				'appear' => array(
					'text' => __( 'Appear', 'ithoughts-tooltip-glossary' ),
					'description' => '',
					'js' => '',
				),
			) + $anims;

			return $anims;
		}

		private function checkAnimsInfos( $anims ) {

			return $anims;
		}

		public function checkAnimsInfosOut( $anims = array(), $onlyCustoms = false ) {
			$anims = $this->checkAnimsInfos( $anims );
			if ( ! $onlyCustoms ) {
				$anims = $this->getAnimsOut( $anims );
			}
			return $anims;
		}
		public function checkAnimsInfosIn( $anims = array(), $onlyCustoms = false ) {
			$anims = $this->checkAnimsInfos( $anims );
			if ( ! $onlyCustoms ) {
				$anims = $this->getAnimsIn( $anims );
			}
			return $anims;
		}
		
		public function wpml_get_term_current_language($term_id){
			$current_language_id = apply_filters( 'wpml_current_language', null );
			$term_in_current_language = apply_filters( 'wpml_object_id', $term_id, 'glossary', true, $current_language_id );
			return $term_in_current_language;
		}
	}
}// End if().
