<?php


add_action( 'wp_print_styles', 'tk_global_styles', 15 );
function tk_global_styles() {
	$themeVersion = wp_get_theme('toolkit-wordpress-theme')->get('Version');
	wp_enqueue_style( 'tk_bootstrap', get_template_directory_uri() . '/dist/theme-' . $GLOBALS['colour'] . '/bootstrap.min.css', '', '3.3.5', 'screen');
	wp_enqueue_style( 'tk_toolkit', get_template_directory_uri() . '/dist/theme-' . $GLOBALS['colour'] . '/toolkit.min.css', '',  $themeVersion , 'screen');
	wp_enqueue_style( 'tk_toolkit_print', get_template_directory_uri() . '/dist/theme-' . $GLOBALS['colour'] . '/print.min.css', '',  $themeVersion , 'print');
}