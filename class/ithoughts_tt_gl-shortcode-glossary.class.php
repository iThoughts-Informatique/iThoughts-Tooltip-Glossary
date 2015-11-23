<?php
class ithoughts_tt_gl_Shortcodes_glossary extends ithoughts_tt_gl_interface{
	public function __construct() {
		// Shortcode
		add_shortcode( "ithoughts_tooltip_glossary-glossary", array(&$this, "glossary") );
		add_shortcode( "glossary", array(&$this, "glossary") );

		// Help functions..
		add_action( 'save_post',  array(&$this, 'save_post_check_for_glossary_usage'), 20, 2 );
		add_action( 'wp_insert_post_data',  array(&$this, 'parse_pseudo_links_to_shortcode'));
		add_action( 'edit_post',  array(&$this, 'convert_shortcodes'));
		add_action( 'get_header', array(&$this, 'glossary_usage_reset_for_post') );
		add_action( 'wp_footer',  array(&$this, 'glossary_remove_update_marker') );
	}

	public function parse_pseudo_links_to_shortcode( $data ){
		$data['post_content'] = preg_replace('/<a\s+?data-ithoughts_tt_gl-glossary-slug=\\\\"(.+?)\\\\".*>(.*?)<\/a>/', '[ithoughts_tooltip_glossary-glossary slug="$1"]$2[/ithoughts_tooltip_glossary-glossary]', $data['post_content']);
		return $data;
	}

	public function convert_shortcodes($post_id){
		$post = get_post($post_id);
		$post->post_content = preg_replace('/\[ithoughts_tooltip_glossary-glossary(.*?)(?: slug="(.+?)")(.*?)\](.+?)\[\/ithoughts_tooltip_glossary-glossary\]/', '<a data-ithoughts_tt_gl-glossary-slug="$2" $1 $3>$4</a>', $post->post_content);
		return $post;
	}

	/** 
	 * If post has glossary shortcode in it when it is saved, mark the post as needing be updated
	 */
	public function save_post_check_for_glossary_usage( $post_id, $post ){
		$glossary_options = get_option( 'ithoughts_tt_gl' );
		$termusage        = isset($glossary_options['termusage'] )  ? $glossary_options['termusage']   : 'on';

		if( $termusage != 'on' )
			return $post_id;

		if( !wp_is_post_revision($post_id)  ){
			if( strpos($post->post_content,'[ithoughts_tooltip_glossary-glossary ') !== false || strpos($post->post_content,'[ithoughts_tooltip_glossary-glossary]') !== false ){
				update_post_meta( $post_id, 'ithoughts_tt_gl_update_term_usage', current_time('mysql') );
			} else {
				if(get_post_meta( $post_id, 'ithoughts_tt_gl_has_terms', $single=true) ){
					// Also posts that used to have terms should be updated.
					delete_post_meta( $post_id, 'ithoughts_tt_gl_has_terms' );
					update_post_meta( $post_id, 'ithoughts_tt_gl_update_term_usage', current_time('mysql') );
				}
			}
		}
		return $post;
	}

	/** 
	 * If current post (or page or whatever) has been marked as needing updating,
	 *  then delete all the meta entries for this post.
	 * These are stored on the glossary term meta
	 */
	public function glossary_usage_reset_for_post(){
		global $post;
		if( is_singular() && get_post_meta( $post->ID, 'ithoughts_tt_gl_update_term_usage') ):
		// Find all glossary terms that have this post noted.
		$args = array(
			'post_type'   => "glossary",
			'numberposts' => -1,
			'post_status' => 'publish',
			'meta_query'  => array( array(
				'key'   => 'ithoughts_tt_gl_term_used',
				'value' => $post->ID,
				'type'  => 'DECIMAL'
			) )
		);
		$terms = get_posts( $args );
		foreach( $terms as $term ):
		// Delete the meta entry
		delete_post_meta( $term->ID, 'ithoughts_tt_gl_term_used', $post->ID );
		endforeach;
		endif;
	}

