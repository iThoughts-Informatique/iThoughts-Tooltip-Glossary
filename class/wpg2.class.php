<?php
/**
 * wp-glossary-2 Core Class
 */
//require_once( dirname(__FILE__).'/wpg2-post_typs.class.php' );

class wpg2{
    public static $base;
    public static $base_lang;
    public static $base_url;
    public static $options;

    function __construct( $plugin_base ) {
        self::$base     = $plugin_base . '/class';
        self::$base_url = plugins_url( '', dirname(__FILE__) );
        self::$options = get_option( 'wp_glossary_2' );
        self::$options["termtype"] = is_string(self::$options["termtype"]) ? self::$options["termtype"] : "glossary";
        self::$options["singletype"] = is_string(self::$options["singletype"]) ? self::$options["singletype"] : "single";
        self::$options["archivetype"] = is_string(self::$options["archivetype"]) ? self::$options["archivetype"] : "archive";

        add_action( 'plugins_loaded', array($this, 'localisation') );
        $this->register_post_types();
        $this->register_taxonmies();
        $this->add_shortcodes();
        $this->add_widgets();
        add_action( 'init',                  array(&$this, 'register_scripts_and_styles') );
        add_action( 'wp_footer',             array(&$this, 'wp_footer')                   );
        add_action( 'wp_enqueue_scripts',    array(&$this, 'wp_enqueue_scripts')          );
        add_action( 'admin_enqueue_scripts', array(&$this, 'admin_enqueue_scripts')       );
        add_action( 'admin_init',            array(&$this, 'wpg2_vesion_check')            );
        add_action( 'pre_get_posts',         array(&$this, 'order_core_archive_list')     );

        add_filter( 'wpg2_term_link',         array(&$this, 'wpg2_term_link')               );
    }

    static function base() {
        return self::$base;
    }
    static function base_url() {
        return self::$base_url;
    }

    public function localisation(){
        load_plugin_textdomain( 'wp-glossary-2', false, 'wp-glossary-2' . '/lang/' );
    }

    private function register_post_types(){
        require_once( $this->base() . '/wpg2-post-types.class.php' );
        new wpg2_Post_Types();
    }

    public function register_taxonmies(){
        require_once( $this->base() . '/wpg2-taxonomies.class.php' );
        new wpg2_Taxonomies();
    }

    private function add_shortcodes(){
        require_once( $this->base() . '/wpg2-shortcode-glossary.class.php' );
        new wpg2_Shortcodes();
        require_once( $this->base() . '/wpg2-shortcode-glossary-atoz.class.php' );
        new wpg2_Shortcode_ATOZ();
        require_once( $this->base() . '/wpg2-shortcode-glossary-list.class.php' );
        new wpg2_Shortcode_TERMLIST();
    }

    private function add_widgets(){
        require_once( $this->base() . '/wpg2-widget-random-term.class.php' );
        add_action( 'widgets_init', array($this, 'widgets_init') );
    }

    public function widgets_init(){
        register_widget( 'wpg2_RandomTerm' );
    }

    public function register_scripts_and_styles(){
        $options     = get_option( 'wp_glossary_2', array() );

        $qtipstyle   = isset( $options['qtipstyle'] )   ? $options['qtipstyle']:   'cream';
        $qtiptrigger = isset( $options['qtiptrigger'] ) ? $options['qtiptrigger']: 'hover';
        //wp_register_script( 'jquery-tooltip',  $this->base_url() . '/ext/qtip.js', array('jquery') );
        wp_register_script( 'jquery-tooltip',  $this->base_url() . '/ext/jquery.qtip.js',        array('jquery') );
        wp_register_script( 'wp-glossary-2-qtip',  $this->base_url() . '/js/wp-glossary-2-qtip2.js', array('jquery-tooltip') );
        wp_register_script( 'wp-glossary-2-atoz',  $this->base_url() . '/js/wp-glossary-2-atoz.js',  array('jquery') );
        // qTip localisation settings
        wp_localize_script( 'wp-glossary-2-qtip', 'wpg2', array(
            'admin_ajax'  => admin_url('admin-ajax.php'),
            'qtipstyle'   => $qtipstyle,
            'qtiptrigger' => $qtiptrigger,
        ) );

        wp_register_script( 'simple-ajax', $this->base_url() . '/js/simple-ajax-form.js', array('jquery-form') );
        //wp_register_script( 'simple-ajax',     $this->base_url() . '/js/jquery-simple-ajax-form.js', array('jquery-form') );
    }

    public function wp_footer(){
        global $tcb_wpg2_scripts;
        if( !$tcb_wpg2_scripts ) return;

        wp_print_scripts( 'wp-glossary-2-qtip' );
        wp_print_scripts( 'wp-glossary-2-atoz' );
    }

    public function wp_enqueue_scripts(){
        if( file_exists(get_stylesheet_directory() . '/wp-glossary-2.css') ):
        wp_enqueue_style( 'wp-glossary-2-css', get_stylesheet_directory_uri() . '/wp-glossary-2.css' );
        else :
        wp_enqueue_style( 'wp-glossary-2-css', $this->base_url() . '/css/wp-glossary-2.css' );
        endif;
        wp_enqueue_style( 'wp-glossary-2-qtip-css', $this->base_url() . '/ext/jquery.qtip.css' );
    }

    public function admin_enqueue_scripts(){
        wp_enqueue_style( 'wp-glossary-2-admin', $this->base_url() . '/css/wp-glossary-2-admin.css' );
        wp_enqueue_script( 'simple-ajax' );
    }

    public function wpg2_vesion_check(){
        $plugin = get_plugin_data( dirname(dirname(__FILE__)) . '/wp-glossary-2.php' );
        if( $plugin && is_array($plugin) && $plugin['Version'] ):
        $in_file_version = $plugin['Version'];
        $optionkey       = 'wpg2_vesion_check';
        $in_db_version   = get_option( $optionkey, 0 );

        $version_diff = version_compare( $in_db_version, $in_file_version );
        if( !$version_diff )
            return; // No change

        flush_rewrite_rules( $hard=true );
        do_action( 'wpg2_version_check', $in_file_version, $in_db_version );
        update_option( $optionkey, $in_file_version );
        endif;
    }

    /**
	 * Order post and taxonomy archives alphabetically
	 */
    public function order_core_archive_list( $query ){
        if( is_post_type_archive("glossary") || is_tax('wpg2lossarygroup') ):
        $glossary_options = get_option( 'wp_glossary_2' );
        $archive          = $glossary_options['alphaarchive'] ? $glossary_options['alphaarchive'] : 'standard';
        if( $archive == 'alphabet' ):
        $query->set( 'orderby', 'title' );
        $query->set( 'order',   'ASC' );
        return;
        endif;
        endif;
    }

    /** 
	 * Translation support
	 */
    public function wpg2_term_link( $url ){
        // qTranslate plugin
        if( function_exists('qtrans_convertURL') ):
        $url = qtrans_convertURL( $url );
        endif;

        return $url;
    }
}
