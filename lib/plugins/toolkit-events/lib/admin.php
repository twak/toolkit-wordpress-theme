<?php
/**
 * Toolkit Events Plugin admin area modifications
 * adds filters / columns / sorting on Events admin listing page
 */


if ( ! class_exists( 'tk_events_admin' ) ) {

     class tk_events_admin
     {
        /* register all hooks with wordpress API */
        public static function register()
        {
            /**
             * put columns on events list table and make sortable by date
             * and filterable by category / tag
             */
            add_action( 'manage_edit-events_columns', array( __CLASS__, 'add_events_columns' ) );
            add_action( 'manage_events_posts_custom_column', array( __CLASS__, 'show_events_columns' ), 10, 2 );
            add_filter( 'manage_edit-events_sortable_columns', array( __CLASS__, 'date_column_register_sortable' ) );
            add_filter( 'request', array( __CLASS__, 'date_column_orderby' ) );
            add_filter( 'pre_get_posts', array( __CLASS__, 'sort_events_by_event_date' ) ) ;

            /**
             * add dropdowns to filter events by category, tag and event date
             */
            add_action( 'restrict_manage_posts', array( __CLASS__, 'restrict_events_by_taxonomy' ) );
            add_action( 'restrict_manage_posts', array( __CLASS__, 'restrict_events_by_date' ) );
            add_filter( 'parse_query', array( __CLASS__, 'convert_filter_value_in_query' ) );

            /**
             * remove date filtering dropdown (default)
             */
            add_action( 'admin_menu', array( __CLASS__, 'remove_dates_dropdown' ) );

            add_filter( 'query_vars', array( __CLASS__, 'register_events_query_vars' ) );
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
            $posts_columns['event_category'] = 'Categories';
            $posts_columns['event_tag'] = 'Tags';
            $posts_columns['event_date'] = 'Event Date';
            unset($posts_columns['date']);
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
                case "event_date":
                    $event_start = strtotime(get_field('tk_events_start_date', $post_id));
                    $event_end = strtotime(get_field('tk_events_end_date', $post_id));
                    if ( ! $event_start ) {
                        echo '-';
                    } else {
                        if ( ! $event_end ) {
                            echo date('l jS F, Y', $event_start);
                        } elseif ( $event_start == $event_end ) {
                            echo date('l jS F, Y', $event_start);
                        } else {
                            echo date('j/n/Y', $event_start) . ' - ' . date('j/n/Y', $event_end);
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
            $columns["event_date"] = "event_date";
            return $columns;
        }
        
        /**
         * enables Wordpress to order the event listing table
         * by the event_date column
         */
        public static function date_column_orderby( $vars )
        {
            if (isset($vars["orderby"]) && $vars["orderby"] == "event_date") {
                $vars = array_merge ($vars, array(
                    "meta_key" => "tk_events_start_date",
                    "orderby" => "meta_value",
                    "meta_type" => 'DATETIME'
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
            if (is_admin() && $pagenow=='edit.php' && $query->query_vars['post_type'] == 'events' && ( ! isset($query->query_vars['orderby'] ) || $query->query_vars['orderby'] == 'menu_order title') ) {
                $query->query_vars['orderby'] = 'meta_value';
                $query->query_vars['meta_key'] = 'tk_events_start_date';
                $query->query_vars['meta_type'] = 'DATETIME';
                $query->query_vars['order'] = 'DESC';
            }
            return $query;
        }

        /**
         * filters the events list in the dashboard by event taxonomies
         */
        public static function restrict_events_by_taxonomy()
        {
            global $typenow;
            global $wp_query;
            if ( $typenow == 'events' ) {
                $cat_tax = get_taxonomy('event_category');
                $selected = ( isset( $wp_query->query['event_category'] ) && $wp_query->query['event_category'] != 0 ) ? $wp_query->query['event_category']: '';
                wp_dropdown_categories(array(
                    'show_option_all' =>  __("Show All {$cat_tax->label}"),
                    'taxonomy'        =>  'event_category',
                    'name'            =>  'event_category',
                    'orderby'         =>  'name',
                    'selected'        =>  $selected,
                    'hierarchical'    =>  true,
                    'depth'           =>  3,
                    'show_count'      =>  true, // Show # listings in parens
                    'hide_empty'      =>  true, // Don't show businesses w/o listings
                ));
                $tag_tax = get_taxonomy('event_tag');
                $selected = ( isset( $wp_query->query['event_tag'] ) && $wp_query->query['event_tag'] != 0 ) ? $wp_query->query['event_tag']: '';
                wp_dropdown_categories(array(
                    'show_option_all' =>  __("Show All {$tag_tax->label}"),
                    'taxonomy'        =>  'event_tag',
                    'name'            =>  'event_tag',
                    'orderby'         =>  'name',
                    'selected'        =>  $selected,
                    'hierarchical'    =>  false,
                    'show_count'      =>  true, // Show # listings in parens
                    'hide_empty'      =>  true, // Don't show businesses w/o listings
                ));
            }  
        }

        /**
         * adds a date dropdown to restrict events by date (months)
         */
        public static function restrict_events_by_date()
        {
            global $typenow;
            global $wp_query;
            if ( $typenow == 'events' ) {
                /* get a distinct list of YYYYMM values from the event start and end values */
                $r = $wpdb->get_col("
                    SELECT DISTINCT SUBSTRING(pm.meta_value, 1, 6) FROM {$wpdb->postmeta} pm
                    LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id
                    WHERE ( pm.meta_key = 'tk_events_start_date' OR pm.meta_key = 'tk_events_end_date' )
                    AND pm.meta_value != ''
                    AND p.post_type = 'events'
                    ORDER BY pm.meta_value DESC"
                );
                if ( count($r) ) {
                    print('<select name="event_date" id="event_date" class="postform"><option value="0">Show all Event Dates</option>');
                    foreach ($r as $datestr) {
                        /* datestr is in the format YYYYMM */
                        $selected = ( isset($_GET["event_date"]) && $_GET["event_date"] == $datestr )? ' selected': '';
                        $monthNum = substr($datestr, 4, 2);
                        $dateObj = DateTime::createFromFormat('!m', $monthNum);
                        $monthname = $dateObj->format('F');
                        $year = substr($datestr, 0, 4);
                        printf('<option value="%s"%s>%s %s</option>', $datestr, $selected, $monthname, $year);
                    }
                    print('</select>');
                }
            }
        }

        /**
         * filters the events list in the dashboard by event taxonomies and dates
         */
        public static function convert_filter_value_in_query($query)
        {
            global $pagenow;
            // check we are on the events listing page in the dashboard
            if ( is_admin() && $pagenow == 'edit.php' && isset($query->query_vars['post_type']) && $query->query_vars['post_type'] == 'events' ) {
                // check query vars for taxonomy filters
                foreach ( array('event_category', 'event_tag') as $taxonomy ) {
                    if ( isset($query->query_vars[$taxonomy]) && is_numeric($query->query_vars[$taxonomy]) && $query->query_vars[$taxonomy] != 0 ) {
                        // convert numeric term to slug
                        $term = get_term_by('id', $query->query_vars[$taxonomy], $taxonomy);
                        $query->query_vars[$taxonomy] = $term->slug;
                    }
                }
                // check query vars for date filters
                if ( isset( $query->query_vars["event_date"] ) &&  $query->query_vars["event_date"] != 0 ) {
                    // $query->query_vars["event_date"] has the format YYYYMM */
                    $year = substr($query->query_vars["event_date"], 0, 4);
                    $month = substr($query->query_vars["event_date"], 4, 2);
                    $start = mktime(0, 0, 0, intval($month), 1, intval($year));
                    $end = mktime(0, 0, 0, (intval($month) + 1), 0, intval($year));
                    $query->query_vars["meta_query"] = array(
                        'relation' => 'OR',
                        'start_clause' => array(
                            'key' => 'tk_events_start_date',
                            'value' => array(date('Y-m-d', $start), date('Y-m-d', $end)),
                            'compare' => 'BETWEEN',
                            'type' => 'DATETIME'
                        ),
                        'end_clause' => array(
                            'key' => 'tk_events_end_date',
                            'value' => array(date('Y-m-d', $start), date('Y-m-d', $end)),
                            'compare' => 'BETWEEN',
                            'type' => 'DATETIME'
                        )
                    );
                }
            }
        }

        /**
         * removes the dates dropdown from the events list in the dashboard
         */
        public static function remove_dates_dropdown()
        {
            global $typenow;
            if ( is_admin() && $typenow == 'events' ) {
                add_filter('months_dropdown_results', '__return_empty_array');
            }
        }

        /**
         * adds a new query var for event_date
         */
        public static function register_events_query_vars( $vars )
        {
            $vars[] = 'event_date';
            return $vars;
        }

    }
    tk_events_admin::register();
}
