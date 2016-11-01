<?php 

$events_object = ""; //events js object for calendar
$archived_id = get_cat_ID('Archived events'); //archived cat ID 

//Custom loop setup for events
$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

if(get_field('tk_events_page_settings_archive', 'option')): //If theme setting checked to hide archived-events category
    query_posts(array(
        'post_type' => 'events',         
        'meta_key'  => 'tk_events_start_date',
        'orderby'   => 'meta_value_num',
        'order'     => 'ASC',        
        'cat'       => '-'.$archived_id,
        'paged'     => $paged
    ));
else:
    query_posts(array(
        'post_type' => 'events',         
        'meta_key'  => 'tk_events_start_date',
        'orderby'   => 'meta_value_num',
        'order'     => 'ASC',
        'cat'       => '',                
        'paged'     => $paged
    ));
endif;


//Events calendar flag
if(get_field('tk_events_page_settings_calendar', 'option')): 
    $events_cal_flag = 1;
else:
    $events_cal_flag = 0;
endif;

?>

<?php get_header(); ?>
<?php the_breadcrumb(); ?>

<div class="wrapper-sm wrapper-pd">
    <h1 class="heading-underline"><?php post_type_archive_title(); ?></h1>   

    <?php if(get_field('tk_events_page_settings_introduction', 'option')): ?>

        <p><?php the_field('tk_events_page_settings_introduction', 'option'); ?></p>

    <?php endif; ?>

    <?php if($events_cal_flag): ?>

    <div class="tk-tabs-header m-b">
        <ul id="myTab" class="nav nav-tabs tk-nav-tabs">
            <li class="active"><a href="#list-view" data-toggle="tab">List view</a></li>
            <li><a href="#calendar-view" data-toggle="tab">Calendar view</a></li>
        </ul>
    </div>

    <div class="tab-content">
        <div class="tab-pane fade active in" id="list-view">    

    <?php endif; ?>    

        <?php if(get_field('tk_events_page_settings_archive', 'option')): //If theme setting checked to hide archived ?>
        
        <ul class="list-nav">       
            <li><a href="<?php echo get_category_link($archived_id); ?>">Archived Events <span class="tk-icon tk-icon-chevron-right"></span></a></li>
        </ul> 

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

    <?php include_once(dirname(__FILE__) . '/loop-events.php' ); ?>
            
    <?php get_template_part('pagination'); ?>

    <?php if($events_cal_flag): ?>

    </div>

    <div class="tab-pane fade" id="calendar-view">
        <div class="calendar-container">
            <div class="js-events-calendar calendar-events" id='calendar'></div>
            <ul class="calendar-legend">
                <li class="single-day"><span></span>One day event</li>
                <li class="multi-day"><span></span>Reoccuring events</li>
            </ul>
        </div>            
    </div>

    <?php endif; ?>

</div>

<script>
    //Events cal object
    var eventsArray = [ <?php echo $events_object; ?> ];
    var eventsDate = '<?php echo date('Y-m-d'); ?>'; // set to today
</script>

<?php get_footer(); ?>
