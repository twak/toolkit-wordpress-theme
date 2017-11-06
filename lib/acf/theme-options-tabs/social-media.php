<?php
/**
 * ACF field definitions for Social Media Tab on options page
 */

function tk_theme_options_social_media_tab( $options )
{
    $tab = array(
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
    );
    return array_merge( $options, $tab );
}
