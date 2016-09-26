<!--Content Widget-->
<div class="sk-widget-block">
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
			        <?php if(get_sub_field('featured_content_widget_link')){ ?>
			        	<a class="more" href="<?php the_sub_field('featured_content_widget_link'); ?>">more</a>
			        <?php } ?>
			    </div>
			    <div class="col-sm-4 col-md-6">
			    	<?php if(get_sub_field('featured_content_widget_link')){ ?>
			        <div class="rs-img rs-img-2-1" style="background-image: url('<?php the_sub_field('featured_content_widget_image'); ?>');">
			            <a href="<?php the_sub_field('featured_content_widget_link'); ?>"><img src="<?php the_sub_field('featured_content_widget_image'); ?>" alt="<?php the_sub_field('featured_content_widget_heading'); ?>"></a>
			        </div>
			        <?php } ?>
			    </div>
			</div>
						
		</div>		
	</div> 
</div>
<!--/Content Widget-->
