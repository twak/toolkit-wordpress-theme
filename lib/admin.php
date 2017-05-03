<?php
/**
 * Toolkit theme admin
 * stores theme version, upgrade routines, etc.
 */

if ( ! class_exists( 'tk_admin' ) ) {
	class tk_admin
	{
        /**
         * theme version
         */
        public static $version = "0.2.4";

        public static function register()
        {
            /**
             * upgrade from previous version
             */
            add_action( 'init', array( __CLASS__, 'upgrade' ), 11 );
        }


        public static function upgrade()
        {
            $current_version = get_option('tk_theme_version');
            if ($current_version != self::$version) {
                switch ($current_version) {
                    case false:
                        // theme before versioning was added to database
                    case "0.2.2":
                        // upgrade from 0.2.2
                }
            }
            /* update the version option */
            //update_option('tk_theme_version', self::$version);
        }
	}
    tk_admin::register();
}