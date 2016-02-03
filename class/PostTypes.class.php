<?php
/**
  * @copyright 2015-2016 iThoughts Informatique
  * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
  */

namespace ithoughts\tooltip_glossary;

class PostTypes extends \ithoughts\Singleton{
	public function __construct() {
		add_action( 'init', array($this, 'register_post_types') );
	}

	public function register_post_types(){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
		$options = $backbone->get_options();

		register_post_type( "glossary", array(
			'public'               => true,
			'menu_position'        => 105,
			'has_archive'          => true,
			'supports'             => array( 'title', 'editor', 'thumbnail', 'author', 'excerpt' ),
			'labels' => array(
				'name'               => __( 'Glossary Terms', 'ithoughts-tooltip-glossary' ),
				'singular_name'      => __( 'Glossary Term', 'ithoughts-tooltip-glossary' ),
				'add_new'            => __( 'Add New Term', 'ithoughts-tooltip-glossary' ),
				'add_new_item'       => __( 'Add New Glossary Term', 'ithoughts-tooltip-glossary' ),
				'edit_item'          => __( 'Edit Glossary Term', 'ithoughts-tooltip-glossary' ),
				'new_item'           => __( 'Add New Glossary Term', 'ithoughts-tooltip-glossary' ),
				'view_item'          => __( 'View Glossary Term', 'ithoughts-tooltip-glossary' ),
				'search_items'       => __( 'Search Glossary Terms', 'ithoughts-tooltip-glossary' ),
				'not_found'          => __( 'No Glossary Terms found', 'ithoughts-tooltip-glossary' ),
				'not_found_in_trash' => __( 'No Glossary Terms found in trash', 'ithoughts-tooltip-glossary' )
			),
			'register_meta_box_cb' => array( $this, 'meta_boxes' ),
			'rewrite'              => array(
				'slug' => $options["termtype"],
				'with_front' => false
			),
			'show_ui'       => true,
			'show_in_menu'  => false,
			"show_in_admin_bar" => true,
			"menu_icon" => "",
			'taxonomies'    => array(
				'glossary_group'
			)
		) );
		if(isset($options["needflush"]) && $options["needflush"]){
			$options["needflush"] = false;
			$backbone->set_options($options, true);
			flush_rewrite_rules(false);
		}

		add_filter( 'manage_glossary_posts_columns',       array($this, 'manage_glossary_posts_columns') );
		add_action( 'manage_glossary_posts_custom_column', array($this, 'manage_glossary_posts_custom_column'), 10, 2 );

		add_action( 'save_post',   array(&$this, 'save_glossary_post'), 10, 2 );
		add_filter( 'the_content', array(&$this, 'the_content'),        10, 2 );
	}

	/** */
	public function meta_boxes(){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
		$options = $backbone->get_options();
		add_meta_box( 'ithoughts_tt_gl_references', __('Glossary Term Reference', 'ithoughts-tooltip-glossary' ), array($this, 'mb_references'), $options["termtype"], 'normal', 'high' );
	}

	/** */
	public function mb_references(){
		global $post;

		if( $reference = get_post_meta( $post->ID, 'tcbithoughts_tt_gl_reference_title', $single=true ) ) :
		if( empty($reference) ) $reference = array();
		$values = shortcode_atts(array('title'=>'', 'link'=>''), $reference);
		endif;

		echo '<label class="ithoughts_tt_gl-admin">' . __('Title', 'ithoughts-tooltip-glossary' ) . ' <input name="ithoughts_tt_gl_reference_title" size="30" value="' . ((isset($values["title"]) && $values["title"]) ? $values["title"] : "") . '" /></label><br>';
		echo '<label class="ithoughts_tt_gl-admin">' . __('Link', 'ithoughts-tooltip-glossary' ) . ' <input name="ithoughts_tt_gl_reference_link" size="50" value="' . ((isset($values["link"]) && $values["link"]) ? $values["link"] : "") . '" /></label>';
		wp_nonce_field( plugin_basename(__FILE__), 'glossary_edit_nonce' );
	} //mb_references

