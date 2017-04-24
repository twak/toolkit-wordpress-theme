<?php
/**
 * Plugin Name: Toolkit News
 * Plugin URI: http://toolkit.leeds.ac.uk/wordpress
 * Description: This plugin adds a new post type for news items
 * Version: 1.0.1
 * Author: Web Team
 * Author URI: http://toolkit.leeds.ac.uk/wordpress
 * License: GPL2
 */

// include files from lib
require_once dirname(__FILE__) . '/lib/acf.php';
require_once dirname(__FILE__) . '/lib/admin.php';
require_once dirname(__FILE__) . '/lib/post_type.php';

if ( ! class_exists( 'tk_news' ) ) {

    class tk_news
    {
        /* plugin version */
        public static $version = "1.0.1";

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
             * plugin activation/deactivation
             */
            register_activation_hook( __FILE__, array(__CLASS__, 'plugin_activation' ) );

        }

        /**
         * upgrade routine
         */
        public static function upgrade()
        {
            $current_version = get_option('tk_news_plugin_version');
            if ($current_version != self::$version) {
                switch ($current_version) {
                    case false:
                        /* updates sites which used built in categories */

                        // get all events
                        $news = get_posts( array(
                            'post_type' => 'news',
                            'numberposts' => -1
                        ) );

                        // re-add support for built in category and tag taxonomies
                        register_taxonomy_for_object_type( 'category', 'news' );
                        register_taxonomy_for_object_type( 'post_tag', 'news' );

                        // store used terms in here
                        $used = array('news_category' => array(), 'news_tag' => array());

                        // store mapping of posts to terms in here
                        $map = array('news_category' => array(), 'news_tag' => array());

                        // collect terms from existing events
                        foreach ( $news as $n ) {
                            $cats = get_the_category( $n->ID );
                            if ( $cats ) {
                                foreach ($cats as $cat ) {
                                    if ( ! isset( $used['news_category'][$cat->term_id] ) ) {
                                        $used['news_category'][$cat->term_id] = $cat;
                                    }
                                    if ( ! isset( $map['news_category'][$cat->term_id] ) ) {
                                        $map['news_category'][$cat->term_id] = array();
                                    }
                                    $map['news_category'][$cat->term_id][] = $n->ID;
                                }
                            }
                            $tags = get_the_tags( $n->ID );
                            if ( $tags ) {
                                $map['news_tag'][$n->ID] = array();
                                foreach ($tags as $tag ) {
                                    if ( ! isset( $used['news_tag'][$tag->term_id] ) ) {
                                        $used['news_tag'][$tag->term_id] = $tag;
                                    }
                                    if ( ! isset( $map['news_tag'][$tag->term_id] ) ) {
                                        $map['news_tag'][$tag->term_id] = array();
                                    }
                                    $map['news_tag'][$tag->term_id][] = $n->ID;
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
                        foreach ( $news as $n ) {
                            wp_delete_object_term_relationships( $n->ID, 'category' );
                            wp_delete_object_term_relationships( $n->ID, 'post_tag' );
                        }
                        unregister_taxonomy_for_object_type( 'category', 'news' );
                        unregister_taxonomy_for_object_type( 'post_tag', 'news' );
                        break;

                }
                /* update the version option */
                update_option('tk_news_plugin_version', self::$version);
            }
        }


        /**
         * ensures template is used from plugin for single news pages
         */
        public static function single_template($single_template)
        {
            global $post;
            if ($post->post_type === 'news' ) {
                $theme_path = get_stylesheet_directory() . '/single-news.php';
                $template_path = get_template_directory() . '/single-news.php';
                $plugin_path = dirname(__FILE__) . '/templates/single-news.php';
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
         * ensures template is used from plugin for news archives
         */
        public static function archive_template($archive_template)
        {
            global $post;
            if ( is_post_type_archive('news') || is_tax('news_category') || is_tax('news_tag') ) {
                
                /**
                 * checks for overrides in template and theme for taxonomy archives
                 */
                foreach ( array('news_category', 'news_tag') as $tax ) {
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
                        $plugin_path_tax = dirname(__FILE__) . '/templates/taxonomy-news.php';
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
                $theme_path = get_stylesheet_directory() . '/archive-news.php';
                $template_path = get_template_directory() . '/archive-news.php';
                $plugin_path = dirname(__FILE__) . '/templates/archive-news.php';
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
            tk_news_post_type::create_taxonomy();
            tk_news_post_type::create_post_type();
            flush_rewrite_rules();
        }

    }
    tk_news::register();
}


