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
			<p class="heading-related"><?php the_terms($post->ID, 'category', '<span class="name-divider">', ', ', '</span>'); ?><?php the_time('l j F Y'); ?></p>
			<h4 class="heading-link"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h4>							
			<div class="excerpt">				
				<?php echo tk_get_excerpt('tk_index_length'); ?>
			</div>
		</div>
	</article>	

<?php endwhile; ?>
<?php endif; ?>
