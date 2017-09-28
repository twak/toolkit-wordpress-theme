<?php
if( have_rows('related_items') ):

    switch (count(get_field('related_items'))) {
        case 1:
            $cardContainerClass = 'col-sm-12';
            break;
        case 2:
        case 4:
            $cardContainerClass = 'col-sm-6';
            break;
        case 3:
            $cardContainerClass = 'col-sm-4';
            break;
        default:
            $cardContainerClass = 'col-sm-4';
    }



?>
	<div class="skin-bg-module">
		<div class="wrapper-lg wrapper-pd p-t">
			<h3 class="h2-lg heading-underline">Related</h3>
			<div class="row">
				<div class="equalize">
					<?php while ( have_rows('related_items') ) : the_row(); ?>
						<?php
                        $relatedId = get_sub_field('related_item');
                        $relatedTitle = get_the_title($relatedId);
						$relatedLink = get_permalink($relatedId);
						?>
						<div class="<?= $cardContainerClass ?>">
							<div class="card-flat card-stacked-sm skin-bg-white skin-bd-b">
								<div class="equalize-inner">
									<a class="card-img" href="<?= $relatedLink ?>" title="<?= $relatedTitle ?>">
										<div class="rs-img rs-img-2-1" style="background-image: url('<?= get_the_post_thumbnail_url( $relatedId, 'thumbnail' ); ?>');"></div>
									</a>
									<div class="card-content">
										<h3 class="heading-link-alt"><a href="<?= $relatedLink ?>" title="<?= $relatedTitle ?>"><?= $relatedTitle ?></a></h3>
										<a class="more" href="<?= $relatedLink ?>" title="<?= $relatedTitle ?>">Read more</a>
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

