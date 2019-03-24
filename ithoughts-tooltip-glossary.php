<?php

/**
* @file Include file for plugin
*
* @author Gerkin
* @copyright 2016 GerkinDevelopment
* @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
* @package ithoughts-tooltip-glossary
*
* @version 4.0.0
*/


/*
Plugin Name: iThoughts Tooltip Glossary
Plugin URI:  http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Description: Create beautiful tooltips for descriptions or glosses easily
Version:     4.0.0
Author:      Gerkin
License:     GPLv3
Text Domain: ithoughts-tooltip-glossary
Domain Path: /lang
*/

namespace ithoughts\TooltipGlossary;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

define('BASE_PATH', plugin_dir_path(__FILE__));
define('BASE_URL', plugin_dir_url(__FILE__));
require_once BASE_PATH . 'vendor/autoload.php';

use \DI\ContainerBuilder;

if(!class_exists( __NAMESPACE__ . '\\Dependency_Manager' )){
    final class Dependency_Manager {
        /**
         * @var \DI\Container
         */
        protected $container;

        /**
         * @var \DI\ContainerBuilder
         */
        protected $container_builder;
        
        /**
         * @var Dependency_Manager
         */
        protected static $instance;
        
        /**
         * Creates a new instance of the Dependency_Manager of iThoughts Tooltip Glossary
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
                bdump('Register back');
                $instance->register_back_definitions();
            } else {
                bdump('Register front');
                $instance->register_front_definitions();
            }
        }

        /**
         * Register the dependencies used by the back & the front
         */
        protected function register_common_definitions(): void {
            $this->container_builder->addDefinitions([
                'text-domain' => 'ithoughts-tooltip-glossary',
            ]);
        }

        /**
         * Register the dependencies used by the front
         */
        protected function register_front_definitions(): void {
            $this->container_builder->addDefinitions([]);
        }

        /**
         * Register the dependencies used by the back
         */
        protected function register_back_definitions(): void {
            $this->container_builder->addDefinitions([]);
        }

        
        /**
         * Returns the single instance of the dependency manager
         */
        public static function get_instance() : Dependency_Manager {
            if( null == static::$instance ){
                static::$instance = new static();
            }
            
            return static::$instance;
        }
        
        /**
         * Returns the container of the dependency manager
         */
        public function get_container() :  \DI\Container {
            if($this->container === null){
                bdump('Seal');
                $this->container = $this->container_builder->build();
            }
            return $this->container;
        }
    }
    
    // Initialize the plugin if not already loaded.
    add_action( 'init', [__NAMESPACE__.'\\Dependency_Manager' , 'load'], 2);
}
