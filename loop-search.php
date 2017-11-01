<?php 

// Used on search.php

if (have_posts()): while (have_posts()) : the_post(); ?>

	<article id="post-<?php the_ID(); ?>" <?php post_class('flag'); ?>>
			
		<div class="flag-body">		
			<p class="heading-related"><?php tk_post_categories(); ?></p>
			<h4 class="heading-link"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h4>							
			<div class="excerpt">				
				<?php echo tk_get_excerpt('tk_index_length'); ?>
			</div>

		</div>
	</article>	

<?php endwhile; ?>
<?php endif; ?>
