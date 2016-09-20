<?php 
	// main loop used on various pages
	if (have_posts()): while (have_posts()) : the_post(); ?>

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
			<p class="heading-related"><?php tk_post_categories(); ?></p>
			<h4 class="heading-link"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h4>							
			<div class="excerpt">				
				<?php html5wp_excerpt('html5wp_index'); // Build your custom callback length in functions.php ?>
			</div>
		</div>
	</article>	

<?php endwhile; ?>
<?php endif; ?>
