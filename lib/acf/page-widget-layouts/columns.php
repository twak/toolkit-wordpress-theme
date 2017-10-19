<?php
/**
 * accordion page widget
 */

function tk_add_columns_page_widget( $widgets )
{
    $widgets[] = array (
        'key' => 'field_tk_page_widgets_columns_widget',
        'name' => 'columns_widget',
        'label' => 'Columns Widget',
        'display' => 'block',
        'sub_fields' => array (
            array(
                'key' => 'field_tk_page_widgets_columns_wide',
                'label' => 'Make columns wide?',
                'instructions' => 'This will make the container for the columns wider than the other content on the page when the sidebar is hidden',
                'name' => 'columns_wide',
                'type' => 'true_false',
                'default_value' => 1,
                'ui' => 1,
            ),
            array (
                'key' => 'field_tk_page_widgets_columns',
                'label' => 'Columns',
                'name' => 'columns',
                'type' => 'repeater',
                'instructions' => 'Add up to 4 columns',
                'collapsed' => '',
                'layout' => 'row',
                'max' => 3,
                'button_label' => 'Add Column',
                'sub_fields' => array (
                    array (
                        'key' => 'field_tk_page_widgets_columns_content',
                        'label' => 'Content',
                        'name' => 'column_content',
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
add_filter( 'group_tk_page_widgets', 'tk_add_columns_page_widget', 9 );