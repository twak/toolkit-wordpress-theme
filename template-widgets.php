<?php /* Template Name: Widgets Page Template */ get_header(); ?>

<?php 
	//Widget top glag
	if(get_field('widget_top')): $widget_top_flag = 1; else : $widget_top_flag = 0; endif; 		
	//Widgets flag
	if(get_field('widgets')): $widgets = get_field('widgets'); endif;
	$widget_counter = 0;

?>

<?php get_header(); ?>

<?php if(!$GLOBALS[ 'full_width' ]){ the_breadcrumb(); } ?>

<?php if(!$GLOBALS[ 'theme_sidebar_flag' ]){ //close wrapper ?>

</div>

<?php } ?>

<?php 
	
	if( have_rows('widgets') ):
		while( have_rows('widgets') ): 
			the_row(); //widgets flexi field			
			$widget_counter++;	

			if($GLOBALS[ 'theme_sidebar_flag' ]){ //if we have a sidebar
				if($widget_top_flag){ //if we have set the top flag widget
					if($widget_counter == 2 ){ //if we've loop through once
?>
						<div class="column-container <?php if($GLOBALS[ 'full_width' ]){ echo "column-container-fw"; }?>">
							<?php get_sidebar(); ?>
						    <div class="column-container-primary">  
						    <?php if($GLOBALS[ 'full_width' ]){ the_breadcrumb(); } ?>
<?php 
						if(!is_front_page()){				    
?>							
						    	<header class="wrapper-pd wrapper-sm">	
									<h1 class="heading-underline"><?php the_title(); ?></h1>
								</header>		
<?php
						}	
?>						
<?php 
					} 
				} else {
					if($widget_counter < 2 ){ //if we've loop first time
?>			
						<div class="column-container <?php if($GLOBALS[ 'full_width' ]){ echo "column-container-fw"; }?>">
							<?php get_sidebar(); ?>
						    <div class="column-container-primary">  
						    <?php if($GLOBALS[ 'full_width' ]){ the_breadcrumb(); } ?>
						    	<header class="wrapper-padded wrapper-sm">	
									<h1 class="heading-underline"><?php the_title(); ?></h1>
								</header>					
<?php 
					}
				} 
			} 
?>

		<div class="widget" id="widget-<?php echo $widget_counter; ?>">			

		<?php 
						
			$row_layout = get_row_layout();		

			switch ($row_layout):						
			    case 'content_widget': // Content Widget
	
				get_template_part('widgets/widget', 'content'); 				
		    					        
			    break;					  
			    case 'featured_content_widget': // Content Widget
	
				get_template_part('widgets/widget', 'featured-content'); 				
		    					        
			    break;					      
			    case 'news_events_widget': // News and Events    

					get_template_part('widgets/widget', 'news-events'); 
			      					      			
				break;					    
			    case 'banner_widget': //Banner Widget    
					
					get_template_part('widgets/widget', 'banner'); 

			    break;
			    case 'cards_widget': //Banner Widget    
					
					get_template_part('widgets/widget', 'cards'); 

			    break;
			    case 'tiles_widget': //Banner Widget    
					
					get_template_part('widgets/widget', 'tiles'); 

			    break;
			    default:

			    	echo "Select widget";
			       
			endswitch;    				       	
		?>

		</div>

	<?php endwhile; ?>

<?php 
endif; ?>


<?php if (have_posts()): while (have_posts()) : the_post(); ?>

	<br>
		
	<div id="post-<?php the_ID(); ?>" <?php post_class('wrapper-sm wrapper-padded'); ?>>

		<?php if (has_post_thumbnail()) { the_post_thumbnail(); } ?>

		<div class="jadu-cms">
			<?php the_content(); ?>					
		</div>

		<?php edit_post_link(); ?>

	</div>			

<?php endwhile; ?>

<?php else: ?>
	
	<div>
		<h2><?php _e( 'Sorry, nothing to display.', 'html5blank' ); ?></h2>
	</div>			

<?php endif; ?>


<?php if($GLOBALS[ 'theme_sidebar_flag' ]){ ?>

	</div><!-- ./column-container-primary-->	 
</div><!-- ./column-container-->

<?php } ?>

<?php if(!$GLOBALS[ 'theme_sidebar_flag' ]){ // open wrapper ?>

<div>

<?php } ?>



<?php get_footer(); ?>
