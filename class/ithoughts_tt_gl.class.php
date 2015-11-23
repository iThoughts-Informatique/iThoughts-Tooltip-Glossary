<?php
/**
 * ithoughts-tooltip-glossary Core Class
 */
//require_once( dirname(__FILE__).'/ithoughts_tt_gl-post_typs.class.php' );
class ithoughts_tt_gl_interface{
	static protected $basePlugin;
	static protected $options;
	static protected $base_url;
	static protected $base_lang;
	static protected $base;
	
	public function getPluginOptions($defaultsOnly = false){
		return self::$basePlugin->getOptions($defaultsOnly);
	}
}
class ithoughts_tt_gl extends ithoughts_tt_gl_interface{

	function __construct($plugin_base) {
		parent::$basePlugin = &$this;
		parent::$base         = $plugin_base . '/class';
		parent::$base_lang	= $plugin_base . '/lang';
		parent::$base_url		= plugins_url( '', dirname(__FILE__) );
		parent::$options		= get_option( 'ithoughts_tt_gl', $this->getOptions(true) );


		$this->register_post_types();
		$this->register_taxonmies();
		$this->add_shortcodes();
		$this->add_widgets();
		add_action( 'init',                  		array(&$this,	'register_scripts_and_styles')	);
		add_action( 'wp_footer',             		array(&$this,	'wp_footer')					);
		add_action( 'wp_enqueue_scripts',    		array(&$this,	'wp_enqueue_scripts')			);
		add_action( 'pre_get_posts',         		array(&$this,	'order_core_archive_list')     	);

		add_filter( 'ithoughts_tt_gl_term_link',	array(&$this,	'ithoughts_tt_gl_term_link')	);

		add_action( 'plugins_loaded',				array($this,	'localisation')					);
	}

	protected function base() {
		return $this->base;
	}
	protected function base_url() {
		return $this->base_url;
	}

	public function getOptions($onlyDefaults = false){
		if($onlyDefaults)
			return array(
			'tooltips'		=> 'excerpt',
			'alphaarchive'	=> 'standard',
			'termtype'		=> 'glossary',
			'grouptype'		=> 'group',
			'qtipstyle'		=> 'cream',
			'termlinkopt'	=> 'standard',
			'termusage'		=> 'on',
			'qtiptrigger'	=> 'hover',
			'qtipshadow'	=> false,
			'qtiprounded'	=> false,
			'staticterms'	=> false
		);

		return $this->options;
	}

	public function localisation(){
		load_plugin_textdomain( 'ithoughts_tooltip_glossary', false, plugin_basename( dirname( __FILE__ ) )."/../lang" );
	}

	private function register_post_types(){
		require_once( parent::$base . '/ithoughts_tt_gl-post-types.class.php' );
		new ithoughts_tt_gl_Post_Types($this);
	}

	private function register_taxonmies(){
		require_once( parent::$base . '/ithoughts_tt_gl-taxonomies.class.php' );
		new ithoughts_tt_gl_Taxonomies();
	}

	private function add_shortcodes(){
		require_once( parent::$base . '/ithoughts_tt_gl-shortcode-tooltip.class.php' );
		new ithoughts_tt_gl_Shortcodes_tooltip();
		require_once( parent::$base . '/ithoughts_tt_gl-shortcode-mediatip.class.php' );
		new ithoughts_tt_gl_Shortcodes_mediatip();
		require_once( parent::$base . '/ithoughts_tt_gl-shortcode-glossary.class.php' );
		new ithoughts_tt_gl_Shortcodes_glossary();
		require_once( parent::$base . '/ithoughts_tt_gl-shortcode-glossary-atoz.class.php' );
		new ithoughts_tt_gl_Shortcode_ATOZ();
		require_once( parent::$base . '/ithoughts_tt_gl-shortcode-glossary-list.class.php' );
		new ithoughts_tt_gl_Shortcode_TERMLIST();
	}

