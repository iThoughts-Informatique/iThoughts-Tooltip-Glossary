<?php

class ithoughts_tt_gl_Updater{
	private $from;
	private $to;
	private $versionIndex;
	private $parentC;

	public function __construct($versionFrom, $versionTo, $parent){
		$this->from = $versionFrom;
		$this->to = $versionTo;
		$this->versionIndex = $this->getLastVersionUp();
		$this->parentC = $parent;


		add_action( 'wp_ajax_ithoughts_tt_gl_update',			array(&$this, 'applyUpdates') );
		add_action( 'wp_ajax_ithoughts_tt_gl_update_done',		array(&$this, 'setVersion') );
		add_action( 'wp_ajax_ithoughts_tt_gl_update-dismiss',	array(&$this, 'dismiss_update') );
	}

	static public function requiresUpdate($from, $to){
		return self::getLastVUp($from, $to) > -1;
	}

	static private function getVersions(){
		return array("2.0", "2.2.3");
	}
	private function getLastVersionUp(){
		return self::getLastVUp($this->from, $this->to);
	}
	public function dismiss_update(){
		$this->setVersion($this->to);
	}
	static private function getLastVUp($from, $max = NULL){
		if($max != NULL){
			if(version_compare($max, $from) <= 0)
				return -1;
		}
		$versionsNeedingUpdate = self::getVersions();
		$versionIndex = 0;
		do {
			if(version_compare($from, $versionsNeedingUpdate[$versionIndex]) < 0)
				break;
			$versionIndex++;
		} while ($versionIndex < count($versionsNeedingUpdate));
		if($versionIndex == count($versionsNeedingUpdate))
			return -1;
		return $versionIndex;
	}

	function addAdminNotice(){
		add_action( 'admin_notices', array(&$this, 'admin_notice') );
	}
	function admin_notice(){
		switch($this->versionIndex){
			case 0:{
?>
<div class="update-nag notice">
	<p><?php _e( 'Thank you for using iThoughts Tooltip Glossary v2.0! This update comes with some big refactoring to improve evolution flexibility, compatibility, and much more. But it requires also a global update of <b>each of your posts</b> to apply the new format. If you don\'t apply this update, none of your tooltips will work properly.','ithoughts_tooltip_glossary'); ?></p>
	<a class="button button-secondary" href="<?php echo admin_url("admin.php?page=ithoughts_tt_gl_update"); ?>" style="width:100%;height:3em;text-align:center;line-height:3em;"><?php _e('Update now!','ithoughts_tooltip_glossary'); ?></a>
</div>
<?php		
				   } break;

			case 1:{
?>
<div class="update-nag is-dismissable ithoughts_tt_gl">
	<script>
		jQuery(document).on( 'click', '.update-nag.is-dismissable.ithoughts_tt_gl .dismiss', function() {

			jQuery.ajax({
				url: ajaxurl,
				data: {
					action: 'ithoughts_tt_gl_update-dismiss'
				}
			}, function(){
				location.reload();
			})

		})
	</script>
	<button class="dismiss button"></button>
	<p><?php _e( 'An error in the updater have been spotted. This update will replace old slug-based tooltips to id-based ones. If you are not concerned by this problem, simply dismiss this alert with the button on the right.','ithoughts_tooltip_glossary'); ?></p>
	<a class="button button-secondary" href="<?php echo admin_url("admin.php?page=ithoughts_tt_gl_update"); ?>" style="width:100%;height:3em;text-align:center;line-height:3em;"><?php _e('Update now!','ithoughts_tooltip_glossary'); ?></a>
</div>
<?php	
				   } break;
		}
	}
	public function updater(){
		if( $this->parentC->isUnderVersionned() ){
			wp_enqueue_script('ithoughts_tooltip_glossary-updater');
			wp_localize_script('ithoughts_tooltip_glossary-updater', "ithoughts_tt_gl_updater", array(
				"from"	=>	$this->from,
				"to"	=>	$this->to
			));
			wp_enqueue_script( 'ithoughts_tooltip_glossary-qtip' );
?>
<div class="wrap">
	<div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50 metabox-holder">
		<div class="meta-box-inside admin-help">
			<div class="icon32" id="icon-options-general">
				<br>
			</div>
			<section id="ithoughts_tt_gl_updater">
				<h2><?php _e("Updating iThoughts Tooltip Glossary", "ithoughts_tooltip_glossary"); ?></h2>
			</section>
		</div>
	</div>
</div>
<?php
		} else {
?>
<div class="wrap">
	<div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50 metabox-holder">
		<div class="meta-box-inside admin-help">
			<div class="icon32" id="icon-options-general">
				<br>
			</div>
			<section id="ithoughts_tt_gl_updater">
				<h2><?php _e("Updating iThoughts Tooltip Glossary", "ithoughts_tooltip_glossary"); ?></h2>
				<p><?php _e("No update required.", "ithoughts_tooltip_glossary"); ?></p>
			</section>
		</div>
	</div>
</div>
<?php
			   }
	}


