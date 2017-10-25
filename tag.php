<?php
$posts_sidebar = get_field('posts_sidebar_flag', 'option');

get_header();

the_breadcrumb();

?>

<?php if($posts_sidebar) : ?>
<div class="column-container">
<?php get_sidebar('posts'); ?>

    <div class="column-container-primary">

<?php endif; ?>

<div class="wrapper-sm wrapper-pd">

	<h1 class="heading-underline">Tag Archive: <?php echo single_tag_title('', false); ?></h1>

	<?php get_template_part('loop-flag'); ?>
	<?php get_template_part('pagination'); ?>

</div>

<?php if($posts_sidebar) : ?>
    </div> <!-- /.column-container-primary -->
</div> <!-- /.column-container -->
<?php endif; ?>

<?php get_footer(); ?>
