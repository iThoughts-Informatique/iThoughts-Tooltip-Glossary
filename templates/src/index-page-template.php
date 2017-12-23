<template id="itg-index-page" title="<?php esc_attr_e('Create an index glossary page', 'ithoughts-tooltip-glossary'); ?>">
	<form action="<?php echo esc_url( $ajax ); ?>" method="post" class="simpleajaxform">
		<?php wp_nonce_field( 'ithoughts_tt_gl-index-page-edit' ); ?>
		<input autocomplete="off" type="hidden" name="action"/>
		<table class="form-table">
			<tbody>
				<tr>
					<th>
						<label for="<?php esc_attr($options_inputs['index-page-name']->get_id()); ?>"><?php esc_html_e( 'Title of the index page', 'ithoughts-tooltip-glossary' ); ?>:</label>
					</th>
					<td>
						<?php $options_inputs['index-page-name']->do_print(); ?>
					</td>
				</tr>
				<tr>
					<th>
						<label for="<?php esc_attr($options_inputs['index-page-url']->get_id()); ?>"><?php esc_html_e( 'Url of the page', 'ithoughts-tooltip-glossary' ); ?>:</label>
					</th>
					<td>
						<?php $options_inputs['index-page-url']->do_print(); ?>
					</td>
				</tr>
			</tbody>
		</table>
		<h2><?php esc_html_e('Page index type', 'ithoughts-tooltip-glossary'); ?></h2>
		<div id="itg-listtypes">
			<button class="button" data-action="atoz" name="actionB" value="ithoughts_tt_gl_create_page_atoz">
				<h3><?php esc_html_e('A to Z', 'ithoughts-tooltip-glossary'); ?></h3>
				<div class="img-container" style="background-image: url(<?php echo $this->backbone->get_base_url(); ?>/assets/dist/imgs/list-icons/a-to-z.svg)">
				</div>
			</button>
			<button class="button" data-action="list" name="actionB" value="ithoughts_tt_gl_create_page_glossary">
				<h3><?php esc_html_e('Glossary', 'ithoughts-tooltip-glossary'); ?></h3>
				<div class="img-container" style="background-image: url(<?php echo $this->backbone->get_base_url(); ?>/assets/dist/imgs/list-icons/glossary.svg)">
				</div>
			</button>
		</div>
	</form>
</template>