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

//Events calendar flag
$events_cal_flag = get_field('tk_events_page_settings_calendar', 'option'); 

get_header();
the_breadcrumb();
$title = get_field('tk_events_page_settings_title', 'option');
if ( ! $title ) {
    $title = post_type_archive_title('', false);
}
?>
<div class="wrapper-sm wrapper-pd">
    <h1 class="heading-underline"><?php echo $title; ?></h1>   

    <?php if ( get_field( 'tk_events_page_settings_introduction', 'option' ) ) : ?>

        <p><?php the_field('tk_events_page_settings_introduction', 'option'); ?></p>

    <?php endif; ?>
        <form action="<?php echo home_url(); ?>" role="search">
            <div class="island island-featured">
                <div class="row row-reduce-gutter">
                    <div class="col-xs-12 col-sm-8 col-md-10">
                        <input type="hidden" name="post_type" value="events">
                        <label class="sr-only" for="keyword">Search</label>
                        <input id="keyword" type="search" name="q" placeholder="Search by keyword" value="<?php if(isset($_GET['query'])){ echo $_GET['query']; } ?>">
                    </div>
                    <div class="col-xs-4 col-sm-4 col-md-2 pull-right">
                        <input type="submit" value="Search">
                    </div>                           
                </div>                                            
            </div>
        </form>

    <?php
    print('<div class="tk-tabs-header m-b"><ul id="myTab" class="nav nav-tabs tk-nav-tabs">');
    if ( $current_events->have_posts() ) {
        $tab_title = get_field('tk_events_page_settings_current_title', 'option');
        if ( ! $tab_title ) {
            $tab_title = "Current Events";
        }
        $active = ( $paged == 1 ) ? ' class="active"': '';
        printf('<li%s><a href="#current_events" data-toggle="tab">%s</a></li>', $active, $tab_title );
    }
    $active = ( $current_events->have_posts() && $paged == 1 ) ? '': ' class="active"';
    $tab_title = get_field('tk_events_page_settings_archive_title', 'option');
    if ( ! $tab_title ) {
        $tab_title = "Events Archive";
    }
    printf('<li%s><a href="#past_events" data-toggle="tab">%s</a></li>', $active, $tab_title );
    $tab_title = get_field('tk_events_page_settings_calendar_title', 'option');
    if ( ! $tab_title ) {
        $tab_title = "Calendar View";
    }
    if ( get_field('tk_events_page_settings_calendar', 'option') ) {
        printf('<li><a href="#calendar-view" data-toggle="tab">%s</a></li>', $tab_title );
    }
    print('</ul></div>');
    print('<div class="tab-content">');
    if ( $current_events && $current_events->have_posts() ) {
        $active = ( $paged == 1 ) ? ' active in': '';
        printf('<div class="tab-pane fade%s" id="current_events">', $active);
        while ( $current_events->have_posts() ) : $current_events->the_post();

            //Get event vars
            $start_date = get_field('tk_events_start_date');
            $end_date = get_field('tk_events_end_date');

            //Format date
            if ( $start_date ) {
                if ( ! $end_date || $start_date == $end_date ) {       
                    $date_format = date("l j F Y", strtotime($start_date));
                } else {
                    $date_format = date("j/nY", strtotime($start_date)) . ' - ' . date("j/nY", strtotime($end_date));
                }
            } else {
                $date_format = '';
            }

            // get taxonomy data
            $categories = get_the_term_list( $post->ID, 'event_category', '', ', ', ' - ');
            $tags = get_the_term_list( $post->ID, 'event_tag');

            // event URL
            $event_url = get_field('tk_events_external_url');
            if ( ! $event_url ) {
                $event_url = get_permalink();
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
    if ( have_posts() ) {
        $active = ( $current_events->have_posts() && $paged == 1 ) ? '': ' active in';
        printf('<div class="tab-pane fade%s" id="past_events">', $active);

        global $wp_query;
        if ($wp_query->max_num_pages > 1) {
            printf('<div><p class="divider-header-heading pull-right">page %d of %d</p></div>', $paged, $wp_query->max_num_pages );
        }

        while (have_posts()) : the_post(); 
            //Get event vars
            $start_date = get_field('tk_events_start_date');
            $end_date = get_field('tk_events_end_date');

            //Format date
            if ( $start_date ) {
                if ( ! $end_date || $start_date == $end_date ) {       
                    $date_format = date("l j F Y", strtotime($start_date));
                } else {
                    $date_format = date("j/nY", strtotime($start_date)) . ' - ' . date("j/nY", strtotime($end_date));
                }
            } else {
                $date_format = '';
            }

            // get taxonomy data
            $categories = get_the_term_list( $post->ID, 'event_category', '', ', ', ' - ');
            $tags = get_the_term_list( $post->ID, 'event_tag');

            // event URL
            $event_url = get_field('tk_events_external_url');
            if ( ! $event_url ) {
                $event_url = get_permalink();
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
    
    if ( $events_cal_flag ) : ?>
    <div class="tab-pane fade" id="calendar-view">
        <div class="calendar-container">
            <div class="js-events-calendar calendar-events" id='calendar'></div>
        </div>            
    </div>
    <?php endif; ?>

</div>

<script>
    //Events cal object
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
