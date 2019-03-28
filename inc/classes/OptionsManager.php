<?php

namespace ithoughts\TooltipGlossary;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use DI\ContainerBuilder;

if(!class_exists( __NAMESPACE__ . '\\OptionsManager' )){
    final class OptionsManager {
        protected $key;
        protected $defaults;
        protected $options;

        public function __construct(string $options_key, array $default_options){
            $this->key = $options_key;
            $this->defaults = $default_options;
            bdump($this);
        }

        public function get(string $key){
            $key_segments = \explode('.', $key);
            $iterator = $this->get_all();
            foreach ($key_segments as $key_segment) {
                if(!isset($iterator[$key_segment])){
                    return null;
                }
                $iterator = $iterator[$key_segment];
            }
            return $iterator;
        }

        public function get_all(): array {
            if($this->options == null){
                $this->options = array_merge($this->defaults, get_option($this->key, $this->defaults));
            }
            return $this->options;
        }
    }
}
