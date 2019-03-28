<?php

namespace ithoughts\TooltipGlossary\ResourceType\Taxonomy;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\OptionsManager;

if(!class_exists( __NAMESPACE__ . '\\GlossaryGroup' )){
    /**
     * Register & manages the `glossary_group` taxonomy type.
     */
    final class GlossaryGroup {
        /**
         * @var string The localization's text domain
         */
        protected $text_domain;

        /**
         * @var OptionsManager The manager used to retrieve plugin's options
         */
        protected $options_manager;

        /**
         * Constructs the `glossary_group` taxonomy type's wrapper class.
         *
         * @param string $text_domain The text domain used for localization.
         */
        public function __construct(string $text_domain, OptionsManager $options_manager){
            $this->text_domain = $text_domain;
            $this->options_manager = $options_manager;
        }

        /**
         * Register the taxonomy type in Wordpress.
         */
        public function register(){
            register_taxonomy( 'glossary_group', 'glossary', [
                'labels'             => [ // See https://developer.wordpress.org/reference/functions/get_taxonomy_labels/
                    'name'                  => __( 'Glossary groups', $this->text_domain ),
                    'singular_name'         => __( 'Glossary group', $this->text_domain ),
                    'search_items'          => __( 'Search glossary groups', $this->text_domain ),
                    // 'popular_items' not used since glossary group is hierarchical
                    'all_items'             => __( 'All glossary groups', $this->text_domain ),
                    'parent_item'           => __( 'Parent glossary group', $this->text_domain ),
                    'parent_item_colon'     => __( 'Parent glossary group :', $this->text_domain ),
                    'edit_item'             => __( 'Edit glossary group', $this->text_domain ),
                    'view_item'             => __( 'View glossary group', $this->text_domain ),
                    'update_item'           => __( 'Update glossary group', $this->text_domain ),
                    'add_new_item'          => __( 'Add new glossary group', $this->text_domain ),
                    'new_item_name'         => __( 'New glossary group name', $this->text_domain ),
                    // 'separate_items_with_commas' not used since glossary group is hierarchical
                    // 'add_or_remove_items' not used since glossary group is hierarchical
                    // 'choose_from_most_used' not used since glossary group is hierarchical
                    'not_found'             => __( 'No glossary groups found', $this->text_domain ),
                    'no_terms'              => __( 'No glossary groups', $this->text_domain ),
                    'items_list_navigation' => __( 'Glossary groups list navigation', $this->text_domain ),
                    'items_list'            => __( 'Glossary groups list', $this->text_domain ),
                    // 'most_used' uses default value
                    // 'back_to_items' uses default value,
                ],
                'description'        => __('Groups terms by subject, or any other criterion so that they can be displayed in lists', $this->text_domain),
                'public'             => true,
                'publicly_queryable' => true,
                'hierarchical'       => true,
                'show_ui'            => true, // TODO
                // 'show_in_menu' uses default value from `show_ui`
                // 'show_in_nav_menus' uses default value from `show_ui`
                'show_in_rest'       => true,
                // 'rest_base' uses default value
                // 'rest_controller_class' uses default value
                // 'show_tagcloud' uses default value from `show_ui`
                // 'show_in_quick_edit' uses default value from `show_ui`
                'show_admin_column'  => true,
                // 'meta_box_cb' TODO
                // 'meta_box_sanitize_cb' TODO
                // 'capabilities' uses default value
                'rewrite'            => [
                    'slug'         => $this->options_manager->get('glossary_group.slug'),
                    'with_front'   => true,
                    'hierarchical' => true,
                    // 'ep_mask' uses default value
                ],
                // 'query_var' uses default value
            ]);
        }
    }
}
