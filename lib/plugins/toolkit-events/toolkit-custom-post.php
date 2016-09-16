<?php
/**
 * Plugin Name: Toolkit Events
 * Plugin URI: http://danielpataki.com
 * Description: This plugin adds some Facebook Open Graph tags to our single posts.
 * Version: 1.0.0
 * Author: Daniel Pataki
 * Author URI: http://danielpataki.com
 * License: GPL2
 */

/*------------------------------------*\
    Custom Post Types
\*------------------------------------*/
// Create 1 Custom Post type for a Demo, called HTML5-Blank

function create_post_type_events()
{
    register_taxonomy_for_object_type('category', 'events'); // Register Taxonomies for Category
    register_taxonomy_for_object_type('post_tag', 'events');
    register_post_type('events', // Register Custom Post Type
        array(
        'labels' => array(
            'name' => __('Events', 'html5blank'), // Rename these to suit
            'singular_name' => __('Event', 'html5blank'),
            'add_new' => __('Add New', 'html5blank'),
            'add_new_item' => __('Add New Event', 'html5blank'),
            'edit' => __('Edit', 'html5blank'),
            'edit_item' => __('Edit Event', 'html5blank'),
            'new_item' => __('New Event', 'html5blank'),
            'view' => __('View Event', 'html5blank'),
            'view_item' => __('View Event', 'html5blank'),
            'search_items' => __('Search Events', 'html5blank'),
            'not_found' => __('No Events found', 'html5blank'),
            'not_found_in_trash' => __('No Events found in Trash', 'html5blank')
        ),
        'public' => true,
        'hierarchical' => true, // Allows your posts to behave like Hierarchy Pages
        'has_archive' => true,
        'supports' => array(
            'title',
            'editor',
            //'excerpt',
            //'thumbnail'
        ), // Go to Dashboard Custom HTML5 Blank post for supports
        'menu_icon' => 'dashicons-calendar',
        'can_export' => true, // Allows export in Tools > Export
        'taxonomies' => array(
            'post_tag',
            'category'
        ) // Add Category and Post Tags support
    ));
}

add_action('init', 'create_post_type_events'); // Add our News Custom Post Type

//Load template in the plugin folder for events
//https://codex.wordpress.org/Plugin_API/Filter_Reference/single_template

function tk_events_single_temple($single_template) {
     global $post;

     if ($post->post_type == 'events') {
          $single_template = dirname( __FILE__ ) . '/single-events.php';
     }
     return $single_template;
}

function tk_events_archive_temple($archive_template) {
     global $post;

     if ($post->post_type == 'events') {
          $archive_template = dirname( __FILE__ ) . '/archive-events.php';
     }
     return $archive_template;
}

add_filter( 'single_template', 'tk_events_single_temple' );
add_filter( 'archive_template', 'tk_events_archive_temple' );
