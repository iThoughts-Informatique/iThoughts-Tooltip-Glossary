<?php
add_action( 'wp_ajax_nopriv_ithoughts_tt_gl_get_term_details', 'wp_ajax_nopriv_ithoughts_tt_gl_get_term_details' );
add_action( 'wp_ajax_ithoughts_tt_gl_get_term_details',        'wp_ajax_nopriv_ithoughts_tt_gl_get_term_details' );
function wp_ajax_nopriv_ithoughts_tt_gl_get_term_details(){


	// Sanity and security checks:
	//  - we have a termid (post id)
	//  - it is post of type 'glossary' (don't display other post types!)
	//  - it has a valid post status and current user can read it.
	$statii = array( 'publish', 'private' );
	$term   = null;
	if( isset($_POST['termid']) && $termid=$_POST['termid'] ):
	$termid = intval( $termid );
	$termob = get_post( $termid );
	if( get_post_type($termob) && get_post_type($termob) == "glossary" && in_array($termob->post_status, $statii) ):
	$term = $termob;
	endif;
	endif;

	// Fail if no term found (either due to bad set up, or someone trying to be sneaky!)
	if( !$term )
		wp_send_json_error();

	// Title
	$title = $term->post_title;

	// Don't display private terms
	if( $termob->post_status == 'private' && !current_user_can('read_private_posts') ):
	wp_send_json_success( array('title'=>$title, 'content'=>'<p>'.__('Private glossary term','ithoughts_tooltip_glossary').'</p>') );
	endif;

	// Don't display password protected items.
	if( post_password_required($termid) ):
	wp_send_json_success( array('title'=>$title, 'content'=>'<p>'.__('Protected glossary term','ithoughts_tooltip_glossary').'</p>') );
	endif;

	// Content
	switch( $_POST['content'] ){
		case 'excerpt':{
			if( has_excerpt($termid) ){
				$content = wp_trim_words($termob->post_excerpt, 50, '...');
				$content = wpautop( $content );
			} else {
				$content = wp_trim_words($termob->post, 50, '...');
			}
		}break;
	}

	// No content found, assume due to clash in settings and fetch full post content just in case.
	if( empty($content) )
		$content = apply_filters( 'the_content', $term->post_content );
	if( empty($content) )
		$content = '<p>'.__('No content','ithoughts_tooltip_glossary').'...</p>';


	wp_send_json_success( array('title'=>$title, 'content'=>$content) );
}

add_action( 'wp_ajax_ithoughts_tt_gl_get_terms_list',        'wp_ajax_ithoughts_tt_gl_get_terms_list' );
add_action( 'wp_ajax_nopriv_ithoughts_tt_gl_get_terms_list',        'wp_ajax_ithoughts_tt_gl_get_terms_list' );
function wp_ajax_ithoughts_tt_gl_get_terms_list(){
	$type = 'glossary';
	$args=array(
		'post_type' => $type,
		'post_status' => 'publish',
		'posts_per_page' => 25,
		'orderby'       => 'title',
		'order'         => 'ASC',
		's'             => $_POST["search"]
	);
	$posts = get_posts($args);
	$output = array("terms" => array(), "searched" => $_POST["search"]);
	foreach($posts as $post){
		$output["terms"][] = array(
			"slug" => $post->post_name,
			"content" => wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
			"title"     => $post->post_title,
			"id" => $post->ID,
		);
	}
	wp_send_json_success($output);
	return;
}

if ( is_admin() ) {
	add_action( 'wp_ajax_ithoughts_tt_gl_get_customizing_form', 'get_customizing_form' );
	add_action( 'wp_ajax_ithoughts_tt_gl_get_tinymce_tooltip_form', 'get_tinymce_tooltip_form' );
	add_action( 'wp_ajax_ithoughts_tt_gl_update', 'ithoughts_tt_gl_update' );
	add_action( 'wp_ajax_ithoughts_tt_gl_update_done', 'ithoughts_tt_gl_update_done' );
}

function get_customizing_form(){
	$prefixs = ["t", "c", "g"]; // Used in style editor loop
	ob_start();
	include dirname(__FILE__)."/templates/customizing_form.php";
	$output = ob_get_clean();
	wp_send_json_success($output);
}

