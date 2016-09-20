<?php get_header(); ?>
<?php the_breadcrumb(); ?>

<?php    
    //Pass post type into hidden input for search
    $posty = post_type_archive_title('',false); //archive title
    $posty_small = strtolower($posty);  //lowercase title
?>

<div class="wrapper-sm wrapper-pd">
    <h1 class="heading-underline"><?php post_type_archive_title(); ?></h1>   

    <!--  Add back in when archived is ready
    <ul class="list-nav">       
        <li><?php echo "<a href='#' rel='nofollow'>Archived Events <span class='tk-icon tk-icon-chevron-right'></span></a>"; ?></li>        
    </ul> 
    -->

    <form action="<?php echo home_url(); ?>" role="search">
        <div class="island island-featured">
            <div class="row row-reduce-gutter">
                <div class="col-xs-12 col-sm-8 col-md-10">
                    <input type="hidden" name="post_type" value="<?php echo $posty_small; ?>">
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
   if (have_posts()) : while (have_posts()) : the_post(); 
?>    
    <article id="post-<?php the_ID(); ?>" <?php post_class('flag'); ?>>                 

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
            <p class="heading-related"><?php tk_post_categories(); ?></p>
            <h4 class="heading-link"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); if(get_field('event_start_date')) { echo ' - '.get_field('event_start_date'); } ?></a></h4>                           
            <div class="excerpt">               
                <?php html5wp_excerpt('html5wp_index');  ?>
            </div>
        </div>

    </article>

<?php                    
        endwhile;    
    endif;
?>
    
<?php get_template_part('pagination'); ?>

</div>

<?php get_footer(); ?>
