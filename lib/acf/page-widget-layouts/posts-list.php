<?php
/**
 * news events and posts widget
 */

function tk_add_posts_list_widget( $widgets )
{
    $widgets[] = array (
        'key' => 'field_tk_widgets_posts_list_widget',
        'label' => 'Post Lists',
        'name' => 'posts_list_widget',
        'instructions' => 'Add lists of your latest four posts',
        'sub_fields' => array(
            array (
                'key' => 'field_tk_page_widgets_posts_list_title',
                'label' => 'Widget title',
                'name' => 'widget_title',
                'type' => 'text',
            ),
            array (
                'key' => 'field_tk_widgets_posts_list_content',
                'label' => 'Lists',
                'name' => 'posts_list_widgets',
                'type' => 'flexible_content',
                'layouts' => apply_filters('tk_post_type_list', array() ),
                'button_label' => 'Add List',
                'max' => 4,
            )
        )
    );
    return $widgets;
}
/* add to page widgets group */
add_filter( 'group_tk_page_widgets', 'tk_add_posts_list_widget', 10 );
 
/**
 * Settings for posts
 */
function tk_add_posts_post_list_widget( $layouts )
{
    $layouts[] = array(
        'key' => 'field_tk_widgets_posts_list_posts',
        'name' => 'post_list',
        'label' => 'List of Posts',
        'display' => 'block',
        'sub_fields' => array (
            array (
                'key' => 'field_tk_page_widgets_posts_list_posts_tab_text',
                'label' => 'Tab text',
                'name' => 'tab_text',
                'type' => 'text',
                'instructions' => 'Title of tab when more than one list is displayed',
                'default_value' => 'Posts',
                'placeholder' => 'Posts',
                'maxlength' => 20
            ),
            array (
                'key' => 'field_tk_page_widgets_posts_list_posts_filter',
                'label' => 'Posts Filter',
                'name' => 'posts_filter',
                'type' => 'radio',
                'choices' => array (
                    'none' => 'No filter',
                    'category' => 'Filter by Category',
                    'tag' => 'Filter by Tag',
                ),
                'default_value' => 'none',
                'layout' => 'horizontal',
                'return_format' => 'value',
            ),
            array (
                'key' => 'field_tk_page_widgets_posts_list_posts_filter_category',
                'label' => 'Filter Posts by Category',
                'name' => 'post_category',
                'type' => 'taxonomy',
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_page_widgets_posts_list_posts_filter',
                            'operator' => '==',
                            'value' => 'category',
                        ),
                    ),
                ),
                'taxonomy' => 'category',
                'field_type' => 'checkbox',
                'return_format' => 'id',
                'multiple' => 1,
            ),
            array (
                'key' => 'field_tk_page_widgets_posts_list_posts_filter_tag',
                'label' => 'Filter Posts by Tag',
                'name' => 'post_tag',
                'type' => 'taxonomy',
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_page_widgets_posts_list_posts_filter',
                            'operator' => '==',
                            'value' => 'tag',
                        ),
                    ),
                ),
                'taxonomy' => 'post_tag',
                'field_type' => 'checkbox',
                'return_format' => 'id',
                'multiple' => 1,
            ),
            array (
                'key' => 'field_tk_page_widgets_posts_list_posts_link_text',
                'label' => 'Link text',
                'name' => 'link_text',
                'type' => 'text',
                'instructions' => 'This will link to a Post Archive Page',
                'default_value' => 'View all Posts',
                'placeholder' => 'View all Posts',
                'maxlength' => 30
            ),
            array (
                'key' => 'field_tk_page_widgets_posts_list_posts_link_to_category',
                'label' => 'Link to category archive page?',
                'name' => 'link_to_category',
                'type' => 'true_false',
                'ui' => 1,
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_page_widgets_posts_list_posts_filter',
                            'operator' => '==',
                            'value' => 'category',
                        ),
                    ),
                ),
            ),
            array (
                'key' => 'field_tk_page_widgets_posts_list_posts_link_category',
                'label' => 'Select category',
                'name' => 'link_category',
                'type' => 'taxonomy',
                'taxonomy' => 'category',
                'field_type' => 'select',
                'add_term' => 0,
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_page_widgets_posts_list_posts_link_to_category',
                            'operator' => '==',
                            'value' => 1,
                        ),
                    ),
                ),
                'return_format' => 'id',
                'multiple' => 0,
            ),
            array (
                'key' => 'field_tk_page_widgets_posts_list_posts_link_to_tag',
                'label' => 'Link to tag archive page?',
                'name' => 'link_to_tag',
                'type' => 'true_false',
                'ui' => 1,
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_page_widgets_posts_list_posts_filter',
                            'operator' => '==',
                            'value' => 'tag',
                        ),
                    ),
                ),
            ),
            array (
                'key' => 'field_tk_page_widgets_posts_list_posts_link_tag',
                'label' => 'Select tag',
                'name' => 'link_tag',
                'type' => 'taxonomy',
                'taxonomy' => 'post_tag',
                'field_type' => 'select',
                'add_term' => 0,
                'conditional_logic' => array (
                    array (
                        array (
                            'field' => 'field_tk_page_widgets_posts_list_posts_link_to_tag',
                            'operator' => '==',
                            'value' => 1,
                        ),
                    ),
                ),
                'return_format' => 'id',
                'multiple' => 0,
            ),
        ),
    );
    return $layouts;
}
add_filter('tk_post_type_list', 'tk_add_posts_post_list_widget', 10 );

