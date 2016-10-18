<!--Cards Widget-->

<?php 

//Block or row view 
if(get_sub_field('cards_widget_layout') == 'stacked') {
	$card_stacked_flag = 1;
} else {
	$card_stacked_flag = 0;
}

//Background colour
$cards_widget_background = "";
$cards_single_background = "";
if(get_sub_field('cards_widget_background')) {
	if(get_sub_field('cards_widget_background') == 'grey') {
		$cards_widget_background = "skin-row-module-light ";
		$cards_single_background = "skin-row-white";
	} else {
		$cards_widget_background = "";
		$cards_single_background = "skin-box-module";
	}
}

//Image proportion
$cards_widget_image_proportion = "";
if(get_sub_field('cards_widget_image_proportion')) {

	if(get_sub_field('cards_widget_image_proportion') == "square") {
		$cards_widget_image_proportion = "1-1";
	} else {
		$cards_widget_image_proportion = "2-1";
	}

}

//Card columns
$cards_widget_columns = "";
if(get_sub_field('cards_widget_columns')) {
	$card_columns = get_sub_field('cards_widget_columns');
	if($card_columns == 4){
		$cards_widget_columns = "3";
	} elseif($card_columns == 3){
		$cards_widget_columns = "4";	
	} else {
		$cards_widget_columns = "6";	
	}
} 

?>
<div class="widget <?php echo $cards_widget_background; ?>">			
	<div class="wrapper-md wrapper-pd p-t equalize">

<?php if(get_sub_field('cards_widget_title')) { ?>

		<h3 class="h2-lg heading-underline"><?php the_sub_field('cards_widget_title'); ?></h3>

<?php } ?>

<?php if(get_sub_field('cards_widget_lead')) { ?>

		<p><?php the_sub_field('cards_widget_lead'); ?></p>

<?php } ?>

<?php if($card_stacked_flag){ ?>

		<div class="row clearfix">

<?php } else {?>

		<div class="clearfix">

<?php } ?>
<?php
		if( have_rows('cards_widget_card') ):		
			while( have_rows('cards_widget_card') ) : the_row();
?>

<?php if($card_stacked_flag){ ?>

			<div class="col-sm-<?php echo $cards_widget_columns; ?>">
				<div class="card-flat card-stacked-sm skin-bd-b <?php echo $cards_single_background; ?>">

<?php } else { ?>

			<div>
				<div class="card-flat <?php echo $cards_single_background; ?>">
<?php } ?>
				
				<?php if(get_sub_field('cards_widget_card_image')) { //Image ?>
					<div class="card-img card-img-1-3 card-img-1-4-xs">
						<div class="rs-img rs-img-<?php echo $cards_widget_image_proportion; ?>" style="background-image: url('<?php the_sub_field('cards_widget_card_image'); ?>');">

						<?php if(get_sub_field('cards_widget_card_link_option') == 'internal') { ?>			
		            		<a href="<?php the_sub_field('cards_widget_card_internal_link');?>">
		            	<?php } elseif(get_sub_field('cards_widget_card_link_option') == 'external'){ ?>		
		            		<a href="<?php the_sub_field('cards_widget_card_external_link');?>">
		            	<?php } ?>

				            <img src="./assets/img/placeholders/ph-news-01.jpg" alt="2:1">

				        <?php if(get_sub_field('cards_widget_card_link_option') != 'no-link') { ?>			
		            		</a>
		            	<?php } ?>		
				        </div>
					</div>
				<?php } ?>

					<div class="card-content equalize-inner">	
											
					<?php if(get_sub_field('cards_widget_card_title')) { //Title ?>			
						<h3 class="heading-link-alt">

						<?php if(get_sub_field('cards_widget_card_link_option') == 'internal') { ?>			
		            		<a href="<?php the_sub_field('cards_widget_card_internal_link');?>">
		            	<?php } elseif(get_sub_field('cards_widget_card_link_option') == 'external'){ ?>		
		            		<a href="<?php the_sub_field('cards_widget_card_external_link');?>">
		            	<?php } ?>
						
		            	<?php the_sub_field('cards_widget_card_title'); ?>

		            	<?php if(get_sub_field('cards_widget_card_link_option') != 'no-link') { ?>			
		            		</a>
		            	<?php } ?>	
		            	
		            	</h3>
					<?php }?>

					<?php if(get_sub_field('cards_widget_card_content')) { //content?>			
						<p class="note"><?php the_sub_field('cards_widget_card_content'); ?></p>
					<?php }?>		

					<?php if(get_sub_field('cards_widget_card_link_option') == 'internal') { ?>			
		            		<a class="more" href="<?php the_sub_field('cards_widget_card_internal_link');?>">More</a>
		            <?php } elseif(get_sub_field('cards_widget_card_link_option') == 'external'){ ?>		
		            		<a class="more" href="<?php the_sub_field('cards_widget_card_external_link');?>">More</a>
		            <?php } ?>
		            	
		                    			
			        </div>			
			    </div>
			</div>			
		
<?php 					
			endwhile;		
		endif; // end child loop		
?>
		
		</div><!-- /.clearfix -->		
		
	</div>
</div>

<!--/Cards Widget-->        