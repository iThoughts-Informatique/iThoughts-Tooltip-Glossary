<?php

namespace ithoughts\TooltipGlossary\AssetRegistration;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\DependencyManager;
use ithoughts\TooltipGlossary\Manifest;

if(!class_exists( __NAMESPACE__ . '\\StyleRegistration' )){
    /**
     * This class manages styles registrations (`.css`)
     */
    class StyleRegistration extends AAssetRegistration {
        // Abstract methods implementation

        /**
         * Resolve constructor dependencies and generate a new registration.
         *
         * @param string $identifier The asset's identifier to register.
         * @param array $dependencies The list of assets' handle this asset depends on.
         * @return self This.
         */
        protected static function make(string $identifier, array $dependencies): parent {
            $manifest = DependencyManager::get(Manifest::class);
            $text_domain = DependencyManager::get('text-domain');
            return new static($identifier, $dependencies, $manifest, $text_domain);
        }

        /**
         * Returns the type of the subclass asset (so, `style`).
         *
         * @return string The type.
         */
        protected static function get_type(): string {
            return 'style';
        }
        
        /**
         * Run the Wordpress' enqueue function `wp_enqueue_style`).
         *
         * @return self This.
         */
        protected function enqueue_asset(): void {
            \wp_enqueue_style($this->handle);
        }

        /**
         * Run the Wordpress' register function `wp_register_style`.
         *
         * @return void
         */
        protected function register(): void {
            \wp_register_style($this->handle, $this->manifest->get_url($this->identifier), $this->dependencies);
        }
    }
}
