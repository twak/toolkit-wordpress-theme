<?php
/**
 * Plugin Name: Toolkit News
 * Plugin URI: http://toolkit.leeds.ac.uk/wordpress
 * Description: This plugin adds toolkit news
 * Version: 1.0.1
 * Author: Web Team
 * Author URI: http://toolkit.leeds.ac.uk/wordpress
 * License: GPL2
 */

// include files from lib
include_once dirname(__FILE__) . '/acf.php';
include_once dirname(__FILE__) . '/admin.php';
include_once dirname(__FILE__) . '/post_type.php';


/**
 * Add in news templates
 */

// https://codex.wordpress.org/Plugin_API/Filter_Reference/single_template

function tk_news_single_temple($single_template) { //single template
    global $post;
    if ($post->post_type == 'news') {
        $single_template = dirname(__FILE__) . '/single-news.php';
    }

    return $single_template;
}

add_filter('single_template', 'tk_News_single_temple');

function tk_news_archive_temple($archive_template) { //archive template
    global $post;
    if ($post->post_type == 'news') {
        $archive_template = dirname(__FILE__) . '/archive-news.php';
    }

    return $archive_template;
}

add_filter('archive_template', 'tk_news_archive_temple');



/**
 * Flush rewrite rules when creating new post type
 */

//https://paulund.co.uk/flush-permalinks-custom-post-type

function flush_rules_tk_news() {
    create_post_type_tk_news();
    flush_rewrite_rules();
}

register_activation_hook( __FILE__, 'flush_rules_tk_news' );