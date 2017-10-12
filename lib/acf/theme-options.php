<?php
/**
 * Theme options fields for ACF
 */

// Hide the custom field in the sidebar for non-administrators
if ( ( is_multisite() && ! is_super_admin() ) || ( ! is_multisite() && ! is_admin() ) ) {
    add_filter('acf/settings/show_admin', '__return_false');
}

// only run if ACF plugin is loaded

add_action( 'acf/init', 'tk_add_acf_theme_options', 10 );

function tk_add_acf_theme_options()
{
	/**
	 * Theme Options Page
	 */
    acf_add_options_page(array( //Theme options
        'page_title'    => 'Theme Settings',
        'menu_title'    => 'Theme Settings',
        'menu_slug'     => 'theme-general-settings',
        'parent_slug'   => 'themes.php',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));  

	/** 
	 * Theme Options
	 */
	acf_add_local_field_group(array (
	    'key' => 'group_tk_theme_options',
	    'title' => 'Theme options',
	    'fields' => apply_filters('tk_theme_options_fields', array (
			array (
				'key' => 'field_tk_tab_general',
				'label' => 'General Settings',
				'type' => 'tab',
			),	        
			array ( // color dropdown
	            'key' => 'field_tk_theme_options_color',
	            'label' => 'Colour',
	            'name' => 'tk_theme_color',
	            'type' => 'select',
	            'instructions' => 'Select the themes colour scheme.',
	            'choices' => array (
	                'default' => 'Red',
	                'blue' => 'Blue',
	                'green-light' => 'Light green',
	                'purple' => 'Purple',
	            ),
	            'default_value' => array (
	                0 => 'red',
	            )
	        ),
	        array ( // site width
	            'key' => 'field_tk_theme_options_layout',
	            'label' => 'Layout',
	            'name' => 'tk_theme_layout',
	            'type' => 'radio',
	            'instructions' => 'Select the layout of the website.',
	            'choices' => array (
	                'default' => 'Wrapped',
	                'full_width' => 'Full width'                
	            ),
	            'default_value' => array (
	                0 => 'default',
	            )
	        ),
			array(
				'key' => 'field_tk_google_analytics_intro',
				'name' => 'tk_google_analytics_intro',
				'type' => 'message',
				'message' => '<h3>Google Analytics</h3>',
				'new_lines' => '',
				'esc_html' => 0,
			),
            array (
                'key' => 'field_tk_google_tagmanager',
                'label' => 'Include corporate tag manager',
                'name' => 'tk_google_tagmanager',
                'type' => 'checkbox',
                'choices' => array(
                    'include_tagmanager'   => 'Include the corporate tagmanager code in each page'
                )
            ),
    		array (
				'key' => 'field_tk_google_analytics',
				'label' => 'Google Analytics tracking codes',
				'name' => 'tk_google_analytics',
				'type' => 'repeater',
				'instructions' => 'Your site will include analytics tracking which is managed by the web team. If you want to use your own tracking codes in addition to this, please add them below',
				'layout' => 'table',
				'button_label' => 'Add tracking code',
				'sub_fields' => array (
					array (
						'key' => 'field_tk_google_analytics_code',
						'label' => 'Tracking code',
						'name' => 'tk_google_analytics_code',
						'type' => 'text',
					),
				),
			),
			array(
				'key' => 'field_tk_tab_posts',
				'label' => 'Posts',
				'type' => 'tab',
			),
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
				'key' => 'field_tk_tab_social',
				'label' => 'Social Media',
				'type' => 'tab',
			),
			array (
				'key' => 'field_tk_social_media_links',
				'label' => 'Social Media links',
				'name' => 'tk_social_media_links',
				'type' => 'repeater',
				'instructions' => 'Links to your presence on social media websites are placed in the footer',
				'layout' => 'table',
				'button_label' => 'Add link',
				'sub_fields' => array (
					array (
						'key' => 'field_tk_social_media_site',
						'label' => 'Site',
						'name' => 'tk_social_media_site',
						'type' => 'select',
						'wrapper' => array (
							'width' => '33',
						),
						'choices' => array (
							"facebook" => "Facebook",
							"twitter"  => "Twitter",
							"instagram" => "Instagram",
							"google"    => "Google+",
							"linkedin"  => "LinkedIn",
							"weibo"     => "Weibo",
							"youtube"   => "YouTube"
						),
						'return_format' => 'array'
					),
					array (
						'key' => 'field_tk_social_media_url',
						'label' => 'URL',
						'name' => 'tk_social_media_url',
						'type' => 'url',
						'wrapper' => array (
							'width' => '67',
						)
					),
				),
			),
            array(
				'key' => 'field_tk_social_media_sharing_links',
				'label' => 'Social Media sharing links',
				'name' => 'tk_social_media_sharing_links',
				'type' => 'checkbox',
                'choices' => array(
                	'none' => 'Hide share links',
                    'twitter' => 'Twitter',
                    'facebook' => 'Facebook',
                    'google' => 'Google+',
                    'linkedin' => 'LinkedIn'
                ),
                'default_value' => array('twitter','facebook','google','linkedin')
            ),
			array(
				'key' => 'field_tk_twitter_app_intro',
				'name' => 'tk_twitter_app_intro',
				'type' => 'message',
				'message' => '<h3>Twitter app</h3><p>To get your latest tweets showing in the footer of the site, you need to create a twitter app by visiting <a href="https://apps.twitter.com/" target="_blank">apps.twitter.com</a>. The app needs read-only access to your timeline, and should be configured with your website home URL in the "Website" and "Callback URL" fields.</p>',
				'new_lines' => '',
				'esc_html' => 0,
			),
	        array (
	            'key' => 'field_tk_twitter_settings_screen_name',
	            'label' => 'Twitter username (screen name)',
	            'name' => 'screen_name',
	            'type' => 'text',
	            'prepend' => '@',
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_consumer_key',
	            'label' => 'Consumer key',
	            'name' => 'consumer_key',
	            'type' => 'text',
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_consumer_secret',
	            'label' => 'Consumer secret',
	            'name' => 'consumer_secret',
	            'type' => 'text',
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_access_token',
	            'label' => 'OAuth access token',
	            'name' => 'access_token',
	            'type' => 'text',
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_access_token_secret',
	            'label' => 'OAuth access token secret',
	            'name' => 'access_token_secret',
	            'type' => 'text',
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_include_retweets',
	            'label' => 'Include retweets',
	            'name' => 'include_retweets',
	            'type' => 'true_false',
	            'instructions' => 'Check this box to include retweets from your timeline',
	            'default_value' => 0,
	        ),
	        array (
	            'key' => 'field_tk_twitter_settings_twitter_avatar',
				'label' => 'Twitter avatar',
				'name' => 'twitter_avatar',
				'type' => 'image',
				'return_format' => 'object',
				'preview_size' => 'thumbnail',
				'library' => 'all'
	        ),
			array (
				'key' => 'field_tk_tab_sponsors',
				'label' => 'Sponsor/Partner logos',
				'type' => 'tab',
			),	        
			array (
				'key' => 'field_tk_sponsor_logos',
				'label' => 'Sponsor and Partner logos',
				'name' => 'tk_sponsor_logos',
				'type' => 'repeater',
				'instructions' => 'Sponsor and Partner logos are shown in the footer of each page',
				'collapsed' => 'field_tk_sponsor_name',
				'layout' => 'table',
				'button_label' => 'Add sponsor',
				'sub_fields' => array (
					array (
						'key' => 'field_tk_sponsor_image',
						'label' => 'Logo',
						'name' => 'tk_sponsor_image',
						'type' => 'image',
						'return_format' => 'array',
						'preview_size' => 'thumbnail',
						'library' => 'all',
					),
					array (
						'key' => 'field_tk_sponsor_name',
						'label' => 'Sponsor name',
						'name' => 'tk_sponsor_name',
						'type' => 'text',
					),
					array (
						'key' => 'field_tk_sponsor_url',
						'label' => 'Sponsor URL',
						'name' => 'tk_sponsor_url',
						'type' => 'url',
					),
				),
			),
            array (
                'key' => 'field_tk_tab_404',
                'label' => '404 page',
                'type' => 'tab',
            ),          
            array (
                'key' => 'field_tk_404_page_title',
                'label' => '404 Page (page not found) title',
                'name' => 'tk_404_page_title',
                'type' => 'text',
                'placeholder' => 'Page not found',
            ),
            array (
                'key' => 'field_tk_404_page_content',
                'label' => '404 Page (page not found) content',
                'name' => 'tk_404_page_content',
                'type' => 'wysiwyg',
                'tabs' => 'all',
                'toolbar' => 'basic',
                'placeholder' => 'Sorry, the page you are looking for could not be found on this site',
                'media_upload' => 1,
            ),
	    )),
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
}
