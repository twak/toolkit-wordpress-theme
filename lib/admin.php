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
        public static $version = "0.3.0";

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
                    case "0.2.0":
                    case "0.2.1":
                    case "0.2.2":
                    case "0.2.3":
                    case "0.2.4":
                    case "0.2.5":
                    case "0.2.6":
                    case "0.2.7":
                    case "0.2.8":
                    case "0.2.9":
                    case "0.2.10":
                    case "0.2.11":
                    case "0.2.12":
                    case "0.2.13":
                    case "0.2.14":
                    case "0.2.15":
                    case "0.2.16":
                    case "0.2.17":
                        // upgrade from 0.2.x to 0.3.1
                        include dirname(__FILE__) . '/upgrade/0.3.0.php';
                    case "0.3.0":
                        
                }
            }
            /* update the version option */
            update_option('tk_theme_version', self::$version);
        }
	}
    tk_admin::register();
}