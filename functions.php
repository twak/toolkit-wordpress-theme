<?php
/*
 *  Author: Web Team - University of Leeds
 *  Custom functions, support, custom post types and more.
 */

/* theme admin */
require_once get_template_directory() . '/lib/admin.php';

/* Pluggable functions */
require_once get_template_directory() . '/lib/pluggable.php';

/* plugin activation */
require_once get_template_directory() . '/lib/plugins.php';

/* theme scripts */
require_once get_template_directory() . '/lib/scripts.php';

/* theme styles */
require_once get_template_directory() . '/lib/styles.php';

/* theme media */
require_once get_template_directory() . '/lib/media.php';

/* ACF fields */
require_once get_template_directory() . '/lib/acf/theme-options.php';
require_once get_template_directory() . '/lib/acf/theme-options-admin.php';
require_once get_template_directory() . '/lib/acf/pages.php';
require_once get_template_directory() . '/lib/acf/widgets-page-template.php';

/* Theme setup */
require_once get_template_directory() . '/lib/setup.php';

/* Wordpress cleanup */
require_once get_template_directory() . '/lib/cleanup.php';

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




// Adds instruction text after the post title input
function emersonthis_edit_form_after_title() {
    $tip = '<strong>TIP:</strong> To create a single line break use SHIFT+RETURN. By default, RETURN creates a new paragraph.';
    echo '<p style="margin-bottom:0;">'.$tip.'</p>';
}
add_action( 'edit_form_after_title', 'emersonthis_edit_form_after_title' );

