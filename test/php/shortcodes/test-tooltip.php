<?php
/**
 * Class ITGTooltipTest
 *
 * @package Ithoughts_Tooltip_Glossary
 */

/**
 * Sample test case.
 */

define('EXAMPLE_URL', 'https://www.gerkindevelopment.net/');
define('EXAMPLE_CLASS', 'some-class');

class ITGTooltipTest extends WP_UnitTestCase {

	/**
	 * A single example test.
	 */
	function test_tooltip_base() {
		$this->assertDiscardWhitespace(
			'<span class="itg-tooltip" data-tooltip-content="SOME CONTENT"><a href="javascript:void(0);" title="THE TITLE">THE TITLE</a></span>',
			apply_filters( 'ithoughts_tt_gl_tooltip', 'THE TITLE', 'SOME CONTENT')
		);
		$this->assertDiscardWhitespace(
			'<span class="itg-tooltip" data-tooltip-content="SOME CONTENT"><a href="'.EXAMPLE_URL.'" title="THE TITLE">THE TITLE</a></span>',
			apply_filters( 'ithoughts_tt_gl_tooltip', 'THE TITLE', 'SOME CONTENT', array('linkAttrs' => array(
				'href' => EXAMPLE_URL,
			)))
		);
		$this->assertDiscardWhitespace(
			'<span class="itg-tooltip '.EXAMPLE_CLASS.'" data-tooltip-content="SOME CONTENT"><a class="'.EXAMPLE_CLASS.'" href="javascript:void(0);" title="THE TITLE">THE TITLE</a></span>',
			apply_filters( 'ithoughts_tt_gl_tooltip', 'THE TITLE', 'SOME CONTENT', array('linkAttrs' => array(
				'class' => EXAMPLE_CLASS,
			), 'attributes' => array(
				'class' => EXAMPLE_CLASS,
			)))
		);
		/*apply_filters( 'ithoughts_tt_gl_tooltip', 'THE TITLE', 'SOME CONTENT', array(
			'attributes' => array(
				'tooltip-nosolo' => 'true',
			),
		) );*/
	}
}
