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
	 status_header( 403 );
	wp_die( 'Forbidden' );// Exit if accessed directly
}

if ( ! class_exists( __NAMESPACE__ . '\\Filters' ) ) {
	class Filters extends \ithoughts\v1_0\Singleton {
		public function __construct() {
			add_filter( 'ithoughts_tt_gl-split-attributes', array( &$this, 'split_attrs' ), 10, 1 );

			add_filter( 'ithoughts_tt_gl_tooltip_anim_out', array( &$this, 'check_anims_infos_out' ), 10000000, 2 );
			add_filter( 'ithoughts_tt_gl_tooltip_anim_in', array( &$this, 'check_anims_infos_in' ), 10000000, 2 );
		}

		public function split_attrs( $attrs ) {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			
			// Split options in categories
			$unsorted = array();
			$datas = \ithoughts\v6_0\Toolbox::sort_options($attrs, array(
				'handled' => $backbone->get_handled_attributes(),
				'serverSide' => $backbone->get_server_side_overridable(),
				'clientSide' => $backbone->get_client_side_overridable(),
			), $unsorted);

			// Override server options
			$datas['serverSide'] = apply_filters( 'ithoughts_tt_gl_override_options', $datas['serverSide'], false );
			$datas['clientSide'] = apply_filters( 'ithoughts_tt_gl_override_options', $datas['clientSide'], true );
			$datas['attributes'] = $unsorted;
			
			return $datas;
		}

		private function get_anims_out( $anims ) {
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
		private function get_anims_in( $anims ) {
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

		private function check_anims_infos( $anims ) {
			return $anims;
		}

		public function check_anims_infos_out( $anims = array(), $onlyCustoms = false ) {
			$anims = $this->check_anims_infos( $anims );
			if ( ! $onlyCustoms ) {
				$anims = $this->get_anims_out( $anims );
			}
			return $anims;
		}
		public function check_anims_infos_in( $anims = array(), $onlyCustoms = false ) {
			$anims = $this->check_anims_infos( $anims );
			if ( ! $onlyCustoms ) {
				$anims = $this->get_anims_in( $anims );
			}
			return $anims;
		}
	}
}// End if().
