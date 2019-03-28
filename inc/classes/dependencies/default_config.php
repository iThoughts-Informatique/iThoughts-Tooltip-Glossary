<?php

namespace ithoughts\TooltipGlossary;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

if(!once_flag('default-config')){
    throw new MultipleCallException('Double call to default configuration file.', 'default-config');
}

return [];
