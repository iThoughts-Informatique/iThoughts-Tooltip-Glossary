<?php

$ithoughts_tt_gl_versionOrigin;

function addActionVersionTransitionSwitcher(){
	add_action("ithoughts_tt_gl_version_transition", "ithoughts_tt_gl_version_transition_switcher", 10, 1);
}

function addActionAdminNotice($from){
	global $ithoughts_tt_gl_versionOrigin;

	$ithoughts_tt_gl_versionOrigin = $from;
	add_action( 'admin_notices', 'ithoughts_tt_gl_admin_notice' );
}

function ithoughts_tt_gl_admin_notice(){
	global $ithoughts_tt_gl_versionOrigin;

	$versionIndex = getLastVUp($ithoughts_tt_gl_versionOrigin);
	switch($versionIndex){
		case 0:{
?>
<div class="update-nag">
	<p><?php _e( 'Thank you for using iThoughts Tooltip Glossary v2.0! This update comes with some big refactoring to improve evolution flexibility, compatibility, and much more. But it requires also a global update of <b>each of your posts</b> to apply the new format. If you don\'t apply this update, none of your tooltips will work properly.','ithoughts_tooltip_glossary'); ?></p>
	<a class="button button-secondary" href="<?php echo admin_url("admin.php?page=ithoughts_tt_gl_update"); ?>" style="width:100%;height:3em;text-align:center;line-height:3em;"><?php _e('Update now!','ithoughts_tooltip_glossary'); ?></a>
</div>
<?php		
			   }break;
	}
}

function getVersions(){
	return array("2.0");
}
function getLastVUp($from, $max = NULL){
	if($max != NULL){
		if(version_compare($max, $from) <= 0)
			return -1;
	}
	$versionsNeedingUpdate = getVersions();
	$versionIndex = 0;
	do {
		if(version_compare($from, $versionsNeedingUpdate[$versionIndex]) < 0)
			break;
		$versionIndex++;
	} while ($versionIndex < count($versionsNeedingUpdate));
	return $versionIndex;
}



function ithoughts_tt_gl_version_transition_switcher($data){
	$to = $data["versions"]["to"];
	$from = $data["versions"]["from"];
	$versionIndex = getLastVUp($from, $to);
	switch($versionIndex){
		case -1:{
			wp_send_json_success(array("Ended" => true, "title" => __("Update finished!",'ithoughts_tooltip_glossary'), "text" => __("The update finished successfully. Thank you for using iThoughts Tooltip Glossary :)",'ithoughts_tooltip_glossary')));
			wp_die();
		}

		case 0:{
			global $post;
			$maxCount = 1;

			if($data["progression"] == -1){
				$count_posts = wp_count_posts();
				$updatedStatus = array('publish', 'pending', 'draft', 'future', 'private', 'inherit');
				$totalCount = 0;
				foreach($count_posts as $postType => $count){
					if(array_search($postType, $updatedStatus) !== false)
						$totalCount += intval($count);
				}
				wp_send_json_success(array("max" => $totalCount, "targetversion" => getVersions()[$versionIndex], "text" => __("Applying new format.",'ithoughts_tooltip_glossary')));
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
						$newstr = '[ithoughts_tooltip_glossary-mediatip mediatip-type="localimage"'.$matches[1][$index].'mediatip-content="'.ithoughts_tt_gl_encode_json_attr(json_encode($arr)).'" '.$matches[5][$index].']'.$matches[6][$index].'[/ithoughts_tooltip_glossary-mediatip]';
						$postUpdateArray ['post_content'] = str_replace($matched, $newstr, $postUpdateArray ['post_content']);
					}
				}

				// Replace very old [glossary] shortcodes
				if(preg_match_all('/\[glossary(.*?)(slug="(.*?)"(.*?))?\](.+?)\[\/glossary\]/', $postUpdateArray ['post_content'], $matches)){
					foreach($matches[0] as $index => $matched){
						$slug = $matches[3][$index] != "" ? $matches[3][$index] : $matches[5][$index];
						echo '<pre style="color:#0f0">'.$slug.'</pre>';
						$args = array(
							'posts_per_page'   => 1,
							'post_type'        => 'glossary',
							'post_status'      => 'publish',
							'name'				=> $slug
						);
						$post_array = get_posts( $args )[0];
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

			wp_send_json_success(array("progression" => ($paged + 1) * $maxCount));
			wp_die();
		} break;
		
		/*
		case 2:{
			if($data["progression"] == -1){
				wp_send_json_success(array("max" => 1, "targetversion" => getVersions()[$versionIndex], "text" => "Hello"));
			}
			wp_send_json_success(array("progression" => 1));
			wp_die();
		} break;
		*/
	}
}