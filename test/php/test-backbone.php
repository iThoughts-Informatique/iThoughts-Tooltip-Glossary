<?php
/**
 * Class SampleTest
 *
 * @package Ithoughts_Tooltip_Glossary
 */

/**
 * Sample test case.
 */
class ITGBackboneTest extends WP_UnitTestCase {

	/**
	 * A single example test.
	 */
	function test_options_override() {
		$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();

		// Test for server overrides
		$ret = $backbone->override_options(array(
			'glossary-contenttype' => 'full',
			'termlinkopt' => 'blank',
			'qtipstyle' => 'bootstrap',
			'verbosity' => 1,
		), false);
		$this->assertEqualSets(array(
			'glossary-contenttype' => 'full',
			'termlinkopt' => 'blank',
		), $ret);
		// Test for client overrides

		$ret = $backbone->override_options(array(
			'glossary-contenttype' => 'full',
			'termlinkopt' => 'blank',
			'qtipstyle' => 'bootstrap',
			'verbosity' => 1,
		), true);
		$this->assertEqualSets(array(
			'glossary-contenttype' => 'full',
			'qtipstyle' => 'bootstrap',
		), $ret);
	}
}
