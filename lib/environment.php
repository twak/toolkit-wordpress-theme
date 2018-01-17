<?php
/**
 * Define Environments
 */
$environments = array(
   'development' => '.test',
   'staging' => 'staging.',
   'preview' => 'preview.',
);
// Get Server name
$server_name = $_SERVER['SERVER_NAME'];

// set environment depending on Server name
foreach($environments AS $key => $env){
   if(strstr($server_name, $env)){
      define('ENVIRONMENT', $key);
      break;
   }
}

// If no environment is set default to production
if(!defined('ENVIRONMENT')) define('ENVIRONMENT', 'production');

/*
 * rules for differnt environments
 */

// if not production, supress GTM inclusion
if ( 'production' !== ENVIRONMENT ) {
    add_filter('include_corporate_gtm', '__return_false');
}
