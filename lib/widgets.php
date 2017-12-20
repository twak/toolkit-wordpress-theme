<?php
include_once get_template_directory() . '/lib/widgets/TK_Widget_Categories.php';
include_once get_template_directory() . '/lib/widgets/TK_Nav_Menu_Widget.php';
include_once get_template_directory() . '/lib/widgets/TK_Widget_Text.php';

function tk_categories_widget_register() {
	unregister_widget( 'WP_Widget_Categories' );
	register_widget( 'TK_Widget_Categories' );
}
add_action( 'widgets_init', 'tk_categories_widget_register' );

function tk_nav_widget_register() {
	unregister_widget( 'WP_Nav_Menu_Widget' );
	register_widget( 'TK_Nav_Menu_Widget' );
}
add_action( 'widgets_init', 'tk_nav_widget_register' );

function tk_text_widget_register() {
	unregister_widget( 'WP_Widget_Text' );
	register_widget( 'TK_Widget_Text' );
}
add_action( 'widgets_init', 'tk_text_widget_register' );
