<?php
/**
 * Plugin Name: Toolkit Events
 * Plugin URI: http://toolkit.leeds.ac.uk/wordpress
 * Description: This plugin adds toolkit events
 * Version: 1.0.0
 * Author: Web Team
 * Author URI: http://toolkit.leeds.ac.uk/wordpress
 * License: GPL2
 */

/**
 * Event Post Types
 */

function create_post_type_tk_events(){
    register_taxonomy_for_object_type('category', 'events'); // Register Taxonomies for Category
    register_taxonomy_for_object_type('post_tag', 'events');
    register_post_type('events', // Register Custom Post Type
    array(
        'labels' => array(
            'name' => __('Events', 'html5blank') , // Rename these to suit
            'singular_name' => __('Event', 'html5blank') ,
            'add_new' => __('Add New', 'html5blank') ,
            'add_new_item' => __('Add New Event', 'html5blank') ,
            'edit' => __('Edit', 'html5blank') ,
            'edit_item' => __('Edit Event', 'html5blank') ,
            'new_item' => __('New Event', 'html5blank') ,
            'view' => __('View Event', 'html5blank') ,
            'view_item' => __('View Event', 'html5blank') ,
            'search_items' => __('Search Events', 'html5blank') ,
            'not_found' => __('No Events found', 'html5blank') ,
            'not_found_in_trash' => __('No Events found in Trash', 'html5blank')
        ) ,
        'public' => true,
        'hierarchical' => true, // Allows your posts to behave like Hierarchy Pages
        'has_archive' => true,
        'supports' => array(
            'title',
            'editor',
            'excerpt',
            'thumbnail'

        ) ,
        'menu_icon' => 'dashicons-calendar',
        'can_export' => true, // Allows export in Tools > Export
        'taxonomies' => array(
            'post_tag',
            'category'
        ) // Add Category and Post Tags support
    ));
}

add_action('init', 'create_post_type_tk_events'); // Add our Events Custom Post Type

/**
 * Add in event templates (single and archive)
 */

// https://codex.wordpress.org/Plugin_API/Filter_Reference/single_template

function tk_events_single_temple($single_template) {
    global $post;
    if ($post->post_type == 'events') {
        $single_template = dirname(__FILE__) . '/single-events.php';
    }

    return $single_template;
}

function tk_events_archive_temple($archive_template) {
    global $post;
    if ($post->post_type == 'events') {
        $archive_template = dirname(__FILE__) . '/archive-events.php';
    }

    return $archive_template;
}

add_filter('single_template', 'tk_events_single_temple');
add_filter('archive_template', 'tk_events_archive_temple');

/**
 * AFC Register events settings page
 */

if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'Events Settings',
        'menu_title' => 'Events Settings',
        'menu_slug' => 'tk-events-settings',
        'capability' => 'edit_posts',
        'redirect' => false,
        'parent_slug' => 'edit.php?post_type=events',
    ));
}

/**
 * Events settings page field
 */

if( function_exists('acf_add_local_field_group') ) {

    // General events page

    acf_add_local_field_group(array (
        'key' => 'group_tk_events_page_settings',
        'title' => 'Events Page Settings',
        'fields' => array (
            array (
                'key' => 'field_tk_events_page_settings_introduction',
                'label' => 'Page Introduction',
                'name' => 'tk_events_page_settings_introduction',
                'type' => 'textarea',
                'instructions' => 'Add and introduction at the top of the events page.',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array (
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'placeholder' => '',
                'maxlength' => '',
                'rows' => '',
                'new_lines' => 'wpautop',
                'readonly' => 0,
                'disabled' => 0,
            ),           
        ),
        'location' => array (
            array (
                array (
                    'param' => 'options_page',
                    'operator' => '==',
                    'value' => 'tk-events-settings',
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

if( function_exists('acf_add_local_field_group') ) {

     acf_add_local_field_group(array (
        'key' => 'group_tk_events_single_settings',
        'title' => 'Single Event Page Settings',
        'fields' => array (
            array (
                'key' => 'field_tk_events_page_settings_introduction2',
                'label' => 'Related Events',
                'name' => 'tk_events_single_settings_introduction',
                'type' => 'checkbox',
                'instructions' => 'Ticking this box will make related events appear at the bottom of every event page',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array (
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'placeholder' => '',
                'maxlength' => '',
                'rows' => '',
                'new_lines' => 'wpautop',
                'readonly' => 0,
                'disabled' => 0,
                'choices' => array(
                    'featured_event'   => 'Show related events on the event page'
                ),
            ),           
        ),
        'location' => array (
            array (
                array (
                    'param' => 'options_page',
                    'operator' => '==',
                    'value' => 'tk-events-settings',
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

/* Individual Events Fields */

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
        'key' => 'group_573b2bb55e19a',
        'title' => 'Event Details',
        'fields' => array(
            array(
                'key' => 'field_5746ca6da83c2',
                'label' => 'Start Date',
                'name' => 'event_start_date',
                'type' => 'date_picker',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '50%',
                    'class' => '',
                    'id' => '',
                ) ,
                'display_format' => 'd/m/Y',
                'return_format' => 'F j, Y',
                'first_day' => 1,
            ) ,
            array(
                'key' => 'field_5746cbd687b16',
                'label' => 'End Date',
                'name' => 'event_end_date',
                'type' => 'date_picker',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '50%',
                    'class' => '',
                    'id' => '',
                ) ,
                'display_format' => 'd/m/Y',
                'return_format' => 'd/m/Y',
                'first_day' => 1,
            ) ,           
            array(
                'key' => 'field_573b2bba9ce92',
                'label' => 'Key facts',
                'name' => 'key_facts',
                'type' => 'repeater',
                'instructions' => 'Add any event details e.g. Location: Parkinson Building',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ) ,
                'collapsed' => '',
                'min' => '',
                'max' => '',
                'layout' => 'table',
                'button_label' => 'Add key facts',
                'sub_fields' => array(
                    array(
                        'key' => 'field_573b2f3b9ce93',
                        'label' => 'Label',
                        'name' => 'key_facts_label',
                        'type' => 'text',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array(
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ) ,
                        'default_value' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                        'maxlength' => '',
                        'readonly' => 0,
                        'disabled' => 0,
                    ) ,
                    array(
                        'key' => 'field_573b2f679ce94',
                        'label' => 'Information',
                        'name' => 'key_facts_information',
                        'type' => 'text',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array(
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ) ,
                        'default_value' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                        'maxlength' => '',
                        'readonly' => 0,
                        'disabled' => 0,
                    ) ,
                ) ,
            ) ,
            array(
                'key' => 'field_5746ca6da83c7',
                'label' => 'Featured Event',
                'name' => 'event_featured',
                'type' => 'checkbox',
                'instructions' => 'Ticking this box will make this event appear at the top of the list on the events page',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ) ,                
                'choices' => array(
                    'featured_event'   => 'Make this event featured'
                ),
    
            ) ,
        ) ,
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'events',
                ) ,
            ) ,
        ) ,
        'menu_order' => 0,
        'position' => 'acf_after_title',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => 1,
        'description' => '',
    ));
}

/**
 * Flush rewrite rules when creating new post type
 */

//https://paulund.co.uk/flush-permalinks-custom-post-type

function flush_rules_tk_events() {
    create_post_type_tk_events();
    flush_rewrite_rules();
}

register_activation_hook( __FILE__, 'flush_rules_tk_events' );