<?php
/**
  * @copyright 2015-2016 iThoughts Informatique
  * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
  */

namespace ithoughts\tooltip_glossary;


class Backbone extends \ithoughts\v1_1\Backbone{
	private $defaults;
	private $overridesjsdat;
	private $overridesopts;
	private $optionsConfig;
	private $handledAttributes;

	function __construct($plugin_base) {
		if(defined("WP_DEBUG") && WP_DEBUG)
			$this->minify = "";
		$this->optionsName		= "ithoughts_tt_gl";
		$this->base_path		= $plugin_base;
		$this->base_class_path	= $plugin_base . '/class';
		$this->base_lang_path	= $plugin_base . '/lang';
		$this->base_url			= plugins_url( '', dirname(__FILE__) );

		$optionsConfig = array(
			'version'		=> array(
				"default"		=> '-1',
				"serversideOverride"	=> false,
				"cliensideOverride"	=> false,
			),
			'termcontent'		=> array(
				"default"		=> 'excerpt',
				"serversideOverride"	=> false,
				"cliensideOverride"	=> true,
				"accepted"		=> array(
					'full',
					'excerpt', 
					'off',
				),
			),
			'termtype'		=> array(
				"default"		=> 'glossary',
				"serversideOverride"	=> false,
				"cliensideOverride"	=> false,
			),
			'grouptype'		=> array(
				"default"		=> 'group',
				"serversideOverride"	=> false,
				"cliensideOverride"	=> false,
			),
			'qtipstyle'		=> array(
				"default"		=> 'cream',
				"serversideOverride"	=> false,
				"cliensideOverride"	=> true,
				"accepted"		=> array(
					'cream', 
					'dark', 
					'green', 
					'light', 
					'red', 
					'blue',
					'plain',
					'bootstrap',
					'youtube',
					'tipsy',
				),
			),
			'termlinkopt'	=> array(
				"default"		=> 'standard',
				"serversideOverride"	=> true,
				"cliensideOverride"	=> false,// Not a js data
				"accepted"		=> array(
					'standard',
					'none',
					'blank',
				),
			),
			'qtiptrigger'	=> array(
				"default"		=> 'click',
				"serversideOverride"	=> false,
				"cliensideOverride"	=> true,
				"accepted"		=> array(
					'click',
					'responsive',
				),
			),
			'qtipshadow'	=> array(
				"default"		=> true,
				"serversideOverride"	=> false,
				"cliensideOverride"	=> true,
				"accepted"		=> array(
					true,
					false,
				),
			),
			'qtiprounded'	=> array(
				"default"		=> false,
				"serversideOverride"	=> false,
				"cliensideOverride"	=> true,
				"accepted"		=> array(
					true,
					false,
				),
			),
			'staticterms'	=> array(
				"default"		=> false,
				"serversideOverride"	=> false,// If required once, required everywhere
				"cliensideOverride"	=> false,// Not a js data
				"accepted"		=> array(
					true,
					false,
				),
			),
			'forceloadresources'	=> array(
				"default"		=> false,
				"serversideOverride"	=> false,// If required once, required everywhere
				"cliensideOverride"	=> false,// Not a js data
				"accepted"		=> array(
					true,
					false,
				),
			),
			'custom_styles_path'	=> array(
				"default"		=> null,
				"serversideOverride"	=> false,// If required once, required everywhere
				"cliensideOverride"	=> false,// Not a js data
			),
		);


		$this->defaults = array();
		foreach($optionsConfig as $opt => $val){
			$this->defaults[$opt] = $val["default"];
		}
		$this->clientsideOverridable = array();
		foreach($optionsConfig as $opt => $val){
			if($val["cliensideOverride"])
				$this->clientsideOverridable[] = $opt;
		}
		$this->serversideOverridable = array();
		foreach($optionsConfig as $opt => $val){
			if($val["serversideOverride"])
				$this->serversideOverridable[] = $opt;
		}

		$this->handledAttributes = array(
			"tooltip-content",
			"glossary-id",
			"mediatip-type",
			"mediatip-content",
			"mediatip-link",
			"cols",
			"group",
			"alpha",
			"desc",
			"disable_auto_translation",
		);

		$this->options		= $this->initOptions();



		$this->scripts = array();


		$this->register_post_types();
		$this->register_taxonmies();
		$this->add_shortcodes();
		$this->add_widgets();
		$this->add_filters();
		add_action( 'init',                  		array(&$this,	'register_scripts_and_styles')			);
		add_action( 'init',                  		array(&$this,	'ajaxHooks')							);
		add_action( 'wp_footer',             		array(&$this,	'wp_footer')							);
		add_action( 'wp_enqueue_scripts',    		array(&$this,	'wp_enqueue_styles')					);
		add_action( 'pre_get_posts',         		array(&$this,	'order_core_archive_list')     			);

		add_filter( 'ithoughts_tt_gl_term_link',	array(&$this,	'ithoughts_tt_gl_term_link')			);
		add_filter( 'ithoughts_tt_gl_get_overriden_opts',	array(&$this,	'ithoughts_tt_gl_override'), 	10,	2	);

		add_action( 'plugins_loaded',				array($this,	'localisation')							);

		parent::__construct();
	}

