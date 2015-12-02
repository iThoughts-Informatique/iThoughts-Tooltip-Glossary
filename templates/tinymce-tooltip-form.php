<div id="ithoughts_tt_gl-tooltip-form-container">
	<!--<pre style="display:none;"><?php var_dump($data); ?></pre>-->
	<div id="pseudohead">
		<?php wp_print_styles("ithoughts_tooltip_glossary-tinymce_form"); ?>
		<?php wp_print_scripts("ithoughts_tooltip_glossary-utils"); ?>
		<?php wp_print_scripts("ithoughts_tooltip_glossary-tinymce_form"); ?>
	</div>
	<div aria-label="Insert a Tooltip" role="dialog" style="border-width: 1px; z-index: 100101;" class="mce-container mce-panel mce-floatpanel mce-window mce-in" hidefocus="1" id="ithoughts_tt_gl-tooltip-form">
		<div class="mce-reset" role="application">
			<div class="mce-window-head">
				<div class="mce-title">
					<?php _e("Insert a Tooltip", "ithoughts_tooltip_glossary"); ?>
				</div>
				<button aria-hidden="true" class="mce-close ithoughts_tt_gl-tinymce-discard" type="button">×</button>
			</div>


			<div class="mce-container-body mce-window-body">
				<div class="mce-container mce-form mce-first mce-last">
					<div class="mce-container-body" style="height: 100%;">







						<form>
							<div style="padding:10px;flex:0 0 auto;">
								<table>
									<tr>
										<td>
											<label for="itghouts_tt_gl_text">
												<?php _e("Text", "ithoughts_tooltip_glossary"); ?>
											</label>
										</td>
										<td>
											<input type="text" id="itghouts_tt_gl_text" name="itghouts_tt_gl_text" value="<?php echo $data["text"]; ?>">
										</td>
									</tr>
								</table>
							</div>

							<div class="tab-container">
								<ul class="tabs" role="tablist">
									<li class="<?php echo ("glossary" === $data['type']) ? "active" : ""; ?>" role="tab" tabindex="-1">
										<?php _e("Glossary term", "ithoughts_tooltip_glossary"); ?>
									</li>


									<li class="<?php echo ("tooltip" === $data['type']) ? "active" : ""; ?>" role="tab" tabindex="-1">
										<?php _e("Tooltip", "ithoughts_tooltip_glossary"); ?>
									</li>


									<li class="<?php echo ("mediatip" === $data['type']) ? "active" : ""; ?>" role="tab" tabindex="-1">
										<?php _e("Mediatip", "ithoughts_tooltip_glossary"); ?>
									</li>
								</ul>



								<div class="tab<?php echo ("glossary" === $data['type']) ? " active" : ""; ?>">
									<table>
										<tr>
											<td>
												<label for="glossary_term">
													<?php _e("Term", "ithoughts_tooltip_glossary"); ?>
												</label>
											</td>
											<td>
												<input autocomplete="off" type="text" id="glossary_term" name="glossary_term" value="<?php echo (isset($data["term_title"])) ? $data["term_title"] : $data["term_search"]; ?>" class="completed"/>
												<div id="glossary_term_completer" class="completer hidden">
												</div>
												<input type="hidden" name="glossary_term_id" value="<?php echo $data["glossary_id"]; ?>">
											</td>
										</tr>
									</table>
								</div>



								<div class="tab<?php echo ("tooltip" === $data['type']) ? " active" : ""; ?>">
									<table>
										<tr>
											<td colspan="2">
												<label class="mce-widget mce-label mce-first" for="ithoughts_tt_gl-tooltip-content">
													<?php _e("Content", "ithoughts_tooltip_glossary"); ?>
												</label>
												<div style="margin:0 -11px;">
													<textarea class="tinymce" id="ithoughts_tt_gl-tooltip-content"><?php echo $data['tooltip_content']; ?></textarea>
												</div>
											</td>
										</tr>
									</table>
								</div>



								<div class="tab<?php echo ("mediatip" === $data['type']) ? " active" : ""; ?>">
									<table>
										<tr>
											<td>
												<label for="mediatip_type">
													<?php _e("Mediatip type", "ithoughts_tooltip_glossary"); ?>
												</label>
											</td>
											<td>
												<?php echo $mediatipdropdown ?>
											</td>
										</tr>
										<tr data-mediatip_type="mediatip-localimage-type">
											<td colspan="2">
												<div class="mce-container " id="image-box">
													<?php
	if(isset($data["mediatip_content"]['url']) && $data["mediatip_content"]['url']):
													?>
													<img src="<?php echo $data["mediatip_content"]['url']; ?>"/>
													<?php
