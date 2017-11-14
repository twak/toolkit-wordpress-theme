<?php
// WP Globals setup

// Theme layout
$GLOBALS['full_width'] = tk_full_width();

// Sidebar flag
$GLOBALS['theme_sidebar_flag'] = tk_sidebar();

// Change style sheet based on theme settings page
$GLOBALS['colour'] = tk_colour();

?><!DOCTYPE html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"><![endif]-->
<!--[if IE 9]><html class="no-js ie9" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html <?php language_attributes(); ?> class="no-js"><!--<![endif]-->
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="copyright" content="Copyright (c)<?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All Rights Reserved." />

		<?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?>>
        <?php do_action( 'tk_after_body' ); ?>

		<div class="site-container <?php if($GLOBALS[ 'full_width' ]){ echo "site-container-lg"; }?>">

			<?php

                get_template_part('templates/global-quicklinks');

                get_template_part('templates/header-masthead');

                get_template_part('templates/header-site-search');

                get_template_part('templates/header-local-masthead');

                get_template_part('templates/header-nav-primary');

            ?>

            <div class="main <?php if(!$GLOBALS[ 'full_width' ]){ echo "wrapper-lg"; }?>">