	public function get_client_side_overridable(){
		return $this->clientsideOverridable;
	}

	public function get_server_side_overridable(){
		return $this->serversideOverridable;
	}

	public function get_handled_attributes(){
		return $this->handledAttributes;
	}
	private function initOptions(){
		$opts = array_merge($this->get_options(true), get_option( $this->optionsName, $this->get_options(true) ));
		if(isset($opts["tooltips"]) && $opts["tooltips"]){
			$opts["termcontent"] = $opts["tooltips"];
			unset($opts["tooltips"]);
		}
		return $opts;
	}
	public function add_filters(){
		require_once( $this->base_class_path . '/Filters.class.php' );
		new filters();
	}
	public function addScript($newArray){
		$this->scripts = array_merge($this->scripts, $newArray);
	}
	public function ajaxHooks(){
		add_action( 'wp_ajax_ithoughts_tt_gl_get_terms_list',			array(&$this, 'getTermsListAjax') );
		add_action( 'wp_ajax_nopriv_ithoughts_tt_gl_get_terms_list',	array(&$this, 'getTermsListAjax') );

		add_action( 'wp_ajax_nopriv_ithoughts_tt_gl_get_term_details', array(&$this, 'getTermDetailsAjax') );
		add_action( 'wp_ajax_ithoughts_tt_gl_get_term_details',        array(&$this, 'getTermDetailsAjax') );
	}

	public function get_options($onlyDefaults = false){
		if($onlyDefaults)
			return $this->defaults;

		return $this->options;
	}

	public function get_option($name, $onlyDefaults = false){
		$arr = $this->options;
		if($onlyDefaults)
			return $this->defaults;

		if(isset($arr[$name]))
			return $arr[$name];
		else
			return NULL;
	}

	public function localisation(){
		load_plugin_textdomain( 'ithoughts-tooltip-glossary', false, plugin_basename( dirname( __FILE__ ) )."/../lang" );
	}

	private function register_post_types(){
		require_once( $this->base_class_path . '/PostTypes.class.php' );
		new PostTypes();
	}

	private function register_taxonmies(){
		require_once( $this->base_class_path . '/Taxonomies.class.php' );
		new Taxonomies();
	}

	private function add_shortcodes(){
		require_once( $this->base_class_path . '/shortcode/Tooltip.class.php' );
		new shortcode\Tooltip();
		require_once( $this->base_class_path . '/shortcode/Mediatip.class.php' );
		new shortcode\Mediatip();
		require_once( $this->base_class_path . '/shortcode/Glossary.class.php' );
		new shortcode\Glossary();
		require_once( $this->base_class_path . '/shortcode/AtoZ.class.php' );
		new shortcode\AtoZ();
		require_once( $this->base_class_path . '/shortcode/TermList.class.php' );
		new shortcode\TermList();
	}

	private function add_widgets(){
		require_once( $this->base_class_path . '/RandomTerm.class.php' );
		add_action( 'widgets_init', array($this, 'widgets_init') );
	}

	public function widgets_init(){
		register_widget( '\\ithoughts\\tooltip_glossary\\widgets\\RandomTerm' );
	}

