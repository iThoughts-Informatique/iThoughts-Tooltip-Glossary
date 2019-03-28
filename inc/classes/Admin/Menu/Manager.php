<?php

namespace ithoughts\TooltipGlossary\Admin\Menu;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\DependencyManager;
use ithoughts\TooltipGlossary\Manifest;

if(!class_exists( __NAMESPACE__ . '\\Manager' )){
    /**
     * The menu Manager register pages to expose on the Wordpress admin section.
     */
    final class Manager {
        /**
         * @var {RootPage[]} Pages managed by this menu manager
         */
        protected $pages;

        /**
         * Construct the menu Manager and its pages.
         */
        public function __construct(string $text_domain){
            $this->pages = [
                new RootPage( 'iThoughts Tooltip Glossary', 'Glossary', $text_domain, 'edit_others_posts', 'back-icon.svg', DependencyManager::get(Manifest::class), null, [
                    // Define the plugin options page.
                    new ChildPage( 'Options', 'Options', $text_domain, 'manage_options'/*array( $this, 'options' )*/),
                    // Define the `Add new Term` page.
                    new ChildPage( 'Add a Term', 'Add a Term', 'post-new.php?post_type=glossary', 'edit_others_posts'/*null,// Doesn't need a callback function*/),
                    // Define the glossary listing page.
                    new ChildPage( 'Glossary Terms', 'Glossary Terms', 'edit.php?post_type=glossary', 'edit_others_posts'/*null,// Doesn't need a callback function*/),
                    // Define the taxonomy management page.
                    new ChildPage( 'Glossary Groups', 'Glossary Groups', 'edit-tags.php?taxonomy=glossary_group&post_type=glossary', 'manage_categories' /*null,// Doesn't need a callback function*/),
                ])
            ];
        }

        /**
         * Register each pages in Wordpress.
         */
        public function register(): void {
            foreach($this->pages as $page){
                $page->register();
            }
        }
    }
}
