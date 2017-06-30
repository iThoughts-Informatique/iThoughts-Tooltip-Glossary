<?php
/**
 * @file Handles registering post types & configure them
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

if ( ! class_exists( __NAMESPACE__ . '\\PostTypes' ) ) {
	class PostTypes extends \ithoughts\v1_0\Singleton {
		public function __construct() {
			add_action( 'init', array( $this, 'register_post_types' ) );
		}

		/**
		 * @function set_comments_status
		 * @description Set the status of comments to 'open' or 'closed'
		 * @author Gerkin
		 * @param  [[Type]] $data [[Description]]
		 * @return [[Type]] [[Description]]
		 */
		public function set_comments_status( $data ) {
			if ( $data['post_type'] == 'glossary' ) {
				$data['comment_status'] = $options['termscomment'] ? 'open' : 'closed';
			}
			return $data;
		}

		public function register_post_types() {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			$options = $backbone->get_options();

			$supports = array( 'title', 'editor', 'thumbnail', 'author', 'excerpt' );
			if ( $options['termscomment'] ) {
				$supports[] = 'comments';
			}
			// add_filter( 'wp_insert_post_data', array(&$this,'set_comments_status') );
			register_post_type( 'glossary', array(
				'public'				=> true,
				'menu_position'			=> 105,
				'has_archive'			=> true,
				'exclude_from_search'	=> $options['exclude_search'],
				'show_in_rest'			=> true,
				'supports'				=> $supports,
				'labels' => array(
					'name'					=> __( 'Glossary Terms', 'ithoughts-tooltip-glossary' ),
					'singular_name'			=> __( 'Glossary Term', 'ithoughts-tooltip-glossary' ),
					'add_new'				=> __( 'Add New Term', 'ithoughts-tooltip-glossary' ),
					'add_new_item'			=> __( 'Add New Glossary Term', 'ithoughts-tooltip-glossary' ),
					'edit_item'				=> __( 'Edit Glossary Term', 'ithoughts-tooltip-glossary' ),
					'new_item'				=> __( 'Add New Glossary Term', 'ithoughts-tooltip-glossary' ),
					'view_item'				=> __( 'View Glossary Term', 'ithoughts-tooltip-glossary' ),
					'search_items'			=> __( 'Search Glossary Terms', 'ithoughts-tooltip-glossary' ),
					'not_found'				=> __( 'No Glossary Terms found', 'ithoughts-tooltip-glossary' ),
					'not_found_in_trash'	=> __( 'No Glossary Terms found in trash', 'ithoughts-tooltip-glossary' ),
				),
				'register_meta_box_cb'	=> array( $this, 'meta_boxes' ),
				'rewrite'				=> array(
					'slug'			=> $options['termtype'],
					'with_front'	=> true,
				),
				'show_ui'				=> true,
				'show_in_menu'			=> false,
				'show_in_admin_bar'		=> true,
				'menu_icon'				=> '',
				'taxonomies'			=> array(
					'glossary_group'
				),
			) );
			if ( isset( $options['needflush'] ) && $options['needflush'] ) {
				$options['needflush'] = false;
				$backbone->set_options( $options, true );
				flush_rewrite_rules( false );
			}

			add_filter( 'manage_glossary_posts_columns',       array( $this, 'manage_glossary_posts_columns' ) );
			add_action( 'manage_glossary_posts_custom_column', array( $this, 'manage_glossary_posts_custom_column' ), 10, 2 );

			add_action( 'save_post',   array( &$this, 'save_glossary_post' ), 10, 2 );
			add_filter( 'the_content', array( &$this, 'the_content' ),        10, 2 );
		}

		/** */
		public function meta_boxes() {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			$options = $backbone->get_options();
			add_meta_box( 'ithoughts_tt_gl_reference', __( 'Glossary Term Reference', 'ithoughts-tooltip-glossary' ), array( $this, 'mb_references' ), $options['termtype'], 'normal', 'high' );
		}

		/** */
		public function mb_references() {
			global $post;

			$reference = $this->get_reference( $post );
			$values = shortcode_atts( array(
				'title' => '',
				'link' => '',
			), $reference );

			echo '<label class="ithoughts_tt_gl-admin">' . __( 'Title', 'ithoughts-tooltip-glossary' ) . ' <input name="ithoughts_tt_gl_reference_title" size="30" value="' . ((isset( $values['title'] ) && $values['title']) ? $values['title'] : '') . '" /></label><br>';
			echo '<label class="ithoughts_tt_gl-admin">' . __( 'Link', 'ithoughts-tooltip-glossary' ) . ' <input name="ithoughts_tt_gl_reference_link" size="50" value="' . ((isset( $values['link'] ) && $values['link']) ? $values['link'] : '') . '" /></label>';
			wp_nonce_field( plugin_basename( __FILE__ ), 'glossary_edit_nonce' );
		} //mb_references

		/** */
		public function manage_glossary_posts_columns( $columns ) {
			$newcolumns = array(
				'usage'     => __( 'Usage', 'ithoughts-tooltip-glossary' ),
				'reference' => __( 'Reference', 'ithoughts-tooltip-glossary' ),
			);
			$columns = array_slice( $columns, 0, -1, true )
				+ $newcolumns
				+ array_slice( $columns, -1, null, true );

			return $columns;
		}

		/** */
		public function manage_glossary_posts_custom_column( $column, $post_id ) {
			switch ( $column ) {
				case 'usage':{
					$usage = get_post_meta( $post_id, 'ithoughts_tt_gl_term_used' );
					if ( $usage ) {
						$col = array();
						foreach ( $usage as $post_id ) {
							$title = get_the_title( $post_id );
							$url   = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink( $post_id ) );
							$col[] = '<a href="' . $url . '">' . $title . '</a>';
						}
						echo implode( ', ', $col );
					}
				} break;
				case 'reference':{
					$reference = get_post_meta( $post_id, 'ithoughts_tt_gl_reference', $single = true );
					if ( $reference ) {
						extract( $reference );
						if ( ! (empty( $title ) && empty( $url )) ) {
							if ( empty( $title ) ) {
								$title = $url;
							}
							echo $title;
						}
					}
				} break;
			}
		}

		/** */
		public function save_glossary_post( $post_id, $post ) {
			$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			$slug = $backbone->get_option( 'termtype' );

			$_POST += array(
				'{$slug}_edit_nonce' => '',
			);

			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return;
			}

			if ( wp_is_post_revision( $post ) ) {
				return;
			}

			if ( ! wp_verify_nonce( $_POST['{$slug}_edit_nonce'], plugin_basename( __FILE__ ) ) ) {
				return;
			}

			if ( ! isset( $_POST['post_type'] ) ) {
				return;
			}

			if ( $slug != $_POST['post_type'] ) {
				return;
			}

			$title = $_POST['ithoughts_tt_gl_reference_title'];
			$link  = $_POST['ithoughts_tt_gl_reference_link'];

			$title = trim( $title );
			$link  = trim( $link );
			if ( $link ) {
				if ( ! preg_match( '/^http/', $link ) ) {
					$link = 'http://' . $link;
				}
				if ( filter_var( $link, FILTER_VALIDATE_URL ) === false ) {
					$link = '';
				}
			}

			$reference = array(
				'title' => $title,
				'link' => $link,
			);
			update_post_meta( $post_id, 'ithoughts_tt_gl_reference', $reference );
			return $post_id;
		} // save_glossary_post

		/**
		 * Append a link to reference and where it is used
		 *
		 * @todo Check usage
		 * @param $content string The content to display
		 * @param $is_main_query boolean Boolean representing if this display query is the main query. Default to true
		 */
		public function the_content( $content, $is_main_query = 1 ) {
			global $post, $wp_query;

			if ( $is_main_query && is_single() && get_post_type() == 'glossary' ) {
				$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
				$options = $backbone->get_options();

				$reference = $this->get_reference( $post );
				if ( $reference !== null && is_array( $reference ) ) {
					if ( ! empty( $reference['title'] ) || ! empty( $reference['link'] ) ) {
						if ( empty( $reference['title'] ) ) {
							$reference['title'] = $reference['link'];
						}
						if ( $reference['link'] ) {
							$title = '<a class="glossary-reference-link" target="_blank" href="' . $reference['link'] . '">' . $reference['title'] . '</a>';
						}
						$content .= '<div class="glossary-references"><h4>' . __( 'Reference', 'ithoughts-tooltip-glossary' ) . ' ' . $title . '</h4></div>';
					}
				}// End if().

				// Usage
				$termusage = isset( $options['termusage'] ) ? $options['termusage'] : 'on';
				if ( $termusage == 'on' ) {
					$usage = get_post_meta( $post->ID, 'ithoughts_tt_gl_term_used' );
					if ( $usage ) {
						$usage_title = apply_filters( 'ithoughts_tt_gl_term_usage_title', __( 'Glossary Term Usage', 'ithoughts-tooltip-glossary' ) );
						$content    .= '<div class="ithoughts_tt_gl-term-usage"><div class="header"><h4>' . $usage_title . '</h4></div><ul>';
						foreach ( $usage as $post_id ) {
							$target   = get_post( $post_id );
							$title    = get_the_title( $post_id );
							$content .= '<li><a href="' . apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink( $post_id ) ) . '" title="" alt="' . esc_attr( $title ) . '">' . $title . '</a></li>';
						}
						$content .= '</ul></div>';
					} // End if().
				}
			} // End if().
			return $content;
		} // the_content

		private function get_reference( $post ) {
			$reference = get_post_meta( $post->ID, 'ithoughts_tt_gl_reference', $single = true );
			if ( empty( $reference ) ) {
				$reference = get_post_meta( $post->ID, 'ithoughts_tt_gl_reference', $single = true );
				if ( empty( $reference ) ) {
					return null;
				}
			}
			return $reference;
		}
	} // post_types
}// End if().
