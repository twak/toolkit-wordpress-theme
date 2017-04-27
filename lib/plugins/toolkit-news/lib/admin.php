<?php
/**
 * Toolkit news Plugin admin area modifications
 * adds filters / columns / sorting on news admin listing page
 */


if ( ! class_exists( 'tk_news_admin' ) ) {

    class tk_news_admin
    {
        /* register all hooks with wordpress API */
        public static function register()
        {
            /**
             * put columns on news list table for categories / tags
             */
            add_action( 'manage_edit-news_columns', array( __CLASS__, 'add_news_columns' ) );
            add_action( 'manage_news_posts_custom_column', array( __CLASS__, 'show_news_columns' ), 10, 2 );

            /**
             * add dropdowns to filter news by category, tag and new date
             */
            add_action( 'restrict_manage_posts', array( __CLASS__, 'restrict_news_by_taxonomy' ) );
            add_filter( 'parse_query', array( __CLASS__, 'convert_filter_value_in_query' ) );

        }

        /**
         * adds columns to the news listing table
         * hooks into 'manage_edit-news_columns'
         * @param array $posts_columns
         * @return array $new_posts_columns
         */
        public static function add_news_columns( $posts_columns )
        {
            $posts_columns['news_category'] = 'Categories';
            $posts_columns['news_tag'] = 'Tags';
            return $posts_columns;
        }

        /**
         * shows the data in the category and tag columns
         * hooks into 'manage_new_posts_custom_column'
         * @param $column_id
         * @param $post_id
         */
        public static function show_news_columns( $column_id, $post_id )
        {
            global $post;
            switch ($column_id) {
                case "news_category":
                case "news_tag":
                    $et = get_the_terms($post_id, $column_id);
                    $url = "edit.php?post_status=all&post_type=news&$column_id=";
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
         * filters the news list in the dashboard by new taxonomies
         */
        public static function restrict_news_by_taxonomy()
        {
            global $typenow;
            global $wp_query;
            if ( $typenow == 'news' ) {
                $cat_tax = get_taxonomy('news_category');
                $selected = ( isset( $wp_query->query['news_category'] ) && $wp_query->query['news_category'] != 0 ) ? $wp_query->query['news_category']: '';
                wp_dropdown_categories(array(
                    'show_option_all' =>  __("Show All {$cat_tax->label}"),
                    'taxonomy'        =>  'news_category',
                    'name'            =>  'news_category',
                    'orderby'         =>  'name',
                    'selected'        =>  $selected,
                    'hierarchical'    =>  true,
                    'depth'           =>  3,
                    'show_count'      =>  true, // Show # listings in parens
                    'hide_empty'      =>  true, // Don't show businesses w/o listings
                ));
                $tag_tax = get_taxonomy('news_tag');
                $selected = ( isset( $wp_query->query['news_tag'] ) && $wp_query->query['news_tag'] != 0 ) ? $wp_query->query['news_tag']: '';
                wp_dropdown_categories(array(
                    'show_option_all' =>  __("Show All {$tag_tax->label}"),
                    'taxonomy'        =>  'news_tag',
                    'name'            =>  'news_tag',
                    'orderby'         =>  'name',
                    'selected'        =>  $selected,
                    'hierarchical'    =>  false,
                    'show_count'      =>  true, // Show # listings in parens
                    'hide_empty'      =>  true, // Don't show businesses w/o listings
                ));
            }  
        }

        /**
         * filters the news list in the dashboard by new taxonomies and dates
         */
        public static function convert_filter_value_in_query($query)
        {
            global $pagenow;
            // check we are on the news listing page in the dashboard
            if ( is_admin() && $pagenow == 'edit.php' && isset($query->query_vars['post_type']) && $query->query_vars['post_type'] == 'news' ) {
                // check query vars for taxonomy filters
                foreach ( array('news_category', 'news_tag') as $taxonomy ) {
                    if ( isset($query->query_vars[$taxonomy]) && is_numeric($query->query_vars[$taxonomy]) && $query->query_vars[$taxonomy] != 0 ) {
                        // convert numeric term to slug
                        $term = get_term_by('id', $query->query_vars[$taxonomy], $taxonomy);
                        $query->query_vars[$taxonomy] = $term->slug;
                    }
                }
            }
        }

    }
    tk_news_admin::register();
}