	private function add_widgets(){
		require_once( parent::$base . '/ithoughts_tt_gl-widget-random-term.class.php' );
		add_action( 'widgets_init', array($this, 'widgets_init') );
	}

	public function widgets_init(){
		register_widget( 'ithoughts_tt_gl_RandomTerm' );
	}

	public function register_scripts_and_styles(){
		$options     = get_option( 'ithoughts_tt_gl', array() );

		$qtipstyle   = isset( $options['qtipstyle'] )   ? $options['qtipstyle']:   'cream';
		$qtiptrigger = isset( $options['qtiptrigger'] ) ? $options['qtiptrigger']: 'hover';
		$qtipshadow   = isset( $options['qtipshadow'] )   ? $options['qtipshadow']   : true;
		$qtiprounded  = isset( $options['qtiprounded'] )  ? $options['qtiprounded']  : true;




		wp_register_script('imagesloaded', parent::$base_url . '/ext/imagesloaded.min.js', null, false, true);
		wp_register_script('qtip', parent::$base_url . '/ext/jquery.qtip.js', array('jquery', 'imagesloaded'), false, true);
		wp_register_script( 'ithoughts-tooltip-glossary-qtip',  parent::$base_url . '/js/ithoughts_tooltip_glossary-qtip2.js', array('qtip'), "2.0.4" );
		wp_localize_script( 'ithoughts-tooltip-glossary-qtip', 'ithoughts_tt_gl', array(
			'admin_ajax'    => admin_url('admin-ajax.php'),
			'baseurl'		=> parent::$base_url,
			'qtipstyle'     => $qtipstyle,
			'qtiptrigger'   => $qtiptrigger,
			'qtipshadow'    => $qtipshadow,
			'qtiprounded'   => $qtiprounded
		) );
		wp_register_script( 'ithoughts-tooltip-glossary-atoz',  parent::$base_url . '/js/ithoughts_tooltip_glossary-atoz.js',  array('jquery') );
		

		if( file_exists(get_stylesheet_directory() . '/ithoughts_tooltip_glossary.css') ){
			wp_register_style( 'ithoughts_tooltip_glossary-css', get_stylesheet_directory_uri() . '/ithoughts_tooltip_glossary.css' );
		}else{
			wp_register_style( 'ithoughts_tooltip_glossary-css', parent::$base_url . '/css/ithoughts_tooltip_glossary.css' );
		}
		wp_register_style( 'ithoughts_tooltip_glossary-qtip-css', parent::$base_url . '/ext/jquery.qtip.css' );
	}

	private function wp_footer(){
		global $ithoughts_tt_gl_scritpts;
		if( !$ithoughts_tt_gl_scritpts )
			return;

		if($ithoughts_tt_gl_scritpts['qtip']){
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
			wp_print_scripts( 'ithoughts-tooltip-glossary-qtip' );
		}
		if($ithoughts_tt_gl_scritpts['atoz'])
			wp_print_scripts( 'ithoughts-tooltip-glossary-atoz' );
	}

	public function wp_enqueue_scripts(){
		wp_enqueue_style( 'ithoughts-tooltip-glossary-css' );
		wp_enqueue_style( 'ithoughts-tooltip-glossary-qtip-css' );
	}

	/**
	 * Order post and taxonomy archives alphabetically
	 */
	public function order_core_archive_list( $query ){
		if( is_post_type_archive("glossary") || is_tax('ithoughts_tt_gllossarygroup') ):
		$glossary_options = get_option( 'ithoughts_tt_gl' );
		$archive          = $glossary_options['alphaarchive'] ? $glossary_options['alphaarchive'] : 'standard';
		if( $archive == 'alphabet' ):
		$query->set( 'orderby', 'title' );
		$query->set( 'order',   'ASC' );
		return;
		endif;
		endif;
	}

	/** 
	 * Translation support
	 */
	private function ithoughts_tt_gl_term_link( $url ){
		// qTranslate plugin
		if( function_exists('qtrans_convertURL') ):
		$url = qtrans_convertURL( $url );
		endif;

		return $url;
	}
}
