<?php
include_once get_template_directory() . '/lib/widgets/register-sidebars.php';
include_once get_template_directory() . '/lib/widgets/TK_Widget_Categories.php';
include_once get_template_directory() . '/lib/widgets/TK_Nav_Menu_Widget.php';
include_once get_template_directory() . '/lib/widgets/TK_Widget_Text.php';
include_once get_template_directory() . '/lib/widgets/TK_Widget_Archives.php';

// Unregister unwanted widgets
function unregister_default_widgets() {
	unregister_widget('WP_Widget_Calendar');
	unregister_widget('WP_Widget_Meta');
	unregister_widget('WP_Widget_Search');
	unregister_widget('WP_Widget_RSS');
	unregister_widget('WP_Widget_Tag_Cloud');
	unregister_widget('Twenty_Eleven_Ephemera_Widget');
	unregister_widget('WP_Widget_Media_Audio');
	unregister_widget('WP_Widget_Media_Video');
	unregister_widget('WP_Widget_Media_Image');
}
add_action('widgets_init', 'unregister_default_widgets', 11);


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

function tk_archives_widget_register() {
	unregister_widget( 'WP_Widget_Archives' );
	register_widget( 'TK_Widget_Archives' );
}
add_action( 'widgets_init', 'tk_archives_widget_register' );

