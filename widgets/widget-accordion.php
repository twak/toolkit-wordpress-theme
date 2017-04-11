<!--Accordion Widget-->

<?php ?>

<div class="container-row">
	<div class="wrapper-lg wrapper-pd-md">	

	<?php
	// Start the loop for each accordion
	if( have_rows( 'accordion_item' ) ):		
		while( have_rows( 'accordion_item' ) ) : the_row();
	?>

		<h4 class="accordion-trigger"><?php the_sub_field( 'accordion_title' ); ?></h4>

		<div class="accordion-content">
			<?php the_sub_field( 'accordion_content' ); ?>
		</div>

	<?php

	endwhile;		
	endif; // end child loop
	?>

	</div>
</div>