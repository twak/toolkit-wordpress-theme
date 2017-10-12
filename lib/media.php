<?php
/**
 * hooks and filters applied to media in the theme
 */

if ( ! class_exists( "tk_media" ) ) {
    
    class tk_media
    {

        public static function register()
        {
            /* ensure content width variable is set */
            add_action( 'template_redirect', array( __CLASS__, 'set_content_width' ) );

            /* add custom image sizes */
            add_action( 'after_setup_theme', array( __CLASS__, 'add_image_sizes' ) );
            
            /* Remove thumbnail width and height dimensions */
            add_filter( 'post_thumbnail_html', array( __CLASS__, 'remove_thumbnail_dimensions' ), 10 );

            /* add responsive embeds */
            add_filter('embed_oembed_html', array( __CLASS__, 'responsive_embed' ), 10, 3);

            /* setting to determine whether featured iamge is included at the top of single templates */
            add_filter( 'admin_post_thumbnail_html', array( __CLASS__, 'add_featured_image_display_settings' ), 10, 2 );
            add_action( 'save_post', array( __CLASS__, 'save_featured_image_display_settings' ), 10, 3 );

        }

        /**
         * sets the content_width global variable
         * @see https://codex.wordpress.org/Content_Width
         * @see https://core.trac.wordpress.org/ticket/21256 
         * TRAC ticket which gives example of setting it dynamically
         */
        public static function set_content_width()
        {
            global $content_width;
            $content_width = 900;
        }

        /**
         * adds custom image sizes
         */
        public static function add_image_sizes()
        {
            // Large Thumbnail
            add_image_size( 'large', 700, '', true );

            // Medium Thumbnail
            add_image_size( 'medium', 250, '', true );

            // Small Thumbnail
            add_image_size( 'small', 120, '', true );

            // Profile image
            add_image_size( 'profile-size', 400, '', true );

            // Featured image
            add_image_size( 'featured-size', 800, 400, true );

            // Banner swiper size small 
            add_image_size( 'banner-size-small', 1000, 500, true );

            // Banner swiper size large
            add_image_size( 'banner-size-large', 1400, 700, true );
        }

        /**
         * Remove thumbnail width and height dimensions that prevent fluid images in the_thumbnail
         */
        public static function remove_thumbnail_dimensions( $html )
        {
            $html = preg_replace('/(width|height)=\"\d*\"\s/', "", $html);
            return $html;
        }

        /**
         * adds a checkbox to featured image metabox for an extra bit of post meta
         * which is used in tempaltes to determine whether the featured image is 
         * displayed in single templates
         * called by admin_post_thumbnail_html filter
         * @uses checked() - see https://codex.wordpress.org/Function_Reference/checked
         * @param string content for metabox (to be filtered)
         * @param integer post ID
         * @return string filtered content
         */
        public static function add_featured_image_display_settings( $content, $post_id )
        {
            $field_id    = 'tk_show_featured_image';
            $field_value = self::show_featured_image( $post_id );
            $field_text  = 'Show image at top of page';
            $field_state = checked( $field_value, 1, false);
            $field_label = sprintf( '<p><label for="%1$s"><input type="checkbox" name="%1$s" id="%1$s" value="%2$s" %3$s> %4$s</label></p>', $field_id, $field_value, $field_state, $field_text );
            return $content .= $field_label;
        }

        /**
         * saves the featured image display setting in post meta
         * called by save_post action
         * @param integer post ID
         * @param object post object
         * @param boolean whether this is an update of an existing post
         */
        public static function save_featured_image_display_settings( $post_ID, $post, $update )
        {
            $field_value = isset( $_REQUEST['tk_show_featured_image'] ) ? 1 : 0;
            update_post_meta( $post_ID, 'tk_show_featured_image', $field_value );
        }

        /**
         * determines whether the tk_show_featured_image postmeta is set/checked for a given post
         */
        public static function show_featured_image( $post_id = false )
        {
            if ( false === $post_id ) {
                $post_id = get_queried_object_id();
            }
            $field_value = get_post_meta( $post_id, 'tk_show_featured_image', true );
            // make sure the return value is numeric rather than boolean
            return ($field_value)? 1: 0;
        }

        /**
         * Adds a responsive embed wrapper around oEmbed content
         * @param  string $html The oEmbed markup
         * @param  string $url  The URL being embedded
         * @param  array  $attr An array of attributes
         * @return string       Updated embed markup
         */
        public static function responsive_embed($html, $url, $attr) {
            return $html!=='' ? '<div class="embed-responsive embed-responsive-16by9">'.$html.'</div>' : '';
        }
       
    }
    tk_media::register();
}