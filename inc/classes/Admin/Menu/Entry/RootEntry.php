<?php

namespace ithoughts\TooltipGlossary\Admin\Menu\Entry;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\DependencyManager;
use ithoughts\TooltipGlossary\Manifest;

if(!class_exists( __NAMESPACE__ . '\\RootEntry' )){
    /**
     * A menu entry displayed as a top-level menu item on the Wordpress admin section.
     */
    final class RootEntry extends AEntry {
        protected $manifest;
        /**
         * @var array The list of child menu entries attached to this root page.
         */
        protected $children;
        /**
         * @var ?string The root menu entry's icon resource identifier to display.
         */
        protected $icon;

        /**
         * Create a new root page.
         * 
         * @param string       $page_title   The localizable title of the target page.
         * @param string       $menu_title   The localizable label of the menu item.
         * @param string       $slug         A unique identifier for the entry.
         * @param ?string      $capability   The required user capability to access this entry.
         * @param ?string      $icon         The icon's resource identifier to be fetched from the {@link \ithoughts\TooltipGlossary\Manifest}.
         * @param ?callable    $page_factory The page factory for this menu entry.
         * @param ChildEntry[] $children     The list of child menu entries to link with this root entry.
         */
        public function __construct(
            string $page_title,
            string $menu_title,
            string $slug,
            ?string $capability,
            ?string $icon,
            Manifest $manifest,
            ?callable $page_factory = null,
            array $children = []
        ){
            parent::__construct($page_title, $menu_title, $slug, $capability, $page_factory);
            $this->manifest = $manifest;
            $this->icon = $icon;
            $this->children = $children;
            foreach($children as $child){
                $child->set_parent($this);
            }
        }

        /**
         * Register the root entry, then all of its children.
         */
        public function register(): void {
            $icon = $this->icon !== null ? $this->manifest->get_url($this->icon) : null;
            add_menu_page( $this->page_title, $this->menu_title, $this->capability, $this->slug, null, $icon );
            foreach ($this->children as $child) {
                $child->register();
            }
        }

        /**
         * Add the specified child to the children list. If the child alread exists in the children list, this function won't do anything.
         *
         * @param  ChildEntry $child_page The menu entry to add as a children. The child entry's parent is set to this menu entry.
         */
        public function add_child(ChildEntry $child_page): void {
            if(in_array($child_page, $this->children)){
                return;
            }
            $this->children[] = $child_page;
            $child_page->set_parent($this);
        }

        /**
         * Returns the slug of this root entry.
         *
         * @return string The page's slug.
         */
        public function get_slug(): string {
            return $this->slug;
        }
    }
}
