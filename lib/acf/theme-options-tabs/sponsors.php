<?php
/**
 * ACF field definitions for Sponsors Tab on options page
 */

function tk_theme_options_sponsors_tab( $options )
{
    $tab = array(
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
    );
    return array_merge( $options, $tab );
}