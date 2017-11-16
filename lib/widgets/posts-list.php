<?php
/**
 * posts_list_widget
 * class to retrieve posts and pass back data to page templates
 * for the posts list widget
 */

if ( ! class_exists( 'tk_posts_list_widget' ) ) {

    class tk_posts_list_widget
    {
        /**
         * @var integer ID used for instances of each list
         */
        private static $tk_post_list_widget_instance = 0;

        /**
         * constructor - set up with Wordpress API
         */
        public function __construct()
        {
            /**
             * add filter for post_widget layouts
             */
            add_filter( 'tk_post_list_widget_layout', array( $this, 'get_list' ), 10, 3 );
        }

        /**
         * gets an instance ID for each list
         * @return integer
         */
        private function get_instance_id()
        {
            return self::$tk_post_list_widget_instance++;
        }

        /**
         * gets a list of posts by delegating work to other class methods
         */
        public function get_list( $list, $layout_name, $layout_data )
        {
            $m = 'get_' . $layout_name;
            if ( method_exists( $this, $m ) ) {
                return $this->$m( $layout_data );
            }
            return array();
        }

        /**
         * Gets a list of news using a custom query
         * @uses tk_get_post_card()
         * @param array settings from ACF fields
         * @return string HTML (cards)
         */
        public function get_news_list( $layout )
        {
            $items = array();

            // build arguments for WP_Query
            $args = array( 
                'post_type' => 'news', 
                'posts_per_page' => 4
            );

            // see whether we are filtering by category or tag and add tax_query
            if ( isset( $layout['news_filter'] ) ) {
                if ( $layout['news_filter'] === 'category' ) {
                    if ( isset( $layout['news_category'] ) && count( $layout['news_category'] ) ) {
                        $args['tax_query'] = array(
                            array(
                                'taxonomy' => 'news_category',
                                'field' => 'term_id',
                                'terms' => $layout['news_category'] 
                            )
                        );
                    }
                } elseif ( $layout['news_filter'] === 'tag' ) {
                    if ( isset( $layout['news_tag'] ) && count( $layout['news_tag'] ) ) {
                        $args['tax_query'] = array(
                            array(
                                'taxonomy' => 'news_tag',
                                'field' => 'term_id',
                                'terms' => $layout['news_tag'] 
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
                    $items[] = array(
                        'type' => 'news',
                        'title' => get_the_title(),
                        'url' => get_permalink(),
                        'excerpt' => tk_get_excerpt('tk_card_length'),
                        'date' => get_the_time('l j F Y'),
                        'thumbnail_url' =>  $this->get_thumbnail_url( $layout, get_the_ID() )
                    );
                endwhile;
                wp_reset_postdata();
            }

            // if there are any news items, populate the return array with data
            if ( count( $items ) ) {
                return array(
                    "post_type"    => "news",
                    "archive_link" => $this->get_archive_link( $layout, 'news' ),
                    "tab_text"     => $layout["tab_text"],
                    "instance_id"  => $this->get_instance_id(),
                    "items"        => $items
                );
            } else {
                return array();
            }
        }

        /**
         * Gets a list of posts using a custom query
         * @param array settings from ACF fields
         * @return string HTML (cards)
         */
        public function get_post_list( $layout )
        {
            $items = array();

            // build arguments for WP_Query
            $args = array( 
                'post_type' => 'post', 
                'posts_per_page' => 4
            );

            // see whether we are filtering by category or tag and add tax_query
            if ( isset( $layout['posts_filter'] ) ) {
                if ( $layout['posts_filter'] === 'category' ) {
                    if ( isset( $layout['post_category'] ) && count( $layout['post_category'] ) ) {
                        $args['tax_query'] = array(
                            array(
                                'taxonomy' => 'category',
                                'field' => 'term_id',
                                'terms' => $layout['post_category'] 
                            )
                        );
                    }
                } elseif ( $layout['posts_filter'] === 'tag' ) {
                    if ( isset( $layout['post_tag'] ) && count( $layout['post_tag'] ) ) {
                        $args['tax_query'] = array(
                            array(
                                'taxonomy' => 'post_tag',
                                'field' => 'term_id',
                                'terms' => $layout['post_tag'] 
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
                    $items[] = array(
                        'type' => 'post',
                        'title' => get_the_title(),
                        'url' => get_permalink(),
                        'excerpt' => tk_get_excerpt('tk_card_length'),
                        'date' => get_the_time('l j F Y'),
                        'thumbnail_url' =>  $this->get_thumbnail_url( $layout, get_the_ID() )
                    );
                endwhile;
                wp_reset_postdata();
            }

            // if there are any post items, populate the return array with data
            if ( count( $items ) ) {
                return array(
                    "post_type"    => "post",
                    "archive_link" => $this->get_archive_link( $layout, 'post' ),
                    "tab_text"     => $layout["tab_text"],
                    "instance_id"  => $this->get_instance_id(),
                    "items"        => $items
                );
            } else {
                return array();
            }
        }

        /**
         * Gets a list of events using a custom query
         * First a query is made for current/future events, then (if specified in
         * settings) past events if there is any space
         * @uses tk_get_post_card()
         * @param array settings from ACF fields
         * @return string HTML (cards)
         */
        public function get_events_list( $layout )
        {
            $items = array();
            $tax_query = false;

            // see whether we are filtering by category or tag and add tax_query
            if ( isset( $layout['events_filter'] ) ) {
                if ( $layout['events_filter'] === 'category' ) {
                    if ( isset( $layout['event_category'] ) && count( $layout['event_category'] ) ) {
                        $tax_query = array(
                            array(
                                'taxonomy' => 'event_category',
                                'field' => 'term_id',
                                'terms' => $layout['event_category'] 
                            )
                        );
                    }
                } elseif ( $layout['events_filter'] === 'tag' ) {
                    if ( isset( $layout['event_tag'] ) && count( $layout['event_tag'] ) ) {
                        $tax_query = array(
                            array(
                                'taxonomy' => 'event_tag',
                                'field' => 'term_id',
                                'terms' => $layout['event_tag'] 
                            )
                        );
                    }
                }
            }
            $today = date('Ymd');
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
                $args_current['tax_query'] = $tax_query;
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
                    $items[] = array(
                        'type' => 'event',
                        'title' => get_the_title(),
                        'url' => get_permalink(),
                        'excerpt' => tk_get_excerpt('tk_card_length'),
                        'date' => $event_date,
                        'thumbnail_url' =>  $this->get_thumbnail_url( $layout, get_the_ID() )
                    );
                endwhile;
                wp_reset_postdata();
            }

            if ( isset( $layout['show_past_events'] ) && $layout['show_past_events'] ) {
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
                        $args_past['tax_query'] = $tax_query;
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
                            $items[] = array(
                                'type' => 'event',
                                'title' => get_the_title(),
                                'url' => get_permalink(),
                                'excerpt' => tk_get_excerpt('tk_card_length'),
                                'date' => $event_date,
                                'thumbnail_url' => $this->get_thumbnail_url( $layout, $post )
                            );
                        endwhile;
                        wp_reset_postdata();
                    }
                }
            }
            // if there are any event items, populate the return array with data
            if ( count( $items ) ) {
                return array(
                    "post_type"    => "events",
                    "archive_link" => $this->get_archive_link( $layout, 'events' ),
                    "tab_text"     => $layout["tab_text"],
                    "instance_id"  => $this->get_instance_id(),
                    "items"        => $items
                );
            } else {
                return array();
            }
        }

        /**
         * returns the HTML for an archive link
         * @param array
         */
        function get_archive_link( $layout, $post_type )
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
            $archive_link = array();
            if ( isset( $layout['link_text'] ) && $layout['link_text'] ) {
                $archive_link["text"] = $layout['link_text'];
                $archive_link["url"] = false;
                if ( isset($layout['link_to_category']) && $layout['link_to_category'] ) {
                    if ( isset($layout['link_category']) && $layout['link_category'] ) {
                        $archive_link["url"] = get_term_link($layout['link_category'], $taxonomies[$post_type]['category']);
                    }
                }
                if ( isset( $layout['link_to_tag'] ) && $layout['link_to_tag'] ) {
                    if ( isset($layout['link_tag']) && $layout['link_tag'] ) {
                        $archive_link["url"] = get_term_link($layout['link_tag'], $taxonomies[$post_type]['tag']);
                    }
                }
                if ( ! $archive_link["url"] || is_wp_error($archive_link["url"]) ) {
                    $archive_link["url"] = get_post_type_archive_link($post_type);
                }
            }
            return $archive_link;
        }

        /**
         * gets the thumbnail URL for a post
         */
        function get_thumbnail_url( $layout, $post_id )
        {
            if ( $layout['show_featured_image'] ) {
                if ( has_post_thumbnail( $post_id ) ) {
                    return get_the_post_thumbnail_url( $post_id );
                } else {
                    if ( $layout['default_featured_image'] ) {
                        return $layout['default_featured_image']['sizes']['medium_large'];
                    } else {
                        return get_template_directory_uri() . '/dist/img/uol-2-1-tower.png';
                    }
                }
            }
            return false;
        }
    }
    new tk_posts_list_widget();
}
