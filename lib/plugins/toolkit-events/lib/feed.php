<?php
/**
 * Toolkit Events Plugin feeds and AJAX stuff
 */

if ( ! class_exists( 'tk_events_feed' ) ) {

    class tk_events_feed
    {
        /* register all hooks with wordpress API */
        public static function register()
        {
            /**
             * add ajax support for calendar
             */
            add_action( 'wp_ajax_get_events', array( __CLASS__, 'get_events_ajax' ) );
            add_action( 'wp_ajax_nopriv_get_events', array( __CLASS__, 'get_events_ajax' ) );

        }

        /**
         * gets events for an AJAX request (from calendar)
         */
        public static function get_events_ajax()
        {
            if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
                if ( check_ajax_referer( 'events_ajax_nonce', 'ajaxnonce', false ) ) {
                    header("Content-Type: text/javascript; charset=utf-8");
                    header("Access-Control-Allow-Origin: *");
                    echo self::get_events_feed( 'json', $_REQUEST['start'], $_REQUEST['end'] );
                } else {
                    wp_die(-1);
                }
            }
            die();
        }

        /**
         * gets events which take place between two dates
         */
        public static function get_events( $startdate, $enddate )
        {
            /* first validate start and end dates */
            $start = strtotime($startdate);
            $end = strtotime($enddate);
            if ( ! $start || ! $end ) {
                return array();
            }
            /* build arguments for query */
            $args = array(
                'post_type' => 'events',
                'posts_per_page' => -1,
                'nopaging' => true,
                'meta_query' => array(
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
                )
            );
            return get_posts($args);
        }

        /**
         * gets a feed of events
         */
        public static function get_events_feed($format = "json", $startdate, $enddate)
        {
            /* get events for specified time frame */
            $feedEvents = self::get_events($startdate, $enddate);
            $host = @parse_url(home_url());
            $host = $host['host'];
            $self = esc_url('http' . ( (isset($_SERVER['https']) && $_SERVER['https'] == 'on') ? 's' : '' ) . '://' . $host . stripslashes($_SERVER['REQUEST_URI']));
            $events = array();
            if (count($feedEvents)) {
                foreach ($feedEvents as $event) {
                    $event_start = strtotime( get_field( 'tk_events_start_date', $event->ID ) );
                    $event_end = strtotime( get_field( 'tk_events_end_date', $event->ID ) );
                    $allday = false;
                    if ( ! $event_end || ( $event_start == $event_end ) ) {
                        $allDay = true;
                        $event_end = mktime(0, 0, 0, date("n", $event_start), (date("j", $event_start) + 1), date("Y", $event_start));
                    }
		            // event URL
		            $event_url = get_permalink($event->ID);
		            $external_url = get_field('tk_events_external_url', $event->ID);
		            $use_external = get_field('tk_events_external_url_link', $event->ID);
		            if ( $external_url && $use_external ) {
		                $event_url = $external_url;
		            }

                    $eventObj = new stdClass();
                    $eventObj->id = $event->ID;
                    $eventObj->title = $event->post_title;
                    $eventObj->allDay = $allDay;
                    $eventObj->start_unixtimestamp = $event_start;
                    $eventObj->end_unixtimestamp = $event_end;
                    $eventObj->start_jstimestamp = ($event_start * 1000);
                    $eventObj->end_jstimestamp = ($event_end * 1000);
                    $eventObj->start = date('c', $event_start);
                    $eventObj->end = date('c', $event_end);
                    $eventObj->content = esc_js( apply_filters( 'the_excerpt_rss', $event->post_content ) );
                    $eventObj->url = $event_url;
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
    tk_events_feed::register();
}

