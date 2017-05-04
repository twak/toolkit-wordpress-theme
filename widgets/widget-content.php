<?php

if(get_sub_field('content_widget_background') == 'grey'){ 
	$content_background = "skin-row-module-light ";
} else {
	$content_background = "";
}

?>


<!--Content Widget-->
<?php if( $content_background != '' ) { ?>
<div class="<?php echo $content_background; ?>">
<?php } ?>
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
<?php if( $content_background != '' ) { ?>
</div>
<?php } ?>
<!--/Content Widget-->