/**
 * settings for news post type
 */
function tk_add_news_post_list_widget( $layouts )
{
    /** 
     * need to check if plugin is active
     * can't use post_type_exists() as this is called too early (before the post type is registered)
     * @see https://codex.wordpress.org/Function_Reference/is_plugin_active
     */
    include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
    if ( is_plugin_active( 'toolkit-news/init.php' ) ) {
        $layouts[] = array(
            'key' => 'field_tk_widgets_posts_list_news',
            'name' => 'news_list',
            'label' => 'List of News',
            'display' => 'block',
            'sub_fields' => array (
                array (
                    'key' => 'field_tk_widgets_posts_list_news_tab_text',
                    'label' => 'Tab title',
                    'name' => 'tab_text',
                    'type' => 'text',
                    'instructions' => 'Title of tab when more than one list is displayed',
                    'default_value' => 'News',
                    'placeholder' => 'News',
                    'maxlength' => 20,
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_news_filter',
                    'label' => 'News Filter',
                    'name' => 'news_filter',
                    'type' => 'radio',
                    'choices' => array (
                        'none' => 'No filter',
                        'category' => 'Filter by Category',
                        'tag' => 'Filter by Tag',
                    ),
                    'default_value' => 'none',
                    'layout' => 'horizontal',
                    'return_format' => 'value',
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_news_filter_category',
                    'label' => 'Filter News by Category',
                    'name' => 'news_category',
                    'type' => 'taxonomy',
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_news_filter',
                                'operator' => '==',
                                'value' => 'category',
                            ),
                        ),
                    ),
                    'taxonomy' => 'news_category',
                    'field_type' => 'checkbox',
                    'return_format' => 'id',
                    'multiple' => 1,
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_news_filter_tag',
                    'label' => 'Filter News by Tag',
                    'name' => 'news_tag',
                    'type' => 'taxonomy',
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_news_filter',
                                'operator' => '==',
                                'value' => 'tag',
                            ),
                        ),
                    ),
                    'taxonomy' => 'news_tag',
                    'field_type' => 'checkbox',
                    'return_format' => 'id',
                    'multiple' => 1,
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_news_link_text',
                    'label' => 'Link text',
                    'name' => 'link_text',
                    'type' => 'text',
                    'instructions' => 'This will link to the News Archive Page',
                    'default_value' => 'View all News',
                    'placeholder' => 'View all News',
                    'maxlength' => 30
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_news_link_to_category',
                    'label' => 'Link to category archive page?',
                    'name' => 'link_to_category',
                    'type' => 'true_false',
                    'ui' => 1,
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_news_filter',
                                'operator' => '==',
                                'value' => 'category',
                            ),
                        ),
                    ),
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_news_link_category',
                    'label' => 'Select category',
                    'name' => 'link_category',
                    'type' => 'taxonomy',
                    'taxonomy' => 'news_category',
                    'field_type' => 'select',
                    'add_term' => 0,
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_news_link_to_category',
                                'operator' => '==',
                                'value' => 1,
                            ),
                        ),
                    ),
                    'return_format' => 'id',
                    'multiple' => 0,
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_news_link_to_tag',
                    'label' => 'Link to tag archive page?',
                    'name' => 'link_to_tag',
                    'type' => 'true_false',
                    'ui' => 1,
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_news_filter',
                                'operator' => '==',
                                'value' => 'tag',
                            ),
                        ),
                    ),
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_news_link_tag',
                    'label' => 'Select tag',
                    'name' => 'link_tag',
                    'type' => 'taxonomy',
                    'taxonomy' => 'news_tag',
                    'field_type' => 'select',
                    'add_term' => 0,
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_news_link_to_tag',
                                'operator' => '==',
                                'value' => 1,
                            ),
                        ),
                    ),
                    'return_format' => 'id',
                    'multiple' => 0,
                ),
            ),
        );
    }
    return $layouts;
}
add_filter('tk_post_type_list', 'tk_add_news_post_list_widget', 11 );

