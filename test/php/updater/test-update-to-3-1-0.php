<?php
/**
 * Class SampleTest
 *
 * @package Ithoughts_Tooltip_Glossary
 */

use ithoughts\tooltip_glossary\Updater;

class ITGUpdate_3_1_0 extends WP_UnitTestCase {
	private $updater;

	public function __construct(){
		require_once(dirname(dirname(dirname(dirname(__FILE__)))).'/class/class-updater.php');
		$this->updater = Updater::get_instance('3.0.2', '3.1.0', null);
		call_user_func_array(array('parent', '__construct'), func_get_args());
	}

	function _test_change_lists_atoz() {
		$this->assertDiscardWhitespace(
			'[itg-atoz/]',
			$this->updater->update_to_3_1_0('[glossary_atoz/]')
		);
		$this->assertDiscardWhitespace(
			'[itg-atoz list-contenttype="link" /]',
			$this->updater->update_to_3_1_0('[glossary_atoz desc="off"/]')
		);

		$this->assertDiscardWhitespace(
			'[itg-atoz list-contenttype="tip" /]',
			$this->updater->update_to_3_1_0('[glossary_atoz desc="tip"/]')
		);

		$this->assertDiscardWhitespace(
			'[itg-atoz list-contenttype="excerpt" /]',
			$this->updater->update_to_3_1_0('[glossary_atoz desc="excerpt"/]')
		);

		$this->assertDiscardWhitespace(
			'[itg-atoz list-contenttype="full" /]',
			$this->updater->update_to_3_1_0('[glossary_atoz desc="full"/]')
		);
	}

	function _test_change_lists_glossary() {
		$this->assertDiscardWhitespace(
			'[itg-glossary/]',
			$this->updater->update_to_3_1_0('[glossary_term_list/]')
		);
		$this->assertDiscardWhitespace(
			'[itg-glossary cols="1"/]',
			$this->updater->update_to_3_1_0('[glossary_term_list cols="1"/]')
		);
		$this->assertDiscardWhitespace(
			'[itg-glossary groups="1"/]',
			$this->updater->update_to_3_1_0('[glossary_term_list group="1"/]')
		);
		$this->assertDiscardWhitespace(
			'[itg-glossary alphas="abcde" cols="2" groups="1"/]',
			$this->updater->update_to_3_1_0('[glossary_term_list alphas="abcde" cols="2" group="1"/]')
		);
		$this->assertDiscardWhitespace(
			'[itg-glossary list-contenttype="link" /]',
			$this->updater->update_to_3_1_0('[glossary_term_list desc="off"/]')
		);

		$this->assertDiscardWhitespace(
			'[itg-glossary list-contenttype="tip" /]',
			$this->updater->update_to_3_1_0('[glossary_term_list desc="tip"/]')
		);

		$this->assertDiscardWhitespace(
			'[itg-glossary list-contenttype="excerpt" /]',
			$this->updater->update_to_3_1_0('[glossary_term_list desc="excerpt"/]')
		);

		$this->assertDiscardWhitespace(
			'[itg-glossary list-contenttype="full" /]',
			$this->updater->update_to_3_1_0('[glossary_term_list desc="full"/]')
		);
	}

	function _test_change_tip_gloss(){
		$this->assertDiscardWhitespace(
			'[itg-gloss gloss-id="25"]A Glossary[/itg-gloss]',
			$this->updater->update_to_3_1_0('[itg-glossary glossary-id="25"]A Glossary[/itg-glossary]')
		);

		$this->assertDiscardWhitespace(
			'[itg-gloss gloss-content="full" gloss-id="25"]Full content[/itg-gloss]',
			$this->updater->update_to_3_1_0('[itg-glossary glossary-id="25" termcontent="full"]Full content[/itg-glossary]')
		);

		$this->assertDiscardWhitespace(
			'[itg-gloss gloss-content="excerpt" gloss-id="25"]Excerpt[/itg-gloss]',
			$this->updater->update_to_3_1_0('[itg-glossary glossary-id="25" termcontent="excerpt"]Excerpt[/itg-glossary]')
		);

		$this->assertDiscardWhitespace(
			'[itg-gloss gloss-content="off" gloss-id="25"]Nothing[/itg-gloss]',
			$this->updater->update_to_3_1_0('[itg-glossary glossary-id="25" termcontent="off"]Nothing[/itg-glossary]')
		);

		$this->assertDiscardWhitespace(
			'[itg-gloss gloss-content="full" gloss-id="21" tip-animation-in="appear" tip-animation-out="zoomout" tip-animation-time="800" tip-maxwidth="500px" tip-position-at="bottom center" tip-position-my="top center" tip-rounded="true" tip-shadow="false" tip-style="youtube" tip-trigger="responsive"]Another, with advanded options[/itg-gloss]',
			$this->updater->update_to_3_1_0('[itg-glossary termcontent="full" qtiprounded="true" qtipshadow="false" qtipstyle="youtube" qtiptrigger="responsive" position-at="bottom center" position-my="top center" animation_in="appear" animation_out="zoomout" animation_time="800" tooltip-maxwidth="500px" glossary-id="21"]Another, with advanded options[/itg-glossary]')
		);
	}

