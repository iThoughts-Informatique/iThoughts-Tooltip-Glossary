<?php

namespace ithoughts\TooltipGlossary;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use DI\ContainerBuilder;
use ithoughts\TooltipGlossary\Admin\Menu\Manager as Menu_Manager;
use ithoughts\TooltipGlossary\ResourceType\Post\Glossary as Post_Glossary;
use ithoughts\TooltipGlossary\ResourceType\Taxonomy\GlossaryGroup as Taxonomy_GlossaryGroup;

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
         * Creates a new instance of the DependencyManager of iThoughts Tooltip Glossary
         */
        protected function __construct() {
            $this->container_builder = new ContainerBuilder();
        }

        /**
         * Register the dependencies used by both the back & the front
         */
        protected function register_common_definitions(): void {
            $this->container_builder->addDefinitions(dirname(__FILE__).'/dependencies/common.php');
        }

        /**
         * Register the dependencies used by the front.
         */
        protected function register_front_definitions(): void {
            $this->container_builder->addDefinitions(dirname(__FILE__).'/dependencies/front.php');
        }

        /**
         * Register the dependencies used by the back.
         */
        protected function register_back_definitions(): void {
            $this->container_builder->addDefinitions(dirname(__FILE__).'/dependencies/back.php');
        }

        /**
         * Returns the single instance of the dependency manager.
         *
         * @return DependencyManager The singleton instance of the dependency manager.
         */
        public static function get_instance(): DependencyManager {
            if( null == static::$instance ){
                static::$instance = new static();
            }
            
            return static::$instance;
        }
        
        /**
         * Returns the container of the dependency manager.
         */
        public function get_container():  \DI\Container {
            if($this->container === null){
                $this->container = $this->container_builder->build();
            }
            return $this->container;
        }
        
        /**
         * A shorthand method, retrieving the static instance of the DependencyManager, and uses `get` on its container.
         *
         * @param mixed $something The thing's identifier to resolve.
         * @return mixed the resolved thing.
         */
        public static function get($something){
            return static::get_instance()->get_container()->get($something);
        }
        
        /**
         * A shorthand method, retrieving the static instance of the DependencyManager, and uses `call` on its container.
         *
         * @param mixed $something The thing's identifier to resolve.
         * @return mixed the resolved thing.
         */
        public static function call($something){
            return static::get_instance()->get_container()->call($something);
        }
        
        /**
         * A shorthand method, retrieving the static instance of the DependencyManager, and uses `make` on its container.
         *
         * @param mixed $something The thing's identifier to resolve.
         * @return mixed the resolved thing.
         */
        public static function make($something){
            return static::get_instance()->get_container()->make($something);
        }

        /**
         * Bind wordpress actions to initialize appropriate parts of the plugin.
         */
        public static function bootstrap(): void {
            // This will be used as a check if we have already loaded the plugin.
            if ( !once_flag( 'bootstrap' ) ) { return; }
            
            $instance = static::get_instance();
            $instance->register_common_definitions();
            if(is_admin()){
                $instance->register_back_definitions();
            } else {
                $instance->register_front_definitions();
            }

            add_action( 'admin_init', function(){
                static::get(Menu_Manager::class)->register();
            });
            add_action( 'init', function(){
                static::get(Taxonomy_GlossaryGroup::class)->register();
                static::get(Post_Glossary::class)->register();
            });
        }
    }
}
