<?php

namespace ithoughts\TooltipGlossary\Admin\Menu\Entry;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\DependencyManager;
use ithoughts\TooltipGlossary\Admin\Page\IPage;

if(!class_exists( __NAMESPACE__ . '\\AEntry' )){
    /**
     * An abstract generic menu entry, used to list & organize menu entries in the Wordpress admin section.
     */
    abstract class AEntry {
        /**
         * @var string The localized page name.
         */
        protected $page_title;

        /**
         * @var string The localized menu entry's label.
         */
        protected $menu_title;

        /**
         * @var string A unique identifier for the entry.
         */
        protected $slug;

        /**
         * @var ?string The required user capabilities to access this page.
         */
        protected $capability;

        /**
         * @var bool Flag indicating if the page has already been registered in Wordpress.
         */
        protected $has_been_registered = false;
        
        /**
         * @var ?callable The page factory of this menu entry.
         */
        protected $page_factory;
        
        /**
         * Create a new page.
         * 
         * @param string    $page_title   The localizable title of the target page.
         * @param string    $menu_title   The localizable label of the menu item.
         * @param string    $slug         A unique identifier for the entry.
         * @param ?string   $capability   The required user capability to access this page.
         * @param ?callable $page_factory The page factory for this menu entry.
         */
        public function __construct(
            string $page_title,
            string $menu_title,
            string $slug,
            ?string $capability,
            ?callable $page_factory
        ){
            // Localize readable data
            $text_domain = DependencyManager::get('text-domain');
            $this->page_title = __($page_title, $text_domain);
            $this->menu_title = __($menu_title, $text_domain);
            // Set the others
            $this->slug = $slug;
            $this->capability = $capability;
            $this->page_factory = $page_factory;
        }

        /**
         * Register this page in Wordpress.
         */
        public abstract function register(): void;

        /**
         * Get the callable function to display the page associated with this menu entry.
         *
         * @return ?callable The callback function to display this page.
         */
        protected function get_page_callback(): ?callable {
            if($this->page_factory === null){
                return null;
            }
            $page_factory = $this->page_factory;
            return function() use ($page_factory){
                $page = $page_factory();
                if(!($page instanceof IPage)){
                    throw new \TypeError("The provided page is of an incorrect class.");
                }
                $page->display();
            };
        }
    }
}
