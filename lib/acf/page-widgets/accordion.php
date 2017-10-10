<?php
/**
 * accordion page widget
 */

function tk_add_accordion_page_widget( $widgets )
{
    $widgets[] = array (
        'key' => 'field_tk_page_widgets_accordion',
        'name' => 'accordion_widget',
        'label' => 'Accordion Widget',
        'display' => 'block',
        'sub_fields' => array (
            array (
                'key' => 'field_tk_page_widgets_accordion_item',
                'label' => 'Accordion Item',
                'name' => 'accordion_item',
                'type' => 'repeater',
                'instructions' => 'Add an accordion item to build this widget',
                'collapsed' => '',
                'layout' => 'row',
                'button_label' => 'Add Accordion Item',
                'sub_fields' => array (
                    array (
                        'key' => 'field_tk_page_widgets_accordion_item_title',
                        'label' => 'title',
                        'name' => 'accordion_title',
                        'type' => 'text',
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_accordion_item_content',
                        'label' => 'content',
                        'name' => 'accordion_content',
                        'type' => 'wysiwyg',
                        'tabs' => 'all',
                        'toolbar' => 'full',
                        'media_upload' => 1,
                    ),
                ),
            ),
        ),
    );
    return $widgets;
}

/* add to page widgets group */
add_filter( 'group_tk_page_widgets', 'tk_add_accordion_page_widget' );