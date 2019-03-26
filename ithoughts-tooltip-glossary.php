<?php

/**
* @file Include file for plugin
*
* @author Gerkin
* @copyright 2016 GerkinDevelopment
* @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
* @package ithoughts-tooltip-glossary
*
* @version 4.0.0
*/


/*
Plugin Name: iThoughts Tooltip Glossary
Plugin URI:  http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Description: Create beautiful tooltips for descriptions or glosses easily
Version:     4.0.0
Author:      Gerkin
License:     GPLv3
Text Domain: ithoughts-tooltip-glossary
Domain Path: /lang
*/

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

define('BASE_PATH', plugin_dir_path(__FILE__));
require_once BASE_PATH . 'vendor/autoload.php';

use ithoughts\TooltipGlossary\DependencyManager;

DependencyManager::bootstrap();

