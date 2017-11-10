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
            'key' => 'field_tk_google_api_intro',
            'name' => 'tk_google_api_intro',
            'type' => 'message',
            'message' => '<h3>Google API key</h3><p>If you are using the Google maps widget on your pages, it is <em>strongly recommended</em> that you create your own API key in the <a href="https://console.developers.google.com/apis/" target="_blank">Google API console</a>. The key needs to enable Google Static Maps API, Google Maps Directions API, Google Maps Distance Matrix API, Google Maps Elevation API, Google Maps Geocoding API and Google Places API Web Services</p>',
            'new_lines' => '',
            'esc_html' => 0,
        ),
        array (
            'key' => 'field_tk_google_api_key',
            'label' => 'Google API key',
            'name' => 'tk_google_api_key',
            'type' => 'text',
        )
    ) );
    return array_merge( $options, $tab );
}