<?php 
/**
 * Template to display lists of posts
 * Data comes from ACF repeater field which gathers settings for different
 * post types. Maximum of four posts are displayed as stacked cards, and
 * where multiple layouts are configured, displayed in tabs.
 */

$layouts = get_sub_field('posts_list_widgets');
$widget_title = get_sub_field( 'widget_title' );
if ( count( $layouts ) ) {
    // collect data for tabs and panels here
    $tabs = array();
    $panels = array();

    // see if there is any content to display
    $tab_count = 1;
    foreach ( $layouts as $layout ) {
        $layout_name = $layout['acf_fc_layout'];
        switch ($layout_name) {
            case 'post_list':
                $panel = tk_post_list_widget_get_posts_list( $layout );
                if ( '' !== $panel ) {
                    // link to archive
                    $archive_link = tk_get_post_archive_link( $layout, 'post' );
                    // list html
                    $panels['posts-list-tab-' . $tab_count] = sprintf('%s<div class="equalize"><div class="tk-row row-reduce-gutter">%s</div></div>', $archive_link, $panel );
                    // tab link
                    $tabs['posts-list-tab-' . $tab_count] = sprintf('<a href="#posts-list-tab-%s" data-toggle="tab">%s</a>', $tab_count, $layout['tab_text'] );
                    $tab_count++;
                }
                break;
            case 'news_list':
                $panel = tk_post_list_widget_get_news_list( $layout );
                if ( '' !== $panel ) {
                    // link to archive
                    $archive_link = tk_get_post_archive_link( $layout, 'news' );
                    // list html
                    $panels['posts-list-tab-' . $tab_count] = sprintf('%s<div class="equalize"><div class="tk-row row-reduce-gutter">%s</div></div>', $archive_link, $panel );
                    // tab link
                    $tabs['posts-list-tab-' . $tab_count] = sprintf('<a href="#posts-list-tab-%s" data-toggle="tab">%s</a>', $tab_count, $layout['tab_text'] );
                    $tab_count++;
                }
                break;
            case 'events_list':
                $panel = tk_post_list_widget_get_events_list( $layout );
                if ( '' !== $panel ) {
                    // link to archive
                    $archive_link = tk_get_post_archive_link( $layout, 'events' );
                    // list html
                    $panels['posts-list-tab-' . $tab_count] = sprintf('%s<div class="equalize"><div class="tk-row row-reduce-gutter">%s</div></div>', $archive_link, $panel );
                    // tab link
                    $tabs['posts-list-tab-' . $tab_count] = sprintf('<a href="#posts-list-tab-%s" data-toggle="tab">%s</a>', $tab_count, $layout['tab_text'] );
                    $tab_count++;
                }
                break;
        }
    }

    // display content
    if ( count($tabs) ) {
        $is_active = true;
        $tab_content = '';
        $panel_content = '';
        print('<div class="skin-row-module-light container-row"><div class="wrapper-lg wrapper-pd-md">');
        if ( $widget_title ) {
            printf('<h3 class="h2-lg heading-underline">%s</h3>', $widget_title );
        }
        if ( count($tabs) > 1) {
            // more than one list - output tabs
            $tab_content .= '<div class="tk-tabs-header"><ul class="nav nav-tabs tk-nav-tabs pull-left">';
            $panel_content = '<div class="tab-content">';
            foreach ( $tabs as $id => $tab ) {
                if ( $is_active ) {
                    $class = ' active in';
                    $classattr = ' class="active"';
                    $is_active = false;
                } else {
                    $class = '';
                    $classattr = '';
                }
                $tab_content .= sprintf('<li%s>%s</li>', $classattr, $tab );
                $panel_content .= sprintf( '<div class="tab-pane fade%s" id="%s">%s</div>', $class, $id, $panels[$id] );
            }
            $tab_content .= '</ul></div>';
            $panel_content .= '</div>';
        } else {
            // one list
            $panel_content = sprintf('<div>%s</div>', implode('', $panels) );
        }
        print $tab_content . $panel_content;
        print('</div></div>');
    }
}

