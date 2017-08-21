<?php
/**
 * Field definitions for widget page template
 */

if( function_exists('acf_add_local_field_group') ):

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
            'layouts' => array (
                array (
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
                ),
                array (
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
                            'key' => 'field_tk_page_widgets_featured_image',
                            'label' => 'Image',
                            'name' => 'featured_content_widget_image',
                            'type' => 'image',
                            'return_format' => 'url',
                            'preview_size' => 'thumbnail',
                            'library' => 'all',
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
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts',
                    'name' => 'news_events_widget',
                    'label' => 'News, Events and Posts Widget',
                    'display' => 'row',
                    'sub_fields' => array (
                        array (
                            'key' => 'field_tk_page_widgets_posts_options',
                            'label' => 'Options',
                            'name' => 'news_events_widget_options',
                            'type' => 'checkbox',
                            'layout' => 'horizontal',
                            'choices' => array (
                                'news' => 'Show News',
                                'events' => 'Show Events',
                                'posts' => 'Show Blog Posts',
                            ),
                            'return_format' => 'value',
                        ),
                    ),
                ),
                array (
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
                ),
                array (
                    'key' => 'field_tk_page_widgets_cards',
                    'name' => 'cards_widget',
                    'label' => 'Cards Widget',
                    'display' => 'block',
                    'sub_fields' => array (
                        array (
                            'key' => 'field_tk_page_widgets_cards_content_tab',
                            'label' => 'Content',
                            'type' => 'tab',
                        ),
                        array (
                            'key' => 'field_tk_page_widgets_cards_title',
                            'label' => 'Title',
                            'name' => 'cards_widget_title',
                            'type' => 'text',
                            'instructions' => 'Add a title and lead sentence to the top of the card widget (optional)',
                            'maxlength' => 75
                        ),
                        array (
                            'key' => 'field_tk_page_widgets_cards_lead',
                            'label' => 'Lead',
                            'name' => 'cards_widget_lead',
                            'type' => 'textarea',
                            'maxlength' => 200
                        ),
                        array (
                            'key' => 'field_tk_page_widgets_cards_card',
                            'label' => 'Cards',
                            'name' => 'cards_widget_card',
                            'type' => 'repeater',
                            'instructions' => 'Build this widget by adding card',
                            'layout' => 'row',
                            'button_label' => 'Add Card',
                            'collapsed' => 'field_tk_page_widgets_cards_card_image',
                            'sub_fields' => array (
                                array (
                                    'key' => 'field_tk_page_widgets_cards_card_title',
                                    'label' => 'Title',
                                    'name' => 'cards_widget_card_title',
                                    'type' => 'text',
                                    'maxlength' => 75
                                ),
                                array (
                                    'key' => 'field_tk_page_widgets_cards_card_image',
                                    'label' => 'Image',
                                    'name' => 'cards_widget_card_image',
                                    'type' => 'image',
                                    'return_format' => 'url',
                                    'preview_size' => 'thumbnail',
                                    'library' => 'all',
                                ),
                                array (
                                    'key' => 'field_tk_page_widgets_cards_card_content',
                                    'label' => 'Content',
                                    'name' => 'cards_widget_card_content',
                                    'type' => 'textarea',
                                    'maxlength' => 200
                                ),
                                array (
                                    'key' => 'field_tk_page_widgets_cards_card_link_type',
                                    'label' => 'Link option',
                                    'name' => 'cards_widget_card_link_option',
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
                                    'key' => 'field_tk_page_widgets_cards_card_link_internal',
                                    'label' => 'Internal link',
                                    'name' => 'cards_widget_card_internal_link',
                                    'type' => 'page_link',
                                    'conditional_logic' => array (
                                        array (
                                            array (
                                                'field' => 'field_tk_page_widgets_cards_card_link_type',
                                                'operator' => '==',
                                                'value' => 'internal',
                                            ),
                                        ),
                                    ),
                                    'allow_archives' => 1,
                                ),
                                array (
                                    'key' => 'field_tk_page_widgets_cards_card_link_external',
                                    'label' => 'External link',
                                    'name' => 'cards_widget_card_external_link',
                                    'type' => 'url',
                                    'conditional_logic' => array (
                                        array (
                                            array (
                                                'field' => 'field_tk_page_widgets_cards_card_link_type',
                                                'operator' => '==',
                                                'value' => 'external',
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                        array (
                            'key' => 'field_tk_page_widgets_cards_appearance_tab',
                            'label' => 'Appearance',
                            'type' => 'tab',
                        ),
                        array (
                            'key' => 'field_tk_page_widgets_cards_layout',
                            'label' => 'Layout',
                            'name' => 'cards_widget_layout',
                            'type' => 'radio',
                            'layout' => 'horizontal',
                            'choices' => array (
                                'flat' => 'Flat cards',
                                'stacked' => 'Stacked cards',
                            ),
                            'return_format' => 'value',
                        ),
                        array (
                            'key' => 'field_tk_page_widgets_cards_columns',
                            'label' => 'Columns',
                            'name' => 'cards_widget_columns',
                            'type' => 'radio',
                            'conditional_logic' => array (
                                array (
                                    array (
                                        'field' => 'field_tk_page_widgets_cards_layout',
                                        'operator' => '==',
                                        'value' => 'stacked',
                                    ),
                                ),
                            ),
                            'layout' => 'horizontal',
                            'choices' => array (
                                2 => '2 columns',
                                3 => '3 columns',
                                4 => '4 columns',
                            ),
                            'return_format' => 'value',
                        ),
                        array (
                            'key' => 'field_tk_page_widgets_cards_background',
                            'label' => 'Background colour',
                            'name' => 'cards_widget_background',
                            'type' => 'radio',
                            'layout' => 'horizontal',
                            'choices' => array (
                                'white' => 'White',
                                'grey' => 'Grey',
                            ),
                            'return_format' => 'value',
                        ),
                        array (
                            'key' => 'field_tk_page_widgets_cards_image_proportion',
                            'label' => 'Image proportion',
                            'name' => 'cards_widget_image_proportion',
                            'type' => 'radio',
                            'layout' => 'horizontal',
                            'choices' => array (
                                'rectangle' => 'Rectangle',
                                'square' => 'Square',
                            ),
                        ),
                    ),
                ),
                array (
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
                ),
            ),
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
));

endif;