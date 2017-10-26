<?php

class tk_post_settings {

    public function __construct()   {
        add_action('init', array( $this, 'register_posts_settings_page'));
        add_action('init', array( $this, 'register_acf_fields'));
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
                'fields' => array (
	                array (
		                'key' => 'field_tk_post_page_settings_title',
		                'label' => 'Posts archive page title',
		                'name' => 'tk_post_page_settings_title',
		                'instructions' => 'The title of the page that shows your blog posts (default: Blog)',
		                'type' => 'text',
	                ),
	                array (
		                'key' => 'field_tk_post_page_settings_tags',
		                'label' => 'Show tags',
		                'name' => 'tk_post_page_settings_tags',
		                'type' => 'checkbox',
		                'choices' => array(
			                'show_tags'   => 'Show tags at the foot of each post'
		                )
	                ),
	                array (
		                'key' => 'field_tk_post_page_settings_search',
		                'label' => 'Hide Search',
		                'name' => 'tk_post_page_settings_search',
		                'type' => 'checkbox',
		                'choices' => array(
			                'hide_search'   => 'Hide search box on the posts archive page'
		                )
	                ),
	                array (
		                'key' => 'field_tk_content_settings_dropcap',
		                'label' => 'Drop Cap',
		                'name' => 'tk_content_settings_dropcap',
		                'instructions' => 'Special formatting can be applied to the first paragraph of posts, but this relies on the post starting with text in a paragraph(!)',
		                'type' => 'checkbox',
		                'choices' => array(
			                'hide_search'   => 'Format the first paragraph of content using a larger font and with a drop capital on the first word'
		                )
	                ),
	                array (
		                'key' => 'field_tk_sidebar_posts_option',
		                'label' => 'Sidebar',
		                'name' => 'posts_sidebar_flag',
		                'type' => 'true_false',
		                'instructions' => 'Show sidebar on posts front page and single post views.',
		                'required' => 0,
		                'default_value' => 0,
		                'save_other_choice' => 0,
	                ),
                ),
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

}

new tk_post_settings();