/**
 * Gets a list of news using a custom query
 * @uses tk_get_post_card()
 * @param array settings from ACF fields
 * @return string HTML (cards)
 */
function tk_post_list_widget_get_news_list( $settings )
{
    $out = '';

    // build arguments for WP_Query
    $args = array( 
        'post_type' => 'news', 
        'posts_per_page' => 4
    );

    // see whether we are filtering by category or tag and add tax_query
    if ( isset( $settings['news_filter'] ) ) {
        if ( $settings['news_filter'] === 'category' ) {
            if ( isset( $settings['news_category'] ) && count( $settings['news_category'] ) ) {
                $args['tax_query'] = array(
                    array(
                        'taxonomy' => 'news_category',
                        'field' => 'term_id',
                        'terms' => $settings['news_category'] 
                    )
                );
            }
        } elseif ( $settings['news_filter'] === 'tag' ) {
            if ( isset( $settings['news_tag'] ) && count( $settings['news_tag'] ) ) {
                $args['tax_query'] = array(
                    array(
                        'taxonomy' => 'news_tag',
                        'field' => 'term_id',
                        'terms' => $settings['news_tag'] 
                    )
                );
            }
        }
    }

    // fetch news items
    $loop_news = new WP_Query( $args );
    $has_news = $loop_news->post_count > 0;
    if ( $has_news ) {
        while ( $loop_news->have_posts() ) : $loop_news->the_post();
            if ( has_post_thumbnail() ) {
                $thumbnail_url = get_the_post_thumbnail_url();
            } else {
                $thumbnail_url = false;
            }
            $out .= tk_get_post_card( array(
                'type' => 'news',
                'title' => get_the_title(),
                'url' => get_permalink(),
                'excerpt' => tk_get_excerpt('tk_card_length'),
                'date' => get_the_time('l j F Y'),
                'thumbnail_url' => $thumbnail_url
            ) );
        endwhile;
    }
    return $out;
}

/**
 * Gets a list of posts using a custom query
 * @uses tk_get_post_card()
 * @param array settings from ACF fields
 * @return string HTML (cards)
 */
function tk_post_list_widget_get_posts_list( $settings )
{
    $out = '';

    // build arguments for WP_Query
    $args = array( 
        'post_type' => 'post', 
        'posts_per_page' => 4
    );

    // see whether we are filtering by category or tag and add tax_query
    if ( isset( $settings['posts_filter'] ) ) {
        if ( $settings['posts_filter'] === 'category' ) {
            if ( isset( $settings['post_category'] ) && count( $settings['post_category'] ) ) {
                $args['tax_query'] = array(
                    array(
                        'taxonomy' => 'category',
                        'field' => 'term_id',
                        'terms' => $settings['post_category'] 
                    )
                );
            }
        } elseif ( $settings['posts_filter'] === 'tag' ) {
            if ( isset( $settings['post_tag'] ) && count( $settings['post_tag'] ) ) {
                $args['tax_query'] = array(
                    array(
                        'taxonomy' => 'post_tag',
                        'field' => 'term_id',
                        'terms' => $settings['post_tag'] 
                    )
                );
            }
        }
    }

    // fetch posts
    $loop_posts = new WP_Query( $args );
    $has_posts = $loop_posts->post_count > 0;
    if ( $has_posts ) {
        while ( $loop_posts->have_posts() ) : $loop_posts->the_post();
            if ( has_post_thumbnail() ) {
                $thumbnail_url = get_the_post_thumbnail_url();
            } else {
                $thumbnail_url = false;
            }
            $out .= tk_get_post_card( array(
                'type' => 'post',
                'title' => get_the_title(),
                'url' => get_permalink(),
                'excerpt' => tk_get_excerpt('tk_card_length'),
                'date' => get_the_time('l j F Y'),
                'thumbnail_url' => $thumbnail_url
            ) );
        endwhile;
    }
    return $out;
}

