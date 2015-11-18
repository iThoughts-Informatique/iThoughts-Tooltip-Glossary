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
    switch( $_POST['content'] ):
    case 'excerpt':
    if( has_excerpt($termid) ):
    $content = apply_filters( 'get_the_excerpt', $termob->post_excerpt );
    $content = wpautop( $content );
    endif;
    break;
    endswitch;

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
        'posts_per_page' => -1,
        'orderby'       => 'title',
        'order'         => 'ASC'
    );
    $posts = get_posts($args);
    $output = array();
    foreach($posts as $post){
        $output[$post->post_title] = array(
            "slug" => $post->post_name,
            "content" => wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
            "id" => $post->ID,
        );
    }
    wp_send_json_success($output);
    return;
}

if ( is_admin() ) {
    add_action( 'wp_ajax_ithoughts_tt_gl_get_customizing_form', 'get_customizing_form' );
    add_action( 'wp_ajax_ithoughts_tt_gl_get_tinymce_tooltip_form', 'get_tinymce_tooltip_form' );
}

function get_customizing_form(){
    $prefixs = ["t", "c", "g"]; // Used in style editor loop
    ob_start();
    include "templates/customizing_form.php";
    $output = ob_get_clean();
    wp_send_json_success($output);
}

function get_tinymce_tooltip_form(){
    wp_enqueue_style("ithoughts_tooltip_glossary-tinymce_form", plugins_url( 'css/ithoughts_tooltip_glossary-tinymce-forms.css', __FILE__ ), null, false);
    wp_enqueue_script("ithoughts_tooltip_glossary-utils", plugins_url( 'js/ithoughts_tooltip_glossary-utils.js', __FILE__ ), null, false);
    wp_enqueue_script("ithoughts_tooltip_glossary-tinymce_form", plugins_url( 'js/ithoughts_tooltip_glossary-tinymce-forms.js', __FILE__ ), null, array("jquery", "ithoughts_tooltip_glossary-utils"));

    // Retrieve terms
    $args = array(
        "post_type"     => "glossary",
        'post_status'   => 'publish',
        'orderby'       => 'title',
        'order'         => 'ASC',
        'numberposts'   => 25,
    );
    $data = array(
        "admin_ajax" => admin_url('admin-ajax.php')
    );
    $query = new WP_Query($args);
    if ( $query->have_posts() ) {
        global $post;
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
        $data['terms'] = $datas;
    }
    wp_localize_script( "ithoughts_tooltip_glossary-tinymce_form", "ithoughts_tt_gl_tinymce_form", $data );



    ob_start();
    include "templates/tinymce-tooltip-form.php";

    wp_reset_postdata();

    $output = ob_get_clean();
    echo $output;
    wp_die();
}