	/** */
	public function manage_glossary_posts_columns( $columns ){
		$newcolumns = array(
			'usage'     => __( 'Usage', 'ithoughts-tooltip-glossary' ),
			'reference' => __( 'Reference', 'ithoughts-tooltip-glossary' ),
		);
		$columns = array_slice( $columns, 0, -1, true ) 
			+ $newcolumns 
			+ array_slice( $columns, -1, NULL, true );

		return $columns;
	}

	/** */
	public function manage_glossary_posts_custom_column( $column, $post_id ){
		switch( $column ){
			case 'usage':{
				$usage = get_post_meta( $post_id, 'ithoughts_tt_gl_term_used' );
				if( $usage ){
					$col = array();
					foreach( $usage as $post_id ){
						$title = get_the_title( $post_id );
						$url   = apply_filters( 'ithoughts_tt_gl_term_link', get_post_permalink($post_id) );
						$col[] = '<a href="' . $url . '">' . $title . '</a>';
					}
					echo implode( ', ', $col );
				}
			} break;
			case 'reference':{
				$reference = get_post_meta( $post_id, 'tcbithoughts_tt_gl_reference', $single=true );
				if( $reference ){
					extract( $reference );
					if( !(empty($title) && empty($url)) ){
						if( empty($title) ) {
							$title = $url;
						}
						echo $title;
					}
				}
			} break;
		}
	}

	/** */
	public function save_glossary_post( $post_id, $post ){
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
		$slug = $backbone->get_option("termtype");

		$_POST += array( "{$slug}_edit_nonce"=>'' );

		if( !current_user_can('edit_post', $post_id) )
			return;

		if( wp_is_post_revision($post) )
			return;

		if( !wp_verify_nonce($_POST["{$slug}_edit_nonce"], plugin_basename(__FILE__)) )
			return;

		if ( ! isset( $_POST['post_type'] ) ) {
			return;
		}

		if( $slug != $_POST['post_type'] )
			return;

		$title = $_POST['ithoughts_tt_gl_reference_title'];
		$link  = $_POST['ithoughts_tt_gl_reference_link'];

		$title = trim( $title );
		$link  = trim( $link );
		if( $link ){
			if( !preg_match('/^http/', $link) )
				$link = 'http://' . $link;
			if( filter_var($link, FILTER_VALIDATE_URL) === FALSE )
				$link = '';
		}

		$reference = array( 'title'=>$title, 'link'=>$link );
		update_post_meta( $post_id, 'ithoughts_tt_gl_reference', $reference );
		return $post_id;
	} // save_glossary_post

	/** */
	public function the_content( $content, $is_main_query=1 ){
		global $post, $wp_query;

		if( $is_main_query && is_single() && "glossary"==get_post_type() ){
			$this->backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
			$options = $backbone->get_options();

			if( $reference = get_post_meta($post->ID, 'ithoughts_tt_gl_reference', $single=true) ){
				extract( $reference );
				if( !empty($title) || !empty($link) ){
					if( empty($title) )
						$title = $link;
					if( $link )
						$title = '<a class="glossary-reference-link" target="_blank" href="' . $link . '">' . $title . '</a>';
					$content .= '<div class="glossary-references"><h4>' . __('Reference', 'ithoughts-tooltip-glossary' ) . ' ' . $title . '</h4></div>';
				}
			}// $reference

			// Usage
			$termusage = isset( $options['termusage'] ) ? $options['termusage'] : 'on';
			if( $termusage == 'on' ){
				$usage = get_post_meta( $post->ID, 'ithoughts_tt_gl_term_used' );
				if( $usage ){
					$usage_title = apply_filters( 'ithoughts_tt_gl_term_usage_title', __('Glossary Term Usage', 'ithoughts-tooltip-glossary' ) );
					$content    .= '<div class="ithoughts_tt_gl-term-usage"><div class="header"><h4>' . $usage_title . '</h4></div><ul>';
					foreach( $usage as $post_id ){
						$target   = get_post( $post_id );
						$title    = get_the_title( $post_id );
						$content .= '<li><a href="' . apply_filters('ithoughts_tt_gl_term_link', get_post_permalink($post_id)) . '" title="" alt="' . esc_attr($title) . '">' . $title . '</a></li>';
					}
					$content .= '</ul></div>';
				} // usage loop
			} // usage check

		} // Single ++ glossary
		return $content;
	} // the_content
} // post_types
