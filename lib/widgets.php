<?php
include_once get_template_directory() . '/lib/widgets/TK_Widget_Categories.php';

function tk_categories_widget_register() {
	unregister_widget( 'WP_Widget_Categories' );
	register_widget( 'TK_Widget_Categories' );
}
add_action( 'widgets_init', 'tk_categories_widget_register' );
