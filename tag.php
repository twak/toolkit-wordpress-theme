<?php get_header(); ?>

<?php the_breadcrumb(); ?>

<div class="wrapper-sm wrapper-pd">

	<h1 class="heading-underline"><?php _e( 'Tag Archive: ', 'html5blank' ); echo single_tag_title('', false); ?></h1>

	<?php get_template_part('loop-flag'); ?>
	<?php get_template_part('pagination'); ?>

</div>

<?php get_footer(); ?>

