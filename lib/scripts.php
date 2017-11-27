<?php
function tk_get_google_api_key()
{
    $api_key = get_field( 'tk_google_api_key', 'option' );
    if ( ! $api_key ) {
        $api_key = 'AIzaSyBBUKSi1deZSSGaOvXaR-3p4pkwHzZO0s0';
    }
    return $api_key;
}
function tk_register_theme_scripts() {
    $api_key = tk_get_google_api_key();
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
    // these function depend on ACF
    add_action('wp_head', 'tk_site_scripts_output_head');
    add_action('wp_footer', 'tk_site_scripts_output_footer');
}
function tk_enqueue_theme_scripts()
{
    wp_enqueue_script('tk_wordpress');
}

add_action( 'acf/init', 'tk_register_theme_scripts' );
add_action( 'wp_enqueue_scripts', 'tk_enqueue_theme_scripts' );


/**
 * Output site specific scripts
 * Set in: Site Admin->Appearance->Theme Scripts
 */
function tk_site_scripts_output_head(){

	$scriptEntries = get_field('tk_theme_scripts', 'option');

	if ( $scriptEntries ) {
        foreach ($scriptEntries as $scriptEntry) {

			if ($scriptEntry['tk_theme_script_placement'] == 'wp_head'){
				echo $scriptEntry['tk_theme_script'];
			}
		}
    }
};

function tk_site_scripts_output_footer(){

	$scriptEntries = get_field('tk_theme_scripts', 'option');

    if ( $scriptEntries ) {
		foreach ($scriptEntries as $scriptEntry) {

			if ($scriptEntry['tk_theme_script_placement'] == 'wp_footer'){
				echo $scriptEntry['tk_theme_script'];
			}
		}
    }
};

