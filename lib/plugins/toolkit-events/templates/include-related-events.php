	</div><!--.main -->

		<div class="skin-bg-module">
		    <div class="wrapper-md wrapper-pd p-t">
		        <div class="equalize">

		        	<div class="divider-header">
		                <h4 class="divider-header-heading divider-header-heading-underline">Related Events</h4>	
		            </div>
		                                        
		            <div class="row">		
	<?php 
						//Related events
						$events_image_flag = 0;
						$cats = wp_get_post_categories($post->ID); //get post category array
						$first_cat = $cats[0];		
						$query = new WP_Query(array(
						    'post_type' => 'events',
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
			                        <div class="rs-img rs-img-2-1" <?php if(has_post_thumbnail()){ ?> style="background-image: url('<?php the_post_thumbnail_url();?>')" <?php } ?>>
				                       	<a href="<?php the_permalink(); ?>">
				                            <img src="<?php the_post_thumbnail_url('medium'); ?>" alt="<?php the_title(); ?>"/>
				                        </a>
			                        </div>
			                    </div>
			                    <?php } ?>
			                    <div class="card-content">
			                        <h3 class="heading-link-alt"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
			                        <div class="note">
			                        	<?php html5wp_excerpt('html5wp_custom_post') ?>                        	
			                        </div>
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
		</div>

	<div><!-- .main-->
					          