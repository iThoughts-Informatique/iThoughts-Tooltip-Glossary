<?php
/**
 * ithoughts-tooltip-glossary Admin
 */
class ithoughts_tt_gl_Admin{
    static $base;
    static $base_url;

    public function __construct( $plugin_base ) {
        self::$base     = $plugin_base . '/class';
        self::$base_url = plugins_url( '', dirname(__FILE__) );


        add_action( 'admin_menu',                 array(&$this, 'get_menu') );

        add_action( 'wp_ajax_ithoughts_tt_gl_update_options', array(&$this, 'update_options') );

        add_action( 'admin_head',                 array(&$this, 'add_tinymce_dropdown_hooks') );

        add_action( 'admin_init',                 array(&$this, 'setup_localixed_dropdown_values') );

    }

    static function base() {
        return self::$base;
    }
    static function base_url() {
        return self::$base_url;
    }




    public function add_tinymce_dropdown_hooks(){/**/
        add_filter( "mce_external_plugins", array(&$this, "ithoughts_tt_gl_tinymce_add_buttons") );
        add_filter( 'mce_buttons', array(&$this, "ithoughts_tt_gl_tinymce_register_buttons") );
        add_filter( 'mce_external_languages', array(&$this, 'tinymce_add_translations') );
    }
    public function ithoughts_tt_gl_tinymce_register_buttons( $buttons ) {
        array_push( $buttons, 'glossaryterm', 'glossarylist' );
        return $buttons;
    }
    public function ithoughts_tt_gl_tinymce_add_buttons( $plugin_array ) {
        $plugin_array['ithoughts_tt_gl_tinymce'] = self::$base_url . '/js/ithoughts_tt_gl-tinymce.js';
        return $plugin_array;
    }/*/}/**/
    public function tinymce_add_translations($locales){
        $locales ['ithoughts_tt_gl_tinymce'] = self::$base . '/../lang/ithoughts_tt_gl_tinymce_lang.php';
        return $locales;
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

        wp_localize_script( 'jquery', 'ithoughts_tt_gl', array(
            'tinymce_dropdown' => $glossaryterms,
            'admin_ajax' => admin_url('admin-ajax.php'),
        ) );
    }


