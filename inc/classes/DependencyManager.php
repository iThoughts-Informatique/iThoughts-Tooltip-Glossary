<?php

namespace ithoughts\TooltipGlossary;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use DI\ContainerBuilder;
use ithoughts\TooltipGlossary\Admin\Menu\Manager as Menu_Manager;

if(!class_exists( __NAMESPACE__ . '\\DependencyManager' )){
    /**
     * The DependencyManager is a singleton class that registers dependencies of the plugin, and expose a \DI\Container to be used for dependency resolution.
     */
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
         * @var string The path of the plugin's directory.
         */
        protected static $root_plugin_file;
        
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
            $relative_assets_dir = 'assets/dist/';

            $base_path = plugin_dir_path(static::$root_plugin_file);
            $base_url = plugin_dir_url(static::$root_plugin_file);
            $this->container_builder->addDefinitions([
                'text-domain' => 'ithoughts-tooltip-glossary',
                'base-path' =>   $base_path,
                'base-url' =>    $base_url,
                'assets-path' => "$base_path$relative_assets_dir",
                'assets-url' =>  "$base_url$relative_assets_dir",
                'manifest' =>    function(){ return new Manifest(); },
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
            $this->container_builder->addDefinitions([
                'menu-manager' => function(){ return new Menu_Manager(); },
            ]);
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
                $this->container = $this->container_builder->build();
            }
            return $this->container;
        }

        /**
         * Bind wordpress actions to initialize appropriate parts of the plugin.
         */
        public static function bootstrap(string $root_plugin_file): void {
            static::$root_plugin_file = $root_plugin_file;
            // Initialize the plugin if not already loaded.
            add_action( 'init', [__NAMESPACE__.'\\DependencyManager' , 'load'], 2);

            add_action( 'admin_init', function(){
                static::get_instance()->get_container()->get('menu-manager')->register();
            });
        }
    }
}
