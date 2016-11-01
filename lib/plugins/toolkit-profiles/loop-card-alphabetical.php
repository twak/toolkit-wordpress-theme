<?php
//Table card layout - alphabetical
$args = array(
    'post_type' => 'profiles',
    'posts_per_page' => -1,   
    'meta_key'  => 'tk_profiles_last_name',
    'orderby'   => 'meta_value',          
    'order'    => 'ASC'        
);

query_posts($args); 
if (have_posts()):
?>

<div class="row equalize">

<?php  while (have_posts()) : the_post();

if(get_field('tk_profiles_external_link_flag')): 
    $profile_link = get_field('tk_profiles_external_link'); 
else: 
    $profile_link = get_permalink(); 
endif;

?>      
    <div class="col-xs-12 col-ms-6 col-sm-4 col-md-3">
        <div class="card-flat card-stacked-xs skin-bd-b skin-box-module">
            
            <div class="card-img">
            <?php if ( has_post_thumbnail()): //Check if Thumbnail exists ?>                                        
                <div class="rs-img" style="background-image: url('<?php the_post_thumbnail_url('small');?>')">
                    <a href="<?php echo $profile_link; ?>"><img src="<?php the_post_thumbnail_url('small');?>" alt="<?php the_title(); ?>"></a>                       
                </div>
            <?php else: ?>     
                <div class="rs-img">
                    <a href="<?php echo $profile_link; ?>"></a>                       
                </div>
            <?php endif; ?> 
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