	public function register_scripts_and_styles(){
		wp_register_script('imagesloaded', $this->base_url . '/ext/imagesloaded.min.js',										null, null, true);
		wp_register_script('qtip', $this->base_url . '/ext/jquery.qtip'.$this->minify.'.js',												array('jquery', 'imagesloaded'), "2.2.1:2", null, true);
		wp_register_script( 'ithoughts_tooltip_glossary-qtip',  $this->base_url . '/js/ithoughts_tooltip_glossary-qtip2'.$this->minify.'.js',	array('qtip', "ithoughts_aliases"), "2.4.0" );
		wp_localize_script( 'ithoughts_tooltip_glossary-qtip', 'ithoughts_tt_gl', array(
			'admin_ajax'    => admin_url('admin-ajax.php'),
			'baseurl'		=> $this->base_url,
			'qtipstyle'     => $this->options["qtipstyle"],
			'qtiptrigger'   => $this->options["qtiptrigger"],
			'qtipshadow'    => $this->options["qtipshadow"],
			'qtiprounded'   => $this->options["qtiprounded"],
			'termcontent'	=> $this->options["termcontent"],
			'lang'			=> array(
				"qtip" => array(
					"pleasewait_ajaxload" => array(
						"title" => __('Please wait', 'ithoughts-tooltip-glossary' ),
						"content" => __('Loading glossary term', 'ithoughts-tooltip-glossary' )
					)
				)
			)
		) );
		wp_register_script( 'ithoughts_tooltip_glossary-atoz',  $this->base_url . '/js/ithoughts_tooltip_glossary-atoz'.$this->minify.'.js',  array('jquery', "ithoughts_aliases"), "2.4.0" );


			wp_register_style( 'ithoughts_tooltip_glossary-css', $this->base_url . '/css/ithoughts_tooltip_glossary'.$this->minify.'.css', null, "2.4.0" );
		wp_register_style( 'ithoughts_tooltip_glossary-qtip-css', $this->base_url . '/ext/jquery.qtip'.$this->minify.'.css', null, "2.2.2");
		if(isset($this->options["custom_styles_path"]))
			wp_register_style( 'ithoughts_tooltip_glossary-customthemes', $this->options["custom_styles_path"], null, null);
	}

	public function wp_footer(){
		if( !$this->scripts && $this->options["forceloadresources"] !== true)
			return;

		if($this->get_script('qtip') || $this->options["forceloadresources"] === true){
?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
	<defs>
		<g id="icon-pin">
			<path
				  d="M 0.25621998,25.646497 C 0.35412138,25.51563 8.5166343,14.857495 8.5374693,14.833322 c 0.01094,-0.0127 0.590149,0.546824 1.2871218,1.243379 l 1.2672239,1.266464 -0.113872,0.108034 c -0.06263,0.05942 -2.4218887,1.87452 -5.2427987,4.033559 -2.8209111,2.159038 -5.22033552,3.995592 -5.33205472,4.081231 -0.1117192,0.08564 -0.1778105,0.121867 -0.1468696,0.08051 z M 10.813205,15.081346 5.1765477,9.4410226 5.5066273,9.1363586 c 1.352333,-1.248209 3.394005,-2.021634 5.3421487,-2.02371 0.458009,-5.08e-4 1.41897,0.119826 1.818038,0.227623 0.153614,0.04149 0.294168,0.07572 0.312341,0.07605 0.01817,3.55e-4 1.092202,-1.489664 2.386729,-3.3111007 1.294528,-1.8214368 2.428561,-3.38662092 2.520075,-3.47818672 0.28165,-0.2818105 0.555582,-0.3909508 0.943521,-0.3759184 0.182951,0.00709 0.162107,-0.013074 3.864784,3.73859352 3.254781,3.2978453 3.086677,3.0918563 2.93667,3.5984923 -0.05076,0.17145 -0.146799,0.319619 -0.312683,0.482424 -0.13168,0.129236 -1.72794,1.247526 -3.547245,2.4850904 l -3.307827,2.250116 0.07053,0.238176 c 0.261983,0.884659 0.33256,2.448506 0.155133,3.437409 -0.207111,1.154346 -0.770968,2.461073 -1.459695,3.382811 -0.341163,0.456586 -0.692454,0.857442 -0.751422,0.857442 -0.01533,0 -2.564362,-2.538145 -5.664523,-5.640321 z m 1.183444,-3.15174 c 0.635549,-0.607589 1.394229,-1.208949 1.823733,-1.445565 0.189467,-0.104378 0.350419,-0.193746 0.357671,-0.198595 0.0073,-0.0049 -0.209838,-0.23123 -0.482424,-0.5030684 l -0.495609,-0.494252 -0.458787,0.02717 c -0.763005,0.04518 -1.725568,0.417431 -2.613089,1.0105574 -0.2096949,0.140138 -0.3897971,0.261798 -0.4002271,0.270355 -0.02985,0.02449 1.6821321,1.797302 1.7356301,1.797302 0.02632,0 0.266216,-0.208755 0.533102,-0.4639 z m 6.401659,-4.9697184 c 1.204232,-1.103227 2.189716,-2.019561 2.189964,-2.036297 0.0011,-0.07401 -1.735932,-1.6808181 -1.772946,-1.6400264 -0.02268,0.024997 -0.866374,1.1015034 -1.874874,2.3922374 l -1.833635,2.346789 0.493873,0.483774 c 0.27163,0.266075 0.519575,0.478287 0.550989,0.471582 0.03141,-0.0067 1.042397,-0.914832 2.246629,-2.018059 z" />
		</g>
	</defs>
</svg>
<?php
			wp_enqueue_script( 'ithoughts_tooltip_glossary-qtip' );
		}
		if($this->get_script('atoz') || $this->options["forceloadresources"] === true)
			wp_enqueue_script( 'ithoughts_tooltip_glossary-atoz' );
	}

