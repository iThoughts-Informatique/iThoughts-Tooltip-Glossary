<?php

namespace ithoughts\TooltipGlossary\Admin\Menu\Entry;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

if(!class_exists( __NAMESPACE__ . '\\ChildEntry' )){
    /**
     * A menu entry displayed as a sub-menu item on the Wordpress admin section.
     */
    final class ChildEntry extends AEntry {
        /**
         * @var RootEntry The root entry that contains this entry.
         */
        protected $parent;

        /**
         * Create a new child page. You SHOULD attach it to a parent to register it in the Wordpress admin section.
         * 
         * @param string    $page_title   The localizable title of the target page.
         * @param string    $menu_title   The localizable label of the menu item.
         * @param string    $slug         A unique identifier for the page.
         * @param ?string   $capability   The required user capability to access this page.
         * @param ?callable $page_factory The page factory for this menu entry.
         */
        public function __construct(
            string $page_title,
            string $menu_title,
            string $slug,
            ?string $capability,
            ?callable $page_factory = null
        ){
            parent::__construct($page_title, $menu_title, $slug, $capability, $page_factory);
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
            add_submenu_page($this->parent->get_slug(), $this->page_title, $this->menu_title, $this->capability, $this->slug, $this->get_page_callback());
        }

        /**
         * Define this menu entry's parent. This method MUST have been called before {@link $this->register} is called.
         * This method will skip the definition if the provided parent is already the entry's parent.
         *
         * @param  RootEntry $new_parent The new parent menu entry to set. This menu entry will be added to the new parent's children list.
         */
        public function set_parent(RootEntry $new_parent): void {
            if($this->parent === $new_parent){
                return;
            }
            $this->parent = $new_parent;
            $new_parent->add_child($this);
        }
    }
}
