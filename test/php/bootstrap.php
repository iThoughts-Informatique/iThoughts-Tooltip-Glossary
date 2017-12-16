<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Ithoughts_Tooltip_Glossary
 */

define('EXAMPLE_URL', 'https://www.gerkindevelopment.net/');
define('EXAMPLE_CLASS', 'some-class');
// Post content
define('EXAMPLE_TITLE', 'A tooltip title');
define('EXAMPLE_TITLE_2', 'Another tooltip title');
define('EXAMPLE_CONTENT', 'This is the content');
// Glossary
define('EXAMPLE_GLOSSARY_TITLE', 'Example glossary');
define('EXAMPLE_GLOSSARY_CONTENT', 'An example helps to represent things...');
define('EXAMPLE_GLOSSARY_TITLE_2', 'Foo');
define('EXAMPLE_GLOSSARY_CONTENT_2', 'Foos fooing bars.');
define('NOT_FOUND_ID', 42);
// Mediatip
define('EXAMPLE_CAPTION', 'A pretty picture');
define('EXAMPLE_MEDIA_TITLE', 'Some pic');
define('EXAMPLE_IMAGE_URL', 'http://via.placeholder.com/350x150');
define('EXAMPLE_VIDEO_URL', 'https://www.youtube.com/embed/Xc4xYacTu-E');

$_tests_dir = getenv( 'WP_TESTS_DIR' );

echo 'Test dir:';
var_dump($_tests_dir);

if ( ! $_tests_dir ) {
	$tried_path = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
	if(file_exists($tried_path)){
		$_tests_dir = $tried_path;
	} else {
		$_tests_dir = dirname(__FILE__) . '/wordpress-tests-lib';
	}
}
echo 'Test final:';
var_dump($_tests_dir);


if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	throw new Exception( "Could not find $_tests_dir/includes/functions.php, have you run bin/install-wp-tests.sh ?" );
}

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	require dirname( dirname( dirname( __FILE__ ) ) ) . '/ithoughts-tooltip-glossary.php';
}
tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';
