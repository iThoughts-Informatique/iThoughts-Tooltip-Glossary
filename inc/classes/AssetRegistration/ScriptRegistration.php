<?php

namespace ithoughts\TooltipGlossary\AssetRegistration;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\DependencyManager;
use ithoughts\TooltipGlossary\Manifest;

if(!class_exists( __NAMESPACE__ . '\\ScriptRegistration' )){
    /**
     * This class manages scripts registrations (`.js`)
     */
    class ScriptRegistration extends AAssetRegistration {
        /**
         * @var array The list of data blocks registered for the asset.
         */
        protected $script_data = [];

        // Parent method overrides

        /**
         * Register the resource as a gutenberg's block type, using the provided config. The current asset being a script, the value of `editor_script` is forced.
         *
         * @param string $block_name The name of the block.
         * @param array $block_config The object to pass to [`register_block_type`](https://developer.wordpress.org/reference/functions/register_block_type/).
         * @return self This.
         */
        public function as_block_type(string $block_type, array $block_config = []): parent {
            \register_block_type($this->text_domain.'/'.$block_type, array_merge($block_config, [
                'editor_script' => $this->handle,
            ]));
            return $this->as_block_editor_asset();
        }

        public function as_tinymce_plugin(string $plugin_name, array $buttons = []): parent {
            add_filter( 'mce_buttons', function(array $before_buttons) use ($buttons, $plugin_name){
                return array_merge($before_buttons, array_map(function(string $button) use ($plugin_name){
                    return $plugin_name.'/'.$button;
                }, $buttons));
            });
            add_filter( 'mce_external_plugins', function( $plugin_array ) use ( $plugin_name ) {
                $plugin_array[$plugin_name] = $this->get_url();
                $this->enqueue();
                return $plugin_array;
            } );
            return $this;
        }
        
        /**
         * Add data to pass to the client as the specified global when the script is enqueued.
         *
         * @param string $global_name The name of the global to define.
         * @param callable $data_factory The factory function that returns the data when enqueued.
         * @return self This.
         */
        public function add_data(string $global_name, callable $data_factory): parent {
            $this->script_data[] = [
                'global' => $global_name,
                'data'   => $data_factory,
            ];
            return $this;
        }

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
         * Returns the type of the subclass asset (so, `script`).
         *
         * @return string The type.
         */
        protected static function get_type(): string {
            return 'script';
        }
        
        /**
         * Run the Wordpress' enqueue function `wp_enqueue_script`).
         *
         * @return self This.
         */
        protected function enqueue_asset(): void {
            foreach ($this->script_data as $data_entry) {
                \wp_localize_script($this->handle, $data_entry['global'], $data_entry['data']());
            }
            \wp_enqueue_script($this->handle);
        }

        /**
         * Run the Wordpress' register function `wp_register_style`.
         *
         * @return void
         */
        protected function register(): void {
            \wp_register_script($this->handle, $this->get_url(), $this->dependencies);
            \wp_set_script_translations($this->handle, $this->text_domain);
        }
    }
}
