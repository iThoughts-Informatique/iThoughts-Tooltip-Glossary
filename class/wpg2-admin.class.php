<?php
/**
 * wp-glossary-2 Admin
 */
class wpg2_Admin{
    static $base;
    static $base_url;

    public function __construct( $plugin_base ) {
        self::$base     = $plugin_base . '/class';
        self::$base_url = plugins_url( '', dirname(__FILE__) );


        add_action( 'admin_menu',                 array(&$this, 'options_submenu') );

        add_action( 'wp_ajax_wpg2_update_options', array(&$this, 'update_options') );

        add_action( 'admin_head',                 array(&$this, 'add_tinymce_dropdown_hooks') );

        add_action( 'admin_init',                 array(&$this, 'setup_localixed_dropdown_values') );

    }

    static function base() {
        return self::$base;
    }
    static function base_url() {
        return self::$base_url;
    }

    public function add_tinymce_dropdown_hooks() {
        add_filter( 'mce_external_plugins', array(&$this, 'tinymce_add_dropdown_plugin') );
        add_filter( 'mce_buttons',          array(&$this, 'tinymce_add_dropdown_button') );
    }
    public function tinymce_add_dropdown_plugin( $plugin_array ){
        $plugin_array['wpg2lossary'] = $this->base_url() . '/js/tinymce-wpg2lossary-dropdown.js';
        return $plugin_array;
    }
    public function tinymce_add_dropdown_button( $buttons ){
        array_push( $buttons, 'wpg2lossary' );
        return $buttons;
    }

    public function setup_localixed_dropdown_values(){
        $args = array(
            'post_type'   => 'glossary',
            'numberposts' => -1,
            'post_status' => 'publish',
            'orderby'     => 'title',
            'order'       => 'ASC',
        );
        $glossaryposts = get_posts( $args );
        $glossaryterms = array();
        foreach( $glossaryposts as $glossary ):
        $glossaryterms[$glossary->post_title] = "[glossary id='{$glossary->ID}' slug='{$glossary->post_name}' /]";
        endforeach;

        wp_localize_script( 'jquery', 'wpg2', array(
            'tinymce_dropdown' => $glossaryterms,
        ) );
    }


    public function options_submenu(){
        $slug             = 'glossary';
        // Add menu page (capture page for adding admin style and javascript
        $glossary_options = add_submenu_page( 
            "edit.php?post_type=$slug", 
            __( 'Glossary Options', 'wp-glossary-2' ), 
            __( 'Glossary Options', 'wp-glossary-2' ), 
            'manage_options', 
            'glossary-options', 
            array($this, 'options')
        );
    }

