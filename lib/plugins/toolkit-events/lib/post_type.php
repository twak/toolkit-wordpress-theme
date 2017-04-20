<?php
/**
 * Adds custom post type and taxonomies for Toolkit Events Plugin
 */

if ( ! class_exists( 'tk_events_post_type' ) ) {

    class tk_events_post_type
    {

        /* register all hooks with wordpress API */
        public static function register()
        {

            /**
             * Add Events Post Type taxonomies
             * added with priority LESS THAN post type registration
             * to ensure the rewrite slug is not overwritten
             */
            add_action( 'init', array( __CLASS__, 'create_taxonomy' ), 9 );

            /**
             * Add events Custom Post Type
             * added with priority GREATER THAN taxonomy registration
             * to ensure the rewrite slug is not overwritten
             */
            add_action('init', array( __CLASS__, 'create_post_type' ), 10 );
        }

        /**
         * creates event taxonomies
         */
        public static function create_taxonomy()
        {
            register_taxonomy('event_category', array('events'), array(
                'hierarchical' => true,
                'labels' => array(
                    'name' => 'Event Categories',
                    'singular_name' => 'Event Category',
                    'search_items' => 'Search Event Categories',
                    'all_items' => 'All Event Categories',
                    'parent_item' => 'Parent Event Category',
                    'parent_item_colon' => 'Parent Event Category:',
                    'edit_item' => 'Edit Event Category', 
                    'update_item' => 'Update Event Category',
                    'add_new_item' => 'Add New Event Category',
                    'new_item_name' => 'New Event Category',
                    'menu_name' => 'Event Categories'
                ),
                'show_ui' => true,
                'query_var' => true,
                'rewrite' => array(
                    'slug' => 'event_category',
                    'with_front' => false
                )
            ) );
            register_taxonomy('event_tag', array('events'), array(
                'hierarchical' => false,
                'labels' => array(
                    'name' => 'Event Tags',
                    'singular_name' => 'Event Tag',
                    'search_items' => 'Search Event Tags',
                    'all_items' => 'All Event Tags',
                    'parent_item' => null,
                    'parent_item_colon' => null,
                    'edit_item' => 'Edit Event Tag', 
                    'update_item' => 'Update Event Tag',
                    'add_new_item' => 'Add New Event Tag',
                    'new_item_name' => 'New Event Tag',
                    'menu_name' => 'Event Tags'
                ),
                'show_ui' => true,
                'query_var' => true,
                'rewrite' => array(
                    'slug' => 'event_tag',
                    'with_front' => false
                )
            ) );
        }

        /**
         * Add Event Custom Post Type
         * called with the 'init' action
         */
        public static function create_post_type()
        {
            register_post_type('events', // Register Custom Post Type
                array(
                    'labels' => array(
                        'name'               => 'Events',
                        'singular_name'      => 'Event',
                        'add_new'            => 'Add New',
                        'add_new_item'       => 'Add New Event',
                        'edit'               => 'Edit',
                        'edit_item'          => 'Edit Event',
                        'new_item'           => 'New Event',
                        'view'               => 'View Event',
                        'view_item'          => 'View Event',
                        'search_items'       => 'Search Events',
                        'not_found'          => 'No Events found',
                        'not_found_in_trash' => 'No Events found in the bin'
                    ) ,
                    'public' => true,
                    'hierarchical' => true,
                    'has_archive' => true,
                    'supports' => array(
                        'title',
                        'editor',
                        'excerpt',
                        'thumbnail'
                    ),
                    'menu_icon' => 'dashicons-calendar',
                    'can_export' => true
                )
            );
        }
    }
    tk_events_post_type::register();
}