/**
 * settings for events post type
 */
function tk_add_events_post_list_widget( $layouts )
{
    /** 
     * need to check if plugin is active
     * can't use post_type_exists() as this is called too early (before the post type is registered)
     * @see https://codex.wordpress.org/Function_Reference/is_plugin_active
     */
    include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
    if ( is_plugin_active( 'toolkit-events/init.php' ) ) {
        $layouts[] = array(
            'key' => 'field_tk_widgets_posts_list_events',
            'name' => 'events_list',
            'label' => 'List of Events',
            'display' => 'block',
            'sub_fields' => array (
                array (
                    'key' => 'field_tk_page_widgets_posts_list_events_tab_text',
                    'label' => 'Tab title',
                    'name' => 'tab_text',
                    'type' => 'text',
                    'instructions' => 'Title of tab when more than one list is displayed',
                    'default_value' => 'Events',
                    'placeholder' => 'Events',
                    'maxlength' => 20
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_events_filter',
                    'label' => 'Events Filter',
                    'name' => 'events_filter',
                    'type' => 'radio',
                    'choices' => array (
                        'none' => 'No filter',
                        'category' => 'Filter by Category',
                        'tag' => 'Filter by Tag',
                    ),
                    'default_value' => 'none',
                    'layout' => 'horizontal',
                    'return_format' => 'value',
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_events_filter_category',
                    'label' => 'Filter Events by Category',
                    'name' => 'event_category',
                    'type' => 'taxonomy',
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_events_filter',
                                'operator' => '==',
                                'value' => 'category',
                            ),
                        ),
                    ),
                    'taxonomy' => 'event_category',
                    'field_type' => 'checkbox',
                    'return_format' => 'id',
                    'multiple' => 1,
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_events_filter_tag',
                    'label' => 'Filter Events by Tag',
                    'name' => 'event_tag',
                    'type' => 'taxonomy',
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_events_filter',
                                'operator' => '==',
                                'value' => 'tag',
                            ),
                        ),
                    ),
                    'taxonomy' => 'event_tag',
                    'field_type' => 'checkbox',
                    'return_format' => 'id',
                    'multiple' => 1,
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_events_show_past',
                    'label' => 'Show Past Events?',
                    'name' => 'show_past_events',
                    'type' => 'true_false',
                    'message' => 'Do you want to include past events as well as future events?',
                    'default_value' => 0,
                    'ui' => 1,
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_events_link_text',
                    'label' => 'Link text',
                    'name' => 'link_text',
                    'type' => 'text',
                    'instructions' => 'This will link to an Events Archive Page',
                    'default_value' => 'View all Events',
                    'placeholder' => 'View all Events',
                    'maxlength' => 30
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_events_link_to_category',
                    'label' => 'Link to category archive page?',
                    'name' => 'link_to_category',
                    'type' => 'true_false',
                    'ui' => 1,
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_events_filter',
                                'operator' => '==',
                                'value' => 'category',
                            ),
                        ),
                    ),
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_events_link_category',
                    'label' => 'Select category',
                    'name' => 'link_category',
                    'type' => 'taxonomy',
                    'taxonomy' => 'event_category',
                    'field_type' => 'select',
                    'add_term' => 0,
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_events_link_to_category',
                                'operator' => '==',
                                'value' => 1,
                            ),
                        ),
                    ),
                    'return_format' => 'id',
                    'multiple' => 0,
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_events_link_to_tag',
                    'label' => 'Link to tag archive page?',
                    'name' => 'link_to_tag',
                    'type' => 'true_false',
                    'ui' => 1,
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_events_filter',
                                'operator' => '==',
                                'value' => 'tag',
                            ),
                        ),
                    ),
                ),
                array (
                    'key' => 'field_tk_page_widgets_posts_list_events_link_tag',
                    'label' => 'Select tag',
                    'name' => 'link_tag',
                    'type' => 'taxonomy',
                    'taxonomy' => 'event_tag',
                    'field_type' => 'select',
                    'add_term' => 0,
                    'conditional_logic' => array (
                        array (
                            array (
                                'field' => 'field_tk_page_widgets_posts_list_events_link_to_tag',
                                'operator' => '==',
                                'value' => 1,
                            ),
                        ),
                    ),
                    'return_format' => 'id',
                    'multiple' => 0,
                ),
            ),
        );
    }
    return $layouts;
}
add_filter('tk_post_type_list', 'tk_add_events_post_list_widget', 12 );

