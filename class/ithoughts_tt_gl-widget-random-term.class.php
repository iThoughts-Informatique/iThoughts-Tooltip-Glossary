<?php
class ithoughts_tt_gl_RandomTerm extends WP_Widget {
    public static $options;

    public function __construct() {
        self::$options = get_option( 'ithoughts_tt_gl' );
        self::$options["termtype"] = is_string(self::$options["termtype"]) ? self::$options["termtype"] : "glossary";
        parent::__construct(
            'ithoughts_tt_gl-random-term',
            __('Random Term From Glossary', 'ithoughts_tooltip_glossary'),
            array( 
                'classname'   => 'ithoughts_tt_gl_widget_random_term',
                'description' => __('Add a random glossary term to your sidebar', 'ithoughts_tooltip_glossary'),
            )
        ); // parent::__construct
    } // __construct

    // Admin form
    public function form( $instance=array() ) {
        $instance =  wp_parse_args( $instance, array(
            'title' => __('Random Glossary term', 'ithoughts_tooltip_glossary'),
            'group' => '',
        ) );

        // Title
        echo '<p><label for="' . $this->get_field_id('title') . '">' . __('Title', 'ithoughts_tooltip_glossary') . ' </label>';
        echo '<input class="widefat" id="' . $this->get_field_id('title') . '" name="' . $this->get_field_name('title') . '" type="text" value="' . esc_attr( $instance['title'] ) . '" />';
        echo '</p>';

        // Group
        $groupsraw = get_terms( 'glossary_group', array('hide_empty'=>false) );
        $groups    = array();
        foreach( $groupsraw as $group ){
            if(isset($group->slug) && isset($group->name)){
                $groups[$group->slug] = $group->name; 
            }
        }

        $groupdd = ithoughts_tt_gl_build_dropdown_multilevel( $this->get_field_id('group'), array(
            'selected'    => $instance['group'],
            'options'     => $groups,
            'name'        => $this->get_field_name('group'),
            'allow_blank' => __('Any', 'ithoughts_tooltip_glossary')
        ) );
        echo '<p><label for="' . $this->get_field_id('group') . '"> ' . __('Group', 'ithoughts_tooltip_glossary'). ' </label>';
        echo $groupdd . '</p>';

        // Display
        $displaydd = ithoughts_tt_gl_build_dropdown_multilevel( $this->get_field_id('display'), array(
            'selected'   => $instance['display'],
            'name'       => $this->get_field_name('display'),
            'options'    => array( 
                'title'   =>__('Title Only', 'ithoughts_tooltip_glossary'), 
                'excerpt' =>__('Excerpt',    'ithoughts_tooltip_glossary'), 
                'full'    =>__('Full',       'ithoughts_tooltip_glossary'),
            ),
        ) );
        echo '<p><label for="' . $this->get_field_id('display') . '"> ' . __('Display', 'ithoughts_tooltip_glossary'). ' </label>';
        echo $displaydd . '</p>';
    } // form

    public function update( $new_instance, $old_instance ) {
        $instance            = $old_instance;
        $instance['title']   = strip_tags( $new_instance['title'] );
        $instance['group']   = $new_instance['group'];
        $instance['display'] = $new_instance['display'];

        return $instance;
    } // update

    public function widget( $args, $instance ) {
        extract( $args );
        $title = apply_filters( 'widget_title', $instance['title'] );

        echo $before_widget;
        if( !empty($title) ):
        echo $before_title . $title . $after_title;
        endif;

        $numberposts = isset($instance['numberposts']) ? $instance['numberposts'] : 1;

        $termargs = array(
            'post_type'   => self::$options["termtype"],
            'post_status' => 'publish',
            'numberposts' => $numberposts,
            'orderby'     => 'rand',
        );
        if( $group = $instance['group'] ):
        $termargs['tax_query'] = array( array(
            'taxonomy' => 'glossary_group',
            'field'    => 'slug',
            'terms'    => $group
        ) );
        endif;

        $terms = get_posts( $termargs );
        if( $terms && count($terms) ):
        echo '<ul class="ithoughts_tt_gl widget-list">';
        foreach( $terms as $term ): setup_postdata( $term );
        $title   = '<a href="' . apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($term->ID) ) . '">' . get_the_title($term->ID) . '</a>';
        $desc    = '';
        $display = $instance['display'];
        if( $display && $display != 'title' ):
        $desc = $display == 'full' ? apply_filters('the_content',get_the_content(),$main=false) : wpautop(get_the_excerpt());
        $desc = '<br>' . $desc;
        endif;
        echo '<li>' . $title . $desc . '</li>';
        endforeach; wp_reset_postdata();
        echo '</ul>';
        else :
        echo '<em>' . __('No terms available', 'ithoughts_tooltip_glossary') . '</em>';
        endif;

        echo $after_widget;
    } //widget

} // ithoughts_tt_gl_RandomTerm
