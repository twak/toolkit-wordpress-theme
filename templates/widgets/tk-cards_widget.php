<!--Cards Widget-->

<?php 

//Layout - flat or stacked
if(get_sub_field('cards_widget_layout') == 'stacked') {
	$card_stacked_flag = 1;
} else {
	$card_stacked_flag = 0;
}

//Card columns
$cards_widget_columns = "";
if(get_sub_field('cards_widget_columns')) {
	$card_columns = get_sub_field('cards_widget_columns');
	if($card_columns == 4){
		$cards_widget_columns = "col-sm-6 col-md-3";
	} elseif($card_columns == 3){
		$cards_widget_columns = "col-sm-4";	
	} else {
		$cards_widget_columns = "col-sm-6";	
	}
} 

//Background colour
$cards_widget_background = "";
$cards_single_background = "";
if(get_sub_field('cards_widget_background')) {
	if(get_sub_field('cards_widget_background') == 'grey') {
		$cards_widget_background = "skin-row-module-light ";
		$cards_single_background = "skin-box-white";
	} else {
		$cards_widget_background = "";
		$cards_single_background = "skin-box-module";
	}
}

//Image proportion & width
$cards_widget_image_proportion = "";
$cards_widget_image_width = "";
if(get_sub_field('cards_widget_image_proportion')) {
	if(get_sub_field('cards_widget_image_proportion') == "square") {
		$cards_widget_image_proportion = "1-1";
		if(!$card_stacked_flag) {
			$cards_widget_image_width = "card-img-1-4";
		}
	} else {
		$cards_widget_image_proportion = "2-1";
		if(!$card_stacked_flag) {
			$cards_widget_image_width = "card-img-1-3";
		}
	}
}


//Wrappers
if($card_stacked_flag){
	if($card_columns == 4) {
		$cards_widget_wrapper = "wrapper-lg";
	} else {
		$cards_widget_wrapper = "wrapper-md";
	}

} else {
	$cards_widget_wrapper = "wrapper-md";
}

?>
<div class="container-row <?php echo $cards_widget_background; ?>">			
	<div class="<?php echo $cards_widget_wrapper; ?> wrapper-pd-md equalize">

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
                if (get_sub_field('cards_widget_card_link_option') == 'internal') {
                    $link_url = get_sub_field('cards_widget_card_internal_link');
                } elseif (get_sub_field('cards_widget_card_link_option') == 'external') {
                    $link_url = get_sub_field('cards_widget_card_external_link');
                } else {
                    $link_url = false;
                }
                $link_text = get_sub_field('cards_widget_card_link_text');
                if ( ! $link_text ) {
                    $link_text = 'More';
                }

?>

<?php if($card_stacked_flag){ ?>

			<div class="<?php echo $cards_widget_columns; ?>">
				<div class="card-flat card-stacked-sm skin-bd-b <?php echo $cards_single_background; ?>">

<?php } else { ?>

			<div>
				<div class="card-flat <?php echo $cards_single_background; ?>">
<?php } ?>
				
				<?php if(get_sub_field('cards_widget_card_image')) { //Image ?>
					<div class="card-img <?php echo $cards_widget_image_width; ?>">
						<div class="rs-img rs-img-<?php echo $cards_widget_image_proportion; ?>" style="background-image: url('<?php the_sub_field('cards_widget_card_image'); ?>');">
						<?php if ( $link_url ) { ?>			
		            		<a href="<?php echo $link_url; ?>">
		            	<?php } ?>
				            <img src="<?php the_sub_field('cards_widget_card_image'); ?>" alt="2:1">
				        <?php if ( $link_url ) { ?>
		            		</a>
		            	<?php } ?>		
				        </div>
					</div>
				<?php } ?>

					<div class="card-content equalize-inner">	
											
					<?php if(get_sub_field('cards_widget_card_title')) { //Title ?>			
						<h3 class="heading-link-alt">
                        <?php if ( $link_url ) { ?>         
		            		<a href="<?php echo $link_url; ?>">
		            	<?php } ?>
		            	<?php the_sub_field('cards_widget_card_title'); ?>
                        <?php if ( $link_url ) { ?>         
		            		</a>
		            	<?php } ?>	
		            	</h3>
					<?php }?>

					<?php if(get_sub_field('cards_widget_card_content')) { //content?>			
						<div class="note"><?php the_sub_field('cards_widget_card_content'); ?></div>
					<?php }?>		

                    <?php if ( $link_url ) { ?>         
		            	<a class="more" href="<?php echo $link_url; ?>"><?php echo $link_text; ?></a>
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