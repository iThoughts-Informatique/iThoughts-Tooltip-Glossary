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
			'termcontent' => 'full',
			'termlinkopt' => 'blank',
			'qtipstyle' => 'bootstrap',
			'verbosity' => 1,
		), false);
		$this->assertEqualSets(array(
			'termcontent' => 'full',
			'termlinkopt' => 'blank',
		), $ret);
		// Test for client overrides

		$ret = $backbone->override_options(array(
			'termcontent' => 'full',
			'termlinkopt' => 'blank',
			'qtipstyle' => 'bootstrap',
			'verbosity' => 1,
		), true);
		$this->assertEqualSets(array(
			'termcontent' => 'full',
			'qtipstyle' => 'bootstrap',
		), $ret);


		//		$blog_id = $this->factory->blog->create();
		//		$blog_id_array = $this->factory->blog->create_many( 4 );
		return;
		$post_id = $this->factory->post->create();
		$post_id_array = $this->factory->post->create_many( 4 );
		$comment_id = $this->factory->comment->create();
		$comment_id_array = $this->factory->comment->create_many( 4 );
		$user_id = $this->factory->user->create( array( 'user_login' => 'test', 'role' => 'administrator' ) );
		$user_id_array = $this->factory->user->create_many( 4 );
		$term_id = $this->factory->term->create( array( 'name' => 'Term Name', 'taxonomy' => 'category', 'slug' => 'term-slug' ) );
		$term_id_array = $this->factory->term->create_many( 4, array( 'taxonomy' => 'category' ));

	}
}
