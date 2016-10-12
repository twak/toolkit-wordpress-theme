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

    TODO: let the user choose what fields go in the table
    Create alternative layout and display by category
    Create order by header in table layout

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

// 'conditional_logic' => array (
//                 array (
//                     array (
//                         'field' => 'field_57fcfafe8a820',
//                         'operator' => '==',
//                         'value' => 'red',
//                     ),
//                 ),
//             ),

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
                'instructions' => 'Add a custom title to the profiles list page. If left blank the title of the page will be "Profiles".',
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
                'type' => 'wysiwyg',
                'instructions' => 'Add an introduction at the top of the profiles list page.',
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
            array (
                'key' => 'field_tk_profiles_page_settings_template',
                'label' => 'Page Template',
                'name' => 'tk_profiles_page_settings_template',
                'type' => 'select',
                'instructions' => 'Select the layout of the profiles list page.',
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
                ),                       
            ),
            array ( //Archived profiles cat option
                'key' => 'field_tk_profiles_page_settings_template_image',
                'label' => 'Show image in the table',
                'name' => 'tk_profiles_page_settings_template_image',
                'type' => 'checkbox',
                'instructions' => 'Ticking this box will show profile images on profiles list page.',
                'required' => 0,
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_profiles_page_settings_template',
                            'operator' => '==',
                            'value' => 'table_layout',
                        ),
                    ),
                ),
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
                    'show_images'   => 'Show images'
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

///single setting

if( function_exists('acf_add_local_field_group') ) {

     acf_add_local_field_group(array (
        'key' => 'group_tk_profiles_single_settings',
        'title' => 'Single event page settings',
        'fields' => array (
            array (
                'key' => 'field_tk_profiles_single_settings_related',
                'label' => 'Related profiles',
                'name' => 'tk_profiles_single_settings_related',
                'type' => 'checkbox',
                'instructions' => 'Ticking this box will make profiles related by category appear at the bottom of every profile page.',
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
                    'show_related'   => 'Show related profiles on the profile page'
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
 * Profile Single Fields
 */

if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array (
    'key' => 'group_tk_profiles_single_fields',
    'title' => 'Profile Facts',
    'fields' => array (
        array (
            'key' => 'field_tk_profiles_title',
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
            'key' => 'field_tk_profiles_first_name',
            'label' => 'First name',
            'name' => 'tk_profiles_first_name',
            'type' => 'text',
            'instructions' => '',
            'required' => 1,
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
            'key' => 'field_tk_profiles_last_name',
            'label' => 'Last name',
            'name' => 'tk_profiles_last_name',
            'type' => 'text',
            'instructions' => '',
            'required' => 1,
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
            'key' => 'field_tk_profiles_email',
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
            'key' => 'field_tk_profiles_telephone',
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
            'key' => 'field_tk_profiles_faculty',
            'label' => 'Faculty',
            'name' => 'tk_profiles_faculty',
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
            'key' => 'field_tk_profiles_school',
            'label' => 'School',
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
            'key' => 'field_tk_profiles_job_title',
            'label' => 'Job title',
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
            'key' => 'field_tk_profiles_location',
            'label' => 'Location',
            'name' => 'tk_profiles_location',
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
            'key' => 'field_tk_profiles_external_link',
            'label' => 'External Profile Link',
            'name' => 'tk_profiles_external_link',
            'type' => 'url',
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
        // Key facts
        array(
            'key' => 'field_tk_profiles_key_facts',
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
                    'key' => 'field_tk_profiles_key_facts_label',
                    'label' => 'Label',
                    'name' => 'tk_profiles_key_facts_label',
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
                    'key' => 'field_tk_profiles_key_facts_info',
                    'label' => 'Information',
                    'name' => 'tk_profiles_key_facts_info',
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

/* External profile */

if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array (
    'key' => 'group_tk_profiles_external_link_flag',
    'title' => 'External profile',
    'fields' => array (
        array(
            'key' => 'field_tk_profiles_external_link_flag',
            'label' => '',
            'name' => 'tk_profiles_external_link_flag',
            'type' => 'checkbox',
            'instructions' => 'Ticking this box will make this profile link to the external profile.',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ) ,                
            'choices' => array(
                'external_link'   => 'Make this profile external'
            ),

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

function flush_rules_tk_profiles() {
    create_post_type_tk_profiles();
    flush_rewrite_rules();
}

register_activation_hook( __FILE__, 'flush_rules_tk_profiles' );