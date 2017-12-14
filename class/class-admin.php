<?php
/**
 * Main file for iThoughts Tooltip Glossary backend
 *
 * @file Backend handling class file. Included only if user is logged in
 *
 * @author Gerkin
 * @copyright 2015-2016 iThoughts Informatique
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

namespace ithoughts\tooltip_glossary;

use \ithoughts\v6_0\Toolbox as TB;
use \ithoughts\v6_0\Input as Input;

if ( ! defined( 'ABSPATH' ) ) {
	// Exit if accessed directly.
	status_header( 403 );
	wp_die( 'Forbidden' );
}

if ( ! class_exists( __NAMESPACE__ . '\\Admin' ) ) {
	/**
	 * Main class for iThoughts Tooltip Glossary backend
	 *
	 * @author Gerkin
	 */
	class Admin extends \ithoughts\v1_0\Singleton {
		/**
		 * Store version extracted from plugin main file.
		 *
		 * @var string $current_version
		 */
		private $current_version;

		/**
		 * Updater instance (will be set only if required).
		 *
		 * @var Updater $updater
		 */
		private $updater = null;

		/**
		 * Backbone instance.
		 *
		 * @var Backbone $backbone
		 */
		private $backbone = null;

		/**
		 * Register admin specific hooks & construct an instance.
		 *
		 * @author Gerkin
		 */
		public function __construct() {
			$this->backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			// Trigger version change function ?
			add_action( 'admin_init',								array( &$this, 'set_version' ) );
			add_action( 'admin_init',								array( &$this, 'ajax_hooks' ) );

			add_action( 'admin_menu',								array( &$this, 'get_menu' ) );

			add_filter( 'mce_buttons',								array( &$this, 'tinymce_register_buttons' ) );

			add_filter( 'mce_external_plugins',						array( &$this, 'tinymce_add_plugin' ) );

			add_filter( 'mce_external_languages',					array( &$this, 'tinymce_add_translations' ) );

			add_action( 'admin_init',								array( &$this, 'declare_resources' ) );

			add_action( 'admin_enqueue_scripts',					array( &$this, 'enqueue_scripts_and_styles' ) );
		}

		/**
		 * Opens a connection with the filesystem. Once done, you can write & read files
		 *
		 * @param  string $url             Url of the file to write.
		 * @param  string $method          [[Description]].
		 * @param  TODO   $context         [[Description]].
		 * @param  TODO [ $fields = null] [[Description]].
		 * @return boolean  True if connection is successful, false otherwise
		 */
		public function connect_fs( $url, $method, $context, $fields = null ) {
			global $wp_filesystem;
			$credentials = request_filesystem_credentials( $url, $method, false, $context, $fields );
			if ( false === $credentials ) {
				return false;
			}

			// check if credentials are correct or not.
			if ( ! WP_Filesystem( $credentials ) ) {
				request_filesystem_credentials( $url, $method, true, $context );
				return false;
			}

			return true;
		}

		/**
		 * Trigger check to see if update steps are available. Include and create an {@link \ithoughts\tooltip_glossary\Updater Updater} instance if required.
		 *
		 * @throws \Exception Throws an Exception if the plugin was unable to read its own informations.
		 * @author Gerkin
		 */
		public function set_version() {
			try {
				// Read infos from base file
				$plugindata = get_plugin_data( $this->backbone->get_base_path() . '/' . $this->backbone->get_name() . '.php' );
				if ( $plugindata && is_array( $plugindata ) && $plugindata['Version'] ) {
					$this->current_version = $plugindata['Version'];
				} else {
					throw new \Exception( 'unreadable_plugin_error' );
				}
				if ( $this->backbone->get_option( 'version' ) === -1 ) {
					$this->backbone->set_option( 'version',$this->current_version );
				} elseif ( $this->is_under_versionned() ) {
					$this->backbone->log( \ithoughts\v6_0\LogLevel::WARN, "Plugin settings are under versionned. Installed version is {$plugindata['Version']}, and config is {$this->backbone->get_option( 'version' )}" );
					// Create the updater.
					require_once( $this->backbone->get_base_class_path() . '/class-updater.php' );
					$this->updater = new Updater( $this->backbone->get_option( 'version' ), $this->current_version, $this );

					// Do we need to apply a particular update process?
					if ( $this->updater->requires_update() ) {
						// If an update is required, apply it.
						$this->backbone->log( \ithoughts\v6_0\LogLevel::INFO, "An update process is available to step to {$plugindata['Version']}." );
						// Show the update message.
						$this->updater->add_admin_notice();
					} else {
						// Else, simply update the option value.
						if ( $this->current_version !== $this->backbone->get_option( 'version' ) ) {
							$this->backbone->set_option( 'version', $this->current_version );
						}
					}
				}
			} catch ( \Exception $e ) {
				add_action( 'admin_notices', array( &$this, 'unreadable_plugin_error' ) );
			}
		}

		/**
		 * Display alert on error when plugin version is not readable
		 *
		 * @author Gerkin
		 */
		public function unreadable_plugin_error() {
?>
<div class="error form-invalid">
	<p><?php esc_html_e( "Can't read plugin version", 'ithoughts-tooltip-glossary' ); ?></p>
</div>
<?php
												  }

		/**
		 * Register admin-specific ajax hooks
		 *
		 * @author Gerkin
		 */
		public function ajax_hooks() {
			add_action( 'wp_ajax_ithoughts_tt_gl_get_terms_list',			array( &$this, 'get_terms_list_ajax' ) );

			add_action( 'wp_ajax_ithoughts_tt_gl_get_tinymce_tooltip_form',	array( &$this, 'get_tinymce_tooltip_form_ajax' ) );
			add_action( 'wp_ajax_ithoughts_tt_gl_get_tinymce_list_form',	array( &$this, 'get_tinymce_list_form_ajax' ) );
			add_action( 'wp_ajax_ithoughts_tt_gl_update_options',			array( &$this, 'update_options' ) );

			add_action( 'wp_ajax_ithoughts_tt_gl_theme_save',				array( &$this, 'savetheme' ) );
			add_action( 'wp_ajax_ithoughts_tt_gl_theme_preview',			array( &$this, 'previewtheme' ) );
		}

		/**
		 * Register all scripts & styles specific to admin
		 *
		 * @author Gerkin
		 */
		public function declare_resources() {

			$this->backbone->declare_resource(
				'ithoughts_tooltip_glossary-admin',
				'assets/dist/js/admin.js',
				array(
					'ithoughts-simple-ajax-v5',
					'ithoughts-core-v5',
					'ithoughts_tooltip_glossary-floater',
				),
				true
			);
			$this->backbone->declare_resource(
				'ithoughts_tooltip_glossary-tinymce_form',
				'assets/dist/js/tinymce/form-handler.js',
				array(
					'jquery',
					'ithoughts-core-v5',
					'ithoughts-simple-ajax-v5',
				),
				true
			);
			$this->backbone->declare_resource(
				'ithoughts_tooltip_glossary-updater',
				'assets/dist/js/updater.js',
				array(
					'jquery',
					'ithoughts-core-v5',
					'ithoughts_tooltip_glossary-qtip',
				),
				true
			);
			$this->backbone->declare_resource(
				'ithoughts_tooltip_glossary-floater',
				'assets/dist/js/ithoughts_tt_gl-floater.js',
				array(
					'jquery',
					'ithoughts-core-v5',
					'ithoughts_tooltip_glossary-qtip',
				),
				true
			);
			$this->backbone->declare_resource(
				'ithoughts_tooltip_glossary-styleeditor',
				'assets/dist/js/style-editor.js',
				array(
					'ithoughts-core-v5',
					'ithoughts_tooltip_glossary-floater',
					'ithoughts-simple-ajax-v5',
				),
				true
			);
			$this->backbone->declare_resource(
				'ithoughts_tooltip_glossary-tinymce',
				'assets/dist/js/tinymce/tinymce.js',
				array(
					'ithoughts-core-v5',
					'ithoughts_tooltip_glossary-qtip',
				),
				true
			);

			$this->backbone->declare_resource(
				'ithoughts_tooltip_glossary-tinymce_form-css',
				'assets/dist/css/ithoughts_tt_gl-tinymce-forms.min.css',
				null,
				true
			);
			$this->backbone->declare_resource(
				'ithoughts_tooltip_glossary-admin-css',
				'assets/dist/css/ithoughts_tt_gl-admin.min.css',
				null,
				true
			);
		}

		/**
		 * Enqueue the global Admin scripts & styles
		 *
		 * @author Gerkin
		 */
		public function enqueue_scripts_and_styles() {
			global $pagenow;

			$this->backbone->enqueue_resource( 'ithoughts_tooltip_glossary-admin-css' );


			if ( is_admin() ) {
				if ( 'post-new.php' === $pagenow || 'post.php' === $pagenow ) {
					$this->backbone->get_resource('ithoughts_tooltip_glossary-qtip')->add_localized_data( 'iThoughtsTooltipGlossaryEditor', array(
						'admin_ajax'    => admin_url( 'admin-ajax.php' ),
						'base_assets'   => $this->backbone->get_base_url() . '/assets',
						'verbosity'     => $this->backbone->get_option( 'verbosity' ),
						'nonce'         => wp_create_nonce( 'ithoughts_tt_gl-ajax_forms' ),
					));
				}
			}
		}

		/**
		 * Register plugin's TinyMCE buttons
		 *
		 * @author Gerkin
		 * @param  string[] $buttons Already registered buttons.
		 * @return string[] Original `$buttons` appended with this plugin's buttons.
		 */
		public function tinymce_register_buttons( $buttons ) {
			array_push( $buttons, 'separator', 'glossaryterm', 'glossaryterm-d', 'glossarylist' );
			return $buttons;
		}

		/**
		 * Register plugin's TinyMCE plugin and enqueue required scripts
		 *
		 * @author Gerkin
		 * @param  string[] $plugin_array List of already registered plugins.
		 * @return string[] Original `$plugin_array` appended with plugin's TinyMCE scripts.
		 * @filter mce_external_plugins
		 */
		public function tinymce_add_plugin( $plugin_array ) {

			$this->backbone->enqueue_resources( array(
				'ithoughts_tooltip_glossary-qtip',
				'ithoughts-serialize-object-v5',
				'ithoughts_tooltip_glossary-qtip-css',
				'ithoughts_tooltip_glossary-css',
			) );
			// jquery and jquery-ui should be dependencies, for modals
			wp_enqueue_script( 'jquery-ui-dialog' );
			wp_enqueue_style( 'wp-jquery-ui-dialog' );

			$version = 't=3.0.1';
			if ( defined( WP_DEBUG ) && WP_DEBUG ) {
				$version = 't=' . time();
			}
			$plugin_array['ithoughts_tt_gl_tinymce'] = $this->backbone->get_resource('ithoughts_tooltip_glossary-tinymce')->get_file_url() . '?' . $version;
			return $plugin_array;
		}

		/**
		 * Add plugin's related translations for use in TinyMCE
		 *
		 * @author Gerkin
		 * @param  string[] $locales Translations already registered.
		 * @return string[] Locales appended with iThoughts Tooltip Glossary TinyMCE translation file.
		 * @filter mce_external_languages
		 */
		public function tinymce_add_translations( $locales ) {

			$locales ['ithoughts_tt_gl_tinymce'] = $this->backbone->get_base_lang_path() . '/ithoughts_tt_gl_tinymce_lang.php';
			return $locales;
		}

		/**
		 * Generates the admin menu
		 *
		 * @author Gerkin
		 * @action admin_menu
		 */
		public function get_menu() {

			$plugindata = get_plugin_data( $this->backbone->get_base_path() . '/' . $this->backbone->get_name() . '.php' );
			$current_version = null;
			if ( $plugindata && is_array( $plugindata ) && $plugindata['Version'] ) {
				$this->current_version = $plugindata['Version'];
			} else {
				$current_version = '0.0';
			}

			add_menu_page( 'iThoughts Tooltip Glossary', 'Tooltip Glossary', 'edit_others_posts', 'ithoughts-tooltip-glossary', null, $this->backbone->get_base_url() . '/assets/dist/imgs/icon.svg' );

			$submenu_pages = array(
				// Define the plugin options page.
				array(
					'parent_slug'   => 'ithoughts-tooltip-glossary',
					'page_title'    => __( 'Options', 'ithoughts-tooltip-glossary' ),
					'menu_title'    => __( 'Options', 'ithoughts-tooltip-glossary' ),
					'capability'    => 'manage_options',
					'menu_slug'     => 'ithoughts-tooltip-glossary',
					'function'      => array( $this, 'options' ),
				),
				// Define the `Add new Term` page.
				array(
					'parent_slug'   => 'ithoughts-tooltip-glossary',
					'page_title'    => __( 'Add a Term', 'ithoughts-tooltip-glossary' ),
					'menu_title'    => __( 'Add a Term', 'ithoughts-tooltip-glossary' ),
					'capability'    => 'edit_others_posts',
					'menu_slug'     => 'post-new.php?post_type=glossary',
					'function'      => null,// Doesn't need a callback function.
				),
				// Define the glossary listing page.
				array(
					'parent_slug'   => 'ithoughts-tooltip-glossary',
					'page_title'    => __( 'Glossary Terms', 'ithoughts-tooltip-glossary' ),
					'menu_title'    => __( 'Glossary Terms', 'ithoughts-tooltip-glossary' ),
					'capability'    => 'edit_others_posts',
					'menu_slug'     => 'edit.php?post_type=glossary',
					'function'      => null,// Doesn't need a callback function.
				),
				// Define the taxonomy management page.
				array(
					'parent_slug'   => 'ithoughts-tooltip-glossary',
					'page_title'    => __( 'Glossary Groups', 'ithoughts-tooltip-glossary' ),
					'menu_title'    => __( 'Glossary Groups', 'ithoughts-tooltip-glossary' ),
					'capability'    => 'manage_categories',
					'menu_slug'     => 'edit-tags.php?taxonomy=glossary_group&post_type=glossary',
					'function'      => null,// Doesn't need a callback function.
				),
				// Define the theme editor page.
				array(
					'parent_slug'   => 'ithoughts-tooltip-glossary',
					'page_title'    => __( 'Theme editor', 'ithoughts-tooltip-glossary' ),
					'menu_title'    => __( 'Theme editor', 'ithoughts-tooltip-glossary' ),
					'capability'    => 'edit_theme_options',
					'menu_slug'     => 'ithoughts-tooltip-glossary-themes',
					'function'      => array( $this, 'theme_editor' ),// Doesn't need a callback function.
				),
			);

			if ( $this->is_under_versionned() ) {
				require_once( $this->backbone->get_base_class_path() . '/class-updater.php' );
				if ( Updater::requires_update_s( $this->backbone->get_option( 'version' ), $this->current_version ) ) {
					// If required, define the updater page.
					$submenu_pages[] = array(
						'parent_slug'   => 'ithoughts-tooltip-glossary',
						'page_title'    => __( 'Update', 'ithoughts-tooltip-glossary' ),
						'menu_title'    => __( 'Update', 'ithoughts-tooltip-glossary' ),
						'capability'    => 'manage_options',
						'menu_slug'     => 'ithoughts_tt_gl_update',
						'function'      => array( &$this->updater, 'updater' ),// Doesn't need a callback function.
					);
				}
			}

			// Add each submenu item to custom admin menu.
			foreach ( $submenu_pages as $submenu ) {
				add_submenu_page(
					$submenu['parent_slug'],
					$submenu['page_title'],
					$submenu['menu_title'],
					$submenu['capability'],
					$submenu['menu_slug'],
					$submenu['function']
				);

			}
		}

		/**
		 * Check if version stored in DB has updates available with in files version.
		 *
		 * @author Gerkin
		 * @return boolean Returns true if an update step is available, false otherwise
		 */
		public function is_under_versionned() {
			if ( '-1' === $this->backbone->get_option( 'version' ) ) {
				return false;
			}
			$version_diff = version_compare( $this->backbone->get_option( 'version' ), $this->current_version );
			return -1 === $version_diff;
		}

		/**
		 * Retrieve terms matching the string searched.
		 */
		public function get_terms_list_ajax() {

			if ( false === check_ajax_referer( 'ithoughts_tt_gl-get_terms_list', false, false ) ) {
				wp_send_json_error(array(
					'status' => 'error',
					'reason' => 'nonce',
				));
				wp_die();
			}
			$output = array(
				'terms' => $this->backbone->search_terms(array(
					'post_type'			=> 'glossary',
					'post_status'		=> 'publish',
					'posts_per_page'	=> 25,
					'orderby'       	=> 'title',
					'order'         	=> 'ASC',
					's'             	=> wp_unslash( $_POST['search'] ),// Input var okay.
					'suppress_filters'	=> false,
				)),
				'searched' => $_POST['search'],
				'nonce_refresh'	=> wp_create_nonce( 'ithoughts_tt_gl-get_terms_list' ),
			);
			wp_send_json_success( $output );
			wp_die();
		}

		/**
		 * Generates the options page of iThoughts Tooltip Glossary
		 *
		 * @author Gerkin
		 */
		public function options() {
			$ajax         = admin_url( 'admin-ajax.php' );
			$options      = $this->backbone->get_options();

			$this->backbone->enqueue_resources( array(
				'ithoughts_tooltip_glossary-admin',
				'ithoughts_tooltip_glossary-css',
				'ithoughts_tooltip_glossary-qtip-css',
				'ithoughts_tooltip_glossary-customthemes',
			) );

			/* Add required scripts for WordPress Spoilers (AKA PostBox) */
			wp_enqueue_script( 'postbox' );
			wp_enqueue_script( 'post' );

			$options_inputs = array();
			$options_inputs['termlinkopt'] = Input::create_select_input(
				'termlinkopt',
				array(
					'selected'	=> $options['termlinkopt'],
					'options'	=> array(
						'standard'	=> array(
							'text'	=> __( 'Normal', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'Normal link with no modifications', 'ithoughts-tooltip-glossary' ),
							),
						),
						'none'	=> array(
							'text'	=> __( 'No link', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( "Don't link to term", 'ithoughts-tooltip-glossary' ),
							),
						),
						'blank'	=> array(
							'text'	=> __( 'New tab', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'Always open in a new tab', 'ithoughts-tooltip-glossary' ),
							),
						),
					),
				)
			);
			$options_inputs['staticterms'] = Input::create_check_input(
				'staticterms',
				array(
					'radio' => false,
					'selected' => $options['staticterms'] ? 'enabled' : NULL,
					'options' => array(
						'enabled' => array(
							'attributes' => array(
								'id' => 'staticterms',
							),
						),
					),
				)
			);
			$options_inputs['forceloadresources'] = Input::create_check_input(
				'forceloadresources',
				array(
					'radio' => false,
					'selected' => $options['forceloadresources'] ? 'enabled' : NULL,
					'options' => array(
						'enabled' => array(
							'attributes' => array(
								'id' => 'forceloadresources',
							),
						),
					),
				)
			);
			$options_inputs['verbosity'] = Input::create_text_input(
				'verbosity',
				array(
					'type' => 'range',
					'value' => $options['verbosity'],
					'attributes' => array(
						'id' => 'verbosity',
						'max' => 4,
						'min' => 0,
					),
				)
			);
			$options_inputs['exclude_search'] = Input::create_check_input(
				'exclude_search',
				array(
					'radio' => false,
					'selected' => $options['exclude_search'] ? 'enabled' : NULL,
					'options' => array(
						'enabled' => array(
							'attributes' => array(
								'id' => 'exclude_search',
							),
						),
					),
				)
			);
			$options_inputs['termtype'] = Input::create_text_input(
				'termtype',
				array(
					'type' => 'text',
					'value' => $options['termtype'],
				)
			);
			$options_inputs['grouptype'] = Input::create_text_input(
				'grouptype',
				array(
					'type' => 'text',
					'value' => $options['grouptype'],
				)
			);
			$options_inputs['glossary-contenttype'] = Input::create_select_input(
				'glossary-contenttype',
				array(
					'selected' => $options['glossary-contenttype'],
					'options'  => array(
						'full'	=> array(
							'text'	=> __( 'Full', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'Display full post content', 'ithoughts-tooltip-glossary' ),
							),
						),
						'excerpt'	=> array(
							'text'	=> __( 'Excerpt', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'Display shorter excerpt content', 'ithoughts-tooltip-glossary' ),
							),
						),
						'off'	=> array(
							'text'	=> __( 'Off', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'Do not display tooltip at all', 'ithoughts-tooltip-glossary' ),
							),
						),
					),
				)
			);
			$options_inputs['termscomment'] = Input::create_check_input(
				'termscomment',
				array(
					'radio' => false,
					'selected' => $options['termscomment'] ? 'enabled' : NULL,
					'options' => array(
						'enabled' => array(
							'attributes' => array(
								'id' => 'termscomment',
							),
						),
					),
				)
			);
			$options_inputs['qtipstyle'] = Input::create_select_input(
				'qtipstyle',
				array(
					'selected' => $options['qtipstyle'],
					'options'  => $this->get_themes(),
				)
			);
			$options_inputs['qtiptrigger'] = Input::create_select_input(
				'qtiptrigger',
				array(
					'selected'	=> $options['qtiptrigger'],
					'options'	=> array(
						'click'	=> array(
							'text'	=> __( 'Click', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'On click', 'ithoughts-tooltip-glossary' ),
							),
						),
						'responsive'	=> array(
							'text'	=> __( 'Hybrid', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'Hover (on computer) and click (touch devices)', 'ithoughts-tooltip-glossary' ),
							),
						),
					),
				)
			);
			$options_inputs['qtipshadow'] = Input::create_check_input(
				'qtipshadow',
				array(
					'radio' => false,
					'selected' => $options['qtipshadow'] ? 'enabled' : NULL,
					'options' => array(
						'enabled' => array(
							'attributes' => array(
								'id' => 'qtipshadow',
							),
						),
					),
				)
			);
			$options_inputs['qtiprounded'] = Input::create_check_input(
				'qtiprounded',
				array(
					'radio' => false,
					'selected' => $options['qtiprounded'] ? 'enabled' : NULL,
					'options' => array(
						'enabled' => array(
							'attributes' => array(
								'id' => 'qtiprounded',
							),
						),
					),
				)
			);
			$options_inputs['anim_in'] = Input::create_select_input(
				'anim_in',
				array(
					'selected' => $options['anim_in'] ?: '',
					'options'  => apply_filters( 'ithoughts_tt_gl_tooltip_anim_in', array() ),
				)
			);
			$options_inputs['anim_out'] = Input::create_select_input(
				'anim_out',
				array(
					'selected' => $options['anim_out'] ?: '',
					'options'  => apply_filters( 'ithoughts_tt_gl_tooltip_anim_out', array() ),
				)
			);
			$options_inputs['anim_time'] = Input::create_text_input(
				'anim_time',
				array(
					'type' => 'text',
					'value' => $options['anim_time'],
					'attributes' => array(
						'placeholder' => '500',
						'style' => 'width:50px',
					),
				)
			);
			$options_inputs['qtipstylecustom'] = Input::create_text_input(
				'qtipstylecustom',
				array(
					'type' => 'text',
					'value' => isset($options['qtipstyle']) ? $options['qtipstyle'] : '',
				)
			);

			// Switch for the plugin man page.
			$url = null;
			switch ( substr( get_locale(), 0, 2 ) ) {
				case 'fr': {
					$url = 'https://www.gerkindevelopment.net/portfolio/ithoughts-tooltip-glossary/';
				} break;

				case 'fr': {
					$url = 'http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/';
				} break;
			}

			// Print the option page.
			require( $this->backbone->get_base_path() . '/templates/dist/options.php' );
		}

		/**
		 * Sets the options on submit of the options form in plugin admin pages
		 *
		 * @author Gerkin
		 */
		public function update_options() {
			check_admin_referer( 'ithoughts_tt_gl-update_options' );


			$post_values = $_POST; // Input var okay.
			$post_values['qtipshadow']  = TB::checkbox_to_bool( $post_values,'qtipshadow',  'enabled' );
			$post_values['qtiprounded'] = TB::checkbox_to_bool( $post_values,'qtiprounded', 'enabled' );
			$post_values['staticterms'] = TB::checkbox_to_bool( $post_values,'staticterms', 'enabled' );
			$post_values['exclude_search'] = TB::checkbox_to_bool( $post_values,'exclude_search', 'enabled' );
			$post_values['forceloadresources'] = TB::checkbox_to_bool( $post_values,'forceloadresources', 'enabled' );
			$post_values['verbosity'] = intval( $post_values['verbosity'] );
			$post_values['termscomment'] = TB::checkbox_to_bool( $post_values,'termscomment', 'enabled' );
			if ( isset( $post_values['qtipstylecustom'] ) && strlen( trim( $post_values['qtipstylecustom'] ) ) > 0 ) {
				$post_values['qtipstyle'] = $post_values['qtipstylecustom'];
			}
			unset( $post_values['qtipstylecustom'] );

			$glossary_options_old = $this->backbone->get_options();
			$glossary_options = \array_merge( $glossary_options_old, $post_values );
			$defaults = $this->backbone->get_options( true );
			foreach ( $glossary_options as $optkey => $optvalue ) {
				unset($optvalue);
				if ( ! isset( $defaults[ $optkey ] ) ) {
					unset( $glossary_options[ $optkey ] );
				}
			}

			$outtxt = '';
			$valid = true;
			$reload = false;

			if ( strlen( $glossary_options['termtype'] ) < 1 ) {
				$outtxt .= ('<p>' . __( 'Invalid input for', 'ithoughts-tooltip-glossary' ) . ' "' . __( 'Base Permalink', 'ithoughts-tooltip-glossary' ) . '"</p>') ;
				$valid = false;
			}
			if ( strlen( $glossary_options['grouptype'] ) < 1 ) {
				$outtxt .= ('<p>' . __( 'Invalid input for', 'ithoughts-tooltip-glossary' ) . ' "' . __( 'Taxonomy group prefix', 'ithoughts-tooltip-glossary' ) . '"</p>') ;
				$valid = false;
			}

			// Encode permalink components.
			$glossary_options['termtype'] = rawurlencode( $glossary_options['termtype'] );
			$glossary_options['grouptype'] = rawurlencode( $glossary_options['grouptype'] );

			if ( $valid ) {
				if (
					$glossary_options_old['termtype'] !== $glossary_options['termtype'] ||
					$glossary_options_old['grouptype'] !== $glossary_options['grouptype']
				) {
					$reload = true;
					$glossary_options['needflush'] = true;
					flush_rewrite_rules( false );
					$outtxt .= '<p>' . __( 'Rewrite rule flushed', 'ithoughts-tooltip-glossary' ) . '</p>';
				}
				$this->backbone->set_options( $glossary_options );
				$outtxt .= ('<p>' . __( 'Options updated', 'ithoughts-tooltip-glossary' ) . '</p>') ;
			}

			die( wp_json_encode(array(
				'reload'		=> $reload,
				'text'			=> $outtxt,
				'valid'			=> $valid,
				'nonce_refresh'	=> wp_create_nonce( 'ithoughts_tt_gl-update_options' ),
			)));
		}

		/**
		 * Generates the TinyMCE form to create a tooltip. It will return the compiled HTML in a JSON table.
		 *
		 * @author Gerkin
		 */
		public function get_tinymce_tooltip_form_ajax() {
			check_admin_referer( 'ithoughts_tt_gl-ajax_forms' );

			$data = array();

			$mediatiptypes = array(
				'localimage' => array(
					'text' => __( 'Image from the media library', 'ithoughts-tooltip-glossary' ),
					'attributes' => array(
						'title' => __( 'Image from site library', 'ithoughts-tooltip-glossary' ),
					),
				),
				'webimage' => array(
					'text' => __( 'Image on the web', 'ithoughts-tooltip-glossary' ),
					'attributes' => array(
						'title' => __( 'Image referenced by url, not on the site', 'ithoughts-tooltip-glossary' ),
					),
				),
				'webvideo' => array(
					'text' => __( 'Video on the web', 'ithoughts-tooltip-glossary' ),
					'attributes' => array(
						'title' => __( 'Video hosted online. Only Youtube, Dailymotion or .mp4 videos', 'ithoughts-tooltip-glossary' ),
					),
				),
			);
			$mediatiptypes_keys = array_keys( $mediatiptypes );

			$default_data = array(
				'type' => 'tooltip',
				'text' => null,
				'link' => null,
				'glossary' => array(
					'id' => null,
					'term_search' => null,
					'disable_auto_translation' => false,
				),
				'mediatip' => array(
					'type' => $mediatiptypes_keys[0],
					'content' => null,
					'content_json' => null,
					'caption' => null,
				),
			);
			// Get data from posted values.
			if ( isset( $_POST['data'] ) ) { // Input var okay.
				$data = $_POST; // Input var okay.
				$data = wp_unslash( $data['data'] );
				$mediatip_json_text = sanitize_text_field( $data['mediatip_content_json'] );
				$data = array(
					'type' => sanitize_text_field( $data['type'] ),
					'text' => sanitize_text_field( $data['text'] ),
					'link' => esc_url_raw( $data['link'] ),
					'glossary' => array(
						'id' => absint( $data['glossary_id'] ),
						'term_search' => sanitize_text_field( $data['term_search'] ),
						'disable_auto_translation' => 'true' === sanitize_text_field( $data['glossary_disable_auto_translation'] ),
					),
					'mediatip' => array(
						'type' => sanitize_text_field( $data['mediatip_type'] ),
						'content' => TB::decode_json_attr( $mediatip_json_text ),
						'content_json' => str_replace( '"', '&quot;', $mediatip_json_text ),
						'caption' => inner_attr( sanitize_text_field( $data['mediatip_caption'] ), false ),
					),
				);
			}
			$data = array_replace_recursive( $default_data, $data );

			// Set defaults.
			$types = array( 'glossary', 'tooltip', 'mediatip' );
			try {
				switch ( $data['type'] ) {
					case 'glossary':{
					} break;

					case 'tooltip':{
						$data['tooltip_content'] = inner_attr( isset( $data['tooltip_content'] ) ? $data['tooltip_content'] : '', false );
					} break;

					case 'mediatip':{
					} break;
				}
			} catch ( Exception $e ) {
				$data = $default_data;
			}

			// Retrieve terms.
			$terms = array();
			if ( null === $data['glossary']['id'] ) {
				$terms = $this->backbone->search_terms(array(
					'post_type'			=> 'glossary',
					'post_status'		=> 'publish',
					'orderby'			=> 'title',
					'order'				=> 'ASC',
					'posts_per_page'	=> 25,
					's'					=> $data['term_search'],
					'suppress_filters'	=> false,
				));
			} else {
				$post = get_post( $data['glossary']['id'] );
				$terms[] = array(
					'slug'      => $post->post_name,
					'content'   => wp_trim_words( wp_strip_all_tags( (isset( $post->post_excerpt )&&$post->post_excerpt)?$post->post_excerpt:$post->post_content ), 50, '...' ),
					'title'     => $post->post_title,
					'id'        => $post->ID,
				);
				$data['term_title'] = $post->post_title;
			}

			wp_reset_postdata();

			// form_data is printed directly in template.
			$options = $this->backbone->get_options();

			$opts = $data['opts'] ?: array();
			if ( ! isset( $opts['attributes'] ) ) {
				$opts['attributes'] = array();
			}
			if ( ! isset( $opts['attributes']['span'] ) ) {
				$opts['attributes']['span'] = array();
			}
			if ( ! isset( $opts['attributes']['link'] ) ) {
				$opts['attributes']['link'] = array();
			}
			$span_arr = array(
				'' => '',
			);
			foreach ( $opts['attributes']['span'] as $key => $value ) {
				$span_arr[ preg_replace( '/^data-/', '', $key ) ] = $value;
			}
			$opts['attributes']['span'] = $span_arr;

			// Create the first input slot.
			$link_arr = array(
				'' => '',
			);
			foreach ( $opts['attributes']['link'] as $key => $value ) {
				$link_arr[ preg_replace( '/^data-link-/', '', $key ) ] = $value;
			}
			$opts['attributes']['link'] = $link_arr;

			$inputs = array();

			// Comon options.
			$inputs['ithoughts_tt_gl_text'] = Input::create_text_input(
				'ithoughts_tt_gl_text',
				array(
					'value' => $data['text'],
				)
			);
			$inputs['ithoughts_tt_gl_link'] = Input::create_text_input(
				'ithoughts_tt_gl_link',
				array(
					'value' => in_array( $data['type'], array( 'tooltip', 'mediatip' ), true ) ? $data['link'] : null,
				)
			);

			// Glossary term inputs.
			$inputs['glossary_term'] = Input::create_text_input(
				'glossary_term',
				array(
					'value' => isset( $data['term_title'] ) ? $data['term_title'] : $data['term_search'],
					'attributes' => array(
						'class' => 'completed',
					)
				)
			);
			$inputs['glossary_term_id'] = Input::create_text_input(
				'glossary_term_id',
				array(
					'type' => 'hidden',
					'value' => $data['glossary_id']
				)
			);
			if ( function_exists( 'icl_object_id' ) ) {
				$inputs['glossary_disable_auto_translation'] = Input::create_check_input(
					'glossary_disable_auto_translation',
					array(
						'radio' => false,
						'selected' => isset( $data['glossary_disable_auto_translation'] ) && $data['glossary_disable_auto_translation'] ? ' true' : null,
						'options' => array(
							'true' => array(
								'attributes' => array(
									'id' => 'glossary_disable_auto_translation'
								)
							)
						)
					)
				);
			}
			$inputs['mediatip_type'] = Input::create_select_input(
				'mediatip_type',
				array(
					'selected' => $data['mediatip_type'],
					'options'  => $mediatiptypes,
					'attributes' => array(
						'class'    => 'modeswitcher',
					),
				)
			);

			// Tooltip.
			$inputs['ithoughts_tt_gl-tooltip-content'] = Input::create_text_input(
				'ithoughts_tt_gl-tooltip-content',
				array(
					'type' => 'textarea',
					'value' => $data['tooltip_content'],
					'attributes' => array(
						'style' => 'width:100%;border:1px solid #ccc;',
						'class' => 'tinymce',
					)
				)
			);

			// Mediatip.
			$inputs['mediatip_url_image'] = Input::create_text_input(
				'mediatip_url_image',
				array(
					'type' => 'url',
					'value' => 'webimage' === $data['mediatip_type'] ? $data['mediatip_content_json'] : null,
					'autocomplete' => true,
				)
			);
			$inputs['mediatip_caption'] = Input::create_text_input(
				'mediatip_caption',
				array(
					'type' => 'textarea',
					'value' => in_array( $data['mediatip_type'], array( 'webimage', 'localimage' ), true ) ? $data['mediatip_caption'] : null,
					'attributes' => array(
						'style' => 'width:100%;border:1px solid #ccc;',
						'class' => 'tinymce',
					)
				)
			);
			$inputs['mediatip_url_video_link'] = Input::create_text_input(
				'mediatip_url_video_link',
				array(
					'value' => 'webvideo' === $data['mediatip_type'] ? $data['mediatip_link'] : null,
				)
			);
			$inputs['mediatip_url_video_embed'] = Input::create_text_input(
				'mediatip_url_video_embed',
				array(
					'type' => 'hidden',
					'value' => 'webvideo' === $data['mediatip_type'] ? $data['mediatip_content'] : null,
				)
			);

			// Advanced options.
			$inputs['qtip-content'] = Input::create_select_input(
				'qtip-content',
				array(
					'selected' => isset( $opts['glossary-contenttype'] ) ? $opts['glossary-contenttype'] : '',
					'options'  => array(
						'' => __( 'Default', 'ithoughts-tooltip-glossary' ),
						'full'	=> array(
							'text'	=> __( 'Full', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'Display full post content', 'ithoughts-tooltip-glossary' ),
							),
						),
						'excerpt'	=> array(
							'text'	=> __( 'Excerpt', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'Display shorter excerpt content', 'ithoughts-tooltip-glossary' ),
							),
						),
						'off'	=> array(
							'text'	=> __( 'Off', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'Do not display tooltip at all', 'ithoughts-tooltip-glossary' ),
							),
						),
					),
				)
			);
			$inputs['qtipstyle'] = Input::create_select_input(
				'qtipstyle',
				array(
					'selected' => isset( $opts['qtipstyle'] ) ? $opts['qtipstyle'] : '',
					'options'  => array(
						'' => __( 'Default', 'ithoughts-tooltip-glossary' ),
					) + $this->get_themes(),
				)
			);
			$inputs['qtiptrigger'] = Input::create_select_input(
				'qtiptrigger',
				array(
					'selected'	=> isset( $opts['qtiptrigger'] ) ? $opts['qtiptrigger'] : '',
					'options'	=> array(
						'' => __( 'Default', 'ithoughts-tooltip-glossary' ),
						'click'	=> array(
							'text'	=> __( 'Click', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'On click', 'ithoughts-tooltip-glossary' ),
							),
						),
						'responsive'	=> array(
							'text'	=> __( 'Responsive', 'ithoughts-tooltip-glossary' ),
							'attributes'	=> array(
								'title'	=> __( 'Hover (on computer) and click (touch devices)', 'ithoughts-tooltip-glossary' ),
							),
						),
					),
				)
			);
			$inputs['qtiptriggerText'] = Input::create_text_input(
				'qtiptrigger',
				array(
					'type' => 'hidden',
					'value'	=> isset( $opts['qtiptrigger'] ) ? $opts['qtiptrigger'] : '',
					'attributes' => array(
						'id' => 'qtiptriggerText',
						'disabled' => true,
					),
				)
			);
			$inputs['qtip-keep-open'] = Input::create_check_input(
				'qtip-keep-open',
				array(
					'radio' => false,
					'selected' => isset( $opts['qtip-keep-open'] ) && 'true' === $opts['qtip-keep-open'] ? 'keep' : false,
					'options' => array(
						'keep' => array(
							'attributes' => array(
								'id' => 'qtip-keep-open',
							),
						),
					),
				)
			);
			$inputs['qtipshadow'] = Input::create_check_input(
				'qtipshadow',
				array(
					'radio' => false,
					'selected' => null,
					'options' => array(
						'enabled' => array(
							'attributes' => array(
								'id' => 'qtipshadow',
								'class' => 'ithoughts-tristate',
								'data-state' => ( ! isset( $opts['qtipshadow'] ) || '' === $opts['qtiprounded'] ? 0 : ('true' === $opts['qtipshadow'] ? 1 : -1)),
							),
						),
					),
				)
			);
			$inputs['qtiprounded'] = Input::create_check_input(
				'qtiprounded',
				array(
					'radio' => false,
					'options' => array(
						'enabled' => array(
							'attributes' => array(
								'id' => 'qtiprounded',
								'class' => 'ithoughts-tristate',
								'data-state' => ( ! isset( $opts['qtiprounded'] ) || '' === $opts['qtiprounded'] ? 0 : ('true' === $opts['qtiprounded'] ? 1 : -1)),
							),
						),
					),
				)
			);
			$inputs['position'] = array();
			$inputs['position']['my'] = array();
			$inputs['position']['my'][1] = Input::create_select_input(
				'position[my][1]',
				array(
					'selected' => isset( $opts['position'] ) && isset( $opts['position']['my'] ) && isset( $opts['position']['my'][1] ) ? $opts['position']['my'][1] : '',
					'options'	=> array(
						'' => __( 'Default', 'ithoughts-tooltip-glossary' ),
						'top'       => __( 'Top', 'ithoughts-tooltip-glossary' ),
						'center'	=> __( 'Center', 'ithoughts-tooltip-glossary' ),
						'bottom'	=> __( 'Bottom', 'ithoughts-tooltip-glossary' ),
					),
				)
			);
			$inputs['position']['my'][2] = Input::create_select_input(
				'position[my][2]',
				array(
					'selected' => isset( $opts['position'] ) && isset( $opts['position']['my'] ) && isset( $opts['position']['my'][2] ) ? $opts['position']['my'][2] : '',
					'options'	=> array(
						'' => __( 'Default', 'ithoughts-tooltip-glossary' ),
						'left'      => __( 'Left', 'ithoughts-tooltip-glossary' ),
						'center'    => __( 'Center', 'ithoughts-tooltip-glossary' ),
						'right'     => __( 'Right', 'ithoughts-tooltip-glossary' ),
					),
				)
			);
			$inputs['position']['my']['invert'] = Input::create_check_input(
				'position[my][invert]',
				array(
					'radio' => false,
					'selected' => isset( $opts['position'] ) && isset( $opts['position']['my'] ) && isset( $opts['position']['my']['invert'] ) ? $opts['position']['my']['invert'] : false,
					'options' => array(
						'enabled' => array(
							'attributes' => array(
								'id' => 'position[my][invert]',
							),
						),
					),
				)
			);
			$inputs['position']['at'] = array();
			$inputs['position']['at'][1] = Input::create_select_input(
				'position[at][1]',
				array(
					'selected' => isset( $opts['position'] ) && isset( $opts['position']['at'] ) && isset( $opts['position']['at'][1] ) ? $opts['position']['at'][1] : '',
					'options'	=> array(
						'' => __( 'Default', 'ithoughts-tooltip-glossary' ),
						'top'       => __( 'Top', 'ithoughts-tooltip-glossary' ),
						'center'	=> __( 'Center', 'ithoughts-tooltip-glossary' ),
						'bottom'	=> __( 'Bottom', 'ithoughts-tooltip-glossary' ),
					),
				)
			);
			$inputs['position']['at'][2] = Input::create_select_input(
				'position[at][2]',
				array(
					'selected' => isset( $opts['position'] ) && isset( $opts['position']['at'] ) && isset( $opts['position']['at'][2] ) ? $opts['position']['at'][2] : '',
					'options'	=> array(
						'' => __( 'Default', 'ithoughts-tooltip-glossary' ),
						'left'      => __( 'Left', 'ithoughts-tooltip-glossary' ),
						'center'    => __( 'Center', 'ithoughts-tooltip-glossary' ),
						'right'     => __( 'Right', 'ithoughts-tooltip-glossary' ),
					),
				)
			);
			$inputs['anim'] = array();
			$inputs['anim']['in'] = Input::create_select_input(
				'anim[in]',
				array(
					'selected' => isset( $opts['anim']['in'] ) ? $opts['anim']['in'] : '',
					'options'  => apply_filters( 'ithoughts_tt_gl_tooltip_anim_in', array(
						'' => __( 'Default', 'ithoughts-tooltip-glossary' ),
					) ),
				)
			);
			$inputs['anim']['out'] = Input::create_select_input(
				'anim[out]',
				array(
					'selected' => isset( $opts['anim']['out'] ) ? $opts['anim']['out'] : '',
					'options'  => apply_filters( 'ithoughts_tt_gl_tooltip_anim_out', array(
						'' => __( 'Default', 'ithoughts-tooltip-glossary' ),
					) ),
				)
			);
			$inputs['anim']['time'] = Input::create_text_input(
				'anim[time]',
				array(
					'type' => 'text',
					'value' => isset( $opts['anim']['time'] ) ? $opts['anim']['time'] : '',
					'attributes' => array(
						'placeholder' => '500',
						'style' => 'width:50px',
					),
				)
			);
			$inputs['maxwidth'] = Input::create_text_input(
				'maxwidth',
				array(
					'type' => 'text',
					'value'	=> isset( $opts['maxwidth'] ) ? $opts['maxwidth'] : '',
				)
			);

			$attrs;
			{
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
				);
			}

			require $this->backbone->get_base_path() . '/templates/dist/tinymce-tooltip-form.php';
			wp_die();
		}

		/**
		* Generates the TinyMCE form to create a list. It will return the compiled HTML in a JSON table.
		*
		* @author Gerkin
		*/
		public function get_tinymce_list_form_ajax() {
			check_admin_referer( 'ithoughts_tt_gl-ajax_forms' );

			$data = array();

			$types = array( 'atoz', 'list' );
			// Set defaults.
			$default_data = array(
				'type' => 'atoz',
				'alpha' => null,
				'group' => null,
			);
			// Get data from posted values.
			if ( isset( $_POST['data'] ) ) { // Input var okay.
				$data = $_POST; // Input var okay.
				$data = wp_unslash( $data['data'] );
				$data = array(
					'type' => sanitize_text_field( $data['type'] ),
					'alpha' => sanitize_text_field( $data['alpha'] ),
					'group' => sanitize_text_field( $data['group'] ),
				);
				if ( ! array_search( $data['type'], $types, true ) ) {
					unset( $data['type'] );
				}
			}
			$data = array_replace_recursive( $default_data, $data );

			// Retrieve terms.
			$form_data = array(
				'admin_ajax'    => admin_url( 'admin-ajax.php' ),
				'base_tinymce'  => $this->backbone->get_base_url() . '/ext/tinymce',
				'groups'		=> array(),
			);
			$groups = get_terms(array(
				'taxonomy'		=> 'glossary_group',
				'hide_empty'	=> false,
			));
			$no_groups = (new \WP_Query(array(
				'post_type'			=> 'glossary',
				'post_status'		=> 'publish',
				'tax_query' => array( // WPCS: tax_query ok.
					array(
						'taxonomy' => 'glossary_group',
						'field' => 'term_id',
						'operator' => 'NOT IN',
						'terms' => extract_terms_ids( $groups ),
					),
				),
			)))->post_count;

			$inputs = array(
				'letters' => Input::create_text_input(
					'letters',
					array(
						'type'	=> 'text',
						'value'	=> isset( $data['alpha'] ) ? implode( ', ', $data['alpha'] ) : '',
					)
				),
				'groups_text' => Input::create_text_input(
					'groups_text',
					array(
						'type'			=> 'text',
						'value'			=> null,
						'attributes'	=> array(
							'placeholder'	=> __( 'Click and pick some groups', 'ithoughts-tooltip-glossary' ),
							'readonly'	=> true,
						),
					)
				),
				'groups' => Input::create_text_input(
					'groups',
					array(
						'type'			=> 'hidden',
						'value'			=> isset( $data['group'] ) ? implode( ', ', $data['group'] ) : '',
						'attributes'	=> array(
							'readonly'	=> true,
						),
					)
				),
				'description_mode'	=> Input::create_select_input(
					'description_mode',
					array(
						'selected'	=> isset( $data['desc'] ) ? $data['desc'] : null,
						'options'	=> array(
							'none'		=> __( 'None', 'ithoughts-tooltip-glossary' ),
							'tip'		=> __( 'Tooltip', 'ithoughts-tooltip-glossary' ),
							'excerpt'	=> __( 'Excerpt', 'ithoughts-tooltip-glossary' ),
							'full'		=> __( 'Full', 'ithoughts-tooltip-glossary' ),
						),
					)
				),
				'columns_count' => Input::create_text_input(
					'columns_count',
					array(
						'type'			=> 'number',
						'value'			=> isset( $data['cols'] ) ? $data['cols'] : 1,
						'attributes'	=> array(
							'min'	=> 1,
							'max'	=> 5,
						),
					)
				),
			);

			wp_reset_postdata();

			include $this->backbone->get_base_path() . '/templates/dist/tinymce-list-form.php';
			wp_die();
		}

		/**
		 * Initialize the customizing form for custom themes. If the POST request specifies a theme name, it will be parsed then loaded.
		 *
		 * @uses `templates/src/customizing-form.php`
		 * @author Gerkin
		 */
		public function theme_editor() {
			if ( ! current_user_can( 'edit_theme_options' ) ) {
				status_header( 403 );
				wp_die( 'Forbidden' );
			}

			$action = 'load';
			$themename = null;
			if ( isset( $_GET['theme_select'] ) && isset( $_GET['action'] ) ) { // Input var okay.
				if('recompile' === $_GET['action']){ // Input var okay.
					check_admin_referer( 'ithoughts_tt_gl-theme_editor' );
				} else {
					check_admin_referer( 'ithoughts_tt_gl-loadtheme' );
				}
				$get_unslashed = wp_unslash( $_GET ); // Input var okay.
				$themename = $get_unslashed['theme_select'];
				$action = $get_unslashed['action'];
			}
			$themedata;
			switch ( $action ) {
				case 'load': {
					$themedata = $this->loadtheme( $themename );
				} break;

				case 'delete': {
					$ret = $this->remove_theme( $themename );
					$themedata = $this->loadtheme( null );
				} break;

				case 'recompile':{
					$ret = $this->recompile_custom_themes();
					$themedata = $this->loadtheme( null );
				} break;
			}

			if ( isset( $themedata['error'] ) || isset( $ret['error'] ) ) {
?><div class="notice notice-error"><p><?php
				esc_html_e( 'Error while generating the theme editor: ', 'ithoughts-tooltip-glossary' );
				echo esc_html( $themedata['error'] );
				echo esc_html( $ret['error'] ); ?></p></div><?php
			}

			/* Add required scripts for WordPress Spoilers (AKA PostBox) */
			wp_enqueue_script( 'postbox' );
			wp_enqueue_script( 'post' );

			/* Add required resources for wpColorPicker */
			$this->backbone->enqueue_resources( array(
				'ithoughts_tooltip_glossary-styleeditor',
				'ithoughts_tooltip_glossary-admin',
				'ithoughts_tooltip_glossary-qtip-css',
			) );
			wp_enqueue_style( 'ithoughts_tooltip_glossary-customthemes' );

			wp_enqueue_style( 'wp-color-picker' );

			$theme_infos = $this->get_custom_theme_infos();
			$theme_editor_enabled = is_writable( $theme_infos['absdir'] . '/' . ($themedata['file'] ? $themedata['file'] : '') );

			$inputs = array(
				'theme_select' => Input::create_select_input(
					'theme_select',
					array(
						'allow_blank' => __( 'Select one', 'ithoughts-tooltip-glossary' ),
						'selected' => $themename,
						'options'  => $this->get_themes( true ),
					)
				),
				'themename' => Input::create_text_input(
					'theme_name',
					array(
						'value' => $themename,
						'required' => true,
						'attributes' => array(
							'minlength' => 3,
							'pattern' => '^[a-zA-Z0-9][a-zA-Z0-9\-_]+[a-zA-Z0-9]',
							'data-pattern-infos' => __( 'At least 3 letters (lowercase and uppercase), numbers, _ or -, and not starting or ending with symbol', 'ithoughts-tooltip-glossary' ),
						),
					)
				),
				'splittedHead' => Input::create_text_input(
					'splittedHead',
					array(
						'value' => $themedata['splittedHead'] ? 'yes' : '',
						'type' => 'hidden',
					)
				),
				'file' => Input::create_text_input(
					'file',
					array(
						'value' => $themedata['file'],
						'type' => 'hidden',
					)
				),
				'content' => Input::create_text_input(
					'content',
					array(
						'textarea' => true,
						'value' => $themedata['content'],
						'attributes' => array(
							'disabled' => true === $theme_editor_enabled ? null : 'disabled',
							'class' => 'ace-editor',
							'data-lang' => 'css',
						),
					)
				),
			);
			require $this->backbone->get_base_path() . '/templates/dist/customizing-form.php';
		}

		/**
		 * Load the theme named `themename` in the style editor
		 *
		 * @param  string [ $themename = null] Name of the theme to load.
		 * @return string[] Informations about the theme
		 */
		private function loadtheme( $themename = null ) {
			$default_content = '&.qtip{ /* Global tip style (eg: borders, shadow, etc) */
}
.qtip-titlebar{ /* Title specific rules */
}
.qtip-content{ /* Content specific rules */
}';
			if ( null === $themename ) { // Output default new theme content.
				return array(
					'splittedHead' => true,
					'file' => null,
					'content' => $default_content,
				);
			}

			$reformated_theme_name = preg_replace( '/[^a-z]/', '_', strtolower( $themename ) );
			$theme_infos = $this->get_custom_theme_infos();
			$ret = true;
			if ( ! file_exists( $theme_infos['absdir'] ) ) {
				$ret &= mkdir( $theme_infos['absdir'], 0755, true );
			}
			$file = $reformated_theme_name . '.less';
			if ( ! file_exists( $theme_infos['absdir'] . '/' . $file ) ) {
				$file = $reformated_theme_name . '.css';
			}
			if ( ! file_exists( $theme_infos['absdir'] . '/' . $file ) ) {
				return array(
					'splittedHead' => true,
					'file' => null,
					'content' => $default_content,
					'error' => __( 'No matching file found. Try to load another theme', 'ithoughts-tooltip-glossary' ),
				);
			}

			$content = file_get_contents( $theme_infos['absdir'] . '/' . $file );

			$match_head_regex = "/^\\.qtip-$reformated_theme_name\\s*{[\\n\\s]*/";
			$stripped_head = false;
			if ( preg_match( $match_head_regex, $content ) === 1 ) { // If normal header...
				if (
					(substr_count( $content, '}' ) === substr_count( $content, '{' )) &&
					(substr_count( $content, '}' ) >= 2) &&
					(strrpos( $content, '{' ) < strrpos( $content, '}', (strrpos( $content, '}' ) - strlen( $content )) -1 ))
				) { // And have the right format...
					// Strip the header.
					$content = preg_replace( $match_head_regex, '', $content );
					$content = preg_replace( '/}\s*$/', '', $content );
					$stripped_head = true;
				}
			}
			return array(
				'splittedHead' => $stripped_head,
				'file' => $file,
				'content' => $this->less_auto_indent( $content ),
			);
		}

		/**
		 * Sends the generated CSS from `customizing-form.php` to be previewed
		 *
		 * @author Gerkin
		 */
		public function previewtheme() {
			if ( ! isset( $_POST ) ) { // Input var okay.
				wp_send_json_error( 'No post data.' );
			}
			check_admin_referer( 'ithoughts_tt_gl-theme_editor' );
			$data = wp_unslash( $_POST ); // Input var okay.
			unset( $data['action'] );

			$ret = $this->theme_to_less( $data );

			try {
				require_once( \ithoughts\tooltip_glossary\Backbone::get_instance()->get_base_path() . '/submodules/lessphp/lessc.inc.php' );
				$less = new \lessc;
				$ret['css'] = $less->compile( $ret['less'] );
				$ret['valid'] = true;
				$ret['text'] = '<p>' . esc_html__( 'CSS generated.','ithoughts-tooltip-glossary' ) . '</p>';
			} catch ( \Exception $e ) {
				$tmp = array(
					'valid' => false,
					'text' => '<p>' . esc_html__( 'Error while generate CSS','ithoughts-tooltip-glossary' ) . ": \"<code>{$e->getMessage()}</code>\"</p>",
				);
				error_log( $e->getMessage() );
				$ret = array_merge( $tmp, $ret );
				$ret['error'] = $e->getMessage();
			}
			$ret['nonce_refresh'] = wp_create_nonce('ithoughts_tt_gl-theme_editor');

			wp_die( wp_json_encode( $ret ) );
		}

		/**
		 * Save the POSTed theme. It should not be used from other where than in an Ajax call in `customizing-form.php`
		 *
		 * @author Gerkin
		 */
		public function savetheme() {
			if ( ! isset( $_POST ) ) { // Input var okay.
				wp_send_json_error( 'No post data.' );
			}
			check_admin_referer( 'ithoughts_tt_gl-theme_editor' );
			$data = wp_unslash( $_POST ); // Input var okay.
			unset( $data['action'] );

			$ret = $this->theme_to_less( $data );

			$out = $this->update_theme( $ret['theme_name'], $data['file'], $ret['less'] );
			wp_die( wp_json_encode( array(
				'valid' => $out['valid'],
				'text' => '<p>' . (($out['valid']) ? esc_html__( 'Theme saved.','ithoughts-tooltip-glossary' ) : __( 'Failed to save the theme.','ithoughts-tooltip-glossary' )) . '</p>',
				'nonce_refresh' => wp_create_nonce('ithoughts_tt_gl-theme_editor'),
			) ) );
		}

		/**
		 * Generate the LESS string depending on the custom_theme's form values given
		 *
		 * @author Gerkin
		 * @param  string[] $theme Custom Theme's values.
		 * @return string   Ready to compile LESS string
		 */
		private function theme_to_less( $theme ) {
			$theme_name = $theme['theme_name'];
			$theme_name = preg_replace( '/[^a-z]/', '_', strtolower( $theme_name ) );

			$content;
			if ( isset( $theme['content'] ) && $theme['content'] ) {
				if ( isset( $theme['splittedHead'] ) && 'yes' === $theme['splittedHead'] ) {
					$content .= ".qtip-$theme_name{" . PHP_EOL;
					$content .= $theme['content'] . PHP_EOL . '}';
				} else {
					$content = $theme['content'];
				}
			} else {
				$content = '';
			}

			$ret = array(
				'less' => $this->less_auto_indent( $content ),
				'theme_name' => $theme_name,
			);
			return $ret;
		}

		/**
		 * Auto indent less content.
		 *
		 * @param  string $content String containing the less source code.
		 * @return string Less source code reformated
		 */
		private function less_auto_indent( $content ) {
			$lines = explode( PHP_EOL, preg_replace( "/^[ \t]+/m", '', preg_replace( "/[\t ]+/m", ' ', $content ) ) );

			$indented = '';
			$indent = "\t";
			$indent_level = 0;
			foreach ( $lines as $line ) {
				$indent_level -= preg_match( '/}\s*$/',$line );
				if ( strlen( $line ) > 0 ) {
					$indented .= str_repeat( $indent, $indent_level ) . $line . PHP_EOL;
				} else { $indented .= PHP_EOL;
					   }
				$indent_level += preg_match( '/\{(\s*(\\/\\*.*\\*\\/)*)*$/',$line );
			}
			return preg_replace( "/[\n\r\s]*$/",'',$indented );
		}

		/**
		 * Update a custom theme
		 *
		 * @author Gerkin
		 * @param string $theme_name    The name of the theme to update.
		 * @param string $filename      Name of the file to write.
		 * @param string $theme_content The theme's CSS stylesheet.
		 */
		private function update_theme( $theme_name, $filename, $theme_content ) {
			$reformated_theme_name = preg_replace( '/[^a-z]/', '_', strtolower( $theme_name ) );
			$theme_infos = $this->get_custom_theme_infos();
			$ret = true;
			if ( ! file_exists( $theme_infos['absdir'] ) ) {
				$ret &= mkdir( $theme_infos['absdir'], 0755, true );
			}

			if ( $filename !== $reformated_theme_name . '.less' ) {
				unlink( $theme_infos['absdir'] . '/' . $filename );
			}
			$ret &= (false !== file_put_contents( $theme_infos['absdir'] . '/' . $reformated_theme_name . '.less', $theme_content ));

			return $this->recompile_custom_themes();
		}

		/**
		 * Remove a custom theme
		 *
		 * @author Gerkin
		 * @param string $theme_name The name of the theme to delete.
		 */
		private function remove_theme( $theme_name ) {
			$reformated_theme_name = preg_replace( '/[^a-z]/', '_', strtolower( $theme_name ) );
			$theme_infos = $this->get_custom_theme_infos();
			$ret = true;
			if ( ! file_exists( $theme_infos['absdir'] ) ) {
				$ret &= mkdir( $theme_infos['absdir'], 0755, true );
			}

			$ret &= unlink( $theme_infos['absdir'] . '/' . $reformated_theme_name . '.less' );

			return $this->recompile_custom_themes();
		}

		/**
		 * Recompile the whole custom themes stylesheet. The URL to the output file is stored in the option "custom_styles_path", with the timestamp of generation.
		 *
		 * @author Gerkin
		 */
		private function recompile_custom_themes() {
			$theme_infos = $this->get_custom_theme_infos();
			$errs = array();
			try {
				$themes = scandir( $theme_infos['absdir'] );
			} catch ( Exception $e ) {
				$themes = false;
			}
			if ( false === $themes ) {
				$themes = array();
				return array(
					'valid' => false,
					'errors' => array(
						__( 'Could not read stylesheet components. Please check that your Web user is allowed to read in <code>wp-content/uploads/ithoughts_tooltip_glossary</code>', 'ithoughts-tooltip-glossary' )
					),
				);
			}
			$concat_themes = '';

			if ( ! file_exists( $theme_infos['absdir'] ) ) {
				$ret &= mkdir( $theme_infos['absdir'], 0755, true );
			}

			require_once( \ithoughts\tooltip_glossary\Backbone::get_instance()->get_base_path() . '/submodules/lessphp/lessc.inc.php' );
			$less = new \lessc;
			foreach ( $themes as $theme ) {
				$path_to_themes = $theme_infos['absdir'] . '/' . $theme;
				try {
					if ( is_file( $path_to_themes ) ) {
						$content = '';
						if ( preg_match( '/.+\.css$/', $theme ) ) { // CSS File.
							$content .= file_get_contents( $path_to_themes );
						}
						if ( preg_match( '/.+\.less/', $theme ) ) { // LESS File.
							$content .= $less->compile( file_get_contents( $path_to_themes ) );
						}

						if ( '' !== $content ) {
							$content_head = '/';
							$content_head .= str_repeat( '*', 78 );
							$content_head .= "\\\n";

							$content_head .= '|';
							$content_head .= str_repeat( '*', floor( ((78 - strlen( $theme )) / 2) - 1 ) );
							$content_head .= " $theme ";
							$content_head .= str_repeat( '*', ceil( ((78 - strlen( $theme )) / 2) - 1 ) );
							$content_head .= "|\n";

							$content_head .= '\\';
							$content_head .= str_repeat( '*', 78 );
							$content_head .= "/\n";

							$concat_themes .= $content_head . $content;
							$concat_themes .= "\n\n\n\n\n\n";
						}
					}
				} catch ( \Exception $e ) {
					$errs[ $theme ] = $e->getMessage();
				}
			}// End foreach().

			$less->setFormatter( 'compressed' );
			$concat_themes = $less->compile( $concat_themes );
			$ret = file_put_contents( $theme_infos['absfile'], $concat_themes ) !== false;

			$date = new \DateTime();
			\ithoughts\tooltip_glossary\Backbone::get_instance()->set_option( 'custom_styles_path', $theme_infos['urlfile'] . '?t=' . $date->getTimestamp() );

			return array(
				'valid' => $ret,
				'errors' => $errs,
			);
		}

		/**
		 * Return comon infos about custom themes, like the absolute directory for subthemes, the absolute path for the custom theme's CSS file, and the URL to the themes file.
		 *
		 * @return string[] An associative array with infos. ["absdir"] returns the absolute path to the themes dir. ["absfile"] returns the absolute path to the concatenated themes file. ["urlfile"] returns the URL to the concatenated themes file.
		 * @author Gerkin
		 */
		public function get_custom_theme_infos() {
			$wp_upload = wp_upload_dir();
			$dir = '/ithoughts_tooltip_glossary';
			$file = 'custom_themes.css';
			$components = 'components';
			return array(
				'absdir'	=> $wp_upload['basedir'] . $dir . '/' . $components,
				'absfile'	=> $wp_upload['basedir'] . $dir . '/' . $file,
				'urlfile'	=> $wp_upload['baseurl'] . $dir . '/' . $file,
			);
		}

		/**
		 * Get the list of available themes. Since v2.4, it also display a list of custom themes
		 *
		 * @author Gerkin
		 * @param  boolean [ $disable_non_editable = false] Returns default text with attributes configured to be displayed as disabled in the dropdown.
		 * @return Array[] Themes formated for being injected in {@link Toolbox::generate_input_select}
		 */
		private function get_themes( $disable_non_editable = false ) {
			$theme_infos = $this->get_custom_theme_infos();
			$opts = array(
				'cream'     => __( 'Cream', 'ithoughts-tooltip-glossary' ),
				'dark'      => __( 'Dark', 'ithoughts-tooltip-glossary' ),
				'green'     => __( 'Green', 'ithoughts-tooltip-glossary' ),
				'light'     => __( 'Light', 'ithoughts-tooltip-glossary' ),
				'red'       => __( 'Red', 'ithoughts-tooltip-glossary' ),
				'blue'      => __( 'Blue', 'ithoughts-tooltip-glossary' ),
				'plain'     => __( 'Plain', 'ithoughts-tooltip-glossary' ),
				'bootstrap' => __( 'Bootstrap', 'ithoughts-tooltip-glossary' ),
				'youtube'   => __( 'YouTube', 'ithoughts-tooltip-glossary' ),
				'tipsy'     => __( 'Tipsy', 'ithoughts-tooltip-glossary' ),
			);
			if ( $disable_non_editable ) {
				foreach ( $opts as $opt => $label ) {
					$opts[ $opt ] = array(
						'text' => $label,
						'attributes' => array(
							'disabled' => 'disabled',
						),
					);
				}
			}
			if ( ! file_exists( $theme_infos['absdir'] ) ) {
				$ret &= mkdir( $theme_infos['absdir'], 0755, true );
			}

			try {
				$themes = scandir( $theme_infos['absdir'] );
			} catch ( Exception $e ) {
				$themes = false;
			}
			if ( false === $themes ) {
				$themes = array();
?><div class="notice notice-error"><p><?php esc_html_e( 'Could not read the custom themes directory. Please check if the Web user is allowed to read and write to <code>wp-content/uploads/ithoughts_tooltip_glossary</code>', 'ithoughts-tooltip-glossary' ); ?></p></div><?php
			}

			foreach ( $themes as $theme ) {
				$path_to_themes = $theme_infos['absdir'] . '/' . $theme;
				if ( is_file( $path_to_themes ) ) {
					$theme_name = preg_replace( '/^(.+)(?:\\.(?:c|le)ss)$/', '$1', $theme );
					if ( $disable_non_editable ) {
						if ( preg_match( '/\\.less$/',$theme ) ) {
							$opts[ $theme_name ] = array(
								'text' => $theme_name,
							);
						} else {
							$opts[ $theme_name ] = array(
								'text' => $theme_name,
							);
						}
					} else {
						$opts[ $theme_name ] = array(
							'text' => $theme_name,
						);
					}
				}
			}
			return $opts;
		}
	}

	/**
	 * Escapes the content to be used as TinyMCE pseudo-encoded string
	 *
	 * @author Gerkin
	 * @param  string  $str    The string to encode/decode.
	 * @param  boolean $encode Are we encoding? Decoding if false.
	 * @return string  Encoded/decoded string
	 */
	function inner_attr( $str, $encode ) {
		if ( true === $encode ) {
			return str_replace(
				array( '"','\n' ),
				array( '&aquot;','<br/>' ),
				$str
			);
		} else {
			return str_replace(
				array( '&aquot;',"\\'", '\\"', '\\\\' ),
				array( '"', "'", '"', '\\' ),
				$str
			);
		}
	}

	/**
	 * Get ids from each categories provided
	 *
	 * @param  \WP_Term $objs Posts to extract ids from.
	 * @return integer[] Ids of each categories
	 */
	function extract_terms_ids( $objs ) {
		$ret = array();
		foreach ( $objs as $obj ) {
			$ret[] = $obj->term_id;
		}
		return $ret;
	}
}// End if().
