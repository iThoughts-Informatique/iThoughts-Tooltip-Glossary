<?php

class ithoughts_tt_gl_Shortcodes_mediatip Extends ithoughts_tt_gl{
    
    public static $options;

    public function __construct() {
        // Shortcode
        add_shortcode( "mediatip", array(&$this, "mediatip") );

        // Help functions..
        add_action( 'wp_insert_post_data',  array(&$this, 'parse_pseudo_links_to_shortcode'));
        add_action( 'edit_post',  array(&$this, 'convert_shortcodes'));
    }

    public function parse_pseudo_links_to_shortcode( $data ){
        $data['post_content'] = preg_replace('/<a\s+?data-tooltip-content=\\\\"(.+?)\\\\".*>(.*?)<\/a>/', '[tooltip content="$1"]$2[/tooltip]', $data['post_content']);
        return $data;
    }

    public function convert_shortcodes($post_id){
        $post = get_post($post_id);
        $post->post_content = preg_replace('/\[tooltip(.*?)(?: content="(.+?)")(.*?)\](.+?)\[\/tooltip\]/', '<a data-tooltip-content="$2" $1 $3>$4</a>', $post->post_content);
        return $post;
    }

    /** */
    public function mediatip( $atts, $text='' ){
        global $wpdb, $tcb_ithoughts_tt_gl_scripts, $ithoughts_tt_gl_tooltip_count, $post, $ithoughts_tt_gl_doing_shortcode;
        $ithoughts_tt_gl_tooltip_count++;

        // Get iThoughts Tooltip Glossary options
        $opts = get_option( 'ithoughts_tt_gl', array() );

        // JS data to pass through to jQuery libraries
        $jsdata = array();

        // Let shortcode attributes override general settings
        foreach( $opts as $k => $v ):
        if( isset($atts[$k]) ):
        $jsdata[] = 'data-' . $k . '="' . trim( esc_attr($atts[$k]) ) . '"';
        $opts[$k] = trim( $atts[$k] );
        endif;
        endforeach;
        $tooltip_option   = isset($opts['tooltips'])    ? $opts['tooltips']    : 'excerpt';
        $qtipstyle        = isset($opts['qtipstyle'])   ? $opts['qtipstyle']   : 'cream';
        $linkopt          = isset($opts['termlinkopt']) ? $opts['termlinkopt'] : 'standard';
        $termusage        = isset($opts['termusage'] )  ? $opts['termusage']   : 'on';

        extract( shortcode_atts( array(
            'imageid' => '',
            'image' => '',
            'link' => '',
        ), $atts) );

        /*
        // Set text to default to content. This allows syntax like: [glossary]Cheddar[/glossary]
        if( empty($content) ) $content = $text;*/

        $tcb_ithoughts_tt_gl_scripts = true;

        // qtip jquery data
        $jsdata[] = 'data-mediatip-image="' . str_replace('"', '\\"', $image) . '"';
        $jsdata[] = 'data-qtipstyle="' . $qtipstyle . '"';

        $linkElement   = '<a href="' . $link . '" title="' . esc_attr($text) . '">' . $text . '</a>';
        // Span that qtip finds
        $span = '<span class="ithoughts_tt_gl-mediatip" '.implode(' ',$jsdata).'>' . $linkElement . '</span>';

        return $span;
    }
}
