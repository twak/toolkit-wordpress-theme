<?php
/**
 * ACF field definitions for General Tab on options page
 */

function tk_theme_options_general_tab( $options )
{
    $tab = apply_filters( 'tk_theme_options_general_tab', array(
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
        array (
            'key' => 'field_tk_google_analytics',
            'label' => 'Google Analytics',
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
        array (
            'key' => 'field_tk_google_api_key',
            'label' => 'Google API key',
            'name' => 'tk_google_api_key',
            'type' => 'text',
            'instructions' => 'If you are using the Google maps widget on your pages, it is <em>strongly recommended</em> that you create your own API key in the <a href="https://console.developers.google.com/apis/" target="_blank">Google API console</a>. The key needs to enable Google Static Maps API, Google Maps Directions API, Google Maps Distance Matrix API, Google Maps Elevation API, Google Maps Geocoding API and Google Places API Web Services',
        ),
        array (
            'key' => 'field_tk_google_search_console_meta',
            'label' => 'Google Search Console',
            'name' => 'tk_google_search_console_meta',
            'type' => 'text',
            'instructions' => 'If you would like to validate your site with <a href="https://www.google.com/webmasters/tools/" target="_blank">Google Search Console</a>, put the code for your <code>&lt;meta&gt;</code> tag in here (include the whole tag)',
        ),
        array (
            'key' => 'field_tk_bing_webmaster_tools_meta',
            'label' => 'Bing Webmaster Tools',
            'name' => 'tk_bing_webmaster_tools_meta',
            'type' => 'text',
            'instructions' => 'If you would like to validate your site with <a href="https://www.bing.com/webmaster/" target="_blank">Bing Webmaster Tools</a>, put the code for your <code>&lt;meta&gt;</code> tag in here (include the whole tag)',
        )
    ) );
    return array_merge( $options, $tab );
}