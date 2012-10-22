<?php
/**
 * Glossaries shortcode
 *
 * Lists all current glossary items, alphabetically.
 */
add_shortcode( 'glossary_atoz', 'tcb_glossary_atoz_handle_shortcode' );
function tcb_glossary_atoz_handle_shortcode( $atts, $content='' ){
	global $post, $tcb_wpg_scripts;

	// Global variable that tells WP to print related js files.
	$tcb_wpg_scripts = true;

	$args = array(
		'post_type'           => 'glossary',
		'posts_per_page'      => '-1',
		'orderby'             => 'title',
		'order'               => 'ASC',
		'ignore_sticky_posts' => 1,
	);

	$list       = '<p>' . __('There are no glossary items.','wp-glossary') . '</p>';
	$glossaries = get_posts( $args );
	if( !count($glossaries) ) return $list;

	$atoz = array();
	foreach( $glossaries as $post ) : setup_postdata( $post );
		$href  = get_permalink();
		$title = get_the_title();
		$alpha = strtolower( substr($title,0,1) );

		$item  = '<li class="glossary-item atoz-li atoz-li-' . $alpha . '">';
		$item .= '<a href="' . $href . '" title="' . esc_attr($title) . '">' . $title . '</a>';
		$item .= '</li>';

		$atoz[$alpha][] = $item;
	endforeach; wp_reset_postdata();

	$menu  = '<ul class="glossary-menu-atoz">';
	$range = apply_filters( 'tcb_wpg_atoz_range', range('a','z') );
	foreach( $range as $alpha ) :
		if( ! isset($atoz[$alpha]) ) :
			$menu .= '<li class="glossary-menu-item atoz-menu-' . $alpha . ' atozmenu-empty" title="none" alpha="' . $alpha . '">' . $alpha . '</li>';
			continue;
		endif;
		$count = count( $atoz[$alpha] );
		$menu .= '<li class="glossary-menu-item atoz-menu-' . $alpha . ' atoz-clickable atozmenu-off" title="' . esc_attr__('Terms','wp-glossary') . ': ' . $count . '"  alpha="' . $alpha . '">';
		$menu .= '<a href="#' . $alpha . '">' . $alpha . '</a></li>';
	endforeach;
	$menu .= '</ul>';

	$list = '<div class="glossary-list-wrapper">';
	foreach( $atoz as $alpha => $items ) :
		$list .= '<ul class="glossary-list glossary-list-' . $alpha . ' atozitems-off">';
		$list .= implode( '', $items );
		$list .= '</ul>';
	endforeach;
	$list .= '</div>';

	return '<div class="glossary-atoz-wrapper">' . $menu . '<div style="clear: both;"></div>' . $list . '</div>';
}
