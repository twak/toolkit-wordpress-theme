<?php 

get_header(); ?>

<!-- $TEMPLATE: page -->
	<?php if (have_posts()): while (have_posts()) : the_post(); 

        get_template_part('templates/page-sidebar', 'top'); ?>
			
		<div id="post-<?php the_ID(); ?>" <?php post_class('wrapper-sm wrapper-pd'); ?>>

			<?php if ( has_post_thumbnail() && tk_display_featured_image() ) : // Check if Thumbnail exists and if it is set to be displayed ?>
			<div class="rs-img rs-img-2-1 featured-img" style="background-image: url('<?php the_post_thumbnail_url( 'featured-size' ); ?>');">					
				<?php the_post_thumbnail( 'featured-size' ); // Declare pixel size you need inside the array ?>					
			</div>
			<?php endif; ?>

			<?php do_action('tk_content_before'); ?>
			<div class="jadu-cms">
				<?php the_content(); ?>					
			</div>
			<?php do_action('tk_content_after'); ?>

			<?php edit_post_link(); ?>

            <?php get_template_part('templates/page-related-items'); ?>

		</div>					
        <?php
        get_template_part('templates/page-sidebar', 'bottom');

    endwhile; endif;

get_footer(); ?>
