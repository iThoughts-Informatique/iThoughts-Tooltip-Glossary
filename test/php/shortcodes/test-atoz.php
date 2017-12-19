<?php
/**
 * Class ITGTooltipTest
 *
 * @package Ithoughts_Tooltip_Glossary
 */

/**
 * Sample test case.
 */

class ITGAtoZTest extends WP_UnitTestCase {
	private $backbone_class;
	const ATOZ_MENU = '<ul class="glossary-menu-atoz"><li class="glossary-menu-item atoz-menu-E itg-atoz-clickable itg-atoz-menu-off" title="E: 1 term begining with character &quot;E&quot;"  data-alpha="E"><a href="#E">E</a></li><li class="glossary-menu-item atoz-menu-F itg-atoz-clickable itg-atoz-menu-off" title="F: 1 term begining with character &quot;F&quot;"  data-alpha="F"><a href="#F">F</a></li></ul>';
	private $SEPARATOR;


	private function get_tip_content($post){
		return apply_filters( 'ithoughts_tt_gl_gloss', null, $post);
	}

	private function get_link_content($post){
		return '<a title="'.esc_attr($post->post_title).'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.esc_attr($post->post_name).'">'.esc_html($post->post_title).'</a>';
	}

	private function get_excerpt_content($post){
		return '<header class="entry-header"><h5 class="entry-title"><a title="'. $post->post_title .'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.esc_attr($post->post_name).'">' . $post->post_title . '</a></h5></header><div class="entry-content clearfix"><p>' . apply_filters('get_the_excerpt',$post->post_content) . '</p></div>';
	}

	private function get_full_content($post){
		return '<header class="entry-header"><h5 class="entry-title"><a title="'. $post->post_title .'" href="http://'.WP_TESTS_DOMAIN.'/?glossary='.esc_attr($post->post_name).'">' . $post->post_title . '</a></h5></header><div class="entry-content clearfix"><p>' . apply_filters('get_the_content',$post->post_content) . '</p></div>';
	}

	public function __construct(){
		$this->backbone_class = \ithoughts\tooltip_glossary\Backbone::get_instance();
		call_user_func_array(array('parent', '__construct'), func_get_args());
		$this->SEPARATOR = '<div style="clear: both;"></div><div class="ithoughts_tt_gl-please-select"><p>'.esc_html__('Please select from the menu above', 'ithoughts-tooltip-glossary').'</p></div><div style="clear: both;"></div>';
	}

	public function test_atoz_basic() {
		$this->backbone_class->set_option('list-contenttype', 'tip');
		$this->backbone_class->set_option('staticterms', false);
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

		$this->assertDiscardWhitespace(
			'<div class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_tip_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_tip_content($post_2).'</li></ul></div></div>',
			apply_filters( 'ithoughts_tt_gl_atoz', '')
		);
	}

	public function test_atoz_basic_staticterms() {
		$this->backbone_class->set_option('staticterms', true);
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

		$this->assertDiscardWhitespace(
			'<div class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_tip_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_tip_content($post_2).'</li></ul></div></div>',
			apply_filters( 'ithoughts_tt_gl_atoz', '')
		);
	}

	public function test_atoz_list_contenttype() {
		$this->backbone_class->set_option('staticterms', false);
		$this->backbone_class->set_option('list-contenttype', '');
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

		$this->assertDiscardWhitespace(
			'<div  class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_link_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_link_content($post_2).'</li></ul></div></div>',
			apply_filters( 'ithoughts_tt_gl_atoz', '', null, null, array('list-contenttype' => 'link'))
		);
		$this->assertDiscardWhitespace(
			'<div class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_tip_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_tip_content($post_2).'</li></ul></div></div>',
			apply_filters( 'ithoughts_tt_gl_atoz', '', null, null, array('list-contenttype' => 'tip'))
		);
		$this->assertDiscardWhitespace(
			'<div  class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_excerpt_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_excerpt_content($post_2).'</li></ul></div></div>',
			apply_filters( 'ithoughts_tt_gl_atoz', '', null, null, array('list-contenttype' => 'excerpt'))
		);
		$this->assertDiscardWhitespace(
			'<div  class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_full_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_full_content($post_2).'</li></ul></div></div>',
			apply_filters( 'ithoughts_tt_gl_atoz', '', null, null, array('list-contenttype' => 'full'))
		);
	}

