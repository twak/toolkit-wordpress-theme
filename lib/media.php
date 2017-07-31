<?php
/**
 * hooks and filters applied to media in the theme
 */

if ( ! class_exists( "tk_media" ) ) {
    
    class tk_media
    {

        public static function register()
        {
            /* add custom image sizes */
            add_action( 'after_setup_theme', array( __CLASS__, 'add_image_sizes' ) );
            
            /* Remove thumbnail width and height dimensions */
            add_filter( 'post_thumbnail_html', array( __CLASS__, 'remove_thumbnail_dimensions' ), 10 );

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

    }
    tk_media::register();
}