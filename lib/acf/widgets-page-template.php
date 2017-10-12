<?php
/**
 * Field definitions for widget page template
 */

add_action( 'acf/init', 'tk_add_acf_page_widgets', 10 );
add_action( 'acf/init', 'tk_add_acf_page_widget_layouts', 9 );

function tk_add_acf_page_widget_layouts()
{
    /* include layout definitions */
    foreach (glob(dirname(__FILE__) . "/page-widget-layouts/*.php") as $filename)
    {
        include $filename;
    }
}

function tk_add_acf_page_widgets()
{
    acf_add_local_field_group(array (
        'key' => 'group_tk_page_widgets',
        'title' => 'Page Widgets',
        'fields' => array (
            array (
                'key' => 'field_tk_page_widgets',
                'label' => 'Widgets',
                'name' => 'widgets',
                'type' => 'flexible_content',
                'instructions' => 'Add any combination of widgets, drag and drop.',
                'button_label' => 'Add Widget',
                'layouts' => apply_filters( 'group_tk_page_widgets', array() )
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
        'position' => 'normal',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'active' => 1,
        'hide_on_screen' => array (
            'the_content',
            'excerpt',
            'custom_fields',
            'discussion',
            'comments',
            'format',
            'featured_image',
            'categories',
            'tags',
            'send-trackbacks',
        ),
    ) );
}