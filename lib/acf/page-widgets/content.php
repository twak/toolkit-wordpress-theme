<?php
/**
 * content widget
 */

function tk_add_content_page_widget( $widgets )
{
    $widgets[] = array (
        'key' => 'field_tk_page_widgets_content',
        'name' => 'content_widget',
        'label' => 'Content Widget',
        'display' => 'row',
        'sub_fields' => array (
            array (
                'key' => 'field_tk_page_widgets_content_content_tab',
                'label' => 'Content',
                'type' => 'tab',
            ),
            array (
                'key' => 'field_tk_page_widgets_content_heading',
                'label' => 'Heading',
                'name' => 'content_widget_heading',
                'type' => 'text',
                'maxlength' => 75
            ),
            array (
                'key' => 'field_tk_page_widgets_content_content',
                'label' => 'Content',
                'name' => 'content_widget_content',
                'type' => 'wysiwyg',
                'tabs' => 'all',
                'toolbar' => 'full',
                'media_upload' => 1,
            ),
            array (
                'key' => 'field_tk_page_widgets_content_appearance_tab',
                'label' => 'Appearance',
                'type' => 'tab',
            ),
            array (
                'key' => 'field_tk_page_widgets_content_background',
                'label' => 'Background',
                'name' => 'content_widget_background',
                'type' => 'select',
                'choices' => array (
                    'white' => 'White',
                    'grey' => 'Grey',
                ),
                'default_value' => array (
                    0 => 'white',
                ),
                'return_format' => 'value',
            ),
        ),
    );
    return $widgets;
}

/* add to page widgets group */
add_filter( 'group_tk_page_widgets', 'tk_add_content_page_widget' );

