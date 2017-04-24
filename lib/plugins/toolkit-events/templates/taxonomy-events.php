<?php 
/**
 * Events taxonomy archive template
 */
get_header();
the_breadcrumb();
$use_prefix = get_field('tk_events_taxonomy_settings_prefix', 'option');
if ( $use_prefix ) {
    $archive_title = get_field('tk_events_page_settings_title', 'option');
    if ( ! $archive_title ) {
        $obj = get_post_type_object( 'events' );
        $archive_title = $obj->labels->name;
    }
    $archive_prefix = $archive_title . ': ';
} else {
    $archive_prefix = '';
}
?>
<div class="wrapper-sm wrapper-pd">
    <h1 class="heading-underline"><?php single_term_title($archive_prefix); ?></h1>   

    <?php 
    // events page introduction (taxonomy introduction)
    $term_obj = get_queried_object();
    $intro = get_field('tk_events_taxonomy_introduction', $term_obj->taxonomy . '_' . $term_obj->term_id);
    if ( $intro ) {
        print( apply_filters( 'the_content', $intro ) );
    }

    // show search?
    $hide_search = get_field('tk_events_page_settings_search', 'option');
    if ( ! $hide_search ) {
        printf('<form action="%s" role="search">', home_url() );
        print('<div class="island island-featured"><div class="row row-reduce-gutter"><div class="col-xs-12 col-sm-8 col-md-10">');
        print('<input type="hidden" name="post_type" value="events">');
        print('<label class="sr-only" for="keyword">Search</label>');
        print('<input id="keyword" type="search" name="q" placeholder="Search by keyword" value="">');
        print('</div><div class="col-xs-4 col-sm-4 col-md-2 pull-right">');
        print('<input type="submit" value="Search">');
        print('</div></div></div></form>');
    }

    // events archive (normal query - made to get only past events by limit_to_past_events())
    if ( have_posts() ) {

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
                    $date_format = date("j/n/Y", strtotime($start_date)) . ' - ' . date("j/n/Y", strtotime($end_date));
                }
            } else {
                $date_format = '';
            }

            // get taxonomy data
            $categories = get_the_term_list( $post->ID, 'event_category', '', ', ', ' - ');

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
    } 
?>
</div>

<?php get_footer(); ?>
