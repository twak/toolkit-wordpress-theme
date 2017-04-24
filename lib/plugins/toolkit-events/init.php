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

/**
 * include stuff from lib
 */
require_once dirname(__FILE__) . '/lib/acf.php';
require_once dirname(__FILE__) . '/lib/admin.php';
require_once dirname(__FILE__) . '/lib/post_type.php';
require_once dirname(__FILE__) . '/lib/feed.php';

if ( ! class_exists( 'tk_events' ) ) {

    class tk_events
    {
        /* plugin version */
        public static $version = "1.0.2";

        /* register all hooks with wordpress API */
        public static function register()
        {

            /**
             * upgrade from previous version
             */
            add_action( 'init', array( __CLASS__, 'upgrade' ), 11 );

            /**
             * Add in events templates (single and archive)
             */
            add_filter('single_template', array( __CLASS__, 'single_template' ) );
            add_filter('archive_template', array( __CLASS__, 'archive_template' ) );

            /**
             * change main query for events
             */
            add_action( 'pre_get_posts', array(__CLASS__, 'query_events' ) );

            /**
             * plugin activation/deactivation
             */
            register_activation_hook( __FILE__, array(__CLASS__, 'plugin_activation' ) );

            /**
             * add scripts for admin
             */
            add_action( 'acf/input/admin_enqueue_scripts', array(__CLASS__, 'admin_scripts') );
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
                                foreach ($cats as $cat ) {
                                    if ( ! isset( $used['event_category'][$cat->term_id] ) ) {
                                        $used['event_category'][$cat->term_id] = $cat;
                                    }
                                    if ( ! isset( $map['event_category'][$cat->term_id] ) ) {
                                        $map['event_category'][$cat->term_id] = array();
                                    }
                                    $map['event_category'][$cat->term_id][] = $event->ID;
                                }
                            }
                            $tags = get_the_tags( $event->ID );
                            if ( $tags ) {
                                $map['event_tag'][$event->ID] = array();
                                foreach ($tags as $tag ) {
                                    if ( ! isset( $used['event_tag'][$tag->term_id] ) ) {
                                        $used['event_tag'][$tag->term_id] = $tag;
                                    }
                                    if ( ! isset( $map['event_tag'][$tag->term_id] ) ) {
                                        $map['event_tag'][$tag->term_id] = array();
                                    }
                                    $map['event_tag'][$tag->term_id][] = $event->ID;
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
                                    // associate events with the new categories/tags
                                    if ( ! is_wp_error( $result ) ) {
                                        foreach ( $map[$tax] as $old_term_id => $events ) {
                                            if ( $old_term_id == $term_id ) {
                                                foreach( $events as $event_id ) {
                                                    wp_set_object_terms( $event_id, $result['term_id'], $tax, true );
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // delete relationship between events and categories/tags
                        foreach ( $events as $event ) {
                            wp_delete_object_term_relationships( $event->ID, 'category' );
                            wp_delete_object_term_relationships( $event->ID, 'post_tag' );
                        }
                        unregister_taxonomy_for_object_type( 'category', 'events' );
                        unregister_taxonomy_for_object_type( 'post_tag', 'events' );
                    case "1.0.2":
                        // upgrade from 1.0.2

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
                $plugin_path = dirname(__FILE__) . '/templates/single-events.php';
                if ( file_exists( $theme_path ) ) {
                    return $theme_path;
                } elseif ( file_exists( $template_path ) ) {
                    return $template_path;
                } elseif ( file_exists( $plugin_path ) ) {
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
            global $wp_query;
            if ( is_post_type_archive('events') || is_tax('event_category') || is_tax('event_tag') ) {
                
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
                        $plugin_path_tax = dirname(__FILE__) . '/templates/taxonomy-events.php';
                        if (file_exists($theme_path_tax)) {
                            return $theme_path_tax;
                        } elseif (file_exists($template_path_tax)) {
                            return $template_path_tax;
                        } elseif (file_exists($plugin_path_tax)) {
                            return $plugin_path_tax;
                        }
                    }
                }
                /**
                 * checks for overrides in template and theme for post type archive
                 */
                $theme_path = get_stylesheet_directory() . '/archive-events.php';
                $template_path = get_template_directory() . '/archive-events.php';
                $plugin_path = dirname(__FILE__) . '/templates/archive-events.php';
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
         * Flush rewrite rules when creating new post type
         * @see https://paulund.co.uk/flush-permalinks-custom-post-type
         */
        function plugin_activation()
        {
            tk_events_post_type::create_taxonomy();
            tk_events_post_type::create_post_type();
            flush_rewrite_rules();
        }

        /**
         * enqueues scripts for admin area
         */
        public static function admin_scripts()
        {
            wp_enqueue_script(
                'tk-events-script',
                plugins_url('/js/admin.js', __FILE__),
                array('jquery'),
                tk_events::$version,
                true
            );
        }

        /**
         * filter for pre_get_posts 
         */
        public static function query_events( $query )
        {
            // limits the main archive page to get only past events in the main query
            // current events are retrieved using a custom query on the archive page
            if ( ! is_admin() && ! is_tax() && $query->is_main_query() && is_post_type_archive('events') ) {
                $query->set('meta_key', 'tk_events_start_date');
                $query->set('orderby', 'meta_value_num');
                $query->set('order', 'DESC');
                $query->set('meta_query', array(
                    'relation' => 'AND',
                    'start_clause' => array(
                        'key' => 'tk_events_start_date',
                        'value' => date('Y-m-d'),
                        'compare' => '<',
                        'type' => 'DATETIME'
                    ),
                    'end_clause' => array(
                        'key' => 'tk_events_end_date',
                        'value' => date('Y-m-d'),
                        'compare' => '<',
                        'type' => 'DATETIME'
                    )
                ) );
            }
            // ensures the order of events is governed by the event start date on taxonomy archives
            if ( ! is_admin() && $query->is_main_query() && is_tax( array('event_category', 'event_tag') ) ) {
                $query->set('meta_key', 'tk_events_start_date');
                $query->set('orderby', 'meta_value_num');
                $query->set('order', 'DESC');
            }
        }

        /**
         * TEMPLATE FUNCTIONS
         */

        /**
         * gets a formatted date string
         */
        public static function get_date_string($event_id, $type = 'single', $formats = array())
        {
            // get formats to use
            $defaults = apply_filters( 'event_date_formats', array(
                'single_day' => "l j F Y",
                'single_period_start' => "j F Y",
                'single_period_end' => "j F Y",
                'single_period_start_samemonth' => "l j",
                'single_period_end_samemonth' => "l j F, Y",
                'single_period_start_sameyear' => "l j F",
                'single_period_end_sameyear' => "l j F, Y",
                'archive_day' => "l j F Y",
                'archive_period_start' => "j F Y",
                'archive_period_end' => "j F Y",
                'archive_period_start_samemonth' => "j",
                'archive_period_end_samemonth' => "j F, Y",
                'archive_period_start_sameyear' => "j F",
                'archive_period_end_sameyear' => "j F, Y"
            ) );
            $opts = wp_parse_args( $formats, $defaults );

            // sanitise type
            if ( ! in_array( $type, array('single', 'archive') ) ) {
                $type = 'single';
            }

            // Get event vars
            $start_date = get_field('tk_events_start_date', $event_id);
            $end_date = get_field('tk_events_end_date', $event_id);
            $start_ts = strtotime($start_date);
            $end_ts = strtotime($end_date);

            // Format date
            $date_format = '';
            if ( $start_date ) {
                if ( ! $end_date || $start_date == $end_date ) {       
                    $date_format = date($opts[$type . '_day'], $start_ts);
                } else {
                    $start_month = date("n", $start_ts);
                    $end_month = date("n", $end_ts);
                    $start_year = date("Y", $start_ts);
                    $end_year = date("Y", $end_ts);
                    if ( $start_year == $end_year && $start_month == $end_month ) {
                        $date_format = date($opts[$type . '_period_start_samemonth'], $start_ts) . ' - ' . date($opts[$type . '_period_end_samemonth'], $end_ts);
                    } elseif ( $start_year == $end_year ) {
                        $date_format = date($opts[$type . '_period_start_sameyear'], $start_ts) . ' - ' . date($opts[$type . '_period_end_sameyear'], $end_ts);
                    } else {
                        $date_format = date($opts[$type . '_period_start'], $start_ts) . ' - ' . date($opts[$type . '_period_end'], $end_ts);
                    }
                }
            }
            return $date_format;
        }

    }
    tk_events::register();
}

