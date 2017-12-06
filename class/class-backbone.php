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


if ( ! class_exists( __NAMESPACE__ . '\\Backbone' ) ) 
	/**
	 * Main class of iThoughts Tooltip Glossary
	 *
	 * @author Gerkin
	 */
	class Backbone extends \ithoughts\v6_0\Backbone {
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
		function __construct( $plugin_base ) {
			$this->options_name		= 'ithoughts_tt_gl';

			$this->base_path		= $plugin_base;

			parent::__construct();

			$options_config = array(
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
					'cliensideOverride'	=> false,// Not a js data.
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
					'serversideOverride'	=> false,// If required once, required everywhere.
					'cliensideOverride'	=> false,// Not a js data.
					'accepted'		=> array(
						true,
						false,
					),
				),
				'forceloadresources'	=> array(
					'default'		=> false,
					'serversideOverride'	=> false,// If required once, required everywhere.
					'cliensideOverride'	=> false,// Not a js data.
					'accepted'		=> array(
						true,
						false,
					),
				),
				'verbosity'	=> array(
					'default'		=> LogLevel::ERROR,
					'serversideOverride'	=> false,// If required once, required everywhere.
					'cliensideOverride'	=> false,// Not a js data.
					'accepted'		=> array(
						LogLevel::SILENT,
						LogLevel::ERROR,
						LogLevel::WARN,
						LogLevel::INFO,
						LogLevel::SILLY,
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
					'serversideOverride'	=> false,// If required once, required everywhere.
					'cliensideOverride'	=> false,// Not a js data.
				),
				'lists_size'			=> array(
					'default'		=> -1,
					'serversideOverride'	=> true,
					'cliensideOverride'	=> false,// Not a js data.
				),
				'exclude_search'	=> array(
					'default'		=> false,
					'serversideOverride'	=> false,// If required once, required everywhere.
					'cliensideOverride'	=> false,// Not a js data.
					'accepted'		=> array(
						true,
						false,
					),
				),
			);

			$this->default_options = array();
			foreach ( $options_config as $opt => $val ) {
				$this->default_options[ $opt ] = $val['default'];
			}
			$this->clientside_overridable = array();
			foreach ( $options_config as $opt => $val ) {
				if ( $val['cliensideOverride'] ) {
					$this->clientside_overridable[] = $opt;
				}
			}
			$this->serverside_overridable = array();
			foreach ( $options_config as $opt => $val ) {
				if ( $val['serversideOverride'] ) {
					$this->serverside_overridable[] = $opt;
				}
			}

			$this->handled_attributes = array(
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
				'list-mode',
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
			$this->add_widgets();
			$this->add_filters();

			add_action( 'init',                  		array( &$this, 'declare_resources' ) );
			add_action( 'init',                  		array( &$this, 'ajax_hooks' ) );
			add_action( 'wp_footer',             		array( &$this, 'wp_footer' ) );
			add_action( 'admin_footer',            		array( &$this, 'wp_footer' ) );
			add_action( 'wp_print_footer_scripts',		array( &$this, 'afterScripts' ), 100000 );
			add_action( 'admin_print_footer_scripts',	array( &$this, 'afterScripts' ), 100000 );
			add_action( 'wp_enqueue_scripts',    		array( &$this, 'wp_enqueue_styles' ) );
			add_action( 'admin_enqueue_scripts',   		array( &$this, 'wp_enqueue_styles' ) );
			add_action( 'pre_get_posts',         		array( &$this, 'order_core_archive_list' ) );
			add_action( 'plugins_loaded',				array( $this, 'localisation' ) );

			add_filter( 'ithoughts_tt_gl_term_link',	array( &$this, 'ithoughts_tt_gl_term_link' ) );
			add_filter( 'ithoughts_tt_gl_get_overriden_opts',	array( &$this, 'ithoughts_tt_gl_override' ), 	10,	2 );
		}

		/**
		 * Register all public scripts & styles.
		 *
		 * @author Gerkin
		 */
		public function declare_resources() {
			// Generate all Script resources.
			$this->declare_resource( 'imagesloaded', 'ext/imagesloaded.min.js' );
			$this->declare_resource( 'qtip', 'ext/jquery.qtip.js', array( 'jquery', 'imagesloaded' ) );
			$this->declare_resource( 'ithoughts_tooltip_glossary-qtip', 'js/dist/ithoughts_tt_gl-qtip2.js', array( 'qtip', 'ithoughts-core-v5' ), false, 'iThoughtsTooltipGlossary', array(
				'admin_ajax'    => admin_url( 'admin-ajax.php' ),
				// Get the API endpoint. See https://wordpress.stackexchange.com/questions/144822/what-is-the-best-practice-to-check-for-pretty-permalinks.
				'apiurl'		=> get_site_url( null, '' !== get_option( 'permalink_structure' ) ? 'wp-json' : '?rest_route=' ) . '/wp/v2',
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
				'nonce'			=> wp_create_nonce( 'ithoughts_tt_gl-get_term_details' ),
			) );
			$this->declare_resource( 'ithoughts_tooltip_glossary-atoz', 'js/dist/ithoughts_tt_gl-atoz.js', array( 'jquery', 'ithoughts-core-v5' ) );
			// Generate all Style resources.
			$this->declare_resource( 'ithoughts_tooltip_glossary-css', 'css/ithoughts_tt_gl.min.css' );
			$this->declare_resource( 'ithoughts_tooltip_glossary-qtip-css', 'ext/jquery.qtip.min.css' );
			if ( isset( $this->options['custom_styles_path'] ) ) {
				wp_register_style( 'ithoughts_tooltip_glossary-customthemes', $this->options['custom_styles_path'] );
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
			new filters();
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
		 * Load plugin localization.
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
		 * Load & instanciate all shortcode classes.
		 */
		private function add_shortcodes() {
			// Tooltips.
			require_once( $this->base_class_path . '/shortcode/class-tooltip.php' );
			shortcode\Tooltip::get_instance();
			require_once( $this->base_class_path . '/shortcode/class-mediatip.php' );
			shortcode\Mediatip::get_instance();
			require_once( $this->base_class_path . '/shortcode/class-glossary.php' );
			shortcode\Glossary::get_instance();

			// Lists.
			require_once( $this->base_class_path . '/shortcode/class-glossarylist.php' );
			require_once( $this->base_class_path . '/shortcode/class-atoz.php' );
			shortcode\AtoZ::get_instance();
			require_once( $this->base_class_path . '/shortcode/class-termlist.php' );
			shortcode\TermList::get_instance();
		}

		/**
		 * Register actions for widgets.
		 */
		private function add_widgets() {
			add_action( 'widgets_init', array( $this, 'widgets_init' ) );
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

			if ( $this->get_script( 'qtip' ) || true === $this->options['forceloadresources'] ) {
				$this->enqueue_resource( 'ithoughts_tooltip_glossary-qtip' );
			}
			if ( $this->get_script( 'atoz' ) || true === $this->options['forceloadresources'] ) {
				$this->enqueue_resource( 'ithoughts_tooltip_glossary-atoz' );
			}
			if ( $this->get_script( 'list' ) || true === $this->options['forceloadresources'] ) {
				$this->enqueue_resource( 'ithoughts_tooltip_glossary-list' );
			}
		}

		/**
		 * Print client-side script for custom animations & other inline resources.
		 */
		public function afterScripts() {
			if ( ! $this->scripts && false === $this->options['forceloadresources'] ) {
				return;
			}

			if ( $this->get_script( 'qtip' ) || true === $this->options['forceloadresources'] ) {
				$anims_custom_in = apply_filters( 'ithoughts_tt_gl_tooltip_anim_in', array(), true );
				$anims_custom_out = apply_filters( 'ithoughts_tt_gl_tooltip_anim_out', array(), true );
				$anims_custom_in_count = count( $anims_custom_in );
				$anims_custom_out_count = count( $anims_custom_out );
				if ( count( $anims_custom_in ) > 0 || count( $anims_custom_out ) > 0 ) {
?>
<script id="ithoughts_tt_gl-custom-anims">iThoughtsTooltipGlossary.animationFunctions = jQuery.extend(!0,iThoughtsTooltipGlossary.animationFunctions,{<?php
if ( $anims_custom_in_count > 0 ) {
	echo 'in:{';
	foreach ( $anims_custom_in as $name => $anim_infos ) {
		echo '"' . esc_js( $name ) . '":' . esc_js( $anim_infos['js'] ) . ',';
	}
	echo '},';
}
if ( $anims_custom_out_count > 0 ) {
	echo 'out:{';
	foreach ( $anims_custom_out as $name => $anim_infos ) {
		echo '"' . esc_js( $name ) . '":' . esc_js( $anim_infos['js'] ) . ',';
	}
	echo '},';
}
		?>});</script>
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
			}// End if().
		}

		/**
		 * Ask WordPress to print required styles.
		 */
		public function wp_enqueue_styles() {
			$this->enqueue_resources( array(
				'ithoughts_tooltip_glossary-css',
				'ithoughts_tooltip_glossary-qtip-css',
			) );

			if ( isset( $this->options['custom_styles_path'] ) ) {
				wp_enqueue_style( 'ithoughts_tooltip_glossary-customthemes' );
			}
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
		public function ithoughts_tt_gl_term_link( $url ) {
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
		public function ithoughts_tt_gl_override( $data, $client_side ) {
			$overridden = array();
			if ( $client_side ) {
				foreach ( $this->clientside_overridable as $overrideable ) {
					if ( isset( $data[ $overrideable ] ) && ($data[ $overrideable ] !== $this->options[ $overrideable ]) ) {
						$overridden[ $overrideable ] = $data[ $overrideable ];
					}
				}
			} else {
				$overridden_concat = array_merge( $this->get_options(), $data );
				foreach ( $this->serverside_overridable as $option ) {
					if ( isset( $overridden_concat[ $option ] ) ) {
						$overridden[ $option ] = $overridden_concat[ $option ];
					}
				}
			}
			return $overridden;
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
			if ( isset( $_GET['termid'] ) ) { // Input var okay.
				$termid = absint( $_GET['termid'] ); // Input var okay.
				if ( function_exists( 'icl_object_id' ) ) {
					if ( ! (isset( $_GET['disable_auto_translation'] ) && 0 !== absint( $_GET['disable_auto_translation'] )) ) { // Input var okay.
						$termid = apply_filters( 'wpml_object_id', $termid, 'glossary', true, apply_filters( 'wpml_current_language', null ) );
					}
				}
				$termob = get_post( $termid );
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
					'content' => '<p>' . __( 'Private glossary term', 'ithoughts-tooltip-glossary' ) . '</p>',
					'nonce_refresh' => $nonce,
				) );
			}

			// Don't display password protected items.
			if ( post_password_required( $termid ) ) {
				wp_send_json_success( array(
					'title' => $title,
					'content' => '<p>' . __( 'Protected glossary term', 'ithoughts-tooltip-glossary' ) . '</p>',
					'nonce_refresh' => $nonce,
				) );
			}

			// Merge with static shortcode method.
			if ( isset( $_GET['content'] ) ) { // Input var okay.
				$content_type = sanitize_text_field( wp_unslash( $_GET['content'] ) ); // Input var okay.
				switch ( $content_type ) {
					case 'full':{
						$content = apply_filters( 'ithoughts_tt_gl_term_content', $termob );
					}break;

					case 'excerpt':{
						$content = apply_filters( 'ithoughts_tt_gl_term_excerpt', $termob );
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
