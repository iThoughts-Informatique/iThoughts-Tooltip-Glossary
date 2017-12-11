<?php
/**
 * Class ITGTooltipTest
 *
 * @package Ithoughts_Tooltip_Glossary
 */

/**
 * Sample test case.
 */

class ITGGlossaryTest extends WP_UnitTestCase {

	/**
	 * A single example test.
	 */
	function test_glossary_filter() {
		$post_id = $this->factory->post->create(array(
			'post_type' => 'glossary',
			'post_title' => EXAMPLE_GLOSSARY_TITLE,
			'post_content' => EXAMPLE_GLOSSARY_CONTENT,
		));
		$post = get_post($post_id);
		$this->assertDiscardWhitespace(
			'<span  class="itg-glossary" data-termid="'.$post_id.'"><a  href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a></span>',
			apply_filters( 'ithoughts_tt_gl_glossary', $post_id, EXAMPLE_TITLE)
		);
		$this->assertDiscardWhitespace(
			'<span  class="itg-glossary" data-termcontent="full" data-termid="'.$post_id.'"><a  href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a></span>',
			apply_filters( 'ithoughts_tt_gl_glossary', $post_id, EXAMPLE_TITLE, array(
				'termcontent' => 'full',
			))
		);
	}
	
	function test_tooltip_shortcode(){
//		var_dump(do_shortcode('[itg-tooltip data-content="Hello"]Inner[/itg-tooltip]'));
	}
}
