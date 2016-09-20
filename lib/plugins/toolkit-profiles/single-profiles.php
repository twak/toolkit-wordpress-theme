<?php get_header(); ?>

<?php the_breadcrumb(); ?>

<?php if (have_posts()): while (have_posts()) : the_post(); ?>

	<div class="wrapper-xs wrapper-pd">

		<?php if ( has_post_thumbnail()): //Check if Thumbnail exists ?>
			<div class="rule-image">
    			<span style="background-image:url('<?php the_post_thumbnail_url('small');?>')"></span>
			</div>
		<?php else: ?>				
			<div class="rule-image">
        		<span></span>
    		</div>
		<?php endif; ?>				

	    <h1 class="heading-underline">
	    	<?php 
	    	if( get_field('tk_profiles_first_name') || get_field('tk_profiles_surname') ): 
	    		echo get_field('tk_profiles_first_name') .' '. get_field('tk_profiles_surname'); 
	    	else: 
	    		the_title();
	    	endif; 
	    	?>		    	
	    </h1>
	  		    
	    <div class="island island-featured">
	        <ul class="key-facts">
	        	<?php $tk_profiles_facts = array(
	        		'tk_profiles_role',
	        		'tk_profiles_job_title',
	        		'tk_profiles_email',
	        		'tk_profiles_telephone',
	        		'tk_profiles_school'
	        	); ?>

	        	<?php 

	        	foreach($tk_profiles_facts as $fact):
	        		if( get_field($fact) ):
	        			$field_object = get_field_object($fact);
	        			echo '<li><strong>'.$field_object['label'].'</strong>: '.$field_object['value'].'</li>';		        		
	        		endif;
	        	endforeach;

	        	if(get_field('tk_profiles_external_link')):
	        		echo '<li><strong>External link:</strong> <a href="http://'.get_field('tk_profiles_external_link').'">'.get_field('tk_profiles_external_link').'</a></li>';
	        	endif;
	        	?>		        			        		            
	        </ul>
	    </div>
	    				
		<div id="post-<?php the_ID(); ?>" <?php post_class(''); ?>>		   
							
			<div class="jadu-cms">		
				<?php the_content(); // Dynamic Content ?>
			</div>			

			<?php edit_post_link(); // Always handy to have Edit Post Links available ?>			

		</div>
	</div>		

<?php endwhile; ?>
<?php endif; ?>


<?php //Related profile

	$related_profiles = get_posts( 
		array( 
			'category__in' => wp_get_post_categories($post->ID), 
			'numberposts' => 3, 
			'post_type'   => 'profiles',
			'post__not_in' => array($post->ID) 
		) 
	);

?>

<?php if( $related_profiles ) { ?>

	</div><!-- ./wrapper-lg -->

<div class="skin-bg-module island-lg">
	<div class="wrapper-md wrapper-pd">
		<div class="divider-header">
            <h4 class="divider-header-heading divider-header-heading-underline">Related Profiles</h4>            
        </div>

		<?php foreach( $related_profiles as $profile ) { setup_postdata($profile); ?>

			<div class="tk-row clearfix m-t equalize">
			    <div class="col-xs-12 col-sm-4">
			        <div class="card-flat card-stacked-sm skin-box-white skin-bd-b">
			            <div class="card-img">
			                <div class="rs-img rs-img-1-1" style="background-image: url('//engineering.leeds.ac.uk/images/SWJT_800x400.JPG');">
			                    <a href="//engineering.leeds.ac.uk/news/article/283/first_students_welcomed_to_joint_engineering_school_in_china"><img src="//engineering.leeds.ac.uk/images/SWJT_800x400.JPG" alt="First students welcomed to joint engineering school in China "></a>
			                </div>
			            </div>
			            <div class="card-content equalize-inner" style="height: 183px;">
			                <span class="equalizer-inner" style="display:block;">
			                    <h3 class="heading-link-alt"><a href="<?php the_permalink() ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h3>
			                </span>
			            </div>
			        </div>
			    </div>   
			</div>
		    
			<?php //the_content('Read the rest of this entry &raquo;'); ?>
		       		    		
		<?php } wp_reset_postdata(); ?>
	</div>
</div>

<div class="wrapper-lg">

<?php } ?>

<?php get_footer(); ?>
