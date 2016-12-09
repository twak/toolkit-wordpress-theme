<?php
/**
 * ADVANCED CUSTOM FIELDS - ACF
 */

// Hide the custom field in the sidebar
//add_filter('acf/settings/show_admin', '__return_false');

// only run if ACF plugin is loaded

if( function_exists('acf_add_local_field_group') ):

	/**
	 * Page Sidebar Toggle (Turn the sidebar on and off)
	 */


	//Adds sidebar flag to every page type

	acf_add_local_field_group(array (
	    'key' => 'group_tk_sidebar_page_option',
	    'title' => 'Sidebar Page Option',
	    'fields' => array (
	        array (
	            'key' => 'field_tk_sidebar_page_option',
	            'label' => '',
	            'name' => 'sidebar_flag',
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
	                'show' => 'Show Sidebar',
	                'hide' => 'Hide Sidebar',
	            ),
	            'other_choice' => 0,
	            'save_other_choice' => 0,
	            'default_value' => 'show',
	            'layout' => 'horizontal',
	        ),
	    ),
	    'location' => array (
	        array (
	            array (
	                'param' => 'post_type',
	                'operator' => '==',
	                'value' => 'page',
	            ),
	        ),
	    ),
	    'menu_order' => 2,
	    'position' => 'side',
	    'style' => 'default',
	    'label_placement' => 'top',
	    'instruction_placement' => 'label',
	    'hide_on_screen' => '',
	    'active' => 1,
	    'description' => '',
	));

	/**
	 * Pinned widget for template widgets
	 */
	acf_add_local_field_group(array (
	    'key' => 'group_tk_pinned_widget',
	    'title' => 'Pinned Widget',
	    'fields' => array (
	        array (
	            'key' => 'field_tk_pinned_widget',
	            'label' => '',
	            'name' => 'widget_top',
	            'type' => 'checkbox',
	            'instructions' => 'Pin first widget to the top when the page has a sidebar',
	            'required' => 0,
	            'conditional_logic' => 0,
	            'wrapper' => array (
	                'width' => '',
	                'class' => '',
	                'id' => '',
	            ),
	            'choices' => array (
	                'active' => 'Active',
	            ),
	            'default_value' => array (
	            ),
	            'layout' => 'vertical',
	            'toggle' => 0,
	            'return_format' => 'value',
	        ),
	    ),
	    'location' => array (
	        array (
	            array (
	                'param' => 'page_template',
	                'operator' => '==',
	                'value' => 'template-widgets.php',
	            ),
	        ),
	    ),
	    'menu_order' => 1,
	    'position' => 'side',
	    'style' => 'default',
	    'label_placement' => 'top',
	    'instruction_placement' => 'label',
	    'hide_on_screen' => '',
	    'active' => 1,
	    'description' => '',
	));

	/**
	 * Theme Options Page
	 */
	if( function_exists('acf_add_options_page') ) { // Add options page to theme
	    
	    acf_add_options_page(array( //Theme options
	        'page_title'    => 'Theme General Settings',
	        'menu_title'    => 'Theme Settings',
	        'menu_slug'     => 'theme-general-settings',
	        'parent_slug'   => 'themes.php',
	        'capability'    => 'edit_posts',
	        'redirect'      => false
	    ));  
	}

	/** 
	 * Theme Options
	 */
	acf_add_local_field_group(array (
	    'key' => 'group_tk_theme_options',
	    'title' => 'Theme options',
	    'fields' => array (
	        array ( // color dropdown
	            'key' => 'field_tk_theme_options_color',
	            'label' => 'Colour',
	            'name' => 'tk_theme_color',
	            'type' => 'select',
	            'instructions' => 'Select the themes colour scheme.',
	            'required' => 0,
	            'conditional_logic' => 0,
	            'wrapper' => array (
	                'width' => '',
	                'class' => '',
	                'id' => '',
	            ),
	            'choices' => array (
	                'default' => 'Red',
	                'blue' => 'Blue',
	                'green-light' => 'Light green'
	            ),
	            'default_value' => array (
	                0 => 'red',
	            ),
	            'allow_null' => 0,
	            'multiple' => 0,
	            'ui' => 0,
	            'ajax' => 0,
	            'placeholder' => '',
	            'disabled' => 0,
	            'readonly' => 0,
	        ),
	        array ( // site width
	            'key' => 'field_tk_theme_options_layout',
	            'label' => 'Layout',
	            'name' => 'tk_theme_layout',
	            'type' => 'radio',
	            'instructions' => 'Select the layout of the website.',
	            'required' => 0,
	            'conditional_logic' => 0,
	            'wrapper' => array (
	                'width' => '',
	                'class' => '',
	                'id' => '',
	            ),
	            'choices' => array (
	                'default' => 'Wrapped',
	                'full_width' => 'Full width'                
	            ),
	            'default_value' => array (
	                0 => 'default',
	            ),
	            'allow_null' => 0,
	            'multiple' => 0,
	            'ui' => 0,
	            'ajax' => 0,
	            'placeholder' => '',
	            'disabled' => 0,
	            'readonly' => 0,
	        ),
	    ),
	    'location' => array (
	        array (
	            array (
	                'param' => 'options_page',
	                'operator' => '==',
	                'value' => 'theme-general-settings',
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

	acf_add_local_field_group(array ( //Navigation
	    'key' => 'group_tk_theme_navigation',
	    'title' => 'Theme navigation options',
	    'fields' => array (
	        array (
	            'key' => 'field_tk_theme_options_menu',
	            'label' => 'Main menu',
	            'name' => 'tk_theme_main_menu',
	            'type' => 'select',
	            'instructions' => 'Select the themes menu pattern. <a href="http://toolkit.leeds.ac.uk/wordpress/">See the toolkit docs</a>.',
	            'required' => 0,
	            'conditional_logic' => 0,
	            'wrapper' => array (
	                'width' => '',
	                'class' => '',
	                'id' => '',
	            ),
	            'choices' => array (
	                'priority' => 'Priority menu',                
	            ),
	            'default_value' => array (
	                0 => 'red',
	            ),
	            'allow_null' => 0,
	            'multiple' => 0,
	            'ui' => 0,
	            'ajax' => 0,
	            'placeholder' => '',
	            'disabled' => 0,
	            'readonly' => 0,
	        ),
	    ),
	    'location' => array (
	        array (
	            array (
	                'param' => 'options_page',
	                'operator' => '==',
	                'value' => 'theme-general-settings',
	            ),
	        ),
	    ),
	    'menu_order' => 1,
	    'position' => 'normal',
	    'style' => 'default',
	    'label_placement' => 'top',
	    'instruction_placement' => 'label',
	    'hide_on_screen' => '',
	    'active' => 1,
	    'description' => '',
	));
	// Twitter settings
	acf_add_local_field_group(array ( 
	    'key' => 'group_tk_twitter_settings',
	    'title' => 'Twitter settings',
	    'fields' => array (
	        array (
	            'key' => 'field_tk_twitter_settings_screen_name',
	            'label' => 'Twitter username (screen name)',
	            'name' => 'screen_name',
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
	            'prepend' => '@',
	            'append' => '',
	            'maxlength' => '',
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_consumer_key',
	            'label' => 'Consumer key',
	            'name' => 'consumer_key',
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
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_consumer_secret',
	            'label' => 'Consumer secret',
	            'name' => 'consumer_secret',
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
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_access_token',
	            'label' => 'OAuth access token',
	            'name' => 'access_token',
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
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_access_token_secret',
	            'label' => 'OAuth access token secret',
	            'name' => 'access_token_secret',
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
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_include_retweets',
	            'label' => 'Include retweets',
	            'name' => 'include_retweets',
	            'type' => 'true_false',
	            'instructions' => 'Check this box to include retweets from your timeline',
	            'required' => 0,
	            'conditional_logic' => 0,
	            'wrapper' => array (
	                'width' => '',
	                'class' => '',
	                'id' => '',
	            ),
	            'message' => '',
	            'default_value' => 0,
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_twitter_avatar',
				'label' => 'Twitter avatar',
				'name' => 'twitter_avatar',
				'type' => 'image',
				'return_format' => 'object',
				'preview_size' => 'thumbnail',
				'library' => 'all',
				'min_width' => '',
				'min_height' => '',
				'min_size' => '',
				'max_width' => '',
				'max_height' => '',
				'max_size' => '',
				'mime_types' => '',
				'instructions' => '',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array (
					'width' => '',
					'class' => '',
					'id' => '',
				),
	        ),
	    ),
	    'location' => array (
	        array (
	            array (
	                'param' => 'options_page',
	                'operator' => '==',
	                'value' => 'theme-general-settings',
	            ),
	        ),
	    ),
	    'menu_order' => 2,
	    'position' => 'normal',
	    'style' => 'default',
	    'label_placement' => 'top',
	    'instruction_placement' => 'label',
	    'hide_on_screen' => '',
	    'active' => 1,
	    'description' => '',
	));


endif;