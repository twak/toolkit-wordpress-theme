<?php
    //Not is use found better solution for cutsom post type search by using saerch page
    //Used instead of standard loop for filter by keyword and category
    //e.g. index.php serach and archive search

    function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    $paged = ( get_query_var('page') ) ? get_query_var('page') : 1;
    
    $keyword = $post_type = ""; // define variables and set to empty values    
    
    if ($_SERVER['REQUEST_METHOD'] == 'GET'):
        $keyword = test_input($_GET['query']);   
        $post_type = test_input($_GET['post_type']);        
    endif;
  
    $the_query = new WP_Query(array(
        'post_type' => $post_type,
        'posts_per_page' => 3,
        'paged' => $paged,
        's' => $keyword
    ));

?>

<?php if($keyword !== ""){ ?>

<p class="m-b-0"><?php echo sprintf( __( '%s Search results for ', 'html5blank' ), $wp_query->found_posts ); echo '<strong>&#8220;'.$keyword.'&#8221;</strong>' ?></span></p>
<hr class="m-t-0">

<?php } ?>

<?php

    if ( $the_query->have_posts() ){
        while ( $the_query->have_posts() ){
            $the_query->the_post();
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
            <h4 class="heading-link"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h4>                           
            <div class="excerpt">               
                <?php html5wp_excerpt('html5wp_index'); // Build your custom callback length in functions.php ?>
            </div>
        </div>

    </article>

<?php        
       
        }


    if (function_exists(custom_pagination)) {
        custom_pagination($the_query->max_num_pages,"",$paged);
    }

    wp_reset_postdata();

    } else {

    echo '<h4 class="heading-link">No results</h4>';

    }
    
  

?>

