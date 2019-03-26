<?php

namespace ithoughts\TooltipGlossary;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use DI\ContainerBuilder;

if(!class_exists( __NAMESPACE__ . '\\DependencyManager' )){
    final class DependencyManager {
        /**
         * @var \DI\Container The dependency injection container.
         */
        protected $container;

        /**
         * @var \DI\ContainerBuilder The builder used to compose the {@link container} object.
         */
        protected $container_builder;
        
        /**
         * @var DependencyManager The singleton instance of the dependency manager.
         */
        protected static $instance;
        
        /**
         * Creates a new instance of the DependencyManager of iThoughts Tooltip Glossary
         */
        protected function __construct() {
            $this->container_builder = new ContainerBuilder();
        }
        
        /**
         * Register dependencies needed depending on the current page
         */
        public static function load(): void {
            // This will be used as a check if we have already loaded the plugin.
            if ( !once_flag( 'load' ) ) { return; }
            
            $instance = static::get_instance();
            $instance->register_common_definitions();
            if(is_admin()){
                $instance->register_back_definitions();
            } else {
                $instance->register_front_definitions();
            }
        }

        /**
         * Register the dependencies used by the back & the front
         */
        protected function register_common_definitions(): void {
            $this->container_builder->addDefinitions([
                'text-domain' => 'ithoughts-tooltip-glossary',
                'base-path' => plugin_dir_path(__FILE__),
                'base-url' => plugin_dir_url(__FILE__),
            ]);
        }

        /**
         * Register the dependencies used by the front.
         */
        protected function register_front_definitions(): void {
            $this->container_builder->addDefinitions([]);
        }

        /**
         * Register the dependencies used by the back.
         */
        protected function register_back_definitions(): void {
            $this->container_builder->addDefinitions([]);
        }

        /**
         * Returns the single instance of the dependency manager.
         *
         * @return DependencyManager The singleton instance of the dependency manager.
         */
        public static function get_instance() : DependencyManager {
            if( null == static::$instance ){
                static::$instance = new static();
            }
            
            return static::$instance;
        }
        
        /**
         * Returns the container of the dependency manager.
         */
        public function get_container() :  \DI\Container {
            if($this->container === null){
                bdump('Seal');
                $this->container = $this->container_builder->build();
            }
            return $this->container;
        }

        /**
         * Bind wordpress actions to initialize appropriate parts of the plugin.
         */
        public static function bootstrap(): void {
            // Initialize the plugin if not already loaded.
            add_action( 'init', [__NAMESPACE__.'\\DependencyManager' , 'load'], 2);
        }
    }
}
