<?php
/**
 * WP-Glossary Post Types
 */
class WPG_Post_types Extends WPG{
 	public function __construct() {
		add_action( 'init', array($this, 'register_post_types') );
	}

	public function register_post_types(){
		register_post_type( 'glossary', array(
			'public'               => true,
			'menu_position'        => 105,
			'has_archive'          => true,
 			'supports'             => array( 'title', 'editor', 'thumbnail', 'author', 'excerpt' ),
			'labels' => array(
				'name'               => __( 'Glossary Terms',                   WPG_TEXTDOMAIN ),
				'singular_name'      => __( 'Glossary Term',                    WPG_TEXTDOMAIN ),
				'add_new'            => __( 'Add New Term',                     WPG_TEXTDOMAIN ),
				'add_new_item'       => __( 'Add New Glossary Term',            WPG_TEXTDOMAIN ),
				'edit_item'          => __( 'Edit Glossary Term',               WPG_TEXTDOMAIN ),
				'new_item'           => __( 'Add New Glossary Term',            WPG_TEXTDOMAIN ),
				'view_item'          => __( 'View Glossary Term',               WPG_TEXTDOMAIN ),
				'search_items'       => __( 'Search Glossary Terms',            WPG_TEXTDOMAIN ),
				'not_found'          => __( 'No Glossary Terms found',          WPG_TEXTDOMAIN ),
				'not_found_in_trash' => __( 'No Glossary Terms found in trash', WPG_TEXTDOMAIN )
			),
			'register_meta_box_cb' => array($this, 'meta_boxes'),
			'rewrite'              => array('slug' => __('glossary', WPG_TEXTDOMAIN)),
		) );

		add_filter( 'manage_glossary_posts_columns',       array($this, 'manage_glossary_posts_columns') );
		add_action( 'manage_glossary_posts_custom_column', array($this, 'manage_glossary_posts_custom_column'), 10, 2 );

		add_action( 'save_post',   array(&$this, 'save_glossary_post'), 10, 2 );
		add_filter( 'the_content', array(&$this, 'the_content'),        10, 2 );
	}

	/** */
	public function meta_boxes(){
		add_meta_box( 'wpg_references', __('Glossary Term Reference', WPG_TEXTDOMAIN), array($this, 'mb_references'), 'glossary', 'normal', 'high' );
	}

	/** */
	public function mb_references(){
		global $post;

		if( $reference = get_post_meta( $post->ID, 'tcbwpg_reference', $single=true ) ) :
			if( empty($reference) ) $reference = array();
			extract( shortcode_atts(array('title'=>'', 'link'=>''), $reference) );
		endif;

		echo '<label class="tcbwpg-admin">' . __('Title:',WPG_TEXTDOMAIN) . ' <input name="tcbwpg_reference_title" size="30" value="' . $title . '" /></label><br>';
		echo '<label class="tcbwpg-admin">' . __('Link:',WPG_TEXTDOMAIN) . ' <input name="tcbwpg_reference_link" size="50" value="' . $link . '" /></label>';
		wp_nonce_field( plugin_basename(__FILE__), 'glossary_edit_nonce' );
	} //mb_references

	/** */
	public function manage_glossary_posts_columns( $columns ){
		$newcolumns = array(
			'usage'     => __( 'Usage',     WPG_TEXTDOMAIN ),
			'reference' => __( 'Reference', WPG_TEXTDOMAIN ),
		);
		$columns = array_slice( $columns, 0, -1, true ) 
			+ $newcolumns 
			+ array_slice( $columns, -1, NULL, true );

		return $columns;
	}

	/** */
	public function manage_glossary_posts_custom_column( $column, $post_id ){
		switch( $column ):
			case 'usage':
				$usage = get_post_meta( $post_id, 'wpg_term_used' );
				if( $usage ):
					$col = array();
					foreach( $usage as $post_id ):
						$title = get_the_title( $post_id );
						$url   = apply_filters( 'wpg_term_link', get_post_permalink($post_id) );
						$col[] = '<a href="' . $url . '">' . $title . '</a>';
					endforeach;
					echo implode( ', ', $col );
				endif;
				break;
			case 'reference':
				$reference = get_post_meta( $post_id, 'tcbwpg_reference', $single=true );
				if( $reference ):
					extract( $reference );
					if( !(empty($title) && empty($url)) ):
						if( empty($title) )
							$title = $url;
						echo $title;
					endif;
				endif;
				break;
		endswitch;
	}
	
	/** */
	public function save_glossary_post( $post_id, $post ){
		$slug = 'glossary';

		$_POST += array( "{$slug}_edit_nonce"=>'' );

		if( $slug != $_POST['post_type'] )
			return;

		if( !current_user_can('edit_post', $post_id) )
 			return;

		if( wp_is_post_revision($post) )
			return;

		if( !wp_verify_nonce($_POST["{$slug}_edit_nonce"], plugin_basename(__FILE__)) )
			return;

		$title = $_POST['tcbwpg_reference_title'];
		$link  = $_POST['tcbwpg_reference_link'];

		$title = trim( $title );
		$link  = trim( $link );
		if( $link ) :
			if( !preg_match('/^http/', $link) )
				$link = 'http://' . $link;
			if( filter_var($link, FILTER_VALIDATE_URL) === FALSE )
				$link = '';
		endif;
		
		$reference = array( 'title'=>$title, 'link'=>$link );
		update_post_meta( $post_id, 'tcbwpg_reference', $reference );
		return $post_id;
	} // save_glossary_post

	/** */
	public function the_content( $content, $is_main_query=1 ){
		global $post, $wp_query;

		if( $is_main_query && is_single() && 'glossary'==get_post_type() ) :
			$options = get_option( 'wp_glossary', array() );

			if( $reference = get_post_meta($post->ID, 'tcbwpg_reference', $single=true) ):
				extract( $reference );
				if( !empty($title) || !empty($link) ):
					if( empty($title) )
						$title = $link;
					if( $link )
						$title = '<a class="glossary-reference-link" target="_blank" href="' . $link . '">' . $title . '</a>';
					$content .= '<div class="glossary-references"><h4>' . __('Reference:', WPG_TEXTDOMAIN) . ' ' . $title . '</h4></div>';
				endif;
			endif; // $reference
			
			// Usage
			$termusage = isset( $options['termusage'] ) ? $options['termusage'] : 'on';
			if( $termusage == 'on' ):
				$usage = get_post_meta( $post->ID, 'wpg_term_used' );
				if( $usage ):
					$content .= '<div class="wpg-term-usage"><div class="header"><h4>' . __('WP Glossary Term Usage', WPG_TEXTDOMAIN) . '</h4></div><ul>';
					foreach( $usage as $post_id ):
						$target   = get_post( $post_id );
						$title    = get_the_title( $post_id );
						$content .= '<li><a href="' . apply_filters('wpg_term_link', get_post_permalink($post_id)) . '" title="' . esc_attr($title) . '">' . $title . '</a></li>';
					endforeach;
					$content .= '</ul></div>';
				endif; // usage loop
			endif; // usage check

		endif; // Single ++ glossary
		return $content;
	} // the_content
} // WPG_Post_types
