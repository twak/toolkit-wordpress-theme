<?php
/**
 * Advanced Custom Fields setup for Toolkit Events Plugin
 */


if ( ! class_exists( 'tk_events_acf' ) ) {

    class tk_events_acf
    {
        /* register all hooks with wordpress API */
        public static function register()
        {
            /**
             * Sets up custom fields in ACF
             */
            add_action( 'acf/init', array( __CLASS__, 'setup_acf' ) );

        }

        /**
         * ACF events settings
         */
        public static function setup_acf()
        {
            /**
             * options page for events
             */
            acf_add_options_page( array(
                'page_title' => 'Events Settings',
                'menu_title' => 'Events Settings',
                'menu_slug' => 'tk-events-settings',
                'capability' => 'edit_posts',
                'redirect' => false,
                'parent_slug' => 'edit.php?post_type=events',
            ));

            /**
             * Events options
             */
            acf_add_local_field_group(array (
                'key' => 'group_tk_events_page_settings',
                'title' => 'Events page settings',
                'fields' => array (
                    /* custom archive page title */
                    array (
                        'key' => 'field_tk_events_page_settings_title',
                        'label' => 'Page Title',
                        'name' => 'tk_events_page_settings_title',
                        'type' => 'text',
                        'instructions' => 'Add a custom title to the events list page. If left blank the title of the page will be "Events".',
                        'default_value' => 'Events',
                    ),
                    /* show archive title as prefix on taxonomy archives */      
                    array (
                        'key' => 'field_tk_events_taxonomy_settings_prefix',
                        'label' => 'Prefix event Category and Tag archives with the page title',
                        'name' => 'tk_events_taxonomy_settings_prefix',
                        'type' => 'checkbox',
                        'choices' => array(
                            'prefix_taxonomy'   => 'This will add a prefix to the title of all event category or tag archive pages'
                        )
                    ),
                     /* custom archive page introduction */
                    array (
                        'key' => 'field_tk_events_page_settings_introduction',
                        'label' => 'Page introduction',
                        'name' => 'tk_events_page_settings_introduction',
                        'type' => 'wysiwyg',
                        'instructions' => 'Add an introduction to the top of the events archive page.',
                        'tabs' => 'all',
                        'toolbar' => 'basic',
                        'media_upload' => 0,
                    ),
                    /* show search on archive pages option */      
                    array (
                        'key' => 'field_tk_events_page_settings_search',
                        'label' => 'Hide Search',
                        'name' => 'tk_events_page_settings_search',
                        'type' => 'checkbox',
                        'choices' => array(
                            'hide_search'   => 'Hide search box on the events archive page'
                        )
                    ),
                    /* custom current events tab title */
                    array (
                        'key' => 'field_tk_events_page_settings_current_title',
                        'label' => 'Current Events tab',
                        'name' => 'tk_events_page_settings_current_title',
                        'type' => 'text',
                        'instructions' => 'The title of the tab for current events. If left blank the tab will be "Current Events".',
                        'default_value' => 'Current Events',
                    ),
                    /* custom event archives tab title */
                    array (
                        'key' => 'field_tk_events_page_settings_archive_title',
                        'label' => 'Events Archive tab',
                        'name' => 'tk_events_page_settings_archive_title',
                        'type' => 'text',
                        'instructions' => 'The title of the tab for past events. If left blank the tab will be "Events Archive".',
                        'default_value' => 'Events Archive',
                    ),
                    /* show calendar on archive pages option */      
                    array (
                        'key' => 'field_tk_events_page_settings_calendar',
                        'label' => 'Calendar view',
                        'name' => 'tk_events_page_settings_calendar',
                        'type' => 'checkbox',
                        'instructions' => 'Ticking this box will show a calendar view on the events page.',
                        'choices' => array(
                            'show_calendar'   => 'Show calendar view'
                        ),                
                    ),
                    /* custom calendar tab title */
                    array (
                        'key' => 'field_tk_events_page_settings_calendar_title',
                        'label' => 'Events Calendar tab',
                        'name' => 'tk_events_page_settings_calendar_title',
                        'type' => 'text',
                        'instructions' => 'The title of the tab for the calendar. If left blank the tab will be "Calendar View".',
                        'default_value' => 'Calendar View',
                        'conditional_logic' => array (
                            array (
                                array (
                                    'field' => 'field_tk_events_page_settings_calendar',
                                    'operator' => '==',
                                    'value' => 'show_calendar',
                                ),
                            ),
                        )
                    ),
                    array (
                        'key' => 'field_tk_events_single_settings_related',
                        'label' => 'Related Events',
                        'name' => 'tk_events_single_settings_related',
                        'type' => 'checkbox',
                        'instructions' => 'Ticking this box will make a maximum of three events related by category or tag appear at the bottom of every event page.',
                        'choices' => array(
                            'show_related'   => 'Show related events on the event page'
                        )
                    )
                ),
                'location' => array (
                    array (
                        array (
                            'param' => 'options_page',
                            'operator' => '==',
                            'value' => 'tk-events-settings',
                        ),
                    ),
                ),
                'menu_order' => 0,
                'position' => 'normal',
                'style' => 'default',
                'label_placement' => 'top',
                'instruction_placement' => 'label',
                'hide_on_screen' => '',
                'active' => 1,
                'description' => '',
            ));

            /**
             * taxonomy introductions
             */
            acf_add_local_field_group(array (
                'key' => 'group_tk_events_taxonomy_settings',
                'title' => 'Archive page options',
                'fields' => array (
                    array (
                        'key' => 'field_tk_events_taxonomy_introduction',
                        'label' => 'Introduction',
                        'name' => 'tk_events_taxonomy_introduction',
                        'type' => 'wysiwyg',
                        'instructions' => 'Text here will be displayed on the archive page for this category/tag',
                        'tabs' => 'all',
                        'toolbar' => 'full',
                        'media_upload' => 1,
                    ),
                ),
                'location' => array (
                    array (
                        array (
                            'param' => 'taxonomy',
                            'operator' => '==',
                            'value' => 'event_category',
                        ),
                    ),
                    array (
                        array (
                            'param' => 'taxonomy',
                            'operator' => '==',
                            'value' => 'event_tag',
                        ),
                    ),
                ),
                'menu_order' => 0,
                'position' => 'normal',
                'style' => 'default',
                'label_placement' => 'top',
                'instruction_placement' => 'label',
                'hide_on_screen' => 'term-description',
                'active' => 1,
            ));

            /**
             * Individual Event Fields
             */
            acf_add_local_field_group(array(
                'key' => 'group_tk_events',
                'title' => 'Event Details',
                'fields' => array(
                    // event start date
                    array(
                        'key' => 'field_tk_events_start_date',
                        'label' => 'Event start date',
                        'name' => 'tk_events_start_date',
                        'type' => 'date_picker',
                        'required' => 1,
                        'wrapper' => array(
                            'width' => '50%',
                        ),
                        'display_format' => 'd/m/Y',
                        'return_format' => 'Y-m-d',
                        'first_day' => 1,
                    ),
                    // event end date
                    array(
                        'key' => 'field_tk_events_end_date',
                        'label' => 'Event end date',
                        'name' => 'tk_events_end_date',
                        'type' => 'date_picker',
                        'required' => 1,
                        'wrapper' => array(
                            'width' => '50%',
                        ),
                        'display_format' => 'd/m/Y',
                        'return_format' => 'Y-m-d',
                        'first_day' => 1,
                    ),
                    // external url for event
                    array(
                        'key' => 'field_tk_events_external_url',
                        'label' => 'Event URL (external)',
                        'name' => 'tk_events_external_url',
                        'instructions' => 'Entering a URL here will redirect this event to the external site from the calendar and the events listing pages',
                        'type' => 'url',
                        'wrapper' => array(
                            'width' => '60%',
                        )
                    ),
                    /* link to external URL from listings? */      
                    array (
                        'key' => 'field_tk_events_external_url_link',
                        'label' => 'Link to external URL',
                        'name' => 'tk_events_external_url_link',
                        'instructions' => 'Link directly to the external URL from the listings page and calendar',
                        'type' => 'true_false',
                        'ui' => true,
                        'default_value' => false,
                        'wrapper' => array(
                            'width' => '40%',
                        )
                    ),
                    array(
                        'key' => 'field_tk_events_key_facts',
                        'label' => 'Key facts',
                        'name' => 'tk_events_key_facts',
                        'type' => 'repeater',
                        'instructions' => 'Add event details e.g. Time, Location',
                        'layout' => 'table',
                        'button_label' => 'Add key facts',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_tk_events_key_facts_label',
                                'label' => 'Label',
                                'name' => 'tk_events_key_facts_label',
                                'type' => 'text',
                            ) ,
                            array(
                                'key' => 'field_tk_events_key_facts_information',
                                'label' => 'Information',
                                'name' => 'tk_events_key_facts_information',
                                'type' => 'text',
                            )
                        )
                    )          
                ),
                'location' => array(
                    array(
                        array(
                            'param' => 'post_type',
                            'operator' => '==',
                            'value' => 'events',
                        ) ,
                    ) ,
                ) ,
                'menu_order' => 0,
                'position' => 'acf_after_title',
                'style' => 'default',
                'label_placement' => 'top',
                'instruction_placement' => 'label',
                'hide_on_screen' => '',
                'active' => 1,
                'description' => '',
            ));
        }

    }
    tk_events_acf::register();
}

