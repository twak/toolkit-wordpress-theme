<?php
/**
 * Plugin Name: Toolkit Profiles
 * Plugin URI: http://toolkit.leeds.ac.uk/wordpress
 * Description: This plugin adds toolkit profiles.
 * Version: 1.0.0
 * Author: Web Team
 * Author URI: http://toolkit.leeds.ac.uk/wordpress
 * License: GPL2
 */

/**
 * Profile Post Types
 */

function create_post_type_tk_profiles() {
    register_taxonomy_for_object_type('category', 'profiles'); // Register Taxonomies for Category
    register_taxonomy_for_object_type('post_tag', 'profiles');
    register_post_type('profiles', // Register Custom Post Type
        array(
        'labels' => array(
            'name' => __('Profiles', 'html5blank'), // Rename these to suit
            'singular_name' => __('Profile', 'html5blank'),
            'add_new' => __('Add New', 'html5blank'),
            'add_new_item' => __('Add New Profile', 'html5blank'),
            'edit' => __('Edit', 'html5blank'),
            'edit_item' => __('Edit Profile', 'html5blank'),
            'new_item' => __('New Profile', 'html5blank'),
            'view' => __('View Profile', 'html5blank'),
            'view_item' => __('View Profile', 'html5blank'),
            'search_items' => __('Search Profiles', 'html5blank'),
            'not_found' => __('No Profile found', 'html5blank'),
            'not_found_in_trash' => __('No Profile found in Trash', 'html5blank')
        ),
        'public' => true,
        'hierarchical' => true, // Allows your posts to behave like Hierarchy Pages
        'has_archive' => true,
        'supports' => array(
            'title',
            'editor',
            //'excerpt',
            'thumbnail'
        ),
        'menu_icon' => 'dashicons-admin-users',
        'can_export' => true, // Allows export in Tools > Export
        'taxonomies' => array(
            //'post_tag',
            'category'
        ) // Add Category and Post Tags support
    ));
}

add_action('init', 'create_post_type_tk_profiles'); // Add profiles Custom Post Type

/**
 * Add in profiles templates (single and archive)
 */

// https://codex.wordpress.org/Plugin_API/Filter_Reference/single_template

function tk_profiles_single_temple($single_template) {
    global $post;
    if ($post->post_type == 'profiles') {
        $single_template = dirname(__FILE__) . '/single-profiles.php';
    }

    return $single_template;
}

function tk_profiles_archive_temple($archive_template) {
    global $post;
    if ($post->post_type == 'profiles') {
        $archive_template = dirname(__FILE__) . '/archive-profiles.php';
    }

    return $archive_template;
}

add_filter('single_template', 'tk_profiles_single_temple');
add_filter('archive_template', 'tk_profiles_archive_temple');

/**
 * Create AFC profiles settings page
 */

if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'Profiles Settings',
        'menu_title' => 'Profiles Settings',
        'menu_slug' => 'tk-profiles-settings',
        'capability' => 'edit_posts',
        'redirect' => false,
        'parent_slug' => 'edit.php?post_type=profiles',
    ));
}

/**
 * Profiles Page Settings Fields
 */

