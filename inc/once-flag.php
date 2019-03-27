<?php

namespace ithoughts\TooltipGlossary;

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

const LOADED_VAR_NAME = 'iThoughtsTooltipGlossaryLoaded';

$call_stacks = [];

if(!function_exists( __NAMESPACE__ . '\\once_flag' )){
    /**
     * Check if the once was called, and register it as called. Additionnaly, it may register the stack trace of the call if WP_DEBUG is set to `true`.
     *
     * @param string $key The key of the once.
     * @return boolean indicating if the once was called for the first time.
     */
    function once_flag(string $key): bool {
        $full_key = LOADED_VAR_NAME.'-'.$key;
        if(!defined($full_key)){
            define($full_key, true);
            if(defined('WP_DEBUG') && WP_DEBUG){
                $call_stacks[$full_key] = debug_backtrace();
            }
            return true;
        }
        return false;
    }
}
if(!function_exists( __NAMESPACE__ . '\\once_get_last_call' )){
    /**
     * Returns the stack trace of the last call of the once
     *
     * @param string $key The key of the once
     * @return array|null the stack trace of the last once call.
     */
    function once_get_last_call(string $key): ?array {
        $full_key = LOADED_VAR_NAME.'-'.$key;
        return $call_stacks[$full_key];
    }
}
if(!class_exists( __NAMESPACE__ . '\\MultipleCallException' )){
    /**
     * The MultipleCallException is triggered when a {@link once_flag} is called more than once. It gives informations about the previous call.
     */
    final class MultipleCallException extends \LogicException{
        /**
         * @var string The key of the once.
         */
        protected $key;

        /**
         * Create a new MultipleCallException with the specified reason & once key.
         *
         * @param string $reason A description of why this error was triggered.
         * @param string $key    The name of the once that triggered this error.
         */
        public function __construct(string $reason, string $key){
            $this->key = $key;
            $last_call = once_get_last_call($this->key);
            $full_message = "{$this->reason}\nLast call was: $last_call";
            parent::__construct($full_message);
        }
    }
}
