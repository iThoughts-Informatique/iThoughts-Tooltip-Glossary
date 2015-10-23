<?php
class ithoughts_tt_gl_Shortcode_TERMLIST Extends ithoughts_tt_gl{
    public function __construct() {
        add_shortcode( 'glossary_term_list', array($this, 'glossary_term_list') );
    }

    public function glossary_term_list( $atts, $content='' ){
        global $post;
        $default = array(
            'alpha' => false,
            'group' => false,
            'cols'  => false,
            'desc'  => false,
        );
        extract( shortcode_atts($default, $atts) );

        $statii = array( 'publish' );
        if( current_user_can('read_private_posts') ){
            $statii[] = 'private';
        }

        $args = array(
            'post_type'           => "glossary",
            'posts_per_page'      => '-1',
            'orderby'             => 'title',
            'order'               => 'ASC',
            'ignore_sticky_posts' => 1,
            'post_status'         => $statii,
        );

        // Restrict list to specific glossary group or groups
        if( $group ){
            $tax_query = array(
                'taxonomy' => 'ithoughts_tt_gllossarygroup',
                'field'    => 'slug',
                'terms'    => $group,
            );
            $args['tax_query'] = array( $tax_query );
        }

        $jsdata = array(); // Not used yet

        $glossary_options = get_option( 'ithoughts_tt_gl', array() );
        foreach( $glossary_options as $k => $v ){
            if( isset($atts[$k]) ){
                $jsdata[] = 'data-' . $k . '="' . trim( esc_attr($atts[$k]) ) . '"';
                $glossary_options[$k] = trim( $atts[$k] );
            }
        }
        $tooltip_option   = isset($glossary_options['tooltips'])    ? $glossary_options['tooltips']    : 'excerpt';
        $qtipstyle        = isset($glossary_options['qtipstyle'])   ? $glossary_options['qtipstyle']   : 'cream';
        $linkopt          = isset($glossary_options['termlinkopt']) ? $glossary_options['termlinkopt'] : 'standard';
        $termusage        = isset($glossary_options['termusage'] )  ? $glossary_options['termusage']   : 'on';

        $list       = '<p>' . __( 'There are no glossary items.', 'ithoughts-tooltip-glossary') . '</p>';
        $glossaries = get_posts( $args );
        if( !count($glossaries) )
            return $list;

        // Sanity check the list of letters (if set by user).
        $alphas = array();
        if( $alpha ) {
            $alpha_list = array_map( 'trim', explode(',', $alpha) );
            foreach( $alpha_list as $alpha_item ) {
                $alpha = strtolower( mb_substr($alpha_item, 0, 1, 'UTF-8') );
                if( $alpha && (is_numeric($alpha) || ctype_lower($alpha)) )
                    $alphas[] = $alpha;
            } //alpha_list
        }
        $alphas = array_unique( $alphas );

        // Go through all glossaries, and restrict to alpha list if supplied.
        foreach( $glossaries as $post ) {
            setup_postdata( $post );
            $title      = get_the_title();
            $titlealpha = strtolower( mb_substr($title, 0, 1, 'UTF-8') );
            if( count($alphas) && !in_array($titlealpha, $alphas) )
                continue;

            $href  = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($post->ID) );
            $link  = $title;
            if( $linkopt != 'none' ){
                $target = ($linkopt == 'blank') ? 'target="_blank"' : '';
                $link   = '<a href="' . $href . '" title="" alt="' . esc_attr($title) . '" ' . $target .'>' . $title . '</a>';
            }
            if( $desc ){
                $content = ($desc == 'excerpt') ? get_the_excerpt() : apply_filters('the_content', get_the_content());	
                $content = '<span class="glossary-item-desc">' . $content . '</span>';
            }
            $item  = '<li class="glossary-item">';
            $item .= $link . '<br>' . $content;
            $item .= '</li>';
            $alphalist[$titlealpha][] = $item;
        } // glossaries
        // Default to the alphabetical order in the get_post args
        if( empty($alphas) ){
            $alphas = array_keys( $alphalist );
        }

        // Pass through list again, building HTML list
        $termlist = array();
        foreach( $alphas as $letter ){
            if( isset($alphalist[$letter]) ){ 
                foreach( $alphalist[$letter] as $item ){
                    $termlist[] = $item;
                }
            }
        } 
        wp_reset_postdata();

        if( $cols === false ){
            $cols = count( $termlist ); // set col size to all items
        }
        $termlist = array_chunk( $termlist, $cols );

        $return = '<span class="glossary-list-details">';
        foreach( $termlist as $col => $items ){
            $return .= '<ul class="glossary-list">';
            $return .= implode( '', $items );
            $return .= '</ul>';
        }
        $return .= '</ul>';

        return $return;
    } // glossary_term_list
} // ithoughts_tt_gl_Shortcode_TERMLIST