	/** */
	public function glossary_remove_update_marker(){
		/*
        global $post;
        if( is_singular() && get_post_meta( $post->ID, 'ithoughts_tt_gl_update_term_usage') ):
        delete_post_meta( $post->ID, 'ithoughts_tt_gl_update_term_usage' );
        endif;*/
	}

	/** */
	public function glossary( $atts, $content='' ){
		global $wpdb, $ithoughts_tt_gl_scritpts, $post, $ithoughts_tt_gl_doing_shortcode;
		$ithoughts_tt_gl_glossary_count++;

		// Get iThoughts Tooltip Glossary options
		$glossary_options = get_option( 'ithoughts_tt_gl', array() );

		// JS data to pass through to jQuery libraries
		$jsdata = array();

		// Let shortcode attributes override general settings
		foreach( $glossary_options as $k => $v ){
			if( isset($atts[$k]) ){
				$jsdata[] = 'data-' . $k . '="' . trim( esc_attr($atts[$k]) ) . '"';
				$glossary_options[$k] = trim( $atts[$k] );
			}
		}
		$tooltip_option   = isset($glossary_options['tooltips'])    ? $glossary_options['tooltips']    : 'excerpt';
		$linkopt          = isset($glossary_options['termlinkopt']) ? $glossary_options['termlinkopt'] : 'standard';
		$termusage        = isset($glossary_options['termusage'] )  ? $glossary_options['termusage']   : 'on';
		$staticterms        = isset($glossary_options['staticterms'] )  ? $glossary_options['staticterms']   : false;

		$id = $atts['glossary-id'];

		// Set text to default to content. This allows syntax like: [glossary]Cheddar[/glossary]
		if( empty($text) ){
			$text = $content;
		}

		/*
		// Term Usage
		if( $termusage && $termusage == 'on' && !$ithoughts_tt_gl_doing_shortcode ){
			if( get_post_meta( $post->ID, 'ithoughts_tt_gl_update_term_usage') ){
				if( !in_array($post->ID, get_post_meta($id, 'ithoughts_tt_gl_term_used')) ){
					// Note this post against the glossary
					add_post_meta( $glossary->ID, 'ithoughts_tt_gl_term_used', $post->ID );
					// Note this post/page has glossary terms
					update_post_meta( $post->ID, 'ithoughts_tt_gl_has_terms', current_time('mysql') );
				}
			}
		}*/

		if($glossary_options['staticterms']){
			$post = get_post($id);
			$jsdata[] = 'data-term-title="' . esc_attr($post->post_title) .  '"';

			$content;
			switch( $tooltip_option ){
				case 'full':{
					$content = $post->post_content;
				}break;

				case 'excerpt':{
					if( has_excerpt($id) ){
						$content = wp_trim_words($post->post_excerpt, 50, '...');
						$content = wpautop( $content );
					} else {
						$content = wp_trim_words($post->post_content, 50, '...');
					}
				}break;

				case 'off':{
					$content = "";
				}break;
			}
			$jsdata[] = 'data-term-content="' . esc_attr($content) . '"';
		} else {
			$jsdata[] = 'data-termid="' . $id . '"';
			$jsdata[] = 'data-content="' . $tooltip_option . '"';
		}
		
		$link = $text; // Set to just plain text (used if 'none' linkopt set in settings)
		if( $linkopt != 'none' ){
			$href   = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($id) );
			$target = ($linkopt == 'blank') ? 'target="_blank"'  : '';
			$link   = '<a href="' . $href . '" ' . $target . ' title="' . $content . '">' . $text . '</a>';
		}

//		$span = '<span class="ithoughts-tooltip-glossary">' . $link . '</span>'; // Trivial default when tooltips switched off.
		// Global variable that tells WP to print related js files.
		$ithoughts_tt_gl_scritpts['qtip'] = true;

		// qtip jquery data

		// Span that qtip finds
		$span = '<span class="ithoughts_tooltip_glossary-glossary" '.implode(' ',$jsdata).'>' . $link . '</span>';
		return $span;
	}

}
