<?php
/**
 * Plugin Name: Toolkit Profiles
 * Plugin URI: http://toolkit.leeds.ac.uk/wordpress
 * Description: This plugin adds toolkit profiles.
 * Version: 1.0.2
 * Author: Web Team
 * Author URI: http://toolkit.leeds.ac.uk/wordpress
 * License: GPL2
 */

/**
 * Add profiles Post Type taxonomy
 * added with priority LESS THAN post type registration
 * to ensure the rewrite slug is not overwritten
 */
add_action('init', 'create_taxonomy_tk_profiles', 9);

function create_taxonomy_tk_profiles()
{
    register_taxonomy('profile_category', array('profiles'), array(
        'hierarchical' => true,
        'labels' => array(
            'name' => 'Profile Categories',
            'singular_name' => 'Profile Category',
            'search_items' => 'Search Profile Categories',
            'all_items' => 'All Profile Categories',
            'parent_item' => 'Parent Profile Category',
            'parent_item_colon' => 'Parent Profile Category:',
            'edit_item' => 'Edit Profile Category', 
            'update_item' => 'Update Profile Category',
            'add_new_item' => 'Add New Profile Category',
            'new_item_name' => 'New Profile Category',
            'menu_name' => 'Profile Categories'
        ),
        'show_ui' => true,
        'query_var' => true,
        'rewrite' => array(
            'slug' => 'profile_type',
            'with_front' => false
        )
    ) );
}


/**
 * Add profiles Custom Post Type
 * added with priority GREATER THAN taxonomy registration
 * to ensure the rewrite slug is not overwritten
 */
add_action('init', 'create_post_type_tk_profiles');

function create_post_type_tk_profiles() {
    register_post_type('profiles', // Register Custom Post Type
        array(
        'labels' => array(
            'name' => 'Profiles', 
            'singular_name' => 'Profile',
            'add_new' => 'Add New',
            'add_new_item' => 'Add New Profile',
            'edit' => 'Edit',
            'edit_item' => 'Edit Profile',
            'new_item' => 'New Profile',
            'view' => 'View Profile',
            'view_item' => 'View Profile',
            'search_items' => 'Search Profiles',
            'not_found' => 'No Profile found',
            'not_found_in_trash' => 'No Profile found in Trash', 
        ),
        'public' => true,
        'hierarchical' => true,
        'has_archive' => true,
        'supports' => array(
            'title',
            'editor',
            'thumbnail'
        ),
        'rewrite' => array(
            'slug' => 'profiles',
            'with_front' => false
        ),
        'menu_icon' => 'dashicons-admin-users',
        'can_export' => true
    ));
}

/**
 * Add in profiles templates (single and archive)
 */

// https://codex.wordpress.org/Plugin_API/Filter_Reference/single_template

function tk_profiles_single_temple($single_template) {
    global $post;
    if ($post->post_type == 'profiles' || is_tax( 'profile_category') ) {
        $single_template = dirname(__FILE__) . '/single-profiles.php';
    }
    return $single_template;
}

