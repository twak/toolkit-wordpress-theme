<?php
/**
 * Wordpress cleanup
 */

if ( ! class_exists( 'tk_cleanup') ) {

    class tk_cleanup
    {
        public static function register()
        {
            // Remove Actions
            remove_action( 'wp_head', 'feed_links_extra', 3 ); // Display the links to the extra feeds such as category feeds
            remove_action( 'wp_head', 'feed_links', 2 ); // Display the links to the general feeds: Post and Comment Feed
            remove_action( 'wp_head', 'rsd_link' ); // Display the link to the Really Simple Discovery service endpoint, EditURI link
            remove_action( 'wp_head', 'wlwmanifest_link' ); // Display the link to the Windows Live Writer manifest file.
            remove_action( 'wp_head', 'index_rel_link' ); // Index link
            remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 ); // Prev link
            remove_action( 'wp_head', 'start_post_rel_link', 10, 0 ); // Start link
            remove_action( 'wp_head', 'adjacent_posts_rel_link', 10, 0 ); // Display relational links for the posts adjacent to the current post.
            remove_action( 'wp_head', 'wp_generator'); // Display the XHTML generator that is generated on the wp_head hook, WP version
            remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );
            remove_action( 'wp_head', 'rel_canonical' );
            remove_action( 'wp_head', 'wp_shortlink_wp_head', 10, 0 );

            // Remove inline Recent Comment Styles from wp_head()
            add_action( 'widgets_init', array( __CLASS__, 'remove_recent_comments_style' ) );

            // Remove 'text/css' from enqueued stylesheet
            add_filter( 'style_loader_tag', array( __CLASS__, 'html5_style_remove' ) );

            // Remove invalid rel attribute values in the categorylist
            add_filter( 'the_category', array( __CLASS__, 'remove_category_rel_from_category_list' ) );

            // disable wp emojicons introduced with WP 4.2
            add_action( 'init', array( __CLASS__, 'disable_wp_emojicons' ) );
            add_filter( 'tiny_mce_plugins', array( __CLASS__, 'disable_wp_emojicons_tinymce' ) );

            // removes version QS from styles and scripts src
            add_filter( 'style_loader_src', array( __CLASS__, 'remove_cssjs_ver' ), 10, 2 );
            add_filter( 'script_loader_src', array( __CLASS__, 'remove_cssjs_ver' ), 10, 2 );

            // remove sections from the customizer
            add_action( 'customize_register', array( __CLASS__, 'remove_customizer_sections' ), 15 );
        }

        /**
         * Removes sections from the Customizer.
         * called by customize_register action
         */
        public static function remove_customizer_sections( $wp_customize )
        {
            // remove Additional CSS for non-administrators
            if( ! current_user_can( 'manage_options' ) ) {
                $wp_customize->remove_section( 'custom_css' );
            }
            $wp_customize->remove_section( 'colors' );
            $wp_customize->remove_section( 'header_image' );
            $wp_customize->remove_section( 'background_image' );
        }

        /**
         * Removes inline Recent Comment Styles from wp_head()
         * called by widgets_init action
         */
        public static function remove_recent_comments_style()
        {
            global $wp_widget_factory;
            remove_action('wp_head', array(
                $wp_widget_factory->widgets['WP_Widget_Recent_Comments'],
                'recent_comments_style'
            ));
        }

        /**
         * Removes 'text/css' from enqueued stylesheets
         * Called by style_loader_tag filter
         * @param string opening style tag
         */
        public static function html5_style_remove($tag)
        {
            return preg_replace('~\s+type=["\'][^"\']++["\']~', '', $tag);
        }

        /**
         * Removes invalid rel attribute values in the categorylist
         * called by the_category filter
         * @param string list of categories
         */
        public static function remove_category_rel_from_category_list($thelist)
        {
            return str_replace('rel="category tag"', 'rel="tag"', $thelist);
        }

        /**
         * Disables the emoji stuff introduced with WP 4.2
         * this function removes various actions and filters used by wordpress to include emofi support
         * @see https://wordpress.stackexchange.com/questions/185577/disable-emojicons-introduced-with-wp-4-2
         */
        public static function disable_wp_emojicons()
        {
        	// all actions related to emojis
        	remove_action( 'admin_print_styles', 'print_emoji_styles' );
        	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
        	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
        	remove_action( 'wp_print_styles', 'print_emoji_styles' );
        	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
        	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
        	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
        }
        /**
         * removes emoji button and plugin from tinymce
         * called by tiny_mce_plugins filter
         * @see https://wordpress.stackexchange.com/questions/185577/disable-emojicons-introduced-with-wp-4-2
         * @param array plugins
         */
        public static function disable_wp_emojicons_tinymce( $plugins )
        {
        	if ( is_array( $plugins ) ) {
        		return array_diff( $plugins, array( 'wpemoji' ) );
        	} else {
        		return array();
        	}
        }

        /**
         * Removes query string from static files
         * Google PageSpeed and other SEO ranking toolsdo not like query strings on CSS and JS
         * called by style_loader_src and script_loader_src filters
         * @param string HTML source for script and style inclusion
         */
        public static function remove_cssjs_ver( $src )
        {
            if( false !== strpos( $src, 'ver=' ) ) {
                $src = remove_query_arg( 'ver', $src );
            }
            return $src;
        }
    }
    tk_cleanup::register();
}
