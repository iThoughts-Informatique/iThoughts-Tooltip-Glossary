<?php
/**
 * @file Reduced version of WP-Post class file. Used mainly in lists, to reduce memory usage
 *
 * @author Gerkin
 * @copyright 2015-2016 iThoughts Informatique
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

namespace ithoughts\tooltip_glossary;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
if ( ! class_exists( __NAMESPACE__ . '\\MicroPost' ) ) {
	$backbone = Backbone::get_instance();

	if ( $backbone->get_option( 'staticterms' ) ) { // Depending on the option, the class will have different constraints

		/**
		 * @description This class is intended to be used exactly the same as WP_Post through the plugin, but stores less data
		 */
		class MicroPost implements \ithoughts\v1_0\PseudoPost {
			private static $fields = array( 'ID', 'post_title', 'post_name','post_content','post_excerpt' );

			public $ID;
			public $post_title;
			public $post_name;
			public $post_content;
			public $post_excerpt;

			public function __construct( array $data ) {
				if ( ! (isset( $data['ID'] ) && isset( $data['post_title'] ) && isset( $data['post_name'] ) && isset( $data['post_content'] ) && isset( $data['post_excerpt'] )) ) {
					throw new \Exception( 'Missing required property for instanciate MicroPost' );
				}

				$this->ID = $data['ID'];
				$this->post_title = $data['post_title'];
				$this->post_name = $data['post_name'];
				$this->post_content = $data['post_content'];
				$this->post_excerpt = $data['post_excerpt'];
			}

			/**
			 * Get the list of required fields depending on options
			 *
			 * @author Gerkin
			 * @return string[] Required fields
			 */
			public static function getFields() {
				return self::$fields;
			}

			/**
			 * Cast to \WP_Post
			 *
			 * @author Gerkin
			 * @return \WP_Post The WP_Post
			 */
			public function to_WP_Post() {
				$post = new \WP_Post( (object) $this );

				return $post;
			}
		}
	} else {
		class MicroPost implements \ithoughts\v1_0\PseudoPost {
			private static $fields = array( 'ID', 'post_title', 'post_name' );

			public $ID;
			public $post_title;
			public $post_name;

			public function __construct( array $data ) {
				if ( ! (isset( $data['ID'] ) && isset( $data['post_title'] ) && isset( $data['post_name'] )) ) {
					throw new \Exception( 'Missing required property for instanciate MicroPost' );
				}

				$this->ID = $data['ID'];
				$this->post_title = $data['post_title'];
				$this->post_name = $data['post_name'];
			}

			public static function getFields() {
				return self::$fields;
			}

			public function to_WP_Post() {
				$post = new \WP_Post( (object) $this );

				return $post;
			}
		}
	}// End if().
}// End if().
