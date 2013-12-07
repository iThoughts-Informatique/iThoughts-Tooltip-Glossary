<?php
/** */
function tcb_wpg_build_dropdown( $id, $args ){
	$defaults = array(
		'selected'    => null,
		'options'     => array(__('-no options-', 'wp-glossary')),
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
			$allow_blank = __('- Please Select -', 'wp-glossary');
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
	foreach( $options as $value => $option ) :
		if( is_array($option) ) :
			$title    = $option['title'];
			$attrs    = $option['attrs'];
			$att_list = array();
			foreach( $attrs as $k=>$v ) :
				$att_list[] = $k . '="' . esc_attr($v) . '"';
			endforeach;
			$att_string = implode( ' ', $att_list );
			$optclass = "dropdown-{$id}-{$value}";
			$dropdown .= '<option class="' . $optclass . '" value="' . $value . '" ' . selected($selected, $value, false) . ' ' . $att_string . '>' . $title . '</option>';
		else :
			$title    = $option;
			$optclass = "dropdown-{$id}-{$value}";
			$dropdown .= '<option class="' . $optclass . '" value="' . $value . '" ' . selected($selected, $value, false) . '>' . $title . '</option>';
		endif;
	endforeach;
	$dropdown .= '</select>';

	return $dropdown;
}

