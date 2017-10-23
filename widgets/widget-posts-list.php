<?php 

print_r(get_sub_field('widget_title'));exit;
// see which post types are to be displayed
$widget_options = get_sub_field('news_events_widget_options'); 					
$news_flag = in_array('news', $widget_options);
$events_flag = in_array('events', $widget_options);
$posts_flag = in_array('posts', $widget_options);
$posts_data = array();

if ( count( $widget_options ) ) {

    $has_news = $has_events = $has_posts = false;

    if ( $news_flag ) {
         
        $posts_data['news'] = array();

        // build arguments for WP_Query
        $args = array( 
            'post_type' => 'news', 
            'posts_per_page' => 4
        );

        // news_settings is a group
        $posts_data['news']['settings'] = get_sub_field( 'news_settings' );

        if ( $posts_data['news']['settings'] ) {

            // see whether we are filtering by category or tag and add tax_query
            if ( $posts_data['news']['settings']['news_filter'] === 'category' ) {
                if ( isset( $posts_data['news']['settings']['news_category'] ) && count( $posts_data['news']['settings']['news_category'] ) ) {
                    $args['tax_query'] = array(
                        array(
                            'taxonomy' => 'news_category',
                            'field' => 'term_id',
                            'terms' => $posts_data['news']['settings']['news_category'] 
                        )
                    );
                }
            } elseif ( $posts_data['news']['settings']['news_filter'] === 'tag' ) {
                if ( isset( $posts_data['news']['settings']['news_tag'] ) && count( $posts_data['news']['settings']['news_tag'] ) ) {
                    $args['tax_query'] = array(
                        array(
                            'taxonomy' => 'news_tag',
                            'field' => 'term_id',
                            'terms' => $posts_data['news']['settings']['news_tag'] 
                        )
                    );
                }
            }
        }

        // fetch news items
        $loop_news = new WP_Query( $args );
        $has_news = $loop_news->post_count > 0;
        $posts_data['news']['posts'] = array();
        if ( $has_news ) {
            while ( $loop_news->have_posts() ) : $loop_news->the_post();
                if ( has_post_thumbnail() ) {
                    $thumbnail_url = get_post_thumbnail_url();
                } else {
                    $thumbnail_url = false;
                }
                $posts_data['news']['posts'][] = array(
                    'type' => 'news',
                    'title' => get_the_title(),
                    'url' => get_permalink(),
                    'excerpt' => tk_get_excerpt('tk_card_length'),
                    'date' => get_the_time('l j F Y'),
                    'thumbnail_url' => $thumbnail_url
                );
            endwhile;
        }
    }

    if ( $events_flag ) {

        $posts_data['events'] = array();

        $posts_data['events']['settings'] = get_sub_field( 'events_settings' );
        
        $today = date('Ymd');

        $tax_query = false;

        $loop_past_events = false;

        if ( $posts_data['events']['settings'] ) {

            // see whether we are filtering by category or tag and add tax_query
            if ( $posts_data['events']['settings']['events_filter'] === 'category' ) {
                if ( isset( $posts_data['events']['settings']['events_category'] ) && count( $posts_data['events']['settings']['events_category'] ) ) {
                    $tax_query = array(
                        array(
                            'taxonomy' => 'events_category',
                            'field' => 'term_id',
                            'terms' => $posts_data['events']['settings']['events_category'] 
                        )
                    );
                }
            } elseif ( $posts_data['events']['settings']['events_filter'] === 'tag' ) {
                if ( isset( $posts_data['events']['settings']['events_tag'] ) && count( $posts_data['events']['settings']['events_tag'] ) ) {
                    $tax_query = array(
                        array(
                            'taxonomy' => 'events_tag',
                            'field' => 'term_id',
                            'terms' => $posts_data['events']['settings']['events_tag'] 
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
        $has_events = $loop_current_events->post_count > 0;
        $posts_data['events']['posts'] = array();
        if ( $loop_current_events->post_count ) {
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
                $posts_data['events']['posts'][] = array(
                    'type' => 'event',
                    'title' => get_the_title(),
                    'url' => get_permalink(),
                    'excerpt' => tk_get_excerpt('tk_card_length'),
                    'date' => $event_date,
                    'thumbnail_url' => $thumbnail_url
                );
            endwhile;
        }

        if ( $posts_data['events']['settings'] && $posts_data['events']['settings']['show_past_events'] ) {
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
                        $posts_data['events']['posts'][] = array(
                            'type' => 'event',
                            'title' => get_the_title(),
                            'url' => get_permalink(),
                            'excerpt' => tk_get_excerpt('tk_card_length'),
                            'date' => $event_date,
                            'thumbnail_url' => $thumbnail_url
                        );
                    endwhile;
                }
                if ( ! $has_events ) {
                    $has_events = $loop_past_events->post_count > 0;
                }
            }
        }
    }

    if ( $posts_flag ) {
         
        // build arguments for WP_Query
        $args = array( 
            'post_type' => 'post', 
            'posts_per_page' => 4
        );

        $posts_data['post'] = array();

        $posts_data['post']['settings'] = get_sub_field( 'posts_settings' );

        if ( $posts_data['post']['settings'] ) {

            // see whether we are filtering by category or tag and add tax_query
            if ( $posts_data['post']['settings']['posts_filter'] === 'category' ) {
                if ( isset( $posts_data['post']['settings']['post_category'] ) && count( $posts_data['post']['settings']['post_category'] ) ) {
                    $args['tax_query'] = array(
                        array(
                            'taxonomy' => 'category',
                            'field' => 'term_id',
                            'terms' => $posts_data['post']['settings']['post_category'] 
                        )
                    );
                }
            } elseif ( $posts_data['post']['settings']['posts_filter'] === 'tag' ) {
                if ( isset( $posts_data['post']['settings']['post_tag'] ) && count( $posts_data['post']['settings']['post_tag'] ) ) {
                    $args['tax_query'] = array(
                        array(
                            'taxonomy' => 'post_tag',
                            'field' => 'term_id',
                            'terms' => $posts_data['post']['settings']['post_tag'] 
                        )
                    );
                }
            }
        }

        // fetch news items
        $loop_posts = new WP_Query( $args );
        $has_posts = $loop_posts->post_count > 0;
        $posts_data['post']['posts'] = array();
        if ( $has_posts ) {
            while ( $loop_posts->have_posts() ) : $loop_posts->the_post();
                if ( has_post_thumbnail() ) {
                    $thumbnail_url = get_post_thumbnail_url();
                } else {
                    $thumbnail_url = false;
                }
                $posts_data['post']['posts'][] = array(
                    'type' => 'post',
                    'title' => get_the_title(),
                    'url' => get_permalink(),
                    'excerpt' => tk_get_excerpt('tk_card_length'),
                    'date' => get_the_time('l j F Y'),
                    'thumbnail_url' => $thumbnail_url
                );
            endwhile;
        }
    }

    if ( $has_news || $has_events || $has_posts ) {

        // container
        print('<div class="skin-row-module-light container-row"><div class="wrapper-lg wrapper-pd-md">');
        $widget_title = get_sub_field( 'widget_title' );
        if ( ! $widget_title ) {
            if ( $has_news && $has_events && $has_posts ) {
                $widget_title = "News, events and posts";
            } elseif( $has_news && $has_posts ) { 
                $widget_title = "News and posts";
            } elseif( $has_events && $has_posts ) {
                $widget_title = "Events and posts";        
            } elseif( $has_news && $has_events ) {
                $widget_title = "News and events";
            } elseif( $has_events ) {
                $widget_title = "Events";
            } elseif( $has_posts ) {
                $widget_title = "Posts";
            } elseif( $has_news ) {
                $widget_title = "News";
            }
        }
        printf('<h3 class="h2-lg heading-underline">%s</h3>', $widget_title );

        // whether to display tabs  
        $tab_flag = ( ( $has_news + $has_events + $has_posts ) > 1 ); 

        // set a default sort order
        $post_type_sort = array("news" => 1, "events" => 2, "post" => 3);
        

        if ( $tab_flag ) {

            print('<div class="tk-tabs-header"><ul class="nav nav-tabs tk-nav-tabs pull-left">');
            
            // get sort order from group
            $sort_order = get_sub_field( 'sort_order' );
            if ( $sort_order ) {
                $post_type_sort["news"] = intval( $sort_order["news_sort_order"] );
                $post_type_sort["events"] = intval( $sort_order["events_sort_order"] );
                $post_type_sort["post"] = intval( $sort_order["posts_sort_order"] );
            }
            asort($post_type_sort);
            $active_flag = true;
            foreach( $post_type_sort as $post_type => $idx ) {
                if ( isset($posts_data[$post_type]) && count( $posts_data[$post_type]['posts'] ) ) {
                    $tab_title = $posts_data[$post_type]['settings']['tab_text'];
                    if ( ! $tab_title ) {
                        $tab_title = ( $post_type == 'post' ) ? 'Posts': ucfirst($post_type);
                    }
                    $class = '';
                    if ( $active_flag ) {
                        $class = ' class="active"';
                        $active_flag = false;
                    }
                    printf('<li%s><a href="#%s" data-toggle="tab">%s</a></li>', $class, $post_type, $tab_title );
                }
            }
            print('</ul></div>');
        }

        $active_flag = true;
        foreach( $post_type_sort as $post_type => $idx ) {
            if ( isset($posts_data[$post_type]) && count( $posts_data[$post_type]['posts'] ) ) {
				if( $tab_flag ) {
                    if ( $active_flag ) {
                        $active_class = 'active';
                        $active_flag = false;
                    } else {
                        $active_class = '';
                    }
                    printf('<div class="tab-pane fade in %s" id="%s">', $active_class, $post_type );
			    } else {
                    print('<div>');
                }
                $link_text = $posts_data[$post_type]['settings']['link_text'];
                if ( ! $link_text ) {
                    $link_text = ( $post_type == 'post' ) ? 'See all Posts': 'See all ' . ucfirst($post_type);
                }
                $archive_link = get_post_type_archive_link($post_type);
                if ( $post_type == 'post' ) {
                    if ( get_option( 'page_for_posts' ) ) { 
                        $archive_link = get_permalink( get_option( 'page_for_posts' ) ); 
                    }
                } 
                printf('<p class="tk-tabs-cta"><a class="more more-all more-dark pull-right" href="%s">%s</a></p>', $archive_link, $link_text );

                print('<div class="equalize"><div class="tk-row row-reduce-gutter">');
                foreach ( $posts_data[$post_type]['posts'] as $post ) {
                    print(tk_get_post_card($post));
                }
                print('</div></div></div>');
            }
        }
        print('</div></div>');
    }
}

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