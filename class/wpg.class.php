<?php
/**
 * WP-Glossary Core Class
 */
//require_once( dirname(__FILE__).'/wpg-post_typs.class.php' );

class WPG{
	public static $base;
	public static $base_url;

 	function __construct( $plugin_base ) {
		self::$base     = $plugin_base . '/class';
		self::$base_url = plugins_url( '', dirname(__FILE__) );

		add_action( 'plugins_loaded', array($this, 'localisation') );
		$this->register_post_types();
		$this->register_taxonmies();
		$this->add_shortcodes();
		add_action( 'init',                  array($this, 'register_scripts_and_styles') );
		add_action( 'wp_footer',             array($this, 'wp_footer')                   );
		add_action( 'wp_enqueue_scripts',    array($this, 'wp_enqueue_scripts')          );
		add_action( 'admin_enqueue_scripts', array($this, 'admin_enqueue_scripts')       );
		add_action( 'admin_init',            array($this, 'wpg_vesion_check')            );
		add_action( 'pre_get_posts',         array($this, 'order_core_archive_list')     );
	}

	static function base() {
		return self::$base;
	}
	static function base_url() {
		return self::$base_url;
	}

	public function localisation(){
		load_plugin_textdomain( WPG_TEXTDOMAIN, false, self::$base . '/lang/' );
	}

	private function register_post_types(){
		require_once( $this->base() . '/wpg-post-types.class.php' );
		new WPG_Post_Types();
	}

	public function register_taxonmies(){
		require_once( $this->base() . '/wpg-taxonomies.class.php' );
		new WPG_Taxonomies();
	}
	
	private function add_shortcodes(){
		require_once( $this->base() . '/wpg-shortcode-glossary.class.php' );
		new WPG_Shortcodes();
		require_once( $this->base() . '/wpg-shortcode-glossary-atoz.class.php' );
		new WPG_Shortcode_ATOZ();
		require_once( $this->base() . '/wpg-shortcode-glossary-list.class.php' );
		new WPG_Shortcode_TERMLIST();
	}

	public function register_scripts_and_styles(){
		wp_register_script( 'jquery-tooltip',  $this->base_url() . '/js/jquery.tools.min.js', array('jquery') );
		wp_register_script( 'wp-glossary-js',  $this->base_url() . '/js/wp-glossary.js',      array('jquery-tooltip') );
 		wp_register_script( 'simple-ajax',     $this->base_url() . '/js/simple-ajax-form.js', array('jquery-form') );
	}

	public function wp_footer(){
		global $tcb_wpg_scripts;
		if( !$tcb_wpg_scripts ) return;

		wp_print_scripts( 'wp-glossary-js' );
	}

	public function wp_enqueue_scripts(){
		wp_enqueue_style( 'wp-glossary-css', $this->base_url() . '/css/wp-glossary.css' );
	}

	public function admin_enqueue_scripts(){
		wp_enqueue_script( 'simple-ajax' );
	}

	public function wpg_vesion_check(){
		$plugin          = get_plugin_data( __FILE__ );
		$in_file_version = $plugin->Version;
		$optionkey       = 'wpg_vesion_check';
		$in_db_version   = get_option( $optionkey, 0 );

		$version_diff = version_compare( $in_db_version, $in_file_version );
		if( !$version_diff )
			return; // No change

 		flush_rewrite_rules();
		do_action( 'wpg_version_check', $in_file_version, $in_db_version );
 		update_option( $optionkey, $in_file_version );
	}

	public function order_core_archive_list( $query ){
		if( is_post_type_archive('glossary') ):
			$glossary_options = get_option( 'wp_glossary' );
			$archive          = $glossary_options['alphaarchive'] ? $glossary_options['alphaarchive'] : 'standard';
			if( $archive == 'alphabet' ):
				$query->set( 'orderby', 'title' );
				$query->set( 'order',   'ASC' );
				return;
			endif;
		endif;
	}
}
