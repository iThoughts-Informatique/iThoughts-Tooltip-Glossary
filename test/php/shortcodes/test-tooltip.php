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
			'<a class="itg-tooltip" data-tooltip-content="'.EXAMPLE_CONTENT.'" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_tooltip', EXAMPLE_TITLE, EXAMPLE_CONTENT)
		);
		$this->assertDiscardWhitespace(
			'<a  class="itg-tooltip" data-tooltip-content="'.EXAMPLE_CONTENT.'" href="'.EXAMPLE_URL.'" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_tooltip', EXAMPLE_TITLE, EXAMPLE_CONTENT, array(
				'href' => EXAMPLE_URL,
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-tooltip '.EXAMPLE_CLASS.'" data-tooltip-content="'.EXAMPLE_CONTENT.'" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_tooltip', EXAMPLE_TITLE, EXAMPLE_CONTENT, array(
				'class' => EXAMPLE_CLASS,
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-tooltip" data-tooltip-content="'.EXAMPLE_CONTENT.'" href="javascript:void(0);" title="'.EXAMPLE_TITLE_2.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_tooltip', EXAMPLE_TITLE, EXAMPLE_CONTENT, array(
				'title' => EXAMPLE_TITLE_2,
			))
		);
	}
	
	function test_tooltip_shortcode(){
		$this->assertDiscardWhitespace(
			'<a class="itg-tooltip" data-tooltip-content="'.EXAMPLE_CONTENT.'" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-tooltip tooltip-content="'.EXAMPLE_CONTENT.'"]'.EXAMPLE_TITLE.'[/itg-tooltip]')
		);
		$this->assertDiscardWhitespace(
			'<a  class="itg-tooltip" data-tooltip-content="'.EXAMPLE_CONTENT.'" href="'.EXAMPLE_URL.'" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-tooltip tooltip-content="'.EXAMPLE_CONTENT.'" href="'.EXAMPLE_URL.'"]'.EXAMPLE_TITLE.'[/itg-tooltip]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-tooltip '.EXAMPLE_CLASS.'" data-tooltip-content="'.EXAMPLE_CONTENT.'" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-tooltip tooltip-content="'.EXAMPLE_CONTENT.'" class="'.EXAMPLE_CLASS.'"]'.EXAMPLE_TITLE.'[/itg-tooltip]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-tooltip" data-tooltip-content="'.EXAMPLE_CONTENT.'" href="javascript:void(0);" title="'.EXAMPLE_TITLE_2.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-tooltip tooltip-content="'.EXAMPLE_CONTENT.'" title="'.EXAMPLE_TITLE_2.'"]'.EXAMPLE_TITLE.'[/itg-tooltip]')
		);
	}
}
