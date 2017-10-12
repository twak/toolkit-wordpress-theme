<?php
/**
 * news events and posts widget
 */

function tk_add_news_events_posts_widget( $widgets )
{
    $widgets[] = array (
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
    );
    return $widgets;
}

/* add to page widgets group */
add_filter( 'group_tk_page_widgets', 'tk_add_news_events_posts_widget', 8 );