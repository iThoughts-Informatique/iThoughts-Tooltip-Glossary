<?php
/**
 * @file Backend handling class file. Included only if user is logged in
 *
 * @author Gerkin
 * @copyright 2015-2016 iThoughts Informatique
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.5.0
 */

namespace ithoughts\tooltip_glossary;

use \ithoughts\v1_2\Toolbox as TB;

if ( ! defined( 'ABSPATH' ) ) { 
    exit; // Exit if accessed directly
}


if(!class_exists(__NAMESPACE__."\\Admin")){
    class Admin extends \ithoughts\v1_0\Singleton{
        /**
         * Store version extracted from plugin main file
         * @var string $currentVersion
         */
        private $currentVersion;

        /**
         * Updater instance (will be set only if required)
         * @var Updater $updater
         */
        private $updater;

        /**
         * Register admin specific hooks & construct an instance
         * @author Gerkin
         */
        public function __construct() {
            //Trigger version change function ?
            add_action( 'admin_init',								array(&$this,	'setVersion') );
            add_action( 'admin_init',								array(&$this,	'ajaxHooks') );

            add_action( 'admin_menu',								array(&$this,	'get_menu') );

            add_filter( 'mce_buttons',								array(&$this,	"tinymce_register_buttons") );

            add_filter( "mce_external_plugins",						array(&$this,	"tinymce_add_plugin") );

            add_filter( 'mce_external_languages',					array(&$this,	'tinymce_add_translations') );

            add_action( 'admin_init',								array(&$this,	'register_scripts_and_styles')	);

            add_action( 'admin_enqueue_scripts',					array(&$this,	'enqueue_scripts_and_styles')		);
        }

        /**
	 * Trigger check to see if update steps are available. Include and create an {@link \ithoughts\tooltip_glossary\Updater Updater} instance if required.
	 * @author Gerkin
	 */
        public function setVersion(){
            $backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
            try{
                $plugindata = get_plugin_data( $backbone->get_base_path() . '/ithoughts_tooltip_glossary.php' );
                if( $plugindata && is_array($plugindata) && $plugindata['Version'] ){
                    $this->currentVersion = $plugindata['Version'];
                } else {
                    throw new \Exception("unreadable_plugin_error");
                }
                if($backbone->get_option("version") == -1){
                    $backbone->set_option('version',$this->currentVersion);
                } else if( $this->isUnderVersionned() || (isset($_POST) && isset($_POST["data"]) && isset($_POST["data"]["versions"])) ){
                    require_once($backbone->get_base_class_path() . "/Updater.class.php");
                    $this->updater = new Updater($backbone->get_option('version'), $this->currentVersion, $this);
                    if(Updater::requiresUpdate($backbone->get_option('version'), $this->currentVersion)){
                        $this->updater->addAdminNotice();
                    } else {
                        if($this->currentVersion != $backbone->get_option("version")){
                            $backbone->set_option('version',$this->currentVersion);
                        }
                    }
                }
            } catch(Exception $e){
                add_action( 'admin_notices', array(&$this,'unreadable_plugin_error') );
            }
        }

        /**
	 * Display alert on error when plugin version is not readable
	 * @author Gerkin
	 */
        public function unreadable_plugin_error(){
?>
<div class="error form-invalid">
    <p><?php _e( "Can't read plugin version", 'ithoughts-tooltip-glossary' ); ?></p>
</div>
<?php
                                                 }

        /**
	 * Register admin-specific ajax hooks
	 * @author Gerkin
	 */
        public function ajaxHooks(){
            add_action( 'wp_ajax_ithoughts_tt_gl_get_tinymce_tooltip_form',	array(&$this, 'getTinyMCETooltipFormAjax') );
            add_action( 'wp_ajax_ithoughts_tt_gl_update_options',			array(&$this, 'update_options') );

            add_action( 'wp_ajax_ithoughts_tt_gl_theme_save',				array(&$this, 'savetheme' ) );
            add_action( 'wp_ajax_ithoughts_tt_gl_theme_preview',			array(&$this, 'previewtheme' ) );
        }

        /**
	 * Register all scripts & styles specific to admin
	 * @author Gerkin
	 */
        public function register_scripts_and_styles(){
            $backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
            wp_register_script(
                'ithoughts_tooltip_glossary-admin',
                $backbone->get_base_url() . '/js/ithoughts_tooltip_glossary-admin'.$backbone->get_minify().'.js',
                array('ithoughts-simple-ajax',"ithoughts_aliases","ithoughts_tooltip_glossary-floater"),
                "2.4.0"
            );
            wp_register_script(
                "ithoughts_tooltip_glossary-utils",
                $backbone->get_base_url() . '/js/ithoughts_tooltip_glossary-utils'.$backbone->get_minify().'.js',
                array("ithoughts_aliases"),
                "2.3.1"
            );
            wp_register_script(
                "ithoughts_tooltip_glossary-tinymce_form",
                $backbone->get_base_url() . '/js/ithoughts_tooltip_glossary-tinymce-forms'.$backbone->get_minify().'.js',
                array("jquery", "ithoughts_tooltip_glossary-utils","ithoughts_aliases","ithoughts-simple-ajax"),
                "2.4.0"
            );
            wp_register_script(
                'wp-color-picker-alpha',
                $backbone->get_base_url() . '/ext/colorpicker-alpha.min.js',
                array( 'wp-color-picker' ),
                "2.2.0"
            );
            wp_register_script(
                'ithoughts_tooltip_glossary-gradx-dom',
                $backbone->get_base_url() . '/ext/gradx/dom-drag.js',
                array('jquery'),
                null
            );
            wp_register_script(
                'ithoughts_tooltip_glossary-colorpicker',
                $backbone->get_base_url() . '/ext/gradx/colorpicker/colorpicker'.$backbone->get_minify().'.js',
                array('jquery'),
                null
            );
            wp_register_script(
                'ithoughts_tooltip_glossary-gradx',
                $backbone->get_base_url() . '/ext/gradx/gradX.js',
                array('ithoughts_tooltip_glossary-gradx-dom', 'ithoughts_tooltip_glossary-colorpicker'),
                null
            );
            wp_register_script(
                'ithoughts_tooltip_glossary-updater',
                $backbone->get_base_url() . '/js/ithoughts_tt_gl-updater'.$backbone->get_minify().'.js',
                array("jquery","ithoughts_aliases"),
                "2.3.1"
            );
            wp_register_script(
                'ithoughts_tooltip_glossary-floater',
                $backbone->get_base_url() . '/js/ithoughts_tt_gl-floater'.$backbone->get_minify().'.js',
                array("jquery","ithoughts_aliases", "ithoughts_tooltip_glossary-qtip"),
                "2.4.0"
            );
            wp_register_script(
                'ithoughts_tooltip_glossary-styleeditor',
                $backbone->get_base_url() . '/js/ithoughts_tooltip_glossary-styleeditor'.$backbone->get_minify().'.js',
                array('ithoughts_tooltip_glossary-gradx', 'ithoughts_tooltip_glossary-colorpicker', 'wp-color-picker-alpha',"ithoughts_aliases","ithoughts_tooltip_glossary-floater","ithoughts-simple-ajax"),
                "2.4.0"
            );


            wp_localize_script(
                "ithoughts_tooltip_glossary-tinymce_form",
                "ithoughts_tt_gl_tinymce_form",
                array(
                    "admin_ajax"    => admin_url('admin-ajax.php'),
                    "base_tinymce"  => $backbone->get_base_url() . '/js/tinymce',
                    "terms"         => array()
                )
            );

            wp_register_style( "ithoughts_tooltip_glossary-tinymce_form",	$backbone->get_base_url() . '/css/ithoughts_tooltip_glossary-tinymce-forms'.$backbone->get_minify().'.css', null, "2.4.0");
            wp_register_style( 'ithoughts_tooltip_glossary-colorpicker',	$backbone->get_base_url() . '/ext/gradx/colorpicker/colorpicker.css', null, null );
            wp_register_style( 'ithoughts_tooltip_glossary-gradx',			$backbone->get_base_url() . '/ext/gradx/gradX.css', null, null );
            wp_register_style( 'ithoughts_tooltip_glossary-admin',			$backbone->get_base_url() . '/css/ithoughts_tooltip_glossary-admin'.$backbone->get_minify().'.css', null, "2.4.0" );
        }

        /**
	 * Enqueue the global Admin scripts & styles
	 * @author Gerkin
	 */
        public function enqueue_scripts_and_styles(){
            wp_enqueue_style( 'ithoughts_tooltip_glossary-admin');
        }

		/**
         * Register plugin's TinyMCE buttons
         * @author Gerkin
         * @param  string[] $buttons Already registered buttons
         * @return string[] Original `$buttons` appended with this plugin's buttons
         */
		public function tinymce_register_buttons( $buttons ) {
			array_push( $buttons, 'glossaryterm', 'glossaryterm-d', 'glossarylist' );
			return $buttons;
		}

        /**
	 * Register plugin's TinyMCE plugin and enqueue required scripts
	 * @author Gerkin
	 * @param  string[] $plugin_array Already registered plugins
	 * @return string[] Original `$plugin_array` appended with plugin's TinyMCE scripts
	 */
        public function tinymce_add_plugin( $plugin_array ) {
            $backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
            wp_enqueue_script("ithoughts_tooltip_glossary-utils");
            wp_enqueue_script("ithoughts_tooltip_glossary-qtip");
            $version = "t=2.1.7";
            if(defined(WP_DEBUG) && WP_DEBUG){
                $version = "t=".time(); 
            }
            $plugin_array['ithoughts_tt_gl_tinymce'] = $backbone->get_base_url() . '/js/ithoughts_tt_gl-tinymce'.$backbone->get_minify().'.js?'.$version;
            return $plugin_array;
        }

        /**
	 * Add plugin's related translations for use in TinyMCE
	 * @author Gerkin
	 * @param  string[] $locales Translations already registered
	 * @return string[] Locales appended with iThoughts Tooltip Glossary TinyMCE translation file
	 */
        public function tinymce_add_translations($locales){
            $backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
            $locales ['ithoughts_tt_gl_tinymce'] = $backbone->get_base_lang_path() . '/ithoughts_tt_gl_tinymce_lang.php';
            return $locales;
        }

        /**
	 * Generates the admin menu
	 * @author Gerkin
	 */
        public function get_menu(){
            $backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
            $plugindata = get_plugin_data( $backbone->get_base_path() . '/ithoughts_tooltip_glossary.php' );
            if( $plugindata && is_array($plugindata) && $plugindata['Version'] ){
                $this->currentVersion = $plugindata['Version'];
            } else {
                $currentVersion = "0.0";
            }
            $menu = add_menu_page("iThoughts Tooltip Glossary", "Tooltip Glossary", "edit_others_posts", "ithought-tooltip-glossary", null, $backbone->get_base_url()."/js/icon/icon.svg");

            $submenu_pages = array(
                // Options
                //start
                array(
                    'parent_slug'   => 'ithought-tooltip-glossary',
                    'page_title'    => __( 'Options', 'ithoughts-tooltip-glossary' ),
                    'menu_title'    => __( 'Options', 'ithoughts-tooltip-glossary' ),
                    'capability'    => 'manage_options',
                    'menu_slug'     => 'ithought-tooltip-glossary',
                    'function'      => array($this, 'options'),
                ),
                //close

                // Post Type :: Add New Post
                //start
                array(
                    'parent_slug'   => 'ithought-tooltip-glossary',
                    'page_title'    => __('Add a Term', 'ithoughts-tooltip-glossary' ),
                    'menu_title'    => __('Add a Term', 'ithoughts-tooltip-glossary' ),
                    'capability'    => 'edit_others_posts',
                    'menu_slug'     => 'post-new.php?post_type=glossary',
                    'function'      => null,// Doesn't need a callback function.
                ),
                //close

                // Post Type :: View All Posts
                //start
                array(
                    'parent_slug'   => 'ithought-tooltip-glossary',
                    'page_title'    => __('Glossary Terms', 'ithoughts-tooltip-glossary' ),
                    'menu_title'    => __('Glossary Terms', 'ithoughts-tooltip-glossary' ),
                    'capability'    => 'edit_others_posts',
                    'menu_slug'     => 'edit.php?post_type=glossary',
                    'function'      => null,// Doesn't need a callback function.
                ),
                //close

                // Taxonomy :: Manage News Categories
                //start
                array(
                    'parent_slug'   => 'ithought-tooltip-glossary',
                    'page_title'    => __('Glossary Groups', 'ithoughts-tooltip-glossary' ),
                    'menu_title'    => __('Glossary Groups', 'ithoughts-tooltip-glossary' ),
                    'capability'    => 'manage_categories',
                    'menu_slug'     => 'edit-tags.php?taxonomy=glossary_group&post_type=glossary',
                    'function'      => null,// Doesn't need a callback function.
                ),
                //close

                // Theme editor
                //start
                array(
                    'parent_slug'   => 'ithought-tooltip-glossary',
                    'page_title'    => __('Theme editor', 'ithoughts-tooltip-glossary' ),
                    'menu_title'    => __('Theme editor', 'ithoughts-tooltip-glossary' ),
                    'capability'    => 'edit_theme_options',
                    'menu_slug'     => 'ithought-tooltip-glossary-themes',
                    'function'      => array($this, 'theme_editor'),// Doesn't need a callback function.
                ),
                //close
            );


            if( $this->isUnderVersionned() ){
                require_once($backbone->get_base_class_path() . "/Updater.class.php");
                if(Updater::requiresUpdate($backbone->get_option('version'), $this->currentVersion)){
                    // Updater :: Hidden but entry point for update actions
                    $submenu_pages[] = array(
                        'parent_slug'   => 'ithought-tooltip-glossary',
                        'page_title'    => __("Update", 'ithoughts-tooltip-glossary' ),
                        'menu_title'    => __("Update", 'ithoughts-tooltip-glossary' ),
                        'capability'    => 'manage_options',
                        'menu_slug'     => 'ithoughts_tt_gl_update',
                        'function'      => array(&$this->updater, 'updater'),// Doesn't need a callback function.
                    );
                }
            }

            // Add each submenu item to custom admin menu.
            foreach($submenu_pages as $submenu){

                add_submenu_page(
                    $submenu['parent_slug'],
                    $submenu['page_title'],
                    $submenu['menu_title'],
                    $submenu['capability'],
                    $submenu['menu_slug'],
                    $submenu['function']
                );

            }

            // Add menu page (capture page for adding admin style and javascript
        }

        /**
	 * Check if version stored in DB has updates available with in files version.
	 * @author Gerkin
	 * @return boolean Returns true if an update step is available, false otherwise
	 */
        public function isUnderVersionned(){
            $backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
            $currentVersion;

            if($backbone->get_option('version') == "-1")
                return false;
            $version_diff = version_compare( $backbone->get_option('version'), $this->currentVersion );
            return $version_diff == -1;
        }

        /**
	 * Generates the options page of iThoughts Tooltip Glossary
	 * @author Gerkin
	 */
        public function options(){
            $backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

            $ajax         = admin_url( 'admin-ajax.php' );
            $options      = $backbone->get_options();

            wp_enqueue_script( 'ithoughts_tooltip_glossary-admin' );

            wp_enqueue_style( 'ithoughts_tooltip_glossary-css' );
            wp_enqueue_style( 'ithoughts_tooltip_glossary-qtip-css' );
            wp_enqueue_style('ithoughts_tooltip_glossary-customthemes');



            /* Add required scripts for WordPress Spoilers (AKA PostBox) */
            wp_enqueue_script('postbox');
            wp_enqueue_script('post');

			$optionsInputs = array(
				"termlinkopt" => TB::generate_input_select(
					'termlinkopt',
					array(
						'selected'	=> $options["termlinkopt"],
						'options'	=> array(
							'standard'	=> array(
								'text'	=> __('Normal', 'ithoughts-tooltip-glossary' ),
								'attributes'	=> array(
									'title'	=> __('Normal link with no modifications', 'ithoughts-tooltip-glossary' )
								)
							),
							'none'	=> array(
								'text'	=>__('No link', 'ithoughts-tooltip-glossary' ),
								'attributes'	=> array(
									'title'	=> __("Don't link to term", 'ithoughts-tooltip-glossary' )
								)
							),
							'blank'	=> array(
								'text'	=> __('New tab', 'ithoughts-tooltip-glossary' ),
								'attributes'	=> array(
									'title'	=> __("Always open in a new tab", 'ithoughts-tooltip-glossary' )
								)
							),
						),
					)
				),
				"staticterms" => TB::generate_input_check(
					"staticterms",
					array(
						"radio" => false,
						"selected" => $options["staticterms"] ? array("enabled") : array(),
						"options" => array(
							"enabled" => array(
								"attributes" => array(
									"id" => "staticterms"
								)
							)
						)
					)
				),
				"forceloadresources" => TB::generate_input_check(
					"forceloadresources",
					array(
						"radio" => false,
						"selected" => $options["forceloadresources"] ? array("enabled") : array(),
						"options" => array(
							"enabled" => array(
								"attributes" => array(
									"id" => "forceloadresources"
								)
							)
						)
					)
				),
				"termtype" => TB::generate_input_text(
					"termtype",
					array(
						"type" => "text",
						"value" => $options["termtype"]
					)
				),
				"grouptype" => TB::generate_input_text(
					"grouptype",
					array(
						"type" => "text",
						"value" => $options["grouptype"]
					)
				),
				"termcontent" => TB::generate_input_select(
					'termcontent',
					array(
						'selected' => $options["termcontent"],
						'options'  => array(
							'full'	=> array(
								'text'	=> __('Full', 'ithoughts-tooltip-glossary' ),
								'attributes'	=> array(
									'title'	=> __('Display full post content', 'ithoughts-tooltip-glossary' )
								)
							),
							'excerpt'	=> array(
								'text'	=> __('Excerpt', 'ithoughts-tooltip-glossary' ),
								'attributes'	=> array(
									'title'	=> __('Display shorter excerpt content', 'ithoughts-tooltip-glossary' )
								)
							), 
							'off'	=> array(
								'text'	=> __('Off', 'ithoughts-tooltip-glossary' ),
								'attributes'	=> array(
									'title'	=> __('Do not display tooltip at all', 'ithoughts-tooltip-glossary' )
								)
							),
						),
					)
				),
				"termscomment" => TB::generate_input_check(
					"termscomment",
					array(
						"radio" => false,
						"selected" => $options["termscomment"],
						"options" => array(
							"enabled" => array(
								"attributes" => array(
									"id" => "termscomment"
								)
							)
						)
					)
				),
				"qtipstyle" => TB::generate_input_select(
					'qtipstyle',
					array(
						'selected' => $options["qtipstyle"],
						'options'  => $this->get_themes(),
					)
				),
				"qtiptrigger" => TB::generate_input_select(
					'qtiptrigger',
					array(
						'selected'	=> $options["qtiptrigger"],
						'options'	=> array(
							'click'	=> array(
								'text'	=> __('Click', 'ithoughts-tooltip-glossary' ),
								'attributes'	=>array(
									'title'	=> __('On click', 'ithoughts-tooltip-glossary' )
								)
							),
							'responsive'	=> array(
								'text'	=> __('Hybrid', 'ithoughts-tooltip-glossary' ),
								'attributes'	=>array(
									'title'	=> __('Hover (on computer) and click (touch devices)', 'ithoughts-tooltip-glossary' )
								)
							),
						),
					)
				),
				"qtipshadow" => TB::generate_input_check(
					"qtipshadow",
					array(
						"radio" => false,
						"selected" => $options["qtipshadow"],
						"options" => array(
							"enabled" => array(
								"attributes" => array(
									"id" => "qtipshadow"
								)
							)
						)
					)
				),
				"qtiprounded" => TB::generate_input_check(
					"qtiprounded",
					array(
						"radio" => false,
						"selected" => $options["qtiprounded"],
						"options" => array(
							"enabled" => array(
								"attributes" => array(
									"id" => "qtiprounded"
								)
							)
						)
					)
				),
				"anim_in" => TB::generate_input_select(
					'anim_in',
					array(
						'selected' => $options["anim_in"] ?: '',//$options["termcontent"],
						'options'  => apply_filters("ithoughts-tt-gl_tooltip-anim-in", array()),
					)
				),
				"anim_out" => TB::generate_input_select(
					'anim_out',
					array(
						'selected' => $options["anim_out"] ?: '',//$options["termcontent"],
						'options'  => apply_filters("ithoughts-tt-gl_tooltip-anim-out", array()),
					)
				),
				"anim_time" => TB::generate_input_text(
					"anim_time",
					array(
						"type" => "text",
						"value" => $options["anim_time"],
						"attributes" => array(
							"placeholder" => "500",
							"style" => "width:50px"
						)
					)
				),
			);

            $optionsInputs["qtipstylecustom"] = TB::generate_input_text(
                "qtipstylecustom",
                array(
                    "type" => "text",
                    "value" => (strpos($optionsInputs["qtipstyle"], 'selected="selected"') === false) ? $options["qtipstyle"] : ""
                )
            );
            require($backbone->get_base_path() . "/templates/options.php");
        }

        /**
	 * Sets the options on submit of the options form in plugin admin pages
	 * @author Gerkin
	 */
        public function update_options(){
            $backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
            $glossary_options = $backbone->get_options();

            $postValues = $_POST;
            $postValues['qtipshadow']  = TB::checkbox_to_bool($postValues,'qtipshadow',  "enabled");
            $postValues['qtiprounded'] = TB::checkbox_to_bool($postValues,'qtiprounded', "enabled");
            $postValues['staticterms'] = TB::checkbox_to_bool($postValues,'staticterms', "enabled");
            if(isset($postValues["qtipstylecustom"]) && strlen(trim($postValues["qtipstylecustom"])) > 0){
                $postValues["qtipstyle"] = $postValues["qtipstylecustom"];
            }
            unset($postValues["qtipstylecustom"]);

            $glossary_options_old = $glossary_options;
            $glossary_options = array_merge($glossary_options, $postValues);
            $defaults = $backbone->get_options(true);
            foreach($glossary_options as $optkey => $optvalue){
                if(!isset($defaults[$optkey]))
                    unset($glossary_options[$optkey]);
            }

            $outtxt = "";
            $valid = true;
            $reload = false;

            $glossary_options["termtype"] = urlencode( $glossary_options["termtype"] );
            $glossary_options["grouptype"] = urlencode( $glossary_options["grouptype"] );

            if(strlen($glossary_options["termtype"]) < 1){
                $outtxt .= ('<p>' . __('Invalid input for', 'ithoughts-tooltip-glossary' ) . " \"" . __('Base Permalink', 'ithoughts-tooltip-glossary' ) . '"</p>') ;
                $valid = false;
            }
            if(strlen($glossary_options["grouptype"]) < 1){
                $outtxt .= ('<p>' . __('Invalid input for', 'ithoughts-tooltip-glossary' ) . " \"" . __('Taxonomy group prefix', 'ithoughts-tooltip-glossary' ) . '"</p>') ;
                $valid = false;
            }

            if($valid){
                if(
                    $glossary_options_old["termtype"] != $glossary_options["termtype"] ||
                    $glossary_options_old["grouptype"] != $glossary_options["grouptype"]
                ){
                    $reload = true;
                    $glossary_options["needflush"] = true;
                    flush_rewrite_rules(false);
                    $outtxt .= "<p>" . __( 'Rewrite rule flushed', 'ithoughts-tooltip-glossary' ) . "</p>";
                }
                $backbone->set_options($glossary_options);
                $outtxt .= ('<p>' . __('Options updated', 'ithoughts-tooltip-glossary' ) . '</p>') ;
            }

            die( json_encode(array(
                "reload" => $reload,
                "text" =>$outtxt,
                "valid" => $valid
            )));
        }

        /**
	 * Generates the TinyMCE form to create a tooltip. It will return the compiled HTML in a JSON table.
	 * @author Gerkin
	 */
        public function getTinyMCETooltipFormAjax(){
            $backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
            $data = array();

            $mediatiptypes = array(
                'localimage' => array(
                    'text' => __('Local image', 'ithoughts-tooltip-glossary' ),
                    'attributes' => array(
                        'title'=> __('Image from site library', 'ithoughts-tooltip-glossary' )
                    )
                ), 
                'webimage' => array(
                    'text' => __('Image on the web', 'ithoughts-tooltip-glossary' ),
                    'attributes' => array(
                        'title'=> __('Image referenced by url, not on the site', 'ithoughts-tooltip-glossary' )
                    )
                ),
                'webvideo' => array(
                    'text' => __('Video on the web', 'ithoughts-tooltip-glossary' ),
                    'attributes' => array(
                        'title'=> __('Video hosted online. Only Youtube, Dailymotion or .mp4 videos', 'ithoughts-tooltip-glossary' )
                    )
                ),
            );
            $mediatiptypes_keys = array_keys($mediatiptypes);

            isset($_POST['data']) && $data=$_POST['data'];

            // Set defaults
            $types = array("glossary", "tooltip", "mediatip");
            try{
                $data["type"] = isset($data["type"]) && $data["type"] && array_search($data["type"], $types) !== false ? $data["type"] : "tooltip";
                $data["text"] = isset($data["text"]) ? $data["text"] : "";
                $data["link"] = isset($data["link"]) ? $data["link"] : "";
                $data["glossary_id"] = isset($data["glossary_id"]) ? $data["glossary_id"] : NULL;
                $data["term_search"] = isset($data["term_search"]) ? $data["term_search"] : "";
                $data["mediatip_type"] = isset($data["mediatip_type"]) && $data["mediatip_type"] && isset($mediatiptypes[$data["mediatip_type"]]) ? $data["mediatip_type"] : $mediatiptypes_keys[0];
                $data["mediatip_content_json"] = (isset($data["mediatip_content"]) ? $data["mediatip_content"] : "");
                $data["mediatip_content"] = TB::decode_json_attr($data["mediatip_content_json"]);
                $data["mediatip_content_json"] = str_replace('\\"', '&quot;', $data["mediatip_content_json"]);
                $data["mediatip_caption"] = innerAttr(isset($data["mediatip_caption"]) ? $data["mediatip_caption"] : "", false);
                $data["glossary_disable_auto_translation"] = (isset($data["glossary_disable_auto_translation"])) ? $data["glossary_disable_auto_translation"] === "true" || $data["glossary_disable_auto_translation"] === true : false;
                switch($data["type"]){
                    case "glossary":{
                    } break;

                    case "tooltip":{
                        $data["tooltip_content"] = innerAttr(
                            isset($data["tooltip_content"]) ? $data["tooltip_content"] : ""
                            , false);
                    } break;

                    case "mediatip":{
                    } break;
                }
            } catch(Exception $e){
                $data["type"] = "tooltip";
                $data["text"] = "";
                $data["glossary_id"] = NULL;
                $data["term_search"] = "";
                $data["mediatip_type"] = $mediatiptypes_keys[0];
                $data["mediatip_content_json"] = "";
                $data["mediatip_content"] = "";
                $data["tooltip_content"] = "";
            }

            // Ok go

            // Retrieve terms
            $form_data = array(
                "admin_ajax"    => admin_url('admin-ajax.php'),
                "base_tinymce"  => $backbone->get_base_url() . '/js/tinymce',
                "terms"         => array()
            );
            $args;
            if($data["glossary_id"] == NULL){
                $form_data['terms'] = $backbone->searchTerms(array(
                    "post_type"     => "glossary",
                    'post_status'   => 'publish',
                    'orderby'       => 'title',
                    'order'         => 'ASC',
                    'posts_per_page'   => 25,
                    'post__in'      => $data['term_search'],
                    'suppress_filters' => false
                ));
            } else {
                $post = get_post($data["glossary_id"]);
                $form_data['terms'][] = array(
                    "slug"      => $post->post_name,
                    "content"   => wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
                    "title"     => $post->post_title,
                    "id"        => $post->ID
                );
            }

            wp_reset_postdata();

            wp_localize_script( "ithoughts_tooltip_glossary-tinymce_form", "ithoughts_tt_gl_tinymce_form", $form_data );

            $options = $backbone->get_options();

            $inputs = array(
                'mediatip_type' => TB::generate_input_select(
                    'mediatip_type',
                    array(
                        'selected' => $data["mediatip_type"],
                        'options'  => $mediatiptypes,
                        "attributes" => array(
                            "class"    => "modeswitcher"
                        )
                    )
                ),
                "qtip-content" => TB::generate_input_select(
                    'qtip-content',
                    array(
                        'selected' => $options["termcontent"],
                        'options'  => array(
                            'full'	=> array(
                                'text'	=> __('Full', 'ithoughts-tooltip-glossary' ),
                                'attributes'	=> array(
                                    'title'	=> __('Display full post content', 'ithoughts-tooltip-glossary' )
                                )
                            ),
                            'excerpt'	=> array(
                                'text'	=> __('Excerpt', 'ithoughts-tooltip-glossary' ),
                                'attributes'	=> array(
                                    'title'	=> __('Display shorter excerpt content', 'ithoughts-tooltip-glossary' )
                                )
                            ), 
                            'off'	=> array(
                                'text'	=> __('Off', 'ithoughts-tooltip-glossary' ),
                                'attributes'	=> array(
                                    'title'	=> __('Do not display tooltip at all', 'ithoughts-tooltip-glossary' )
                                )
                            ),
                        ),
                    )
                ),
                "qtipstyle" => TB::generate_input_select(
                    'qtipstyle',
                    array(
                        'selected' => $options["qtipstyle"],
                        'options'  => $this->get_themes(),
                    )
                ),
                "qtiptrigger" => TB::generate_input_select(
                    'qtiptrigger',
                    array(
                        'selected'	=> $options["qtiptrigger"],
                        'options'	=> array(
                            'click'	=> array(
                                'text'	=> __('Click', 'ithoughts-tooltip-glossary' ),
                                'attributes'	=>array(
                                    'title'	=> __('On click', 'ithoughts-tooltip-glossary' )
                                )
                            ),
                            'responsive'	=> array(
                                'text'	=> __('Responsive', 'ithoughts-tooltip-glossary' ),
                                'attributes'	=>array(
                                    'title'	=> __('Hover (on computer) and click (touch devices)', 'ithoughts-tooltip-glossary' )
                                )
                            ),
                        ),
                    )
                ),
                "qtipshadow" => TB::generate_input_check(
                    "qtipshadow",
                    array(
                        "radio" => false,
                        "selected" => $options["qtipshadow"],
                        "options" => array(
                            "enabled" => array(
                                "attributes" => array(
                                    "id" => "qtipshadow"
                                )
                            )
                        )
                    )
                ),
                "qtiprounded" => TB::generate_input_check(
                    "qtiprounded",
                    array(
                        "radio" => false,
                        "selected" => $options["qtiprounded"],
                        "options" => array(
                            "enabled" => array(
                                "attributes" => array(
                                    "id" => "qtiprounded"
                                )
                            )
                        )
                    )
                )
            );

            $attrs = array(
                'abbr','accept-charset','accept','accesskey','action','align','alt','archive','axis',
                'border',
                'cellpadding','cellspacing','char','charoff','charset','checked','cite','class','classid','codebase','codetype','cols','colspan','content','coords',
                'data','datetime','declare','defer','dir','disabled',
                'enctype',
                'for','frame','frameborder',
                'headers','height','href','hreflang','http-equiv',
                'id','ismap',
                'label','lang','longdesc',
                'marginheight','marginwidth','maxlength','media','method','multiple',
                'name','nohref','noresize',
                'onblur','onchange','onclick','ondblclick','onfocus','onkeydown','onkeypress','onkeyup','onload','onmousedown','onmousemove','onmouseout','onmouseover','onmouseup','onreset','onselect','onsubmit','onunload', 
                'profile',
                'readonly','rel','rev','rows','rowspan','rules',
                'scheme','scope','scrolling','selected','shape','size','span','src','standby','style','summary',
                'tabindex','target','title','type',
                'usemap',
                'valign','value','valuetype',
                'width'
            );

            ob_start();
            include $backbone->get_base_path()."/templates/tinymce-tooltip-form.php";

            $output = ob_get_clean();
            echo $output;
            wp_die();
        }

        /**
	 * Initialize the customizing form for custom themes. If the POST request specifies a theme name, it will be parsed then loaded.
	 * @uses `templates/customizing_form.php`
	 * @author Gerkin
	 */
        public function theme_editor(){
            $backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
            $themename = isset($_GET["themename"]) ? $_GET["themename"] : NULL;
            $action = isset($_GET["action"]) ? $_GET["action"] : "load";
            $themedata;
            switch($action){
                case "load": {
                    $themedata = $this->loadtheme($themename);        
                } break;

                case "delete": {
                    $ret = $this->remove_theme($themename);
                    $themedata = $this->loadtheme(NULL);
                } break;

                case "recompile":{
                    $ret = $this->recompile_custom_themes();
                    $themedata = $this->loadtheme(NULL);
                } break;
            }

            if(isset($themedata["error"]) || isset($ret["error"])){
?><div class="notice notice-error"><p><?php _e("Error while generating the theme editor: ", 'ithoughts-tooltip-glossary'); echo $themedata["error"]; echo $ret["error"] ?></p></div><?php
                                                                  }


            /* Add required scripts for WordPress Spoilers (AKA PostBox) */
            wp_enqueue_script('postbox');
            wp_enqueue_script('post');


            /* Add required resources for wpColorPicker */
            wp_enqueue_script( 'ithoughts_tooltip_glossary-styleeditor');

            wp_enqueue_style( 'ithoughts_tooltip_glossary-colorpicker' );
            wp_enqueue_style('ithoughts_tooltip_glossary-qtip-css');
            wp_enqueue_style('ithoughts_tooltip_glossary-customthemes');

            wp_enqueue_style( 'wp-color-picker');
            wp_enqueue_style( 'ithoughts_tooltip_glossary-gradx' );

            $themeInfos = $this->get_custom_theme_infos();
            $themeEditorEnabled = !is_writable($themeInfos["absdir"]."/".($themedata["file"] ? $themedata["file"] : ""));

            $inputs = array(
                "themeselect" => TB::generate_input_select(
                    'themename',
                    array(
                        'allow_blank' => __("Select one", "ithoughts-tooltip-glossary"),
                        'selected' => $themename,
                        'options'  => $this->get_themes(true)
                    )
                ),
                "themename" => TB::generate_input_text(
                    "theme_name",
                    array(
                        "value" => $themename,
                        "required" => true,
                        "attributes" => array(
                            "minlength" => 3,
                            "pattern" => "^[a-zA-Z0-9][a-zA-Z0-9\-\_]+[a-zA-Z0-9]", "data-pattern-infos" => __('At least 3 letters (lowercase and uppercase), numbers, _ or -, and not starting or ending with symbol', 'ithoughts-tooltip-glossary' )
                        )
                    )
                ),
                "splittedHead" =>  TB::generate_input_text(
                    "splittedHead",
                    array(
                        "value" => $themedata["splittedHead"] ? "yes" : "",
                        "type" => "hidden"
                    )
                ),
                "file" =>  TB::generate_input_text(
                    "file",
                    array(
                        "value" => $themedata["file"],
                        "type" => "hidden",
                    )
                ),
                "content" => TB::generate_input_text(
                    "content",
                    array(
                        "textarea" => true,
                        "value" => $themedata["content"],
                        "attributes" => array(
                            "disabled" => $themeEditorEnabled,
                            "class" => "ace-editor",
                            "data-lang" => "css"
                        ),
                    )
                )
            );
            require $backbone->get_base_path()."/templates/customizing_form.php";
        }

        private function loadtheme($themename = NULL){
            $defaultContent = '.qtip{ /* Global tip style (eg: borders, shadow, etc) */
}
.qtip-title{ /* Title specific rules */
}
.qtip-content{ /* Content specific rules */
}';
            if($themename == NULL){ // Output default new theme content
                return array(
                    "splittedHead" => true,
                    "file" => null,
                    "content" => $defaultContent
                );
            }

            $reformatedThemeName = preg_replace("/[^a-z]/", "_", strtolower($themename));
            $themeInfos = $this->get_custom_theme_infos();
            $ret = true;
            if(!file_exists ($themeInfos["absdir"])){
                $ret &= mkdir($themeInfos["absdir"], 0755, true);
            }
            $file = $reformatedThemeName.".less";
            if(!file_exists($themeInfos["absdir"]."/".$file)){
                $file = $reformatedThemeName.".css";
            }
            if(!file_exists($themeInfos["absdir"]."/".$file)){
                return array(
                    "splittedHead" => true,
                    "file" => null,
                    "content" => $defaultContent,
                    "error" => __("No matching file found. Try to load another theme", "ithoughts-tooltip-glossary")
                );
            }

            $content =  file_get_contents($themeInfos["absdir"]."/".$file);

            $matchHeadRegex = "/^\\.qtip-$reformatedThemeName\\s*{[\\n\\s]*&/";
            $splittedHead = false;
            if(preg_match($matchHeadRegex, $content) === 1){ // If normal header 
                if(
                    (substr_count($content, "}") === substr_count($content, "{")) &&
                    (substr_count($content, "}") >= 2) &&
                    (strrpos($content, "{") < strrpos($content, "}", (strrpos($content, "}") - strlen($content))-1))
                ){ // And have the right format
                    $content = preg_replace($matchHeadRegex, "", $content);
                    $content = preg_replace("/}\s*$/", "", $content);
                    $splittedHead = true;
                }
            }
            return  array(
                "splittedHead" => $splittedHead,
                "file" => $file,
                "content" => $this->auto_indent($content)
            );
        }

        /**
         * Sends the generated CSS from `customizing_form.php` to be previewed
         * @author Gerkin
         */
        public function previewtheme(){
            if(!isset($_POST))
                wp_send_json_error("No post data.");
            $data = $_POST;
            unset($data["action"]);

            $ret = $this->theme_to_less($data);

            try{
                require_once(\ithoughts\tooltip_glossary\Backbone::get_instance()->get_base_path()."/submodules/lessphp/lessc.inc.php");
                $less = new \lessc;
                $ret["css"] = $less->compile($ret["less"]);
                $ret["valid"] = true;
                $ret["text"] = "<p>".__("CSS generated.",'ithoughts-tooltip-glossary')."</p>";
            } catch(\Exception $e){
                $tmp = array(
                    "valid" => false,
                    "text" => "<p>".__("Error while generate CSS",'ithoughts-tooltip-glossary').": \"<code>{$e->getMessage()}</code>\"</p>"
                );
                error_log($e->getMessage());
                $ret = array_merge($tmp, $ret);
                $ret["error"] = $e->getMessage();
            }

            die( json_encode($ret));
        }

        /**
         * Save the POSTed theme. It should not be used from other where than in an Ajax call in `customizing_form.php`
         * @author Gerkin
         */
        public function savetheme(){
            if(!isset($_POST))
                wp_send_json_error("No post data.");
            $data = $_POST;
            unset($data["action"]);

            $ret = $this->theme_to_less($data);

            $out = $this->update_theme($ret["theme_name"], $data["file"], $ret["less"]);
            die( json_encode(array("valid" => $out["valid"], "text" => "<p>".(($out["valid"]) ? __("Theme saved.",'ithoughts-tooltip-glossary') : __("Failed to save the theme.",'ithoughts-tooltip-glossary'))."</p>")));
        }

        /**
         * Generate the LESS string depending on the custom_theme's form values given
         * @author Gerkin
         * @param  string[] $theme Custom Theme's values
         * @return string   Ready to compile LESS string
         */
        private function theme_to_less($theme){
            $theme_name = $theme["theme_name"];
            $theme_name = preg_replace("/[^a-z]/", "_", strtolower($theme_name));

            $content;
            if(isset($theme["content"]) && $theme["content"]){
                if(isset($theme["splittedHead"]) && $theme["splittedHead"] == "yes"){
                    $content .= ".qtip-$theme_name{".PHP_EOL;
                    $content .= "&".$theme["content"].PHP_EOL."}";
                } else {
                    $content = $theme["content"];
                }
            } else {
                $content = "";
            }


            $ret = array(
                "less" => $this->auto_indent($content),
                "theme_name" => $theme_name
            );
            return $ret;
        }

        private function auto_indent($content){
            $lines = explode(PHP_EOL, preg_replace("/^[ \t]+/m", "", preg_replace("/[\t ]+/m", " ", $content)));

            $indented = "";
            $indent = "\t";
            $indentLevel = 0;
            foreach($lines as $line){
                $indentLevel -= preg_match("/}\s*$/",$line);
                if(strlen($line) > 0)
                    $indented .= str_repeat($indent, $indentLevel).$line.PHP_EOL;
                else
                    $indented .= PHP_EOL;
                $indentLevel += preg_match("/\{(\s*(\\/\\*.*\\*\\/)*)*$/",$line);
            }
            return preg_replace("/[\n\r\s]*$/","",$indented);
        }

        /**
	 * Update a custom theme
	 * @author Gerkin
	 * @param string $themeName The name of the theme to update
	 * @param string $themeContent The theme's CSS stylesheet
	 */
        private function update_theme($themeName, $filename, $themeContent){
            $reformatedThemeName = preg_replace("/[^a-z]/", "_", strtolower($themeName));
            $themeInfos = $this->get_custom_theme_infos();
            $ret = true;
            if(!file_exists ($themeInfos["absdir"]))
                $ret &= mkdir($themeInfos["absdir"], 0755, true);

            if($reformatedThemeName.".less" != $filename){
                unlink($themeInfos["absdir"]."/".$filename);
            }
            $ret &= file_put_contents($themeInfos["absdir"]."/".$reformatedThemeName.".less", $themeContent) !== FALSE;



            return $this->recompile_custom_themes();
        }

        /**
	 * Remove a custom theme
	 * @author Gerkin
	 * @param string $themeName The name of the theme to delete
	 */
        private function remove_theme($themeName){
            $reformatedThemeName = preg_replace("/[^a-z]/", "_", strtolower($themeName));
            $themeInfos = $this->get_custom_theme_infos();
            $ret = true;
            if(!file_exists ($themeInfos["absdir"]))
                $ret &= mkdir($themeInfos["absdir"], 0755, true);

            $ret &= unlink($themeInfos["absdir"]."/".$reformatedThemeName.".less");




            return $this->recompile_custom_themes();
        }

        /**
	 * Recompile the whole custom themes stylesheet. The URL to the output file is stored in the option "custom_styles_path", with the timestamp of generation.
	 * @author Gerkin
	 */
        private function recompile_custom_themes(){
            $themeInfos = $this->get_custom_theme_infos();
            $errs = array();
            try{
                $themes = @scandir($themeInfos["absdir"]); //STFU
            } catch(Exception $e){
                $themes = false;
            }
            if($themes === false){
                $themes = array();
                return array(
                    "valid" => false,
                    "errors" => array(
                        __("Could not read stylesheet components. Please check that your Web user is allowed to read in <code>wp-content/uploads/ithoughts_tooltip_glossary</code>", "ithoughts-tooltip-glossary")
                    )
                );
            }
            $concatTheme = "";

            if(!file_exists ($themeInfos["absdir"]))
                $ret &= mkdir($themeInfos["absdir"], 0755, true);

            require_once(\ithoughts\tooltip_glossary\Backbone::get_instance()->get_base_path()."/submodules/lessphp/lessc.inc.php");
            $less = new \lessc;
            foreach($themes as $theme){
                $pathTheme = $themeInfos["absdir"]."/".$theme;
                try{
                    if(is_file($pathTheme)){
                        $content = "";
                        if(preg_match("/.+\.css$/", $theme)){ // CSS File
                            $content .= file_get_contents($pathTheme);
                        }
                        if(preg_match("/.+\.less/", $theme)){ // LESS File
                            $content .= $less->compile(file_get_contents($pathTheme));
                        }

                        if($content != ""){
                            $contentHead = "/";
                            $contentHead .= str_repeat('*', 78);
                            $contentHead .= "\\\n";

                            $contentHead .= "|";
                            $contentHead .= str_repeat('*', floor(((78 - strlen($theme)) / 2) - 1));
                            $contentHead .= " $theme ";
                            $contentHead .= str_repeat('*', ceil(((78 - strlen($theme)) / 2) - 1));
                            $contentHead .= "|\n";

                            $contentHead .= "\\";
                            $contentHead .= str_repeat('*', 78);
                            $contentHead .= "/\n";


                            $concatTheme .= $contentHead.$content;
                            $concatTheme .= "\n\n\n\n\n\n";
                        }
                    }
                } catch(\Exception $e){
                    $errs[$theme] = $e->getMessage();
                }
            }

            $less->setFormatter("compressed");
            $concatTheme = $less->compile($concatTheme);
            $ret = file_put_contents($themeInfos["absfile"], $concatTheme) !== FALSE;

            $date = new \DateTime();
            \ithoughts\tooltip_glossary\Backbone::get_instance()->set_option("custom_styles_path", $themeInfos["urlfile"]."?t=".$date->getTimestamp());

            return array(
                "valid" => $ret,
                "errors" => $errs
            );
        }

        /**
	 * Return comon infos about custom themes, like the absolute directory for subthemes, the absolute path for the custom theme's CSS file, and the URL to the themes file.
	 * @return string[] An associative array with infos. ["absdir"] returns the absolute path to the themes dir. ["absfile"] returns the absolute path to the concatenated themes file. ["urlfile"] returns the URL to the concatenated themes file.
	 * @author Gerkin
	 */
        public function get_custom_theme_infos(){
            $wp_upload = wp_upload_dir();
            $dir = "/ithoughts_tooltip_glossary";
            $file = "custom_themes.css";
            $components = "components";
            return array(
                "absdir"	=> $wp_upload["basedir"].$dir."/".$components,
                "absfile"	=> $wp_upload["basedir"].$dir."/".$file,
                "urlfile"	=> $wp_upload["baseurl"].$dir."/".$file
            );
        }

        /**
	 * Get the list of available themes. Since v2.4, it also display a list of custom themes
	 * @author Gerkin
	 * @param  boolean [$disableDefaults = false] Returns default text with attributes configured to be displayed as disabled in the dropdown
	 * @return Array[] Themes formated for being injected in {@link Toolbox::generate_input_select}
	 */
        private function get_themes($disableNonEditable = false){
            $themeInfos = $this->get_custom_theme_infos();
            $opts = array(
                'cream'     => __('Cream', 'ithoughts-tooltip-glossary' ), 
                'dark'      => __('Dark', 'ithoughts-tooltip-glossary' ), 
                'green'     => __('Green', 'ithoughts-tooltip-glossary' ), 
                'light'     => __('Light', 'ithoughts-tooltip-glossary' ), 
                'red'       => __('Red', 'ithoughts-tooltip-glossary' ), 
                'blue'      => __('Blue', 'ithoughts-tooltip-glossary' ),
                'plain'     => __('Plain', 'ithoughts-tooltip-glossary' ),
                'bootstrap' => __('Bootstrap', 'ithoughts-tooltip-glossary' ),
                'youtube'   => __('YouTube', 'ithoughts-tooltip-glossary' ),
                'tipsy'     => __('Tipsy', 'ithoughts-tooltip-glossary' ),
            );
            if($disableNonEditable){
                foreach($opts as $opt => $label){
                    $opts[$opt] = array(
                        "text" => $label,
                        "attributes" => array(
                            "disabled" => "disabled"
                        )
                    );
                }
            }
            if(!file_exists ($themeInfos["absdir"]))
                $ret &= mkdir($themeInfos["absdir"], 0755, true);


            try{
                $themes = @scandir($themeInfos["absdir"]);
            } catch(Exception $e){
                $themes = false;
            }
            if($themes === false){
                $themes = array();
?><div class="notice notice-error"><p><?php _e("Could not read the custom themes directory. Please check if the Web user is allowed to read and write to <code>wp-content/uploads/ithoughts_tooltip_glossary</code>", "ithoughts-tooltip-glossary"); ?></p></div><?php
            }

            foreach($themes as $theme){
                $pathTheme = $themeInfos["absdir"]."/".$theme;
                if(is_file($pathTheme)){
                    $themeName = preg_replace("/^(.+)(?:\\.(?:c|le)ss)$/", "$1", $theme);
                    if($disableNonEditable){
                        if(preg_match("/\\.less$/",$theme)){
                            $opts[$themeName] = array(
                                "text" => $themeName,
                            );
                        } else {
                            $opts[$themeName] = array(
                                "text" => $themeName,
                                //"attributes" => array( "disabled" => "disabled" )
                            );
                        }
                    } else {
                        $opts[$themeName] = array(
                            "text" => $themeName,
                        );
                    }
                }
            }
            return $opts;
        }
    }

    /**
     * Escapes the content to be used as TinyMCE pseudo-encoded string
     * @author Gerkin
     * @param  string  $str    The string to encode/decode
     * @param  boolean $encode Are we encoding? Decoding if false
     * @return string  Encoded/decoded string
     */
    function innerAttr($str, $encode){
        if($encode){
            return str_replace(
                array('"','\n'),
                array("&aquot;","<br/>"),
                $str
            );
        }else{
            return str_replace(
                array('&aquot;',"\\'", '\\"', '\\\\'),
                array('"', "'", '"', '\\'),
                $str
            );
        }
    }
}