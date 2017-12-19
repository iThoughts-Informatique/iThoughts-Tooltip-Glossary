<?php

/**
 * @file Class file for HTML tooltips shortcode
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */


/**
 * @copyright 2015-2016 iThoughts Informatique
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 */

namespace ithoughts\tooltip_glossary\shortcode\tip;

use \ithoughts\v6_0\Toolbox as Toolbox;

if ( ! defined( 'ABSPATH' ) ) {
	status_header( 403 );
	wp_die( 'Forbidden' );// Exit if accessed directly
}


if ( ! class_exists( __NAMESPACE__ . '\\Tooltip' ) ) {
	abstract class Tip extends \ithoughts\v1_0\Singleton {

		protected $backbone;

		public function __construct($backbone) {
			$this->backbone = $backbone;
		}

		/**
		 * Create a tooltip HTML markup with given text content $text, tooltip content $tip & provided options $options
		 *
		 * @author Gerkin
		 * @param  string  $text       Text content of the highlighted word
		 * @param  [array] $attributes Attributes to put in the link
		 * @return string The formatted HTML markup
		 */
		protected function generate_tip( $text, $attributes = array() ) {
			$this->backbone->enqueue_resource( 'ithoughts_tooltip_glossary-qtip' );

			// If arguments are provided by categories, concat them
			if(count($attributes) === 4 && Toolbox::array_keys_exists(array('handled', 'serverSide', 'clientSide', 'attributes'), $attributes)){
				if(isset($attributes['handled']['termlinkopt'])){
					switch($attributes['handled']['termlinkopt']){
						case 'blank':
							$attributes['attributes']['target'] = '_blank';
							break;

						default:
							$attributes['attributes']['target'] = $attributes['handled']['termlinkopt'];
							break;
					}
				}
				$attributes = array_replace_recursive(array(), $attributes['attributes'], $attributes['clientSide']);
			}

			// Set the default title
			if ( !isset( $attributes['title'] ) ) {
				$attributes['title'] = $text;
			}
			// Set the default href
			if ( ! (isset( $attributes['href'] ) && $attributes['href']) ) {
				$attributes['href'] = 'javascript:void(0);';
			}
			foreach($attributes as $key => $value){
				$wanted_key = Toolbox::maybe_data_prefix($key);
				if($wanted_key !== $key){
					if(isset($attributes[$wanted_key])){
						$this->backbone->log( \ithoughts\v6_0\LogLevel::WARN, "Overriding attribe $key with $wanted_key that already exists" );
					}
					$attributes[$wanted_key] = $value;
					unset($attributes[$key]);
				}
			}

			$attrs = \ithoughts\v6_0\Toolbox::concat_attrs( $attributes );
			return '<a ' . $attrs . '>' . $text . '</a>';
		}
	}
}// End if().
