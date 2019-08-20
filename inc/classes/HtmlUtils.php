<?php

namespace ithoughts\TooltipGlossary;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

if(!class_exists( __NAMESPACE__ . '\\HtmlUtils' )){
    class HtmlUtils {
        private function __construct(){
        }

        public static function to_html_tag(string $tag, ?string $content, array $attrs): string {
            $html_tag = '';

            // Prefix attributes
            $attrs_prefixed = [];
            foreach($attrs  as $key => $value){
                if(strpos('data-', $key) !== 0 && !in_array($key, ['class', 'href'])){
                    $attrs_prefixed['data-'.$key] = $value;
                } else {
                    $attrs_prefixed[$key] = $value;
                }
            }

            // Serialize attributes
            $attrs_str = '';
            foreach ($attrs_prefixed as $key => $value) {
                $attrs_str .= $key . '="' . esc_attr( $value ) . '" ';
            }
            // Include attrs only if serialization is not empty
            if($attrs_str){
                $attrs_str = trim($attrs_str);
                $html_tag = "<$tag $attrs_str";
            } else {
                $html_tag = "<$tag";
            }

            // Handle empty content with empty tag.
            if(!$content){
                return $html_tag . '/>';
            } else {
                return $html_tag . '>' . $content . '</' . $tag . '>';
            }
        }
    }
}