    public function get_menu(){
        $menu = add_menu_page("iThoughts Tooltip Glossary", "Tooltip Glossary", "edit_others_posts", "ithought-tooltip-glossary", null, self::$base_url."/js/icon/icon.svg");

        $submenu_pages = array(
            // Options
            array(
                'parent_slug'   => 'ithought-tooltip-glossary',
                'page_title'    => __( 'Options', 'ithoughts_tooltip_glossary' ),
                'menu_title'    => __( 'Options', 'ithoughts_tooltip_glossary' ),
                'capability'    => 'manage_options',
                'menu_slug'     => 'ithought-tooltip-glossary',
                'function'      => array($this, 'options'),
            ),

            // Post Type :: Add New Post
            array(
                'parent_slug'   => 'ithought-tooltip-glossary',
                'page_title'    => __('Add a Term', 'ithoughts_tooltip_glossary' ),
                'menu_title'    => __('Add a Term', 'ithoughts_tooltip_glossary' ),
                'capability'    => 'edit_others_posts',
                'menu_slug'     => 'post-new.php?post_type=glossary',
                'function'      => null,// Doesn't need a callback function.
            ),

            // Post Type :: View All Posts
            array(
                'parent_slug'   => 'ithought-tooltip-glossary',
                'page_title'    => __('Glossary Terms', 'ithoughts_tooltip_glossary' ),
                'menu_title'    => __('Glossary Terms', 'ithoughts_tooltip_glossary' ),
                'capability'    => 'edit_others_posts',
                'menu_slug'     => 'edit.php?post_type=glossary',
                'function'      => null,// Doesn't need a callback function.
            ),

            // Taxonomy :: Manage News Categories
            array(
                'parent_slug'   => 'ithought-tooltip-glossary',
                'page_title'    => __('Glossary Groups', 'ithoughts_tooltip_glossary' ),
                'menu_title'    => __('Glossary Groups', 'ithoughts_tooltip_glossary' ),
                'capability'    => 'manage_categories',
                'menu_slug'     => 'edit-tags.php?taxonomy=glossary_group&post_type=glossary',
                'function'      => null,// Doesn't need a callback function.
            ),


        );

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

    public function options(){
        $ajax         = admin_url( 'admin-ajax.php' );
        $options      = get_option( 'ithoughts_tt_gl', array() );
        $tooltips     = isset( $options['tooltips'] )     ? $options['tooltips']     : 'excerpt';
        $alphaarchive = isset( $options['alphaarchive'] ) ? $options['alphaarchive'] : 'standard';
        $termtype     = isset( $options['termtype'] )     ? $options['termtype']     : 'glossary';
        $qtipstyle    = isset( $options['qtipstyle'] )    ? $options['qtipstyle']    : 'cream';
        $termlinkopt  = isset( $options['termlinkopt'] )  ? $options['termlinkopt']  : 'standard';
        $termusage    = isset( $options['termusage'] )    ? $options['termusage']    : 'on';
        $qtiptrigger  = isset( $options['qtiptrigger'] )  ? $options['qtiptrigger']  : 'hover';
        $qtipshadow   = isset( $options['qtipshadow'] )   ? $options['qtipshadow']   : true;
        $qtiprounded  = isset( $options['qtiprounded'] )  ? $options['qtiprounded']  : true;



        //Preview required resources
        wp_enqueue_script('imagesloaded', $this->base_url() . '/ext/imagesloaded.min.js', null, false, true);
        wp_enqueue_script('qtip', $this->base_url() . '/ext/jquery.qtip.js', array('jquery', 'imagesloaded'), false, true);
        wp_register_script( 'ithoughts-tooltip-glossary-qtip',  $this->base_url() . '/js/ithoughts_tooltip_glossary-qtip2.js', array('qtip') );
        wp_localize_script( 'ithoughts-tooltip-glossary-qtip', 'ithoughts_tt_gl', array(
            'admin_ajax'    => admin_url('admin-ajax.php'),
            'qtipstyle'     => $qtipstyle,
            'qtiptrigger'   => $qtiptrigger,
            'qtipshadow'    => $qtipshadow,
            'qtiprounded'   => $qtiprounded
        ) );
        wp_print_scripts( 'ithoughts-tooltip-glossary-qtip' );
        wp_register_script( 'ithoughts-tooltip-glossary-admin',  $this->base_url() . '/js/ithoughts_tooltip_glossary-admin.js', array('qtip') );
        wp_localize_script( 'ithoughts-tooltip-glossary-admin', 'ithoughts_tt_gl_admin', array(
        ) );
        wp_print_scripts( 'ithoughts-tooltip-glossary-admin' );
        if( file_exists(get_stylesheet_directory() . '/ithoughts_tooltip_glossary.css') ):
        wp_enqueue_style( 'ithoughts-tooltip-glossary-css', get_stylesheet_directory_uri() . '/ithoughts_tooltip_glossary.css' );
        else :
        wp_enqueue_style( 'ithoughts-tooltip-glossary-css', $this->base_url() . '/css/ithoughts_tooltip_glossary.css' );
        endif;
        wp_enqueue_style( 'ithoughts-tooltip-glossary-qtip-css', $this->base_url() . '/ext/jquery.qtip.css' );




        // Tooptip DD
        $ttddoptions = array(
            'full' => array(
                'title' => __('Full', 'ithoughts_tooltip_glossary'),
                'attrs' => array('title'=>__('Display full post content', 'ithoughts_tooltip_glossary'))
            ),
            'excerpt' => array(
                'title' => __('Excerpt', 'ithoughts_tooltip_glossary'),
                'attrs' => array('title'=>__('Display shorter excerpt content', 'ithoughts_tooltip_glossary'))
            ), 
            'off' => array(
                'title' => __('Off', 'ithoughts_tooltip_glossary'),
                'attrs' => array('title'=>__('Do not display tooltip at all', 'ithoughts_tooltip_glossary'))
            ),
        );
        $tooltipdropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'tooltips', array(
            'selected' => $tooltips,
            'options'  => $ttddoptions,
        ) );


        // qTipd syle options
        $qtipdropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'qtipstyle', array(
            'selected' => $qtipstyle,
            'options'  => array(
                'cream'     => __('Cream',      'ithoughts_tooltip_glossary'), 
                'dark'      => __('Dark',       'ithoughts_tooltip_glossary'), 
                'green'     => __('Green',      'ithoughts_tooltip_glossary'), 
                'light'     => __('Light',      'ithoughts_tooltip_glossary'), 
                'red'       => __('Red',        'ithoughts_tooltip_glossary'), 
                'blue'      => __('Blue',       'ithoughts_tooltip_glossary'),
                'plain'     => __('Plain',      'ithoughts_tooltip_glossary'),
                'bootstrap' => __('Bootstrap',  'ithoughts_tooltip_glossary'),
                'youtube'   => __('YouTube',    'ithoughts_tooltip_glossary'),
                'tipsy'     => __('Tipsy',      'ithoughts_tooltip_glossary'),
            ),
        ));

