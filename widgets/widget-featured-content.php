<?php 

if(get_sub_field('featured_content_widget_background') == 'grey'){ 
	$featured_content_background = "skin-row-module-light ";
} else {
	$featured_content_background = "";
}

?>

<!-- Featured Content Widget-->
<div class="<?php echo $featured_content_background; ?>">
	<div class="wrapper-md wrapper-pd-lg">
		<div class="p-t p-b">
			
			<?php if(get_sub_field('featured_content_widget_heading')){ ?>
				<h3 class="h2-lg heading-underline">
					<?php the_sub_field('featured_content_widget_heading'); ?>
				</h3>
			<?php } ?>

			<div class="row">
			    <div class="col-sm-8 col-md-6">
			        <div class="cms no-lead">
			            <?php the_sub_field('featured_content_widget_content'); ?>
			        </div>    

			        <?php if(get_sub_field('featured_content_widget_link_option') == 'internal') { ?>			
	            		<a class="more" href="<?php the_sub_field('featured_content_widget_internal_link');?>">More</a>
	            	<?php } elseif(get_sub_field('featured_content_widget_link_option') == 'external'){ ?>		
	            		<a class="more" href="<?php the_sub_field('featured_content_widget_external_link');?>">More</a>
	            	<?php } ?>
	            	
			    </div>
			    <div class="col-sm-4 col-md-6">			    	
			    	<?php if(get_sub_field('featured_content_widget_image')){ ?>
			        <div class="rs-img rs-img-2-1" style="background-image: url('<?php the_sub_field('featured_content_widget_image'); ?>');">
				        <?php if(get_sub_field('featured_content_widget_link_option') == 'internal') { ?>			
		            		<a href="<?php the_sub_field('featured_content_widget_internal_link');?>">
		            	<?php } elseif(get_sub_field('featured_content_widget_link_option') == 'external'){ ?>		
		            		<a href="<?php the_sub_field('featured_content_widget_external_link');?>">
		            	<?php } ?>
			            		<img src="<?php the_sub_field('featured_content_widget_image'); ?>" alt="<?php the_sub_field('featured_content_widget_heading'); ?>">
			            <?php if(get_sub_field('featured_content_widget_link_option') != 'no-link') { ?>
			            	</a>
			            <?php } ?>			
			        </div>
			        <?php } ?>
			    </div>
			</div>
						
		</div>		
	</div> 
</div>
<!--/Featured Content Widget-->

