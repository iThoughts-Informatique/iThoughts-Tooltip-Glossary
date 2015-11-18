<?php
/**
 * ithoughts_tooltip_glossary Admin
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

        add_action( 'admin_init',                 array(&$this, 'setup_js_ithoughts_tt_gl') );

        add_filter( 'mce_buttons', array(&$this, "ithoughts_tt_gl_tinymce_register_buttons") );

        add_filter( "mce_external_plugins", array(&$this, "ithoughts_tt_gl_tinymce_add_buttons") );

        add_filter( 'mce_external_languages', array(&$this, 'tinymce_add_translations') );
    }

    static function base() {
        return self::$base;
    }
    static function base_url() {
        return self::$base_url;
    }




    public function add_tinymce_dropdown_hooks(){/**/
    }
    public function ithoughts_tt_gl_tinymce_register_buttons( $buttons ) {
        array_push( $buttons, 'glossaryterm', 'glossarylist' );
        return $buttons;
    }
    public function ithoughts_tt_gl_tinymce_add_buttons( $plugin_array ) {
        wp_enqueue_script("ithoughts_tooltip_glossary-utils", plugins_url( 'js/ithoughts_tooltip_glossary-utils.js', dirname(__FILE__) ), null, false);
        $plugin_array['ithoughts_tt_gl_tinymce'] = self::$base_url . '/js/ithoughts_tt_gl-tinymce.js?t=1447402034072';
        return $plugin_array;
    }/*/}/**/
    public function tinymce_add_translations($locales){
        $locales ['ithoughts_tt_gl_tinymce'] = self::$base . '/../lang/ithoughts_tt_gl_tinymce_lang.php';
        return $locales;
    }




    public function setup_js_ithoughts_tt_gl(){
        wp_localize_script( 'jquery', 'ithoughts_tt_gl', array(
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


    public function tinymce_tooltip_form(){
        echo "Hello";
    }

    public function options(){
        $ajax         = admin_url( 'admin-ajax.php' );
        $options      = get_option( 'ithoughts_tt_gl', array() );
        $tooltips     = isset( $options['tooltips'] )     ? $options['tooltips']     : 'excerpt';
        $alphaarchive = isset( $options['alphaarchive'] ) ? $options['alphaarchive'] : 'standard';
        $termtype     = isset( $options['termtype'] )     ? $options['termtype']     : 'glossary';
        $grouptype    = isset( $options["grouptype"] )    ? $options["grouptype"]    : "group";
        $qtipstyle    = isset( $options['qtipstyle'] )    ? $options['qtipstyle']    : 'cream';
        $termlinkopt  = isset( $options['termlinkopt'] )  ? $options['termlinkopt']  : 'standard';
        $termusage    = isset( $options['termusage'] )    ? $options['termusage']    : 'on';
        $qtiptrigger  = isset( $options['qtiptrigger'] )  ? $options['qtiptrigger']  : 'hover';
        $qtipshadow   = isset( $options['qtipshadow'] )   ? $options['qtipshadow']   : true;
        $qtiprounded  = isset( $options['qtiprounded'] )  ? $options['qtiprounded']  : true;



        //Preview required resources
        wp_enqueue_script('imagesloaded', $this->base_url() . '/ext/imagesloaded.min.js', null, false, true);
        wp_enqueue_script('qtip', $this->base_url() . '/ext/jquery.qtip.js', array('jquery', 'imagesloaded'), false, true);
        wp_register_script( 'ithoughts_tooltip_glossary-qtip',  $this->base_url() . '/js/ithoughts_tooltip_glossary-qtip2.js', array('qtip') );
        wp_localize_script( 'ithoughts_tooltip_glossary-qtip', 'ithoughts_tt_gl', array(
            'admin_ajax'    => admin_url('admin-ajax.php'),
            'qtipstyle'     => $qtipstyle,
            'qtiptrigger'   => $qtiptrigger,
            'qtipshadow'    => $qtipshadow,
            'qtiprounded'   => $qtiprounded
        ) );
        wp_enqueue_script( 'ithoughts_tooltip_glossary-qtip' );
        wp_enqueue_script( 'ithoughts_tooltip_glossary-admin',  $this->base_url() . '/js/ithoughts_tooltip_glossary-admin.js', array('qtip') );

        if( file_exists(get_stylesheet_directory() . '/ithoughts_tooltip_glossary.css') ):
        wp_enqueue_style( 'ithoughts_tooltip_glossary-css', get_stylesheet_directory_uri() . '/ithoughts_tooltip_glossary.css' );
        else :
        wp_enqueue_style( 'ithoughts_tooltip_glossary-css', $this->base_url() . '/css/ithoughts_tooltip_glossary.css' );
        endif;
        wp_enqueue_style( 'ithoughts_tooltip_glossary-qtip-css', $this->base_url() . '/ext/jquery.qtip.css' );


        /* Add required scripts for WordPress Spoilers (AKA PostBox) */
        wp_enqueue_script('postbox');
        wp_enqueue_script('post');



        /* Add required resources for wpColorPicker */
        wp_enqueue_style( 'wp-color-picker');
        wp_enqueue_script( 'wp-color-picker');
        wp_enqueue_script( 'wp-color-picker-alpha', $this->base_url() . '/ext/colorpicker-alpha.min.js', array( 'wp-color-picker' ), NULL, $in_footer );

        /* Gradx */
        wp_enqueue_script( 'ithoughts_tooltip_glossary-gradx-dom', $this->base_url() . '/ext/gradx/dom-drag.js', array('jquery') );
        wp_enqueue_script( 'ithoughts_tooltip_glossary-colorpicker', $this->base_url() . '/ext/gradx/colorpicker/colorpicker.min.js', array('jquery') );
        wp_enqueue_script( 'ithoughts_tooltip_glossary-gradx', $this->base_url() . '/ext/gradx/gradX.js', array('ithoughts_tooltip_glossary-gradx-dom', 'ithoughts_tooltip_glossary-colorpicker') );
        wp_enqueue_script( 'ithoughts_tooltip_glossary-styleeditor',  $this->base_url() . '/js/ithoughts_tooltip_glossary-styleeditor.js', array('ithoughts_tooltip_glossary-gradx', 'ithoughts_tooltip_glossary-colorpicker') );

        wp_enqueue_style( 'ithoughts_tooltip_glossary-colorpicker', $this->base_url() . '/ext/gradx/colorpicker/colorpicker.css' );
        wp_enqueue_style( 'ithoughts_tooltip_glossary-gradx', $this->base_url() . '/ext/gradx/gradX.css' );




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
    <div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50 metabox-holder">
        <div class="meta-box-inside admin-help">
            <div class="icon32" id="icon-options-general">
                <br>
            </div>
            <h2><?php _e('Options', 'ithoughts_tooltip_glossary'); ?></h2>
            <div id="dashboard-widgets-wrap">
                <div id="dashboard-widgets">
                    <div id="normal-sortables" class=""><!--Old removed classes: "meta-box-sortables ui-sortable"-->

                        <form action="<?php echo $ajax; ?>" method="post" class="simpleajaxform" data-target="update-response">

                            <div id="ithoughts_tt_gllossary_options_1" class="postbox">
                                <div class="handlediv" title="Cliquer pour inverser."><br></div><h3 class="hndle"><span><?php _e('Term Options', 'ithoughts_tooltip_glossary'); ?></span></h3>
                                <div class="inside">
                                    <table class="form-table">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    <label for="termlinkopt"><?php _e('Term link', 'ithoughts_tooltip_glossary'); ?>:</label>
                                                </th>
                                                <td>
                                                    <?php echo $termlinkoptdropdown ?>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <label for="termtype"><?php _e('Base Permalink', 'ithoughts_tooltip_glossary'); ?>:</label>
                                                </th>
                                                <td>
                                                    <code>/</code><input type="text" value="<?php echo $termtype; ?>" name="termtype" id="termtype"/><code>/</code>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <label for="grouptype"><?php _e('Taxonomy group prefix', 'ithoughts_tooltip_glossary'); ?>:</label>
                                                </th>
                                                <td>
                                                    <code>/<?php echo $termtype; ?>/</code><input type="text" value="<?php echo $grouptype; ?>" name="grouptype" id="grouptype"/><code>/</code>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="postbox" id="ithoughts_tt_gllossary_options_2">
                                <div class="handlediv" title="Cliquer pour inverser." onclick="window.refloat(this);"><br></div><h3 onclick="window.refloat(this);" class="hndle"><span><?php _e('qTip2 Tooltip Options', 'ithoughts_tooltip_glossary'); ?></span></h3>
                                <div class="inside">
                                    <div style="display:flex;flex-direction:row;flex-wrap:wrap;">
                                        <div style="flex:1 1 auto;">


                                            <p><?php _e('iThoughts Tooltip Glossary uses the jQuery based <a href="http://qtip2.com/">qTip2</a> library for tooltips', 'ithoughts_tooltip_glossary'); ?></p>
                                            <table class="form-table">
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <label for="tooltips"><?php _e('Tooltip Content', 'ithoughts_tooltip_glossary'); ?> (<?php _e('Only for glossary terms', 'ithoughts_tooltip_glossary'); ?>):</label>
                                                        </th>
                                                        <td>
                                                            <?php echo $tooltipdropdown ?>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>
                                                            <label for="qtiptrigger"><?php _e('Tooltip activation', 'ithoughts_tooltip_glossary'); ?>:</label>
                                                        </th>
                                                        <td>
                                                            <?php echo $qtiptriggerdropdown ?>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>
                                                            <label for="qtipstyle"><?php _e('Tooltip Style (qTip)', 'ithoughts_tooltip_glossary'); ?>:</label>
                                                        </th>
                                                        <td>
                                                            <?php echo $qtipdropdown ?>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>
                                                            <label for="qtipshadow"><?php _e('Tooltip shadow', 'ithoughts_tooltip_glossary'); ?>&nbsp;<span class="ithoughts_tt_gl-tooltip" data-tooltip-nosolo="true" data-tooltip-content="<?php echo rawurlencode(__('This option can be overriden by some tooltip styles.', 'ithoughts_tooltip_glossary')); ?>"><a href="javascript:void(0)">(<?php _e('infos', 'ithoughts_tooltip_glossary'); ?>)</a></span>:</label>
                                                        </th>
                                                        <td>
                                                            <input type="checkbox" name="qtipshadow" id="qtipshadow" value="enabled" <?php echo ($qtipshadow ? " checked" : ""); ?>/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>
                                                            <label for="qtiprounded"><?php _e('Rounded corners', 'ithoughts_tooltip_glossary'); ?>&nbsp;<span class="ithoughts_tt_gl-tooltip" data-tooltip-nosolo="true" data-tooltip-content="<?php echo rawurlencode(__('This option can be overriden by some tooltip styles.', 'ithoughts_tooltip_glossary')); ?>"><a href="javascript:void(0)">(<?php _e('infos', 'ithoughts_tooltip_glossary'); ?>)</a></span>:</label>
                                                        </th>
                                                        <td>
                                                            <input type="checkbox" name="qtiprounded" id="qtiprounded" value="enabled" <?php echo ($qtiprounded ? " checked" : ""); ?>/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>


                                            <div id="ithoughts_tt_gl-customstyle" class="postbox closed">
                                                <div class="handlediv" title="Cliquer pour inverser." onclick="window.refloat();"><br></div><h3 onclick="window.refloat();" class="hndle"><span><?php _e('Style editor', 'ithoughts_tooltip_glossary'); ?></span></h3>
                                                <div class="inside">
                                                    <p><?php _e('Use this editor to fully customize the look of your tooltips', 'ithoughts_tooltip_glossary'); ?></p>
                                                    <div class="ajaxContainer"></div>
                                                </div>
                                            </div>


                                        </div>
                                        <div style="flex:1 1 auto;;position:relative;">
                                            <div id="floater" style="display:flex;flex-direction:row;width:100%;">
                                                <!--<p style="flex:1 1 auto;text-align:center">
<span class="ithoughts_tt_gl-tooltip" data-tooltip-nosolo="true" data-tooltip-id="exampleActivate" data-tooltip-content="<?php echo rawurlencode(__('The <b>tooltip</b> or <b>infotip</b> or a <b>hint</b> is a common <a href="/wiki/Graphical_user_interface" title="Graphical user interface">graphical user interface</a> element. It is used in conjunction with a <a href="/wiki/Cursor_(computers)" title="Cursor (computers)" class="mw-redirect">cursor</a>, usually a <a href="/wiki/Pointer_(graphical_user_interfaces)" title="Pointer (graphical user interfaces)">pointer</a>. The user hovers the pointer over an item, without clicking it, and a tooltip may appear—a small "<a href="/wiki/Hoverbox" title="Hoverbox">hover box</a>" with information about the item being hovered over.<sup id="cite_ref-1" class="reference"><a href="#cite_note-1"><span>[</span>1<span>]</span></a></sup> <sup id="cite_ref-2" class="reference"><a href="#cite_note-2"><span>[</span>2<span>]</span></a></sup>Tooltips do not usually appear on <a href="/wiki/Mobile_operating_system" title="Mobile operating system">mobile operating systems</a>, because there is no cursor (though tooltips may be displayed when using a <a href="/wiki/Mouse_(computing)" title="Mouse (computing)">mouse</a>).', 'ithoughts_tooltip_glossary')); ?>"><a href="javascript:void(0)" title=""><?php _e('Activate me', 'ithoughts_tooltip_glossary'); ?></a></span>
</p>-->
                                                <p style="flex:1 1 auto;text-align:center">
                                                    <span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-autoshow="true" data-tooltip-id="exampleStyle" data-tooltip-nosolo="true" data-tooltip-nohide="true" data-tooltip-content="<?php _e('This is an example tooltip, with content such as <a>a tag for link</a>, <em>em tag for emphasis</em>, <b>b tag for bold</b> and <i>i tag for italic</i>', 'ithoughts_tooltip_glossary'); ?>"><a href="javascript:void(0)" title=""><?php _e('Example Tooltip', 'ithoughts_tooltip_glossary'); ?></a></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="ithoughts_tt_gllossary_options_3" class="postbox">
                                <div class="handlediv" title="Cliquer pour inverser."><br></div><h3 class="hndle"><span><?php _e('Experimental Options', 'ithoughts_tooltip_glossary'); ?></span></h3>
                                <div class="inside">
                                    <p><?php _e('Do not rely on these at all, I am experimenting with them', 'ithoughts_tooltip_glossary'); ?></p>
                                    <table class="form-table">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    <label for="termusage"><?php _e('Term usage listing', 'ithoughts_tooltip_glossary'); ?>:</label>
                                                </th>
                                                <td>
                                                    <?php echo $termusagedd ?>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
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
                <?php
    }

    public function update_options(){
        $reload = false;

        $defaults = array(
            'tooltips'     => 'excerpt',
            'alphaarchive' => 'standard',
            'termtype'     => 'glossary',
            'grouptype'    => 'group',
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
            $value                  = isset($_POST[$key]) ? $_POST[$key] : $default;
            $glossary_options[$key] = $value;
        }

        $glossary_options['qtipshadow']  = ithoughts_tt_gl_toggleable_to_bool($glossary_options['qtipshadow'],  "enabled");
        $glossary_options['qtiprounded'] = ithoughts_tt_gl_toggleable_to_bool($glossary_options['qtiprounded'], "enabled");

        $outtxt = "";
        $valid = true;

        $glossary_options["termtype"] = urlencode( $glossary_options["termtype"] );
        $glossary_options["grouptype"] = urlencode( $glossary_options["grouptype"] );

        if(strlen($glossary_options["termtype"]) < 1){
            $outtxt .= ('<p>' . __('Invalid input for', 'ithoughts_tooltip_glossary') . " \"" . __('Base Permalink', 'ithoughts_tooltip_glossary') . '"</p>') ;
            $valid = false;
        }
        if(strlen($glossary_options["grouptype"]) < 1){
            $outtxt .= ('<p>' . __('Invalid input for', 'ithoughts_tooltip_glossary') . " \"" . __('Taxonomy group prefix', 'ithoughts_tooltip_glossary') . '"</p>') ;
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
                $outtxt .= "<p>" . __( 'Rewrite rule flushed', 'ithoughts_tooltip_glossary' ) . "</p>";
            }
            update_option( 'ithoughts_tt_gl', $glossary_options );
            $outtxt .= ('<p>' . __('Options updated', 'ithoughts_tooltip_glossary') . '</p>') ;
        }

        die( json_encode(array(
            "reload" => $reload,
            "text" =>$outtxt,
            "valid" => $valid
        )));
    }
}
