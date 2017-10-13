<?php
/**
 * cards widget
 */

function tk_add_cards_page_widget( $widgets )
{
    $widgets[] = array (
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
                'type' => 'textarea'
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
                        'type' => 'textarea'
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
                    array (
                        'key' => 'field_tk_page_widgets_cards_card_link_text',
                        'label' => 'Link text',
                        'name' => 'cards_widget_card_link_text',
                        'type' => 'text',
                        'maxlength' => 75,
                        'placeholder' => "More",
                        'conditional_logic' => array (
                            array (
                                array (
                                    'field' => 'field_tk_page_widgets_cards_card_link_type',
                                    'operator' => '!=',
                                    'value' => 'no-link',
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
    );
    return $widgets;
}

/* add to page widgets group */
add_filter( 'group_tk_page_widgets', 'tk_add_cards_page_widget', 7 );