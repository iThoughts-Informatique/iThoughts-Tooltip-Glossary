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

if ( ! class_exists( __NAMESPACE__ . '\\AutoLink' ) ) {
	class AutoLink extends \ithoughts\v1_0\Singleton {
		private $ignoredWords = null;

		public function __construct() {
			$this->ignoredWords = explode( ' ', _x( 'the a an of in', 'A list of words to be ignored when trying to match with glossary terms title', 'ithoughts-tooltip-glossary' ) );

			add_action( 'init',	array( &$this, 'register_ajax_hooks' ) );
		}

		public function register_ajax_hooks() {
			add_action( 'wp_ajax_ithoughts_tt_gl_test_autolink', array( &$this, 'test_autolink' ) );
			add_action( 'wp_ajax_nopriv_ithoughts_tt_gl_test_autolink', array( &$this, 'test_autolink' ) );
		}

		public function test_autolink() {
			$content = $_POST['data']['content'];
			$minWordLen = 3;
			$wordsSplitter = '/(?<!\w|<)(\w{' . $minWordLen . ',})(?!\w|>)/';
			var_dump( $wordsSplitter );
			$matches = array();
			if ( preg_match_all( $wordsSplitter, $content, $matches ) ) {
				foreach ( $matches[0] as $word ) {

				}
			}
			var_dump( $matches );
		}

		private function setSessionText( $text ) {
			global $session;

			// Get the old session and set it with new value
			$oldText = $session->get_userdata( 'itg-edittext' );
			$session->set_userdata(array(
				'itg-edittext' => $text,
			));
			return $oldText;
		}
	}
}// End if().
