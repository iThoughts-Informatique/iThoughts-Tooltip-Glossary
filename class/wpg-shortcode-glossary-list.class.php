<?php
class WPG_Shortcode_TERMLIST Extends WPG{
	function __construct() {
		add_shortcode( 'glossary_term_list', array($this, 'glossary_term_list') );
	}

	function glossary_term_list( $atts, $content='' ){
		global $post;
		extract( shortcode_atts(array('alpha'=>false,'group'=>false), $atts) );

		$args = array(
			'post_type'           => 'glossary',
			'posts_per_page'      => '-1',
			'orderby'             => 'title',
			'order'               => 'ASC',
			'ignore_sticky_posts' => 1,
		);

		// Restrict list to specific glossary group or groups
		if( $group ):
			$tax_query = array(
				'taxonomy' => 'wpglossarygroup',
				'field'    => 'slug',
				'terms'    => $group,
			);
			$args['tax_query'] = array( $tax_query );
		endif;

		$list       = '<p>' . __( 'There are no glossary items.', 'wp-glossary') . '</p>';
		$glossaries = get_posts( $args );
		if( !count($glossaries) )
			return $list;

		// Sanity check the list of letters (if set by user).
		$alphas = array();
		if( $alpha ) :
			$alpha_list = array_map( 'trim', explode(',', $alpha) );
			foreach( $alpha_list as $alpha_item ) :
				$alpha = strtolower( mb_substr($alpha_item, 0, 1, 'UTF-8') );
				if( $alpha && (is_numeric($alpha) || ctype_lower($alpha)) )
					$alphas[] = $alpha;
			endforeach; //alpha_list
		endif;
		$alphas = array_unique( $alphas );
	
		// Go through all glossaries, and restrict to alpha list if supplied.
		foreach( $glossaries as $post ) :
			setup_postdata( $post );
			$title      = get_the_title();
			$titlealpha = strtolower( mb_substr($title, 0, 1, 'UTF-8') );
			if( count($alphas) && !in_array($titlealpha, $alphas) )
				continue;
	
			$href  = get_permalink();
			$item  = '<li class="glossary-item">';
			$item .= '<a href="' . $href . '" title="' . esc_attr($title) . '">' . $title . '</a>';
			$item .= '</li>';
			$alphalist[$titlealpha][] = $item;
		endforeach; // glossaries
		// Default to the alphabetical order in the get_post args
		if( empty($alphas) ):
			$alphas = array_keys( $alphalist );
		endif;

		// Pass through list again, building HTML list
		$termlist = '<ul class="glossary-list">';
		foreach( $alphas as $letter ):
			if( isset($alphalist[$letter]) ): foreach( $alphalist[$letter] as $item ):
				$termlist .= $item;
			endforeach; endif;
		endforeach; 
		$termlist .= '</ul>';
		wp_reset_postdata();

		return $termlist;
	} // glossary_term_list
}
