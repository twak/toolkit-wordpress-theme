<!--Columns Widget-->

<?php
$num_columns = count( get_sub_field( 'columns' ) );
$wrapper_class = get_sub_field( 'columns_wide' ) ? 'wrapper-lg': 'wrapper-md';
if( have_rows( 'columns' ) ):
    $column_class = "";
    switch( $num_columns ) {
        case 3:
            $column_class = "col-sm-4";
            break;
        case 2:
            $column_class = "col-sm-6";
            break;
        default:
            $column_class = "col-sm-12";
            break;
    }

?>

<div class="container-row">
	<div class="<?php echo $wrapper_class ?> wrapper-pd-md equalize tk-columns">	

	<?php
	// loop through columns
	while( have_rows( 'columns' ) ) : the_row();
	?>
        <div class="tk-column <?php echo $column_class; ?>">
			<?php the_sub_field( 'column_content' ); ?>
		</div>

	<?php
    endwhile;
	?>

	</div>
</div>
<?php
endif;
