<?php
/*
 *  Author: Web Team - University of Leeds
 *  Custom functions, support, custom post types and more.
 */

/* theme admin */
require_once get_template_directory() . '/lib/admin.php';

/* plugin activation */
require_once get_template_directory() . '/lib/plugins.php';

/* theme styles */
require_once get_template_directory() . '/lib/styles.php';

/* ACF fields */
require_once get_template_directory() . '/lib/acf/theme-options.php';
require_once get_template_directory() . '/lib/acf/pages.php';
//require_once get_template_directory() . '/lib/acf/widgets-page-template.php';

/* Theme setup */
require_once get_template_directory() . '/lib/setup.php';

/* Wordpress cleanup */
require_once get_template_directory() . '/lib/cleanup.php';

/* Pluggable functions */
require_once get_template_directory() . '/lib/pluggable.php';

/* TinyMCE Viewable controls */
require_once get_template_directory() . '/lib/tinymce.php';



/* *
 * * Custom Walkers
 * */

// Navigation
require_once get_template_directory() . '/lib/navigation.php';

// Sidebar
require_once get_template_directory() . '/lib/custom-walkers/sidebar-walker.php';

// Footer menu
require_once get_template_directory() . '/lib/custom-walkers/footer-nav.php';


/* Not sure if/where these are used... */

// Custom Excerpts
function html5wp_index($length) // Create 20 Word Callback for Index page Excerpts, call using html5wp_excerpt('html5wp_index');
{
    return 50; //used on flags
}

// Create 40 Word Callback for Custom Post Excerpts, call using html5wp_excerpt('html5wp_custom_post');
function html5wp_custom_post($length)
{
    return 20; // used on cards
}


// Create the Custom Excerpts callback
function html5wp_excerpt($length_callback = '', $more_callback = '')
{
    global $post;
    if (function_exists($length_callback)) {
        add_filter('excerpt_length', $length_callback);
    }
    if (function_exists($more_callback)) {
        add_filter('excerpt_more', $more_callback);
    }
    $output = get_the_excerpt();
    $output = apply_filters('wptexturize', $output);
    $output = apply_filters('convert_chars', $output);
    $output = '<p>' . $output . '</p>';
    echo $output;
}



// Adds instruction text after the post title input
function emersonthis_edit_form_after_title() {
    $tip = '<strong>TIP:</strong> To create a single line break use SHIFT+RETURN. By default, RETURN creates a new paragraph.';
    echo '<p style="margin-bottom:0;">'.$tip.'</p>';
}
add_action( 'edit_form_after_title', 'emersonthis_edit_form_after_title' );