function get_tinymce_tooltip_form(){
	$data = array();

	$mediatiptypes = array(
		'localimage' => array(
			'title' => __('Local image', 'ithoughts_tooltip_glossary'),
			'attrs' => array('title'=>__('Image from site library', 'ithoughts_tooltip_glossary'))
		), 
		'webimage' => array(
			'title' => __('Image on the web', 'ithoughts_tooltip_glossary'),
			'attrs' => array('title'=>__('Image referenced by url, not on the site', 'ithoughts_tooltip_glossary'))
		),
		'webvideo' => array(
			'title' => __('Video on the web', 'ithoughts_tooltip_glossary'),
			'attrs' => array('title'=>__('Video hosted online. Only Youtube', 'ithoughts_tooltip_glossary'))
		),
	);

	isset($_POST['data']) && $data=$_POST['data'];

	// Set defaults
	$types = array("glossary", "tooltip", "mediatip");
	$data["type"] = $data["type"] && array_search($data["type"], $types) !== false ? $data["type"] : "tooltip";
	$data["text"] = $data["text"] ?: "";
	$data["glossary_id"] = $data["glossary_id"] ?: NULL;
	$data["term_search"] = $data["term_search"] ?: "";
	$data["mediatip_type"] = $data["mediatip_type"] && isset($mediatiptypes[$data["mediatip_type"]]) ? $data["mediatip_type"] : $mediatiptypes[0];
	$data["mediatip_content_json"] = ithoughts_tt_gl_encode_json_attr($data["mediatip_content"]);
	$data["mediatip_content"] = ithoughts_tt_gl_decode_json_attr($data["mediatip_content"]);
	$data["mediatip_content_json_error"] = json_last_error_msg();
	switch($data["type"]){
		case "glossary":{
		} break;

		case "tooltip":{
			$data["tooltip_content"] = $data["tooltip_content"] ?: "";
		} break;

		case "mediatip":{
		} break;
	}

	// Ok go
	wp_register_style("ithoughts_tooltip_glossary-tinymce_form", plugins_url( 'css/ithoughts_tooltip_glossary-tinymce-forms.css', __FILE__ ), null, false);
	wp_register_script("ithoughts_tooltip_glossary-utils", plugins_url( 'js/ithoughts_tooltip_glossary-utils.js', __FILE__ ), null, false);
	wp_register_script("ithoughts_tooltip_glossary-tinymce_form", plugins_url( 'js/ithoughts_tooltip_glossary-tinymce-forms.js', __FILE__ ), null, array("jquery", "ithoughts_tooltip_glossary-utils"));

	// Retrieve terms
	$args;
	if($data["term_id"] == NULL){
		$args= array(
			"post_type"     => "glossary",
			'post_status'   => 'publish',
			'orderby'       => 'title',
			'order'         => 'ASC',
			'posts_per_page'   => 25,
			's'             => $data['term_search'],
		);
	} else {
		$args= array(
			"post_type"     => "glossary",
			'post_status'   => 'publish',
			'orderby'       => 'title',
			'order'         => 'ASC',
			'posts_per_page'   => 25,
			'post__in'      => array($data["glossary_id"]),
		);
	}
	$form_data = array(
		"admin_ajax"    => admin_url('admin-ajax.php'),
		"base_tinymce"  => plugins_url( 'js/tinymce', __FILE__ ),
		"terms"         => array(),
	);
	$query = new WP_Query($args);
	if ( $query->have_posts() ) {
		global $post;
		if($data["glossary_id"] == NULL){
			$datas = array();
			// Start looping over the query results.
			while ( $query->have_posts() ) {
				$query->the_post();
				$datas[] = array(
					"slug"      => $post->post_name,
					"content"   => wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
					"title"     => $post->post_title,
					"id"        => $post->ID
				);
			}
			$form_data['terms'] = $datas;
		} else {
			$query->the_post();
			$data["term_title"] = $post->post_title;
			$datas[] = array(
				"slug"      => $post->post_name,
				"content"   => wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
				"title"     => $post->post_title,
				"id"        => $post->ID
			);
		}
	}
	wp_localize_script( "ithoughts_tooltip_glossary-tinymce_form", "ithoughts_tt_gl_tinymce_form", $form_data );


	$mediatipdropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'mediatip_type', array(
		'selected' => $data["mediatip_type"],
		'options'  => $mediatiptypes,
		"class"     => "modeswitcher"
	) );

	ob_start();
	include dirname(__FILE__)."/templates/tinymce-tooltip-form.php";

	wp_reset_postdata();

	$output = ob_get_clean();
	echo $output;
	wp_die();
}

function ithoughts_tt_gl_update(){
	$data = array();
	isset($_POST['data']) && $data=$_POST['data'];

	require_once( dirname(__FILE__) . '/class/ithoughts_tt_gl-updater.php' );
	addActionVersionTransitionSwitcher();
	do_action( 'ithoughts_tt_gl_version_transition', $data );
}

function ithoughts_tt_gl_update_done(){
	$data = array();
	isset($_POST['data']) && $data=$_POST['data'];
	update_option( 'ithoughts_tt_gl_version_check', $data['newversion'] );
	wp_send_json_success(array("Ok" => "OK"));
	wp_die();
}