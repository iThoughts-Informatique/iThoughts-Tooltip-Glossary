<?php

namespace ithoughts\TooltipGlossary;

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

const LOADED_VAR_NAME = 'iThoughtsTooltipGlossaryLoaded';

if(!function_exists( __NAMESPACE__ . '\\once_flag' )){
    function once_flag(string $key): bool {
        $fullKey = LOADED_VAR_NAME.'-'.$key;
        if(!defined($fullKey)){
            define($fullKey, true);
            return true;
        }
        return false;
    }
}
