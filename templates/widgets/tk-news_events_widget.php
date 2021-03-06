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

<div class="skin-row-module-light container-row">
    <div class="wrapper-lg wrapper-pd-md">

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

						<div class="news-item col-sm-6 col-md-3">

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
                                    <div class="note"><?php echo tk_get_excerpt('tk_card_length'); ?></div>
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

                <?php 
                $today = date('Ymd');
                $loop_events = new WP_Query( 
					array( 
						'post_type' => 'events', 
						'posts_per_page' => 4,			
						'meta_key'			=> 'tk_events_start_date',
						'orderby'			=> 'meta_value_num',
						'order'				=> 'ASC',		
						'meta_query' => array(
							'relation' => 'OR',
							array(
								'key'     => 'tk_events_start_date',
								'value'   => '',
								'compare' => '=',
							),
                			array(
                       			'relation' => 'OR',
		                        array(
		                                'key' => 'tk_events_end_date',
		                                'value' => $today,
		                                'compare' => '>=',
		                        ),
		                        array(
		                                'key' => 'tk_events_start_date',
		                                'value' => $today,
		                                'compare' => '>=',
		                        ),
							),
						),
					) ); 

                	$event_counter = 0;

				?>

				<div class="equalize">
				    <div class="tk-row row-reduce-gutter">

				    	<?php if ( !$loop_events->have_posts() ) { ?>

			    		<div class="col-12">
							<p>No events</p>
						</div>

						<?php } ?>

						<?php while ( $loop_events->have_posts() ) : $loop_events->the_post(); ?>					
						<?php 							
						
							if ( get_field( 'tk_events_start_date' ) ) {						    
							    $start_date = get_field('tk_events_start_date');
							    $end_date = get_field( 'tk_events_end_date' );
							    if ($end_date && $start_date != $end_date ) {
							    	$event_date = date('j M Y', strtotime( $start_date ) ) . ' - ' . date('j M Y', strtotime( $end_date ) );
							    } else {
								    $event_date = date('j F Y', strtotime( $start_date ) );
								}

						?>

						<div class="events-item col-sm-6 col-md-3">
		                    <div class="card card-stacked skin-box-white skin-bd-b">
		                        <div class="card-content equalize-inner">   		                        	
		                            <h3 class="heading-link-alt"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
		                            <p class="heading-related"><?php echo $event_date; ?></p>     				                                    
		                            <div class="note"><?php echo tk_get_excerpt('tk_card_length'); ?></div>
		                            <a class="more" href="<?php the_permalink(); ?>">more</a>
		                        </div>
		                    </div>                           
		                </div>				

		                <?php   	

							} else { //if no date set echo anyways

						?>

						<div class="events-item col-sm-6 col-md-3">
		                    <div class="card card-stacked skin-box-white skin-bd-b">                              
		                        <div class="card-content equalize-inner">   		                        	
		                            <h3 class="heading-link-alt"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
		                            <p class="heading-related">No date set</p>     				                                    
		                            <div class="note"><?php echo tk_get_excerpt('tk_card_length'); ?></div>
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
						'posts_per_page' => 4
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

						<div class="events-item col-sm-6 col-md-3">
		                    <div class="card card-stacked skin-box-white skin-bd-b">
		                        <div class="card-content equalize-inner">   
		                            <h3 class="heading-link-alt"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
		                            <p class="heading-related"><?php echo get_field('event_start_date');//the_time('l j F Y'); ?></p>     				                                    
		                            <div class="note"><?php echo tk_get_excerpt('tk_card_length'); ?></div>
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