function tk_profiles_archive_temple($archive_template) {
    global $post;
    if ($post->post_type == 'profiles' || is_tax( 'profile_category') ) {
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
 * ACF Fields
 */

if( function_exists('acf_add_local_field_group') ) {

    /**
     * Profile page settings (title and intro)
     */
    acf_add_local_field_group(array (
        'key' => 'group_tk_profiles_page_settings',
        'title' => 'Profile Page Settings',
        'fields' => array (
            array (//Custom title
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
            array (//Profiles page intro
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

    /**
     * Archive Profile page display settings
     */
    acf_add_local_field_group(array (
        'key' => 'tk_group_profiles_display',
        'title' => 'Profiles Display',
        'fields' => array (
            array (
                'key' => 'field_tk_profile_display',
                'label' => 'Profile Display',
                'name' => 'tk_profile_display',
                'type' => 'select',
                'instructions' => '',
                'required' => 1,
                'conditional_logic' => 0,
                'wrapper' => array (
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'choices' => array (
                    'all' => 'Display all profiles in a single page',
                    'by_cat' => 'Display profiles by category',
                ),
                'default_value' => array (
                ),
                'allow_null' => 1,
                'multiple' => 0,
                'ui' => 0,
                'ajax' => 0,
                'return_format' => 'value',
                'placeholder' => '',
            ),
            array (
                'key' => 'field_tk_profile_by_category_rules',
                'label' => 'Profile Display (by category) rules',
                'name' => 'tk_profile_display_by_category',
                'type' => 'repeater',
                'instructions' => 'Select the desired layout options for each profile category',
                'required' => 0,
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_profile_display',
                            'operator' => '==',
                            'value' => 'by_cat',
                        ),
                    ),
                ),
                'wrapper' => array (
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'collapsed' => '',
                'min' => '',
                'max' => '',
                'layout' => 'table',
                'button_label' => 'Add Rule',
                'sub_fields' => array (
                    array (
                        'key' => 'field_tk_profile_category',
                        'label' => 'Category',
                        'name' => 'profile_category',
                        'type' => 'taxonomy',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'taxonomy' => 'profile_category',
                        'field_type' => 'select',
                        'allow_null' => 0,
                        'add_term' => 0,
                        'save_terms' => 0,
                        'load_terms' => 0,
                        'return_format' => 'id',
                        'multiple' => 0,
                    ),
                    array (
                        'key' => 'field_tk_category_layout',
                        'label' => 'Layout',
                        'name' => 'category_layout',
                        'type' => 'radio',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'choices' => array (
                            'table_layout' => 'Table Layout',
                            'card_layout' => 'Card Layout',
                        ),
                        'allow_null' => 0,
                        'other_choice' => 0,
                        'save_other_choice' => 0,
                        'default_value' => 'table',
                        'layout' => 'vertical',
                        'return_format' => 'value',
                    ),
                    array (
                        'key' => 'field_tk_category_order',
                        'label' => 'Order',
                        'name' => 'category_order',
                        'type' => 'radio',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'choices' => array (
                            'alphabetical' => 'Alphabetical by surname',
                            'menu_order' => 'Profile order',
                        ),
                        'allow_null' => 0,
                        'other_choice' => 0,
                        'save_other_choice' => 0,
                        'default_value' => 'alphabetical',
                        'layout' => 'vertical',
                        'return_format' => 'value',
                    ),
                    array (
                        'key' => 'field_tk_category_image',
                        'label' => 'Show Image (table layout only)',
                        'name' => 'category_image',
                        'type' => 'true_false',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => array (
                            array (
                                array (
                                    'field' => 'field_5825ec2315f16',
                                    'operator' => '==',
                                    'value' => 'table',
                                ),
                            ),
                        ),
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'message' => '',
                        'default_value' => 0,
                    ),
                ),
            ),
            array (
                'key' => 'field_tk_profiles_page_settings_template',
                'label' => 'Layout',
                'name' => 'tk_profiles_page_settings_template',
                'type' => 'select',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_profile_display',
                            'operator' => '==',
                            'value' => 'all',
                        ),
                    ),
                ),
                'wrapper' => array (
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'choices' => array (
                    'table_layout' => 'Table Layout',
                    'card_layout' => 'Card Layout',
                ),
                'default_value' => array (
                    0 => 'table_layout',
                ),
                'allow_null' => 0,
                'multiple' => 0,
                'ui' => 0,
                'ajax' => 0,
                'return_format' => 'value',
                'placeholder' => '',
            ),
            array (
                'key' => 'field_tk_profiles_page_settings_template_image',
                'label' => 'Show images in tables',
                'name' => 'tk_profiles_page_settings_template_image',
                'type' => 'true_false',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_profile_display',
                            'operator' => '==',
                            'value' => 'all',
                        ),
                        array (
                            'field' => 'field_tk_profiles_page_settings_template',
                            'operator' => '==',
                            'value' => 'table_layout',
                        ),
                    ),
                    array (
                        array (
                            'field' => 'field_tk_profile_display',
                            'operator' => '==',
                            'value' => 'by_cat',
                        ),
                    ),
                ),
                'wrapper' => array (
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'message' => '',
                'default_value' => 0,
            ),
            array (
                'key' => 'field_tk_profiles_page_settings_profiles_order',
                'label' => 'Profiles order',
                'name' => 'tk_profiles_page_settings_profiles_order',
                'type' => 'select',
                'instructions' => 'Select to order profiles by alphabetically or category.',
                'required' => 0,
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_profile_display',
                            'operator' => '==',
                            'value' => 'all',
                        ),
                    ),
                ),
                'wrapper' => array (
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'choices' => array (
                    'alphabetical' => 'Alphabetical by surname',
                    'menu_order' => 'Profile order',
                    'alphabetical_category' => 'Alphabetical by surname (grouped by category)',
                    'menu_order_category' => 'Profile order (grouped by category)',
                ),
                'default_value' => array (
                    0 => 'alphabetical',
                ),
                'allow_null' => 0,
                'multiple' => 0,
                'ui' => 0,
                'ajax' => 0,
                'return_format' => 'value',
                'placeholder' => '',
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

    /**
     * Single profile page display settings
     */
    acf_add_local_field_group(array (
        'key' => 'group_tk_profiles_single_settings',
        'title' => 'Single profile page settings',
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

    /**
     * Single Profile Post Fields
     */
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


    /**
     * External link profile
     */


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

}


/**
 * Flush rewrite rules when creating new post type
 */

//https://paulund.co.uk/flush-permalinks-custom-post-type

function flush_rules_tk_profiles() {
    create_post_type_tk_profiles();
    flush_rewrite_rules();
}

register_activation_hook( __FILE__, 'flush_rules_tk_profiles' );