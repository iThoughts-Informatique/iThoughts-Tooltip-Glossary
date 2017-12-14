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
	private $backbone_class;

	public function __construct(){
		$this->backbone_class = \ithoughts\tooltip_glossary\Backbone::get_instance();
		call_user_func_array(array('parent', '__construct'), func_get_args());
	}

	public function test_glossary_filter_no_static() {
		$this->backbone_class->set_option('staticterms', false);
		$post_id = $this->factory->post->create(array(
			'post_type' => 'glossary',
			'post_title' => EXAMPLE_GLOSSARY_TITLE,
			'post_content' => EXAMPLE_GLOSSARY_CONTENT,
		));
		$post = get_post($post_id);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-id="'.$post->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, $post->ID)
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-contenttype="full" data-glossary-id="'.$post->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, $post->ID, array(
				'glossary-contenttype' => 'full',
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-id="'.$post->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, $post->ID, array(
				'glossary-contenttype' => 'excerpt',
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-contenttype="off" data-glossary-id="'.$post->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, $post->ID, array(
				'glossary-contenttype' => 'off',
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-id="'.$post->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, $post->post_name)
		);
		// With not found
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary itg-invalid" data-glossary-content="'.esc_attr__('Sorry, this glossary does not exists.', 'ithoughts-tooltip-glossary').'" href="javascript:void(0);" title="'.esc_attr__('Not found', 'ithoughts-tooltip-glossary').'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, NOT_FOUND_ID, array(
				'glossary-contenttype' => 'full',
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary itg-invalid" data-glossary-content="'.esc_attr__('Sorry, this glossary does not exists.', 'ithoughts-tooltip-glossary').'" href="javascript:void(0);" title="'.esc_attr__('Not found', 'ithoughts-tooltip-glossary').'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, NOT_FOUND_ID, array(
				'glossary-contenttype' => 'excerpt',
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary itg-invalid" href="javascript:void(0);" title="'.esc_attr__('Not found', 'ithoughts-tooltip-glossary').'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, NOT_FOUND_ID, array(
				'glossary-contenttype' => 'off',
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary itg-invalid" href="javascript:void(0);" title="'.esc_attr__('Not found', 'ithoughts-tooltip-glossary').'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, 'NOT_FOUND', array(
				'glossary-contenttype' => 'off',
			))
		);
		// Default title
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-id="'.$post->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE.'">'.EXAMPLE_GLOSSARY_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', NULL, $post->ID)
		);
		// Default title with not found
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary itg-invalid" data-glossary-content="'.esc_attr__('Sorry, this glossary does not exists.', 'ithoughts-tooltip-glossary').'" href="javascript:void(0);" title="'.esc_attr__('Not found', 'ithoughts-tooltip-glossary').'">'.esc_html__('Not found', 'ithoughts-tooltip-glossary').'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', NULL, NOT_FOUND_ID)
		);
	}

	public function test_glossary_filter_static() {
		$this->backbone_class->set_option('staticterms', true);
		$post_id = $this->factory->post->create(array(
			'post_type' => 'glossary',
			'post_title' => EXAMPLE_GLOSSARY_TITLE_2,
			'post_content' => EXAMPLE_GLOSSARY_CONTENT_2,
		));
		$post = get_post($post_id);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-content="'.esc_attr(apply_filters('ithoughts_tt_gl_glossary_excerpt', $post)).'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE_2.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, $post->ID)
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-content="'.esc_attr(apply_filters('ithoughts_tt_gl_glossary_content', $post)).'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE_2.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, $post->ID, array(
				'glossary-contenttype' => 'full',
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-content="'.esc_attr(apply_filters('ithoughts_tt_gl_glossary_excerpt', $post)).'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE_2.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, $post->ID, array(
				'glossary-contenttype' => 'excerpt',
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE_2.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, $post->ID, array(
				'glossary-contenttype' => 'off',
			))
		);
		// With not found
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary itg-invalid" data-glossary-content="'.esc_attr__('Sorry, this glossary does not exists.', 'ithoughts-tooltip-glossary').'" href="javascript:void(0);" title="'.esc_attr__('Not found', 'ithoughts-tooltip-glossary').'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, NOT_FOUND_ID, array(
				'glossary-contenttype' => 'full',
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary itg-invalid" data-glossary-content="'.esc_attr__('Sorry, this glossary does not exists.', 'ithoughts-tooltip-glossary').'" href="javascript:void(0);" title="'.esc_attr__('Not found', 'ithoughts-tooltip-glossary').'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, NOT_FOUND_ID, array(
				'glossary-contenttype' => 'excerpt',
			))
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary itg-invalid" href="javascript:void(0);" title="'.esc_attr__('Not found', 'ithoughts-tooltip-glossary').'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_glossary', EXAMPLE_TITLE, NOT_FOUND_ID, array(
				'glossary-contenttype' => 'off',
			))
		);
	}

	public function test_glossary_shortcode(){
		$post_id_1 = $this->factory->post->create(array(
			'post_type' => 'glossary',
			'post_title' => EXAMPLE_GLOSSARY_TITLE,
			'post_content' => EXAMPLE_GLOSSARY_CONTENT,
		));
		$post_1 = get_post($post_id_1);
		$post_id_2 = $this->factory->post->create(array(
			'post_type' => 'glossary',
			'post_title' => EXAMPLE_GLOSSARY_TITLE_2,
			'post_content' => EXAMPLE_GLOSSARY_CONTENT_2,
		));
		$post_2 = get_post($post_id_2);

		$this->backbone_class->set_option('staticterms', true);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-content="'.esc_attr(apply_filters('ithoughts_tt_gl_glossary_excerpt', $post_1)).'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post_1->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-glossary glossary-id="'.$post_1->ID.'"]'.EXAMPLE_TITLE.'[/itg-glossary]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-content="'.esc_attr(apply_filters('ithoughts_tt_gl_glossary_content', $post_2)).'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post_2->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE_2.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-glossary glossary-id="'.$post_2->ID.'" glossary-contenttype="full"]'.EXAMPLE_TITLE.'[/itg-glossary]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-content="'.esc_attr(apply_filters('ithoughts_tt_gl_glossary_excerpt', $post_1)).'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post_1->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-glossary glossary-id="'.$post_1->post_name.'"]'.EXAMPLE_TITLE.'[/itg-glossary]')
		);

		$this->backbone_class->set_option('staticterms', false);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-id="'.$post_1->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post_1->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-glossary glossary-id="'.$post_1->ID.'"]'.EXAMPLE_TITLE.'[/itg-glossary]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-contenttype="full" data-glossary-id="'.$post_2->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post_2->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE_2.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-glossary glossary-id="'.$post_2->ID.'" glossary-contenttype="full"]'.EXAMPLE_TITLE.'[/itg-glossary]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-id="'.$post_1->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post_1->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-glossary glossary-id="'.$post_1->post_name.'"]'.EXAMPLE_TITLE.'[/itg-glossary]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-id="'.$post_2->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post_2->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE_2.'">'.$post_2->post_name.'</a>',
			do_shortcode( '[itg-glossary]'.$post_2->post_name.'[/itg-glossary]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-glossary" data-glossary-id="'.$post_2->ID.'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.$post_2->post_name.'" title="'.EXAMPLE_GLOSSARY_TITLE_2.'">'.EXAMPLE_GLOSSARY_TITLE_2.'</a>',
			do_shortcode( '[itg-glossary]'.EXAMPLE_GLOSSARY_TITLE_2.'[/itg-glossary]')
		);
	}
}