	public function test_atoz_defaults(){
		$this->backbone_class->set_option('staticterms', false);
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

		$this->backbone_class->set_option('list-contenttype', 'link');
		$this->assertDiscardWhitespace(
			apply_filters( 'ithoughts_tt_gl_atoz', '', null, null, array('list-contenttype' => 'link')),
			apply_filters( 'ithoughts_tt_gl_atoz', '')
		);

		$this->backbone_class->set_option('list-contenttype', 'tip');
		$this->assertDiscardWhitespace(
			apply_filters( 'ithoughts_tt_gl_atoz', '', null, null, array('list-contenttype' => 'tip')),
			apply_filters( 'ithoughts_tt_gl_atoz', '')
		);

		$this->backbone_class->set_option('list-contenttype', 'excerpt');
		$this->assertDiscardWhitespace(
			apply_filters( 'ithoughts_tt_gl_atoz', '', null, null, array('list-contenttype' => 'excerpt')),
			apply_filters( 'ithoughts_tt_gl_atoz', '')
		);

		$this->backbone_class->set_option('list-contenttype', 'full');
		$this->assertDiscardWhitespace(
			apply_filters( 'ithoughts_tt_gl_atoz', '', null, null, array('list-contenttype' => 'full')),
			apply_filters( 'ithoughts_tt_gl_atoz', '')
		);
	}

	public function test_atoz_shortcode(){
		$this->backbone_class->set_option('staticterms', false);
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

		$this->backbone_class->set_option('list-contenttype', 'tip');
		$this->assertDiscardWhitespace(
			'<div class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_tip_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_tip_content($post_2).'</li></ul></div></div>',
			do_shortcode( '[itg-atoz /]')
		);
		$this->assertDiscardWhitespace(
			'<div  class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_link_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_link_content($post_2).'</li></ul></div></div>',
			do_shortcode( '[itg-atoz list-contenttype="link" /]')
		);
		$this->assertDiscardWhitespace(
			'<div class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_tip_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_tip_content($post_2).'</li></ul></div></div>',
			do_shortcode( '[itg-atoz list-contenttype="tip" /]')
		);
		$this->assertDiscardWhitespace(
			'<div  class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_excerpt_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_excerpt_content($post_2).'</li></ul></div></div>',
			do_shortcode( '[itg-atoz list-contenttype="excerpt" /]')
		);
		$this->assertDiscardWhitespace(
			'<div  class="itg-glossary-atoz">'.self::ATOZ_MENU.$this->SEPARATOR.'<div class="atoz-wrapper"><ul class="itg-atoz-items itg-atoz-items-E itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-E">'.$this->get_full_content($post_1).'</li></ul><ul class="itg-atoz-items itg-atoz-items-F itg-atoz-items-off"><li class="glossary-item ithoughts-tooltip-glossaryatoz-li atoz-li-F">'.$this->get_full_content($post_2).'</li></ul></div></div>',
			do_shortcode( '[itg-atoz list-contenttype="full" /]')
		);
	}

	public function test_no_fail_invalid_default(){
		$this->backbone_class->set_option('staticterms', false);
		$this->backbone_class->set_option('list-contenttype', '');
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

		$content = apply_filters( 'ithoughts_tt_gl_atoz', '' );
		$this->assertStringStartsWith( '<div class="itg-glossary-atoz">', $content );
		$this->assertStringEndsWith( '</div>', $content );
	}

	public function test_no_fail_invalid_override(){
		$this->backbone_class->set_option('staticterms', false);
		$this->backbone_class->set_option('list-contenttype', 'tip');
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

		$content = apply_filters( 'ithoughts_tt_gl_atoz', '', null , null, array('list-contenttype' => ''));
		$this->assertStringStartsWith( '<div class="itg-glossary-atoz">', $content );
		$this->assertStringEndsWith( '</div>', $content );
	}
}