        $qtiptriggerdropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'qtiptrigger', array(
            'selected' => $qtiptrigger,
            'options'  => array(
                'hover' => array('title'=>__('Hover', 'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__('On mouseover (hover)', 'ithoughts_tooltip_glossary'))),
                'click' => array('title'=>__('Click', 'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__('On click',             'ithoughts_tooltip_glossary'))),
                'responsive' => array('title'=>__('Responsive', 'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__('Hover (on computer) and click (touch devices)',             'ithoughts_tooltip_glossary'))),
            ),
        ));

        // Term Link HREF target
        $termlinkoptdropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'termlinkopt', array(
            'selected' => $termlinkopt,
            'options'  => array(
                'standard' => array('title'=>__('Normal',  'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__('Normal link with no modifications', 'ithoughts_tooltip_glossary'))),
                'none'     => array('title'=>__('No link', 'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__("Don't link to term",                'ithoughts_tooltip_glossary'))),
                'blank'    => array('title'=>__('New tab', 'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__("Always open in a new tab",          'ithoughts_tooltip_glossary'))),
            ),
        ));

        // Term usage
        $termusagedd = ithoughts_tt_gl_build_dropdown_multilevel( 'termusage', array(
            'selected' => $termusage,
            'options'  => array(
                'on'  => __('On',  'ithoughts_tooltip_glossary'),
                'off' => __('Off', 'ithoughts_tooltip_glossary'),
            ),
        ) );

?>
<div class="wrap">
    <div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50">
        <div class="meta-box-inside admin-help">
            <div class="icon32" id="icon-options-general">
                <br>
            </div>
            <h2><?php _e('Options', 'ithoughts_tooltip_glossary'); ?></h2>
            <div id="dashboard-widgets-wrap">
                <div id="dashboard-widgets" class="metabox-holder">
                    <div c_lass="postbox-container">
                        <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                            <form action="<?php echo $ajax; ?>" method="post" class="simpleajaxform" data-target="update-response">

                                <div id="ithoughts_tt_gllossary_options_1" class="postbox">
                                    <h3 class="handle"><span><?php _e('Term Options', 'ithoughts_tooltip_glossary'); ?></span></h3>
                                    <div class="inside">
                                        <p><?php _e('Term link', 'ithoughts_tooltip_glossary'); echo ":&nbsp;"; echo "{$termlinkoptdropdown}" ?></p>
                                        <p><?php _e('Base Permalink', 'ithoughts_tooltip_glossary'); echo ":&nbsp;"; ?><input type="text" value="<?php echo $termtype; ?>" name="termtype"/></p>
                                    </div>
                                </div>

                                <div id="ithoughts_tt_gllossary_options_2" class="" style="display:flex;flex-direction:row;flex-wrap:wrap;">
                                    <div style="flex:1 1 auto;" class="postbox">
                                        <h3 class="handle"><span><?php _e('qTip2 Tooltip Options', 'ithoughts_tooltip_glossary'); ?></span></h3>
                                        <div class="inside">
                                            <p><?php _e('iThoughts Tooltip Glossary uses the jQuery based <a href="http://qtip2.com/">qTip2</a> library for tooltips', 'ithoughts_tooltip_glossary'); ?></p>
                                            <p><?php _e('Tooltip Content', 'ithoughts_tooltip_glossary'); echo " ("; _e('Only for glossary terms', 'ithoughts_tooltip_glossary'); echo ")"; echo ":&nbsp;{$tooltipdropdown}" ?></p>
                                            <p><?php _e('Tooltip activation', 'ithoughts_tooltip_glossary');  echo ":&nbsp;{$qtiptriggerdropdown}" ?></p>
                                            <p><?php _e('Tooltip Style (qTip)', 'ithoughts_tooltip_glossary');  echo ":&nbsp;{$qtipdropdown}" ?></p>
                                            <p><?php _e('Tooltip shadow', 'ithoughts_tooltip_glossary');  echo ":&nbsp;<input type=\"checkbox\" name=\"qtipshadow\" id=\"qtipshadow\" value=\"enabled\"".($qtipshadow ? " checked" : "")."/>" ?></p>
                                            <p><?php _e('Rounded corners', 'ithoughts_tooltip_glossary');  echo ":&nbsp;<input type=\"checkbox\" name=\"qtiprounded\" id=\"qtiprounded\" value=\"enabled\"".($qtiprounded ? " checked" : "")."/>" ?></p>
                                        </div>
                                    </div>
                                    <div style="flex:0 0 20px;"></div>
                                    <div style="flex:1 1 auto;" class="postbox">
                                        <h3 class="handle"><span><?php _e('Preview', 'ithoughts_tooltip_glossary'); ?></span></h3>
                                        <div class="inside">
                                            <p style="float:left">
                                                <span class="ithoughts_tt_gl-tooltip" data-tooltip-nosolo="true" data-tooltip-id="exampleActivate" data-tooltip-content="<?php echo rawurlencode(__('The <b>tooltip</b> or <b>infotip</b> or a <b>hint</b> is a common <a href="/wiki/Graphical_user_interface" title="Graphical user interface">graphical user interface</a> element. It is used in conjunction with a <a href="/wiki/Cursor_(computers)" title="Cursor (computers)" class="mw-redirect">cursor</a>, usually a <a href="/wiki/Pointer_(graphical_user_interfaces)" title="Pointer (graphical user interfaces)">pointer</a>. The user hovers the pointer over an item, without clicking it, and a tooltip may appear—a small "<a href="/wiki/Hoverbox" title="Hoverbox">hover box</a>" with information about the item being hovered over.<sup id="cite_ref-1" class="reference"><a href="#cite_note-1"><span>[</span>1<span>]</span></a></sup> <sup id="cite_ref-2" class="reference"><a href="#cite_note-2"><span>[</span>2<span>]</span></a></sup>Tooltips do not usually appear on <a href="/wiki/Mobile_operating_system" title="Mobile operating system">mobile operating systems</a>, because there is no cursor (though tooltips may be displayed when using a <a href="/wiki/Mouse_(computing)" title="Mouse (computing)">mouse</a>).', 'ithoughts_tooltip_glossary')); ?>"><a href="javascript:void(0)" title=""><?php _e('Activate me', 'ithoughts_tooltip_glossary'); ?></a></span>
                                            </p>
                                            <p style="float:right">
                                                <span class="ithoughts_tt_gl-tooltip" data-tooltip-autoshow="true" data-tooltip-id="exampleStyle" data-tooltip-nosolo="true" data-tooltip-nohide="true" data-tooltip-content="<?php _e('This is an example tooltip, with content such as <a>a tag for link</a>, <em>em tag for emphasis</em>, <b>b tag for bold</b> and <i>i tag for italic</i>', 'ithoughts_tooltip_glossary'); ?>"><a href="javascript:void(0)" title=""><?php _e('Example Tooltip', 'ithoughts_tooltip_glossary'); ?></a></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                <div id="ithoughts_tt_gllossary_options_3" class="postbox">
                                    <h3 class="handle"><span><?php _e('Experimental Options', 'ithoughts_tooltip_glossary'); ?></span></h3>
                                    <div class="inside">
                                        <p><?php _e('Do not rely on these at all, I am experimenting with them', 'ithoughts_tooltip_glossary'); ?></p>
                                        <p><?php _e('Term usage listing', 'ithoughts_tooltip_glossary');  echo ":&nbsp;{$termusagedd}" ?></p>
                                    </div>
                                </div>
                                <p>
                                    <input type="hidden" name="action" value="ithoughts_tt_gl_update_options"/>
                                    <input type="submit" name="submit" class="alignleft button-primary" value="<?php _e('Update Options', 'ithoughts_tooltip_glossary'); ?>"/>
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
            'qtipshadow'   => false,
            'qtiprounded'  => false
        );

        $glossary_options = get_option( 'ithoughts_tt_gl', $defaults );

        $glossary_options_old = $glossary_options;
        foreach( $defaults as $key => $default ){
            $value                  = $_POST[$key] ? $_POST[$key] : $default;
            $glossary_options[$key] = $value;
        }

        $glossary_options['qtipshadow']  = ithoughts_tt_gl_toggleable_to_bool($glossary_options['qtipshadow'],  "enabled");
        $glossary_options['qtiprounded'] = ithoughts_tt_gl_toggleable_to_bool($glossary_options['qtiprounded'], "enabled");

        $outtxt = "";


        if($glossary_options_old["termtype"] != $glossary_options["termtype"]){
            $glossary_options["needflush"] = true;
            flush_rewrite_rules(false);
            $outtxt .= "<p>" . __( 'Rewrite rule flushed', 'ithoughts_tooltip_glossary' ) . "</p>";
        }
        update_option( 'ithoughts_tt_gl', $glossary_options );

        $outtxt .='<p>' . __('Options updated', 'ithoughts_tooltip_glossary') . '</p>' ;
        die( $outtxt );
    }
}