/**
 * Gets a list of events using a custom query
 * First a query is made for current/future events, then (if specified in
 * settings) past events if there is any space
 * @uses tk_get_post_card()
 * @param array settings from ACF fields
 * @return string HTML (cards)
 */
function tk_post_list_widget_get_events_list( $settings )
{
    $out = '';
    $tax_query = false;

    // see whether we are filtering by category or tag and add tax_query
    if ( isset( $settings['events_filter'] ) ) {
        if ( $settings['events_filter'] === 'category' ) {
            if ( isset( $settings['events_category'] ) && count( $settings['events_category'] ) ) {
                $tax_query = array(
                    array(
                        'taxonomy' => 'events_category',
                        'field' => 'term_id',
                        'terms' => $settings['events_category'] 
                    )
                );
            }
        } elseif ( $settings['events_filter'] === 'tag' ) {
            if ( isset( $settings['events_tag'] ) && count( $settings['events_tag'] ) ) {
                $tax_query = array(
                    array(
                        'taxonomy' => 'events_tag',
                        'field' => 'term_id',
                        'terms' => $settings['events_tag'] 
                    )
                );
            }
        }
    }

    $args_current = array(
        'post_type'         => 'events', 
        'posts_per_page'    => 4,
        'meta_key'          => 'tk_events_start_date',
        'orderby'           => 'meta_value_num',
        'order'             => 'ASC',       
        'meta_query' => array(
            'relation' => 'OR',
            array(
                'key'     => 'tk_events_start_date',
                'value'   => '',
                'compare' => '=',
            ),
            array(
                'relation' => 'OR',
                array(
                        'key' => 'tk_events_end_date',
                        'value' => $today,
                        'compare' => '>=',
                ),
                array(
                        'key' => 'tk_events_start_date',
                        'value' => $today,
                        'compare' => '>=',
                ),
            ),
        ),
    );
    if ( $tax_query ) {
        $args['tax_query'] = $tax_query;
    } 

    // fetch current events
    $loop_current_events = new WP_Query( $args_current );
    $has_events = $loop_current_events->post_count;
    if ( $has_events ) {
        while ( $loop_current_events->have_posts() ) : $loop_current_events->the_post();
            if ( get_field( 'tk_events_start_date' ) ) {                            
                $start_date = get_field('tk_events_start_date');
                $end_date = get_field( 'tk_events_end_date' );
                if ($end_date && $start_date != $end_date ) {
                    $event_date = date('j M Y', strtotime( $start_date ) ) . ' - ' . date('j M Y', strtotime( $end_date ) );
                } else {
                    $event_date = date('j F Y', strtotime( $start_date ) );
                }
            } else {
                $event_date = '';
            }
            if ( has_post_thumbnail() ) {
                $thumbnail_url = get_post_thumbnail_url();
            } else {
                $thumbnail_url = false;
            }
            $out .= tk_get_post_card( array(
                'type' => 'event',
                'title' => get_the_title(),
                'url' => get_permalink(),
                'excerpt' => tk_get_excerpt('tk_card_length'),
                'date' => $event_date,
                'thumbnail_url' => $thumbnail_url
            ) );
        endwhile;
    }

    if ( isset( $settings['show_past_events'] ) && $settings['show_past_events'] ) {
        // showing past events - first figure if we need any
        $remainder = 4 - $has_events;
        if ( $remainder > 0 ) {
            $args_past = array(
                'post_type'         => 'events', 
                'posts_per_page'    => $remainder,
                'meta_key'          => 'tk_events_start_date',
                'orderby'           => 'meta_value_num',
                'order'             => 'DESC',       
                'meta_query' => array(
                    'relation' => 'OR',
                    array(
                            'key' => 'tk_events_end_date',
                            'value' => $today,
                            'compare' => '<',
                    ),
                    array(
                            'key' => 'tk_events_start_date',
                            'value' => $today,
                            'compare' => '<',
                    ),
                ),
            );
            if ( $tax_query ) {
                $args['tax_query'] = $tax_query;
            } 
            // fetch past events
            $loop_past_events = new WP_Query( $args_past );
            if ( $loop_past_events->post_count ) {
                while ( $loop_past_events->have_posts() ) : $loop_past_events->the_post();
                    if ( get_field( 'tk_events_start_date' ) ) {                            
                        $start_date = get_field('tk_events_start_date');
                        $end_date = get_field( 'tk_events_end_date' );
                        if ($end_date && $start_date != $end_date ) {
                            $event_date = date('j M Y', strtotime( $start_date ) ) . ' - ' . date('j M Y', strtotime( $end_date ) );
                        } else {
                            $event_date = date('j F Y', strtotime( $start_date ) );
                        }
                    } else {
                        $event_date = '';
                    }
                    if ( has_post_thumbnail() ) {
                        $thumbnail_url = get_post_thumbnail_url();
                    } else {
                        $thumbnail_url = false;
                    }
                    $out .= tk_get_post_card( array(
                        'type' => 'event',
                        'title' => get_the_title(),
                        'url' => get_permalink(),
                        'excerpt' => tk_get_excerpt('tk_card_length'),
                        'date' => $event_date,
                        'thumbnail_url' => $thumbnail_url
                    ) );
                endwhile;
            }
        }
    }
    return $out;
}
/**
 * returns the HTML for an archive link
 * @param array
 */
