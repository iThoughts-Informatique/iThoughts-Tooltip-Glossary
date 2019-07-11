<?php

namespace ithoughts\TooltipGlossary\Admin;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\DependencyManager;
use ithoughts\TooltipGlossary\Manifest;
use ithoughts\TooltipGlossary\Controller\GlossaryTermController;

if(!class_exists( __NAMESPACE__ . '\\PostEditor' )){
    /**
     * Register scripts & do Wordpress configuration to initialize the plugin's post editor components.
     */
    class PostEditor{
        /**
         * @var Manifest The manifest to use for URLs resolution.
         */
        protected $manifest;

        /**
         * @var string The plugin's resource namespace.
         */
        protected $app_namespace;

        /**
         * Create the post editor managing instance.
         *
         * @param Manifest $manifest The manifest to use for URLs resolution.
         * @param string $app_namespace The plugin's application namespace.
         */
        public function __construct(Manifest $manifest, string $app_namespace){
            $this->manifest = $manifest;
            $this->app_namespace = $app_namespace;
        }

        /**
         * Register scripts, styles, blocks, hooks, etc etc, used to initialize the plugin's post editor components.
         *
         * @return void
         */
        public function register(){
            DependencyManager::get('asset-back-editor-classic')->enqueue();
        }
    }
}
