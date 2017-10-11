<?php

function tk_register_theme_scripts() {
    $api_key = 'AIzaSyBBUKSi1deZSSGaOvXaR-3p4pkwHzZO0s0';
	wp_register_script(
        'tk_wordpress',
        get_template_directory_uri() . '/js/toolkit-wordpress.js', 
        '',
        '', 
        false
    );
    wp_register_script(
        'google_maps_api',
        'https://maps.googleapis.com/maps/api/js?key=' . $api_key,
        array(),
        false,
        true
    );
    wp_register_script(
        'google_map_widget',
        get_template_directory_uri() . '/js/google-map-widget.js',
        array('jquery','google_maps_api'),
        false,
        true
    );
}
function tk_enqueue_theme_scripts()
{
    wp_enqueue_script('tk_wordpress');
    wp_enqueue_script('google_maps_api');
    wp_enqueue_script('google_map_widget');
}

add_action( 'init', 'tk_register_theme_scripts' );
add_action( 'wp_enqueue_scripts', 'tk_enqueue_theme_scripts' );


/**
 * Output site specific scripts
 * Set in: Site Admin->Appearance->Theme Scripts
 */

function tk_site_scripts_output_head(){
	if( class_exists('acf') ):

		$scriptEntries = get_field('tk_theme_scripts', 'option');

		if ( $scriptEntries ) {
            foreach ($scriptEntries as $scriptEntry) {

    			if ($scriptEntry['tk_theme_script_placement'] == 'wp_head'){
    				echo $scriptEntry['tk_theme_script'];
    			}
    		}
        }

	endif;
};
add_action('wp_head', 'tk_site_scripts_output_head');

function tk_site_scripts_output_footer(){
	if( class_exists('acf') ):

		$scriptEntries = get_field('tk_theme_scripts', 'option');

        if ( $scriptEntries ) {
    		foreach ($scriptEntries as $scriptEntry) {

    			if ($scriptEntry['tk_theme_script_placement'] == 'wp_footer'){
    				echo $scriptEntry['tk_theme_script'];
    			}
    		}
        }
	endif;
};
add_action('wp_footer', 'tk_site_scripts_output_footer');
