<?php get_header(); ?>

<?php the_breadcrumb(); ?>

<div class="wrapper-sm wrapper-pd">

	<?php if (have_posts()): the_post(); ?>

		<h1 class="heading-underline"><?php _e( 'Author Archives for ', 'html5blank' ); echo get_the_author(); ?></h1>

	<?php if ( get_the_author_meta('description')) : ?>

	<?php echo get_avatar(get_the_author_meta('user_email')); ?>

		<h2><?php _e( 'About ', 'html5blank' ); echo get_the_author() ; ?></h2>

		<?php echo wpautop( get_the_author_meta('description') ); ?>

	<?php endif; ?>

	<?php rewind_posts(); while (have_posts()) : the_post(); ?>

		<article id="post-<?php the_ID(); ?>" <?php post_class('flag'); ?>>
	
			<?php if ( has_post_thumbnail()) : // Check if thumbnail exists ?>
			<div class="flag-img">
				<div class="rs-img rs-img-2-1" style="background-image: url('<?php the_post_thumbnail_url('large'); ?>');">
					<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
						<?php the_post_thumbnail('large'); // Declare pixel size you need inside the array ?>
					</a>
				</div>
			</div>				
			<?php endif; ?>		

			<div class="flag-body">		
				<p class="heading-related"><?php the_category(', ');?></p>
				<h4 class="heading-link"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h4>							
				<div class="excerpt">
					<?php html5wp_excerpt('html5wp_index'); // Build your custom callback length in functions.php ?>
				</div>					
			</div>

		</article>	

	<?php endwhile; ?>	
	<?php endif; ?>

	<?php get_template_part('pagination'); ?>

</div>

<?php get_footer(); ?>