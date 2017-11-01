
<?php 

//setup wrapper dependant of width of the site

if(!$GLOBALS[ 'full_width']){
	$swiper_wrapper = "wrapper-pd wrapper-lg";
	$swiper_width = "";

} else {
	$swiper_wrapper = "";
	$swiper_width = "swiper-full-width";
}

?>
<?php if(get_sub_field('banner_widget_size') == 'large') { /// make every slide work at every width?>

<div class="<?php echo $swiper_wrapper; ?>">    
	<div class="swiper swiper-2 <?php echo $swiper_width; ?>">

<?php } elseif(get_sub_field('banner_widget_size') == 'small') {?>

	<div class="<?php echo $swiper_wrapper; ?>">    
		<div class="swiper swiper-1 <?php echo $swiper_width; ?>">

<?php } else { ?>	

	<div class="<?php echo $swiper_wrapper; ?>">      
		<div class="swiper <?php echo $swiper_width; ?>">

<?php } ?>	

		<?php 
			//setup counter and footer
			$counter = 0; 
			$slide_footer = '';

			if( have_rows('banner_widget_slide') ):		
				while( have_rows('banner_widget_slide') ) : the_row();

				$counter++;

				if($counter == 1){
					$slide_footer .= '<li class="active">';
				} else {
					$slide_footer .= '<li>';
				}
				
				$slide_footer .= '<a href="#slide'.($counter-1).'" data-slide="'.($counter-1).'">' . get_sub_field('banner_widget_slide_tab_title') .'</a></li>';

				$slide_img_array = get_sub_field('banner_widget_slide_image');		
				$slide_img_url = $slide_img_array['sizes']['banner-size-large'];

				// echo "<pre>"		;
				// print_r($slide_img_array);
				// echo "</pre>"		;

		?>

		<div class="slide">
			<div class="slide-inner">
				<div class="slide-content">
					<div class="slide-content-inner">
						<h2 class="slide-heading"><?php the_sub_field('banner_widget_slide_title'); ?></h2>
						<?php  echo '<p class="slide-lead">' . get_sub_field('banner_widget_slide_lead') . '</p>'; ?>						
						<?php if(get_sub_field('banner_widget_slide_link') == 'internal') { ?>
			            	<a class="slide-cta" href="<?php the_sub_field('banner_widget_slide_link_internal'); ?>"><?php the_sub_field('banner_widget_slide_link_text'); ?></a>				
			            <?php } elseif(get_sub_field('banner_widget_slide_link') == 'external') { ?>
			            	<a class="slide-cta" href="<?php the_sub_field('banner_widget_slide_link_external'); ?>"><?php the_sub_field('banner_widget_slide_link_text'); ?></a>
			            <?php } ?>
					</div>
				</div>
				<div class="slide-img" style="background-image:url('<?php echo $slide_img_url; ?>');">
					<img src="<?php echo $slide_img_url; ?>" alt="name">
				</div>

				<?php if(get_sub_field('banner_widget_slide_link') == 'internal') { ?>
	            	<a class="link-wrap" href="<?php the_sub_field('banner_widget_slide_link_internal'); ?>">More</a>				
	            <?php } elseif(get_sub_field('banner_widget_slide_link') == 'external') { ?>
	            	<a class="link-wrap" href="<?php the_sub_field('banner_widget_slide_link_external'); ?>">More</a>
	            <?php } ?>
			</div>
		</div>	 

		<?php 
				endwhile;		
			endif; // end child loop						
		?>
	</div>			

	<?php if($counter > 1){ //if more than one slide ?>        
    	<?php echo '<ul class="swiper-nav swiper-nav-'.$counter.'">' . $slide_footer . '</ul>'; ?>        
        <?php /*
        <ul class="swiper-nav swiper-nav-2">
			<li class="active"><a href="#slide0">Tab 1</a></li>
			<li><a href="#slide1">Tab 2</a></li>			
		</ul>	
        */ ?>
    <?php } ?>      			

	<!-- <a class="js-swiper-scroll swiper-more" href="#down">Scroll down</a>	 -->

</div>		
