<?php

namespace ithoughts\TooltipGlossary\AssetRegistration;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\DependencyManager;
use ithoughts\TooltipGlossary\Manifest;

if(!class_exists( __NAMESPACE__ . '\\AAssetRegistration' )){
    /**
     * This class manages registrations of assets (typically, using `wp_register_[type]`).
     */
    abstract class AAssetRegistration {
        /**
         * @var array An associative array mapping each registered resource names with the AssetRegistration.
         */
        protected static $registrations = [];

        /**
         * @var string The identifier of the asset (the key in the manifest).
         */
        protected $identifier;

        /**
         * @var string The Wordpress' registration system file identifier. This property is auto-generated.
         */
        protected $handle;

        /**
         * @var array List of assets this asset depends on.
         */
        protected $dependencies = [];

        /**
         * @var array List of assets registrations this asset depends on.
         */
        protected $asset_registration_dependencies = [];

        /**
         * @var Manifest The Manifest to consult to resolve assets urls.
         */
        protected $manifest;

        /**
         * @var string The plugin's slug.
         */
        protected $text_domain;

        /**
         * @var array The list of data blocks registered for the asset.
         */
        protected $script_data = [];
        
        /**
         * Create a new asset registration, store it in the static of current registrations, and register it in Wordpress.
         *
         * @param string $identifier The identifier of the asset (usually, the key in the manifest object).
         * @param array $dependencies The list of assets handles this asset depends on.
         * @param Manifest $manifest The manifest helper to use for assets url resolution.
         * @param string $text_domain The resource namespace of the plugin.
         */
        protected function __construct(string $identifier, array $dependencies, Manifest $manifest, string $text_domain){
            static::$registrations[$identifier] = $this;
            
            $this->identifier = $identifier;
            $this->handle = static::identifier_to_handle($text_domain, $identifier);
            foreach ($dependencies as $dependency) {
                bdump($dependency);
                if($dependency instanceof AAssetRegistration){
                    $this->asset_registration_dependencies[] = $dependency;
                } else {
                    $this->dependencies[] = $dependency;
                }
            };
            $this->manifest = $manifest;
            $this->text_domain = $text_domain;
            
            $this->register();
        }
        
        /**
         * Register the resource as a gutenberg's block editor asset. Typically, it enqueues the asset when the action `enqueue_block_editor_assets` is triggered.
         *
         * @return self This.
         */
        public function as_block_editor_asset(): self {
            add_action('enqueue_block_editor_assets', function(){
                $this->enqueue();
            });
            return $this;
        }

        /**
         * Register the resource as a gutenberg's block type, using the provided config.
         *
         * @param string $block_name The name of the block.
         * @param array $block_config The object to pass to [`register_block_type`](https://developer.wordpress.org/reference/functions/register_block_type/).
         * @return self This.
         */
        public function as_block_type(string $block_name, array $block_config = []): self {
            \register_block_type($this->text_domain.'/'.$block_name, $block_config);
            return $this->as_block_editor_asset();
        }

        /**
         * Add data to pass to the client as the specified global when the asset is enqueued.
         * This method does nothing by default, and may be overriden by subclasses
         *
         * @param string $global_name The name of the global to define.
         * @param callable $data_factory The factory function that returns the data when enqueued.
         * @return self This.
         */
        public function add_data(string $global_name, callable $data_factory): self {
            return $this;
        }

        // Final functions
        
        /**
         * Get an AssetRegistration for the specified asset. If it does not exists, it is registered, else it is retrieved and its
         * dependencies are merged.
         * 
         * This method retrieve the `AssetRegistration.[extension]` key from the
         * Dependency Injection container, and call the static method `register_subtype`.
         *
         * @param string $identifier The name of the asset (the key in the manifest file).
         * @param array $dependencies A list of assets this asset depends on.
         * @return self The newly created instance.
         */
        public final static function get(string $identifier, array $dependencies = []): self {
            if(isset(static::$registrations[$identifier])){
                $asset_registration = static::$registrations[$identifier];
                $asset_registration->merge_dependencies($dependencies);
                return $asset_registration;
            }

            $extension = pathinfo($identifier)['extension'];
            $ctor = DependencyManager::get('AssetRegistration.'.$extension);
            return $ctor::make($identifier, $dependencies);
        }
        
        /**
         * Generate the asset's Wordpress handle fron its identifier.
         *
         * @param string $text_domain The namespace of the plugin's resources.
         * @param string $identifier The identifier of the asset.
         * @return string A Wordpress handle to use to identify this asset.
         */
        protected final static function identifier_to_handle(string $text_domain, string $identifier): string {
            return $text_domain.'--'.\preg_replace_callback('/^(\w+)\.(\w+)$/', function($match){
                $type = static::get_type();
                return "{$match[1]}-$type";
            }, \strtolower($identifier));
        }

        /**
         * Returns the asset's handle.
         *
         * @return string The asset's handle
         */
        public final function get_handle(): string {
            return $this->handle;
        }

        /**
         * Enqueue asset's managed dependencies and the asset itself.
         *
         * @return self This.
         */
        public final function enqueue(): self {
            $this->enqueue_asset_dependencies();
            $this->enqueue_asset();
            return $this;
        }

        /**
         * Enqueue this asset's managed dependencies.
         *
         * @return void
         */
        protected final function enqueue_asset_dependencies(){
            foreach ($this->asset_registration_dependencies as $asset_dependency) {
                $asset_dependency->enqueue();
            }
        }
        
        // Abstract methods

        /**
         * Resolve constructor dependencies and generate a new registration.
         *
         * @param string $identifier The asset's identifier to register.
         * @param array $dependencies The list of assets' handle this asset depends on.
         * @return self This.
         */
        protected abstract static function make(string $identifier, array $dependencies): self;

        /**
         * Returns the type of the subclass asset.
         *
         * @return string The type.
         */
        protected abstract static function get_type(): string;
        
        /**
         * Run the Wordpress' enqueue function, according to the registration type (usually `wp_enqueue_[type]`).
         *
         * @return self This.
         */
        protected abstract function enqueue_asset(): void;
        
        /**
         * Run the Wordpress' register function, according to the registration type (usually `wp_register_[type]`).
         *
         * @return void
         */
        protected abstract function register(): void;
    }
}
