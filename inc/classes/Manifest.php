<?php

namespace ithoughts\TooltipGlossary;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

if(!class_exists( __NAMESPACE__ . '\\Manifest' )){
    /**
     * The Manifest class is used to associate a constant resource identifier with a hashed filename. It allows to facilitate browser's cache invalidation, without changing the actual code.
     * 
     * It sources its content from the `manifest.json` file in the `assets/dist` directory, along with the output resources.
     */
    final class Manifest {
        private $manifest_content;
        private $assets_url;

        /**
         * Create a new Manifest handler.
         * 
         * Since this class is already lazy-loaded, a call to the constructor means that the manifest is actually used. We then populate the manifest content right now.
         */
        public function __construct(string $assets_path, string $assets_url){
            // TODO: Use cache: https://codex.wordpress.org/Class_Reference/WP_Object_Cache
            $manifest_text_content = file_get_contents($assets_path.'manifest.json');
            $this->manifest_content = \json_decode($manifest_text_content, true);

            $this->assets_url = $assets_url;
        }

        /**
         * Get the URL to the resource with the specified identifier.
         *
         * @param  string $identifier The identifier of the resource to get.
         * @return string The URL to the desired resource.
         * @throws \DomainException if the identifier is not present in the source manifest.
         */
        public function get_url(string $identifier): string {
            if(!isset($this->manifest_content[$identifier])){
                throw new \DomainException("Unkown asset identifier: `$identifier`");
            }
            return "{$this->assets_url}{$this->manifest_content[$identifier]}";
        }

        /**
         * Get the whole manifest content
         *
         * @return array An associative array maping an identifier with an url.
         */
        public function get_manifest(): array {
            $manifest_content = $this->manifest_content;
            array_walk($manifest_content, function(&$asset_url, $asset_identifier){
                $asset_url = $this->get_url($asset_identifier);
            });
            return $manifest_content;
        }
    }
}
