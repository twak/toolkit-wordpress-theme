<?php get_header(); ?>

<div class="wrapper-pd">
    <ul class="breadcrumb">
        <li><a href="<?php echo site_url();?>">Home</a></li>
        <li>Profiles</li>
    </ul>
</div>

<div class="wrapper-md wrapper-pd">

    <?php if(get_field('tk_profiles_page_settings_title', 'option')){ ?>

    <h1 class="heading-underline"><?php the_field('tk_profiles_page_settings_title', 'option'); ?></h1>

    <?php } else { ?>

    <h1 class="heading-underline">Profiles</h1>

    <?php } ?>    

    <?php if(get_field('tk_profiles_page_settings_introduction', 'option')){ ?>
    
    <div class="wrapper-md">
        <?php the_field('tk_profiles_page_settings_introduction', 'option'); ?>
    </div>
    <?php } ?>

<?php

    //table profile layout

    $args = array(
        'post_type' => 'profiles',
        'posts_per_page' => -1,   
        'meta_key'  => 'tk_profiles_last_name',
        'orderby'   => 'meta_value',          
        'order'    => 'ASC'        
    );

    query_posts($args); 

    if (have_posts()) :
?>
    
    <table class="tablesaw table-profiles table-hover " data-tablesaw-sortable>
        <thead>
            <tr>
                <?php if(get_field('tk_profiles_page_settings_template_image', 'option')): //Related events ?>
                <th scope="col"></th>
                <?php endif; ?>                             
                <th scope="col">Name</th>
                <th scope="col">Email</th>   
                <th scope="col">Telephone</th>                
                <th scope="col">Job title</th>                
            </tr>
        </thead>
        <tbody>

<?php  while (have_posts()) : the_post(); ?>  

        <?php 

        if(get_field('tk_profiles_external_link_flag')): 
            $profile_link = get_field('tk_profiles_external_link'); 
        else: 
            $profile_link = get_permalink(); 
        endif;

        ?>      

        <tr>
            <?php if(get_field('tk_profiles_page_settings_template_image', 'option')): //image option ?>
            <td>
                <?php if ( has_post_thumbnail()): //Check if Thumbnail exists ?>                                        
                    <div class="rs-img img-avatar img-avatar-sm" style="background-image: url('<?php the_post_thumbnail_url('small');?>')">
                        <a href="<?php echo $profile_link; ?>"><img src="<?php the_post_thumbnail_url('small');?>" alt="<?php the_title(); ?>"></a>                       
                    </div>
                <?php else: ?>     
                    <div class="rs-img img-avatar img-avatar-sm" style="background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA95JREFUeNrsnE9r2mAcx9PVdjKhuoJuUm0tG3qYCPXQMpg9DNqbtw122EvYO9h1ewd7CYXtsJvHQg8VNuyhA7GHSUfrZimz0FohoFsP+y5hmdroXDR5nuj3RymJMTF8+P35Pr88eaY+vH2l0AazG0RAWIRFWIRFWIRFBIRFWITVZb7bd/AnJyyPRLcy640kM+H4KrZPy3vVUv7qR5OwTGw+Eo+tbN70+fVdIAsup74UcufVMmH9NQCKpTfnF+LddzbjTTx62qhVDgu5lnpJWEo4sYrQA5deX5gLLaWzLxCSCEzhUSkMFrL4vbWsLzBQLgdQRCVcDI42cbBi6Q09kf9XtD54/Pz8pIxEJsrFBMBC1UPatpy5BQajAFhzoUVkbsun7+feiMr3AkSpL3B3uOoZmCAFb4gpy5WBsBw63WWwbg3nGgOqjXGAhVLYR4IyZ3W61dB+ITAMnZYOLbWOsYviTnMIFgYr3tGFTzS5rm801frZUXHcYIWWUxgSj/yyGCo6CYttZTd0HQyDa9SOipCasZUN7B7sbOE/xszGIXglolgGWOI9CwM9FDhDPaEC+P8ELA5hW2D5k86z2jOaBi4QSWaMQ+3b9KxuYSFzzhIPay60aIhybITa0hMOMcF3wVpqV+fBDlhL9Cy3GmERlktzlp53pme9dlwcl9Wv78wjMtth6VrcJoOU1a//8d3rcauGGL4cFnIjuZSFJ48ugwVZMKqxixBV4bTOkk06sRqOkYJH5dL7MIY9fPZS0Zoz7UUtmlzHKLrXl+lZ9Kzeyd60K2/019tH0aNt4bsPVq+uvGkDy6YWPsOQsAiLsAiLRliERViERVjWTZ7H9C6AJcPoj2FIWIQluU3Zt8pRcDnlWGulUavUjop2T5m00bOQsB1rQuGHHKgPDEPCsscEtJVb6uUwyWWET2pdAav+rbRrbQ7E8adtbabgxMAyUrKFs6ZnvOMZhpe1ilIy+bw53CxbSIRG7av5z7kRFrzG7/iTK7/2o0Bm31wtj0333Wf++pAv3PxD6JYUl8GyXCVPy3vqxXdFW5oGVc8jNEPJC0t/TSeazOhv8MA7Puffx9IbAl/ylVSUwqdAKpF5YsQXNrB7vL8tyZI9EsGC7AonVruCDrv4EIcIq8MuTsrXl4T6nbkW4jhEWB3WZ3kZqRZnkwIWMpRpbrr62ZRqDqoUsCCdTJXXmfYaK2F1NxKuv0ePXWiuoEywZNFZ99ey1VL+YGdLX5enpdYRgPiQotTcMEKKKBk9ecn5wNUj2w3J/FyabWXCIizCIizCohEWYREWYREWYdEIi7AIi7DcZL8EGAAgHTQ4YUnwNQAAAABJRU5ErkJggg==)">
                        <a href="<?php echo $profile_link; ?>"></a>                       
                    </div>
                <?php endif; ?> 
            </td>
            <?php endif; ?>                             
            <td>              
                  
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
            </td>
            <td><?php if( get_field('tk_profiles_email') ): echo get_field('tk_profiles_email'); endif; ?></td>            
            <td><?php if( get_field('tk_profiles_telephone') ): echo get_field('tk_profiles_telephone'); endif; ?></td>
            <td><?php if( get_field('tk_profiles_job_title') ): echo get_field('tk_profiles_job_title'); endif; ?></td>            
        </tr>
            
<?php endwhile; ?>
    </tbody>

    </table>    

<?php endif; ?>

    <?php get_template_part('pagination'); ?>

</div>

<?php get_footer(); ?>
