<?php

function tk_theme_scripts() {
	wp_register_script('tk_wordpress', get_template_directory_uri() .'/js/toolkit-wordpress.js', '','', false);
	wp_enqueue_script('tk_wordpress');
}

add_action( 'wp_enqueue_scripts', 'tk_theme_scripts' );


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
