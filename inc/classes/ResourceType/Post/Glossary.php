<?php

namespace ithoughts\TooltipGlossary\ResourceType\Post;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\OptionsManager;

if(!class_exists( __NAMESPACE__ . '\\Glossary' )){
    /**
     * Register & manages the `glossary` post type.
     */
    final class Glossary {
        /**
         * @var string The localization's text domain
         */
        protected $text_domain;

        /**
         * @var OptionsManager The manager used to retrieve plugin's options
         */
        protected $options_manager;

        /**
         * Constructs the `glossary` post type's wrapper class.
         *
         * @param string $text_domain The text domain used for localization.
         */
        public function __construct(string $text_domain, OptionsManager $options_manager){
            $this->text_domain = $text_domain;
            $this->options_manager = $options_manager;
        }

        /**
         * Register the post type in Wordpress.
         */
        public function register(){
            register_post_type('glossary', [
                // 'label' uses default value from `labels`
                'labels'                => [ // See https://developer.wordpress.org/reference/functions/get_post_type_labels/
                    'name'                     => __('Glossary terms', $this->text_domain),
                    'singular_name'            => __('Glossary term', $this->text_domain),
                    'add_new'                  => _x('Add new', 'glossary term', $this->text_domain),
                    'add_new_item'             => __('Add a new glossary term', $this->text_domain),
                    'edit_item'                => __('Edit glossary term', $this->text_domain),
                    'new_item'                 => __('New glossary term', $this->text_domain),
                    'view_item'                => __('View glossary term', $this->text_domain),
                    'view_items'               => __('View glossary terms', $this->text_domain),
                    'search_items'             => __('Search glossary terms', $this->text_domain),
                    'not_found'                => __('No glossary terms found', $this->text_domain),
                    'not_found_in_trash'       => __('No glossary terms found in trash', $this->text_domain),
                    // 'parent_item_colon' not used since glossary terms are not hierarchicals
                    'all_items'                => __('All glossary terms', $this->text_domain),
                    'archives'                 => __('Glossary term archives', $this->text_domain),
                    'attributes'               => __('Glossary term attributes', $this->text_domain),
                    'insert_into_item'         => __('Insert into glossary term', $this->text_domain),
                    'uploaded_to_this_item'    => __('Uploaded to this glossary term', $this->text_domain),
                    // 'featured_image' use default value
                    // 'set_featured_image' use default value
                    // 'remove_featured_image' use default value
                    // 'use_featured_image' use default value
                    // 'menu_name' use default value
                    'filter_items_list'        => __('Filter glossary terms list', $this->text_domain),
                    'items_list_navigation'    => __('Glossary terms list navigation', $this->text_domain),
                    'items_list'               => __('Glossary terms list', $this->text_domain),
                    'item_published'           => __('Glossary term published.', $this->text_domain),
                    'item_published_privately' => __('Glossary term published privately.', $this->text_domain),
                    'item_reverted_to_draft'   => __('Glossary term reverted to draft.', $this->text_domain),
                    'item_scheduled'           => __('Glossary term scheduled.', $this->text_domain),
                    'item_updated'             => __('Glossary term updated.', $this->text_domain),
                ],
                'description'           => __('A glossary term, like a dictionary entry with a definition, that can be displayed in a tooltip.', $this->text_domain),
                'public'                => true,
                'hierarchical'          => false,
                'exclude_from_search'	=> $this->options_manager->get('glossary.searchable'),
                'publicly_queryable'    => true,
                'show_ui'               => true,
                'show_in_menu'          => false, // Already displayed as a subpage of the plugin's root page
                'show_in_nav_menus'     => true, // TODO check effect on front
                'show_in_admin_bar'     => true,
                'show_in_rest'          => true, // Fetched from front using the API.
                // 'rest_base' uses default value
                // 'rest_controller_class' uses default value
                // 'menu_position' not used since no root menu entry is added
                // 'menu_icon' not used since no root menu entry is added
                // 'capability_type' uses default value
                // 'capabilities' uses default value
                // 'map_meta_cap' uses default value
                'supports'              => ['title', 'editor', 'author', 'excerpt', 'thumbnail'], // See https://developer.wordpress.org/reference/functions/add_post_type_support/
                // 'register_meta_box_cb' TODO => array( $this, 'meta_boxes' ),
                'taxonomies'            => ['glossary_group'],
                'has_archive'           => true,
                'rewrite'               => [
                    'slug'       => $this->options_manager->get('glossary.slug'),
                    'with_front' => true, // TODO what is it ?
                    // 'feeds' uses default value from `has_archive`
                    // 'pages' uses default value
                    // 'ep_mask' uses default value
                ],
                // 'query_var' uses default value
                // 'can_export' uses default value
                // 'delete_with_user' uses default value (from supports)
            ]);
        }
    }
}
