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
    // Create per-letter dictionnary-like array
    $arr = preg_split("/(\w)/", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", -1, PREG_SPLIT_DELIM_CAPTURE|PREG_SPLIT_NO_EMPTY);
    $arr[] = "#?$";
    array_unshift($arr, "0-9"); 
    $newarr = array();
    foreach($arr as $key=>$str){
        $newarr[strval($str[0])] = array(
            "label" => $str,
            "data" => array()
        );
    }
    // Now put all glossary items into array    
    $tofind = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ";
    $replac = "AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuyNn";
    while ( have_posts() ){
        the_post();
        $slug = basename(get_permalink());
        $letter = strtoupper(strtr(get_the_title()[0],$tofind,$replac));
        if($newarr[$letter] != NULL){
            $newarr[$letter]["data"][basename(get_permalink())]=do_shortcode("[glossary slug=\"".basename(get_permalink())."\"]".get_the_title()."[/glossary]");
        } else if(preg_match("/[0-9]+/", $letter)){
            $newarr[0]["data"][basename(get_permalink())]=do_shortcode("[glossary slug=\"".basename(get_permalink())."\"]".get_the_title()."[/glossary]");
        } else {
            $newarr["#"]["data"][basename(get_permalink())]=do_shortcode("[glossary slug=\"".basename(get_permalink())."\"]".get_the_title()."[/glossary]");
        }
    }
        ?>
        <section id="glossary-index" data-type="tile">
            <header>
                <?php
    //Sort each letter and print in header the letter
    foreach($newarr as $key => $item){
        echo "<p class=\"tileHead\" data-chartype=\"".$key."\" data-empty=\"".((count($item["data"]) > 0) ? "false" : "true")."\">".$item["label"]."</p>";
        ksort($item["data"], SORT_STRING);
    } ?>
            </header>
            <div id="glossary-container">
                <?php
    foreach($newarr as $key => $item){
        if(count($item["data"]) > 0){
                ?>
                <article data-active="false" data-chartype="<?php echo $key; ?>">
                    <?php
            foreach($item["data"] as $glossary){
                echo '<p class="tile">'.$glossary.'</p>';
            }
                    ?>
                </article>
                <?php
        }
    }
    /*echo "<pre>";
    var_dump($newarr);
    echo "</pre>";*/

                ?>
            </div>
        </section>
        <?php

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
