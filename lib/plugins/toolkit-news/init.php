<?php
/**
 * Plugin Name: Toolkit News
 * Plugin URI: http://toolkit.leeds.ac.uk/wordpress
 * Description: This plugin adds toolkit news
 * Version: 1.0.0
 * Author: Web Team
 * Author URI: http://toolkit.leeds.ac.uk/wordpress
 * License: GPL2
 */

/**
 * News Post Types
 */

/* TODO:

    Create featured news functionality

*/

function create_post_type_tk_news(){
    register_taxonomy_for_object_type('category', 'news'); // Register Taxonomies for Category
    register_taxonomy_for_object_type('post_tag', 'news');
    register_post_type('news', // Register Custom Post Type
    array(
        'labels' => array(
            'name' => __('News', 'html5blank') , // Rename these to suit
            'singular_name' => __('News', 'html5blank') ,
            'add_new' => __('Add New', 'html5blank') ,
            'add_new_item' => __('Add New News', 'html5blank') ,
            'edit' => __('Edit', 'html5blank') ,
            'edit_item' => __('Edit News', 'html5blank') ,
            'new_item' => __('New News', 'html5blank') ,
            'view' => __('View News', 'html5blank') ,
            'view_item' => __('View News', 'html5blank') ,
            'search_items' => __('Search News', 'html5blank') ,
            'not_found' => __('No News found', 'html5blank') ,
            'not_found_in_trash' => __('No News found in Trash', 'html5blank')
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
        'menu_icon' => 'dashicons-admin-page',
        'can_export' => true, // Allows export in Tools > Export
        'taxonomies' => array(
            'post_tag',
            'category'
        ) // Add Category and Post Tags support
    ));
}

add_action('init', 'create_post_type_tk_news'); // Add our News Custom Post Type

/**
 * Show Custom Post Types in Category Archive Page
 */

function show_news_archives( $query ) {
    if( is_category() || is_tag() && empty( $query->query_vars['suppress_filters'] ) ) {
        $query->set( 'post_type', array(
            'post', 'nav_menu_item', 'news'
        ));
        return $query;
    }
}
add_filter( 'pre_get_posts', 'show_news_archives' );

/**
 * Add in news templates
 */

// https://codex.wordpress.org/Plugin_API/Filter_Reference/single_template

function tk_news_single_temple($single_template) { //single template
    global $post;
    if ($post->post_type == 'news') {
        $single_template = dirname(__FILE__) . '/single-news.php';
    }

    return $single_template;
}

add_filter('single_template', 'tk_News_single_temple');

function tk_news_archive_temple($archive_template) { //archive template
    global $post;
    if ($post->post_type == 'news') {
        $archive_template = dirname(__FILE__) . '/archive-news.php';
    }

    return $archive_template;
}

add_filter('archive_template', 'tk_news_archive_temple');

/**
 * AFC Register News settings page
 */

if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'News Settings',
        'menu_title' => 'News Settings',
        'menu_slug' => 'tk-news-settings',
        'capability' => 'edit_posts',
        'redirect' => false,
        'parent_slug' => 'edit.php?post_type=news',
    ));
}

/**
 * News settings option page field
 */

if( function_exists('acf_add_local_field_group') ) {

    // General news option page

    acf_add_local_field_group(array (
        'key' => 'group_tk_news_page_settings',
        'title' => 'News page settings',
        'fields' => array (
            array ( //page intro
                'key' => 'field_tk_news_page_settings_introduction',
                'label' => 'Page introduction',
                'name' => 'tk_news_page_settings_introduction',
                'type' => 'wysiwyg',
                'instructions' => 'Add an introduction to the top of the news page.',
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
                    'value' => 'tk-news-settings',
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
        'key' => 'group_tk_news_single_settings',
        'title' => 'Single news page settings',
        'fields' => array (
            array (
                'key' => 'field_tk_news_single_settings_related',
                'label' => 'Related news',
                'name' => 'tk_news_single_settings_related',
                'type' => 'checkbox',
                'instructions' => 'Ticking this box will make news related by category appear at the bottom of every news page.',
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
                    'show_related'   => 'Show related news on the news page'
                ),
            ),           
        ),
        'location' => array (
            array (
                array (
                    'param' => 'options_page',
                    'operator' => '==',
                    'value' => 'tk-news-settings',
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

/* Featured news */

// if( function_exists('acf_add_local_field_group') ):

// acf_add_local_field_group(array (
//     'key' => 'group_tk_news_featured',
//     'title' => 'Featured News',
//     'fields' => array (
//         array(
//             'key' => 'field_tk_news_featured',
//             'label' => '',
//             'name' => 'tk_news_featured',
//             'type' => 'checkbox',
//             'instructions' => 'Ticking this box will make this news appear at the top of the list on the news page.',
//             'required' => 0,
//             'conditional_logic' => 0,
//             'wrapper' => array(
//                 'width' => '',
//                 'class' => '',
//                 'id' => '',
//             ) ,                
//             'choices' => array(
//                 'featured_news'   => 'Make this news featured'
//             ),

//         ) ,
//     ),
//     'location' => array (
//         array (
//             array (
//                 'param' => 'post_type',
//                 'operator' => '==',
//                 'value' => 'news',
//             ),
//         ),
//     ),
//     'menu_order' => 0,
//     'position' => 'side',
//     'style' => 'default',
//     'label_placement' => 'top',
//     'instruction_placement' => 'label',
//     'hide_on_screen' => '',
//     'active' => 1,
//     'description' => '',
// ));

// endif;

/**
 * Flush rewrite rules when creating new post type
 */

//https://paulund.co.uk/flush-permalinks-custom-post-type

function flush_rules_tk_news() {
    create_post_type_tk_news();
    flush_rewrite_rules();
}

register_activation_hook( __FILE__, 'flush_rules_tk_news' );