<?php
/**
 * theme stylesheets
 */

if ( ! class_exists( 'tk_styles' ) ) {
    class tk_styles
    {
        private $typekit_id = 'vlw5ilb';

        public function __construct()
        {
            /* typekit */
            add_action( 'wp_enqueue_scripts', array( $this, 'tk_typekit' ), 8 );

            /* global styles */
            add_action( 'wp_enqueue_scripts', array( $this, 'tk_global_styles' ), 9 );

            /* theme style */
            add_action( 'wp_enqueue_scripts', array( $this, 'tk_theme_styles' ), 10 );
        }

        public static function tk_typekit()
        {
            wp_enqueue_style(
                'tk_typekit',
                '//use.typekit.net/' . $this->typekit_id . '.css'
            );
        }


        public function tk_global_styles()
        {
            $themeVersion = tk_admin::$version;
            $themeColour = tk_colour();
            wp_enqueue_style( 
                'tk_bootstrap',
                get_template_directory_uri() . '/dist/theme-' . $themeColour . '/bootstrap.min.css', 
                '',
                '3.3.5',
                'screen'
            );
            wp_enqueue_style(
                'tk_toolkit', 
                get_template_directory_uri() . '/dist/theme-' . $themeColour . '/toolkit.min.css',
                '', 
                $themeVersion,
                'screen'
            );
            wp_enqueue_style( 
                'tk_toolkit_print',
                get_template_directory_uri() . '/dist/theme-' . $themeColour . '/print.min.css',
                '',
                $themeVersion,
                'print'
            );
        }

        public function tk_theme_styles()
        {
            wp_enqueue_style(
                'tk_theme_style', 
                get_stylesheet_directory_uri() . '/style.css', 
                '', 
                tk_admin::$version, 
                'all'
            );
        }
    }
    new tk_styles();
}
