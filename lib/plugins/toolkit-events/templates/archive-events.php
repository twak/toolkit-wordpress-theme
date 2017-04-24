<?php 
// check page
$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

// additional query to get current events
$current_events = new WP_Query(array(
    'post_type' => 'events',         
    'meta_key'  => 'tk_events_start_date',
    'orderby'   => 'meta_value_num',
    'order'     => 'ASC',
    'nopaging' => true,
    'meta_query' => array(
        'relation' => 'OR',
        'start_clause' => array(
            'key' => 'tk_events_start_date',
            'value' => date('Y-m-d'),
            'compare' => '>=',
            'type' => 'DATETIME'
        ),
        'end_clause' => array(
            'key' => 'tk_events_end_date',
            'value' => date('Y-m-d'),
            'compare' => '>=',
            'type' => 'DATETIME'
        )
    ),
));

// booleans for content to display
$has_calendar = get_field('tk_events_page_settings_calendar', 'option'); 
$has_current = $current_events->have_posts();
$has_archive = have_posts();

get_header();
the_breadcrumb();
$title = get_field('tk_events_page_settings_title', 'option');
if ( ! $title ) {
    $title = post_type_archive_title('', false);
}
?>
<div class="wrapper-sm wrapper-pd">
    <h1 class="heading-underline"><?php echo $title; ?></h1>   

    <?php 
    // events page introduction (option)
    $intro = get_field( 'tk_events_page_settings_introduction', 'option' );
    if ( $intro ) {
        print( apply_filters( 'the_content', $intro ) );
    }

    // show search?
    $hide_search = get_field('tk_events_page_settings_search', 'option');
    if ( ! $hide_search && ( $has_current || $has_archive ) ) {
        printf('<form action="%s" role="search"><div class="island island-featured"><div class="row row-reduce-gutter">', home_url() );
        print('<div class="col-xs-12 col-sm-8 col-md-10">');
        print('<input type="hidden" name="post_type" value="events">');
        print('<label class="sr-only" for="keyword">Search</label>');
        print('<input id="keyword" type="search" name="q" placeholder="Search by keyword" value="">');
        print('</div>');
        print('<div class="col-xs-4 col-sm-4 col-md-2 pull-right">');
        print('<input type="submit" value="Search">');
        print('</div>');
        print('</div></div></form>');
    }

    // flags for availibility of events

    // tabs for event listings / calendar
    if ( $has_current || $has_archive ) {
        print('<div class="tk-tabs-header m-b"><ul id="myTab" class="nav nav-tabs tk-nav-tabs">');
        if ( $has_current ) {
            $tab_title = get_field('tk_events_page_settings_current_title', 'option');
            if ( ! $tab_title ) {
                $tab_title = "Current Events";
            }
            $active = ( $paged == 1 ) ? ' class="active"': '';
            printf('<li%s><a href="#current_events" data-toggle="tab">%s</a></li>', $active, $tab_title );
        }
        if ( $has_archive ) {
            $active = ( $has_current && $paged == 1 ) ? '': ' class="active"';
            $tab_title = get_field('tk_events_page_settings_archive_title', 'option');
            if ( ! $tab_title ) {
                $tab_title = "Events Archive";
            }
            printf('<li%s><a href="#past_events" data-toggle="tab">%s</a></li>', $active, $tab_title );
        }
        if ( $has_calendar ) {
            $tab_title = get_field('tk_events_page_settings_calendar_title', 'option');
            if ( ! $tab_title ) {
                $tab_title = "Calendar View";
            }
            printf('<li><a href="#calendar-view" data-toggle="tab">%s</a></li>', $tab_title );
        }
        print('</ul></div>');

        // tab content
        print('<div class="tab-content">');

        // current events list (custom query)
        if ( $has_current ) {
            $active = ( $paged == 1 ) ? ' active in': '';
            printf('<div class="tab-pane fade%s" id="current_events">', $active);
            while ( $current_events->have_posts() ) : $current_events->the_post();

                $date_format = tk_events::get_date_string($post->ID, 'archive');

                // get taxonomy data
                $categories = get_the_term_list( $post->ID, 'event_category', '', ', ', ' - ');
                $tags = get_the_term_list( $post->ID, 'event_tag');

                // event URL
                $event_url = get_permalink();
                $external_url = get_field('tk_events_external_url');
                $use_external = get_field('tk_events_external_url_link');
                if ( $external_url && $use_external ) {
                    $event_url = $external_url;
                }
    ?>    
        <div id="post-<?php the_ID(); ?>" <?php post_class('flag'); ?>>              
            <?php if ( has_post_thumbnail()) : // Check if thumbnail exists ?>
            <div class="flag-img">
                <div class="rs-img rs-img-2-1" style="background-image: url('<?php the_post_thumbnail_url('large'); ?>');">
                    <a href="<?php echo $event_url; ?>" title="<?php the_title(); ?>">
                        <?php the_post_thumbnail('large'); ?>
                    </a>
                </div>
            </div>              
            <?php endif; ?>
            <div class="flag-body">
                <p class="heading-related"><?php echo $categories . $date_format; ?></p>
                <h4 class="heading-link"><a href="<?php echo $event_url; ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h4>                           
                <div class="excerpt">               
                    <?php the_excerpt(); ?>
                </div>
            </div>
        </div>
    <?php
            endwhile;
            print('</div>');
            wp_reset_postdata();
        }

        // events archive (normal query - made to get only past events by limit_to_past_events())
        if ( $has_archive ) {
            $active = ( $current_events->have_posts() && $paged == 1 ) ? '': ' active in';
            printf('<div class="tab-pane fade%s" id="past_events">', $active);

            global $wp_query;
            if ($wp_query->max_num_pages > 1) {
                printf('<div><p class="divider-header-heading pull-right">page %d of %d</p></div>', $paged, $wp_query->max_num_pages );
            }

            while (have_posts()) : the_post(); 
                
                $date_format = tk_events::get_date_string($post->ID, 'archive');

                // get taxonomy data
                $categories = get_the_term_list( $post->ID, 'event_category', '', ', ', ' - ');
                $tags = get_the_term_list( $post->ID, 'event_tag');

                // event URL
                $event_url = get_permalink();
                $external_url = get_field('tk_events_external_url');
                $use_external = get_field('tk_events_external_url_link');
                if ( $external_url && $use_external ) {
                    $event_url = $external_url;
                }
    ?>    
        <div id="post-<?php the_ID(); ?>" <?php post_class('flag'); ?>>              
            <?php if ( has_post_thumbnail()) : // Check if thumbnail exists ?>
            <div class="flag-img">
                <div class="rs-img rs-img-2-1" style="background-image: url('<?php the_post_thumbnail_url('large'); ?>');">
                    <a href="<?php echo $event_url; ?>" title="<?php the_title(); ?>">
                        <?php the_post_thumbnail('large'); ?>
                    </a>
                </div>
            </div>              
            <?php endif; ?>
            <div class="flag-body">
                <p class="heading-related"><?php echo $categories . $date_format; ?></p>
                <h4 class="heading-link"><a href="<?php echo $event_url; ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h4>                           
                <div class="excerpt">               
                    <?php the_excerpt(); ?>
                </div>
            </div>
        </div>
    <?php
            endwhile;

            ?>
            <nav>   
            <?php tk_pagination(); ?>
            </nav>
            <?php
            print('</div>');
        } 
        
        // calendar
        if ( $has_calendar ) : ?>
        <div class="tab-pane fade" id="calendar-view">
            <div class="calendar-container">
                <div class="js-events-calendar calendar-events" id='calendar'></div>
            </div>            
        </div>
        <?php endif; 
    } else {
        print('<p>No events to display</p>');
    }
    ?>

</div>

<script>
    // Events cal object - sets parameters for AJAX
    var eventsArray = {
        url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
        type: 'POST',
        data: {
            action: 'get_events',
            ajaxnonce: '<?php echo wp_create_nonce( 'events_ajax_nonce' ); ?>'
        }
    };
    var eventsDate = '<?php echo date('Y-m-d'); ?>'; // set to today
</script>
<style>.calendar-container { overflow-y:hidden; }</style>
<?php get_footer(); ?>