if( function_exists('acf_add_local_field_group') ){

    acf_add_local_field_group(array (
        'key' => 'group_tk_profiles_page_settings',
        'title' => 'Profile Page Settings',
        'fields' => array (
            array (
                'key' => 'field_tk_profiles_page_settings_title',
                'label' => 'Page Title',
                'name' => 'tk_profiles_page_settings_title',
                'type' => 'text',
                'instructions' => 'Add a custom title to the profiles page. If left blank the title of the page will be "Profiles".',
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
            array (
                'key' => 'field_tk_profiles_page_settings_introduction',
                'label' => 'Page Introduction',
                'name' => 'tk_profiles_page_settings_introduction',
                'type' => 'textarea',
                'instructions' => 'Add and introduction at the top of the profiles page.',
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
            array (
                'key' => 'field_tk_profiles_page_settings_template',
                'label' => 'Page Template',
                'name' => 'tk_profiles_page_settings_template',
                'type' => 'radio',
                'instructions' => 'Choose to show the profiles in a table or a box layout.',
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
                    'table_layout'   => 'Table layout',
                    'img_layout'   => 'Image layout'
                ),                       
            ),
        ),
        'location' => array (
            array (
                array (
                    'param' => 'options_page',
                    'operator' => '==',
                    'value' => 'tk-profiles-settings',
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
 * Profiles Single Settings
 */
if(0){ //currently nill
//if( function_exists('acf_add_local_field_group') ){

    acf_add_local_field_group(array (
        'key' => 'group_tk_profiles_single_settings',
        'title' => 'Profile Page Settings',
        'fields' => array (
            array (
                'key' => 'field_tk_profiles_single_settings_title',
                'label' => 'Page Title',
                'name' => 'tk_profiles_single_settings_title',
                'type' => 'text',
                'instructions' => 'Add a custom title to the profiles page. If left blank the title of the page will be "Profiles".',
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
                    'value' => 'tk-profiles-settings',
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
 * Profile Single Fields
 */

if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array (
    'key' => 'group_tk_profiles_single_fields',
    'title' => 'Profile Facts',
    'fields' => array (
        array (
            'key' => 'field_573c438c66ffa',
            'label' => 'Title',
            'name' => 'tk_profiles_title',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array (
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
            'readonly' => 0,
            'disabled' => 0,
        ),
        array (
            'key' => 'field_573c3c1e45aca',
            'label' => 'First Name',
            'name' => 'tk_profiles_first_name',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array (
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
            'readonly' => 0,
            'disabled' => 0,
        ),
        array (
            'key' => 'field_573c41219d2ff',
            'label' => 'Surname',
            'name' => 'tk_profiles_surname',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array (
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
            'readonly' => 0,
            'disabled' => 0,
        ),
        array (
            'key' => 'field_573c439766ffb',
            'label' => 'Role',
            'name' => 'tk_profiles_role',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array (
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
            'readonly' => 0,
            'disabled' => 0,
        ),
        array (
            'key' => 'field_573c43a866ffc',
            'label' => 'Job Title',
            'name' => 'tk_profiles_job_title',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array (
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
            'readonly' => 0,
            'disabled' => 0,
        ),
        array (
            'key' => 'field_573c43b966ffd',
            'label' => 'Email',
            'name' => 'tk_profiles_email',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array (
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
            'readonly' => 0,
            'disabled' => 0,
        ),
        array (
            'key' => 'field_573c44a284a1f',
            'label' => 'Telephone',
            'name' => 'tk_profiles_telephone',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array (
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
            'readonly' => 0,
            'disabled' => 0,
        ),
        array (
            'key' => 'field_573c48dce60cd',
            'label' => 'School/Faculty',
            'name' => 'tk_profiles_school',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array (
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
            'readonly' => 0,
            'disabled' => 0,
        ),
        array (
            'key' => 'field_5746d56a1d9a7',
            'label' => 'External Profile Link',
            'name' => 'tk_profiles_external_link',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array (
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => 'http://',
            'append' => '',
            'maxlength' => '',
            'readonly' => 0,
            'disabled' => 0,
        ),
        // Key facts
        array(
            'key' => 'field_573b2bba9ce96',
            'label' => 'Key facts',
            'name' => 'tk_profiles_key_facts',
            'type' => 'repeater',
            'instructions' => 'Add any profiles details e.g. Course: BA Maths',
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
    ),
    'location' => array (
        array (
            array (
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'profiles',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'acf_after_title',
    'style' => 'default',
    'label_placement' => 'left',
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

function flush_rules_tk_profiles() {
    create_post_type_tk_profiles();
    flush_rewrite_rules();
}

register_activation_hook( __FILE__, 'flush_rules_tk_profiles' );