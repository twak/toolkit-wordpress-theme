<?php get_header(); ?>

<div class="wrapper-xs wrapper-pd p-t p-b">			
	<h1 class="heading-underline"><?php _e( '404 - Page not found', 'html5blank' ); ?></h1>	
	<?php get_template_part('searchform'); ?>
	<h3>Pages</h3>
	<hr/>
	<?php wp_list_pages(); // echo site map ?>
</div>

<?php get_footer(); ?>
