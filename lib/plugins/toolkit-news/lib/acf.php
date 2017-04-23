<?php
/**
 * Advanced Custom Fields setup for Toolkit News Plugin
 */


if ( ! class_exists( 'tk_news_acf' ) ) {

    class tk_news_acf
    {
        /* register all hooks with wordpress API */
        public static function register()
        {
            /**
             * Sets up custom fields in ACF
             */
            add_action( 'acf/init', array( __CLASS__, 'setup_acf' ) );

        }

        /**
         * ACF news settings
         */
        public static function setup_acf()
        {
            /**
             * options page for news
             */
            acf_add_options_page( array(
                'page_title' => 'News Settings',
                'menu_title' => 'News Settings',
                'menu_slug' => 'tk-news-settings',
                'capability' => 'edit_posts',
                'redirect' => false,
                'parent_slug' => 'edit.php?post_type=news',
            ));

            /**
             * News settings
             */
            acf_add_local_field_group(array (

                'key' => 'group_tk_news_page_settings',
                'title' => 'News page settings',
                'fields' => array (
                    array (
                        'key' => 'field_tk_news_page_settings_title',
                        'label' => 'Page Title',
                        'name' => 'tk_news_page_settings_title',
                        'type' => 'text',
                        'instructions' => 'Add a custom title to the news list page. If left blank the title of the page will be "News".',
                        'default_value' => 'News',
                    ),
                    array ( //page intro
                        'key' => 'field_tk_news_page_settings_introduction',
                        'label' => 'Page introduction',
                        'name' => 'tk_news_page_settings_introduction',
                        'type' => 'wysiwyg',
                        'instructions' => 'Add an introduction to the top of the news page.',
                        'tabs' => 'all',
                        'toolbar' => 'basic',
                        'media_upload' => 0,
                    ),                    
                    array (
                        'key' => 'field_tk_news_single_settings_related',
                        'label' => 'Related news',
                        'name' => 'tk_news_single_settings_related',
                        'type' => 'checkbox',
                        'instructions' => 'Ticking this box will make news related by category appear at the bottom of every news page.',
                        'choices' => array(
                            'show_related'   => 'Show related news on the news page'
                        ),
                    ),           
                ),
                'location' => array (
                    array (
                        array (
                            'param' => 'options_page',
                            'operator' => '==',
                            'value' => 'tk-news-settings',
                        ),
                    ),
                ),
                'menu_order' => 0,
                'position' => 'normal',
                'style' => 'default',
                'label_placement' => 'top',
                'instruction_placement' => 'label',
                'hide_on_screen' => '',
                'active' => 1,
                'description' => '',
            ));
        }

    }
    tk_news_acf::register();
}

