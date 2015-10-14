<?php
get_header();
?>
<section id="primary" class="content-area">
    <main id="main" class="site-main" role="main">
        <?php
if ( have_posts() ){?>
        <header class="page-header">
            <?php
    the_archive_title( '<h1 class="page-title">', '</h1>' );
    the_archive_description( '<div class="taxonomy-description">', '</div>' );
            ?>
        </header><!-- .page-header -->
        <?php
    if(false){
        // Start the Loop.
        while ( have_posts() ) : the_post();

        /*
				 * Include the Post-Format-specific template for the content.
				 * If you want to override this in a child theme, then include a file
				 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
				 */
        get_template_part( 'content', get_post_format() );

        // End the loop.
        endwhile;
    } else {
        while ( have_posts() ){
            the_post();
        ?>
        <h2><?php echo the_title(); ?></h2>
        <p><?php echo the_excerpt(); ?></p>
        <?php echo do_shortcode("[glossary slug=\"".basename(get_permalink())."\"]Hello is ".basename(get_permalink())." [/glossary]"); ?><?php
        }
    }

    // Previous/next page navigation.
    the_posts_pagination( array(
        'prev_text'          => __( 'Previous page', 'twentyfifteen' ),
        'next_text'          => __( 'Next page', 'twentyfifteen' ),
        'before_page_number' => '<span class="meta-nav screen-reader-text">' . __( 'Page', 'twentyfifteen' ) . ' </span>',
    ) );

    // If no content, include the "No posts found" template.
} else {
    get_template_part( 'content', 'none' );
}
        ?>

    </main><!-- .site-main -->
</section><!-- .content-area -->

<?php get_footer(); ?>
