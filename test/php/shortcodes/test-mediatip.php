<?php
/**
 * Class ITGMediatipTest
 *
 * @package Ithoughts_Tooltip_Glossary
 */

/**
 * Sample test case.
 */

class ITGMediatipTest extends WP_UnitTestCase {
	
	private function generate_attachment($url = EXAMPLE_IMAGE_URL, $filename = 'EXAMPLE.png'){
		$content = file_get_contents($url);
		$upload = wp_upload_bits($filename, null, $content);
		$this->assertTrue( empty($upload['error']) );
		return $this->_make_attachment($upload);
	}

	/**
	 * A single example test.
	 */
	function test_mediatip_filter() {
		$attachment_id = $this->generate_attachment();
		$attachment = wp_get_attachment_image_src($attachment_id);

		$this->assertDiscardWhitespace(
			'<a  class="itg-mediatip" data-mediatip-caption="'.EXAMPLE_CAPTION.'" data-mediatip-source="'.$attachment[0].'" data-mediatip-type="localimage" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_mediatip', EXAMPLE_TITLE, 'localimage', $attachment_id, EXAMPLE_CAPTION)
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-mediatip" data-mediatip-caption="'.EXAMPLE_CAPTION.'" data-mediatip-source="'.EXAMPLE_IMAGE_URL.'" data-mediatip-type="webimage" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_mediatip', EXAMPLE_TITLE, 'webimage', EXAMPLE_IMAGE_URL, EXAMPLE_CAPTION)
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-mediatip " data-mediatip-caption="'.EXAMPLE_CAPTION.'" data-mediatip-source="'.EXAMPLE_VIDEO_URL.'" data-mediatip-type="webvideo" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_mediatip', EXAMPLE_TITLE, 'webvideo', EXAMPLE_VIDEO_URL, EXAMPLE_CAPTION)
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-mediatip " data-mediatip-caption="'.EXAMPLE_CAPTION.'" data-mediatip-source="'.EXAMPLE_VIDEO_URL.'" data-mediatip-type="webvideo" href="javascript:void(0);" title="'.EXAMPLE_TITLE_2.'">'.EXAMPLE_TITLE.'</a>',
			apply_filters( 'ithoughts_tt_gl_mediatip', EXAMPLE_TITLE, 'webvideo', EXAMPLE_VIDEO_URL, EXAMPLE_CAPTION, array(
				'title' => EXAMPLE_TITLE_2,
			))
		);
	}

	function test_mediatip_shortcode(){
		$attachment_id = $this->generate_attachment();
		$attachment = wp_get_attachment_image_src($attachment_id);
		
		$this->assertDiscardWhitespace(
			'<a  class="itg-mediatip" data-mediatip-caption="'.EXAMPLE_CAPTION.'" data-mediatip-source="'.$attachment[0].'" data-mediatip-type="localimage" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-mediatip mediatip-type="localimage" mediatip-source="'.$attachment_id.'" mediatip-caption="'.EXAMPLE_CAPTION.'"]'.EXAMPLE_TITLE.'[/itg-mediatip]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-mediatip" data-mediatip-caption="'.EXAMPLE_CAPTION.'" data-mediatip-source="'.EXAMPLE_IMAGE_URL.'" data-mediatip-type="webimage" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-mediatip mediatip-type="webimage" mediatip-source="'.EXAMPLE_IMAGE_URL.'" mediatip-caption="'.EXAMPLE_CAPTION.'"]'.EXAMPLE_TITLE.'[/itg-mediatip]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-mediatip " data-mediatip-caption="'.EXAMPLE_CAPTION.'" data-mediatip-source="'.EXAMPLE_VIDEO_URL.'" data-mediatip-type="webvideo" href="javascript:void(0);" title="'.EXAMPLE_TITLE.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-mediatip mediatip-type="webvideo" mediatip-source="'.EXAMPLE_VIDEO_URL.'" mediatip-caption="'.EXAMPLE_CAPTION.'"]'.EXAMPLE_TITLE.'[/itg-mediatip]')
		);
		$this->assertDiscardWhitespace(
			'<a class="itg-mediatip " data-mediatip-caption="'.EXAMPLE_CAPTION.'" data-mediatip-source="'.EXAMPLE_VIDEO_URL.'" data-mediatip-type="webvideo" href="javascript:void(0);" title="'.EXAMPLE_TITLE_2.'">'.EXAMPLE_TITLE.'</a>',
			do_shortcode( '[itg-mediatip mediatip-type="webvideo" mediatip-source="'.EXAMPLE_VIDEO_URL.'" mediatip-caption="'.EXAMPLE_CAPTION.'" title="'.EXAMPLE_TITLE_2.'"]'.EXAMPLE_TITLE.'[/itg-mediatip]')
		);
	}
}
