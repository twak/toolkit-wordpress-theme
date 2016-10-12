<?php get_header(); ?>

<?php the_breadcrumb(); ?>

<?php 
	if (have_posts()): 
		while (have_posts()) : the_post(); 
?>

	<div class="wrapper-xs wrapper-pd">		
		<div class="rule-image">
			<span <?php if( has_post_thumbnail()): ?>style="background-image:url('<?php the_post_thumbnail_url('small');?>')" <?php endif; ?>></span>
		</div>        

	    <h1 class="heading-underline">
	    	<?php 
	    	if( get_field('tk_profiles_first_name') || get_field('tk_profiles_last_name') ): 
	    		echo get_field('tk_profiles_first_name') .' '. get_field('tk_profiles_last_name'); 
	    	else: 
	    		the_title();
	    	endif; 
	    	?>		    	
	    </h1>

	    <?php 

	    // Profiles facts

	    $tk_profiles_facts = array(
    		'tk_profiles_job_title',	
    		'tk_profiles_email',
    		'tk_profiles_telephone',	        		        	
    		'tk_profiles_faculty',
    		'tk_profiles_school',
    		'tk_profiles_location'	        		
    	); 

    	$profiles_key_facts = "";

    	foreach($tk_profiles_facts as $fact):
    		if( get_field($fact) ):
    			$field_object = get_field_object($fact);
    			$profiles_key_facts .= '<li><strong>'.$field_object['label'].'</strong>: '.$field_object['value'].'</li>';		        		
    		endif;
    	endforeach;

    	if(get_field('tk_profiles_external_link')):
    		$profiles_key_facts .=  '<li><strong>External profile link:</strong> <a href="http://'.get_field('tk_profiles_external_link').'">'.get_field('tk_profiles_external_link').'</a></li>';
    	endif;

    	if( have_rows('tk_profiles_key_facts') ):				 	
		    while ( have_rows('tk_profiles_key_facts') ) : the_row();				      
		        $profiles_key_facts .= '<li><strong>'.get_sub_field('tk_profiles_key_facts_label').'</strong>: '.get_sub_field('tk_profiles_key_facts_info').'</li>';
		    endwhile;
		endif;

		?>		

<?php
		if($profiles_key_facts):
?>
	  		    
	    <div class="island island-featured">
	        <ul class="key-facts">
	        	<?php echo $profiles_key_facts; ?>	        	      			        		           
	        </ul>
	    </div>

<?php 
		endif; 
?>
	    				
		<div id="post-<?php the_ID(); ?>" <?php post_class(''); ?>>		   							
			<div class="jadu-cms">		
				<?php the_content(); ?>
			</div>			
			<?php edit_post_link(); ?>			
		</div>
	</div>		

<?php
		endwhile;
 	endif; 
?>



<?php if(get_field('tk_profiles_single_settings_related', 'option')): //Related events ?>

	</div><!-- ./wrapper-lg -->

<div class="skin-bg-module island-lg">
	<div class="wrapper-sm wrapper-pd">
		<div class="divider-header">
            <h4 class="divider-header-heading divider-header-heading-underline">Related Profiles</h4>            
        </div>


		            <div class="row">		
	<?php 
						//Related events
						$events_image_flag = 0;
						$cats = wp_get_post_categories($post->ID); //get post category array
						$first_cat = $cats[0];		
						$query = new WP_Query(array(
						    'post_type' => 'profiles',
						    'posts_per_page' => 3,
						    'cat' => $first_cat 		    
						));
						while ($query->have_posts()):
							$query->the_post();
							if(has_post_thumbnail()):
								$events_image_flag = 1;
							endif;
						endwhile;
						while ($query->have_posts()):
						    $query->the_post();
						    $post_id = get_the_ID();
	?>
			  			<div class="col-sm-4">
			                <div class="card-flat card-stacked-sm skin-bg-white skin-bd-b equalize-inner">

			                	<?php if($events_image_flag){ ?>
			                    <div class="card-img">
			                        <div class="rs-img" <?php if(has_post_thumbnail()){ ?> style="background-image: url('<?php the_post_thumbnail_url();?>')" <?php } ?>>
				                       	<a href="<?php the_permalink(); ?>">
				                            <img src="<?php the_post_thumbnail_url('medium'); ?>" alt="<?php the_title(); ?>"/>
				                        </a>
			                        </div>
			                    </div>
			                    <?php } ?>
			                    <div class="card-content">
			                        <h3 class="heading-link-alt"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
			                        <a class="more" href="<?php the_permalink(); ?>">More</a>
			                    </div>
			                </div>
			            </div>						
	<?php		    		
						endwhile;		
						wp_reset_query();
	?>                       
		            </div>   

        
	</div>
</div>

<div class="wrapper-lg">

<?php endif; ?>

<?php get_footer(); ?>
