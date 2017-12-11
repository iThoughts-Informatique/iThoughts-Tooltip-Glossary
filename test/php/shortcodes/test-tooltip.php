<?php
/**
 * Class ITGTooltipTest
 *
 * @package Ithoughts_Tooltip_Glossary
 */

/**
 * Sample test case.
 */

class ITGTooltipTest extends WP_UnitTestCase {

	/**
	 * A single example test.
	 */
	function test_tooltip_filter() {
		$this->assertDiscardWhitespace(
			'<span class="itg-tooltip" data-tooltip-content="'.EXAMPLE_CONTENT.'"><a href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a></span>',
			apply_filters( 'ithoughts_tt_gl_tooltip', EXAMPLE_TITLE, EXAMPLE_CONTENT)
		);
		$this->assertDiscardWhitespace(
			'<span class="itg-tooltip" data-tooltip-content="'.EXAMPLE_CONTENT.'"><a href="'.EXAMPLE_URL.'" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a></span>',
			apply_filters( 'ithoughts_tt_gl_tooltip', EXAMPLE_TITLE, EXAMPLE_CONTENT, array('linkAttrs' => array(
				'href' => EXAMPLE_URL,
			)))
		);
		$this->assertDiscardWhitespace(
			'<span class="itg-tooltip '.EXAMPLE_CLASS.'" data-tooltip-content="'.EXAMPLE_CONTENT.'"><a class="'.EXAMPLE_CLASS.'" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a></span>',
			apply_filters( 'ithoughts_tt_gl_tooltip', EXAMPLE_TITLE, EXAMPLE_CONTENT, array('linkAttrs' => array(
				'class' => EXAMPLE_CLASS,
			), 'attributes' => array(
				'class' => EXAMPLE_CLASS,
			)))
		);
		/*apply_filters( 'ithoughts_tt_gl_tooltip', EXAMPLE_TITLE, EXAMPLE_CONTENT, array(
			'attributes' => array(
				'tooltip-nosolo' => 'true',
			),
		) );*/
	}
	
	function test_tooltip_shortcode(){
		var_dump(do_shortcode('[itg-tooltip data-content="Hello"]Inner[/itg-tooltip]'));
	}
}
