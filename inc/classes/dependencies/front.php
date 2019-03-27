<?php

namespace ithoughts\TooltipGlossary\Front;

use function \ithoughts\TooltipGlossary\once_flag;
use \ithoughts\TooltipGlossary\MultipleCallException;
use function \DI\object;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

if(!once_flag('front-dependency-config')){
    throw new MultipleCallException('Double call to dependency injection config file.', 'front-dependency-config');
}

return [];
