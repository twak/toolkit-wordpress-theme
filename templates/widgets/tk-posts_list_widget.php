<?php 
/**
 * Template to display lists of posts
 * Data comes from ACF repeater field which gathers settings for different
 * post types. Maximum of four posts are displayed as stacked cards, and
 * where multiple layouts are configured, displayed in tabs.
 */

$tk_layouts = get_sub_field('posts_list_widgets');
$widget_title = get_sub_field( 'widget_title' );
if ( count( $tk_layouts ) ) {
    // collect data for lists here
    $lists = array();

    // see if there is any content to display
    $tab_count = 1;
    $widget_instance = tk_post_list_widget_get_instance();
    foreach ( $tk_layouts as $tk_layout ) {
        $layout_name = $tk_layout['acf_fc_layout'];
        $list = apply_filters( 'tk_post_list_widget_layout', array(), $layout_name, $tk_layout );
        if ( ! empty( $list ) ) {
            $lists[] = $list;
        }
    }

    if ( count( $lists ) ) {
        ?>
        <div class="skin-row-module-light container-row">
            <div class="wrapper-lg wrapper-pd-md">
            <?php if ( $widget_title ) : ?>
                <h3 class="h2-lg heading-underline"><?php echo $widget_title; ?></h3>
            <?php endif; ?>
            <?php
            // output tabs if there is more than one list to display

            // active class for first tab
            $active = ' class="active"';
            if ( count( $lists ) > 1 ) {
                ?>
                <div class="tk-tabs-header">
                    <ul class="nav nav-tabs tk-nav-tabs pull-left">
                    <?php foreach ( $lists as $list ) : ?>
                        <li<?php echo $active; $active = ''; ?>>
                            <a href="#posts-list-<?php echo $list["instance_id"]; ?>" data-toggle="tab"><?php echo $list["tab_text"]; ?></a>
                        </li>;
                    <?php endforeach; ?>
                    </ul>
                </div>
                <?php
            }
            // output content in stacked cards

            // active class for first tab content block
            $active = ' active in';
            // output lists
            foreach ( $lists as $list ) : ?>
                <div class="tab-content">
                    <?php if ( count( $lists ) > 1 ) : // tabs require additional wrapper ?>
                    <div class="tab-pane fade<?php echo $active; $active = ''; ?>" id="#posts-list-<?php echo $list["instance_id"]; ?>">
                    <?php endif; ?>
                    <div class="equalize">
                        <div class="tk-row row-reduce-gutter">
                        <?php if ( ! empty( $list["archive_link"] ) ) : ?>
                            <p class="tk-tabs-cta"><a class="more more-all more-dark pull-right" href="<?php echo $list["archive_link"]["url"]; ?>"><?php echo $list["archive_link"]["text"]; ?></a></p>
                        <?php endif; ?>
                        <?php foreach($list["items"] as $item ) : ?>
                            <div class="<?php echo $list["post_type"]; ?>-item col-sm-6 col-md-3">
                                <div class="card card-stacked skin-box-white skin-bd-b">
                                <?php if ( $item['thumbnail_url'] ) : ?>
                                    <div class="card-img">
                                        <div class="rs-img rs-img-2-1" style="background-image: url('<?php echo $item['thumbnail_url']; ?>');">
                                            <a href="<?php echo $item["url"]; ?>">
                                                <img src="<?php echo $item['thumbnail_url']; ?>" alt="<?php echo esc_attr($item["title"] ); ?>">
                                            </a>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                    <div class="card-content equalize-inner">
                                        <h3 class="heading-link-alt"><a href="<?php echo $item["url"]; ?>"><?php echo esc_attr($item["title"] ); ?></a></h3>
                                        <?php if ( $item['date'] ) : ?>
                                        <p class="heading-related"><?php echo $item["date"]; ?></p>
                                        <?php endif; ?>
                                        <div class="note"><?php echo $item["excerpt"]; ?></div>
                                        <a class="more" href="<?php echo $item["url"]; ?>">more</a>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                        </div>
                    </div>
                <?php if ( count( $lists ) > 1 ) : ?>
                    </div>
                <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php
    }
}
