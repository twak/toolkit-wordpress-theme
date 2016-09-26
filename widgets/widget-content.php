<!--Content Widget-->
<div class="wrapper-md wrapper-pd">
	<div class="p-t p-b">
		
		<?php if(get_sub_field('content_widget_heading')){ ?>
			<h3 class="h2-lg heading-underline">
				<?php the_sub_field('content_widget_heading'); ?>
			</h3>
		<?php } ?>
		
		<div class="cms">			
			<?php the_sub_field('content_widget_content'); ?>
		</div>						
	</div>
</div> 
<!--/Content Widget-->