<?php
/**
 * ithoughts_tooltip_glossary Admin
 */
class ithoughts_tt_gl_Admin extends ithoughts_tt_gl_interface{
	private $currentVersion;
	private $updater;

	public function __construct() {
		//Trigger version change function ?
		add_action( 'admin_init',								array(&$this, 'setVersion') );
		add_action( 'admin_init',								array(&$this, 'ajaxHooks') );

		add_action( 'admin_menu',								array(&$this, 'get_menu') );

		add_filter( 'mce_buttons',								array(&$this, "ithoughts_tt_gl_tinymce_register_buttons") );

		add_filter( "mce_external_plugins",						array(&$this, "ithoughts_tt_gl_tinymce_add_buttons") );

		add_filter( 'mce_external_languages',					array(&$this, 'tinymce_add_translations') );

		add_action( 'admin_init',								array(&$this,	'register_scripts_and_styles')	);

		add_action( 'admin_enqueue_scripts',					array(&$this,	'enqueue_scripts_and_styles')		);
	}
	public function getOptions(){
		return parent::$options;
	}
	public function setVersion(){
		try{
			$plugindata = get_plugin_data( parent::$plugin_base . '/ithoughts_tooltip_glossary.php' );
			if( $plugindata && is_array($plugindata) && $plugindata['Version'] ){
				$this->currentVersion = $plugindata['Version'];
			} else {
				throw new Exception("unreadable_plugin_error");
			}
			if( $this->isUnderVersionned() ){
				require_once(parent::$base . "/ithoughts_tt_gl-updater.class.php");
				$this->updater = new ithoughts_tt_gl_Updater(parent::$options['version'], $this->currentVersion, $this);
				if(parent::$options['version'] != "-1" && ithoughts_tt_gl_Updater::requiresUpdate(parent::$options['version'], $this->currentVersion)){
					$this->updater->addAdminNotice();
				} else {
					parent::$options['version'] = $this->currentVersion;
					update_option( 'ithoughts_tt_gl', parent::$options );
				}
			}
		} catch(Exception $e){
			add_action( 'admin_notices', array(&$this,'unreadable_plugin_error') );
		}
	}
	public function unreadable_plugin_error(){
?>
<div class="error form-invalid">
	<p><?php _e( "Can't read plugin version", "my_textdomain" ); ?></p>
</div>
<?php
											 }
	public function ajaxHooks(){
		add_action( 'wp_ajax_ithoughts_tt_gl_get_tinymce_tooltip_form', array(&$this, 'getTinyMCETooltipFormAjax') );
		add_action( 'wp_ajax_ithoughts_tt_gl_get_customizing_form', array(&$this, 'getCustomizingFormAjax') );
		add_action( 'wp_ajax_ithoughts_tt_gl_update_options',	array(&$this, 'update_options') );
	}
	public function register_scripts_and_styles(){
		wp_register_script(
			'simple-ajax',
			parent::$base_url . '/js/simple-ajax-form.js',
			array('jquery-form')
		);
		wp_register_script(
			'ithoughts_tooltip_glossary-admin',
			parent::$base_url . '/js/ithoughts_tooltip_glossary-admin.js',
			array('qtip')
		);
		wp_register_script(
			"ithoughts_tooltip_glossary-utils",
			parent::$base_url . '/js/ithoughts_tooltip_glossary-utils.js',
			null,
			false
		);
		wp_register_script(
			"ithoughts_tooltip_glossary-tinymce_form",
			parent::$base_url . '/js/ithoughts_tooltip_glossary-tinymce-forms.js',
			array("jquery", "ithoughts_tooltip_glossary-utils"),
			"2.1.1"
		);
		wp_register_script(
			'wp-color-picker-alpha',
			parent::$base_url . '/ext/colorpicker-alpha.min.js',
			array( 'wp-color-picker' )
		);
		wp_register_script(
			'ithoughts_tooltip_glossary-gradx-dom',
			parent::$base_url . '/ext/gradx/dom-drag.js',
			array('jquery')
		);
		wp_register_script(
			'ithoughts_tooltip_glossary-colorpicker',
			parent::$base_url . '/ext/gradx/colorpicker/colorpicker.min.js',
			array('jquery')
		);
		wp_register_script(
			'ithoughts_tooltip_glossary-gradx',
			parent::$base_url . '/ext/gradx/gradX.js',
			array('ithoughts_tooltip_glossary-gradx-dom', 'ithoughts_tooltip_glossary-colorpicker'),
			false
		);
		wp_register_script(
			'ithoughts_tooltip_glossary-styleeditor',
			parent::$base_url . '/js/ithoughts_tooltip_glossary-styleeditor.js',
			array('ithoughts_tooltip_glossary-gradx', 'ithoughts_tooltip_glossary-colorpicker', 'wp-color-picker-alpha'),
			false
		);
		wp_register_script(
			'ithoughts_tooltip_glossary-updater',
			parent::$base_url . '/js/ithoughts_tt_gl-updater.js',
			array("jquery"),
			"2.0.5"
		);


		wp_localize_script(
			"ithoughts_tooltip_glossary-tinymce_form",
			"ithoughts_tt_gl_tinymce_form",
			array(
				"admin_ajax"    => admin_url('admin-ajax.php'),
				"base_tinymce"  => parent::$base_url . '/js/tinymce',
				"terms"         => array()
			)
		);

		wp_register_style( "ithoughts_tooltip_glossary-tinymce_form",	parent::$base_url . '/css/ithoughts_tooltip_glossary-tinymce-forms.css', null, false);
		wp_register_style( 'ithoughts_tooltip_glossary-colorpicker',	parent::$base_url . '/ext/gradx/colorpicker/colorpicker.css' );
		wp_register_style( 'ithoughts_tooltip_glossary-gradx',			parent::$base_url . '/ext/gradx/gradX.css' );
		wp_register_style( 'ithoughts_tooltip_glossary-admin',			parent::$base_url . '/css/ithoughts_tooltip_glossary-admin.css' );
	}
	public function enqueue_scripts_and_styles(){
		wp_enqueue_script( 'simple-ajax' );
		wp_enqueue_style( 'ithoughts_tooltip_glossary-admin');
	}
	public function ithoughts_tt_gl_tinymce_register_buttons( $buttons ) {
		array_push( $buttons, 'glossaryterm', 'glossarylist' );
		return $buttons;
	}
	public function ithoughts_tt_gl_tinymce_add_buttons( $plugin_array ) {
		wp_enqueue_script("ithoughts_tooltip_glossary-utils");
		wp_enqueue_script("ithoughts_tooltip_glossary-qtip");
		$plugin_array['ithoughts_tt_gl_tinymce'] = parent::$base_url . '/js/ithoughts_tt_gl-tinymce.js?t=2.1.1';
		return $plugin_array;
	}
	public function tinymce_add_translations($locales){
		$locales ['ithoughts_tt_gl_tinymce'] = self::$base . '/../lang/ithoughts_tt_gl_tinymce_lang.php';
		return $locales;
	}
	public function get_menu(){
		$plugindata = get_plugin_data( parent::$plugin_base . '/ithoughts_tooltip_glossary.php' );
		if( $plugindata && is_array($plugindata) && $plugindata['Version'] ){
			$this->currentVersion = $plugindata['Version'];
		} else {
			$currentVersion = "0.0";
		}
		$menu = add_menu_page("iThoughts Tooltip Glossary", "Tooltip Glossary", "edit_others_posts", "ithought-tooltip-glossary", null, parent::$base_url."/js/icon/icon.svg");

		$submenu_pages = array(
			// Options
			array(
				'parent_slug'   => 'ithought-tooltip-glossary',
				'page_title'    => __( 'Options', 'ithoughts_tooltip_glossary' ),
				'menu_title'    => __( 'Options', 'ithoughts_tooltip_glossary' ),
				'capability'    => 'manage_options',
				'menu_slug'     => 'ithought-tooltip-glossary',
				'function'      => array($this, 'options'),
			),

			// Post Type :: Add New Post
			array(
				'parent_slug'   => 'ithought-tooltip-glossary',
				'page_title'    => __('Add a Term', 'ithoughts_tooltip_glossary' ),
				'menu_title'    => __('Add a Term', 'ithoughts_tooltip_glossary' ),
				'capability'    => 'edit_others_posts',
				'menu_slug'     => 'post-new.php?post_type=glossary',
				'function'      => null,// Doesn't need a callback function.
			),

			// Post Type :: View All Posts
			array(
				'parent_slug'   => 'ithought-tooltip-glossary',
				'page_title'    => __('Glossary Terms', 'ithoughts_tooltip_glossary' ),
				'menu_title'    => __('Glossary Terms', 'ithoughts_tooltip_glossary' ),
				'capability'    => 'edit_others_posts',
				'menu_slug'     => 'edit.php?post_type=glossary',
				'function'      => null,// Doesn't need a callback function.
			),

			// Taxonomy :: Manage News Categories
			array(
				'parent_slug'   => 'ithought-tooltip-glossary',
				'page_title'    => __('Glossary Groups', 'ithoughts_tooltip_glossary' ),
				'menu_title'    => __('Glossary Groups', 'ithoughts_tooltip_glossary' ),
				'capability'    => 'manage_categories',
				'menu_slug'     => 'edit-tags.php?taxonomy=glossary_group&post_type=glossary',
				'function'      => null,// Doesn't need a callback function.
			),
		);


		if( $this->isUnderVersionned() ){
			require_once(parent::$base . "/ithoughts_tt_gl-updater.class.php");
			if(ithoughts_tt_gl_Updater::requiresUpdate(parent::$options['version'], $this->currentVersion)){
				// Updater :: Hidden but entry point for update actions
				$submenu_pages[] = array(
					'parent_slug'   => 'ithought-tooltip-glossary',
					'page_title'    => __("Update", 'ithoughts_tooltip_glossary'),
					'menu_title'    => __("Update", 'ithoughts_tooltip_glossary'),
					'capability'    => 'manage_options',
					'menu_slug'     => 'ithoughts_tt_gl_update',
					'function'      => array(&$this->updater, 'updater'),// Doesn't need a callback function.
				);
			}
		}

		// Add each submenu item to custom admin menu.
		foreach($submenu_pages as $submenu){

			add_submenu_page(
				$submenu['parent_slug'],
				$submenu['page_title'],
				$submenu['menu_title'],
				$submenu['capability'],
				$submenu['menu_slug'],
				$submenu['function']
			);

		}

		// Add menu page (capture page for adding admin style and javascript
	}

