
<?php if(get_sub_field('banner_widget_size') == 'large') { ?>

<div>    
	<div class="swiper swiper-2 swiper-full-width">

<?php } elseif(get_sub_field('banner_widget_size') == 'small') {?>

	<div class="wrapper-lg wrapper-pd">    
		<div class="swiper swiper-1">

<?php } else { ?>	

	<div class="wrapper-lg wrapper-pd">    
		<div class="swiper">

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

		?>

		<div class="slide">
			<div class="slide-inner">
				<div class="slide-content">
					<div class="slide-content-inner">
						<h2 class="slide-heading"><?php the_sub_field('banner_widget_slide_title'); ?></h2>
						<?php  echo '<p class="slide-lead">' . get_sub_field('banner_widget_slide_lead') . '</p>'; ?>						
						<?php if(get_sub_field('banner_widget_slide_link') == 'internal') { ?>
			            	<a class="slide-cta" href="<?php the_sub_field('banner_widget_slide_link_internal'); ?>">More</a>				
			            <?php } elseif(get_sub_field('banner_widget_slide_link') == 'external') { ?>
			            	<a class="slide-cta" href="<?php the_sub_field('banner_widget_slide_link_external'); ?>">More</a>
			            <?php } ?>
					</div>
				</div>
				<div class="slide-img" style="background-image:url('<?php the_sub_field('banner_widget_slide_image'); ?>');">
					<img src="<?php the_sub_field('banner_widget_slide_image'); ?>" alt="name">
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

	<a class="js-swiper-scroll swiper-more" href="#down">Scroll down</a>	

</div>		
