<?php 

// first see if this event should link to an external URL
$event_id = get_queried_object_id();
$external_url = get_field('tk_events_external_url', $event_id);
$use_external = get_field('tk_events_external_url_link', $event_id);
if ( $external_url && $use_external ) {
    wp_redirect($external_url);
    exit;
}

get_header();
the_breadcrumb();

if (have_posts()): while (have_posts()) : the_post(); 

		$date_format = tk_events::get_date_string($post->ID, 'single');
		?>		

		<div class="wrapper-sm wrapper-pd text-center">
		    <div class="rule-image rule-image-sm">
		        <span style="background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAw5JREFUeNrsWjtv01AUjtMqA55jd7QrIYESGFt1I5SJOn0wUDESAT8ABiQkGIJgZegICmOVTjyyQsfSrI1X7LXO2ozl8sU3OFfXJjjJSewgH2U4x3Lu/Xx07ncetrK3ezdHLaqqWtVdKK2vn3q9Hvn6y+Qrrq1v1GqPNU2HXqlsNhrv26cntFsohJ4GUMAFaOm63Tk7OHjneedUGy1dv3aVZCGruvP02XPTXI18mMrtO4VCAehT5Gl4NxKuJI7zkyRUaGI6COLRAk+TgM5TRXOc20rlGyTbEYCOExgiG6YC9Fg4xnrCGYIulW/Gv7kYL5BmyB5wG9wMHFpsKGDrrk/YnSnob3k60ngy8dm6t7eVMHuIjgQZc0qWFEIhBg0mdn2IrdZnSUmmYFKUpfAlmbD1lVKpDEXXVpC6ReWfqzF2mYynDcPkyq3KpqSkNzwCztY0TVLSC3o+spCgx0gu4tEBPdfrb6Cgm3Jdh58j+XSGr/CkWNR4zBw1D5vNwwkOIkFpykt7HyBTckN8rH8txC+53Ja1nXA9jZN3f//BnMODpgk4Pv7W9TweNuDpv5mIiwoFA1KB/s6DZB9A+yijTTxDikBDHtYeoejDIRthqlfUFIUHL1N5Ao9jZsklAy3Wb8NEszie/rWI4aEsIGglH5XOs4OYfhlj1Kso+aAZsaxtaVZkGKviqGm0Gaxo22fCq4K4DDNJRixqulRCjGUOi/JSGUt5fi31/4cHTe3xsfEhcgzp9wE5sTMgKb5pQDuuw7uv0XIkNFfzBt31zqXtu/FeAiF8J/vjtKDrr9+Gi8yO3YnzX9COFB4wbbvz6uWLZOppUdrtH5wTaMvoGbJHq/VFK+ogcvzQquAB0g6aZwrDHEz0oMDl5G+aiUG7riNlSpiDaU5qQaOTlV4nwwza2wRAM3bZn1xF9iB/Jlrgh97FRRAPfYWxYHDKIqsLxgYrJ8geVnWnfXri+CFhGmbkRD0tIwRR1tY3wt8iZE1ABjoDnYHOQGegM9BJp/HI7yBQGMX55g4VX/i2CT6s+C3AAFbwPXZKHv6GAAAAAElFTkSuQmCC')"></span>
		    </div>
		    <p class="heading-related">
		        <span><time><span class="date"><?php echo $date_format ?></span></time></span>
		    </p>
		    <h1 class="heading-underline"><?php the_title(); ?></h1>		    
		</div>		
		
		<article id="post-<?php the_ID(); ?>" <?php post_class('wrapper-xs wrapper-pd article'); ?>>

		   <div class="social-share" id="social-share">
		        <button class="btn-icon social-toggle" data-toggle="toggle" data-target="#social-share">Share</button>
		        <div class="social-links">
		            <a href="#" data-type="twitter" data-url="<?php the_permalink(); ?>" data-description="<?php the_title(); ?>" data-via="twitter" class="js-pretty-social"><span class="icon-font-text">Twitter</span><span class="tk-icon-social-twitter"></span></a>
		            <a href="#" data-type="facebook" data-url="<?php the_permalink(); ?>" data-title="<?php the_title(); ?>" data-description="Insert Description" data-media="http://inserturl.here/image.png" class="js-pretty-social"><span class="icon-font-text">Facebook</span><span class="tk-icon-social-facebook"></span></a>
		            <a href="#" data-type="googleplus" data-url="<?php the_permalink(); ?>" data-description="<?php the_title(); ?>" class="js-pretty-social"><span class="icon-font-text">Google+</span><span class="tk-icon-social-google"></span></a>
		            <a href="#" data-type="linkedin" data-url="<?php the_permalink(); ?>" data-title="<?php the_title(); ?>" data-description="Insert Description" data-via="linkedin" data-media="http://inserturl.here/image.png" class="js-pretty-social"><span class="icon-font-text">Linkedin</span><span class="tk-icon-social-linkedin"></span></a>
		        </div>
		        <hr>
		    </div>
			
			<?php if ( has_post_thumbnail()) : // Check if Thumbnail exists ?>
				<div class="rs-img rs-img-2-1 featured-img" style="background-image: url('<?php the_post_thumbnail_url('large'); ?>');">
					<?php the_post_thumbnail('large'); // Declare pixel size you need inside the array ?>					
				</div>
			<?php endif; ?>			

			<?php if( have_rows('tk_events_key_facts') || get_field('tk_events_start_date')): ?>

				<div class="island island-bg-module island-m-b island-bd-b">
		    		<ul class="list-facts">
	    			<?php
	    			// get formatted date
	    			$date_format = tk_events::get_date_string($post->ID, 'single');

					printf('<li><strong>Date:</strong> %s</li>', $date_format);
					if ( $external_url ) {
						printf('<li><strong>External URL:</strong> <a href="%1$s">%1$s</a></li>', $external_url);
					}

					while( have_rows('tk_events_key_facts') ): the_row(); ?>
						<li>												
							<?php if( get_sub_field('tk_events_key_facts_label') ): ?>
								<span class="list-label"><?php the_sub_field('tk_events_key_facts_label'); ?>: </span>
							<?php endif; ?>		
							<?php if( get_sub_field('tk_events_key_facts_information') ): ?>
								<?php the_sub_field('tk_events_key_facts_information'); ?>
							<?php endif; ?>						
						</li>
					<?php endwhile;
					// taxonomy data
		            $categories = get_the_term_list( $post->ID, 'event_category', '', ', ');
		            if ( $categories ) {
		            	printf('<li><strong>Categories:</strong> %s</li>', $categories);
		            }
		            $tags = get_the_term_list( $post->ID, 'event_tag', '', ', ');
		            if ( $tags ) {
		            	printf('<li><strong>Tags:</strong> %s</li>', $tags);
		            }
		            ?>
					</ul>		    	
			    </div>

			<?php endif; ?>			

			<div class="jadu-cms">		
				<?php the_content(); // Dynamic Content ?>
			</div>			

		</article>	
		
	<?php
	//Related events 
	if ( get_field('tk_events_single_settings_related', 'option' ) ) {
		//get the categories and tags assigned to the event
		$terms = array();
		$terms['event_category'] = get_the_terms( $post, 'event_category' );
		$terms['event_tag'] = get_the_terms( $post, 'event_tag' );

		// if any have been assigned, build a query to get related events
		if ( $terms['event_category'] || $terms['event_tag'] ) {
			$tax_query = array();
			foreach( $terms as $tax => $term_objs ) {
				if ( $term_objs && ! is_wp_error($term_objs) ) {
					$term_ids = array();
					foreach ($term_objs as $term_obj ) {
						$term_ids[] = $term_obj->term_id;
					}
					$tax_query[] = array(
						'taxonomy' => $tax,
						'field' => 'term_id',
						'terms' => $term_ids
					);
				}
			}
			// if there are categories and tags assigned to the event, query other events with either
			if ( count($tax_query) > 1 ) {
				$tax_query['relation'] = 'OR';
			}
			//print_r($tax_query);
			$related_query = new WP_Query(array(
				'post_type' => 'events',
				'posts_per_page' => 3,
				'post__not_in' => array($post->ID),
				'tax_query' => $tax_query,
			));
			if ( $related_query->have_posts() ) {
				//print_r($related_query);
				// close off main container and open new container
				print('</div><div class="skin-bg-module"><div class="wrapper-md wrapper-pd p-t"><div class="equalize">');
				// print header
				print('<div class="divider-header"><h4 class="divider-header-heading divider-header-heading-underline">Related Events</h4></div>');
				// start row
				print('<div class="row">');
				// whether or not to show post thumbnmails
				$events_image_flag = 0;
				while ($related_query->have_posts()) {
					$related_query->the_post();
					if ( has_post_thumbnail() ) {
						$events_image_flag = 1;
					}
				}
				while ($related_query->have_posts()) {
					$related_query->the_post();
					?>
			  			<div class="col-sm-4">
			                <div class="card-flat card-stacked-sm skin-bg-white skin-bd-b equalize-inner">
			                	<?php if ( $events_image_flag ) { ?>
			                    <div class="card-img">
			                        <div class="rs-img rs-img-2-1" style="background-image: url('<?php the_post_thumbnail_url();?>')">
				                       	<a href="<?php the_permalink(); ?>">
				                            <img src="<?php the_post_thumbnail_url('medium'); ?>" alt="<?php esc_attr(the_title()); ?>"/>
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
				}
				wp_reset_postdata();
				print('</div></div></div></div><div>');
			}
		}
	}
	endwhile;
	endif;

get_footer();