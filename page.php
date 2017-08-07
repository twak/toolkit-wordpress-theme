<?php 

get_header(); ?>

<!-- $TEMPLATE: page -->

<?php if(!$GLOBALS[ 'full_width' ]){ the_breadcrumb(); } ?>

<?php if($GLOBALS['theme_sidebar_flag']): ?>

<div class="column-container <?php if($GLOBALS[ 'full_width' ]){ echo "column-container-fw"; }?>">

	<?php get_sidebar(); ?>

    <div class="column-container-primary">       
	
<?php endif; ?>

		<?php if($GLOBALS[ 'full_width' ]){ the_breadcrumb(); } ?>

		<header class="wrapper-pd wrapper-sm">	
			<h1 class="heading-underline"><?php the_title(); ?></h1>
		</header>				

		<?php if (have_posts()): while (have_posts()) : the_post(); ?>
				
			<div id="post-<?php the_ID(); ?>" <?php post_class('wrapper-sm wrapper-pd'); ?>>

				<?php if ( has_post_thumbnail() && tk_display_featured_image() ) : // Check if Thumbnail exists and if it is set to be displayed ?>
				<div class="rs-img rs-img-2-1 featured-img" style="background-image: url('<?php the_post_thumbnail_url( 'featured-size' ); ?>');">					
					<?php the_post_thumbnail( 'featured-size' ); // Declare pixel size you need inside the array ?>					
				</div>
				<?php endif; ?>		

				<div class="jadu-cms">
					<?php the_content(); ?>					
				</div>

				<?php edit_post_link(); ?>

                <?php get_template_part('templates/page-related-items'); ?>

			</div>					

		<?php endwhile; ?>		

		<?php endif; ?>

<?php if($GLOBALS['theme_sidebar_flag']): ?>

	</div><!-- ./column-container-primary-->	 
</div><!-- ./column-container-->

<?php endif; ?>

<?php get_footer(); ?>
