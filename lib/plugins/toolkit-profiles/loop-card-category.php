<?php

// Card layout order by category
// get all the categories and for each echo out profiles
$cats = get_categories(); 

foreach ($cats as $cat):

$loop = new WP_Query( array( 
    'post_type' => 'profiles', 
    'cat' => $cat->term_id, // Whatever the category ID is for your aerial category
    'posts_per_page' => -1,    
    'order' => 'DESC' // Ditto
) );  
?>

<?php if($loop->have_posts()): ?>
    <div class="content-header">
        <h4 class="content-header-heading content-header-heading-underline pull-left"><?php echo $cat->name; ?></h4>    
    </div>

    <div class="row clearfix equalize">
<?php       
       while ( $loop->have_posts() ) : $loop->the_post(); 
?>          
        <div class="col-xs-12 col-ms-6 col-sm-4 col-md-3">
   			<div class="card-flat card-stacked-xs skin-bd-b skin-box-module">
                <div class="card-img">          
                    <?php if ( has_post_thumbnail()) { ?>
                        <div class="rs-img rs-img-1-1" style="background-image: url('<?php the_post_thumbnail_url('large'); ?>');">
                            <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
                                <?php the_post_thumbnail('large'); // Declare pixel size you need inside the array ?>
                            </a>
                        </div>
                    <?php } else { ?>           
                        <div class="rs-img">
                            <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"></a>
                        </div>
                    <?php } ?>          
                </div>
                <div class="card-content equalize-inner">
	                <h3 class="heading-link text-center">
	                    <a href="<?php echo $profile_link; ?>">              
	                    <?php
	                        if( get_field('tk_profiles_first_name') && get_field('tk_profiles_last_name')): 
	                            if( get_field('tk_profiles_title')): echo get_field('tk_profiles_title').' '; endif;
	                            echo get_field('tk_profiles_first_name').' '.get_field('tk_profiles_last_name'); 
	                        else: 
	                            echo the_title();
	                        endif; 
	                    ?>  
	                    <?php if(get_field('tk_profiles_external_link_flag')): ?>
	                        <span class="tk-icon-external" aria-hidden="true"></span>
	                    <?php endif; ?>             
	                    </a>
	                </h3>
	                <h4 class="heading-related text-center">
	                    <?php if( get_field('tk_profiles_job_title') ): echo get_field('tk_profiles_job_title'); endif; ?>
	                </h4>
	            </div>            
            </div>                
        </div>

    <?php endwhile; ?>
    </div>
<?php endif; ?>   
<?php endforeach;  ?>