	public function isUnderVersionned(){
		$currentVersion;

		$version_diff = version_compare( parent::$options['version'], $this->currentVersion );
		return $version_diff == -1;
	}

	public function options(){
		wp_enqueue_script('ithoughts_tooltip_glossary-qtip');
		wp_enqueue_style('ithoughts_tooltip_glossary-css');
		wp_enqueue_style('ithoughts_tooltip_glossary-qtip-css');

		$ajax         = admin_url( 'admin-ajax.php' );
		$options      = parent::$options;
		extract($options);

		//Preview required resources
		wp_enqueue_script( 'ithoughts_tooltip_glossary-qtip' );
		wp_enqueue_script( 'ithoughts_tooltip_glossary-admin' );

		wp_enqueue_style( 'ithoughts_tooltip_glossary-css' );
		wp_enqueue_style( 'ithoughts_tooltip_glossary-qtip-css' );


		/* Add required scripts for WordPress Spoilers (AKA PostBox) */
		wp_enqueue_script('postbox');
		wp_enqueue_script('post');



		/* Add required resources for wpColorPicker */
		wp_enqueue_script( 'ithoughts_tooltip_glossary-styleeditor');
		wp_enqueue_style( 'ithoughts_tooltip_glossary-colorpicker' );

		wp_enqueue_style( 'wp-color-picker');
		wp_enqueue_style( 'ithoughts_tooltip_glossary-gradx' );




		// Tooptip DD
		$ttddoptions = array(
			'full' => array(
				'title' => __('Full', 'ithoughts_tooltip_glossary'),
				'attrs' => array('title'=>__('Display full post content', 'ithoughts_tooltip_glossary'))
			),
			'excerpt' => array(
				'title' => __('Excerpt', 'ithoughts_tooltip_glossary'),
				'attrs' => array('title'=>__('Display shorter excerpt content', 'ithoughts_tooltip_glossary'))
			), 
			'off' => array(
				'title' => __('Off', 'ithoughts_tooltip_glossary'),
				'attrs' => array('title'=>__('Do not display tooltip at all', 'ithoughts_tooltip_glossary'))
			),
		);
		$tooltipdropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'tooltips', array(
			'selected' => $tooltips,
			'options'  => $ttddoptions,
		) );


