<?php
/**
 * google map page widget
 */

function tk_add_google_map_page_widget( $widgets )
{
    $widgets[] = array(
        'key' => 'field_tk_page_widgets_google_map',
        'name' => 'map_widget',
        'label' => 'Map',
        'display' => 'block',
        'sub_fields' => array (
            array (
                'key' => 'field_tk_page_widgets_google_map_heading',
                'label' => 'Heading',
                'name' => 'map_widget_heading',
                'type' => 'text',
                'maxlength' => 75
            ),
            array (
                'key' => 'field_tk_page_widgets_google_map_type',
                'label' => 'Map type',
                'name' => 'start_type',
                'type' => 'select',
                'choices' => array (
                    'ROADMAP' => 'Road map',
                    'SATELLITE' => 'Satellite images',
                    'HYBRID' => 'Mixture of road and satellite views',
                    'TERRAIN' => 'Physical map based on terrain information',
                ),
                'default_value' => 'ROADMAP',
                'ui' => 1,
                'return_format' => 'value',
            ),
            array (
                'key' => 'field_tk_page_widgets_google_map_zoom',
                'label' => 'Initial zoom level',
                'name' => 'start_zoom',
                'type' => 'number',
                'instructions' => 'Enter a number between 1 and 20 (1: World, 5: Landmass/continent, 10: City, 15: Streets, 20: Buildings)',
                'default_value' => 14,
                'min' => 1,
                'max' => 20,
            ),
            array (
                'key' => 'field_tk_page_widgets_google_map_locations',
                'label' => 'Locations',
                'name' => 'locations',
                'type' => 'repeater',
                'collapsed' => 'field_tk_page_widgets_google_map_location_title',
                'layout' => 'row',
                'button_label' => 'Add Location',
                'sub_fields' => array (
                    array (
                        'key' => 'field_tk_page_widgets_google_map_location_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                        'required' => 1,
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_google_map_location_markercolour',
                        'label' => 'Marker colour',
                        'name' => 'marker_colour',
                        'type' => 'select',
                        'choices' => array (
                            "green"   => "Green", 
                            "purple"  => "Purple", 
                            "yellow"  => "Yellow", 
                            "blue"    => "Blue", 
                            "orange"  => "Orange", 
                            "red"     => "Red", 
                        ),
                        'return_format' => "value",
                        'default_value' => "red",
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_google_map_infowindow',
                        'label' => 'Include popup for marker?',
                        'name' => 'show_popup',
                        'type' => 'true_false',
                        'default_value' => 1,
                        'ui' => 1,
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_google_map_location_description',
                        'label' => 'Description',
                        'name' => 'description',
                        'type' => 'textarea',
                        'new_lines' => 'wpautop',
                        'conditional_logic' => array (
                            array (
                                array (
                                    'field' => 'field_tk_page_widgets_google_map_infowindow',
                                    'operator' => '==',
                                    'value' => 1,
                                ),
                            ),
                        ),
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_google_map_location_image',
                        'label' => 'Image',
                        'name' => 'image',
                        'type' => 'image',
                        'return_format' => 'array',
                        'preview_size' => 'thumbnail',
                        'library' => 'all',
                        'conditional_logic' => array (
                            array (
                                array (
                                    'field' => 'field_tk_page_widgets_google_map_infowindow',
                                    'operator' => '==',
                                    'value' => 1,
                                ),
                            ),
                        ),
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_google_map_location_directions',
                        'label' => 'Include link to google maps for directions?',
                        'name' => 'show_directions',
                        'type' => 'true_false',
                        'default_value' => 1,
                        'ui' => 1,
                        'conditional_logic' => array (
                            array (
                                array (
                                    'field' => 'field_tk_page_widgets_google_map_infowindow',
                                    'operator' => '==',
                                    'value' => 1,
                                ),
                            ),
                        ),
                    ),
                    array (
                        'key' => 'field_tk_page_widgets_google_map_location_map',
                        'label' => 'Location',
                        'name' => 'location',
                        'type' => 'google_map',
                        'required' => 1,
                        'center_lat' => '53.805401',
                        'center_lng' => '-1.554694',
                        'zoom' => 14,
                        'height' => 400,
                    ),
                ),
            ),
        ),
    );
    return $widgets;
}