<?php

namespace ithoughts\TooltipGlossary\Shortcode;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

use ithoughts\TooltipGlossary\HtmlUtils;

if(!class_exists( __NAMESPACE__ . '\\Tip' )){
    class Tip {
        private $css_namespace;
        private $tags;
        private $typename;

        public function __construct(string $typename, string $css_namespace, array $shortcode_tags){
            if(!isset($shortcode_tags[$typename])){
                throw new \Exception('Could not find tags to handle for typename ' . $typename);
            }

            $this->css_namespace = $css_namespace;
            $this->tags = $shortcode_tags[$typename];
            $this->typename = $typename;
        }

        public function do_shortcode(array $attrs, string $content, string $tag){
            bdump([
                'attrs' => $attrs,
                'content' => $content,
                'tag' => $tag,
            ]);
            
            // Append classes
            $classes = [];
            if(isset($attrs['class'])){
                $classes = explode(' ', $attrs['class']);
            }
            $classes[] = $this->css_namespace.'-tip';
            $classes[] = $this->css_namespace.'-' . $this->typename;
            $attrs['class'] = implode(' ', array_unique($classes));
            $attrs['tip-type'] = $this->typename;

            $html_tag = HtmlUtils::to_html_tag('a', $content, $attrs);

            return $html_tag;
        }

        public function register(){
            foreach ($this->tags as $tag) {
                add_shortcode($tag, array($this, 'do_shortcode'));
            }
        }
    }
}
