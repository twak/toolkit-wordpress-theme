<?php

class tk_post_settings {

    public function __construct()   {
        add_action('init', array( $this, 'register_posts_settings_page'));
        add_action('init', array( $this, 'register_acf_fields'));

        /* add fields for settings */
        add_filter('tk_post_settings_fields', array( $this, 'post_archive_settings' ) );
        add_filter('tk_post_settings_fields', array( $this, 'single_post_settings' ) );
    }

    public function register_posts_settings_page()    {

        if( function_exists('acf_add_options_page') ) {

          acf_add_options_page(array(
        		'page_title' 	=> 'Posts Settings',
        		'menu_title' 	=> 'Posts Settings',
        		'menu_slug' 	=> 'posts-settings',
                'parent_slug'   => 'edit.php',
        		'capability' 	=> 'edit_theme_options',
        		'redirect' 	    => false
        	));

        }

    }

    public function register_acf_fields ()  {

        if( function_exists('acf_add_local_field_group') ):

            acf_add_local_field_group(array (
                'key' => 'group_post_settings',
                'title' => 'Post Settings',
                'fields' => apply_filters('tk_post_settings_fields', array()),
                'location' => array (
                    array (
                        array (
                            'param' => 'options_page',
                            'operator' => '==',
                            'value' => 'posts-settings',
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

        endif;

    }

    public function post_archive_settings( $options )
    {
        $tab = apply_filters( 'tk_post_settings_archive_tab', array(
            array (
                'key' => 'field_tk_tab_post_archive_page',
                'label' => 'Posts Archive',
                'type' => 'tab',
            ),          
            array (
                'key' => 'field_tk_post_page_settings_title',
                'label' => 'Page title',
                'name' => 'tk_post_page_settings_title',
                'instructions' => 'The title of the page that shows your blog posts (default: Blog)',
                'type' => 'text',
            ),
            array (
                'key' => 'field_tk_post_page_settings_search',
                'label' => 'Hide Search',
                'name' => 'tk_post_page_settings_search',
                'instructions' => 'Hide search on post archive page?',
                'type' => 'true_false',
                'default_value' => 0,
                'ui' => 1,
            ),
            array (
                'key' => 'field_tk_sidebar_posts_option',
                'label' => 'Sidebar',
                'name' => 'posts_sidebar_flag',
                'type' => 'true_false',
                'instructions' => 'Show sidebar on posts front page and single post views?',
                'ui' => 1,
                'default_value' => 0,
            ),
            array (
                'key' => 'field_tk_post_page_settings_excerpt',
                'label' => 'Post Excerpts',
                'name' => 'tk_post_page_settings_excerpt',
                'instructions' => 'Choose how you want excerpts to be displayed on the post archive pages',
                'type' => 'select',
                'choices' => array (
                    'excerpt' => 'Show post excerpt',
                    'full' => 'Show full post content (use MORE tag for excerpts)',
                ),
                'default_value' => 'excerpt',
                'ui' => 1,
                'return_format' => 'value',
            )
        ) );
        return array_merge( $options, $tab );
    }

    public function single_post_settings( $options )
    {
        $tab = apply_filters( 'tk_post_settings_single_tab', array(
            array (
                'key' => 'field_tk_tab_post_single_page',
                'label' => 'Single Posts',
                'type' => 'tab',
            ),          
            array (
                'key' => 'field_tk_post_page_settings_tags',
                'label' => 'Show tags at the bottom of single posts?',
                'name' => 'tk_post_page_settings_tags',
                'type' => 'true_false',
                'default_value' => 0,
                'ui' => 1,
            ),
        ) );
        return array_merge( $options, $tab );
    }
}
new tk_post_settings();