	function _test_change_tip_tooltip(){
		$this->assertDiscardWhitespace(
			'[itg-tooltip href="Yolo" title="Hello World" tooltip-content="&lt;p&gt;This is the content&lt;/p&gt;"]A simple tooltip[/itg-tooltip]',
			$this->updater->update_to_3_1_0('[itg-tooltip title="Hello World" link-href="Yolo" tooltip-content="&lt;p&gt;This is the content&lt;/p&gt;"]A simple tooltip[/itg-tooltip]')
		);

		$this->assertDiscardWhitespace(
			'[itg-tooltip tip-animation-in="appear" tip-animation-out="zoomout" tip-animation-time="800" tip-maxwidth="500px" tip-position-at="bottom center" tip-position-my="top center" tip-rounded="true" tip-shadow="false" tip-style="youtube" tip-trigger="responsive" tooltip-content="&lt;p&gt;This is the content&lt;/p&gt;"]Another, with advanded options[/itg-tooltip]',
			$this->updater->update_to_3_1_0('[itg-tooltip qtiprounded="true" qtipshadow="false" qtipstyle="youtube" qtiptrigger="responsive" position-at="bottom center" position-my="top center" animation_in="appear" animation_out="zoomout" animation_time="800" tooltip-maxwidth="500px" tooltip-content="&lt;p&gt;This is the content&lt;/p&gt;"]Another, with advanded options[/itg-tooltip]')
		);
	}

	function test_change_tip_mediatip(){
		$this->assertDiscardWhitespace(
			'[itg-tooltip href="Yolo" title="Hello World" tooltip-content="&lt;p&gt;This is the content&lt;/p&gt;"]A simple tooltip[/itg-tooltip]',
			$this->updater->update_to_3_1_0('[itg-mediatip href="http://wordpress.loc/old-format/scales-normal/" mediatip-type="localimage" mediatip-content="{&amp;aquot;url&amp;aquot;:&amp;aquot;http://wordpress.loc/wp-content/uploads/2017/12/scales-normal.jpg&amp;aquot;,&amp;aquot;id&amp;aquot;:75,&amp;aquot;link&amp;aquot;:&amp;aquot;http://wordpress.loc/old-format/scales-normal/&amp;aquot;}" mediatip-caption="Some normals"]Mediatip localimage[/itg-mediatip]')
		);

		$this->assertDiscardWhitespace(
			'[itg-tooltip tip-animation-in="appear" tip-animation-out="zoomout" tip-animation-time="800" tip-maxwidth="500px" tip-position-at="bottom center" tip-position-my="top center" tip-rounded="true" tip-shadow="false" tip-style="youtube" tip-trigger="responsive" tooltip-content="&lt;p&gt;This is the content&lt;/p&gt;"]Another, with advanded options[/itg-tooltip]',
			$this->updater->update_to_3_1_0('[itg-tooltip qtiprounded="true" qtipshadow="false" qtipstyle="youtube" qtiptrigger="responsive" position-at="bottom center" position-my="top center" animation_in="appear" animation_out="zoomout" animation_time="800" tooltip-maxwidth="500px" tooltip-content="&lt;p&gt;This is the content&lt;/p&gt;"]Another, with advanded options[/itg-tooltip]')
		);
	}
}
