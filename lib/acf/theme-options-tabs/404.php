<?php
/**
 * ACF field definitions for 404 page Tab on options page
 */

function tk_theme_options_404_tab( $options )
{
    $tab = array(
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
    );
    return array_merge( $options, $tab );
}