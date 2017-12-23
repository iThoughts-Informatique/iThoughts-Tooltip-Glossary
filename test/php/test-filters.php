<?php
/**
 * Class ITGTooltipTest
 *
 * @package Ithoughts_Tooltip_Glossary
 */

/**
 * Sample test case.
 */

class ITGFiltersTest extends WP_UnitTestCase {
	private $filters_class;

	public function __construct(){
		$this->filters_class = \ithoughts\tooltip_glossary\Filters::get_instance();
		call_user_func_array(array('parent', '__construct'), func_get_args());
	}

	function test_split_attrs() {
		$this->assertEquals(array(
			'handled' => array('tooltip-content' => 'bar'),
			'serverSide' => array(),
			'clientSide' => array(),
			'attributes' => array(),
		), $this->filters_class->split_attrs(array('tooltip-content' => 'bar')));

		$this->assertEquals(array(
			'handled' => array(),
			'serverSide' => array('termlinkopt' => 'bar'),
			'clientSide' => array(),
			'attributes' => array(),
		), $this->filters_class->split_attrs(array('termlinkopt' => 'bar')));

		$this->assertEquals(array(
			'handled' => array(),
			'serverSide' => array(),
			'clientSide' => array('tip-style' => 'bar'),
			'attributes' => array(),
		), $this->filters_class->split_attrs(array('tip-style' => 'bar')));

		$this->assertEquals(array(
			'handled' => array(),
			'serverSide' => array(),
			'clientSide' => array(),
			'attributes' => array('foo' => 'bar'),
		), $this->filters_class->split_attrs(array('foo' => 'bar')));

		$this->assertEquals(array(
			'handled' => array(),
			'serverSide' => array('gloss-contenttype' => 'bar'),
			'clientSide' => array('gloss-contenttype' => 'bar'),
			'attributes' => array(),
		), $this->filters_class->split_attrs(array('gloss-contenttype' => 'bar')));
	}
	
	function test_split_attrs_filter() {
		$this->assertEquals(array(
			'handled' => array('tooltip-content' => 'bar'),
			'serverSide' => array(),
			'clientSide' => array(),
			'attributes' => array(),
		),apply_filters('ithoughts_tt_gl-split-attributes', array('tooltip-content' => 'bar')));

		$this->assertEquals(array(
			'handled' => array(),
			'serverSide' => array('termlinkopt' => 'bar'),
			'clientSide' => array(),
			'attributes' => array(),
		), apply_filters('ithoughts_tt_gl-split-attributes', array('termlinkopt' => 'bar')));

		$this->assertEquals(array(
			'handled' => array(),
			'serverSide' => array(),
			'clientSide' => array('tip-style' => 'bar'),
			'attributes' => array(),
		), apply_filters('ithoughts_tt_gl-split-attributes', array('tip-style' => 'bar')));

		$this->assertEquals(array(
			'handled' => array(),
			'serverSide' => array(),
			'clientSide' => array(),
			'attributes' => array('foo' => 'bar'),
		), apply_filters('ithoughts_tt_gl-split-attributes', array('foo' => 'bar')));

		$this->assertEquals(array(
			'handled' => array(),
			'serverSide' => array('gloss-contenttype' => 'bar'),
			'clientSide' => array('gloss-contenttype' => 'bar'),
			'attributes' => array(),
		), apply_filters('ithoughts_tt_gl-split-attributes', array('gloss-contenttype' => 'bar')));
	}
}
