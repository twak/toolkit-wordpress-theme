<?php
/**
 * Plugin Name: Toolkit Profiles
 * Plugin URI: http://toolkit.leeds.ac.uk/wordpress
 * Description: This plugin adds toolkit profiles.
 * Version: 1.0.5
 * Author: Web Team
 * Author URI: http://toolkit.leeds.ac.uk/wordpress
 * License: GPL2
 */

if ( ! class_exists( 'tk_profiles' ) ) {

    class tk_profiles
    {
        /* plugin version */
        public static $version = "1.0.5";

        /* register all hooks with wordpress API */
        public static function register()
        {
            /**
             * Add profiles Post Type taxonomy
             * added with priority LESS THAN post type registration
             * to ensure the rewrite slug is not overwritten
             */
            add_action( 'init', array( __CLASS__, 'create_taxonomy' ), 9 );

            /**
             * Add profiles Custom Post Type
             * added with priority GREATER THAN taxonomy registration
             * to ensure the rewrite slug is not overwritten
             */
            add_action('init', array( __CLASS__, 'create_post_type' ), 10 );

            /**
             * upgrade from previous version
             */
            add_action( 'init', array( __CLASS__, 'upgrade' ), 11 );


            /**
             * Add in profiles templates (single and archive)
             */
            add_filter('single_template', array( __CLASS__, 'single_template' ) );
            add_filter('archive_template', array( __CLASS__, 'archive_template' ) );

            /**
             * adds customy columns to profiles table in admin
             */
            add_action( 'manage_edit-profiles_columns', array(__CLASS__, 'add_profiles_columns') );
            add_action( 'manage_profiles_posts_custom_column', array(__CLASS__, 'show_profiles_columns'), 10, 2 );

            /**
             * adds filter to profiles table in admin for profile_category taxonomy
             */
            add_action( 'restrict_manage_posts', array( __CLASS__, 'restrict_profiles_by_category' ) );

            /**
             * Sets up custom fields in ACF
             */
            add_action( 'plugins_loaded', array( __CLASS__, 'setup_acf' ) );

            /**
             * flushes rewrite rules when plugin is activated
             */
            //register_activation_hook( __FILE__, array( __CLASS__, 'flush_rules' ) );

        }

        /**
         * creates a profiles taxonomy
         */
        public static function create_taxonomy()
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
         * creates the profiles post type
         */
        public static function create_post_type() {
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
         * upgrades the plugin from a previous version
         */
        public static function upgrade()
        {
            $current_version = get_option('tk_profiles_plugin_version');
            if ($current_version != self::$version) {
                switch ($current_version) {
                    case false:
                        /* updates sites which used built in categories */

                        // get all profiles
                        $profiles = get_posts( array(
                            'post_type' => 'profiles',
                            'numberposts' => -1
                        ) );

                        // re-add support for built in category taxonomy
                        register_taxonomy_for_object_type( 'category', 'profiles' );

                        // store used categories in here
                        $used_cats = array();

                        // store mapping in here
                        $cats_map = array();

                        // collect terms from existing profiles
                        foreach ( $profiles as $profile ) {
                            $terms = get_the_category( $profile->ID );
                            if ( $terms ) {
                                $cats_map[$profile->ID] = array();
                                foreach ($terms as $term ) {
                                    if ( ! isset( $used_cats[$term->term_id] ) ) {
                                        $used_cats[$term->term_id] = $term;
                                    }
                                    $cats_map[$profile->ID][] = $term->term_id;
                                }
                            }
                        }

                        // add the new categories
                        if ( count( $used_cats ) ) {
                            foreach( $used_cats as $cat_id => $term ) {
                                // set up new terms
                                $result = wp_insert_term(
                                    $term->name,
                                    'profile_category'
                                );
                             }
                        }

                        // add terms to profiles
                        if ( count( $cats_map ) ) {
                            foreach( $cats_map as $profile_id => $terms ) {
                                if ( count( $terms ) ) {
                                    wp_set_object_terms( $profile_id, $terms, 'profile_category', false );
                                }
                                // delete relationship between profile and category taxonomy
                                wp_delete_object_term_relationships( $profile_id, 'category' );
                            }
                        }
                        break;
                }
                /* update the version option */
                update_option('tk_profiles_plugin_version', self::$version);
            }
        }

        /**
         * ensures template is used from plugin for single profile pages
         */
        public static function single_template($single_template) {
            global $post;
            if ($post->post_type == 'profiles' || is_tax( 'profile_category') ) {
                $single_template = dirname(__FILE__) . '/single-profiles.php';
            }
            return $single_template;
        }

        /**
         * ensures template is used from plugin for post type archives and category archives
         */
        public static function archive_template($archive_template) {
            global $post;
            if ($post->post_type == 'profiles' || is_tax( 'profile_category') ) {
                $archive_template = dirname(__FILE__) . '/archive-profiles.php';
            }
            return $archive_template;
        }

        /**
         * adds columns to the profiles listing table
         * hooks into 'manage_edit-profiles_columns'
         * @param array $posts_columns
         * @return array $new_posts_columns
         */
        public static function add_profiles_columns( $posts_columns )
        {
            $posts_columns['profile_category'] = 'Categories';
            return $posts_columns;
        }

        /**
         * shows the taxonomy column of the manage profiles table
         * hooks into 'manage_profiles_posts_custom_column'
         * @param $column_id
         * @param $post_id
         */
        public static function show_profiles_columns( $column_id, $post_id )
        {
            global $post;
            switch ($column_id) {
                case "profile_category":
                    $et = get_the_terms($post_id, $column_id);
                    $url = "edit.php?post_status=all&post_type=profiles&$column_id=";               
                    if (is_array($et)) {
                        $term_links = array();
                        foreach($et as $key => $term) {
                            $term_links[] = '<a href="' . $url . $term->slug . '">' . $term->name . '</a>';
                        }
                        echo implode(' | ', $term_links);
                    }
                    break;
            }
        }

        /**
         * resticts listed profiles by category if a filter has been applied
         */
        public static function restrict_profiles_by_category()
        {
            global $typenow;
            global $wp_query;
            if ($typenow == 'profiles') {
                $selected = isset( $wp_query->query['profile_category'] ) ? $wp_query->query['profile_category']: false;
                wp_dropdown_categories( array(
                    'show_option_all' => 'Show All Profile categories',
                    'taxonomy'        => 'profile_category',
                    'name'            => 'profile_category',
                    'value_field'     => 'slug',
                    'selected'        => $selected,
                    'show_count'      => true
                ) );
            }
        }

        /**
         * adds ACF custom fields and options page
         */
        public static function setup_acf()
        {
            /**
             * Create Profiles settings page
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
                        array (
                            'key' => 'field_tk_table_view_fields',
                            'label' => 'Fields to include in table view',
                            'name' => 'tk_table_view_fields',
                            'type' => 'checkbox',
                            'instructions' => 'Select the fields you want to show as columns in table views',
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
                            'choices' => array (
                                'featured_image' => 'Profile Image',
                                'post_title' => 'Full name',
                                'tk_profiles_title' => 'Title',
                                'tk_profiles_first_name' => 'First name',
                                'tk_profiles_last_name' => 'Last name',
                                'tk_profiles_email' => 'Email',
                                'tk_profiles_telephone' => 'Telephone',
                                'tk_profiles_faculty' => 'Faculty',
                                'tk_profiles_school' => 'School',
                                'tk_profiles_job_title' => 'Job title',
                                'tk_profiles_location' => 'Location',
                                'tk_profiles_research_area' => 'Research Area'
                            ),
                            'default_value' => array (
                                'post_title' => 'Full name',
                                'tk_profiles_email' => 'Email',
                                'tk_profiles_telephone' => 'Telephone',
                                'tk_profiles_job_title' => 'Job title',
                            ),
                            'layout' => 'vertical',
                            'toggle' => 0,
                            'return_format' => 'array',
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
                            'key' => 'field_tk_profiles_research_area',
                            'label' => 'Research Area',
                            'name' => 'tk_profiles_research_area',
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
        }


        /**
         * Flush rewrite rules when creating new post type
         * @see https://paulund.co.uk/flush-permalinks-custom-post-type
         */
        function flush_rules()
        {
            self::create_taxonomy();
            self::create_post_type();
            flush_rewrite_rules();
        }
    }
    tk_profiles::register();
}