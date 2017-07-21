<?php

function tk_theme_scripts() {
	wp_register_script('tk_wordpress', get_template_directory_uri() .'/js/toolkit-wordpress.js', '','', false);
	wp_enqueue_script('tk_wordpress');
}

add_action( 'wp_enqueue_scripts', 'tk_theme_scripts' );