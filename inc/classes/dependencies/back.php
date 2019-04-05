<?php

namespace ithoughts\TooltipGlossary\Admin;

use function DI\create;
use function DI\get;

use function ithoughts\TooltipGlossary\once_flag;
use ithoughts\TooltipGlossary\MultipleCallException;
use ithoughts\TooltipGlossary\Manifest;
use ithoughts\TooltipGlossary\Admin\Menu\Manager as Menu_Manager;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

if(!once_flag('back-dependency-config')){
    throw new MultipleCallException('Double call to dependency injection config file.', 'back-dependency-config');
}

return [
    Manifest::class     => create()->constructor(get('assets-path'), get('assets-url')),
    Menu_Manager::class => create()->constructor(get('text-domain')),
];
