<?php
/**
 * iThoughts Tooltip Glossary main file.
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

use \ithoughts\v5_0\Resource as Resource;
use \ithoughts\v5_0\LogLevel as LogLevel;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


if ( ! class_exists( __NAMESPACE__ . '\\Backbone' ) ) {
	/**
	 * Main class of iThoughts Tooltip Glossary
	 *
	 * @author Gerkin
	 */
	class Backbone extends \ithoughts\v5_0\Backbone {
		private $defaults;
		private $overridesjsdat;
		private $overridesopts;
		private $optionsConfig;
		private $handledAttributes;

		function __construct( $plugin_base ) {
			$this->optionsName		= 'ithoughts_tt_gl';

			$this->base_path		= $plugin_base;

			parent::__construct();

			$optionsConfig = array(
				'version'		=> array(
					'default'		=> '-1',
					'serversideOverride'	=> false,
					'cliensideOverride'	=> false,
				),
				'termcontent'		=> array(
					'default'		=> 'excerpt',
					'serversideOverride'	=> true,
					'cliensideOverride'	=> true,
					'accepted'		=> array(
						'full',
						'excerpt',
						'off',
					),
				),
				'termscomment'		=> array(
					'default'		=> false,
					'serversideOverride'	=> false,
					'cliensideOverride'	=> false,
					'accepted'		=> array(
						true,
						false,
					),
				),
				'termtype'		=> array(
					'default'		=> 'glossary',
					'serversideOverride'	=> false,
					'cliensideOverride'	=> false,
				),
				'grouptype'		=> array(
					'default'		=> 'group',
					'serversideOverride'	=> false,
					'cliensideOverride'	=> false,
				),
				'qtipstyle'		=> array(
					'default'		=> 'cream',
					'serversideOverride'	=> false,
					'cliensideOverride'	=> true,
					'accepted'		=> array(
						'cream',
						'dark',
						'green',
						'light',
						'red',
						'blue',
						'plain',
						'bootstrap',
						'youtube',
						'tipsy',
					),
				),
				'termlinkopt'	=> array(
					'default'		=> 'standard',
					'serversideOverride'	=> true,
					'cliensideOverride'	=> false,// Not a js data
					'accepted'		=> array(
						'standard',
						'none',
						'blank',
					),
				),
				'qtiptrigger'	=> array(
					'default'		=> 'click',
					'serversideOverride'	=> false,
					'cliensideOverride'	=> true,
					'accepted'		=> array(
						'click',
						'responsive',
					),
				),
				'qtipshadow'	=> array(
					'default'		=> true,
					'serversideOverride'	=> false,
					'cliensideOverride'	=> true,
					'accepted'		=> array(
						true,
						false,
					),
				),
				'qtiprounded'	=> array(
					'default'		=> false,
					'serversideOverride'	=> false,
					'cliensideOverride'	=> true,
					'accepted'		=> array(
						true,
						false,
					),
				),
				'staticterms'	=> array(
					'default'		=> false,
					'serversideOverride'	=> false,// If required once, required everywhere
					'cliensideOverride'	=> false,// Not a js data
					'accepted'		=> array(
						true,
						false,
					),
				),
				'forceloadresources'	=> array(
					'default'		=> false,
					'serversideOverride'	=> false,// If required once, required everywhere
					'cliensideOverride'	=> false,// Not a js data
					'accepted'		=> array(
						true,
						false,
					),
				),
				'verbosity'	=> array(
					'default'		=> LogLevel::Error,
					'serversideOverride'	=> false,// If required once, required everywhere
					'cliensideOverride'	=> false,// Not a js data
					'accepted'		=> array(
						LogLevel::Silent,
						LogLevel::Error,
						LogLevel::Warn,
						LogLevel::Info,
						LogLevel::Silly,
					),
				),
				'anim_in'		=> array(
					'default'		=> 'none',
					'serversideOverride'	=> false,
					'cliensideOverride'	=> true,
				),
				'anim_out'		=> array(
					'default'		=> 'none',
					'serversideOverride'	=> false,
					'cliensideOverride'	=> true,
				),
				'anim_time'		=> array(
					'default'		=> 500,
					'serversideOverride'	=> false,
					'cliensideOverride'	=> true,
				),
				'custom_styles_path'	=> array(
					'default'		=> null,
					'serversideOverride'	=> false,// If required once, required everywhere
					'cliensideOverride'	=> false,// Not a js data
				),
				'lists_size'			=> array(
					'default'		=> -1,
					'serversideOverride'	=> true,
					'cliensideOverride'	=> false,// Not a js data
				),
				'exclude_search'	=> array(
					'default'		=> false,
					'serversideOverride'	=> false,// If required once, required everywhere
					'cliensideOverride'	=> false,// Not a js data
					'accepted'		=> array(
						true,
						false,
					),
				),
			);

			$this->defaultOptions = array();
			foreach ( $optionsConfig as $opt => $val ) {
				$this->defaultOptions[ $opt ] = $val['default'];
			}
			$this->clientsideOverridable = array();
			foreach ( $optionsConfig as $opt => $val ) {
				if ( $val['cliensideOverride'] ) {
					$this->clientsideOverridable[] = $opt;
				}
			}
			$this->serversideOverridable = array();
			foreach ( $optionsConfig as $opt => $val ) {
				if ( $val['serversideOverride'] ) {
					$this->serversideOverridable[] = $opt;
				}
			}

			$this->handledAttributes = array(
				'tooltip-content',
				'glossary-id',
				'mediatip-type',
				'mediatip-content',
				'mediatip-link',
				'cols',
				'group',
				'alpha',
				'desc',
				'disable_auto_translation',
				// "masonry",
				'list-mode',
			);

			// Print the load message
			$tail = '';
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				$tail = ' in DEBUG mode';
			}
			$this->log( LogLevel::Silly, "Loaded plugin iThoughts Tooltip Glossary v{$this->get_option('version')}$tail." );

			$this->register_post_types();
			$this->register_taxonmies();
			$this->add_shortcodes();
			$this->add_widgets();
			$this->add_filters();
			/*
			//TEST
			require_once( $this->base_class_path . '/class-autolink.php' );
			AutoLink::get_instance();
			//ENDTEST*/
			add_action( 'init',                  		array( &$this, 'declare_resources' ) );
			add_action( 'init',                  		array( &$this, 'ajax_hooks' ) );
			add_action( 'wp_footer',             		array( &$this, 'wp_footer' ) );
			add_action( 'admin_footer',            		array( &$this, 'wp_footer' ) );
			add_action( 'wp_print_footer_scripts',		array( &$this, 'afterScripts' ), 100000 );
			add_action( 'admin_print_footer_scripts',	array( &$this, 'afterScripts' ), 100000 );
			add_action( 'wp_enqueue_scripts',    		array( &$this, 'wp_enqueue_styles' ) );
			add_action( 'admin_enqueue_scripts',   		array( &$this, 'wp_enqueue_styles' ) );
			add_action( 'pre_get_posts',         		array( &$this, 'order_core_archive_list' ) );

			add_filter( 'ithoughts_tt_gl_term_link',	array( &$this, 'ithoughts_tt_gl_term_link' ) );
			add_filter( 'ithoughts_tt_gl_get_overriden_opts',	array( &$this, 'ithoughts_tt_gl_override' ), 	10,	2 );

			add_action( 'plugins_loaded',				array( $this, 'localisation' ) );
		}

		/**
		 * Register all public scripts & styles
		 *
		 * @author Gerkin
		 */
		public function declare_resources() {
			$ajax_url = admin_url('admin-ajax.php');
			// Add the query parameter required by WPML
			// See https://wpml.org/documentation/support/debugging-theme-compatibility/#issue-custom-non-standard-wordpress-ajax-requests-always-return-the-default-language-content
			if ( function_exists('icl_object_id') ) {
				$current_language = apply_filters( 'wpml_current_language', NULL ); 
				if ( $current_language ) {
					$ajax_url = add_query_arg( 'wpml_lang', $current_language, $ajax_url );
					// $ajax_url will be something like 'http://my-site.com/wp-content/plugins/my-plugin/handle-ajax.php?wpml_lang=es'
				}
			}
			// Generate all Script resources
			$this->declare_resource( 'imagesloaded', 'ext/imagesloaded.min.js' );
			$this->declare_resource( 'qtip', 'ext/jquery.qtip.js', array( 'jquery', 'imagesloaded' ) );
			$this->declare_resource( 'ithoughts_tooltip_glossary-qtip', 'js/dist/ithoughts_tt_gl-qtip2.js', array( 'qtip', 'ithoughts-core-v5' ), false, 'iThoughtsTooltipGlossary', array(
				'admin_ajax'    => $ajax_url,
				// Get the API endpoint. See https://wordpress.stackexchange.com/questions/144822/what-is-the-best-practice-to-check-for-pretty-permalinks
				'apiurl'		=> get_site_url( null, get_option( 'permalink_structure' ) != '' ? 'wp-json' : '?rest_route=' ) . '/wp/v2',
				'baseurl'		=> $this->base_url,
				'qtipstyle'     => $this->get_option( 'qtipstyle' ),
				'qtiptrigger'   => $this->get_option( 'qtiptrigger' ),
				'qtipshadow'    => $this->get_option( 'qtipshadow' ),
				'qtiprounded'   => $this->get_option( 'qtiprounded' ),
				'termcontent'	=> $this->get_option( 'termcontent' ),
				'verbosity'     	=> $this->get_option( 'verbosity' ),
				'anims'			=> array(
					'in'	=> $this->get_option( 'anim_in' ),
					'out'	=> $this->get_option( 'anim_out' ),
					'duration'	=> $this->get_option( 'anim_time' ),
				),
				'lang'			=> array(
					'qtip' => array(
						'pleasewait_ajaxload' => array(
							'title' => __( 'Please wait', 'ithoughts-tooltip-glossary' ),
							'content' => __( 'Loading glossary term', 'ithoughts-tooltip-glossary' ),
						),
					),
				),
				)
			);
			$this->declare_resource( 'ithoughts_tooltip_glossary-atoz', 'js/dist/ithoughts_tt_gl-atoz.js', array( 'jquery', 'ithoughts-core-v5' ) );
			// $this->declare_resource( 'ithoughts_tooltip_glossary-list', 'js/dist/ithoughts_tt_gl-glossary-list.js', array('jquery', 'ithoughts-core-v5'));
			// Generate all Style resources
			$this->declare_resource( 'ithoughts_tooltip_glossary-css', 'css/ithoughts_tt_gl.min.css' );
			$this->declare_resource( 'ithoughts_tooltip_glossary-qtip-css', 'ext/jquery.qtip.min.css' );
			if ( isset( $this->options['custom_styles_path'] ) ) {
				wp_register_style( 'ithoughts_tooltip_glossary-customthemes', $this->options['custom_styles_path'] );
			}
		}

		public function get_server_side_overridable() {
			return $this->serversideOverridable;
		}
		public function get_client_side_overridable() {
			return $this->clientsideOverridable;
		}

		public function get_handled_attributes() {
			return $this->handledAttributes;
		}
		public function add_filters() {
			require_once( $this->base_class_path . '/class-filters.php' );
			new filters();
		}
		public function addScript( $newArray ) {
			$this->scripts = array_merge( $this->scripts, $newArray );
		}

		/**
		 * Set up ajax hooks used by the plugin.
		 * Public ajax hooks are:
		 * 	* getting terms list (wp_ajax_ithoughts_tt_gl_get_terms_list & wp_ajax_nopriv_ithoughts_tt_gl_get_terms_list)
		 * 	* getting term content (wp_ajax_ithoughts_tt_gl_get_term_details & wp_ajax_nopriv_ithoughts_tt_gl_get_term_details)
		 *
		 *  @action init
		 *
		 * @author Gerkin
		 */
		public function ajax_hooks() {
			add_action( 'wp_ajax_ithoughts_tt_gl_get_terms_list',			array( &$this, 'get_terms_list_ajax' ) );
			add_action( 'wp_ajax_nopriv_ithoughts_tt_gl_get_terms_list',	array( &$this, 'get_terms_list_ajax' ) );

			add_action( 'wp_ajax_ithoughts_tt_gl_get_term_details',        array( &$this, 'get_term_details_ajax' ) );
			add_action( 'wp_ajax_nopriv_ithoughts_tt_gl_get_term_details', array( &$this, 'get_term_details_ajax' ) );
		}

		public function localisation() {
			if ( load_plugin_textdomain( 'ithoughts-tooltip-glossary', false, plugin_basename( dirname( __FILE__ ) ) . '/../lang' ) === false ) {
			} else {
			}
			require_once( $this->base_class_path . '/class-micropost.php' );
		}

		private function register_post_types() {
			require_once( $this->base_class_path . '/class-posttypes.php' );
			PostTypes::get_instance();
		}

		private function register_taxonmies() {
			require_once( $this->base_class_path . '/class-taxonomies.php' );
			Taxonomies::get_instance();
		}

		private function add_shortcodes() {
			require_once( $this->base_class_path . '/shortcode/class-tooltip.php' );
			shortcode\Tooltip::get_instance();
			require_once( $this->base_class_path . '/shortcode/class-mediatip.php' );
			shortcode\Mediatip::get_instance();
			require_once( $this->base_class_path . '/shortcode/class-glossary.php' );
			shortcode\Glossary::get_instance();
			require_once( $this->base_class_path . '/shortcode/class-glossarylist.php' );
			// new shortcode\List();
			require_once( $this->base_class_path . '/shortcode/class-atoz.php' );
			shortcode\AtoZ::get_instance();
			require_once( $this->base_class_path . '/shortcode/class-termlist.php' );
			shortcode\TermList::get_instance();
		}

		private function add_widgets() {
			require_once( $this->base_class_path . '/class-randomterm.php' );
			add_action( 'widgets_init', array( $this, 'widgets_init' ) );
		}

		public function widgets_init() {
			register_widget( '\\ithoughts\\tooltip_glossary\\widgets\\RandomTerm' );
		}

		/**
		 * Print required resources in the footer
		 *
		 * @author Gerkin
		 */
		public function wp_footer() {
			if ( ! $this->scripts && $this->options['forceloadresources'] !== true ) {
				return;
			}

			if ( $this->get_script( 'qtip' ) || $this->options['forceloadresources'] === true ) {
				$this->enqueue_resource( 'ithoughts_tooltip_glossary-qtip' );
			}
			if ( $this->get_script( 'atoz' ) || $this->options['forceloadresources'] === true ) {
				$this->enqueue_resource( 'ithoughts_tooltip_glossary-atoz' );
			}
			if ( $this->get_script( 'list' ) || $this->options['forceloadresources'] === true ) {
				$this->enqueue_resource( 'ithoughts_tooltip_glossary-list' );
			}
		}

		public function afterScripts() {
			if ( ! $this->scripts && $this->options['forceloadresources'] !== true ) {
				return;
			}

			if ( $this->get_script( 'qtip' ) || $this->options['forceloadresources'] === true ) {
				$animsCustomIn = apply_filters( 'ithoughts_tt_gl_tooltip_anim_in', array(), true );
				$animsCustomOut = apply_filters( 'ithoughts_tt_gl_tooltip_anim_out', array(), true );
				if ( count( $animsCustomIn ) || count( $animsCustomOut ) ) {
?>
<script id="ithoughts_tt_gl-custom-anims">iThoughtsTooltipGlossary.animationFunctions = jQuery.extend(!0,iThoughtsTooltipGlossary.animationFunctions,{<?php if ( count( $animsCustomIn ) ) { ?>in:{<?php foreach ( $animsCustomIn as $name => $animInfos ) { ?><?php echo '"' . $name . '":' . $animInfos['js'] . ',' ?><?php } ?>}<?php } ?><?php echo count( $animsCustomIn ) ? ',' : '' ?><?php if ( count( $animsCustomOut ) ) { ?>out:{<?php foreach ( $animsCustomOut as $name => $animInfos ) { ?><?php echo '"' . $name . '":' . $animInfos['js'] . ',' ?><?php } ?>}<?php } ?>});</script>
<?php
				}
?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
	<defs>
		<g id="icon-pin">
			<path
				  d="M 0.25621998,25.646497 C 0.35412138,25.51563 8.5166343,14.857495 8.5374693,14.833322 c 0.01094,-0.0127 0.590149,0.546824 1.2871218,1.243379 l 1.2672239,1.266464 -0.113872,0.108034 c -0.06263,0.05942 -2.4218887,1.87452 -5.2427987,4.033559 -2.8209111,2.159038 -5.22033552,3.995592 -5.33205472,4.081231 -0.1117192,0.08564 -0.1778105,0.121867 -0.1468696,0.08051 z M 10.813205,15.081346 5.1765477,9.4410226 5.5066273,9.1363586 c 1.352333,-1.248209 3.394005,-2.021634 5.3421487,-2.02371 0.458009,-5.08e-4 1.41897,0.119826 1.818038,0.227623 0.153614,0.04149 0.294168,0.07572 0.312341,0.07605 0.01817,3.55e-4 1.092202,-1.489664 2.386729,-3.3111007 1.294528,-1.8214368 2.428561,-3.38662092 2.520075,-3.47818672 0.28165,-0.2818105 0.555582,-0.3909508 0.943521,-0.3759184 0.182951,0.00709 0.162107,-0.013074 3.864784,3.73859352 3.254781,3.2978453 3.086677,3.0918563 2.93667,3.5984923 -0.05076,0.17145 -0.146799,0.319619 -0.312683,0.482424 -0.13168,0.129236 -1.72794,1.247526 -3.547245,2.4850904 l -3.307827,2.250116 0.07053,0.238176 c 0.261983,0.884659 0.33256,2.448506 0.155133,3.437409 -0.207111,1.154346 -0.770968,2.461073 -1.459695,3.382811 -0.341163,0.456586 -0.692454,0.857442 -0.751422,0.857442 -0.01533,0 -2.564362,-2.538145 -5.664523,-5.640321 z m 1.183444,-3.15174 c 0.635549,-0.607589 1.394229,-1.208949 1.823733,-1.445565 0.189467,-0.104378 0.350419,-0.193746 0.357671,-0.198595 0.0073,-0.0049 -0.209838,-0.23123 -0.482424,-0.5030684 l -0.495609,-0.494252 -0.458787,0.02717 c -0.763005,0.04518 -1.725568,0.417431 -2.613089,1.0105574 -0.2096949,0.140138 -0.3897971,0.261798 -0.4002271,0.270355 -0.02985,0.02449 1.6821321,1.797302 1.7356301,1.797302 0.02632,0 0.266216,-0.208755 0.533102,-0.4639 z m 6.401659,-4.9697184 c 1.204232,-1.103227 2.189716,-2.019561 2.189964,-2.036297 0.0011,-0.07401 -1.735932,-1.6808181 -1.772946,-1.6400264 -0.02268,0.024997 -0.866374,1.1015034 -1.874874,2.3922374 l -1.833635,2.346789 0.493873,0.483774 c 0.27163,0.266075 0.519575,0.478287 0.550989,0.471582 0.03141,-0.0067 1.042397,-0.914832 2.246629,-2.018059 z" />
		</g>
	</defs>
</svg>
<?php
			}
		}

		public function wp_enqueue_styles() {
			$this->enqueue_resources(array(
				'ithoughts_tooltip_glossary-css',
				'ithoughts_tooltip_glossary-qtip-css',
				)
			);
			
			if ( isset( $this->options['custom_styles_path'] ) ) {
				wp_enqueue_style( 'ithoughts_tooltip_glossary-customthemes' );
			}
		}
		public function wp_enqueue_scripts_hight_priority() {
			$this->enqueue_resource( 'ithoughts-core-v5' );
		}

		/**
		 * Order post and taxonomy archives alphabetically
		 */
		public function order_core_archive_list( $query ) {
			if ( is_post_type_archive( 'glossary' ) || is_tax( 'glossary_group' ) ) {
				$query->set( 'orderby', 'title' );
				$query->set( 'order',   'ASC' );
				return;
			}
		}

		/**
		 * Translation support
		 */
		public function ithoughts_tt_gl_term_link( $url ) {
			// qTranslate plugin
			if ( function_exists( 'qtrans_convertURL' ) ) :
				$url = qtrans_convertURL( $url );
			endif;

			return $url;
		}
		public function ithoughts_tt_gl_override( $data, $clientSide ) {
			$overridden = array();
			if ( $clientSide ) {
				foreach ( $this->clientsideOverridable as $overrideable ) {
					if ( isset( $data[ $overrideable ] ) && ($data[ $overrideable ] != $this->options[ $overrideable ]) ) {
						$overridden[ $overrideable ] = $data[ $overrideable ];
					}
				}
			} else {
				$overriddenConcat = array_merge( $this->get_options(), $data );
				foreach ( $this->serversideOverridable as $option ) {
					if ( isset( $overriddenConcat[ $option ] ) ) {
						$overridden[ $option ] = $overriddenConcat[ $option ];
					}
				}
			}
			return $overridden;
		}

		public function searchTerms( $args ) {
			$posts = array();
			if ( function_exists( 'icl_object_id' ) ) {
				// With WPML
				$originalLanguage = apply_filters( 'wpml_current_language', null );

				$args['suppress_filters'] = true;
				$posts = get_posts( $args );

				$postIds = array();
				$notTranslated = array();
				foreach ( $posts as $post ) {
					$id = apply_filters( 'wpml_object_id', $post->ID, 'glossary', false, $originalLanguage );
					if ( $id != null ) {
						$postIds[] = intval( $id );
					} else { $notTranslated[] = intval( $post->ID );
					}
				}
				$postIds = array_unique( $postIds );
				$notTranslated = array_unique( $notTranslated );
				$notTranslated = array_diff( $notTranslated,$postIds );
				$outPosts = array();

				if ( count( $postIds ) > 0 ) {
					$argsP = array(
						'post__in'				=> $postIds,
						'orderby'				=> 'title',
						'order'					=> 'ASC',
						'suppress_filters'		=> true,
						'post_type'				=> 'glossary',
						'post_status'			=> 'publish',
						'posts_per_page'		=> 25,
						'ignore_sticky_posts'	=> true,
					);
					if ( empty( $postIds ) ) { // Remove empty array to avoid MySQL error
						unset( $argsP['post__in'] );
					}
					$postsQueried = get_posts( $argsP );
					foreach ( $postsQueried as $post ) {
						$outPosts[] = array(
							'slug'		=> $post->post_name,
							'content'	=> wp_trim_words( wp_strip_all_tags( (isset( $post->post_excerpt )&&$post->post_excerpt)?$post->post_excerpt:$post->post_content ), 50, '...' ),
							'title'     => $post->post_title,
							'id'		=> $post->ID,
							'thislang'	=> true,
						);
					}
				}

				if ( count( $notTranslated ) > 0 ) {
					$argsP = array(
						'post__in'				=> $notTranslated,
						'orderby'				=> 'title',
						'order'					=> 'ASC',
						'suppress_filters'		=> true,
						'post_type'				=> 'glossary',
						'post_status'			=> 'publish',
						'posts_per_page'		=> 25,
						'ignore_sticky_posts'	=> true,
					);
					if ( empty( $notTranslated ) ) { // Remove empty array to avoid MySQL error
						unset( $argsP['post__in'] );
					}
					$postsQueried = get_posts( $argsP );
					foreach ( $postsQueried as $post ) {
						$outPosts[] = array(
							'slug'		=> $post->post_name,
							'content'	=> wp_trim_words( wp_strip_all_tags( (isset( $post->post_excerpt )&&$post->post_excerpt)?$post->post_excerpt:$post->post_content ), 50, '...' ),
							'title'     => $post->post_title,
							'id'		=> $post->ID,
							'thislang'	=> false,
						);
					}
				}
				$posts = $outPosts;
			} else {
				$outPosts = array();
				$posts = get_posts( $args );
				foreach ( $posts as $post ) {
					$outPosts[] = array(
						'slug'		=> $post->post_name,
						'content'	=> wp_trim_words( wp_strip_all_tags( (isset( $post->post_excerpt )&&$post->post_excerpt)?$post->post_excerpt:$post->post_content ), 50, '...' ),
						'title'		=> $post->post_title,
						'id'		=> $post->ID,
					);
				}
				$posts = $outPosts;
			}// End if().
			return $posts;
		}

		public function get_terms_list_ajax() {
			$output = array(
				'terms' => $this->searchTerms(array(
					'post_type'			=> 'glossary',
					'post_status'		=> 'publish',
					'posts_per_page'	=> 25,
					'orderby'       	=> 'title',
					'order'         	=> 'ASC',
					's'             	=> $_POST['search'],
					'suppress_filters'	=> false,
				)),
				'searched' => $_POST['search'],
			);
			wp_send_json_success( $output );
			return;
		}
		public function get_term_details_ajax() {
			// Sanity and security checks:
			// - we have a termid (post id)
			// - it is post of type 'glossary' (don't display other post types!)
			// - it has a valid post status and current user can read it.
			$statii = array( 'publish', 'private' );
			$term   = null;
			if ( isset( $_POST['termid'] ) && $termid = $_POST['termid'] ) {
				$termid = intval( $termid );
				if ( function_exists( 'icl_object_id' ) ) {
					// Change the lang depending on parameters
					// See https://wpml.org/documentation/support/debugging-theme-compatibility/#issue-custom-non-standard-wordpress-ajax-requests-always-return-the-default-language-content
					if ( isset( $_GET[ 'wpml_lang' ] ) ) {
						do_action( 'wpml_switch_language',  $_GET[ 'wpml_lang' ] ); // switch the content language
					}                            
					if ( ! (isset( $_POST['disable_auto_translation'] ) && $_POST['disable_auto_translation']) ) {
						$termid = apply_filters('ithoughts_tt_gl_wpml_get_term_current_language', $termid);
					}
				}
				$termob = get_post( $termid );
				if ( get_post_type( $termob ) && get_post_type( $termob ) == 'glossary' && in_array( $termob->post_status, $statii ) ) {
					$term = $termob;
				}
			}

			// Fail if no term found (either due to bad set up, or someone trying to be sneaky!)
			if ( ! $term ) {
				wp_send_json_error();
			}

			// Title
			$title = $term->post_title;

			// Don't display private terms
			if ( $termob->post_status == 'private' && ! current_user_can( 'read_private_posts' ) ) {
				wp_send_json_success( array(
					'title' => $title,
					'content' => '<p>' . __( 'Private glossary term', 'ithoughts-tooltip-glossary' ) . '</p>',
				) );
			}

			// Don't display password protected items.
			if ( post_password_required( $termid ) ) {
				wp_send_json_success( array(
					'title' => $title,
					'content' => '<p>' . __( 'Protected glossary term', 'ithoughts-tooltip-glossary' ) . '</p>',
				) );
			}

			// Content
			// Merge with static shortcode method
			switch ( $_POST['content'] ) {
				case 'full':{
					$content = apply_filters( 'ithoughts_tt_gl-term-content', $termob );
				}break;

				case 'excerpt':{
					$content = apply_filters( 'ithoughts_tt_gl-term-excerpt', $termob );
				}break;

				case 'off':{
					$content = '';
				}break;
			}

			// No content found, assume due to clash in settings and fetch full post content just in case.
			if ( empty( $content ) ) {
				$content = $term->post_content ;
			}
			if ( empty( $content ) ) {
				$content = '<p>' . __( 'No content', 'ithoughts-tooltip-glossary' ) . '...</p>';
			}

			wp_send_json_success( array(
				'title' => $title,
				'content' => $content,
			) );
		}
	}
}// End if().
