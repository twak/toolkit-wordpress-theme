<?php if( have_rows('related_items') ): ?>
	<div class="skin-bg-module">
		<div class="wrapper-lg wrapper-pd p-t">
			<h3 class="h2-lg heading-underline">Related</h3>
			<div class="row">
				<div class="equalize">
					<?php while ( have_rows('related_items') ) : the_row(); ?>
						<?php $relatedId = get_sub_field('related_item'); ?>
						<div class="col-sm-4">
							<div class="card-flat card-stacked-sm skin-bg-white skin-bd-b">
								<div class="equalize-inner">
									<div class="card-img">
										<div class="rs-img rs-img-2-1" style="background-image: url('<?= get_the_post_thumbnail_url( $relatedId, 'thumbnail' ); ?>');"></div>
									</div>
									<div class="card-content">
										<h3 class="heading-link-alt"><a href="#"><?= get_the_title($relatedId) ?></a></h3>
										<a class="more" href="<?= get_permalink($relatedId) ?>">Read more</a>
									</div>
								</div>
							</div>
						</div>
					<?php endwhile; ?>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>

