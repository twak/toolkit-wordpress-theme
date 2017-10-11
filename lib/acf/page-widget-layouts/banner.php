<?php
/**
 * banner widget
 */

function tk_add_banner_page_widget( $widgets )
{
    $widgets[] = array (
        'key' => 'field_tk_page_widgets_banner',
        'name' => 'banner_widget',
        'label' => 'Banner Widget',
        'display' => 'block',
        'sub_fields' => array (
            array (
                'key' => 'field_tk_page_widgets_banner_content_tab',
                'label' => 'Content',
                'type' => 'tab',
            ),
            array (
                'key' => 'field_tk_page_widgets_banner_slides',
                'label' => 'Slides',
                'name' => 'banner_widget_slide',
                'type' => 'repeater',
                'max' => 4,
                'layout' => 'row',
                'button_label' => 'Add Slide',
                'collapsed' => '',
                'sub_fields' => array (
                    array (
                        'key' => 'field_tk_page_widgets_banner_slide_image',
                        'label' => 'Image',
                        'name' => 'banner_widget_slide_image',
                        'type' => 'image',
                        'return_format' => 'array',
                        'preview_size' => 'thumbnail',
                        'library' => 'all',
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_banner_slide_title',
                        'label' => 'Title',
                        'name' => 'banner_widget_slide_title',
                        'type' => 'text',
                        'maxlength' => 75
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_banner_slide_lead',
                        'label' => 'Lead sentence',
                        'name' => 'banner_widget_slide_lead',
                        'type' => 'textarea',
                        'maxlength' => 200
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_banner_slide_link_type',
                        'label' => 'Link',
                        'name' => 'banner_widget_slide_link',
                        'type' => 'radio',
                        'layout' => 'horizontal',
                        'choices' => array (
                            'no-link' => 'No Link',
                            'internal' => 'Internal Link',
                            'external' => 'External Link',
                        ),
                        'return_format' => 'value',
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_banner_slide_link_text',
                        'label' => 'Link text',
                        'name' => 'banner_widget_slide_link_text',
                        'type' => 'text',
                        'conditional_logic' => array (
                            array (
                                array (
                                    'field' => 'field_tk_page_widgets_banner_slide_link_type',
                                    'operator' => '!=',
                                    'value' => 'no-link',
                                ),
                            ),
                        ),
                        'default_value' => 'More',
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_banner_slide_link_internal',
                        'label' => 'Link internal',
                        'name' => 'banner_widget_slide_link_internal',
                        'type' => 'page_link',
                        'conditional_logic' => array (
                            array (
                                array (
                                    'field' => 'field_tk_page_widgets_banner_slide_link_type',
                                    'operator' => '==',
                                    'value' => 'internal',
                                ),
                            ),
                        ),
                        'allow_archives' => 1,
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_banner_slide_link_external',
                        'label' => 'Link external',
                        'name' => 'banner_widget_slide_link_external',
                        'type' => 'url',
                        'instructions' => 'Add the full url including \'http://\'.',
                        'conditional_logic' => array (
                            array (
                                array (
                                    'field' => 'field_tk_page_widgets_banner_slide_link_type',
                                    'operator' => '==',
                                    'value' => 'external',
                                ),
                            ),
                        ),
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_banner_slide_tab',
                        'label' => 'Tab title',
                        'name' => 'banner_widget_slide_tab_title',
                        'type' => 'text',
                        'default_value' => 'Tab',
                    ),
                ),
            ),
            array (
                'key' => 'field_tk_page_widgets_banner_appearance_tab',
                'label' => 'Appearance',
                'type' => 'tab',
            ),
            array (
                'key' => 'field_tk_page_widgets_banner_size',
                'label' => 'Banner size',
                'name' => 'banner_widget_size',
                'type' => 'select',
                'choices' => array (
                    'default' => 'Medium banner',
                    'large' => 'Large banner',
                    'small' => 'Small banner',
                ),
                'default_value' => array (
                    'small'
                ),
                'return_format' => 'value',
            ),
        ),
    );
    return $widgets;
}

/* add to page widgets group */
add_filter( 'group_tk_page_widgets', 'tk_add_banner_page_widget', 4 );