<?php

if(get_sub_field('content_widget_background') == 'grey'){ 
	$content_background = "skin-row-module-light ";
} else {
	$content_background = "";
}

?>


<!--Content Widget-->
<div class="container-row <?php echo $content_background; ?>">
	<div class="wrapper-md wrapper-pd-md">				
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