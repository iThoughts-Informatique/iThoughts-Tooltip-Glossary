<?php

class ithoughts_tt_gl_RandomTerm extends WP_Widget{
	public function __construct() {
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
			'numberposts' => 1
		) );

		// Title
		echo '<p><label for="' . $this->get_field_id('title') . '">' . __('Title', 'ithoughts_tooltip_glossary') . ' </label>';
		echo '<input autocomplete="off" class="widefat" id="' . $this->get_field_id('title') . '" name="' . $this->get_field_name('title') . '" type="text" value="' . esc_attr( $instance['title'] ) . '" />';
		echo '</p>';

		// Group
		$groupsraw = get_terms( 'glossary_group', array('hide_empty'=>false) );
		$groups    = array();
		foreach( $groupsraw as $group ){
			if(isset($group->slug) && isset($group->name)){
				$groups[$group->slug] = $group->name; 
			}
		}

		$groupdd = ithoughts_toolbox::generate_input_select(
			$this->get_field_id('group'),
			array(
				'selected'    => $instance['group'],
				'options'     => $groups,
				'name'        => $this->get_field_name('group'),
				'allow_blank' => __('Any', 'ithoughts_tooltip_glossary')
			)
		);
		echo '<p><label for="' . $this->get_field_id('group') . '">' . __('Group', 'ithoughts_tooltip_glossary'). '</label>';
		echo $groupdd . '</p>';

		// Display
		$displaydd = ithoughts_toolbox::generate_input_select( $this->get_field_id('display'), array(
			'selected'   => isset($instance['display']) ? $instance['display'] : "tooltip",
			'name'       => $this->get_field_name('display'),
			'options'    => array( 
				'title'   =>__('Title Only',        'ithoughts_tooltip_glossary'), 
				'excerpt' =>__('Excerpt',           'ithoughts_tooltip_glossary'), 
				'full'    =>__('Full',              'ithoughts_tooltip_glossary'),
				'tooltip' =>_x('Glossary Tooltip', 'Random Widget Tooltip', 'ithoughts_tooltip_glossary'),
			),
		) );
		echo '<p><label for="' . $this->get_field_id('display') . '"> ' . __('Display', 'ithoughts_tooltip_glossary'). ' </label>';
		echo $displaydd . '</p>';


		// Count
		echo '<p><label for="' . $this->get_field_id('numberposts') . '">' . __('Number of terms', 'ithoughts_tooltip_glossary'). '</label><input autocomplete="off" type="number" value="' . $instance['numberposts'] . '" min="1" name="' . $this->get_field_name("numberposts") . '" id="' . $this->get_field_id('numberposts') . '"/></p>';
	} // form

	public function update( $new_instance, $old_instance ) {
		$instance            = $old_instance;
		$instance['title']   = strip_tags( $new_instance['title'] );
		$instance['group']   = $new_instance['group'];
		$instance['display'] = $new_instance['display'];
		$instance['numberposts'] = $new_instance['numberposts'];

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
			'post_type'   => "glossary",
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
		$numItems = count($terms);
		if( $terms && $numItems ){
			ithoughts_tt_gl_interface::getiThoughtsTooltipGlossary()->addScript(array("qtip" => true));
			echo '<ul class="ithoughts_tt_gl widget-list">';
			$i = 0;
			foreach( $terms as $term ){
				$jsdata = array();
				$content;
				$display = $instance['display'];
				switch($display){
					case "title":{
						$content = '<article><h4><a href="' . apply_filters( 'ithoughts_tt_gl_term_link', get_permalink($term) ) . '">' . $term->post_title . '</a></h4></article>';
					} break;
					case "full":{
						$content = '<article><h4><a href="' . apply_filters( 'ithoughts_tt_gl_term_link', get_permalink($term) ) . '">' . $term->post_title . '</a></h4>';
						$content .= '<p>' . $term->post_content . "</p></article>";
					} break;
					case "excerpt":{
						$content = '<article><h4><a href="' . apply_filters( 'ithoughts_tt_gl_term_link', get_permalink($term) ) . '">' . $term->post_title . '</a></h4>';
						$content .= '<p>' . apply_filters("ithoughts_tt_gl-term-excerpt",$term)."</p></article>";
					} break;
					case "tooltip":{



						$options = ithoughts_tt_gl_interface::getiThoughtsTooltipGlossary()->getOptions();
						$content = apply_filters("ithoughts_tt_gl_get_glossary_term_element", $term);/*
						if($options['staticterms']){
							$jsdata[] = 'data-term-title="' . esc_attr($term->post_title) .  '"';
							$content;
							switch( $options['termcontent'] ){
								case 'full':{
									$content = $term->post_content;
								}break;

								case 'excerpt':{
									$content = apply_filters("ithoughts_tt_gl-term-excerpt", $post);
								}break;

								case 'off':{
									$content = "";
								}break;
							}
							$content = str_replace("\n", "<br>", str_replace('"', '&quot;',$content));
							$jsdata[] = 'data-term-content="' . esc_attr($content) . '"';
						} else {
							$jsdata[] = 'data-termid="' . $term->ID . '"';
							$jsdata[] = 'data-content="' . $options['termcontent'] . '"';
						}

						$link   = '<a href="' . apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($term->ID) ) . '" target="_blank" title="' . esc_attr(get_the_title($term->ID)) . '">' . get_the_title($term->ID) . '</a>';
						$content = '<span class="ithoughts_tooltip_glossary-glossary" '.implode(' ',$jsdata).'>' . $link . '</span>';
*/


						//$content = '<a href="' . apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($term->ID) ) . '">' . get_the_title($term->ID) . '</a>';
					} break;
				}
				if($display === "excerpt" || $display === "full"){
					if(++$i !== $numItems) {
						$content .= "</br>";
					}
				}
				echo '<li>' . $content . '</li>';
			}
			echo '</ul>';
		} else {
			echo '<em>' . __('No terms available', 'ithoughts_tooltip_glossary') . '</em>';
		}

		echo $after_widget;
	} //widget

} // ithoughts_tt_gl_RandomTerm