endif;
													?>
												</div>
												<input class="mce-textbox " id="image-box-data" style="display: none;" value="<?php echo $data["mediatip_content_json"]; ?>">
												<div class="mce-widget mce-btn mce-last mce-btn-has-text" role="button" style="width: 100%; height: 30px;" tabindex="-1">
													<button role="presentation" style="height: 100%; width: 100%;" tabindex="-1" type="button" id="ithoughts_tt_gl_select_image">
														<?php _e("Select an image", "ithoughts_tooltip_glossary"); ?>
													</button>
												</div>
											</td>
										</tr>
										<tr data-mediatip_type="mediatip-webimage-type">
											<td>
												<label for="mediatip_url_image">
													<?php _e("Image url", "ithoughts_tooltip_glossary"); ?>
												</label>
											</td>
											<td>
												<input autocomplete="off" type="url" name="mediatip_url_image" id="mediatip_url_image" value="<?php echo (($data["mediatip_type"] == "webimage") ? $data["mediatip_content_json"] : ""); ?>"/>
											</td>
										</tr>
										<tr data-mediatip_type="mediatip-webvideo-type">
											<td>
												<label for="mediatip_url_video">
													<?php _e("Video integration code", "ithoughts_tooltip_glossary"); ?>
												</label>
											</td>
											<td>
												<input autocomplete="off" type="text" name="mediatip_url_video_link" id="mediatip_url_video_link" value="<?php echo (($data["mediatip_type"] == "webvideo") ? $data["mediatip_link"] : ""); ?>"/>
												<input autocomplete="off" type="hidden" name="mediatip_url_video_embed" id="mediatip_url_video_embed" value="<?php echo (($data["mediatip_type"] == "webvideo") ? $data["mediatip_content"] : ""); ?>"/>
												<input autocomplete="off" type="hidden" name="mediatip_url_video_link" id="mediatip_url_video_link" value="<?php echo (($data["mediatip_type"] == "webvideo") ? $data["mediatip_link"] : ""); ?>"/>
											</td>
										</tr>
									</table>
								</div>
							</div>
						</form>






					</div>
				</div>
			</div>


			<div class="mce-container mce-panel mce-foot"tabindex="-1">
				<div class="mce-container-body">
					<div>
					</div>


					<div aria-labelledby="mceu_78" class="mce-widget mce-btn mce-primary mce-first mce-btn-has-text" role="button" tabindex="-1">
						<button role="presentation" style="height: 100%; width: 100%;" tabindex="-1" type="button" id="ithoughts_tt_gl-tinymce-validate">
							<?php _e("Ok", "ithoughts_tooltip_glossary"); ?>
						</button>
					</div>


					<div aria-labelledby="mceu_79" class="mce-widget mce-btn mce-last mce-btn-has-text" role="button" tabindex="-1">
						<button role="presentation" style="height: 100%; width: 100%;" tabindex="-1" type="button" class="ithoughts_tt_gl-tinymce-discard">
							<?php _e("Discard", "ithoughts_tooltip_glossary"); ?>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div style="z-index: 100100;" id="mce-modal-block" class="mce-reset mce-fade mce-in">
	</div>
</div>