	public function setVersion($version = NULL){
		if($version == NULL){
			$data = array();
			isset($_POST['data']) && $data=$_POST['data'];
			$opts = $this->parentC->getOptions();
			$opts["version"] = $data['newversion'];
		} else {
			$opts["version"] = $version;
		}
		update_option( 'ithoughts_tt_gl', $opts );
		wp_send_json_success(array("Ok" => "OK"));
		wp_die();
	}

	function applyUpdates(){
		$data = array();
		isset($_POST['data']) && $data=$_POST['data'];
/*		if($data["versions"]["from"] == $data["versions"]["to"] && $data["versions"]["from"] == "2.2.3")
			var_dump($this->versionIndex);*/
		$return = array();
		switch($this->versionIndex){
			case 0:{
				global $post;
				$maxCount = 20;
				$updatedStatus = array('publish', 'pending', 'draft', 'future', 'private', 'inherit');

				if($data["progression"] == -1){
					$count_posts = wp_count_posts();
					$totalCount = 0;
					foreach($count_posts as $postType => $count){
						if(array_search($postType, $updatedStatus) !== false)
							$totalCount += intval($count);
					}
					$versions = self::getVersions();
					wp_send_json_success(
						array(
							"max" => $totalCount,
							"targetversion" => $versions[$this->versionIndex],
							"text" => __("Applying new format.",'ithoughts_tooltip_glossary')
						)
					);
					wp_die();
				}

				$paged = intval($data["progression"] / $maxCount);
				$queryargs = array(
					'post_status' => $updatedStatus,
					"posts_per_page" => $maxCount,
					"paged"			=> $paged
				);
				$posts_to_update = new WP_Query($queryargs);
				while($posts_to_update->have_posts()){
					$posts_to_update->the_post();
					$postUpdateArray = array();
					$postUpdateArray ['ID'] = $post->ID;//Don't remove this. The ID is mandatory
					$postUpdateArray ['post_content'] = $post->post_content;
					$matches;


					// Replace old mediatips
					if(preg_match_all('/\[ithoughts_tooltip_glossary-mediatip(.*?)(?:(?:(?:link="([^"]*)")|(?:image="([^"]*)")|(?:imageid="([^"]*)"))\s*)+(.*?)\](.*?)\[\/ithoughts_tooltip_glossary-mediatip\]/', $postUpdateArray ['post_content'], $matches)){
						foreach($matches[0] as $index => $matched){
							$arr = array(
								"url"	=>	$matches[3][$index],
								"id"	=>	$matches[4][$index],
								"link"	=>	$matches[2][$index],
							);
							$newstr = '[ithoughts_tooltip_glossary-mediatip mediatip-type="localimage"'.$matches[1][$index].'mediatip-content="'.ithoughts_tt_gl_stipQuotes(json_encode($arr)).'" '.$matches[5][$index].']'.$matches[6][$index].'[/ithoughts_tooltip_glossary-mediatip]';
							$postUpdateArray ['post_content'] = str_replace($matched, $newstr, $postUpdateArray ['post_content']);
						}
					}

					// Replace very old [glossary] shortcodes
					if(preg_match_all('/\[glossary(.*?)(slug="(.*?)"(.*?))?\](.+?)\[\/glossary\]/', $postUpdateArray ['post_content'], $matches)){
						foreach($matches[0] as $index => $matched){
							$slug = $matches[3][$index] != "" ? $matches[3][$index] : $matches[5][$index];
							$args = array(
								'posts_per_page'   => 1,
								'post_type'        => 'glossary',
								'post_status'      => 'publish',
								'name'				=> $slug
							);
							$posts_array = get_posts( $args );
							$post_array = $posts_array[0];
							$id = "";
							if($post_array)
								$id = $post_array->ID;
							$newstr = '[ithoughts_tooltip_glossary-glossary glossary-id="'.$id.'"'.$matches[1][$index].$matches[4][$index].']'.$matches[5][$index].'[/ithoughts_tooltip_glossary-glossary]';
							$postUpdateArray ['post_content'] = str_replace($matched, $newstr, $postUpdateArray ['post_content']);
						}
					}

					// Replace old glossary shortcode with wrong attribue name
					if(preg_match_all('/\[ithoughts_tooltip_glossary-glossary(?!.*glossary-id)(.*?)id="(.*?)"(.*?)\](.*?)\[\/ithoughts_tooltip_glossary-glossary\]/', $postUpdateArray ['post_content'], $matches)){
						foreach($matches[0] as $index => $matched){
							$newstr = '[ithoughts_tooltip_glossary-glossary glossary-id="'.$matches[2][$index].'"'.$matches[1][$index].$matches[3][$index].']'.$matches[4][$index].'[/ithoughts_tooltip_glossary-glossary]';
							$postUpdateArray ['post_content'] = str_replace($matched, $newstr, $postUpdateArray ['post_content']);
						}
					}

					// Replace old tooptip shortcode with wrong attribue name
					if(preg_match_all('/\[ithoughts_tooltip_glossary-tooltip(?!.*tooltip-content)(.*?)content="(.*?)"(.*?)\](.*?)\[\/ithoughts_tooltip_glossary-tooltip\]/', $postUpdateArray ['post_content'], $matches)){
						foreach($matches[0] as $index => $matched){
							$newstr = '[ithoughts_tooltip_glossary-tooltip tooltip-content="'.$matches[2][$index].'"'.$matches[1][$index].$matches[3][$index].']'.$matches[4][$index].'[/ithoughts_tooltip_glossary-tooltip]';
							$postUpdateArray ['post_content'] = str_replace($matched, $newstr, $postUpdateArray ['post_content']);
						}
					}
					wp_update_post( $postUpdateArray );
				}
				wp_reset_postdata();

				$current_page = $posts_to_update->get( 'paged' );
				if ( ! $current_page ) {
					$current_page = 1;
				}

				$return = array("progression" => ($paged + 1) * $maxCount);
			} break;

			case 1:{
				global $post;
				$maxCount = 20;
				$updatedStatus = array('publish', 'pending', 'draft', 'future', 'private', 'inherit');

				if($data["progression"] == -1){
					$count_posts = wp_count_posts();
					$totalCount = 0;
					foreach($count_posts as $postType => $count){
						if(array_search($postType, $updatedStatus) !== false)
							$totalCount += intval($count);
					}
					$versions = self::getVersions();
					wp_send_json_success(
						array(
							"max" => $totalCount,
							"targetversion" => $versions[$this->versionIndex],
							"text" => __("Replacing slugs with id.",'ithoughts_tooltip_glossary')
						)
					);
					wp_die();
				}

				$paged = intval($data["progression"] / $maxCount);
				$queryargs = array(
					'post_status' => $updatedStatus,
					"posts_per_page" => $maxCount,
					"paged"			=> $paged
				);
				$posts_to_update = new WP_Query($queryargs);
				while($posts_to_update->have_posts()){
					$posts_to_update->the_post();
					$postUpdateArray = array();
					$postUpdateArray ['ID'] = $post->ID;//Don't remove this. The ID is mandatory
					$postUpdateArray ['post_content'] = $post->post_content;
					$matches;
					if(preg_match_all("/\[ithoughts_tooltip_glossary-glossary(.*?)(?:slug=\"([^\"]+?)\")(.*?)\](.*?)\[\/ithoughts_tooltip_glossary-glossary\]/", $postUpdateArray ['post_content'], $matches)){
						foreach($matches[0] as $index => $matched){
							$args = array(
								'posts_per_page'   => 1,
								'post_type'        => 'glossary',
								'post_status'      => 'publish',
								'name'				=> $matches[2][$index]
							);
							$posts_array = get_posts( $args );
							$post_array = $posts_array[0];
							$glossaryIndex = "";
							if($post_array)
								$glossaryIndex = $post_array->ID;
							$newstr = '[ithoughts_tooltip_glossary-glossary'.$matches[1][$index].$matches[3][$index].' glossary-id="'.$glossaryIndex.'"]'.$matches[4][$index].'[/ithoughts_tooltip_glossary-glossary]';
							$postUpdateArray ['post_content'] = str_replace($matched, $newstr, $postUpdateArray ['post_content']);
						}
					}

					wp_update_post( $postUpdateArray );
				}
				wp_reset_postdata();

				$current_page = $posts_to_update->get( 'paged' );
				if ( ! $current_page ) {
					$current_page = 1;
				}

				$return = array("progression" => ($paged + 1) * $maxCount);
			} break;

			case -1:{
				$return = array("Ended" => true, "title" => __("Update finished!",'ithoughts_tooltip_glossary'), "text" => __("The update finished successfully. Thank you for using iThoughts Tooltip Glossary :)",'ithoughts_tooltip_glossary'));
			}break;
			default: {
				$return = array("Ended" => true, "title" => __("Update finished!",'ithoughts_tooltip_glossary'), "text" => __("The update finished successfully. Thank you for using iThoughts Tooltip Glossary :)",'ithoughts_tooltip_glossary'));
			} break;
		}

		if($data["maxAdvandement"] > -1){
			if($return["progression"] >= $data["maxAdvandement"]){
				$return = array_merge(array("Ended" => true, "title" => __("Update finished!",'ithoughts_tooltip_glossary'), "text" => __("The update finished successfully. Thank you for using iThoughts Tooltip Glossary :)",'ithoughts_tooltip_glossary')), $return);
				wp_send_json_success($return);
				wp_die();
			}
		}
		wp_send_json_success($return);
		wp_die();
	}
}