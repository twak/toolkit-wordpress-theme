<?php 

//Setup vars

$start_date_format = get_field('tk_events_start_date');
$end_date_format = get_field('tk_events_end_date');

$start_date = date("l j F Y", strtotime($start_date_format));
$end_date = date("l j F Y", strtotime($end_date_format));

?>

<?php get_header(); ?>
<?php the_breadcrumb(); ?>

	<?php if (have_posts()): while (have_posts()) : the_post(); ?>		

		<div class="wrapper-sm wrapper-pd text-center">
		    <div class="rule-image rule-image-sm">
		        <span style="background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAw5JREFUeNrsWjtv01AUjtMqA55jd7QrIYESGFt1I5SJOn0wUDESAT8ABiQkGIJgZegICmOVTjyyQsfSrI1X7LXO2ozl8sU3OFfXJjjJSewgH2U4x3Lu/Xx07ncetrK3ezdHLaqqWtVdKK2vn3q9Hvn6y+Qrrq1v1GqPNU2HXqlsNhrv26cntFsohJ4GUMAFaOm63Tk7OHjneedUGy1dv3aVZCGruvP02XPTXI18mMrtO4VCAehT5Gl4NxKuJI7zkyRUaGI6COLRAk+TgM5TRXOc20rlGyTbEYCOExgiG6YC9Fg4xnrCGYIulW/Gv7kYL5BmyB5wG9wMHFpsKGDrrk/YnSnob3k60ngy8dm6t7eVMHuIjgQZc0qWFEIhBg0mdn2IrdZnSUmmYFKUpfAlmbD1lVKpDEXXVpC6ReWfqzF2mYynDcPkyq3KpqSkNzwCztY0TVLSC3o+spCgx0gu4tEBPdfrb6Cgm3Jdh58j+XSGr/CkWNR4zBw1D5vNwwkOIkFpykt7HyBTckN8rH8txC+53Ja1nXA9jZN3f//BnMODpgk4Pv7W9TweNuDpv5mIiwoFA1KB/s6DZB9A+yijTTxDikBDHtYeoejDIRthqlfUFIUHL1N5Ao9jZsklAy3Wb8NEszie/rWI4aEsIGglH5XOs4OYfhlj1Kso+aAZsaxtaVZkGKviqGm0Gaxo22fCq4K4DDNJRixqulRCjGUOi/JSGUt5fi31/4cHTe3xsfEhcgzp9wE5sTMgKb5pQDuuw7uv0XIkNFfzBt31zqXtu/FeAiF8J/vjtKDrr9+Gi8yO3YnzX9COFB4wbbvz6uWLZOppUdrtH5wTaMvoGbJHq/VFK+ogcvzQquAB0g6aZwrDHEz0oMDl5G+aiUG7riNlSpiDaU5qQaOTlV4nwwza2wRAM3bZn1xF9iB/Jlrgh97FRRAPfYWxYHDKIqsLxgYrJ8geVnWnfXri+CFhGmbkRD0tIwRR1tY3wt8iZE1ABjoDnYHOQGegM9BJp/HI7yBQGMX55g4VX/i2CT6s+C3AAFbwPXZKHv6GAAAAAElFTkSuQmCC')"></span>
		    </div>
		    <p class="heading-related">
		        <span class="name--divider"><?php the_category(', '); // Separated by commas ?></span>
		        <!-- <span><time><span class="date"><?php the_time('l j F Y'); ?></span></time></span> -->
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
	    			 	if($start_date): 
					    	echo '<li><strong>Start date:</strong> '.$start_date.'</li>';
					    endif; 
					    if($end_date):
					    	echo '<li><strong>End date:</strong> '.$end_date.'</li>';
					    endif;
					?>
					<?php while( have_rows('tk_events_key_facts') ): the_row(); ?>
						<li>												
							<?php if( get_sub_field('tk_events_key_facts_label') ): ?>
								<span class="list-label"><?php the_sub_field('tk_events_key_facts_label'); ?>: </span>
							<?php endif; ?>		
							<?php if( get_sub_field('tk_events_key_facts_information') ): ?>
								<?php the_sub_field('tk_events_key_facts_information'); ?>
							<?php endif; ?>						
						</li>
					<?php endwhile; ?>

					</ul>		    	
			    </div>

			<?php endif; ?>			

			<div class="jadu-cms">		
				<?php the_content(); // Dynamic Content ?>
			</div>			

			<?php edit_post_link(); // Always handy to have Edit Post Links available ?>			

		</article>	
		
	<?php if(get_field('tk_events_single_settings_related', 'option')): //Related events 

		include_once(dirname(__FILE__) . '/include-related-events.php' );
	    
	endif; ?>

	<?php endwhile; ?>
	<?php endif; ?>

<?php get_footer(); ?>
