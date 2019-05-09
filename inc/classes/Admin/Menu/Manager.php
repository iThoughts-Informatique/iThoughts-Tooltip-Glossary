<?php

namespace ithoughts\TooltipGlossary\Admin\Menu;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\DependencyManager;
use ithoughts\TooltipGlossary\Manifest;
use ithoughts\TooltipGlossary\Admin\Menu\Entry\ChildEntry;
use ithoughts\TooltipGlossary\Admin\Menu\Entry\RootEntry;

if(!class_exists( __NAMESPACE__ . '\\Manager' )){
    /**
     * The menu Manager register pages to expose on the Wordpress admin section.
     */
    final class Manager {
        /**
         * @var {RootEntry[]} Pages managed by this menu manager
         */
        protected $pages;

        /**
         * Construct the menu Manager and its pages.
         */
        public function __construct(string $text_domain){
            $this->pages = [
                new RootEntry( 'iThoughts Tooltip Glossary', 'Glossary', $text_domain, 'edit_others_posts', 'back-common-icon.svg', DependencyManager::get(Manifest::class), null, [
                    // Define the plugin options page.
                    new ChildEntry( 'Options', 'Options', $text_domain, 'manage_options'/*array( $this, 'options' )*/),
                    // Define the `Add new Term` page.
                    new ChildEntry( 'Add a Term', 'Add a Term', 'post-new.php?post_type=glossary', 'edit_others_posts'/*null,// Doesn't need a callback function*/),
                    // Define the glossary listing page.
                    new ChildEntry( 'Glossary Terms', 'Glossary Terms', 'edit.php?post_type=glossary', 'edit_others_posts'/*null,// Doesn't need a callback function*/),
                    // Define the taxonomy management page.
                    new ChildEntry( 'Glossary Groups', 'Glossary Groups', 'edit-tags.php?taxonomy=glossary_group&post_type=glossary', 'manage_categories' /*null,// Doesn't need a callback function*/),
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
