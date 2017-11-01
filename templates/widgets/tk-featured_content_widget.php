<?php 

if(get_sub_field('featured_content_widget_background') == 'grey'){ 
	$featured_content_background = "skin-row-module-light ";
} else {
	$featured_content_background = "";
}

if (get_sub_field('featured_content_widget_link_option') == 'internal') {
    $link_url = get_sub_field('featured_content_widget_internal_link');
} elseif (get_sub_field('featured_content_widget_link_option') == 'external') {
    $link_url = get_sub_field('featured_content_widget_external_link');
} else {
    $link_url = false;
}
$link_text = get_sub_field('featured_content_widget_link_text');
if ( ! $link_text ) {
    $link_text = 'More';
}
if ( get_sub_field('featured_content_widget_image_aspect') == 'square' ) {
    $img_class = '';
} else {
    $img_class = ' rs-img-2-1';
}
$img_url = false;
$img_array = get_sub_field('featured_content_widget_image');
if ( ! empty($img_array) ) {
    $img_url = $img_array['sizes']['large'];
}
?>

<!-- Featured Content Widget-->
<div class="container-row <?php echo $featured_content_background; ?>">
	<div class="wrapper-md wrapper-pd-md">		
			
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

			        <?php if ( $link_url ) { ?>			
	            		<a class="more" href="<?php echo $link_url; ?>"><?php echo $link_text; ?></a>
	            	<?php } ?>
	            	
			    </div>
			    <div class="col-sm-4 col-md-6">			    	
			    	<?php if(get_sub_field('featured_content_widget_media_type') != "video" && $img_url): ?>
			        <div class="rs-img<?php echo $img_class; ?>" style="background-image: url('<?php echo $img_url; ?>');">
				        <?php if ( $link_url ) : ?><a href="<?php echo $link_url; ?>"><?php endif; ?>
			            	<img src="<?php echo $img_url; ?>" alt="<?php the_sub_field('featured_content_widget_heading'); ?>">
			            <?php if ( $link_url ) : ?></a><?php endif; ?>			
			        </div>
			        <?php elseif(get_sub_field('featured_content_widget_media_type') == "video" && get_sub_field('featured_content_widget_video')): ?>
                    <div class="embed-responsive embed-responsive-16by9">
                        <?php echo get_sub_field('featured_content_widget_video'); ?>
                    </div>
                    <?php endif; ?>
			    </div>
			</div>
								
	</div> 
</div>
<!--/Featured Content Widget-->

