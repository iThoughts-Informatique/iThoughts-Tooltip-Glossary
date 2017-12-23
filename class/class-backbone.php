<?php
/**
 * IThoughts Tooltip Glossary main file.
 *
 * @file Main class file. Dispatch everything else through all plugin classes
 *
 * @author Gerkin
 * @copyright 2015-2016 iThoughts Informatique
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

namespace ithoughts\tooltip_glossary;

use \ithoughts\v6_0\Resource as Resource;
use \ithoughts\v6_0\LogLevel as LogLevel;

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}


if ( ! class_exists( __NAMESPACE__ . '\\Backbone' ) ) {
	/**
	 * Main class of iThoughts Tooltip Glossary
	 *
	 * @author Gerkin
	 */
	class Backbone extends \ithoughts\v6_0\Backbone {
		const SERVER_OVR	= 1;
		const CLIENT_OVR	= 2;
		/**
		 * Default options values.
		 *
		 * @var array $defaults
		 */
		private $defaults;

		/**
		 * Description of options caracteristics.
		 *
		 * @var array $options_config
		 */
		private $options_config;

		/**
		 * Shortcodes attributes that have special meaning for the plugin.
		 *
		 * @var string[] $handled_attributes
		 */
		private $handled_attributes;

		/**
		 * Construct the plugin main handler.
		 *
		 * @private
		 * @param string $plugin_base Path to the plugin relative to the WordPress install.
		 */
		function __construct( $plugin_base, $plugin_name, $options_name ) {
			parent::__construct($plugin_base, $plugin_name, $options_name);

			$options_config = require(dirname(__FILE__).'/config.php');

			$this->default_options = array();
			foreach ( $options_config as $opt => $val ) {
				$this->default_options[ $opt ] = $val['default'];
			}

			// Retrieve possible dynamic options
			$this->clientside_overridable = array();
			$this->serverside_overridable = array();
			foreach ( $options_config as $opt => $val ) {
				if ( $val['type'] & self::CLIENT_OVR ) {
					$this->clientside_overridable[] = $opt;
				}
				if ( $val['type'] & self::SERVER_OVR ) {
					$this->serverside_overridable[] = $opt;
				}
			}

			$this->handled_attributes = array(
				'tooltip-content',
				'gloss-id',
				'mediatip-type',
				'mediatip-source',
				'cols',
				'groups',
				'alphas',
				'disable_auto_translation',
			);

			// Log the load message.
			$tail = '';
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				$tail = ' in DEBUG mode';
			}
			$this->log( LogLevel::SILLY, "Loaded plugin iThoughts Tooltip Glossary v{$this->get_option('version')}$tail." );

			$this->register_post_types();
			$this->register_taxonmies();
			$this->add_shortcodes();
			$this->add_filters();

			add_action( 'init',                  		array( &$this, 'declare_resources' ) );
			add_action( 'init',                  		array( &$this, 'ajax_hooks' ) );
			add_action( 'wp_footer',             		array( &$this, 'wp_footer' ) );
			add_action( 'admin_footer',            		array( &$this, 'wp_footer' ) );
			add_action( 'wp_print_footer_scripts',		array( &$this, 'after_scripts' ), 100000 );
			add_action( 'admin_print_footer_scripts',	array( &$this, 'after_scripts' ), 100000 );
			add_action( 'wp_enqueue_scripts',    		array( &$this, 'wp_enqueue_styles' ) );
			add_action( 'admin_enqueue_scripts',   		array( &$this, 'wp_enqueue_styles' ) );
			add_action( 'pre_get_posts',         		array( &$this, 'order_core_archive_list' ) );
			add_action( 'plugins_loaded',				array( &$this, 'localisation' ) );
			add_action( 'widgets_init',					array( &$this, 'widgets_init' ) );

			add_filter( 'ithoughts_tt_gl_term_link',	array( &$this, 'term_link' ) );
			add_filter( 'ithoughts_tt_gl_override_options',	array( &$this, 'override_options' ), 	10,	2 );
		}

		/**
		 * Register all public scripts & styles.
		 *
		 * @author Gerkin
		 */
		public function declare_resources() {
			if($this->get_option('use_cdn')){
				$this->declare_resource( 'imagesloaded', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/4.1.3/imagesloaded.min.js', array( 'jquery' ) );
				$this->declare_resource( 'qtip', 'https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.js', array( 'jquery', 'imagesloaded' ) );
				$this->declare_resource( 'ithoughts_tooltip_glossary-qtip-css', 'https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.css' );
			} else {
				$this->declare_resource( 'imagesloaded', 'assets/deps/js/imagesloaded.min.js', array( 'jquery' ) );
				$this->declare_resource( 'qtip', 'assets/deps/jquery.qtip.min.js', array( 'jquery', 'imagesloaded' ) );
				$this->declare_resource( 'ithoughts_tooltip_glossary-qtip-css', 'assets/deps/jquery.qtip.min.css' );
			}

			$this->declare_resource( 'ithoughts_tooltip_glossary-qtip', 'assets/dist/js/main.js', array( 'qtip', 'ithoughts-core-v5' ), false, 'iThoughtsTooltipGlossary', array(
				'admin_ajax'    => admin_url( 'admin-ajax.php' ),
				// Get the API endpoint. See https://wordpress.stackexchange.com/questions/144822/what-is-the-best-practice-to-check-for-pretty-permalinks.
				'apiurl'		=> get_site_url( null, '' !== get_option( 'permalink_structure' ) ? 'wp-json' : '?rest_route=' ) . '/wp/v2',
				'baseurl'		=> $this->base_url,
				'tip' => array(
					'style'     => $this->get_option( 'tip-style' ),
					'trigger'   => $this->get_option( 'tip-trigger' ),
					'shadow'    => $this->get_option( 'tip-shadow' ),
					'rounded'   => $this->get_option( 'tip-rounded' ),
					'anim'			=> array(
						'in'	=> $this->get_option( 'tip-anim-in' ),
						'out'	=> $this->get_option( 'tip-anim-out' ),
						'duration'	=> $this->get_option( 'tip-anim-time' ),
					),
				),
				'gloss' => array(
					'contenttype'	=> $this->get_option( 'gloss-contenttype' ),
				),
				'verbosity'     	=> intval($this->get_option( 'verbosity' )),
				'lang'			=> array(
					'qtip' => array(
						'pleasewait_ajaxload' => array(
							'content' => __( 'Loading gloss', 'ithoughts-tooltip-glossary' ),
						),
					),
				),
				'nonce'			=> wp_create_nonce( 'ithoughts_tt_gl-get_term_details' ),
			) );
			$this->declare_resource( 'ithoughts_tooltip_glossary-atoz', 'assets/dist/js/atoz.js', array( 'jquery', 'ithoughts-core-v5' ) );
			// Generate all Style resources.
			$this->declare_resource( 'ithoughts_tooltip_glossary-css', 'assets/dist/css/ithoughts_tt_gl.min.css' );
			if ( isset( $this->options['custom_styles_path'] ) ) {
				$this->declare_resource( 'ithoughts_tooltip_glossary-customthemes', $this->options['custom_styles_path'] );
			}
		}

		/**
		 * Get the list of options that can be overriden (on the server).
		 *
		 * @return string[] List of options overridables
		 */
		public function get_server_side_overridable() {
			return $this->serverside_overridable;
		}

		/**
		 * Get the list of options that can be overriden (on the client).
		 *
		 * @return string[] List of options overridables
		 */
		public function get_client_side_overridable() {
			return $this->clientside_overridable;
		}

		/**
		 * Get the list of attributes that have a special meaning.
		 *
		 * @return string[] Attributes with a special meaning
		 */
		public function get_handled_attributes() {
			return $this->handled_attributes;
		}

		/**
		 * Load the Filters class.
		 */
		private function add_filters() {
			require_once( $this->base_class_path . '/class-filters.php' );
			filters::get_instance();
		}

		/**
		 * Set up ajax hooks used by both logged-in and non logged-in users for getting term details.
		 *
		 * @action init
		 *
		 * @author Gerkin
		 */
		public function ajax_hooks() {
			add_action( 'wp_ajax_ithoughts_tt_gl_get_term_details',        array( &$this, 'get_term_details_ajax' ) );
			add_action( 'wp_ajax_nopriv_ithoughts_tt_gl_get_term_details', array( &$this, 'get_term_details_ajax' ) );
		}

		/**
		 * Load plugin localization. If it fails, it logs an error of type LogLevel::ERROR
		 */
		public function localisation() {
			if ( load_plugin_textdomain( 'ithoughts-tooltip-glossary', false, plugin_basename( dirname( __FILE__ ) ) . '/../lang' ) === false ) {
				$this->log( LogLevel::ERROR, 'Failed to load plugin localization' );
			}
		}

		/**
		 * Load & instanciate the PostType class.
		 */
		private function register_post_types() {
			require_once( $this->base_class_path . '/class-posttypes.php' );
			PostTypes::get_instance();
		}

		/**
		 * Load & instanciate the Taxonomies class
		 */
		private function register_taxonmies() {
			require_once( $this->base_class_path . '/class-taxonomies.php' );
			Taxonomies::get_instance();
		}

		/**
		 * Load & instanciate all shortcode singletons.
		 */
		private function add_shortcodes() {

			// Tooltips.
			require_once( $this->base_class_path . '/shortcode/tip/class-tip.php' );
			// Derived classes
			require_once( $this->base_class_path . '/shortcode/tip/class-tooltip.php' );
			shortcode\tip\Tooltip::get_instance($this);
			require_once( $this->base_class_path . '/shortcode/tip/class-mediatip.php' );
			shortcode\tip\Mediatip::get_instance($this);
			require_once( $this->base_class_path . '/shortcode/tip/class-gloss.php' );
			shortcode\tip\Gloss::get_instance($this);

			// Lists.
			require_once( $this->base_class_path . '/shortcode/index/class-glosseslist.php' );
			// Derived classes
			require_once( $this->base_class_path . '/shortcode/index/class-atoz.php' );
			shortcode\index\AtoZ::get_instance($this);
			require_once( $this->base_class_path . '/shortcode/index/class-glossary.php' );
			shortcode\index\Glossary::get_instance($this);
		}

		/**
		 * Load & declare widgets.
		 */
		public function widgets_init() {
			require_once( $this->base_class_path . '/class-randomterm.php' );
			register_widget( '\\ithoughts\\tooltip_glossary\\widgets\\RandomTerm' );
		}

		/**
		 * Print required resources in the footer
		 *
		 * @author Gerkin
		 */
		public function wp_footer() {
			if ( ! $this->scripts && false === $this->options['forceloadresources'] ) {
				return;
			}

			if(true === $this->options['forceloadresources']){
				$this->enqueue_resources( array(
					'ithoughts_tooltip_glossary-qtip',
					'ithoughts_tooltip_glossary-atoz',
					'ithoughts_tooltip_glossary-list',
				));
			}
		}

		/**
		 * Print client-side script for custom animations & other inline resources.
		 */
		public function after_scripts() {
			if ( $this->get_resource('ithoughts_tooltip_glossary-qtip')->is_enqueued() || true === $this->options['forceloadresources'] ) {
				// Get registered functions
				$anims_custom_in = apply_filters( 'ithoughts_tt_gl_tooltip_anim_in', array(), true );
				$anims_custom_out = apply_filters( 'ithoughts_tt_gl_tooltip_anim_out', array(), true );
				$anims_custom_in_count = count( $anims_custom_in );
				$anims_custom_out_count = count( $anims_custom_out );
				// Print our templates
				include $this->get_base_path() . '/templates/dist/animations.php';
				include $this->get_base_path() . '/templates/dist/icon.php';
			}// End if().
		}

		/**
		 * Ask WordPress to print required styles.
		 */
		public function wp_enqueue_styles() {
			$resourcesToLoad = array(
				'ithoughts_tooltip_glossary-css',
				'ithoughts_tooltip_glossary-qtip-css',
			);
			// If we are using a custom style, enqueue it
			if(isset( $this->options['custom_styles_path'] )){
				$resourcesToLoad[] = 'ithoughts_tooltip_glossary-customthemes';
			}

			$this->enqueue_resources( $resourcesToLoad );
		}

		/**
		 * Ask WordPress to print required scripts before any other else.
		 */
		public function wp_enqueue_scripts_hight_priority() {
			$this->enqueue_resource( 'ithoughts-core-v5' );
		}

		/**
		 * Order post and taxonomy archives alphabetically.
		 *
		 * @param array $query Query to set sort on.
		 */
		public function order_core_archive_list( $query ) {
			if ( is_post_type_archive( 'glossary' ) || is_tax( 'glossary_group' ) ) {
				$query->set( 'orderby', 'title' );
				$query->set( 'order',   'ASC' );
				return;
			}
		}

		/**
		 * Try to use qTranslate utils function to transform the URL provided.
		 *
		 * @param  string $url Url to translate.
		 * @return string Translated url, if appliable
		 */
		public function term_link( $url ) {
			// qTranslate plugin.
			if ( function_exists( 'qtrans_convertURL' ) ) {
				$url = qtrans_convertURL( $url );
			}

			return $url;
		}

		/**
		 * Merge shortcode datas with base config, if the option is overridable.
		 *
		 * @param  array $data       Data extracted from shortcode.
		 * @param  bool  $client_side True if the merge is for client-side config, false if the merge is for server-side config.
		 * @return array Merged data
		 */
		public function override_options( $data, $client_side ) {
			$overridden = array();
			$defaults = $client_side ? $this->clientside_overridable : $this->serverside_overridable;

			// Iterate on each option overridable by the target
			foreach ( $defaults as $option ) {
				// If we are overriding it, and value is different than set, inject it in the `overriden` array
				if ( isset( $data[ $option ] ) && ($data[ $option ] !== $this->options[ $option ]) ) {
					$overridden[ $option ] = $data[ $option ];
				}
			}
			return $overridden;
		}

		/**
		 * 
		 * 
		 * @return array Merged data
		 */
		public function get_serverside_options() {
			$opts = array();

			// Iterate on each option overridable by the target
			foreach ( $this->serverside_overridable as $option ) {
				$opts[$option] = $this->options[ $option ];
			}
			return $opts;
		}

		/**
		 * Seach terms matching query, using WPML functions if available.
		 *
		 * @param  array $args Base query to execute.
		 * @return array Matched posts
		 */
		public function search_terms( $args ) {
			$out_posts = array();
			if ( function_exists( 'icl_object_id' ) ) {// If WPML is installed...
				$original_language = apply_filters( 'wpml_current_language', null );

				$args['suppress_filters'] = true;
				$posts = (new \WP_Query( $args ))->get_posts();

				$post_ids = array();
				$not_translated = array();
				foreach ( $posts as $post ) {
					$id = apply_filters( 'wpml_object_id', $post->ID, 'glossary', false, $original_language );
					if ( null !== $id ) {
						$post_ids[] = intval( $id );
					} else {
						$not_translated[] = intval( $post->ID );
					}
				}
				$post_ids = array_unique( $post_ids );
				$not_translated = array_unique( $not_translated );
				$not_translated = array_diff( $not_translated,$post_ids );

				if ( count( $post_ids ) > 0 ) {
					$query = array(
						'post__in'				=> $post_ids,
						'orderby'				=> 'title',
						'order'					=> 'ASC',
						'suppress_filters'		=> true,
						'post_type'				=> 'glossary',
						'post_status'			=> 'publish',
						'posts_per_page'		=> 25,
						'ignore_sticky_posts'	=> true,
					);
					if ( empty( $post_ids ) ) { // Remove empty array to avoid MySQL error.
						unset( $query['post__in'] );
					}
					$posts_queried = (new \WP_Query( $query ))->get_posts();
					foreach ( $posts_queried as $post ) {
						$out_posts[] = array(
							'slug'		=> $post->post_name,
							'content'	=> wp_trim_words( wp_strip_all_tags( (isset( $post->post_excerpt )&&$post->post_excerpt)?$post->post_excerpt:$post->post_content ), 50, '...' ),
							'title'     => $post->post_title,
							'id'		=> $post->ID,
							'thislang'	=> true,
						);
					}
				}

				if ( count( $not_translated ) > 0 ) {
					$query = array(
						'post__in'				=> $not_translated,
						'orderby'				=> 'title',
						'order'					=> 'ASC',
						'suppress_filters'		=> true,
						'post_type'				=> 'glossary',
						'post_status'			=> 'publish',
						'posts_per_page'		=> 25,
						'ignore_sticky_posts'	=> true,
					);
					if ( empty( $not_translated ) ) { // Remove empty array to avoid MySQL error.
						unset( $query['post__in'] );
					}
				}
			} else {
				$query = $args;
			}// End if().
			$posts_queried = (new \WP_Query( $query ))->get_posts();
			foreach ( $posts_queried as $post ) {
				$content = (isset( $post->post_excerpt ) && $post->post_excerpt) ? $post->post_excerpt : $post->post_content;
				$new_post = array(
					'slug'		=> $post->post_name,
					'content'	=> wp_trim_words( wp_strip_all_tags( $content , 50, '...' ) ),
					'title'     => $post->post_title,
					'id'		=> $post->ID,
				);
				if ( function_exists( 'icl_object_id' ) ) {// If WPML is installed...
					$new_post['thislang'] = false;
				}
				$out_posts[] = $new_post;
			}
			return $out_posts;
		}

		/**
		 * Retrieve a single term by id.
		 */
		public function get_term_details_ajax() {
			/*
			Sanity and security checks:
			 - we have a termid (post id)
			 - it is post of type 'glossary' (don't display other post types!)
			 - it has a valid post status and current user can read it.
			 */
			check_ajax_referer( 'ithoughts_tt_gl-get_term_details' );
			$statii = array( 'publish', 'private' );
			$term   = null;
			if ( isset( $_GET['glossId'] ) ) { // Input var okay.
				$gloss_id = absint( $_GET['glossId'] ); // Input var okay.
				if ( function_exists( 'icl_object_id' ) ) {
					if ( ! (isset( $_GET['disable_auto_translation'] ) && 0 !== absint( $_GET['disable_auto_translation'] )) ) { // Input var okay.
						$gloss_id = apply_filters( 'wpml_object_id', $gloss_id, 'glossary', true, apply_filters( 'wpml_current_language', null ) );
					}
				}
				$termob = get_post( $gloss_id );
				if ( get_post_type( $termob ) && 'glossary' === get_post_type( $termob ) && in_array( $termob->post_status, $statii, true ) ) {
					$term = $termob;
				}
			}

			// Fail if no term found (either due to bad set up, or someone trying to be sneaky!).
			if ( ! $term ) {
				wp_send_json_error();
				wp_die();
			}

			$title = $term->post_title;
			$nonce = wp_create_nonce( 'ithoughts_tt_gl-get_term_details' );
			// Don't display private terms.
			if ( 'private' === $termob->post_status && ! current_user_can( 'read_private_posts' ) ) {
				wp_send_json_success( array(
					'title' => $title,
					'content' => '<p>' . __( 'Private gloss', 'ithoughts-tooltip-glossary' ) . '</p>',
					'nonce_refresh' => $nonce,
				) );
			}

			// Don't display password protected items.
			if ( post_password_required( $gloss_id ) ) {
				wp_send_json_success( array(
					'title' => $title,
					'content' => '<p>' . __( 'Protected gloss', 'ithoughts-tooltip-glossary' ) . '</p>',
					'nonce_refresh' => $nonce,
				) );
			}

			// Merge with static shortcode method.
			if ( isset( $_GET['content'] ) ) { // Input var okay.
				$content_type = sanitize_text_field( wp_unslash( $_GET['content'] ) ); // Input var okay.
				switch ( $content_type ) {
					case 'full':{
						$content = apply_filters( 'ithoughts_tt_gl_gloss_content', $termob );
					}break;

					case 'excerpt':{
						$content = apply_filters( 'ithoughts_tt_gl_gloss_excerpt', $termob );
					}break;

					case 'off':{
						$content = '';
					}break;
				}
			}

			// If content is empty, assume due to clash in settings and fetch full post content just in case.
			if ( empty( $content ) ) {
				$content = $term->post_content ;
			}
			if ( empty( $content ) ) {
				$content = '<p>' . __( 'No content', 'ithoughts-tooltip-glossary' ) . '...</p>';
			}

			wp_send_json_success( array(
				'title' => $title,
				'content' => $content,
				'nonce_refresh' => $nonce,
			) );
			wp_die();
		}
	}
}// End if().
