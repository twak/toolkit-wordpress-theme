<?php 

if(get_field('sidebar_flag')): //Sidebar flag - true/false
	if(get_field('sidebar_flag') == 'show'): 
		$sidebar_flag = true;	
	endif; 
endif;

get_header(); ?>

<!-- $TEMPLATE: page -->

<?php if(!$GLOBALS[ 'full_width' ]){ the_breadcrumb(); } ?>

<?php if($sidebar_flag): ?>

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

				<?php if (has_post_thumbnail()) { ?>
					<div class="rs-img rs-img-2-1" style="background-image: url('<?php the_post_thumbnail_url('large'); ?>')">
				<?php
					the_post_thumbnail('large', array('class' => 'img-featured'));  
					echo '</div>';
				}
				?>

				<div class="jadu-cms">
					<?php the_content(); ?>					
				</div>

				<?php edit_post_link(); ?>

			</div>					

		<?php endwhile; ?>		

		<?php endif; ?>

<?php if($sidebar_flag): ?>

	</div><!-- ./column-container-primary-->	 
</div><!-- ./column-container-->

<?php endif; ?>

<?php get_footer(); ?>
