<?php
/**
 * Plugin Name: Toolkit Events
 * Plugin URI: http://toolkit.leeds.ac.uk/wordpress
 * Description: This plugin adds toolkit events
 * Version: 1.0.1
 * Author: Web Team
 * Author URI: http://toolkit.leeds.ac.uk/wordpress
 * License: GPL2
 */

/* 
 TO DO:
 Make featured events possible

 Make the category for archived events selectable
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
 * Show Custom Post Types in Category Archive Page
 */

function show_events_archives( $query ) {
    if( is_category() || is_tag() && empty( $query->query_vars['suppress_filters'] ) ) {
        $query->set( 'post_type', array(
            'post', 'nav_menu_item', 'events'
        ));
        return $query;
    }
}
add_filter( 'pre_get_posts', 'show_events_archives' );

/**
 * Add in event templates (single and archive and category archived-events)
 */

// https://codex.wordpress.org/Plugin_API/Filter_Reference/single_template

function tk_events_single_temple($single_template) { //single template
    global $post;
    if ($post->post_type == 'events') {
        $single_template = dirname(__FILE__) . '/single-events.php';
    }

    return $single_template;
}

add_filter('single_template', 'tk_events_single_temple');

function tk_events_archive_temple($archive_template) { //archive template
    global $post;
    if ($post->post_type == 'events') {
        $archive_template = dirname(__FILE__) . '/archive-events.php';
    }

    return $archive_template;
}

add_filter('archive_template', 'tk_events_archive_temple');



function category_archived( $template ) {

    if (is_category( 'archived-events' )) {
        $new_template = dirname(__FILE__) . '/category-archived-events.php';
        if ( '' != $new_template ) {
            return $new_template ;
        }
    }

    return $template;
}

add_filter( 'template_include', 'category_archived' );

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
 * Events settings option page field
 */

if( function_exists('acf_add_local_field_group') ) {

    // General events option page

    acf_add_local_field_group(array (
        'key' => 'group_tk_events_page_settings',
        'title' => 'Events page settings',
        'fields' => array (
            array ( //page intro
                'key' => 'field_tk_events_page_settings_introduction',
                'label' => 'Page introduction',
                'name' => 'tk_events_page_settings_introduction',
                'type' => 'wysiwyg',
                'instructions' => 'Add an introduction to the top of the events page.',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array (
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'tabs' => 'all',
                'toolbar' => 'basic',
                'media_upload' => 0,
            ),           
            array ( //Archived events cat option
                'key' => 'field_tk_events_page_settings_archive',
                'label' => 'Archived events',
                'name' => 'tk_events_page_settings_archive',
                'type' => 'checkbox',
                'instructions' => 'Ticking this box will hide events in the \'Archived Events\' category from the events page.',
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
                    'archive_events'   => 'Hide archived events'
                ),                
            ),
            array ( //Archived events cat option
                'key' => 'field_tk_events_page_settings_calendar',
                'label' => 'Calendar view',
                'name' => 'tk_events_page_settings_calendar',
                'type' => 'checkbox',
                'instructions' => 'Ticking this box will show a calendar view on the events page.',
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
                    'show_calendar'   => 'Show calendar view'
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

/**
 * Dynamically populate a list of categories in the page settings
 */

//https://www.advancedcustomfields.com/resources/dynamically-populate-a-select-fields-choices/

function acf_load_color_field_choices( $field ) {
    
    // reset choices
    $field['choices'] = array();

    $choices = array(
        'choice1' => '1', 
        'choice2' => '2', 
        'choice3' => '3'
    );    
    
    // loop through array and add to field 'choices'
    if( is_array($choices) ) {        
        foreach( $choices as $choice ) {            
            $field['choices'][ $choice ] = $choice;            
        }        
    }
    
    // return the field
    return $field;
}

//add_filter('acf/load_field/name=tk_events_single_settings_test', 'acf_load_color_field_choices');

if( function_exists('acf_add_local_field_group') ) {

     acf_add_local_field_group(array (
        'key' => 'group_tk_events_single_settings',
        'title' => 'Single event page settings',
        'fields' => array (
            array (
                'key' => 'field_tk_events_single_settings_related',
                'label' => 'Related Events',
                'name' => 'tk_events_single_settings_related',
                'type' => 'checkbox',
                'instructions' => 'Ticking this box will make events related by category appear at the bottom of every event page.',
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
                    'show_related'   => 'Show related events on the event page'
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
        'key' => 'group_tk_events',
        'title' => 'Event Details',
        'fields' => array(
            array(
                'key' => 'field_tk_events_start_date',
                'label' => 'Event start date',
                'name' => 'tk_events_start_date',
                'type' => 'date_picker',
                'instructions' => '',
                'required' => 1,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '50%',
                    'class' => '',
                    'id' => '',
                ) ,
                'display_format' => 'd/m/Y',
                'return_format' => 'Y-m-d',
                'first_day' => 1,
            ) ,
            array(
                'key' => 'field_tk_events_end_date',
                'label' => 'Event end date',
                'name' => 'tk_events_end_date',
                'type' => 'date_picker',
                'instructions' => '',
                'required' => 1,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '50%',
                    'class' => '',
                    'id' => '',
                ) ,
                'display_format' => 'd/m/Y',
                'return_format' => 'Y-m-d',
                'first_day' => 1,
            ) ,           
            array(
                'key' => 'field_tk_events_key_facts',
                'label' => 'Key facts',
                'name' => 'tk_events_key_facts',
                'type' => 'repeater',
                'instructions' => 'Add event details e.g. Location: Parkinson Building.',
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
                        'key' => 'field_tk_events_key_facts_label',
                        'label' => 'Label',
                        'name' => 'tk_events_key_facts_label',
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
                        'key' => 'field_tk_events_key_facts_information',
                        'label' => 'Information',
                        'name' => 'tk_events_key_facts_information',
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

/* Featured event*/

if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array (
    'key' => 'group_tk_events_featured',
    'title' => 'Featured Event',
    'fields' => array (
        array(
            'key' => 'field_tk_events_featured',
            'label' => '',
            'name' => 'tk_events_featured',
            'type' => 'checkbox',
            'instructions' => 'Ticking this box will make this event appear at the top of the list on the events page.',
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
    ),
    'location' => array (
        array (
            array (
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'events',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'side',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => 1,
    'description' => '',
));

endif;

/**
 * Flush rewrite rules when creating new post type
 */

//https://paulund.co.uk/flush-permalinks-custom-post-type

function flush_rules_tk_events() {
    create_post_type_tk_events();
    flush_rewrite_rules();
}

register_activation_hook( __FILE__, 'flush_rules_tk_events' );