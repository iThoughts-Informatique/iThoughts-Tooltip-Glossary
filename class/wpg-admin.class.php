<?php
/**
 * WP-Glossary Admin
 */
class WPG_Admin{
 	public function __construct() {
		add_action( 'admin_menu',                 array($this, 'options_submenu') );
		add_action( 'wp_ajax_wpg_update_options', array($this, 'update_options') );
	}

	public function options_submenu(){
		$slug             = __( 'glossary', WPG_TEXTDOMAIN ); 
		// Add menu page (capture page for adding admin style and javascript
		$glossary_options = add_submenu_page( 
			"edit.php?post_type=$slug", 
			__( 'Glossary Options', WPG_TEXTDOMAIN ), 
			__( 'Glossary Options', WPG_TEXTDOMAIN ), 
			'manage_options', 
			'glossary-options', 
			array($this, 'options')
		 );
	}

	public function options(){
		$ajax         = admin_url( 'admin-ajax.php' );
		$options      = get_option( 'wp_glossary', array() );
		$tooltips     = isset( $options['tooltips'] )     ? $options['tooltips']     : 'excerpt';
		$alphaarchive = isset( $options['alphaarchive'] ) ? $options['alphaarchive'] : 'standard';
		$qtipstyle    = isset( $options['qtipstyle'] )    ? $options['qtipstyle']    : 'cream';
		$termlinkopt  = isset( $options['termlinkopt'] )  ? $options['termlinkopt']  : 'standard';

		// Tooptip DD
		$ttddoptions = array(
			'full' => array(
				'title' => __('Full', WPG_TEXTDOMAIN),
				'attrs' => array('title'=>__('Display full post content', WPG_TEXTDOMAIN))
			),
			'excerpt' => array(
				'title' => __('Excerpt', WPG_TEXTDOMAIN),
				'attrs' => array('title'=>__('Display shorter excerpt content', WPG_TEXTDOMAIN))
			), 
			'off' => array(
				'title' => __('Off', WPG_TEXTDOMAIN),
				'attrs' => array('title'=>__('Do not display tooltip at all', WPG_TEXTDOMAIN))
			),
		);
		$tooltipdropdown = tcb_wpg_build_dropdown( 'tooltips', array(
			'selected' => $tooltips,
			'options'  => $ttddoptions,
		) );
		
		// Alpha Arrhive DD
		$aaddoptions = array(
			'alphabet' => array('title'=>__('Alphabetical', WPG_TEXTDOMAIN), 'attrs'=>array('title'=>__('Display glossary archive alphabetically', WPG_TEXTDOMAIN))),
			'standard' => array('title'=>__('Standard', WPG_TEXTDOMAIN),     'attrs'=>array('title'=>__('No filtering, display as standard archive', WPG_TEXTDOMAIN))),
		);
		$archivedropdown = tcb_wpg_build_dropdown( 'alphaarchive', array(
			'selected' => $alphaarchive,
			'options'  => $aaddoptions,
		) );

		// qTipd syle options
		$qtipdropdown = tcb_wpg_build_dropdown( 'qtipstyle', array(
			'selected' => $qtipstyle,
			'options'  => array(
				'off'   => __('Off',   WPG_TEXTDOMAIN), 
				'cream' => __('Cream', WPG_TEXTDOMAIN), 
				'dark'  => __('Dark',  WPG_TEXTDOMAIN), 
				'green' => __('Green', WPG_TEXTDOMAIN), 
				'light' => __('Light', WPG_TEXTDOMAIN), 
				'red'   => __('Red',   WPG_TEXTDOMAIN), 
				'blue'  => __('Blue',  WPG_TEXTDOMAIN)
			),
		));

		// Term Link HREF target
		$termlinkoptdropdown = tcb_wpg_build_dropdown( 'termlinkopt', array(
			'selected' => $termlinkopt,
			'options'  => array(
				'standard' => array('title'=>__('Normal', WPG_TEXTDOMAIN),  'attrs'=>array('title'=>__('Normal link with no modifications', WPG_TEXTDOMAIN))),
				'none'     => array('title'=>__('No link', WPG_TEXTDOMAIN), 'attrs'=>array('title'=>__("Don't link to term", WPG_TEXTDOMAIN))),
				'blank'    => array('title'=>__('New tab', WPG_TEXTDOMAIN), 'attrs'=>array('title'=>__("Always open in a new tab", WPG_TEXTDOMAIN))),
			),
		));
		
?>
<div class="wrap">
	<div id="wp-glossary-options" class="meta-box meta-box-50" style="width: 50%;">
		<div class="meta-box-inside admin-help">
			<div class="icon32" id="icon-options-general">
				<br>
			</div>
			<h2><?php _e('WP Glossary Options', WPG_TEXTDOMAIN); ?></h2>
			<form action="<?php echo $ajax; ?>" method="post" class="simpleajaxform" target="update-response">
				<p> <?php _e('Tooltip:', WPG_TEXTDOMAIN); echo "{$tooltipdropdown}" ?></p>
				<p> <?php _e('Archive:', WPG_TEXTDOMAIN); echo "{$archivedropdown}" ?></p>
				<p> <?php _e('Tooltip (qTip):', WPG_TEXTDOMAIN);  echo "{$qtipdropdown}" ?></p>
				<p> <?php _e('Term link:', WPG_TEXTDOMAIN);  echo "{$termlinkoptdropdown}" ?></p>
				<p>
					<input type="hidden" name="action" value="wpg_update_options"/>
					<input type="submit" name="submit" class="alignleft button-primary" value="<?php _e('Update Glossary Options', WPG_TEXTDOMAIN); ?>"/>
	 	   </p>
			</form>
			<div id="update-response" class="clear confweb-update"></div>
		</div>
	</div>
</div>
<?php
	}

	public function update_options(){
		$defaults = array(
			'tooltips'     => 'excerpt',
			'alphaarchive' => 'standard',
			'qtipstyle'    => 'cream',
			'termlinkopt'  => 'standard',
		);
		$glossary_options = get_option( 'wp_glossary', $defaults );
		foreach( $defaults as $key => $default ){
			$value                  = $_POST[$key] ? $_POST[$key] : $default;
			$glossary_options[$key] = $value;
		}
		
		update_option( 'wp_glossary', $glossary_options );
		die( '<p>' . __('Glossary options updated', WPG_TEXTDOMAIN) . '</p>' );
	}
}
