<?php

// If Dynamic Sidebar Exists
if (function_exists('register_sidebar'))
{
	// Define Sidebar Widget Area 1
	register_sidebar(array(
		'name' => __('Widget Sidebar', 'html5blank'),
		'description' => __('Main sidebar', 'html5blank'),
		'id' => 'widget-area-1',
		'before_widget' => '<div id="%1$s" class="%2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h4 class="sidebar-heading heading-related">',
		'after_title' => '</h4>'
	));

	// Define Sidebar Widget Area Posts
	register_sidebar(array(
		'name' => __('Widget Sidebar: Posts', 'html5blank'),
		'description' => __('Sidebar for posts, past category pages, etc', 'html5blank'),
		'id' => 'widget-area-posts',
		'before_widget' => '<div id="%1$s" class="%2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h4 class="sidebar-heading heading-related">',
		'after_title' => '</h4>'
	));

	// Define Sidebar Widget Area 2
	register_sidebar(array(
		'name' => 'Widget Footer',
		'description' => 'Footer widgets', 'html5blank',
		'id' => 'widget-area-2',
		'before_widget' => '<div id="%1$s" class="%2$s col-sm-6 col-md-3">',
		'after_widget' => '</div>',
		'before_title' => '<h3>',
		'after_title' => '</h3>'
	));

	// Footer Left
	register_sidebar( array(
		'name'          => __( 'Footer left', 'theme_text_domain' ),
		'id'            => 'footer-left',
		'description'   => '',
		'class'         => '',
		'before_widget' => '<ul class="quicklinks-list">',
		'after_widget'  => '</ul>',
		'before_title'  => '<li class="title">',
		'after_title'   => '</li>'
	));

	// Footer Middle Left
	register_sidebar( array(
		'name'          => __( 'Footer Middle Left', 'theme_text_domain' ),
		'id'            => 'footer-middle-left',
		'description'   => '',
		'class'         => '',
		'before_widget' => '<ul class="quicklinks-list">',
		'after_widget'  => '</ul>',
		'before_title'  => '<li class="title">',
		'after_title'   => '</li>'
	));

	// Footer Middle Right
	register_sidebar( array(
		'name'          => __( 'Footer Middle Right', 'theme_text_domain' ),
		'id'            => 'footer-middle-right',
		'description'   => '',
		'class'         => '',
		'before_widget' => '<ul class="quicklinks-list">',
		'after_widget'  => '</ul>',
		'before_title'  => '<li class="title">',
		'after_title'   => '</li>'
	));

	// Footer Right
	register_sidebar( array(
		'name'          => __( 'Footer Right', 'theme_text_domain' ),
		'id'            => 'footer-right',
		'description'   => '',
		'class'         => '',
		'before_widget' => '<ul class="quicklinks-list">',
		'after_widget'  => '</ul>',
		'before_title'  => '<li class="title">',
		'after_title'   => '</li>'
	));
}
