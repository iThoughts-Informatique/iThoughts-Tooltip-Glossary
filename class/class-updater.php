<?php
/**
 * @file Apply update process if required for every update configuration
 *
 * @author Gerkin
 * @copyright 2015-2016 iThoughts Informatique
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip
 *
 * @version 2.5.0
 */

namespace ithoughts\tooltip_glossary;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


if ( ! class_exists( __NAMESPACE__ . '\\Updater' ) ) {
	class Updater {
		private $from;
		private $to;
		private $versionIndex;
		private $parentC;

		public function __construct( $versionFrom, $versionTo, $parent ) {
			$this->from = $versionFrom;
			$this->to = $versionTo;
			$this->versionIndex = $this->getLastVersionUp();
			$this->parentC = $parent;

			add_action( 'wp_ajax_ithoughts_tt_gl_update',			array( &$this, 'applyUpdates' ) );
			add_action( 'wp_ajax_ithoughts_tt_gl_update_done',		array( &$this, 'set_version' ) );
			add_action( 'wp_ajax_ithoughts_tt_gl_update-dismiss',	array( &$this, 'dismiss_update' ) );
		}

		static public function requires_update_s( $from, $to ) {
			return self::getLastVUp( $from, $to ) > -1;
		}

		public function requires_update() {
			return self::requires_update_s($this->from, $this->to);
		}

		static private function getVersions() {
			return array( '2.0', '2.3.0', '3.0.0' );
		}

		private function getLastVersionUp() {
			return self::getLastVUp( $this->from, $this->to );
		}

		public function dismiss_update() {
			$this->set_version( $this->to );
		}

		static private function getLastVUp( $from, $max = null ) {
			if ( $max != null ) {
				if ( version_compare( $max, $from ) <= 0 ) {
					return -1;
				}
			}
			$versionsNeedingUpdate = self::getVersions();
			$versionIndex = 0;
			do {
				if ( version_compare( $from, $versionsNeedingUpdate[ $versionIndex ] ) < 0 ) {
					break;
				}
				$versionIndex++;
			} while ( $versionIndex < count( $versionsNeedingUpdate ) );
			if ( $versionIndex == count( $versionsNeedingUpdate ) ) {
				return -1;
			}
			return $versionIndex;
		}

		/**
		 * Register the update notice for being printed when appropriate
		 *
		 * @author Gerkin
		 */
		public function add_admin_notice() {
			add_action( 'admin_notices', array( &$this, 'admin_notice' ) );
		}

		/**
		 * Print the current version update notification on the admin panel
		 *
		 * @action admin_notices
		 *
		 * @author Gerkin
		 */
		function admin_notice() {
			switch ( $this->versionIndex ) {
				case 0:{
?>
<div class="update-nag notice">
	<p><?php echo wp_kses( __( "Thank you for using iThoughts Tooltip Glossary v2.0! This update comes with some big refactoring to improve evolution flexibility, compatibility, and much more. But it requires also a global update of <b>each of your posts</b> to apply the new format. If you don't apply this update, none of your tooltips will work properly.", 'ithoughts-tooltip-glossary' ), array(
		'b' => array(),
	) ); ?></p>
	<a class="button button-secondary" href="<?php echo admin_url( 'admin.php?page=ithoughts_tt_gl_update' ); ?>" style="width:100%;height:3em;text-align:center;line-height:3em;"><?php esc_html_e( 'Update now!', 'ithoughts-tooltip-glossary' ); ?></a>
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
			});
		});
	</script>
	<button class="dismiss button"></button>
	<p><?php printf( wp_kses( __( 'An error in the updater have been spotted. This update will replace old slug-based tooltips to id-based ones on post types other than "post", for example on pages. See <a href="%s">this thread</a> for more informations. If you are not concerned by this problem, simply dismiss this alert with the button on the right.', 'ithoughts-tooltip-glossary' ), array(
		'a' => array( 'href' ),
	), esc_url( 'https://wordpress.org/support/topic/shortcode-parameter-slug-not-working-after-update-116-222?replies=29#post-7941781' ) ) ); ?></p>
	<a class="button button-secondary" href="<?php echo admin_url( 'admin.php?page=ithoughts_tt_gl_update' ); ?>" style="width:100%;height:3em;text-align:center;line-height:3em;"><?php esc_html_e( 'Update now!', 'ithoughts-tooltip-glossary' ); ?></a>
</div>
<?php
				} break;
				case 2:{
?>
<div class="update-nag notice">
	<p><?php echo wp_kses( __( 'Thank you for using iThoughts Tooltip Glossary v3.0! This update ships a big review of the code, a better API documentation, and an optimized code for size. The plugin need some database update to work properly. Please do the update by clicking the button bellow', 'ithoughts-tooltip-glossary' ), array(
		'b' => array(),
	) ); ?></p>
	<a class="button button-secondary" href="<?php echo admin_url( 'admin.php?page=ithoughts_tt_gl_update' ); ?>" style="width:100%;height:3em;text-align:center;line-height:3em;"><?php esc_html_e( 'Update now!', 'ithoughts-tooltip-glossary' ); ?></a>
</div>
<?php
				} break;
			}// End switch().
		}

		/**
		 * Show the Updater page
		 *
		 * @action admin_notices
		 *
		 * @author Gerkin
		 */
		public function updater() {
			global $pagenow;

			if ( $this->parentC->is_under_versionned() ) {
				$backbone = \ithoughts\tooltip_glossary\Backbone::get_instance();
				$backbone->log( \ithoughts\v5_0\LogLevel::Info, "Access to the update page (version from $this->from to $this->to) received, prepare update." );
				$updater_script = $backbone->get_resource( 'ithoughts_tooltip_glossary-updater' );
				if ( isset( $updater_script ) ) {
					$updater_script->set_localize_data('iThoughtsTooltipGlossaryUpdater', array(
						'from'		=> $this->from,
						'to'		=> $this->to,
						'pagenow'	=> $pagenow,
					) );
					$updater_script->enqueue();
				}
				$backbone->enqueue_resource( 'ithoughts_tooltip_glossary-qtip' );
				wp_enqueue_script( 'postbox' );
				wp_enqueue_script( 'post' );
?>
<div class="wrap">
	<div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50 metabox-holder">
		<div id="dashboard-widgets-wrap">
			<div id="dashboard-widgets">
				<div id="normal-sortables" class="">
					<div class="icon32" id="icon-options-general">
						<br>
					</div>
					<section id="Updater">
						<h2><?php esc_html_e( 'Updating iThoughts Tooltip Glossary', 'ithoughts-tooltip-glossary' ); ?></h2>
					</section>
				</div>
			</div>
		</div>
	</div>
</div>
<?php
			} else {
				\ithoughts\tooltip_glossary\Backbone::get_instance()->log( \ithoughts\v5_0\LogLevel::Error, "Access to the update page (version from $this->from to $this->to) received, but nothing to do." );
?>
<div class="wrap">
	<div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50 metabox-holder">
		<div class="meta-box-inside admin-help">
			<div class="icon32" id="icon-options-general">
				<br>
			</div>
			<section id="Updater">
				<h2><?php esc_html_e( 'Updating iThoughts Tooltip Glossary', 'ithoughts-tooltip-glossary' ); ?></h2>
				<p><?php esc_html_e( 'No update required.', 'ithoughts-tooltip-glossary' ); ?></p>
			</section>
		</div>
	</div>
</div>
<?php
			}// End if().
		}


		public function set_version( $version = null ) {
			$version_new;
			if ( $version == null ) {
				$data = array();
				isset( $_POST['data'] ) && $data = $_POST['data'];
				$version_new = $data['newversion'];
			} else {
				$version_new = $version;
			}
			\ithoughts\tooltip_glossary\Backbone::get_instance()->set_option( 'version', $version_new );
			wp_send_json_success( array(
				'Ok' => 'OK',
			) );
			wp_die();
		}

		function applyUpdates() {
			$data = array();
			isset( $_POST['data'] ) && $data = $_POST['data'];
			$return = array();
			$end_data = array(
				'Ended' => true,
				'title' => esc_html__( 'Update finished!', 'ithoughts-tooltip-glossary' ),
				'text' => esc_html__( 'The update finished successfully. Thank you for using iThoughts Tooltip Glossary :)', 'ithoughts-tooltip-glossary' ),
			);
			switch ( $this->versionIndex ) {
				case 0:{
					global $post;
					$maxCount = 20;
					$postTypes = get_post_types( array(), 'names' );
					$updatedStatus = array( 'publish', 'pending', 'draft', 'future', 'private', 'inherit' );

					if ( $data['progression'] == -1 ) {
						$totalCount = 0;
						foreach ( $postTypes as $postType ) {
							$count_posts = wp_count_posts( $postType );
							foreach ( $count_posts as $postStatus => $count ) {
								if ( array_search( $postStatus, $updatedStatus ) !== false ) {
									$totalCount += intval( $count );
								}
							}
						}
						$versions = self::getVersions();
						wp_send_json_success(
							array(
								'max' => $totalCount,
								'targetversion' => $versions[ $this->versionIndex ],
								'text' => esc_html__( 'Applying new format.', 'ithoughts-tooltip-glossary' ),
							)
						);
						wp_die();
					}

					$paged = intval( $data['progression'] / $maxCount );
					$queryargs = array(
						'post_status' => $updatedStatus,
						'posts_per_page' => $maxCount,
						'paged'			=> $paged,
					);
					$posts_to_update = new \WP_Query( $queryargs );
					while ( $posts_to_update->have_posts() ) {
						$posts_to_update->the_post();
						$postUpdateArray = array();
						$postUpdateArray ['ID'] = $post->ID;// Don't remove this. The ID is mandatory
						$postUpdateArray ['post_content'] = $post->post_content;
						$matches;

						// Replace old mediatips
						if ( preg_match_all( '/\[ithoughts_tooltip_glossary-mediatip(.*?)(?:(?:(?:link="([^"]*)")|(?:image="([^"]*)")|(?:imageid="([^"]*)"))\s*)+(.*?)\](.*?)\[\/ithoughts_tooltip_glossary-mediatip\]/', $postUpdateArray ['post_content'], $matches ) ) {
							foreach ( $matches[0] as $index => $matched ) {
								$arr = array(
									'url'	=> $matches[3][ $index ],
									'id'	=> $matches[4][ $index ],
									'link'	=> $matches[2][ $index ],
								);
								$newstr = '[ithoughts_tooltip_glossary-mediatip mediatip-type="localimage"' . $matches[1][ $index ] . 'mediatip-content="' . ithoughts_tt_gl_stipQuotes( json_encode( $arr ) ) . '" ' . $matches[5][ $index ] . ']' . $matches[6][ $index ] . '[/ithoughts_tooltip_glossary-mediatip]';
								$postUpdateArray ['post_content'] = str_replace( $matched, $newstr, $postUpdateArray ['post_content'] );
							}
						}

						// Replace very old [glossary] shortcodes
						if ( preg_match_all( '/\[glossary(.*?)(slug="(.*?)"(.*?))?\](.+?)\[\/glossary\]/', $postUpdateArray ['post_content'], $matches ) ) {
							foreach ( $matches[0] as $index => $matched ) {
								$slug = $matches[3][ $index ] != '' ? $matches[3][ $index ] : $matches[5][ $index ];
								$args = array(
									'posts_per_page'   => 1,
									'post_type'        => 'glossary',
									'post_status'      => 'publish',
									'name'				=> $slug,
								);
								$posts_array = get_posts( $args );
								$post_array = $posts_array[0];
								$id = '';
								if ( $post_array ) {
									$id = $post_array->ID;
								}
								$newstr = '[ithoughts_tooltip_glossary-glossary glossary-id="' . $id . '"' . $matches[1][ $index ] . $matches[4][ $index ] . ']' . $matches[5][ $index ] . '[/ithoughts_tooltip_glossary-glossary]';
								$postUpdateArray ['post_content'] = str_replace( $matched, $newstr, $postUpdateArray ['post_content'] );
							}
						}

						// Replace old glossary shortcode with wrong attribue name
						if ( preg_match_all( '/\[ithoughts_tooltip_glossary-glossary(?!.*glossary-id)(.*?)id="(.*?)"(.*?)\](.*?)\[\/ithoughts_tooltip_glossary-glossary\]/', $postUpdateArray ['post_content'], $matches ) ) {
							foreach ( $matches[0] as $index => $matched ) {
								$newstr = '[ithoughts_tooltip_glossary-glossary glossary-id="' . $matches[2][ $index ] . '"' . $matches[1][ $index ] . $matches[3][ $index ] . ']' . $matches[4][ $index ] . '[/ithoughts_tooltip_glossary-glossary]';
								$postUpdateArray ['post_content'] = str_replace( $matched, $newstr, $postUpdateArray ['post_content'] );
							}
						}

						// Replace old tooptip shortcode with wrong attribue name
						if ( preg_match_all( '/\[ithoughts_tooltip_glossary-tooltip(?!.*tooltip-content)(.*?)content="(.*?)"(.*?)\](.*?)\[\/ithoughts_tooltip_glossary-tooltip\]/', $postUpdateArray ['post_content'], $matches ) ) {
							foreach ( $matches[0] as $index => $matched ) {
								$newstr = '[ithoughts_tooltip_glossary-tooltip tooltip-content="' . $matches[2][ $index ] . '"' . $matches[1][ $index ] . $matches[3][ $index ] . ']' . $matches[4][ $index ] . '[/ithoughts_tooltip_glossary-tooltip]';
								$postUpdateArray ['post_content'] = str_replace( $matched, $newstr, $postUpdateArray ['post_content'] );
							}
						}
						wp_update_post( $postUpdateArray );
					}// End while().
					wp_reset_postdata();

					$current_page = $posts_to_update->get( 'paged' );
					if ( ! $current_page ) {
						$current_page = 1;
					}

					$return = array(
						'progression' => ($paged + 1) * $maxCount,
					);
				}// End case().
				break;

				case 1:{
					$verbose = array();
					global $post;
					$maxCount = 20;
					$updatedStatus = array( 'publish', 'pending', 'draft', 'future', 'private', 'inherit', 'trash' );
					$postTypes = get_post_types( array(), 'names' );

					if ( $data['progression'] == -1 ) {
						$totalCount = 0;
						foreach ( $postTypes as $postType ) {
							$count_posts = wp_count_posts( $postType );
							foreach ( $count_posts as $postStatus => $count ) {
								if ( in_array( $postStatus, $updatedStatus ) ) {
									$totalCount += intval( $count );
									$pt[] = $postType;
								} else {
									$verbose[] = array(
										'type' => 'info',
										'text' => 'Ignoring status <b>$postStatus</b>',
									);
								}
							}
						}

						$verbose[] = array(
							'type' => 'info',
							'text' => '<b>Post types</b> registered are [' . implode( ', ',$postTypes ) . ']',
						);
						$verbose[] = array(
							'type' => 'info',
							'text' => '<b>Post types</b> found are [' . implode( ', ',array_unique( $pt ) ) . ']',
						);
						$versions = self::getVersions();
						$verbose[] = array(
							'type' => 'info',
							'text' => 'Found <b>$totalCount</b> posts with status [' . implode( ', ',$updatedStatus ) . ']',
						);
						wp_send_json_success(
							array(
								'max' => $totalCount,
								'targetversion' => $versions[ $this->versionIndex ],
								'text' => __( 'Replacing slugs with id.', 'ithoughts-tooltip-glossary' ),
								'verbose' => $verbose,
							)
						);
						wp_die();
					}// End if().

					$paged = intval( $data['progression'] / $maxCount );
					$queryargs = array(
						'post_status' => $updatedStatus,
						'posts_per_page' => $maxCount,
						'paged'			=> $paged,
						'post_type'		=> $postTypes,
					);
					$posts_to_update = new \WP_Query( $queryargs );
					if ( $posts_to_update->have_posts() ) {
						while ( $posts_to_update->have_posts() ) {
							$posts_to_update->the_post();
							$postUpdateArray = array();
							$postUpdateArray ['ID'] = $post->ID;// Don't remove this. The ID is mandatory
							$postUpdateArray ['post_content'] = $post->post_content;
							$matches;
							$verbose[] = array(
								'type' => 'info',
								'text' => "Updating post <b>{$post->ID}</b> of type <b>{$post->post_type}</b> and status <b>{$post->post_status}</b> with post_content <em>" . htmlentities( preg_replace( '/(\n+\s*)+/', '', $post->post_content ) ) . '</em>...',
							);
							if ( preg_match_all( '/\[ithoughts_tooltip_glossary-glossary(.*?)(?:slug="([^"]+?)")(.*?)\](.*?)\[\/ithoughts_tooltip_glossary-glossary\]/', $postUpdateArray ['post_content'], $matches ) ) {
								foreach ( $matches[0] as $index => $matched ) {
									$args = array(
										'posts_per_page'   => 1,
										'post_type'        => 'glossary',
										'post_status'      => 'publish',
										'name'				=> $matches[2][ $index ],
									);
									$posts_array = get_posts( $args );
									if ( isset( $posts_array[0] ) ) {
										$post_array = $posts_array[0];
										$glossaryIndex = null;
										if ( $post_array ) {
											$glossaryIndex = $post_array->ID;
										}
										$newstr;
										$verbose[] = array(
											'type' => 'info',
											'text' => "For post <b>{$post->ID}</b>, matched string '<em>{$matched}</em>'. Slug of term is <b>{$matches[2][$index]}</b>, which is term id <b>$glossaryIndex</b>",
										);
										$newstr = '[ithoughts_tooltip_glossary-glossary' . $matches[1][ $index ] . $matches[3][ $index ] . ' glossary-id="' . $glossaryIndex . '"]' . $matches[4][ $index ] . '[/ithoughts_tooltip_glossary-glossary]';
									} else {
										$verbose[] = array(
											'type' => 'warn',
											'text' => "For post <b>{$post->ID}</b>, matched string '<em>{$matched}</em>'. Slug of term is <b>{$matches[2][$index]}</b>, but <b>no term was found</b>",
										);
										$newstr = $matches[4][ $index ];
									}
									$postUpdateArray ['post_content'] = str_replace( $matched, $newstr, $postUpdateArray ['post_content'] );
								}
							} else {
								$verbose[] = array(
									'type' => 'info',
									'text' => "For post <b>{$post->ID}</b>, no matches were found",
								);
							}// End if().

							wp_update_post( $postUpdateArray );
						}// End while().
					} else {
						$verbose[] = array(
							'type' => 'info',
							'text' => "Query with pagination <b>$paged</b> and count <b>$maxCount</b> returned 0 posts",
						);
					}// End if().
					wp_reset_postdata();

					$current_page = $posts_to_update->get( 'paged' );
					if ( ! $current_page ) {
						$current_page = 1;
					}

					$return = array(
						'progression' => ($paged + 1) * $maxCount,
						'verbose' => $verbose,
					);
				}// End case().
				break;

				case 2:{
					\ithoughts\tooltip_glossary\Backbone::get_instance()->log( \ithoughts\v5_0\LogLevel::Silly, "Doing update to $this->to" );
					$verbose = array();
					$maxCount = 20;
					$postTypes = get_post_types( '', 'names' );
					$updatedStatus = array( 'publish', 'pending', 'draft', 'future', 'private', 'inherit' );

					if ( $data['progression'] == -1 ) {
						$totalCount = 0;
						foreach ( $postTypes as $postType ) {
							$count_posts = wp_count_posts( $postType );
							foreach ( $count_posts as $postStatus => $count ) {
								if ( array_search( $postStatus, $updatedStatus ) !== false ) {
									$totalCount += intval( $count );
								}
							}
						}
						$versions = self::getVersions();
						wp_send_json_success(
							array(
								'max' => $totalCount,
								'targetversion' => $versions[ $this->versionIndex ],
								'text' => esc_html__( 'Applying new format.', 'ithoughts-tooltip-glossary' ),
								'verbose' => array(
									array(
										'type' => 'info',
										'text' => "$totalCount potential posts to update",
									),
								),
							)
						);
						wp_die();
					}

					$queryargs = array(
						'post_status'					=> $updatedStatus,
						'post_type'						=> $postTypes,
						'posts_per_page'				=> $maxCount,
						'offset'						=> $data['progression'],
						'update_post_term_cache'		=> false,
						'no_found_rows'					=> true,
					);
					$posts_to_update = get_posts( $queryargs );
					if ( count( $posts_to_update ) > 0 ) {
						foreach ( $posts_to_update as $post ) {
							$postUpdateArray = array();
							$postUpdateArray ['ID'] = $post->ID;// Don't remove this. The ID is mandatory
							$postUpdateArray ['post_content'] = $post->post_content;
							$matches;

							$counters = array(
								'mediatip' => 0,
								'tooltip' => 0,
								'glossary' => 0,
							);

							// Replace old mediatips
							if ( preg_match_all( '/\[ithoughts_tooltip_glossary-mediatip (.*?)\](.*?)\[\/ithoughts_tooltip_glossary-mediatip\]/', $postUpdateArray ['post_content'], $matches ) ) {
								$counters['mediatip'] = count( $matches[0] );
								foreach ( $matches[0] as $index => $matched ) {
									$newstr = "[itg-mediatip {$matches[1][$index]}]{$matches[2][$index]}[/itg-mediatip]";
									$postUpdateArray ['post_content'] = str_replace( $matched, $newstr, $postUpdateArray ['post_content'] );
								}
							}

							// Replace old glossary shortcodes
							if ( preg_match_all( '/\[ithoughts_tooltip_glossary-glossary (.*?)\](.+?)\[\/ithoughts_tooltip_glossary-glossary\]/', $postUpdateArray ['post_content'], $matches ) ) {
								$counters['glossary'] = count( $matches[0] );
								foreach ( $matches[0] as $index => $matched ) {
									$newstr = "[itg-glossary {$matches[1][$index]}]{$matches[2][$index]}[/itg-glossary]";
									$postUpdateArray ['post_content'] = str_replace( $matched, $newstr, $postUpdateArray ['post_content'] );
								}
							}

							// Replace old tooptip shortcode
							if ( preg_match_all( '/\[ithoughts_tooltip_glossary-tooltip (.*?)\](.*?)\[\/ithoughts_tooltip_glossary-tooltip\]/', $postUpdateArray ['post_content'], $matches ) ) {
								$counters['tooltip'] = count( $matches[0] );
								foreach ( $matches[0] as $index => $matched ) {
									$newstr = "[itg-tooltip {$matches[1][$index]}]{$matches[2][$index]}[/itg-tooltip]";
									$postUpdateArray ['post_content'] = str_replace( $matched, $newstr, $postUpdateArray ['post_content'] );
								}
							}

							if ( $post->post_content != $postUpdateArray ['post_content'] ) {
								clean_post_cache( $post->ID );
								\ithoughts\tooltip_glossary\Backbone::get_instance()->log( \ithoughts\v5_0\LogLevel::Info, "Updated post $post->ID: \"$post->post_title\":", $counters );
								$verbose[] = array(
									'type' => 'info',
									'text' => "In $post->post_title ($post->ID), replaced {$counters['tooltip']} tooltips, {$counters['glossary']} glossaries, and {$counters['mediatip']} mediatips.",
								);
								wp_update_post( $postUpdateArray );
							} else {
								\ithoughts\tooltip_glossary\Backbone::get_instance()->log( \ithoughts\v5_0\LogLevel::Silly, "Post $post->ID: \"$post->post_title\" was not modified" );
							}
							wp_cache_delete( $post->ID, 'posts' );
							wp_cache_delete( $post->ID, 'post_meta' );
						}// End foreach().
					} else {
						$verbose[] = array(
							'type' => 'info',
							'text' => "Query from <b>{$data['progression']}</b> and count <b>$maxCount</b> returned 0 posts",
						);
					}// End if().
					wp_reset_postdata();

					$return = array(
						'progression' => $data['progression'] + $maxCount,
						'verbose' => $verbose,
					);
				}// End case().
				break;

				case -1:{
					$return = $end_data;
				}break;

				default: {
					$return = $end_data;
				} break;
			}// End switch().

			\ithoughts\tooltip_glossary\Backbone::get_instance()->log( \ithoughts\v5_0\LogLevel::Info, 'Ended update step with data: ', $data );

			if ( $data['maxAdvancement'] > -1 ) {
				if ( $return['progression'] >= $data['maxAdvancement'] ) {
					$return = array_merge( $end_data, $return );
					wp_send_json_success( $return );
					wp_die();
				}
			}
			wp_send_json_success( $return );
			wp_die();
		}
	}
}// End if().