	public function wp_enqueue_styles(){
		wp_enqueue_style( 'ithoughts_tooltip_glossary-css' );
		wp_enqueue_style( 'ithoughts_tooltip_glossary-qtip-css' );
		wp_enqueue_style('ithoughts_tooltip_glossary-customthemes');
	}
	public function wp_enqueue_scripts_hight_priority(){
		wp_enqueue_script('ithoughts_aliases');
	}

	/**
	 * Order post and taxonomy archives alphabetically
	 */
	public function order_core_archive_list( $query ){
		if( is_post_type_archive("glossary") || is_tax('glossary_group') ){
			$query->set( 'orderby', 'title' );
			$query->set( 'order',   'ASC' );
			return;
		}
	}

	/** 
	 * Translation support
	 */
	public function ithoughts_tt_gl_term_link( $url ){
		// qTranslate plugin
		if( function_exists('qtrans_convertURL') ):
		$url = qtrans_convertURL( $url );
		endif;

		return $url;
	}
	public function ithoughts_tt_gl_override($data, $clientSide){
		$overridden = array();
		if($clientSide){
			foreach($this->clientsideOverridable as $overrideable){
				if(isset($data[$overrideable]) && ($data[$overrideable] != $this->options[$overrideable]))
					$overridden[$overrideable] = $data[$overrideable];
			}
		} else {
			$overriddenConcat = array_merge($this->options, $data);
			foreach($this->options as $option => $value){
				if(in_array($option, $this->serversideOverridable))
					$overridden[$option] = $overriddenConcat[$option];
				else
					$overridden[$option] = $this->options[$option];
			}
		}
		return $overridden;
	}

