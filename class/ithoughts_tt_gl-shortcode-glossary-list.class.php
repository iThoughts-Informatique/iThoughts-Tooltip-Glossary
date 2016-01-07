<?php
class ithoughts_tt_gl_Shortcode_TERMLIST extends ithoughts_tt_gl_interface{
	public function __construct() {
		add_shortcode( 'glossary_term_list', array($this, 'glossary_term_list') );
	}

	public function glossary_term_list( $atts, $content='' ){
		$data = apply_filters("ithoughts_tt_gl-split-args", $atts);

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
		if( isset($data["handled"]["group"]) ){
			$tax_query = array(
				'taxonomy' => 'glossary_group',
				'field'    => 'slug',
				'terms'    => $data["handled"]["group"],
			);
			$args['tax_query'] = array( $tax_query );
		}


		$list       = '<p>' . __( 'There are no glossary items.', 'ithoughts_tooltip_glossary') . '</p>';
		$glossaries = get_posts( $args );
		if( !count($glossaries) )
			return $list;

		// Sanity check the list of letters (if set by user).
		$alphas = array();
		if( isset($data["handled"]["alpha"]) && $data["handled"]["alpha"] ) {
			$alpha_list = str_split($data["handled"]["alpha"]);
			foreach( $alpha_list as $alpha_item ) {
				$alpha = strtoupper( mb_substr($alpha_item, 0, 1, 'UTF-8') );
				if( $alpha && preg_match("/[A-Z#]/", $alpha))
					$alphas[] = $alpha;
			} //alpha_list
		}
		$alphas = array_unique( $alphas );
		if(!isset($data["handled"]["desc"]))
			$data["handled"]["desc"] = NULL;
		if($data["handled"]["desc"] === "glossarytips"){
			parent::$scripts['qtip'] = true;
		}

		// Copy & filter flossary options
		$linkdata = $data;
		unset($linkdata["attributes"]);
		unset($linkdata["handled"]);
		foreach($linkdata["linkAttrs"] as $key => $linkAttr){
			$linkdata["linkAttrs"]["link-".$key] = $linkAttr;
			unset($linkdata["linkAttrs"][$key]);
		}
		$linkdata = ithoughts_toolbox::array_flatten($linkdata);
		if($data["handled"]["desc"] != "glossarytips")
			$linkdata = apply_filters("ithoughts_tt_gl-split-args", $linkdata);

		// Go through all glossaries, and restrict to alpha list if supplied.
		foreach( $glossaries as $post ) {
			$title      = $post->post_title;
			$titlealpha = strtoupper( ithoughts_toolbox::unaccent(mb_substr($title,0,1, "UTF-8")) );
			if(!preg_match("/[A-Z]/", $titlealpha)){
				$titlealpha = "#";
			}
			if((!count($alphas)) || in_array($titlealpha,$alphas)){
				$link = "";
				$attrs = $data["attributes"];
				$linkAttrs = (isset($linkdata["linkAttrs"]) && is_array($linkdata["linkAttrs"])) ? $linkdata["linkAttrs"] : $linkdata;
				$linkAttrs["title"] = esc_attr($title);
				$linkAttrs["alt"] = esc_attr($title);
				switch($data["handled"]["desc"]){
					case 'excerpt':{
						$href  = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($post->ID) );
						$target = "";
						if( $data["options"]["termlinkopt"] != 'none' ){
							$linkAttrs["target"] = "_blank";
						}
						$linkAttrs["href"] = $href;
						$args = ithoughts_toolbox::concat_attrs( $linkAttrs);
						$link   = '<a '.$args.'>' . $title . '</a>';
						$content = '<br>' . '<span class="glossary-item-desc">' . apply_filters("ithoughts_tt_gl-term-excerpt", $post) . '</span>';
					} break;
					case 'full':{
						$href  = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($post->ID) );
						$target = "";
						if( $data["options"]["termlinkopt"] != 'none' ){
							$linkAttrs["target"] = "_blank";
						}
						$linkAttrs["href"] = $href;
						$args = ithoughts_toolbox::concat_attrs( $linkAttrs);
						$link   = '<a '.$args.'>' . $title . '</a>';
						$cargs = ithoughts_toolbox::concat_attrs( $attrs);
						$content = '<br>' . '<span class="glossary-item-desc">' . $post->post_content . '</span>';
					} break;
					case 'glossarytips':{
						$link = apply_filters("ithoughts_tt_gl_get_glossary_term_element", $post, NULL, $linkdata);
					} break;
					case NULL:{
						$href  = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($post->ID) );
						$target = "";
						if( $data["options"]["termlinkopt"] != 'none' ){
							$linkAttrs["target"] = "_blank";
						}
						$linkAttrs["href"] = $href;
						$args = ithoughts_toolbox::concat_attrs( $linkAttrs);
						$link   = '<a '.$args.'>' . $title . '</a>';
					}break;
				}
				$item  = '<li class="glossary-item">';
				$item .= $link . $content;
				$item .= '</li>';
				$alphalist[$titlealpha][] = $item;
			}
		} // glossaries
		// Default to the alphabetical order in the get_post args

		if( empty($alphas) ){
			$alphas = array_keys( $alphalist );
		}

		// Pass through list again, building HTML list
		$count = 0;
		foreach( $alphas as $letter ){
			if( isset($alphalist[$letter]) ){ 
				foreach( $alphalist[$letter] as $item){
					$count++;
				}
			}
		}
		$count += count($alphas);

		if( !isset($data["handled"]["cols"]) || $data["handled"]["cols"] === false ){
			$data["handled"]["cols"] = 1; // set col size to all items
		}
		$termsPerChunkFloat = $count / $data["handled"]["cols"];
		$termsPerChunk = intval($termsPerChunkFloat);
		if($termsPerChunkFloat != $termsPerChunk)
			$termsPerChunk++;


		$termlist = array();
		foreach( $alphas as $letter ){
			if( isset($alphalist[$letter]) ){ 
				array_unshift($alphalist[$letter], '<li class="glossary-item-header">' . $letter . '</li>');
				$termlist = array_merge($termlist,$alphalist[$letter]);
			}
		}
		$termlist = array_chunk($termlist, $termsPerChunk);

		$data["attributes"]["class"] = "glossary-list-details".((isset($data["attributes"]["class"]) && $data["attributes"]["class"]) ? " ".$data["attributes"]["class"] : "");
		$args = ithoughts_toolbox::concat_attrs( $data["attributes"]);

		$return = '<div '.$args.'>';
		foreach( $termlist as $col => $items ){
			$return .= '<ul class="glossary-list">';
			$return .= implode( '', $items );
			$return .= '</ul>';
		}
		$return .= '</div>';

		return $return;
	} // glossary_term_list
} // ithoughts_tt_gl_Shortcode_TERMLIST
