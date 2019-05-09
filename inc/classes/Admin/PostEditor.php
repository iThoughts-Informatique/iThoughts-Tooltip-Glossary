<?php

namespace ithoughts\TooltipGlossary\Admin;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\DependencyManager;
use ithoughts\TooltipGlossary\Manifest;
use ithoughts\TooltipGlossary\AssetRegistration\AAssetRegistration;
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
        protected $text_domain;

        /**
         * Create the post editor managing instance.
         *
         * @param Manifest $manifest The manifest to use for URLs resolution.
         * @param string $text_domain The plugin's resource namespace.
         */
        public function __construct(Manifest $manifest, string $text_domain){
            $this->manifest = $manifest;
            $this->text_domain = $text_domain;
        }

        /**
         * Register scripts, styles, blocks, hooks, etc etc, used to initialize the plugin's post editor components.
         *
         * @return void
         */
        public function register(){
            $back_common_style = AAssetRegistration::get('back-common.css');
            $back_common_script = AAssetRegistration::get('back-common.js', ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-plugins', 'wp-edit-post', 'wp-data', 'wp-api', $back_common_style])
                ->add_data('ithoughtsTooltipGlossary_editorConfig', function(){
                    return [
                        'manifest'            => $this->manifest->get_manifest(),
                        'controllerNamespace' => GlossaryTermController::namespace,
                    ];
                } )
                ->as_block_type('glossarytip')
                ->as_block_type('tooltip');
            
            $back_classic_style = AAssetRegistration::get('back-editor-classic.css');
            // Register the tinymce script
            AAssetRegistration::get('back-editor-classic.js', [$back_common_script, $back_classic_style])
                ->as_tinymce_plugin('ithoughts-tooltip-glossary', ['add-glossarytip', 'add-tooltip', 'remove-tip', 'add-list']);
        }
    }
}
