<?php
/**
 * featured content widget
 */

function tk_add_featured_content_page_widget( $widgets )
{
    $widgets[] = array (
        'key' => 'field_tk_page_widgets_featured',
        'name' => 'featured_content_widget',
        'label' => 'Featured Content Widget',
        'display' => 'row',
        'sub_fields' => array (
            array (
                'key' => 'field_tk_page_widgets_featured_content_tab',
                'label' => 'Content',
                'type' => 'tab',
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_heading',
                'label' => 'Heading',
                'name' => 'featured_content_widget_heading',
                'type' => 'text',
                'maxlength' => 75
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_media_type',
                'label' => 'Media Type',
                'name' => 'featured_content_widget_media_type',
                'type' => 'radio',
                'choices' => array(
                    'image' => 'Image',
                    'video' => 'Video'
                ),
                'allow_null' => 0,
                'default_value' => "image",
                'layout' => 'horizontal',
                'return_format' => 'value'
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_image',
                'label' => 'Image',
                'name' => 'featured_content_widget_image',
                'type' => 'image',
                'return_format' => 'array',
                'preview_size' => 'thumbnail',
                'conditional_logic' => array(
                    array(
                        array(
                            'field' => 'field_tk_page_widgets_featured_media_type',
                            'operator' => '==',
                            'value' => 'image'
                        )
                    )
                ),
                'library' => 'all',
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_image_aspect',
                'label' => 'Image shape',
                'name' => 'featured_content_widget_image_aspect',
                'type' => 'radio',
                'choices' => array(
                    'rectangular' => 'Rectangular',
                    'square' => 'Square',
                ),
                'allow_null' => 0,
                'default_value' => "rectangular",
                'layout' => 'horizontal',
                'return_format' => 'value',
                'conditional_logic' => array(
                    array(
                        array(
                            'field' => 'field_tk_page_widgets_featured_media_type',
                            'operator' => '==',
                            'value' => 'image'
                        )
                    )
                ),
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_video',
                'label' => 'Video',
                'name' => 'featured_content_widget_video',
                'type' => 'oembed',
                'instructions' => 'Enter a Youtube or Vimeo URL',
                'conditional_logic' => array(
                    array(
                        array(
                            'field' => 'field_tk_page_widgets_featured_media_type',
                            'operator' => '==',
                            'value' => 'video'
                        )
                    )
                )
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_content',
                'label' => 'Content',
                'name' => 'featured_content_widget_content',
                'type' => 'wysiwyg',
                'instructions' => 'Recommended 75 characters or less',
                'tabs' => 'all',
                'toolbar' => 'full',
                'media_upload' => 0,
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_link_type',
                'label' => 'Link',
                'name' => 'featured_content_widget_link_option',
                'type' => 'radio',
                'layout' => 'horizontal',
                'choices' => array (
                    'no-link' => 'No link',
                    'internal' => 'Internal link',
                    'external' => 'External link',
                ),
                'return_format' => 'value',
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_link_internal',
                'label' => 'Internal link',
                'name' => 'featured_content_widget_internal_link',
                'type' => 'page_link',
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_page_widgets_featured_link_type',
                            'operator' => '==',
                            'value' => 'internal',
                        ),
                    ),
                ),
                'allow_null' => 0,
                'allow_archives' => 1,
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_link_external',
                'label' => 'External link',
                'name' => 'featured_content_widget_external_link',
                'type' => 'url',
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_page_widgets_featured_link_type',
                            'operator' => '==',
                            'value' => 'external',
                        ),
                    ),
                ),
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_link_text',
                'label' => 'Link text',
                'name' => 'featured_content_widget_link_text',
                'type' => 'text',
                'maxlength' => 75,
                'placeholder' => "More",
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_page_widgets_featured_link_type',
                            'operator' => '!=',
                            'value' => 'no-link',
                        ),
                    ),
                ),
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_appearance_tab',
                'label' => 'Appearance',
                'type' => 'tab',
            ),
            array (
                'key' => 'field_tk_page_widgets_featured_background',
                'label' => 'Background',
                'name' => 'featured_content_widget_background',
                'type' => 'select',
                'choices' => array (
                    'white' => 'White',
                    'grey' => 'Grey',
                ),
                'default_value' => array (
                ),
                'return_format' => 'value',
            ),
        )
    );
    return $widgets;
}