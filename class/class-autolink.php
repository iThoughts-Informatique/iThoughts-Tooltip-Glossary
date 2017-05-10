<?php
/**
 * @file Do matching of terms and put it in content
 *
 * @author Gerkin
 * @copyright 2015-2016 iThoughts Informatique
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 3.0.0
 */

namespace ithoughts\tooltip_glossary;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if(!class_exists(__NAMESPACE__."\\AutoLink")){
	class AutoLink extends \ithoughts\v1_0\Singleton{
		private $ignoredWords = explode(" ", _x("the a an of in", "A list of words to be ignored when trying to match with glossary terms title", "ithoughts-tooltip-glossary"));
		public function __construct() {
		}

		private function setSessionText($text) {
			global $session;

			// Get the old session and set it with new value
			$oldText = $session->get_userdata('itg-edittext');
			$session->set_userdata(array(
				'itg-edittext' => $text
			));
			return $oldText;
		}
	}
}