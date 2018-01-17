<?php
/**
 * theme scripts
 */

if ( ! class_exists( 'tk_scripts' ) ) {
    class tk_scripts
    {
        public function __construct()
        {
            /* register google map scripts when ACF is loaded (to get any configured API key) */
            add_action( 'acf/init', array( $this, 'register_google_map_scripts' ) );

            /* register regular theme scripts */
            add_action( 'wp_enqueue_scripts', array( $this, 'register_theme_scripts' ), 1 );

            /* enqueue regular theme scripts */
            add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_theme_scripts' ), 10 );

            /* add hooks to output scripts configured in Appearance->Theme Settings via ACF */
            add_action( 'acf/init', array( $this, 'add_theme_settings_scripts' ) );
        }

        /**
         * registers google API and google map scripts
         * these scripts are enqueued in the widgets page template if the widget is used on the page
         */
        public function register_google_map_scripts()
        {
            $api_key = tk_get_google_api_key();
            wp_register_script(
                'google_maps_api',
                'https://maps.googleapis.com/maps/api/js?key=' . $api_key,
                array(),
                false,
                true
            );
            wp_register_script(
                'google_map_widget',
                get_template_directory_uri() . '/js/google-map-widget.js',
                array('jquery','google_maps_api'),
                false,
                true
            );

        }

        /**
         * registers theme scripts
         * called by wp_enqueue_scripts with priority of 1
         */
        public function register_theme_scripts()
        {
            wp_register_script(
                'tk_wordpress',
                get_template_directory_uri() . '/js/toolkit-wordpress.js', 
                array('jquery'),
                tk_admin::$version, 
                true
            );
        }

        /**
         * enqueue theme scripts
         * called by wp_enqueue_scripts with priority of 10
         */
        public function enqueue_theme_scripts()
        {
            wp_enqueue_script('tk_wordpress');
        }

        /**
         * registers admin configfure scripts from Appearance->Settings set in ACF
         */
        public function add_theme_settings_scripts()
        {
            add_action( 'wp_head', array( $this, 'site_scripts_output_head' ) );
            add_action( 'wp_footer', array( $this, 'site_scripts_output_footer' ) );
        }

        /**
         * Output site specific scripts to head
         * Set in: Site Admin->Appearance->Theme Scripts
         */
        public function site_scripts_output_head(){

        	$scriptEntries = get_field('tk_theme_scripts', 'option');

        	if ( $scriptEntries ) {
                foreach ($scriptEntries as $scriptEntry) {

        			if ($scriptEntry['tk_theme_script_placement'] == 'wp_head'){
        				echo $scriptEntry['tk_theme_script'];
        			}
        		}
            }
        }
        /**
         * Output site specific scripts to footer
         * Set in: Site Admin->Appearance->Theme Scripts
         */
        public function site_scripts_output_footer(){

        	$scriptEntries = get_field('tk_theme_scripts', 'option');

            if ( $scriptEntries ) {
        		foreach ($scriptEntries as $scriptEntry) {

        			if ($scriptEntry['tk_theme_script_placement'] == 'wp_footer'){
        				echo $scriptEntry['tk_theme_script'];
        			}
        		}
            }
        }
    }
    new tk_scripts();
}