<?php
/**
 * Plugin Name: Toolkit Events
 * Plugin URI: http://toolkit.leeds.ac.uk/wordpress
 * Description: This plugin adds toolkit events
 * Version: 1.0.2
 * Author: Web Team
 * Author URI: http://toolkit.leeds.ac.uk/wordpress
 * License: GPL2
 */


if ( ! class_exists( 'tk_events' ) ) {

    class tk_events
    {
        /* plugin version */
        public static $version = "1.0.2";

        /* register all hooks with wordpress API */
        public static function register()
        {

            /**
             * Add Events Post Type taxonomies
             * added with priority LESS THAN post type registration
             * to ensure the rewrite slug is not overwritten
             */
            add_action( 'init', array( __CLASS__, 'create_taxonomy' ), 9 );

            /**
             * Add events Custom Post Type
             * added with priority GREATER THAN taxonomy registration
             * to ensure the rewrite slug is not overwritten
             */
            add_action('init', array( __CLASS__, 'create_post_type' ), 10 );

            /**
             * upgrade from previous version
             */
            add_action( 'init', array( __CLASS__, 'upgrade' ), 11 );

            /**
             * put columns on events list table and make sortable by date
             * and filterable by category / tag
             */
            add_action( 'manage_edit-events_columns', array(__CLASS__, 'add_events_columns') );
            add_action( 'manage_events_posts_custom_column', array(__CLASS__, 'show_events_columns'), 10, 2 );
            add_filter( 'manage_edit-events_sortable_columns', array(__CLASS__, 'date_column_register_sortable') );
            add_filter( 'request', array(__CLASS__, 'date_column_orderby') );
            add_filter( 'parse_query', array(__CLASS__, 'sort_events_by_event_date')) ;

            /**
             * Add in events templates (single and archive)
             */
            add_filter('single_template', array( __CLASS__, 'single_template' ) );
            add_filter('archive_template', array( __CLASS__, 'archive_template' ) );

            /**
             * Sets up custom fields in ACF
             */
            add_action( 'acf/init', array( __CLASS__, 'setup_acf' ) );

            /**
             * plugin activation/deactivation
             */
            register_activation_hook( __FILE__, array(__CLASS__, 'plugin_activation' ) );
        }

        /**
         * creates event taxonomies
         */
        public static function create_taxonomy()
        {
            register_taxonomy('event_category', array('events'), array(
                'hierarchical' => true,
                'labels' => array(
                    'name' => 'Event Categories',
                    'singular_name' => 'Event Category',
                    'search_items' => 'Search Event Categories',
                    'all_items' => 'All Event Categories',
                    'parent_item' => 'Parent Event Category',
                    'parent_item_colon' => 'Parent Event Category:',
                    'edit_item' => 'Edit Event Category', 
                    'update_item' => 'Update Event Category',
                    'add_new_item' => 'Add New Event Category',
                    'new_item_name' => 'New Event Category',
                    'menu_name' => 'Event Categories'
                ),
                'show_ui' => true,
                'query_var' => true,
                'rewrite' => array(
                    'slug' => 'event_category',
                    'with_front' => false
                )
            ) );
            register_taxonomy('event_tag', array('events'), array(
                'hierarchical' => false,
                'labels' => array(
                    'name' => 'Event Tags',
                    'singular_name' => 'Event Tag',
                    'search_items' => 'Search Event Tags',
                    'all_items' => 'All Event Tags',
                    'parent_item' => null,
                    'parent_item_colon' => null,
                    'edit_item' => 'Edit Event Tag', 
                    'update_item' => 'Update Event Tag',
                    'add_new_item' => 'Add New Event Tag',
                    'new_item_name' => 'New Event Tag',
                    'menu_name' => 'Event Tags'
                ),
                'show_ui' => true,
                'query_var' => true,
                'rewrite' => array(
                    'slug' => 'event_tag',
                    'with_front' => false
                )
            ) );
        }

        /**
         * Add Event Custom Post Type
         * called with the 'init' action
         */
        public static function create_post_type()
        {
            register_post_type('events', // Register Custom Post Type
                array(
                    'labels' => array(
                        'name'               => 'Events',
                        'singular_name'      => 'Event',
                        'add_new'            => 'Add New',
                        'add_new_item'       => 'Add New Event',
                        'edit'               => 'Edit',
                        'edit_item'          => 'Edit Event',
                        'new_item'           => 'New Event',
                        'view'               => 'View Event',
                        'view_item'          => 'View Event',
                        'search_items'       => 'Search Events',
                        'not_found'          => 'No Events found',
                        'not_found_in_trash' => 'No Events found in the bin'
                    ) ,
                    'public' => true,
                    'hierarchical' => true,
                    'has_archive' => true,
                    'supports' => array(
                        'title',
                        'editor',
                        'excerpt',
                        'thumbnail'
                    ),
                    'menu_icon' => 'dashicons-calendar',
                    'can_export' => true
                )
            );
        }

        /**
         * upgrade routine
         */
        public static function upgrade()
        {
            $current_version = get_option('tk_events_plugin_version');
            if ($current_version != self::$version) {
                switch ($current_version) {
                    case false:
                        /* updates sites which used built in categories */

                        // get all events
                        $events = get_posts( array(
                            'post_type' => 'events',
                            'numberposts' => -1
                        ) );

                        // re-add support for built in category and tag taxonomies
                        register_taxonomy_for_object_type( 'category', 'events' );
                        register_taxonomy_for_object_type( 'post_tag', 'events' );

                        // store used terms in here
                        $used = array('event_category' => array(), 'event_tag' => array());

                        // store mappingposts to terms in here
                        $map = array('event_category' => array(), 'event_tag' => array());

                        // collect terms from existing events
                        foreach ( $events as $event ) {
                            $cats = get_the_category( $event->ID );
                            if ( $cats ) {
                                $map['event_category'][$event->ID] = array();
                                foreach ($cats as $cat ) {
                                    if ( ! isset( $used['event_category'][$cat->term_id] ) ) {
                                        $used['event_category'][$cat->term_id] = $cat;
                                    }
                                    $map['event_category'][$event->ID][] = $cat->term_id;
                                }
                            }
                            $tags = get_the_tags( $event->ID );
                            if ( $tags ) {
                                $map['event_tag'][$event->ID] = array();
                                foreach ($tags as $tag ) {
                                    if ( ! isset( $used['event_tag'][$tag->term_id] ) ) {
                                        $used['event_tag'][$tag->term_id] = $tag;
                                    }
                                    $map['event_tag'][$event->ID][] = $tag->term_id;
                                }
                            }
                        }

                        // add the new categories/tags
                        foreach ( $used as $tax => $terms ) {
                            if ( count( $used[$tax] ) ) {
                                foreach( $used[$tax] as $term_id => $term ) {
                                    // set up new terms
                                    $result = wp_insert_term(
                                        $term->name,
                                        $tax,
                                        array(
                                            'slug' => $term->slug,
                                            'description' => $term->description
                                        )
                                    );
                                }
                            }
                        }

                        // add terms to events
                        foreach ( $map as $tax => $event_ids ) ) {
                            foreach( $event_ids as $event_id => $terms ) {
                                if ( count( $terms ) ) {
                                    wp_set_object_terms( $event_id, $terms, $tax, false );
                                }
                            }
                        }
                        // delete relationship between events and categories/tags
                        foreach ( $events as $event ) {
                            wp_delete_object_term_relationships( $event->ID, 'category' );
                            wp_delete_object_term_relationships( $event->ID, 'post_tag' );
                        }
                        break;

                }
                /* update the version option */
                update_option('tk_events_plugin_version', self::$version);
            }
        }

        /**
         * ensures template is used from plugin for single event pages
         */
        public static function single_template($single_template)
        {
            global $post;
            if ($post->post_type === 'events' ) {
                $theme_path = get_stylesheet_directory() . '/single-events.php';
                $template_path = get_template_directory() . '/single-events.php';
                $plugin_path = dirname(__FILE__) . '/single-events.php';
                if ( file_exists( $theme_path ) ) {
                    return $theme_path;
                } elseif ( file_exists( $template_path ) ) {
                    return $template_path;
                } else ( file_exists( $plugin_path ) ) {
                    return $plugin_path;
                }
            }
            return $single_template;
        }

        /**
         * ensures template is used from plugin for event archives
         */
        public static function archive_template($archive_template)
        {
            global $post;
            if ( $post->post_type === 'events' ) {
                
                /**
                 * checks for overrides in template and theme for taxonomy archives
                 */
                foreach ( array('event_category', 'event_tag') as $tax ) {
                    if ( is_tax( $tax ) ) {

                        /**
                         * first check for templates which are specific to terms
                         * taxonomy-{taxonomy}-{term}.php
                         */
                        $qo = get_queried_object();

                        if ( $qo->slug ) {
                            $theme_path_term = get_stylesheet_directory() . '/taxonomy-' . $tax . '-' . $qo->slug . '.php';
                            $template_path_term = get_template_directory() . '/taxonomy-' . $tax . '-' . $qo->slug . '.php';
                            if (file_exists($theme_path_term)) {
                                return $theme_path_term;
                            } elseif (file_exists($template_path_term)) {
                                return $template_path_term;
                            }
                        }

                        /**
                         * now check for templates which are specific to the taxonomy
                         * taxonomy-{taxonomy}.php
                         */
                        $theme_path_tax = get_stylesheet_directory() . '/taxonomy-' . $tax . '.php';
                        $template_path_tax = get_template_directory() . '/taxonomy-' . $tax . '.php';
                        if (file_exists($theme_path_tax)) {
                            return $theme_path_tax;
                        } elseif (file_exists($template_path_tax)) {
                            return $template_path_tax;
                        }
                    }
                }
                /**
                 * checks for overrides in template and theme for post type archive
                 */
                $theme_path = get_stylesheet_directory() . '/archive-events.php';
                $template_path = get_template_directory() . '/archive-events.php';
                $plugin_path = dirname(__FILE__) . '/archive-events.php';
                if (file_exists($theme_path)) {
                    return $theme_path;
                } elseif (file_exists($template_path)) {
                    return $template_path;
                } elseif (file_exists($plugin_path)) {
                    return $plugin_path;
                }
            }
            return $archive_template;
        }

        /**
         * adds columns to the events listing table
         * hooks into 'manage_edit-events_columns'
         * @param array $posts_columns
         * @return array $new_posts_columns
         */
        public static function add_events_columns( $posts_columns )
        {
            $posts_columns['title'] = 'Event Title';
            $posts_columns['author'] = 'Author';
            $posts_columns['event_category'] = 'Categories';
            $posts_columns['event_tag'] = 'Tags';
            $posts_columns['date'] = 'Date';
            return $posts_columns;
        }

        /**
         * shows the event date column of the manage events table
         * hooks into 'manage_event_posts_custom_column'
         * @param $column_id
         * @param $post_id
         */
        public static function show_events_columns( $column_id, $post_id )
        {
            global $post;
            switch ($column_id) {
                case "date":
                    $event_start = get_field('tk_events_start_date', $post_id);
                    $event_end = get_field('tk_events_end_date', $post_id);
                    if ( ! $event_start ) {
                        echo '-';
                    } else {
                        if ( ! $event_end ) {
                            echo $event_start;
                        } elseif ( $event_start == $event_end ) {
                            echo $event_start;
                        } else {
                            echo $event_start . ' - ' . $event_end;
                        }
                    }
                    break;
                case "event_category":
                case "event_tag":
                    $et = get_the_terms($post_id, $column_id);
                    $url = "edit.php?post_status=all&post_type=events&$column_id=";
                    if (is_array($et)) {
                        $term_links = array();
                        foreach($et as $key => $term) {
                            $term_links[] = '<a href="' . $url . $term->slug . '">' . $term->name . '</a>';
                        }
                        echo implode(' | ', $term_links);
                    }
                    break;
            }
        }
        
        /**
         * registers the date column as sortable
         * @param $columns array of sortable columns
         * @return new array of sortabkle columns with the event_date column added
         */
        public static function date_column_register_sortable( $columns )
        {
            $columns["date"] = "date";
            return $columns;
        }
        
        /**
         * enables Wordpress to order the event listing table
         * by the event_date column
         */
        public static function date_column_orderby( $vars )
        {
            if (isset($vars["orderby"]) && $vars["orderby"] == "date") {
                $vars = array_merge ($vars, array(
                    "meta_key" => "tk_events_start_date",
                    "orderby" => "meta_value_num"
                ));
            }
            return $vars;
        }

        /**
         * this is used to sort events by event date on the manage events
         * page in admin. It hooks into the filter "request" and adds extra
         * parameters to $query_vars when necessary 
         * @param $query
         */
        public static function sort_events_by_event_date($query)
        {
            global $pagenow;
            if (is_admin() && $pagenow=='edit.php' && $query->query_vars['post_type'] == 'events' && !isset($query->query_vars['orderby']))  {
                $query->query_vars['orderby'] = 'meta_value_num';
                $query->query_vars['meta_key'] = 'tk_events_start_date';
                $query->query_vars['order'] = 'DESC';
            }
            return $query;
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
                    array (
                        'key' => 'field_tk_events_single_settings_related',
                        'label' => 'Related Events',
                        'name' => 'tk_events_single_settings_related',
                        'type' => 'checkbox',
                        'instructions' => 'Ticking this box will make events related by category appear at the bottom of every event page.',
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
             * Individual Event Fields
             */
            acf_add_local_field_group(array(
                'key' => 'group_tk_events',
                'title' => 'Event Details',
                'fields' => array(
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
                    array(
                        'key' => 'field_tk_events_end_date',
                        'label' => 'Event end date',
                        'name' => 'tk_events_end_date',
                        'type' => 'date_picker',
                        'wrapper' => array(
                            'width' => '50%',
                        ),
                        'display_format' => 'd/m/Y',
                        'return_format' => 'Y-m-d',
                        'first_day' => 1,
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

        /**
         * Flush rewrite rules when creating new post type
         * @see https://paulund.co.uk/flush-permalinks-custom-post-type
         */
        function plugin_activation()
        {
            self::create_taxonomy();
            self::create_post_type();
            flush_rewrite_rules();
        }

        /**
         * checks to see if an event is current, i.e. if the event starts 
         * in the future or has started but not finished yet
         * @param object event
         */
        public static function is_current($event, $now = false)
        {
            if ( $now === false ) {
                $now = time();
            }
            $event_start = strtotime( get_field( 'tk_events_start_date', $event->ID ) );
            $event_end = strtotime( get_field( 'tk_events_end_date', $event->ID ) );
            if ( ! $event_start ) {
                /* invalid start date */
                return false;
            }
            if ( $event_start > $now ) {
                /* event starts in the future */
                return true;
            } elseif ( $event_end && $event_end > $now ) {
                /* event ends in the future */
                return true;
            } elseif ( ! $event_end || $event_start == $event_end ) {
                /* no end date, or same day start/end */
                $day_end = mktime(0, 0, 0, date("n", $event_start), (date("j", $event_start) + 1), date("Y", $event_start));
                if ( $event_start <= $now && $day_end > $now ) {
                    return true;
                }
            }
        }

        /**
         * gets events by year, month or day
         */
        public static function get_events_for($year = false, $month = false, $day = false)
        {
            /* build arguments for query */
            $args = array(
                'post_type' => 'events',
                'posts_per_page' => -1,
                'nopaging' => true
            );
            /* if called with no arguments, return all events */
            if ($year === false) {
                return get_posts($args);
            }
            /* set start and end timestamps according to request */
            if ($day !== false && $month !== false) {
                /* a specific day has been requested */
                $start = mktime(0, 0, 0, $month, $day, $year);
                $end = mktime(0, 0, 0, $month, ($day + 1), $year);
            } elseif ($day === false && $month !== false) {
                /* a month has been requested */
                $start = mktime(0, 0, 0, $month, 1, $year);
                $end = mktime(0, 0, 0, ($month + 1), 1, $year);
            }
            $args['meta_query'] = array(
                'relation' => 'OR',
                'start_clause' => array(
                    'key' => 'tk_events_start_date',
                    'value' => array($start, $end),
                    'compare' => 'BETWEEN',
                    'type' => 'NUMERIC'
                ),
                'end_clause' => array(
                    'key' => 'tk_events_end_date',
                    'value' => array($start, $end),
                    'compare' => 'BETWEEN',
                    'type' => 'NUMERIC'
                )
            );
            return get_posts($args);
        }

        /**
         * gets a feed of events
         */
        public static function get_events_feed($format = "json", $month = false, $year = false)
        {
            /* get all events and filter on month and year if necessary */
            $feedEvents = self::get_events_for($year, $month);
            $host = @parse_url(home_url());
            $host = $host['host'];
            $self = esc_url('http' . ( (isset($_SERVER['https']) && $_SERVER['https'] == 'on') ? 's' : '' ) . '://' . $host . stripslashes($_SERVER['REQUEST_URI']));
            $events = array();
            if (count($feedEvents)) {
                foreach ($feedEvents as $event) {
                    $event_start = strtotime( get_field( 'tk_events_start_date', $event->ID ) );
                    $event_end = strtotime( get_field( 'tk_events_end_date', $event->ID ) );
                    if ( ! $event_end ) {
                        $event_end = mktime(0, 0, 0, date("n", $event_start), (date("j", $event_start) + 1), date("Y", $event_start));
                    }
                    $eventObj = new stdClass();
                    $eventObj->id = $event->ID;
                    $eventObj->title = $event->post_title;
                    $eventObj->start_unixtimestamp = $event_start;
                    $eventObj->end_unixtimestamp = $event_end;
                    $eventObj->start_jstimestamp = ($event_start * 1000);
                    $eventObj->end_jstimestamp = ($event_end * 1000);
                    $eventObj->start = date('c', $event_start);
                    $eventObj->end = date('c', $event_end);
                    $eventObj->content = esc_js( apply_filters( 'the_excerpt_rss', $event->post_content ) );
                    $eventObj->url = get_permalink($event->ID);
                    $eventObj->publish_date = $event->post_date;
                    $eventObj->categories = wp_get_object_terms($event->ID, 'event_category');
                    $eventObj->tags = wp_get_object_terms($event->ID, 'event_tag');

                    $events[] = $eventObj;
                }
            }
            switch(strtolower($format))
            {
                case "json":
                    return json_encode($events);
                    break;
                case "ical":
                    $out = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EventPostType-Wordpress-Plugin//NONSGML v1.2//EN\n";
                    foreach ($events as $event) {
                        $out .= "BEGIN:VEVENT\n";
                        $out .= sprintf("UID:%s\n", $event->id);
                        $out .= sprintf("DTSTAMP:%sZ\n", str_replace(array(" ","-",":"), array("T", "", ""), $event->publish_date ));
                        $out .= sprintf("DTSTART:%s\n", date("Ymd\THis\Z", $event->start_unixtimestamp));
                        $out .= sprintf("DTEND:%s\n", date("Ymd\THis\Z", $event->end_unixtimestamp));
                        }
                        $out .= sprintf("SUMMARY:%s\n", $event->title);
                        $out .= "END:VEVENT\n";
                    }
                    $out .= "END:VCALENDAR\n";
                    return $out;
                case "rss":
                    header('Content-Type: ' . feed_content_type('rss-http') . '; charset=' . get_option('blog_charset'), true);
                    echo '<?xml version="1.0" encoding="'.get_option('blog_charset').'"?'.'>';
                    echo '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/"';
                    do_action('rss2_ns');
                    echo '><channel>';
                    printf('<title>%s - %s</title>', get_bloginfo_rss('name'), _('Events', 'event-post-type'));
                    printf('<atom:link href="%s" rel="self" type="application/rss+xml" />', $self_link);
                    printf('<link>%s</link>', get_bloginfo_rss('url'));
                    printf('<lastBuildDate>%s</lastBuildDate>', mysql2date('D, d M Y H:i:s +0000', get_lastpostmodified('GMT'), false));
                    printf('<language>%s</language>', get_bloginfo_rss( 'language' ));
                    printf('<sy:updatePeriod>%s</sy:updatePeriod>', apply_filters( 'rss_update_period', 'hourly' ));
                    printf('<sy:updateFrequency>%s</sy:updateFrequency>', apply_filters( 'rss_update_frequency', '1' ));
                    foreach ($events as $event) {
                        print('<item>');
                        printf('<title>%s</title>', apply_filters( 'the_title_rss', $event->title ));
                        printf('<link>%s</link>', apply_filters('the_permalink_rss', EventPostType::get_url($event->id)));
                        printf('<pubDate>%s</pubDate>', mysql2date('D, d M Y H:i:s +0000', get_post_time('Y-m-d H:i:s', true), $event->id));
                        printf('<dc:creator>%s</dc:creator>', get_the_author_meta('display_name', $event->id));
                        printf('<description><![CDATA[%s]]></description>', $event->content);
                        print('</item>');
                    }
                    print('</channel></rss>');
                    break;
                default:
                    return "";
                    break;
            }
        }

    }
    tk_events::register();
}

