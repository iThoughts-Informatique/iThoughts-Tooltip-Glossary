<?php

namespace ithoughts\TooltipGlossary\Admin\Menu;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

if(!class_exists( __NAMESPACE__ . '\\ChildPage' )){
    /**
     * A page displayed as a sub-menu item on the Wordpress admin section.
     */
    final class ChildPage extends Page {
        /**
         * @var RootPage The root page that contains this entry.
         */
        protected $parent;

        /**
         * Create a new child page. You SHOULD attach it to a parent to register it in the Wordpress admin section.
         * 
         * @param string $page_title The localizable title of the target page.
         * @param string $menu_title The localizable label of the menu item.
         * @param string $slug A unique identifier for the page.
         * @param ?string $capability The required user capability to access this page.
         */
        public function __construct(
            string $page_title,
            string $menu_title,
            string $slug,
            ?string $capability
        ){
            parent::__construct($page_title, $menu_title, $slug, $capability);
        }

        /**
         * Register the subpage as a child of its parent page.
         * 
         * You SHOULD NOT call this method directly: it is meant to be called by its parent {@link RootPage} once it has registered itself.
         */
        public function register(): void {
            if($this->has_been_registered){
                throw new \Exception();
            }
            add_submenu_page($this->parent->get_slug(), $this->page_title, $this->menu_title, $this->capability, $this->slug);
        }

        /**
         * Define this page's parent. This method MUST have been called before {@link $this->register} is called.
         * This method will skip the definition if the provided parent is already the page's parent.
         *
         * @param  RootPage $new_parent The new parent page to set. This page will be added to the new parent's children list.
         */
        public function set_parent(RootPage $new_parent): void {
            if($this->parent === $new_parent){
                return;
            }
            $this->parent = $new_parent;
            $new_parent->add_child($this);
        }
    }
}