	public function searchTerms($args){
		$posts = array();
		if ( function_exists('icl_object_id') ) {
			// With WPML
			$originalLanguage = apply_filters( 'wpml_current_language', NULL );

			$args["suppress_filters"] = true;
			$posts = get_posts( $args );



			$postIds = array();
			$notTranslated = array();
			foreach($posts as $post){
				$id = apply_filters( 'wpml_object_id', $post->ID, "glossary", FALSE, $originalLanguage );
				if($id != NULL)
					$postIds[] = $id;
				else
					$notTranslated[] = $post->ID;
			}
			$postIds = array_unique($postIds);
			$notTranslated = array_unique($notTranslated);
			$notTranslated = array_diff($notTranslated,$postIds);
			$outPosts = array();

			$argsP = array(
				'post__in' => $postIds,
				'orderby'       	=> 'title',
				'order'         	=> 'ASC',
				"suppress_filters" => true,
				'post_type' => 'glossary',
			);
			$posts = get_posts($argsP);
			foreach($posts as $post){
				$outPosts[] = array(
					"slug"		=> $post->post_name,
					"content"	=> wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
					"title"     => $post->post_title,
					"id"		=> $post->ID,
					"thislang"	=> true
				);
			}
			$argsP = array(
				'post__in' => $notTranslated,
				'orderby'       	=> 'title',
				'order'         	=> 'ASC',
				"suppress_filters" => true,
				'post_type' => 'glossary',
			);
			$posts = get_posts($argsP);
			foreach($posts as $post){
				$outPosts[] = array(
					"slug"		=> $post->post_name,
					"content"	=> wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
					"title"     => $post->post_title,
					"id"		=> $post->ID,
					"thislang"	=> false
				);
			}
			$posts = $outPosts;
		} else {
			$outPosts = array();
			$posts = get_posts($args);
			foreach($posts as $post){
				$outPosts[] = array(
					"slug" => $post->post_name,
					"content" => wp_trim_words(wp_strip_all_tags((isset($post->post_excerpt)&&$post->post_excerpt)?$post->post_excerpt:$post->post_content), 50, '...'),
					"title"     => $post->post_title,
					"id" => $post->ID,
				);
			}
			$posts = $outPosts;
		}
		return $posts;
	}

	public function getTermsListAjax(){
		$output = array(
			"terms" => $this->searchTerms(array(
				'post_type'			=> 'glossary',
				'post_status'		=> 'publish',
				'posts_per_page'	=> 25,
				'orderby'       	=> 'title',
				'order'         	=> 'ASC',
				's'             	=> $_POST["search"],
				'suppress_filters'	=> false
			)),
			"searched" => $_POST["search"]
		);
		wp_send_json_success($output);
		return;
	}
	public function getTermDetailsAjax(){
		// Sanity and security checks:
		//  - we have a termid (post id)
		//  - it is post of type 'glossary' (don't display other post types!)
		//  - it has a valid post status and current user can read it.
		$statii = array( 'publish', 'private' );
		$term   = null;
		if( isset($_POST['termid']) && $termid=$_POST['termid'] ){
			$termid = intval( $termid );
			if( function_exists('icl_object_id')){
				if(!(isset($_POST["disable_auto_translation"]) && $_POST["disable_auto_translation"])){
					$termid = apply_filters( 'wpml_object_id', $termid, "glossary", true, apply_filters( 'wpml_current_language', NULL ) );
				}
			}
			$termob = get_post( $termid );
			if( get_post_type($termob) && get_post_type($termob) == "glossary" && in_array($termob->post_status, $statii) ){
				$term = $termob;
			}
		}

		// Fail if no term found (either due to bad set up, or someone trying to be sneaky!)
		if( !$term )
			wp_send_json_error();

		// Title
		$title = $term->post_title;

		// Don't display private terms
		if( $termob->post_status == 'private' && !current_user_can('read_private_posts') ){
			wp_send_json_success( array('title'=>$title, 'content'=>'<p>'.__('Private glossary term', 'ithoughts-tooltip-glossary' ).'</p>') );
		}

		// Don't display password protected items.
		if( post_password_required($termid) ){
			wp_send_json_success( array('title'=>$title, 'content'=>'<p>'.__('Protected glossary term', 'ithoughts-tooltip-glossary' ).'</p>') );
		}

		// Content
		// Merge with static shortcode method 
		switch( $_POST['content'] ){
			case 'full':{
				$content = do_shortcode($termob->post_content);
			}break;

			case 'excerpt':{
				$content = apply_filters("ithoughts_tt_gl-term-excerpt", $termob);
			}break;

			case 'off':{
				$content = "";
			}break;
		}

		// No content found, assume due to clash in settings and fetch full post content just in case.
		if( empty($content) )
			$content = $term->post_content ;
		if( empty($content) )
			$content = '<p>'.__('No content', 'ithoughts-tooltip-glossary' ).'...</p>';


		wp_send_json_success( array('title'=>$title, 'content'=>$content) );
	}
}
