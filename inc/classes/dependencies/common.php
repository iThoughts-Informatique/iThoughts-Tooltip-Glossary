<?php

namespace ithoughts\TooltipGlossary;

use function \ithoughts\TooltipGlossary\once_flag;
use \ithoughts\TooltipGlossary\MultipleCallException;
use function \DI\create;
use function \DI\get;
use ithoughts\TooltipGlossary\ResourceType\Post\Glossary as Post_Glossary;
use ithoughts\TooltipGlossary\ResourceType\Taxonomy\GlossaryGroup as Taxonomy_GlossaryGroup;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

if(!once_flag('common-dependency-config')){
    throw new MultipleCallException('Double call to dependency injection config file.', 'common-dependency-config');
}

$base_plugin_dir = dirname(__FILE__, 3);
$base_path = plugin_dir_path($base_plugin_dir);
$base_url = plugin_dir_url($base_plugin_dir);
$relative_assets_dir = 'assets/dist/';

return [
    'text-domain'                 => 'ithoughts-tooltip-glossary',
    'base-path'                   => $base_path,
    'base-url'                    => $base_url,
    'assets-path'                 => "$base_path$relative_assets_dir",
    'assets-url'                  => "$base_url$relative_assets_dir",
    Post_Glossary::class          => create()->constructor(get('text-domain')),
    Taxonomy_GlossaryGroup::class => create()->constructor(get('text-domain')),
];
