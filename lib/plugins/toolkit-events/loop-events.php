<?php
    // Events loop
    if (have_posts()) : while (have_posts()) : the_post(); 
    //if (in_array($post->ID, $do_not_duplicate)) continue; //       

        //Get event vars
        $start_date = get_field('tk_events_start_date');
        $end_date = get_field('tk_events_end_date');
        $the_title = get_the_title();
        $the_permalink = get_the_permalink();

        //Format date            
        $date_format = date("l j F Y", strtotime($start_date));

        //Build js events object for the cal

        $events_object .=  "{
            title: '".$the_title."',\n
            url: '".$the_permalink."',\n
            start: '".$start_date."',\n
            end: '".$end_date."',\n
        },\n";        

?>    
    <div id="post-<?php the_ID(); ?>" <?php post_class('flag'); ?>>                 

        <?php if ( has_post_thumbnail()) : // Check if thumbnail exists ?>
        <div class="flag-img">
            <div class="rs-img rs-img-2-1" style="background-image: url('<?php the_post_thumbnail_url('large'); ?>');">
                <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
                    <?php the_post_thumbnail('large'); // Declare pixel size you need inside the array ?>
                </a>
            </div>
        </div>              
        <?php endif; ?>

        <div class="flag-body">
            <p class="heading-related"><?php tk_post_categories(); if($start_date) { echo ' - '.$date_format; } ?> </p>
            <h4 class="heading-link"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h4>                           
            <div class="excerpt">               
                <?php html5wp_excerpt('html5wp_index');  ?>
            </div>
        </div>

    </div>

<?php                    
        endwhile;    
    endif;
?>