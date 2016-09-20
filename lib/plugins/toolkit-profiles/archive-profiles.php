<?php get_header(); ?>

<div class="wrapper-pd">
    <ul class="breadcrumb">
        <li><a href="<?php echo site_url();?>">Home</a></li>
        <li>Profiles</li>
    </ul>
</div>

<div class="wrapper-sm wrapper-pd">

    <h1 class="heading-underline">Profiles</h1>
    
    <?php if(get_field('profiles_page_introduction', 'option')){ ?>
    <div class="wrapper-md">
        <?php the_field('profiles_page_introduction', 'option'); ?>
    </div>
    <?php } ?>

    <?php

//table profile layout

    $args = array(
        'post_type' => 'profiles',
        'posts_per_page' => -1,
        //'cat'      => $cat_id,          
        'order'    => 'ASC'
        //'paged' => ( get_query_var('paged') ? get_query_var('paged') : 1 )    
    );

    query_posts($args); 

    if (have_posts()) :
?>
    
    <table class="table table-stripe table-bordered table-hover tablesaw tablesaw-stack tablesaw-sortable">
        <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <!-- <th>Job Title</th> -->
            <th>Role</th>
            <!-- <th>Category</th> -->
        </tr>

<?php  while (have_posts()) : the_post(); ?>        

        <tr>
            <td>                    
                <a href="<?php if( get_field('profile_external_link') ): echo 'http://'.get_field('profile_external_link'); else: the_permalink(); endif; ?>">              
                <?php
                    if( get_field('profile_first_name') && get_field('profile_surname')): 
                        if( get_field('profile_title')): echo get_field('profile_title').' '; endif;
                        echo get_field('profile_first_name').' '.get_field('profile_surname'); 
                    else: 
                        echo the_title();
                    endif; 
                ?>  
                <?php if( get_field('profile_external_link') ): ?>
                    <span class="tk-icon-external" aria-hidden="true"></span>
                <?php endif; ?>             
                </a>
            </td>
            <td><?php if( get_field('profile_telephone') ): echo get_field('profile_telephone'); endif; ?></td>
            <td><?php if( get_field('profile_email') ): echo get_field('profile_email'); endif; ?></td>
            <!-- <td><?php if( get_field('profile_job_title') ): echo get_field('profile_job_title'); endif; ?></td> -->
            <td><?php if( get_field('profile_role') ): echo get_field('profile_role'); endif; ?></td>
            <!-- <td><?php foreach((get_the_category()) as $category) { echo $category->cat_name . ' '; } ?></td> -->
        </tr>
            
<?php endwhile; ?>

    </table>    

<?php endif; ?>

    <?php get_template_part('pagination'); ?>

</div>

<?php get_footer(); ?>
