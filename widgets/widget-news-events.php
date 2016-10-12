<!-- News and events widget -->											
<?php 
	//Sidebar flag
	if(get_field('sidebar_flag') == 'show'): $sidebar_flag = 1; else : $sidebar_flag = 0; endif; 

	$widget_options = get_sub_field('news_events_widget_options'); 					
	$news_flag = in_array('news', $widget_options);
	$events_flag = in_array('events', $widget_options);
	$posts_flag = in_array('posts', $widget_options);	

	if(($news_flag + $events_flag + $posts_flag) > 1){ 
		$tab_flag = true;
	} else {
		$tab_flag = false;
	}

//display all custom post type

// $args = array(
//    'public'   => true, 
//    '_builtin' => false,
// );

// $output = 'names'; // names or objects, note names is the default
// $operator = 'and'; // 'and' or 'or'

// $post_types = get_post_types( $args, $output, $operator ); 

// foreach ( $post_types  as $post_type ) {
//    echo '<p>' . $post_type . '</p>';
// }
	
?>

<?php 

// echo $news_flag; 
// echo $event_flag; 
// echo $posts_flag; 

?>

<div class="skin-row-module-light p-t p-b">
    <div class="wrapper-lg wrapper-pd">

        <h3 class="h2-lg heading-underline">
        	<?php 
        	if($news_flag && $events_flag && $posts_flag): 
        		echo "News, events and posts";
        	elseif($news_flag && $posts_flag): 
        		echo "News and posts";
			elseif($events_flag && $posts_flag): 
        		echo "Events and posts";        
       		elseif($news_flag && $events_flag): 
        		echo "News and events";
        	elseif($events_flag): 
				echo "Events";
			elseif($posts_flag): 
				echo "Posts";
        	else: 	
        		echo "News";
        	endif; ?>		        	
        </h3>        
        
        <?php if($tab_flag){  ?>
        <div class="tk-tabs-header">
            <ul class="nav nav-tabs tk-nav-tabs pull-left">
            	<?php $active_flag = 1; ?>
                <?php if($news_flag){ ?>
                <li <?php if($active_flag){echo 'class="active"'; $active_flag = 0;} ?>>
                	<a href="#news" data-toggle="tab" >News</a>
                </li>
                <?php } ?>
                <?php if($events_flag){ ?>
                <li <?php if($active_flag){echo 'class="active"'; $active_flag = 0;} ?>>
                	<a href="#events" data-toggle="tab">Events</a></li>
                <?php } ?>		
                <?php if($posts_flag){ ?>
                <li <?php if($active_flag){echo 'class="active"'; $active_flag = 0;} ?>>
                	<a href="#posts" data-toggle="tab">Posts</a>
                </li>
                <?php } ?>				                
            </ul>
            <!-- <button class="pull-right filter js-cat-filter">Filter</button> -->
        </div>
        <?php } ?>		

		<div class="tab-content">
			
			<?php if($news_flag){ ?>
			<!-- News -->
			<?php if($tab_flag){  ?>
		    	<div class="tab-pane fade active in" id="news">
			<?php } else { ?>								    	
				<div>
			<?php } ?>								    	

		        <p class="tk-tabs-cta"><a class="more more-all more-dark pull-right" href="<?php echo get_post_type_archive_link('news'); ?>">See all news</a></p>

		        <?php 

		        $loop_news = new WP_Query( 
					array( 
					'post_type' => 'news', 
					'posts_per_page' => 4 
				)); 

		        ?>

				<div class="equalize">
				    <div class="tk-row row-reduce-gutter">

				    	<?php if ( !$loop_news->have_posts() ) { ?>
				    	<div class="col-12">
							<p>No news</p>
						</div>

						<?php } ?>

						<?php while ( $loop_news->have_posts() ) : $loop_news->the_post(); ?>

						<div class="news-item col-sm-6 <?php if(!$sidebar_flag): echo "col-md-3"; endif; ?>">

						    <div class="card card-stacked skin-box-white skin-bd-b">
						    	<?php if(0){ ?>
                                <div class="card-img">
                                	<?php if ( has_post_thumbnail() ) { ?>
	                                	<div class="rs-img rs-img-2-1" style="background-image: url('<?php the_post_thumbnail_url(); ?>');">
	                                        <a href="<?php the_permalink(); ?>"><img src="<?php the_post_thumbnail_url(); ?>" alt="<?php the_title(); ?>"></a>
	                                    </div>																													
									<?php } else { ?>
										<div class="rs-img rs-img-2-1">
	                                        <a href="<?php the_permalink(); ?>"></a>
	                                    </div>																													
									<?php } ?>
                                </div>
                                <?php } ?>
                                <div class="card-content equalize-inner">          
                                    <h3 class="heading-link-alt"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                                    <p class="heading-related"><?php the_time('l j F Y'); ?></p>     				                                    
                                    <div class="note"><?php html5wp_excerpt('html5wp_custom_post'); ?></div>
                                    <a class="more" href="<?php the_permalink(); ?>">more</a>
                                </div>
                            </div>		

                        </div>		
						
						<?php endwhile; wp_reset_query(); ?>
					</div>
				</div>
			</div>
			<!-- /News -->
			<?php } ?>

			<?php if($events_flag){ ?>

			<!-- Tab2 -->							
			<?php if($tab_flag && !$news_flag){ ?>
				<div class="tab-pane fade active in" id="events">
			<?php } elseif($tab_flag){ ?>
		    	<div class="tab-pane fade" id="events">
			<?php } else { ?>								    	
				<div>
			<?php } ?>	

		        <p class="tk-tabs-cta"><a class="more more-all more-dark pull-right" href="<?php echo get_post_type_archive_link('events'); ?>">See all events</a></p>						                  									

                <?php $loop_events = new WP_Query( 
					array( 
						'post_type' => 'events', 
						'posts_per_page' => -1,			
						'meta_key'			=> 'event_start_date',
						'orderby'			=> 'meta_value_num',
						'order'				=> 'ASC'		
						//'order'	=> 'event_start_date'
					) ); 

                	$event_counter = 0;

				?>

				<div class="equalize">
				    <div class="tk-row row-reduce-gutter">

				    	<?php if ( !$loop_events->have_posts() ) { ?>

			    		<div class="col-12">
							<p>No events</p>
						<div>

						<?php } ?>

						<?php while ( $loop_events->have_posts() ) : $loop_events->the_post(); ?>					
						<?php 							
						
							if(get_field('event_start_date')) {						    
							    $event_date = strtotime(get_field('event_start_date'));						    
							    $todays_date = strtotime(date("d-m-Y"));

							    if($event_date > $todays_date){	

							    	$event_counter++;		

							    	if($event_counter < 4){				  

						?>

						<div class="events-item col-sm-6 <?php if(!$sidebar_flag): echo "col-md-3"; endif; ?>">
		                    <div class="card card-stacked skin-box-white skin-bd-b">
		                        <div class="card-content equalize-inner">   		                        	
		                            <h3 class="heading-link-alt"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
		                            <p class="heading-related"><?php echo get_field('event_start_date');//the_time('l j F Y'); ?></p>     				                                    
		                            <div class="note"><?php html5wp_excerpt('html5wp_custom_post'); ?></div>
		                            <a class="more" href="<?php the_permalink(); ?>">more</a>
		                        </div>
		                    </div>                           
		                </div>				

		                <?php   	
		                			}
							    } 

							} else { //if no date set echo anyways

						?>

						<div class="events-item col-sm-6 <?php if(!$sidebar_flag): echo "col-md-3"; endif; ?>">
		                    <div class="card card-stacked skin-box-white skin-bd-b">                              
		                        <div class="card-content equalize-inner">   		                        	
		                            <h3 class="heading-link-alt"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
		                            <p class="heading-related">No date set</p>     				                                    
		                            <div class="note"><?php html5wp_excerpt('html5wp_custom_post'); ?></div>
		                            <a class="more" href="<?php the_permalink(); ?>">more</a>
		                        </div>
		                    </div>                           
		                </div>	

						<?php

							}
						?>					          
						
						<?php endwhile; wp_reset_query(); ?>
					</div>
				</div>
			</div>
			<!-- Tab2 -->
			<?php } ?>

			<?php if($posts_flag){ ?>

			<!-- Tab3 -->							
			<?php if($tab_flag){ ?>
		    	<div class="tab-pane fade" id="posts">
			<?php } else { ?>								    	
				<div>
			<?php } ?>	

		        <p class="tk-tabs-cta"><a class="more more-all more-dark pull-right" href="
		        <?php 
				if( get_option( 'page_for_posts' ) ) { 
				  echo get_permalink( get_option( 'page_for_posts' ) ); 
				} else { 
				  echo home_url(); 
				} 
				?>
				">See all posts</a></p>						                  									

                <?php $loop_posts = new WP_Query( 
					array( 
						'post_type' => 'post', 
						'posts_per_page' => 4,						
						'order'	=> 'ASC'
					) ); 

				?>

				<div class="equalize">
				    <div class="tk-row row-reduce-gutter">

				    	<?php if ( !$loop_posts->have_posts() ) { ?>
				    	<div class="col-12">
							<p>No posts</p>
						</div>
						<?php } ?>

						<?php while ( $loop_posts->have_posts() ) : $loop_posts->the_post(); ?>

						<div class="events-item col-sm-6 <?php if(!$sidebar_flag): echo "col-md-3"; endif; ?>">
		                    <div class="card card-stacked skin-box-white skin-bd-b">
		                        <div class="card-content equalize-inner">   
		                            <h3 class="heading-link-alt"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
		                            <p class="heading-related"><?php echo get_field('event_start_date');//the_time('l j F Y'); ?></p>     				                                    
		                            <div class="note"><?php html5wp_excerpt('html5wp_custom_post'); ?></div>
		                            <a class="more" href="<?php the_permalink(); ?>">more</a>
		                        </div>
		                    </div>                           
		                </div>									          
						
						<?php endwhile; wp_reset_query(); ?>
					</div>
				</div>
			</div>
			<!-- Tab3 -->
			<?php } ?>

		</div>

	</div>
</div>				
<!-- /News and events widget -->											