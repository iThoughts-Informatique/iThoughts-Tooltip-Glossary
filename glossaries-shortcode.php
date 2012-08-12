<?php
/**
 * Glossaries shortcode
 *
 * Lists all current glossary items, alphabetically.
 */
add_shortcode( 'glossaries', 'tcb_glossaries_handle_shortcode' );
function tcb_glossaries_handle_shortcode( $atts, $content='' ){
	global $post;
	$args = array(
		'post_type'           => 'glossary',
		'posts_per_page'      => '-1',
		'orderby'             => 'title',
		'order'               => 'ASC',
		'ignore_sticky_posts' => 1,
	);

	$list = '<p>There are no glossary items.</p>';
	$glossaries = get_posts( $args );
	if( count($glossaries) ) :
		$list = '<ul class="glossary-list">';
		foreach( $glossaries as $post ) :
			setup_postdata( $post );
			$href  = get_permalink();
			$title = get_the_title();
			$list .= '<li class="glossary-item">';
			$list .= '<a href="' . $href . '" title="' . esc_attr($title) . '">' . $title . '</a>';
			$list .= '</li>';
		endforeach;
		$list .= '</ul>';
		wp_reset_postdata();
	endif;

	return $list;
}
