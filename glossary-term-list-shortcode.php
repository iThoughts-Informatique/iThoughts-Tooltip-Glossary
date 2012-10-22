<?php
/**
 * Glossaries shortcode
 *
 * Lists all current glossary items, alphabetically.
 */
add_shortcode( 'glossary_term_list', 'tcb_glossary_term_list_handle_shortcode' );
function tcb_glossary_term_list_handle_shortcode( $atts, $content='' ){
	global $post;
	extract( shortcode_atts(array('alpha'=>false), $atts) );

	$args = array(
		'post_type'           => 'glossary',
		'posts_per_page'      => '-1',
		'orderby'             => 'title',
		'order'               => 'ASC',
		'ignore_sticky_posts' => 1,
	);

	$list       = '<p>' . __( 'There are no glossary items.', 'wp-glossary') . '</p>';
	$glossaries = get_posts( $args );
	if( !count($glossaries) )
		return $list;

	$alphas = array();
	if( $alpha ) :
		$alpha_list = explode( ',', $alpha );
		foreach( $alpha_list as $alpha_item ) :
			$alpha = strtolower( substr(trim($alpha_item),0,1) );
			if( $alpha && ctype_lower($alpha) )
				$alphas[] = $alpha;
		endforeach;
	endif;
	$alphas = array_unique( $alphas );

	$list = '<ul class="glossary-list">';
	foreach( $glossaries as $post ) :
		setup_postdata( $post );
		$title      = get_the_title();
		$titlealpha = strtolower( substr($title,0,1) );
		if( count($alphas) && !in_array($titlealpha, $alphas) )
			continue;

		$href  = get_permalink();
		$list .= '<li class="glossary-item">';
		$list .= '<a href="' . $href . '" title="' . esc_attr($title) . '">' . $title . '</a>';
		$list .= '</li>';
	endforeach;
	$list .= '</ul>';
	wp_reset_postdata();

	return $list;
}
