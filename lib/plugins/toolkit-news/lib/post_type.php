<?php
/**
 * Adds custom post type and taxonomies for Toolkit News Plugin
 */

if ( ! class_exists( 'tk_news_post_type' ) ) {

    class tk_news_post_type
    {

        /* register all hooks with wordpress API */
        public static function register()
        {

            /**
             * Add News Post Type taxonomies
             */
            add_action( 'init', array( __CLASS__, 'create_taxonomy' ), 9 );

            /**
             * Add News Custom Post Type
             */
            add_action('init', array( __CLASS__, 'create_post_type' ), 10 );
        }

        /**
         * Creates news taxonomies
         */
        public static function create_taxonomy()
        {
            register_taxonomy('news_category', array('news'), array(
                'hierarchical' => true,
                'labels' => array(
                    'name' => 'News Categories',
                    'singular_name' => 'News Category',
                    'search_items' => 'Search News Categories',
                    'all_items' => 'All News Categories',
                    'parent_item' => 'Parent News Category',
                    'parent_item_colon' => 'Parent News Category:',
                    'edit_item' => 'Edit News Category', 
                    'update_item' => 'Update News Category',
                    'add_new_item' => 'Add New News Category',
                    'new_item_name' => 'New News Category',
                    'menu_name' => 'News Categories'
                ),
                'show_ui' => true,
                'query_var' => true,
                'rewrite' => array(
                    'slug' => 'news_category',
                    'with_front' => false
                )
            ) );
            register_taxonomy('news_tag', array('news'), array(
                'hierarchical' => false,
                'labels' => array(
                    'name' => 'News Tags',
                    'singular_name' => 'News Tag',
                    'search_items' => 'Search News Tags',
                    'all_items' => 'All News Tags',
                    'parent_item' => null,
                    'parent_item_colon' => null,
                    'edit_item' => 'Edit News Tag', 
                    'update_item' => 'Update News Tag',
                    'add_new_item' => 'Add New News Tag',
                    'new_item_name' => 'New News Tag',
                    'menu_name' => 'News Tags'
                ),
                'show_ui' => true,
                'query_var' => true,
                'rewrite' => array(
                    'slug' => 'news_tag',
                    'with_front' => false
                )
            ) );
        }

        /**
         * Add News Custom Post Type
         * called with the 'init' action
         */
        public static function create_post_type()
        {
            register_post_type( 'news', array(
                'labels' => array(
                    'name' => 'News',
                    'singular_name' => 'News',
                    'add_new' => 'Add New',
                    'add_new_item' => 'Add New News',
                    'edit' => 'Edit',
                    'edit_item' => 'Edit News',
                    'new_item' => 'New News',
                    'view' => 'View News',
                    'view_item' => 'View News',
                    'search_items' => 'Search News',
                    'not_found' => 'No News found',
                    'not_found_in_trash' => 'No News found in the Bin'
                ) ,
                'public' => true,
                'hierarchical' => false,
                'has_archive' => true,
                'supports' => array(
                    'title',
                    'editor',
                    'excerpt',
                    'thumbnail'
                ) ,
                'menu_icon' => 'dashicons-testimonial',
            ));
        }
    }
    tk_news_post_type::register();
}
