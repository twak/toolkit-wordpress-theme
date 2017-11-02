<?php 
/**
 * Template to display lists of posts
 * Data comes from ACF repeater field which gathers settings for different
 * post types. Maximum of four posts are displayed as stacked cards, and
 * where multiple layouts are configured, displayed in tabs.
 */

include_once(dirname(__FILE__) . '/posts_list_widget_functions.php');

$tk_layouts = get_sub_field('posts_list_widgets');
$widget_title = get_sub_field( 'widget_title' );
if ( count( $tk_layouts ) ) {
    // collect data for tabs and panels here
    $tabs = array();
    $panels = array();

    // see if there is any content to display
    $tab_count = 1;
    $widget_instance = tk_post_list_widget_get_instance();
    foreach ( $tk_layouts as $tk_layout ) {
        $layout_name = $tk_layout['acf_fc_layout'];
        switch ($layout_name) {
            case 'post_list':
                $panel = tk_post_list_widget_get_posts_list( $tk_layout );
                if ( '' !== $panel ) {
                    // link to archive
                    $archive_link = tk_get_post_archive_link( $tk_layout, 'post' );
                    // list html
                    $panels['posts-list-' . $widget_instance . '-tab-' . $tab_count] = sprintf('%s<div class="equalize"><div class="tk-row row-reduce-gutter">%s</div></div>', $archive_link, $panel );
                    // tab link
                    $tabs['posts-list-' . $widget_instance . '-tab-' . $tab_count] = sprintf('<a href="#posts-list-%s-tab-%s" data-toggle="tab">%s</a>', $widget_instance, $tab_count, $tk_layout['tab_text'] );
                    $tab_count++;
                }
                break;
            case 'news_list':
                $panel = tk_post_list_widget_get_news_list( $tk_layout );
                if ( '' !== $panel ) {
                    // link to archive
                    $archive_link = tk_get_post_archive_link( $tk_layout, 'news' );
                    // list html
                    $panels['posts-list-' . $widget_instance . '-tab-' . $tab_count] = sprintf('%s<div class="equalize"><div class="tk-row row-reduce-gutter">%s</div></div>', $archive_link, $panel );
                    // tab link
                    $tabs['posts-list-' . $widget_instance . '-tab-' . $tab_count] = sprintf('<a href="#posts-list-%s-tab-%s" data-toggle="tab">%s</a>', $widget_instance, $tab_count, $tk_layout['tab_text'] );
                    $tab_count++;
                }
                break;
            case 'events_list':
                $panel = tk_post_list_widget_get_events_list( $tk_layout );
                if ( '' !== $panel ) {
                    // link to archive
                    $archive_link = tk_get_post_archive_link( $tk_layout, 'events' );
                    // list html
                    $panels['posts-list-' . $widget_instance . '-tab-' . $tab_count] = sprintf('%s<div class="equalize"><div class="tk-row row-reduce-gutter">%s</div></div>', $archive_link, $panel );
                    // tab link
                    $tabs['posts-list-' . $widget_instance . '-tab-' . $tab_count] = sprintf('<a href="#posts-list-%s-tab-%s" data-toggle="tab">%s</a>', $widget_instance, $tab_count, $tk_layout['tab_text'] );
                    $tab_count++;
                }
                break;
        }
    }

    // display content
    if ( count($tabs) ) {
        $is_active = true;
        $tab_content = '';
        $panel_content = '';
        print('<div class="skin-row-module-light container-row"><div class="wrapper-lg wrapper-pd-md">');
        if ( $widget_title ) {
            printf('<h3 class="h2-lg heading-underline">%s</h3>', $widget_title );
        }
        if ( count($tabs) > 1) {
            // more than one list - output tabs
            $tab_content .= '<div class="tk-tabs-header"><ul class="nav nav-tabs tk-nav-tabs pull-left">';
            $panel_content = '<div class="tab-content">';
            foreach ( $tabs as $id => $tab ) {
                if ( $is_active ) {
                    $class = ' active in';
                    $classattr = ' class="active"';
                    $is_active = false;
                } else {
                    $class = '';
                    $classattr = '';
                }
                $tab_content .= sprintf('<li%s>%s</li>', $classattr, $tab );
                $panel_content .= sprintf( '<div class="tab-pane fade%s" id="%s">%s</div>', $class, $id, $panels[$id] );
            }
            $tab_content .= '</ul></div>';
            $panel_content .= '</div>';
        } else {
            // one list
            $panel_content = sprintf('<div>%s</div>', implode('', $panels) );
        }
        print $tab_content . $panel_content;
        print('</div></div>');
    }
}