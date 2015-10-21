<?php
/** */
function ithoughts_tt_gl_unaccent( $text, $from, $to, $encoding = "UTF-8" ){
    $l = mb_strlen($text, $encoding);
    $out = "";
    for($i = 0; $i < $l; $i++){
        $c = mb_substr($text, $i, 1, $encoding);
        $t = mb_strpos($from,$c,0,$encoding);
        if($t === false)
            $out .= $c;
        else
            $out .= mb_substr($to, $t, 1, $encoding);
    }
    return $out;
}

function ithoughts_tt_gl_build_dropdown_multilevel( $id, $args ){
    $defaults = array(
        'selected'    => null,
        'options'     => array(__('-no options-', 'ithoughts-tooltip-glossary')),
        'allow_blank' => false,
        'class'       => null,
        'name'        => null,
    );

    $r = wp_parse_args( $args, $defaults );
    extract( $r );

    if( empty($class) ) $class = $id;
    if( empty($name) )  $name  = $id;

    $dropdown  = '<select id="' . $id . '" name="' . $name . '" class="' . $class . '">';
    if( $allow_blank ) :
    // Set default blank title.
    if( $allow_blank === true ):
    $allow_blank = __('- Please Select -', 'ithoughts-tooltip-glossary');
    endif;

    // Expand string into array
    if( is_string($allow_blank) ):
    $allow_blank = array(
        'value' => 'none',
        'title' => $allow_blank
    );
    endif;
    $dropdown .= '<option value="' . $allow_blank['value'] . '">' . $allow_blank['title'] . '</option>';
    endif;
    foreach( $options as $value => $option ) {
        if( is_array($option) ) {
            $type = $option['type'];
            if($type === "optgroup"){
                $dropdown.='<optgroup label="'.$value.'">';
                foreach($option as $subkey => $suboption){
                    if($subkey != "type"){
                $dropdown .= '<option class="' . $optclass . '" value="' . $subkey . '" ' . selected($selected, $subkey, false) . ' ' . $att_string . '>' . $suboption . '</option>';
                    }
                }
                $dropdown.='</optgroup>';
            } else {
                $title    = $option['title'];
                $attrs    = $option['attrs'];
                $att_list = array();
                foreach( $attrs as $k=>$v ) :
                $att_list[] = $k . '="' . esc_attr($v) . '"';
                endforeach;
                $att_string = implode( ' ', $att_list );
                $optclass = "dropdown-{$id}-{$value}";
                $dropdown .= '<option class="' . $optclass . '" value="' . $value . '" ' . selected($selected, $value, false) . ' ' . $att_string . '>' . $title . '</option>';
            }
        } else {
            $title    = $option;
            $optclass = "dropdown-{$id}-{$value}";
            $dropdown .= '<option class="' . $optclass . '" value="' . $value . '" ' . selected($selected, $value, false) . '>' . $title . '</option>';
        }
    }
    $dropdown .= '</select>';

    return $dropdown;
}

