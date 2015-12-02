<?php
class ithoughts_tt_gl_Shortcode_TERMLIST extends ithoughts_tt_gl_interface{
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

		$opts = apply_filters("ithoughts_tt_gl_get_overriden_opts", shortcode_atts($default, $atts), false);

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
		if( $opts["group"] ){
			$tax_query = array(
				'taxonomy' => 'ithoughts_tt_gllossarygroup',
				'field'    => 'slug',
				'terms'    => $opts["group"],
			);
			$args['tax_query'] = array( $tax_query );
		}

		$jsdata = array(); // Not used yet


		$list       = '<p>' . __( 'There are no glossary items.', 'ithoughts_tooltip_glossary') . '</p>';
		$glossaries = get_posts( $args );
		if( !count($glossaries) )
			return $list;

		// Sanity check the list of letters (if set by user).
		$alphas = array();
		if( $opts["alpha"] ) {
			$alpha_list = array_map( 'trim', explode(',', $opts["alpha"]) );
			foreach( $alpha_list as $alpha_item ) {
				$alpha = strtolower( mb_substr($alpha_item, 0, 1, 'UTF-8') );
				if( $alpha && (is_numeric($alpha) || ctype_lower($alpha)) )
					$alphas[] = $alpha;
			} //alpha_list
		}
		$alphas = array_unique( $alphas );
		if($opts["desc"] === "glossarytips"){
			parent::$scripts['qtip'] = true;
		}

		// Go through all glossaries, and restrict to alpha list if supplied.
		foreach( $glossaries as $post ) {
			$title      = $post->post_title;
			$titlealpha = strtolower( mb_substr($title, 0, 1, 'UTF-8') );
			if( count($alphas) && !in_array($titlealpha, $alphas) )
				continue;

			$link = "";
			switch($opts["desc"]){
				case 'excerpt':{
					$href  = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($post->ID) );
					$target = "";
					if( $opts["termlinkopt"] != 'none' ){
						$target = ($opts["termlinkopt"] == 'blank') ? 'target="_blank"' : '';
					}
					$link   = '<a href="' . $href . '" title="" alt="' . esc_attr($title) . '" ' . $target .'>' . $title . '</a>';
					$content = '<br>' . '<span class="glossary-item-desc">' . apply_filters("ithoughts_tt_gl-term-excerpt", $post) . '</span>';
				} break;
				case 'full':{
					$href  = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($post->ID) );
					$target = "";
					if( $opts["termlinkopt"] != 'none' ){
						$target = ($opts["termlinkopt"] == 'blank') ? 'target="_blank"' : '';
					}
					$link   = '<a href="' . $href . '" title="" alt="' . esc_attr($title) . '" ' . $target .'>' . $title . '</a>';
					$content = '<br>' . '<span class="glossary-item-desc">' . $post->post_content . '</span>';
				} break;
				case 'glossarytips':{
					$link = apply_filters("ithoughts_tt_gl_get_glossary_term_element", $post, null);
				} break;
				case "":{
					$href  = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($post->ID) );
					$target = "";
					if( $opts["termlinkopt"] != 'none' ){
						$target = ($opts["termlinkopt"] == 'blank') ? 'target="_blank"' : '';
					}
					$link   = '<a href="' . $href . '" title="" alt="' . esc_attr($title) . '" ' . $target .'>' . $title . '</a>';
				}break;
			}
			$item  = '<li class="glossary-item">';
			$item .= $link . $content;
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

		if( $opts["cols"] === false ){
			$opts["cols"] = count( $termlist ); // set col size to all items
		}
		$termlist = array_chunk( $termlist, $opts["cols"] );

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