    public function options(){
        $ajax         = admin_url( 'admin-ajax.php' );
        $options      = get_option( 'wp_glossary_2', array() );
        $tooltips     = isset( $options['tooltips'] )     ? $options['tooltips']     : 'excerpt';
        $alphaarchive = isset( $options['alphaarchive'] ) ? $options['alphaarchive'] : 'standard';
        $termtype     = isset( $options['termtype'] )     ? $options['termtype']     : 'glossary';
        $qtipstyle    = isset( $options['qtipstyle'] )    ? $options['qtipstyle']    : 'cream';
        $termlinkopt  = isset( $options['termlinkopt'] )  ? $options['termlinkopt']  : 'standard';
        $termusage    = isset( $options['termusage'] )    ? $options['termusage']    : 'on';
        $qtiptrigger  = isset( $options['qtiptrigger'] )  ? $options['qtiptrigger']  : 'hover';
        $singletemplate  = isset( $options['singletype'] )  ? $options['singletype']  : 'single';
        $archivetemplate  = isset( $options['archivetype'] )  ? $options['archivetype']  : 'archive';

        // Tooptip DD
        $ttddoptions = array(
            'full' => array(
                'title' => __('Full', 'wp-glossary-2'),
                'attrs' => array('title'=>__('Display full post content', 'wp-glossary-2'))
            ),
            'excerpt' => array(
                'title' => __('Excerpt', 'wp-glossary-2'),
                'attrs' => array('title'=>__('Display shorter excerpt content', 'wp-glossary-2'))
            ), 
            'off' => array(
                'title' => __('Off', 'wp-glossary-2'),
                'attrs' => array('title'=>__('Do not display tooltip at all', 'wp-glossary-2'))
            ),
        );
        $tooltipdropdown = wpg2_build_dropdown_multilevel( 'tooltips', array(
            'selected' => $tooltips,
            'options'  => $ttddoptions,
        ) );

        // Alpha Arrhive DD
        $aaddoptions = array(
            'alphabet' => array('title'=>__('Alphabetical', 'wp-glossary-2'), 'attrs'=>array('title'=>__('Display glossary archive alphabetically', 'wp-glossary-2'))),
            'standard' => array('title'=>__('Standard', 'wp-glossary-2'),     'attrs'=>array('title'=>__('No filtering, display as standard archive', 'wp-glossary-2'))),
        );
        $archivedropdown = wpg2_build_dropdown_multilevel( 'alphaarchive', array(
            'selected' => $alphaarchive,
            'options'  => $aaddoptions,
        ) );

        // qTipd syle options
        $qtipdropdown = wpg2_build_dropdown_multilevel( 'qtipstyle', array(
            'selected' => $qtipstyle,
            'options'  => array(
                'cream'     => __('Cream',      'wp-glossary-2'), 
                'dark'      => __('Dark',       'wp-glossary-2'), 
                'green'     => __('Green',      'wp-glossary-2'), 
                'light'     => __('Light',      'wp-glossary-2'), 
                'red'       => __('Red',        'wp-glossary-2'), 
                'blue'      => __('Blue',       'wp-glossary-2'),
                'plain'     => __('Plain',      'wp-glossary-2'),
                'bootstrap' => __('Bootstrap',  'wp-glossary-2'),
                'youtube'   => __('YouTube',    'wp-glossary-2'),
                'tipsy'     => __('Tipsy',      'wp-glossary-2'),
            ),
        ));

        $qtiptriggerdropdown = wpg2_build_dropdown_multilevel( 'qtiptrigger', array(
            'selected' => $qtiptrigger,
            'options'  => array(
                'hover' => array('title'=>__('Hover', 'wp-glossary-2'), 'attrs'=>array('title'=>__('On mouseover (hover)', 'wp-glossary-2'))),
                'click' => array('title'=>__('Click', 'wp-glossary-2'), 'attrs'=>array('title'=>__('On click',             'wp-glossary-2'))),
                'responsive' => array('title'=>__('Responsive', 'wp-glossary-2'), 'attrs'=>array('title'=>__('Hover (on computer) and click (touch devices)',             'wp-glossary-2'))),
            ),
        ));

        // Term Link HREF target
        $termlinkoptdropdown = wpg2_build_dropdown_multilevel( 'termlinkopt', array(
            'selected' => $termlinkopt,
            'options'  => array(
                'standard' => array('title'=>__('Normal',  'wp-glossary-2'), 'attrs'=>array('title'=>__('Normal link with no modifications', 'wp-glossary-2'))),
                'none'     => array('title'=>__('No link', 'wp-glossary-2'), 'attrs'=>array('title'=>__("Don't link to term",                'wp-glossary-2'))),
                'blank'    => array('title'=>__('New tab', 'wp-glossary-2'), 'attrs'=>array('title'=>__("Always open in a new tab",          'wp-glossary-2'))),
            ),
        ));

        // Term usage
        $termusagedd = wpg2_build_dropdown_multilevel( 'termusage', array(
            'selected' => $termusage,
            'options'  => array(
                'on'  => __('On',  'wp-glossary-2'),
                'off' => __('Off', 'wp-glossary-2'),
            ),
        ) );

        //Template glossary
        $archivetemplatedd = wpg2_build_dropdown_multilevel(
            'archivetype',
            array(
                "selected" => $archivetemplate,
                "options" => array(
                    "archive" => "Default archive template",
                    "With tile header" => array(
                        "type" => "optgroup",
                        "tilehead-tiles" => "Tiles"
                    )
                )
            )
        );

?>
<div class="wrap">
    <div id="wp-glossary-2-options" class="meta-box meta-box-50" style="width: 50%;">
        <div class="meta-box-inside admin-help">
            <div class="icon32" id="icon-options-general">
                <br>
            </div>
            <h2><?php _e('WP Glossary Options', 'wp-glossary-2'); ?></h2>
            <div id="dashboard-widgets-wrap">
                <div id="dashboard-widgets" class="metabox-holder">
                    <div class="postbox-container" style="width:98%">
                        <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                            <form action="<?php echo $ajax; ?>" method="post" class="simpleajaxform" data-target="update-response">

                                <div id="wpg2lossary_options_1" class="postbox">
                                    <h3 class="handle"><span>Term Options</span></h3>
                                    <div class="inside">
                                        <p><?php _e('Archive:', 'wp-glossary-2'); echo "&nbsp;"; echo "{$archivedropdown}" ?></p>
                                        <p><?php _e('Term link:', 'wp-glossary-2'); echo "&nbsp;"; echo "{$termlinkoptdropdown}" ?></p>
                                        <p><?php _e('Glossary URL:', 'wp-glossary-2'); echo "&nbsp;"; ?><input type="text" value="<?php echo $termtype; ?>" name="termtype"/></p>
                                        <p><?php _e('Glossary archive template:', 'wp-glossary-2'); echo "&nbsp;"; echo "{$archivetemplatedd}" ?></p>
                                    </div>
                                </div>

                                <div id="wpg2lossary_options_2" class="postbox">
                                    <h3 class="handle"><span>qTip2 Tooltip Options</span></h3>
                                    <div class="inside">
                                        <p>WP Glossary uses the jQuery based <a href="http://qtip2.com/">qTip2</a> library for tooltips</p>
                                        <p><?php _e('Tooltip Content:', 'wp-glossary-2'); echo "{$tooltipdropdown}" ?></p>
                                        <p><?php _e('Tooltip Style (qTip):', 'wp-glossary-2');  echo "{$qtipdropdown}" ?></p>
                                        <p><?php _e('Tooltip activation:', 'wp-glossary-2');  echo "{$qtiptriggerdropdown}" ?></p>
                                    </div>
                                </div>


                                <div id="wpg2lossary_options_3" class="postbox">
                                    <h3 class="handle"><span>Experimental Options</span></h3>
                                    <div class="inside">
                                        <p>Do not rely on these at all, I am experimenting with them</p>
                                        <p><?php _e('Term usage:', 'wp-glossary-2');  echo "{$termusagedd}" ?></p>
                                    </div>
                                </div>
                                <p>
                                    <input type="hidden" name="action" value="wpg2_update_options"/>
                                    <input type="submit" name="submit" class="alignleft button-primary" value="<?php _e('Update Glossary Options', 'wp-glossary-2'); ?>"/>
                                </p>

                            </form>
                            <div id="update-response" class="clear confweb-update"></div>
                        </div>
                    </div>
                </div>
                <?php
    }

    public function update_options(){
        $defaults = array(
            'tooltips'     => 'excerpt',
            'alphaarchive' => 'standard',
            'termtype'     => 'glossary',
            'qtipstyle'    => 'cream',
            'termlinkopt'  => 'standard',
            'termusage'    => 'on',
            'qtiptrigger'  => 'hover',
            'singletype' => 'single',
            'archivetype' => 'archive'
        );

        $glossary_options = get_option( 'wp_glossary_2', $defaults );

        $glossary_options_old = $glossary_options;
        foreach( $defaults as $key => $default ){
            $value                  = $_POST[$key] ? $_POST[$key] : $default;
            $glossary_options[$key] = $value;
        }

        $outtxt = "";


        if($glossary_options_old["termtype"] != $glossary_options["termtype"]){
            $glossary_options["needflush"] = true;
            flush_rewrite_rules(false);
            $outtxt .= "<p>" . __( 'Rewrite rule flushed', 'wp-glossary-2' ) . "</p>";
        }
        update_option( 'wp_glossary_2', $glossary_options );

        $outtxt .='<p>' . __('Glossary options updated', 'wp-glossary-2') . '</p>' ;
        die( $outtxt );
    }
}