function tk_get_post_archive_link( $layout, $post_type )
{
    $taxonomies = array(
        'post' => array(
            'category' => 'category',
            'tag' => 'post_tag'
        ),
        'events' => array(
            'category' => 'event_category',
            'tag' => 'event_tag'
        ),
        'news' => array(
            'category' => 'news_category',
            'tag' => 'news_tag'
        )
    );
    $archive_link = '';
    if ( isset( $layout['link_text'] ) && $layout['link_text'] ) {
        $archive_link_text = $layout['link_text'];
        $archive_link_url = false;
        if ( isset($layout['link_to_category']) && $layout['link_to_category'] ) {
            if ( isset($layout['link_category']) && $layout['link_category'] ) {
                $archive_link_url = get_term_link($layout['link_category'], $taxonomies[$post_type]['category']);
            }
        }
        if ( isset( $layout['link_to_tag'] ) && $layout['link_to_tag'] ) {
            if ( isset($layout['link_tag']) && $layout['link_tag'] ) {
                $archive_link_url = get_term_link($layout['link_tag'], $taxonomies[$post_type]['tag']);
            }
        }
        if ( ! $archive_link_url || is_wp_error($archive_link_url) ) {
            $archive_link_url = get_post_type_archive_link($post_type);
        }
        $archive_link = sprintf('<p class="tk-tabs-cta"><a class="more more-all more-dark pull-right" href="%s">%s</a></p>', $archive_link_url, $archive_link_text);
    }
    return $archive_link;
}

/**
 * returns the HTML for a card based on data passed in associative array
 * @param array with the following members
 *  - type (post type)
 *  - title
 *  - thumbnail_url
 *  - date
 *  - url
 *  - excerpt
 */
function tk_get_post_card( $post )
{
    $out = sprintf('<div class="%s-item col-sm-6 col-md-3"><div class="card card-stacked skin-box-white skin-bd-b">', $post['type'] );
    if ( $post['thumbnail_url'] ) {
        $out .= sprintf('<div class="card-img"><div class="rs-img rs-img-2-1" style="background-image: url(\'%s\');"><a href="%s"><img src="%s" alt="%s"></a></div></div>',  $post['thumbnail_url'], $post['url'], $post['thumbnail_url'], esc_attr($post["title"]) );
    }
    $out .= '<div class="card-content equalize-inner">';
    $out .= sprintf('<h3 class="heading-link-alt"><a href="%s">%s</a></h3>', $post['url'], $post['title'] );
    if ( $post['date'] ) {
        $out .= sprintf('<p class="heading-related">%s</p>', $post['date'] );
    }
    $out .= sprintf('<div class="note">%s</div><a class="more" href="%s">more</a>', $post['excerpt'], $post['url'] );
    $out .= '</div></div></div>';
    return $out;
}