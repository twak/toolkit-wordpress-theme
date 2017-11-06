<?php
/**
 * Theme options fields for ACF
 */

// Hide the custom field in the sidebar for non-administrators
if ( ( is_multisite() && ! is_super_admin() ) || ( ! is_multisite() && ! is_admin() ) ) {
    add_filter('acf/settings/show_admin', '__return_false');
}

// only run if ACF plugin is loaded

add_action( 'acf/init', 'tk_add_acf_theme_options', 10 );
add_action( 'acf/init', 'tk_add_acf_theme_options_tabs', 9 );

function tk_add_acf_theme_options_tabs()
{
    /* include layout definitions */
    foreach (glob(dirname(__FILE__) . "/theme-options-tabs/*.php") as $filename)
    {
        include_once $filename;
    }
}

function tk_add_acf_theme_options()
{
	/**
	 * Theme Options Page
	 */
    acf_add_options_page(array( //Theme options
        'page_title'    => 'Theme Settings',
        'menu_title'    => 'Theme Settings',
        'menu_slug'     => 'theme-general-settings',
        'parent_slug'   => 'themes.php',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));

    /**
     * google API key
     */
    acf_update_setting('google_api_key', tk_get_google_api_key());  

	/** 
	 * Theme Options
	 */
	acf_add_local_field_group(array (
	    'key' => 'group_tk_theme_options',
	    'title' => 'Theme options',
	    'fields' => apply_filters('tk_theme_options_fields', array()),
	    'location' => array (
	        array (
	            array (
	                'param' => 'options_page',
	                'operator' => '==',
	                'value' => 'theme-general-settings',
	            ),
	        ),
	    ),
	    'menu_order' => 0,
	    'position' => 'normal',
	    'style' => 'default',
	    'label_placement' => 'top',
	    'instruction_placement' => 'label',
	    'hide_on_screen' => '',
	    'active' => 1,
	    'description' => '',
	));
}
/* add option tabs */
add_filter( 'tk_theme_options_fields', 'tk_theme_options_general_tab', 4 );
add_filter( 'tk_theme_options_fields', 'tk_theme_options_social_media_tab', 8 );
add_filter( 'tk_theme_options_fields', 'tk_theme_options_sponsors_tab', 12 );
add_filter( 'tk_theme_options_fields', 'tk_theme_options_404_tab', 16 );
add_filter( 'tk_theme_options_fields', 'tk_theme_options_admin_tab', 20 );
