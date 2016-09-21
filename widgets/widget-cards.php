<!--Cards Widget-->
<div class="widget p-t p-b">			
	<div class="wrapper-md wrapper-pd">
<?php

	if( have_rows('cards_widget_card') ):		
		while( have_rows('cards_widget_card') ) : the_row();

		echo '<div class="flag">';
		
		if(get_sub_field('cards_widget_card_image')) {
			echo '<div class="flag-img flag-img-1-4">';
			echo 	'<div class="rs-img rs-img-1-1" style="background-image: url('.get_sub_field('cards_widget_card_image').')">';
			echo 		'<img src="'.get_sub_field('cards_widget_card_image').'">';
			echo 	'</div>';
			echo '</div>';
		}

			echo '<div class="flag-body">';

			if(get_sub_field('cards_widget_card_title')) {
				echo '<h3>'.get_sub_field('cards_widget_card_title').'</h3>';
			}

			if(get_sub_field('cards_widget_card_content')) {
				echo '<h3>'.get_sub_field('cards_widget_card_content').'</h3>';
			}

			echo '</div>';
		echo '</div>';
		
		endwhile;		
	endif; // end child loop
	
?>
	</div>
</div>
<!--/Cards Widget-->        