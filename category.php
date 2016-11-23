<?php get_header(); ?>

<?php the_breadcrumb(); ?>

<div class="wrapper-sm wrapper-pd">
	<h1 class="heading-underline"><?php single_cat_title(); ?></h1>
	<?php get_template_part('loop-flag'); ?>
	<?php get_template_part('pagination'); ?>
</div>

<?php get_footer(); ?>

