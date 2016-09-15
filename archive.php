<?php get_header(); ?>

<?php the_breadcrumb(); ?>

<?php

    //Archive for events, excludes Archived category
    
    //Archive post name
    $posty = post_type_archive_title('',false);
    $posty_small = strtolower($posty);
    
    //spit out select of categories just for post type
    $cats = get_categories();     
    $cat_list = [];     
    $args = array(
        'post_type' => $posty_small,            
        'order'    => 'DESC'            
    );        
    
    //Create an array of categories that the post type has
    $query = new WP_Query( $args );    
    while ( $query->have_posts() ):

        $query->the_post();    
        $cats = get_the_category(get_the_ID());

        foreach ($cats as $cat):                        
            if (!in_array($cat->cat_ID, $cat_list)):
                array_push($cat_list, $cat->cat_ID);
            endif;            
        endforeach;
    endwhile;
  
    wp_reset_query();

?>


<div class="wrapper-sm wrapper-pd">
	<h1 class="heading-underline"><?php post_type_archive_title(); ?></h1>

    <form action="<?php echo home_url(); ?>" role="search">
    	<div class="island island-featured">
            <div class="row row-reduce-gutter">
                <div class="col-xs-12 col-sm-8 col-md-10">
                    <input type="hidden" name="post_type" value="<?php echo $posty_small; ?>">
                    <label class="sr-only" for="keyword">Search</label>
                    <input id="keyword" type="search" name="q" placeholder="Search by keyword" value="">
                </div>
                
<!--                
                <div class="col-xs-12 col-sm-8 col-md-10">
                    <select name="cat_id">
                        <option value="all">All categories</option>
<?php 
                        foreach ($cat_list as $cat_ID):

                        echo '<option value="'.$cat_ID.'">'.get_the_category_by_ID( $cat_ID ).'</option>';        

                        endforeach;
?>
                    </select>
                </div>                                
-->
                <div class="col-xs-4 col-sm-4 col-md-2 pull-right">
                    <input type="submit" value="Search">
                </div>                           
            </div>                             
        </div>
    </form>
	
    <?php get_template_part('loop-flag'); ?>
	<?php get_template_part('pagination'); ?>

</div>

<?php get_footer(); ?>