		// qTipd syle options
		$qtipdropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'qtipstyle', array(
			'selected' => $qtipstyle,
			'options'  => array(
				'cream'     => __('Cream',      'ithoughts_tooltip_glossary'), 
				'dark'      => __('Dark',       'ithoughts_tooltip_glossary'), 
				'green'     => __('Green',      'ithoughts_tooltip_glossary'), 
				'light'     => __('Light',      'ithoughts_tooltip_glossary'), 
				'red'       => __('Red',        'ithoughts_tooltip_glossary'), 
				'blue'      => __('Blue',       'ithoughts_tooltip_glossary'),
				'plain'     => __('Plain',      'ithoughts_tooltip_glossary'),
				'bootstrap' => __('Bootstrap',  'ithoughts_tooltip_glossary'),
				'youtube'   => __('YouTube',    'ithoughts_tooltip_glossary'),
				'tipsy'     => __('Tipsy',      'ithoughts_tooltip_glossary'),
			),
		));

		$qtiptriggerdropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'qtiptrigger', array(
			'selected' => $qtiptrigger,
			'options'  => array(
				'mouseenter' => array('title'=>__('Hover', 'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__('On mouseover (hover)', 'ithoughts_tooltip_glossary'))),
				'click' => array('title'=>__('Click', 'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__('On click',             'ithoughts_tooltip_glossary'))),
				'responsive' => array('title'=>__('Responsive', 'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__('Hover (on computer) and click (touch devices)',             'ithoughts_tooltip_glossary'))),
			),
		));

		// Term Link HREF target
		$termlinkoptdropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'termlinkopt', array(
			'selected' => $termlinkopt,
			'options'  => array(
				'standard' => array('title'=>__('Normal',  'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__('Normal link with no modifications', 'ithoughts_tooltip_glossary'))),
				'none'     => array('title'=>__('No link', 'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__("Don't link to term",                'ithoughts_tooltip_glossary'))),
				'blank'    => array('title'=>__('New tab', 'ithoughts_tooltip_glossary'), 'attrs'=>array('title'=>__("Always open in a new tab",          'ithoughts_tooltip_glossary'))),
			),
		));
?>
<div class="wrap">
	<div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50 metabox-holder">
		<div class="meta-box-inside admin-help">
			<div class="icon32" id="icon-options-general">
				<br>
			</div>
			<h2><?php _e('Options', 'ithoughts_tooltip_glossary'); ?></h2>
			<div id="dashboard-widgets-wrap">
				<div id="dashboard-widgets">
					<div id="normal-sortables" class=""><!--Old removed classes: "meta-box-sortables ui-sortable"-->
						<form action="<?php echo $ajax; ?>" method="post" class="simpleajaxform" data-target="update-response">

							<div id="ithoughts_tt_gllossary_options_1" class="postbox">
								<div class="handlediv" title="Cliquer pour inverser."><br></div><h3 class="hndle"><span><?php _e('Term Options', 'ithoughts_tooltip_glossary'); ?></span></h3>
								<div class="inside">
									<table class="form-table">
										<tbody>
											<tr>
												<th>
													<label for="termlinkopt"><?php _e('Term link', 'ithoughts_tooltip_glossary'); ?>:</label>
												</th>
												<td>
													<?php echo $termlinkoptdropdown ?>
												</td>
											</tr>
											<tr>
												<th>
													<label for="staticterms"><?php _e('Static terms', 'ithoughts_tooltip_glossary'); ?>&nbsp;<span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-nosolo="true" data-tooltip-content="<?php echo rawurlencode(__('Include term content directly into the pages to avoid use of Ajax. This can slow down your page generation.', 'ithoughts_tooltip_glossary')); ?>"><a href="javascript:void(0)">(<?php _e('infos', 'ithoughts_tooltip_glossary'); ?>)</a></span>:</label>
												</th>
												<td>
													<input autocomplete="off" type="checkbox" name="staticterms" id="staticterms" value="enabled" <?php echo ($staticterms ? " checked" : ""); ?>/>
												</td>
											</tr>
											<tr>
												<th>
													<label for="termtype"><?php _e('Base Permalink', 'ithoughts_tooltip_glossary'); ?>:</label>
												</th>
												<td>
													<code>/</code><input autocomplete="off" type="text" value="<?php echo $termtype; ?>" name="termtype" id="termtype"/><code>/</code>
												</td>
											</tr>
											<tr>
												<th>
													<label for="grouptype"><?php _e('Taxonomy group prefix', 'ithoughts_tooltip_glossary'); ?>:</label>
												</th>
												<td>
													<code>/<?php echo $termtype; ?>/</code><input autocomplete="off" type="text" value="<?php echo $grouptype; ?>" name="grouptype" id="grouptype"/><code>/</code>
												</td>
											</tr>
											<tr>
												<th>
													<label for="tooltips"><?php _e('Tooltip Content', 'ithoughts_tooltip_glossary'); ?>:</label>
												</th>
												<td>
													<?php echo $tooltipdropdown ?>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>

							<div class="postbox" id="ithoughts_tt_gllossary_options_2">
								<div class="handlediv" title="Cliquer pour inverser." onclick="window.refloat(this);"><br></div><h3 onclick="window.refloat(this);" class="hndle"><span><?php _e('qTip2 Tooltip Options', 'ithoughts_tooltip_glossary'); ?></span></h3>
								<div class="inside">
									<div style="display:flex;flex-direction:row;flex-wrap:wrap;">
										<div style="flex:1 1 auto;">


											<p><?php _e('iThoughts Tooltip Glossary uses the jQuery based <a href="http://qtip2.com/">qTip2</a> library for tooltips', 'ithoughts_tooltip_glossary'); ?></p>
											<table class="form-table">
												<tbody>
													<tr>
														<th>
															<label for="qtiptrigger"><?php _e('Tooltip activation', 'ithoughts_tooltip_glossary'); ?>:</label>
														</th>
														<td>
															<?php echo $qtiptriggerdropdown ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="qtipstyle"><?php _e('Tooltip Style (qTip)', 'ithoughts_tooltip_glossary'); ?>:</label>
														</th>
														<td>
															<?php echo $qtipdropdown ?>
														</td>
													</tr>
													<tr>
														<th>
															<label for="qtipshadow"><?php _e('Tooltip shadow', 'ithoughts_tooltip_glossary'); ?>&nbsp;<span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-nosolo="true" data-tooltip-content="<?php echo rawurlencode(__('This option can be overriden by some tooltip styles.', 'ithoughts_tooltip_glossary')); ?>"><a href="javascript:void(0)">(<?php _e('infos', 'ithoughts_tooltip_glossary'); ?>)</a></span>:</label>
														</th>
														<td>
															<input autocomplete="off" type="checkbox" name="qtipshadow" id="qtipshadow" value="enabled" <?php echo ($qtipshadow ? " checked" : ""); ?>/>
														</td>
													</tr>
													<tr>
														<th>
															<label for="qtiprounded"><?php _e('Rounded corners', 'ithoughts_tooltip_glossary'); ?>&nbsp;<span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-nosolo="true" data-tooltip-content="<?php echo rawurlencode(__('This option can be overriden by some tooltip styles.', 'ithoughts_tooltip_glossary')); ?>"><a href="javascript:void(0)">(<?php _e('infos', 'ithoughts_tooltip_glossary'); ?>)</a></span>:</label>
														</th>
														<td>
															<input autocomplete="off" type="checkbox" name="qtiprounded" id="qtiprounded" value="enabled" <?php echo ($qtiprounded ? " checked" : ""); ?>/>
														</td>
													</tr>
												</tbody>
											</table>


											<!-- <div id="ithoughts_tt_gl-customstyle" class="postbox closed">
<div class="handlediv" title="Cliquer pour inverser." onclick="window.refloat();"><br></div><h3 onclick="window.refloat();" class="hndle"><span><?php _e('Style editor', 'ithoughts_tooltip_glossary'); ?></span></h3>
<div class="inside">
<p><?php _e('Use this editor to fully customize the look of your tooltips', 'ithoughts_tooltip_glossary'); ?></p>
<div class="ajaxContainer"></div>
</div>
</div> -->


										</div>
										<div style="flex:1 1 auto;;position:relative;">
											<div id="floater" style="display:flex;flex-direction:row;width:100%;">
												<!--<p style="flex:1 1 auto;text-align:center">
<span class="ithoughts_tt_gl-tooltip" data-tooltip-nosolo="true" data-tooltip-id="exampleActivate" data-tooltip-content="<?php echo rawurlencode(__('The <b>tooltip</b> or <b>infotip</b> or a <b>hint</b> is a common <a href="/wiki/Graphical_user_interface" title="Graphical user interface">graphical user interface</a> element. It is used in conjunction with a <a href="/wiki/Cursor_(computers)" title="Cursor (computers)" class="mw-redirect">cursor</a>, usually a <a href="/wiki/Pointer_(graphical_user_interfaces)" title="Pointer (graphical user interfaces)">pointer</a>. The user hovers the pointer over an item, without clicking it, and a tooltip may appear—a small "<a href="/wiki/Hoverbox" title="Hoverbox">hover box</a>" with information about the item being hovered over.<sup id="cite_ref-1" class="reference"><a href="#cite_note-1"><span>[</span>1<span>]</span></a></sup> <sup id="cite_ref-2" class="reference"><a href="#cite_note-2"><span>[</span>2<span>]</span></a></sup>Tooltips do not usually appear on <a href="/wiki/Mobile_operating_system" title="Mobile operating system">mobile operating systems</a>, because there is no cursor (though tooltips may be displayed when using a <a href="/wiki/Mouse_(computing)" title="Mouse (computing)">mouse</a>).', 'ithoughts_tooltip_glossary')); ?>"><a href="javascript:void(0)" title=""><?php _e('Activate me', 'ithoughts_tooltip_glossary'); ?></a></span>
</p>-->
												<p style="flex:1 1 auto;text-align:center">
													<span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-autoshow="true" data-tooltip-id="exampleStyle" data-tooltip-nosolo="true" data-tooltip-nohide="true" data-tooltip-content="<?php _e('This is an example tooltip, with content such as <a>a tag for link</a>, <em>em tag for emphasis</em>, <b>b tag for bold</b> and <i>i tag for italic</i>', 'ithoughts_tooltip_glossary'); ?>"><a href="javascript:void(0)" title=""><?php _e('Example Tooltip', 'ithoughts_tooltip_glossary'); ?></a></span>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<p>
								<input autocomplete="off" type="hidden" name="action" value="ithoughts_tt_gl_update_options"/>
								<input autocomplete="off" type="submit" name="submit" class="alignleft button-primary" value="<?php _e('Update Options', 'ithoughts_tooltip_glossary'); ?>"/>
							</p>

						</form>
						<div id="update-response" class="clear confweb-update"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<?php
	}

	public function update_options(){
		$glossary_options = parent::$options;

		$postValues = $_POST;
		$postValues['qtipshadow']  = ithoughts_tt_gl_toggleable_to_bool($postValues,'qtipshadow',  "enabled");
		$postValues['qtiprounded'] = ithoughts_tt_gl_toggleable_to_bool($postValues,'qtiprounded', "enabled");
		$postValues['staticterms'] = ithoughts_tt_gl_toggleable_to_bool($postValues,'staticterms', "enabled");

		$glossary_options_old = $glossary_options;
		$glossary_options = array_merge($glossary_options, $postValues);
		$defaults = parent::getPluginOptions(true);
		foreach($glossary_options as $optkey => $optvalue){
			if(!isset($defaults[$optkey]))
				unset($glossary_options[$optkey]);
		}

		$outtxt = "";
		$valid = true;
		$reload = false;

		$glossary_options["termtype"] = urlencode( $glossary_options["termtype"] );
		$glossary_options["grouptype"] = urlencode( $glossary_options["grouptype"] );

		if(strlen($glossary_options["termtype"]) < 1){
			$outtxt .= ('<p>' . __('Invalid input for', 'ithoughts_tooltip_glossary') . " \"" . __('Base Permalink', 'ithoughts_tooltip_glossary') . '"</p>') ;
			$valid = false;
		}
		if(strlen($glossary_options["grouptype"]) < 1){
			$outtxt .= ('<p>' . __('Invalid input for', 'ithoughts_tooltip_glossary') . " \"" . __('Taxonomy group prefix', 'ithoughts_tooltip_glossary') . '"</p>') ;
			$valid = false;
		}

		if($valid){
			if(
				$glossary_options_old["termtype"] != $glossary_options["termtype"] ||
				$glossary_options_old["grouptype"] != $glossary_options["grouptype"]
			){
				$reload = true;
				$glossary_options["needflush"] = true;
				flush_rewrite_rules(false);
				$outtxt .= "<p>" . __( 'Rewrite rule flushed', 'ithoughts_tooltip_glossary' ) . "</p>";
			}
			update_option( 'ithoughts_tt_gl', $glossary_options );
			parent::$options = $glossary_options;
			$outtxt .= ('<p>' . __('Options updated', 'ithoughts_tooltip_glossary') . '</p>') ;
		}

		die( json_encode(array(
			"reload" => $reload,
			"text" =>$outtxt,
			"valid" => $valid
		)));
	}

	public function getTinyMCETooltipFormAjax(){
		$data = array();

		$mediatiptypes = array(
			'localimage' => array(
				'title' => __('Local image', 'ithoughts_tooltip_glossary'),
				'attrs' => array('title'=>__('Image from site library', 'ithoughts_tooltip_glossary'))
			), 
			'webimage' => array(
				'title' => __('Image on the web', 'ithoughts_tooltip_glossary'),
				'attrs' => array('title'=>__('Image referenced by url, not on the site', 'ithoughts_tooltip_glossary'))
			),
			'webvideo' => array(
				'title' => __('Video on the web', 'ithoughts_tooltip_glossary'),
				'attrs' => array('title'=>__('Video hosted online. Only Youtube', 'ithoughts_tooltip_glossary'))
			),
		);
		$mediatiptypes_keys = array_keys($mediatiptypes);

		isset($_POST['data']) && $data=$_POST['data'];

		// Set defaults
		$types = array("glossary", "tooltip", "mediatip");
		try{
			$data["type"] = isset($data["type"]) && $data["type"] && array_search($data["type"], $types) !== false ? $data["type"] : "tooltip";
			$data["text"] = isset($data["text"]) ? $data["text"] : "";
			$data["glossary_id"] = isset($data["glossary_id"]) ? $data["glossary_id"] : NULL;
			$data["term_search"] = isset($data["term_search"]) ? $data["term_search"] : "";
			$data["mediatip_type"] = isset($data["mediatip_type"]) && $data["mediatip_type"] && isset($mediatiptypes[$data["mediatip_type"]]) ? $data["mediatip_type"] : $mediatiptypes_keys[0];
			$data["mediatip_content_json"] = ithoughts_tt_gl_encode_json_attr(isset($data["mediatip_content"]) ? $data["mediatip_content"] : "");
			$data["mediatip_content"] = ithoughts_tt_gl_decode_json_attr(isset($data["mediatip_content"]) ? $data["mediatip_content"] : "");
			switch($data["type"]){
				case "glossary":{
				} break;

				case "tooltip":{
					$data["tooltip_content"] = str_replace('\"', '"', isset($data["tooltip_content"]) ? $data["tooltip_content"] : "");
				} break;

				case "mediatip":{
				} break;
			}
		} catch(Exception $e){
			$data["type"] = "tooltip";
			$data["text"] = "";
			$data["glossary_id"] = NULL;
			$data["term_search"] = "";
			$data["mediatip_type"] = $mediatiptypes_keys[0];
			$data["mediatip_content_json"] = "";
			$data["mediatip_content"] = "";
			$data["tooltip_content"] = "";
		}

		// Ok go

		// Retrieve terms
		$form_data = array(
			"admin_ajax"    => admin_url('admin-ajax.php'),
			"base_tinymce"  => parent::$base_url . '/js/tinymce',
			"terms"         => array()
		);
		$args;
		if($data["glossary_id"] == NULL){
			$args= array(
				"post_type"     => "glossary",
				'post_status'   => 'publish',
				'orderby'       => 'title',
				'order'         => 'ASC',
				'posts_per_page'   => 25,
				's'             => $data['term_search'],
			);
		} else {
			$args= array(
				"post_type"     => "glossary",
				'post_status'   => 'publish',
				'orderby'       => 'title',
				'order'         => 'ASC',
				'posts_per_page'   => 25,
				'post__in'      => array($data["glossary_id"]),
			);
		}
		$query = new WP_Query($args);
		if ( $query->have_posts() ) {
			global $post;
			if($data["glossary_id"] == NULL){
				$datas = array();
				// Start looping over the query results.
				while ( $query->have_posts() ) {
					$query->the_post();
					$datas[] = array(
						"slug"      => $post->post_name,
						"content"   => wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
						"title"     => $post->post_title,
						"id"        => $post->ID
					);
				}
				$form_data['terms'] = $datas;
			} else {
				$query->the_post();
				$data["term_title"] = $post->post_title;
				$datas[] = array(
					"slug"      => $post->post_name,
					"content"   => wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
					"title"     => $post->post_title,
					"id"        => $post->ID
				);
			}
		}
		wp_localize_script( "ithoughts_tooltip_glossary-tinymce_form", "ithoughts_tt_gl_tinymce_form", $form_data );


		$mediatipdropdown = ithoughts_tt_gl_build_dropdown_multilevel( 'mediatip_type', array(
			'selected' => $data["mediatip_type"],
			'options'  => $mediatiptypes,
			"class"    => "modeswitcher"
		) );

		ob_start();
		include parent::$plugin_base."/templates/tinymce-tooltip-form.php";

		wp_reset_postdata();

		$output = ob_get_clean();
		echo $output;
		wp_die();
	}
	public function getCustomizingFormAjax(){
		$prefixs = array("t", "c",  "g"); // Used in style editor loop
		ob_start();
		include parent::$plugin_base."/templates/customizing_form.php";
		$output = ob_get_clean();
		wp_send_json_success($output);
	}
}
