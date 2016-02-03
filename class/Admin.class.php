<?php
 /**
  * @copyright 2015-2016 iThoughts Informatique
  * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
  */

namespace ithoughts\tooltip_glossary;


class Admin extends \ithoughts\Singleton{
	private $currentVersion;
	private $updater;

	public function __construct() {
		//Trigger version change function ?
		add_action( 'admin_init',								array(&$this,	'setVersion') );
		add_action( 'admin_init',								array(&$this,	'ajaxHooks') );

		add_action( 'admin_menu',								array(&$this,	'get_menu') );

		add_filter( 'mce_buttons',								array(&$this,	"ithoughts_tt_gl_tinymce_register_buttons") );

		add_filter( "mce_external_plugins",						array(&$this,	"ithoughts_tt_gl_tinymce_add_buttons") );

		add_filter( 'mce_external_languages',					array(&$this,	'tinymce_add_translations') );

		add_action( 'admin_init',								array(&$this,	'register_scripts_and_styles')	);

		add_action( 'admin_enqueue_scripts',					array(&$this,	'enqueue_scripts_and_styles')		);
	}
	public function getOptions(){
		return parent::$options;
	}
	public function setVersion(){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
		try{
			$plugindata = get_plugin_data( $backbone->get_base_path() . '/ithoughts_tooltip_glossary.php' );
			if( $plugindata && is_array($plugindata) && $plugindata['Version'] ){
				$this->currentVersion = $plugindata['Version'];
			} else {
				throw new \Exception("unreadable_plugin_error");
			}
			if( $this->isUnderVersionned() || (isset($_POST) && isset($_POST["data"]) && isset($_POST["data"]["versions"])) ){
				require_once($backbone->get_base_class_path() . "/Updater.class.php");
				$this->updater = new Updater($backbone->get_option('version'), $this->currentVersion, $this);
				if(Updater::requiresUpdate($backbone->get_option('version'), $this->currentVersion)){
					$this->updater->addAdminNotice();
				} else {
					$backbone->set_options(array('version',$this->currentVersion));
				}
			}
		} catch(Exception $e){
			add_action( 'admin_notices', array(&$this,'unreadable_plugin_error') );
		}
	}
	public function unreadable_plugin_error(){
?>
<div class="error form-invalid">
	<p><?php _e( "Can't read plugin version", "my_textdomain" ); ?></p>
</div>
<?php
											 }
	public function ajaxHooks(){
		add_action( 'wp_ajax_ithoughts_tt_gl_get_tinymce_tooltip_form',	array(&$this, 'getTinyMCETooltipFormAjax') );
		add_action( 'wp_ajax_ithoughts_tt_gl_get_customizing_form',		array(&$this, 'getCustomizingFormAjax') );
		add_action( 'wp_ajax_ithoughts_tt_gl_update_options',			array(&$this, 'update_options') );
	}
	public function register_scripts_and_styles(){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
		wp_register_script(
			'ithoughts-simple-ajax',
			$backbone->get_base_url() . '/submodules/iThoughts-WordPress-Plugins-Toolbox/js/simple-ajax-form'.$backbone->get_minify().'.js',
			array('jquery-form',"ithoughts_aliases"),
			"2.3.1"
		);
		wp_register_script(
			'ithoughts_tooltip_glossary-admin',
			$backbone->get_base_url() . '/js/ithoughts_tooltip_glossary-admin'.$backbone->get_minify().'.js',
			array('qtip',"ithoughts_aliases"),
			"2.3.1"
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
			array("jquery", "ithoughts_tooltip_glossary-utils","ithoughts_aliases"),
			"2.3.1"
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
			'ithoughts_tooltip_glossary-styleeditor',
			$backbone->get_base_url() . '/js/ithoughts_tooltip_glossary-styleeditor'.$backbone->get_minify().'.js',
			array('ithoughts_tooltip_glossary-gradx', 'ithoughts_tooltip_glossary-colorpicker', 'wp-color-picker-alpha',"ithoughts_aliases"),
			"2.3.1"
		);
		wp_register_script(
			'ithoughts_tooltip_glossary-updater',
			$backbone->get_base_url() . '/js/ithoughts_tt_gl-updater'.$backbone->get_minify().'.js',
			array("jquery","ithoughts_aliases"),
			"2.3.1"
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

		wp_register_style( "ithoughts_tooltip_glossary-tinymce_form",	$backbone->get_base_url() . '/css/ithoughts_tooltip_glossary-tinymce-forms'.$backbone->get_minify().'.css', null, "2.1.7");
		wp_register_style( 'ithoughts_tooltip_glossary-colorpicker',	$backbone->get_base_url() . '/ext/gradx/colorpicker/colorpicker.css', null, null );
		wp_register_style( 'ithoughts_tooltip_glossary-gradx',			$backbone->get_base_url() . '/ext/gradx/gradX.css', null, null );
		wp_register_style( 'ithoughts_tooltip_glossary-admin',			$backbone->get_base_url() . '/css/ithoughts_tooltip_glossary-admin'.$backbone->get_minify().'.css', null, "2.2.3" );
	}
	public function enqueue_scripts_and_styles(){
		wp_enqueue_style( 'ithoughts_tooltip_glossary-admin');
	}
	public function ithoughts_tt_gl_tinymce_register_buttons( $buttons ) {
		array_push( $buttons, 'glossaryterm', 'glossarylist' );
		return $buttons;
	}
	public function ithoughts_tt_gl_tinymce_add_buttons( $plugin_array ) {
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
	public function tinymce_add_translations($locales){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
		$locales ['ithoughts_tt_gl_tinymce'] = $backbone->get_base_lang_path() . '/ithoughts_tt_gl_tinymce_lang.php';
		return $locales;
	}
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
			array(
				'parent_slug'   => 'ithought-tooltip-glossary',
				'page_title'    => __( 'Options', 'ithoughts-tooltip-glossary' ),
				'menu_title'    => __( 'Options', 'ithoughts-tooltip-glossary' ),
				'capability'    => 'manage_options',
				'menu_slug'     => 'ithought-tooltip-glossary',
				'function'      => array($this, 'options'),
			),

			// Post Type :: Add New Post
			array(
				'parent_slug'   => 'ithought-tooltip-glossary',
				'page_title'    => __('Add a Term', 'ithoughts-tooltip-glossary' ),
				'menu_title'    => __('Add a Term', 'ithoughts-tooltip-glossary' ),
				'capability'    => 'edit_others_posts',
				'menu_slug'     => 'post-new.php?post_type=glossary',
				'function'      => null,// Doesn't need a callback function.
			),

			// Post Type :: View All Posts
			array(
				'parent_slug'   => 'ithought-tooltip-glossary',
				'page_title'    => __('Glossary Terms', 'ithoughts-tooltip-glossary' ),
				'menu_title'    => __('Glossary Terms', 'ithoughts-tooltip-glossary' ),
				'capability'    => 'edit_others_posts',
				'menu_slug'     => 'edit.php?post_type=glossary',
				'function'      => null,// Doesn't need a callback function.
			),

			// Taxonomy :: Manage News Categories
			array(
				'parent_slug'   => 'ithought-tooltip-glossary',
				'page_title'    => __('Glossary Groups', 'ithoughts-tooltip-glossary' ),
				'menu_title'    => __('Glossary Groups', 'ithoughts-tooltip-glossary' ),
				'capability'    => 'manage_categories',
				'menu_slug'     => 'edit-tags.php?taxonomy=glossary_group&post_type=glossary',
				'function'      => null,// Doesn't need a callback function.
			),
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

	public function isUnderVersionned(){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
		$currentVersion;

		if(get_option("ithoughts_tt_gl_vesion_check") == false && $backbone->get_option('version') == "-1")
			return false;
		$version_diff = version_compare( $backbone->get_option('version'), $this->currentVersion );
		return $version_diff == -1;
	}

	public function options(){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
		
		wp_enqueue_script('ithoughts_tooltip_glossary-qtip');
		wp_enqueue_style('ithoughts_tooltip_glossary-css');
		wp_enqueue_style('ithoughts_tooltip_glossary-qtip-css');
		wp_enqueue_script( 'ithoughts-simple-ajax' );

		$ajax         = admin_url( 'admin-ajax.php' );
		$options      = $backbone->get_options();

		//Preview required resources
		wp_enqueue_script( 'ithoughts_tooltip_glossary-qtip' );
		wp_enqueue_script( 'ithoughts_tooltip_glossary-admin' );

		wp_enqueue_style( 'ithoughts_tooltip_glossary-css' );
		wp_enqueue_style( 'ithoughts_tooltip_glossary-qtip-css' );



		/* Add required scripts for WordPress Spoilers (AKA PostBox) */
		wp_enqueue_script('postbox');
		wp_enqueue_script('post');


		/* Add required resources for wpColorPicker */
		wp_enqueue_script( 'ithoughts_tooltip_glossary-styleeditor');
		wp_enqueue_style( 'ithoughts_tooltip_glossary-colorpicker' );

		wp_enqueue_style( 'wp-color-picker');
		wp_enqueue_style( 'ithoughts_tooltip_glossary-gradx' );



		$optionsInputs = array(
			"termlinkopt" => \ithoughts\Toolbox::generate_input_select(
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
			"staticterms" => \ithoughts\Toolbox::generate_input_check(
				"staticterms",
				array(
					"radio" => false,
					"selected" => $options["staticterms"],
					"options" => array(
						"enabled" => array(
							"attributes" => array(
								"id" => "staticterms"
							)
						)
					)
				)
			),
			"forceloadresources" => \ithoughts\Toolbox::generate_input_check(
				"forceloadresources",
				array(
					"radio" => false,
					"selected" => $options["forceloadresources"],
					"options" => array(
						"enabled" => array()
					)
				)
			),
			"termtype" => \ithoughts\Toolbox::generate_input_text(
				"termtype",
				array(
					"type" => "text",
					"value" => $options["termtype"]
				)
			),
			"grouptype" => \ithoughts\Toolbox::generate_input_text(
				"grouptype",
				array(
					"type" => "text",
					"value" => $options["grouptype"]
				)
			),
			"termcontent" => \ithoughts\Toolbox::generate_input_select(
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
			"qtipstyle" => \ithoughts\Toolbox::generate_input_select(
				'qtipstyle',
				array(
					'selected' => $options["qtipstyle"],
					'options'  => array(
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
					),
				)
			),
			"qtiptrigger" => \ithoughts\Toolbox::generate_input_select(
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
			"qtipshadow" => \ithoughts\Toolbox::generate_input_check(
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
			"qtiprounded" => \ithoughts\Toolbox::generate_input_check(
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
		);

		$optionsInputs["qtipstylecustom"] = \ithoughts\Toolbox::generate_input_text(
			"qtipstylecustom",
			array(
				"type" => "text",
				"value" => (strpos($optionsInputs["qtipstyle"], 'selected="selected"') === false) ? $options["qtipstyle"] : ""
			)
		);
		require($backbone->get_base_path() . "/templates/options.php");
	}

	public function update_options(){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
		$glossary_options = $backbone->get_options();

		$postValues = $_POST;
		$postValues['qtipshadow']  = \ithoughts\Toolbox::checkbox_to_bool($postValues,'qtipshadow',  "enabled");
		$postValues['qtiprounded'] = \ithoughts\Toolbox::checkbox_to_bool($postValues,'qtiprounded', "enabled");
		$postValues['staticterms'] = \ithoughts\Toolbox::checkbox_to_bool($postValues,'staticterms', "enabled");
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
			$data["mediatip_content"] = \ithoughts\Toolbox::decode_json_attr($data["mediatip_content_json"]);
			$data["mediatip_content_json"] = str_replace('\\"', '&quot;', $data["mediatip_content_json"]);
			$data["mediatip_caption"] = innerAttr(isset($data["mediatip_caption"]) ? $data["mediatip_caption"] : "", false);
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
			$args= array(
				"post_type"     => "glossary",
				'post_status'   => 'publish',
				'orderby'       => 'title',
				'order'         => 'ASC',
				'posts_per_page'   => 25,
				's'             => $data['term_search'],
			);
		} else {
			$args= array(
				"post_type"     => "glossary",
				'post_status'   => 'publish',
				'orderby'       => 'title',
				'order'         => 'ASC',
				'posts_per_page'   => 25,
				'post__in'      => array($data["glossary_id"]),
			);
		}
		$query = new \WP_Query($args);
		if ( $query->have_posts() ) {
			global $post;
			if($data["glossary_id"] == NULL){
				$datas = array();
				// Start looping over the query results.
				while ( $query->have_posts() ) {
					$query->the_post();
					$datas[] = array(
						"slug"      => $post->post_name,
						"content"   => wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
						"title"     => $post->post_title,
						"id"        => $post->ID
					);
				}
				$form_data['terms'] = $datas;
			} else {
				$query->the_post();
				$data["term_title"] = $post->post_title;
				$datas[] = array(
					"slug"      => $post->post_name,
					"content"   => wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
					"title"     => $post->post_title,
					"id"        => $post->ID
				);
			}
		}
		wp_localize_script( "ithoughts_tooltip_glossary-tinymce_form", "ithoughts_tt_gl_tinymce_form", $form_data );


		$mediatipdropdown = \ithoughts\Toolbox::generate_input_select(
			'mediatip_type',
			array(
				'selected' => $data["mediatip_type"],
				'options'  => $mediatiptypes,
				"attributes" => array(
					"class"    => "modeswitcher"
				)
			)
		);

		ob_start();
		include $backbone->get_base_path()."/templates/tinymce-tooltip-form.php";

		wp_reset_postdata();

		$output = ob_get_clean();
		echo $output;
		wp_die();
	}
	public function getCustomizingFormAjax(){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
		$prefixs = array("g", "t", "c"); // Used in style editor loop

		wp_enqueue_script('wp-color-picker-alpha');
		wp_enqueue_script('ithoughts_tooltip_glossary-gradx-dom');
		wp_enqueue_script('ithoughts_tooltip_glossary-colorpicker');
		wp_enqueue_script('ithoughts_tooltip_glossary-gradx');
		/* Add required scripts for WordPress Spoilers (AKA PostBox) */
		wp_enqueue_script('postbox');
		wp_enqueue_script('post');
		ob_start();
		require $backbone->get_base_path()."/templates/customizing_form.php";
		$output = ob_get_clean();
		wp_die($output);
	}
}

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