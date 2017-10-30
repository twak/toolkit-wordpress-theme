<?php
$posts_sidebar = get_field('posts_sidebar_flag', 'option');

get_header();

the_breadcrumb(); ?>

<?php if($posts_sidebar) : ?>
    <div class="column-container">
        <?php get_sidebar('posts'); ?>

        <div class="column-container-primary">

    <?php endif; ?>
        <div class="wrapper-sm wrapper-pd">
    <?php if (have_posts()): while (have_posts()) : the_post(); ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class('wrapper-xs wrapper-pd article'); ?>>
            <header class="wrapper-pd wrapper-sm text-center">
    		    <div class="rule-image rule-image-sm">
    		        <span style="background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAw5JREFUeNrsWjtv01AUjtMqA55jd7QrIYESGFt1I5SJOn0wUDESAT8ABiQkGIJgZegICmOVTjyyQsfSrI1X7LXO2ozl8sU3OFfXJjjJSewgH2U4x3Lu/Xx07ncetrK3ezdHLaqqWtVdKK2vn3q9Hvn6y+Qrrq1v1GqPNU2HXqlsNhrv26cntFsohJ4GUMAFaOm63Tk7OHjneedUGy1dv3aVZCGruvP02XPTXI18mMrtO4VCAehT5Gl4NxKuJI7zkyRUaGI6COLRAk+TgM5TRXOc20rlGyTbEYCOExgiG6YC9Fg4xnrCGYIulW/Gv7kYL5BmyB5wG9wMHFpsKGDrrk/YnSnob3k60ngy8dm6t7eVMHuIjgQZc0qWFEIhBg0mdn2IrdZnSUmmYFKUpfAlmbD1lVKpDEXXVpC6ReWfqzF2mYynDcPkyq3KpqSkNzwCztY0TVLSC3o+spCgx0gu4tEBPdfrb6Cgm3Jdh58j+XSGr/CkWNR4zBw1D5vNwwkOIkFpykt7HyBTckN8rH8txC+53Ja1nXA9jZN3f//BnMODpgk4Pv7W9TweNuDpv5mIiwoFA1KB/s6DZB9A+yijTTxDikBDHtYeoejDIRthqlfUFIUHL1N5Ao9jZsklAy3Wb8NEszie/rWI4aEsIGglH5XOs4OYfhlj1Kso+aAZsaxtaVZkGKviqGm0Gaxo22fCq4K4DDNJRixqulRCjGUOi/JSGUt5fi31/4cHTe3xsfEhcgzp9wE5sTMgKb5pQDuuw7uv0XIkNFfzBt31zqXtu/FeAiF8J/vjtKDrr9+Gi8yO3YnzX9COFB4wbbvz6uWLZOppUdrtH5wTaMvoGbJHq/VFK+ogcvzQquAB0g6aZwrDHEz0oMDl5G+aiUG7riNlSpiDaU5qQaOTlV4nwwza2wRAM3bZn1xF9iB/Jlrgh97FRRAPfYWxYHDKIqsLxgYrJ8geVnWnfXri+CFhGmbkRD0tIwRR1tY3wt8iZE1ABjoDnYHOQGegM9BJp/HI7yBQGMX55g4VX/i2CT6s+C3AAFbwPXZKHv6GAAAAAElFTkSuQmCC')"></span>
    		    </div>
    		    <p class="heading-related">
    		        <?php the_terms($post->ID, 'category', '<span class="name-divider">', ', ', '</span>'); ?>
    		        <span><time><span class="date"><?php the_time('l j F Y'); ?></span></time></span>
    		    </p>
    			<?php do_action('tk_title_before'); ?>
    		    <h1 class="heading-underline"><?php the_title(); ?></h1>
    			<?php do_action('tk_title_after'); ?>
		  
            </header>		
		

		    <?php tk_social_links('top', 'below'); ?>

			<?php if ( has_post_thumbnail() && tk_display_featured_image() ) : // Check if Thumbnail exists and if it is set to be displayed ?>
				<div class="rs-img rs-img-2-1 featured-img" style="background-image: url('<?php the_post_thumbnail_url( 'featured-size' ); ?>');">					
					<?php the_post_thumbnail( 'featured-size' ); // Declare pixel size you need inside the array ?>					
				</div>
			<?php endif; ?>

			<?php do_action('tk_content_before'); ?>
            <div class="jadu-cms">
				<?php the_content(); ?>
            </div>
			<?php do_action('tk_content_after'); ?>

			<?php 
			$show_tags = get_field( 'tk_post_page_settings_tags', 'option' );
			if ( $show_tags ) {
				the_terms($post->ID, 'post_tag', '<ul class="list-related"><li class="title">Tags:</li><li>', '</li><li>', '</li></ul>');
			}
			?>

		    <?php
		    if ( comments_open() || get_comments_number() ) :
				comments_template();
			endif;
			?>

		    <?php tk_social_links('bottom', 'above'); ?>

		</article>		

	<?php endwhile; ?>
	<?php endif; ?>
            </div>
    <?php if($posts_sidebar) : ?>
            </div> <!-- /.column-container-primary -->
        </div> <!-- /.column-container -->
    <?php endif; ?>


<?php get_footer(); ?>
