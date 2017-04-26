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
        public static $version = "0.2.0";

        public static function register()
        {


        }


        public static function upgrade()
        {

        	$acf_fields = array(
        	);
        }

	}
}