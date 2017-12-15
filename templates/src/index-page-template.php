<template id="itg-index-page" title="<?php esc_attr_e('Create an index glossary page', 'ithoughts-tooltip-glossary'); ?>">
	<form action="<?php echo esc_url( $ajax ); ?>" method="post" class="simpleajaxform" data-target="update-response">
		<?php wp_nonce_field( 'ithoughts_tt_gl-index-page-edit' ); ?>
		<table class="form-table">
			<tbody>
				<tr>
					<th>
						<label for="<?php esc_attr($options_inputs['index-page-url']->get_id()); ?>"><?php esc_html_e( 'Url of the page', 'ithoughts-tooltip-glossary' ); ?>:</label>
					</th>
					<td>
						<?php $options_inputs['index-page-url']->print(); ?>
					</td>
				</tr>
			</tbody>
		</table>
		<h2>Page index type</h2>
		<div id="itg-listtypes">
			<button type="button" class="img-container button">
				<h3>A to Z</h3>
				<img src="<?php echo $this->backbone->get_base_url(); ?>/assets/dist/imgs/list-icons/a-to-z.svg" alt="<?php esc_attr_e('A to Z', 'ithoughts-tooltip-glossary'); ?>"/>
			</button>
			<button type="button" class="img-container button">
				<h3>List</h3>
				<img src="<?php echo $this->backbone->get_base_url(); ?>/assets/dist/imgs/list-icons/list.svg" alt="<?php esc_attr_e('List', 'ithoughts-tooltip-glossary'); ?>"/>
			</button>
		</div>
	</form>
</template>