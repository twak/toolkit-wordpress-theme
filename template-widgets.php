<?php
/* Template Name: Widgets Page Template */ 
get_header(); 


if (have_posts()): while (have_posts()) : the_post();

    get_template_part('templates/page-sidebar', 'top');

    if ( post_password_required() ) :
        echo '<div class="wrapper-md wrapper-pd"><h1 class="heading-underline">Password Protected</h1>';
        echo get_the_password_form();
        echo '</div></div>';
    else:

    	if( have_rows('widgets') ):
            $widget_counter = 0;

    		while( have_rows('widgets') ): the_row();
                $widget_counter++;

                printf('<div class="widget" id="widget-%s">', $widget_counter);			
    						
    			$row_layout = get_row_layout();
                
    		    get_template_part('templates/widgets/tk', $row_layout);

                print('</div>');
            endwhile;
        endif;
    endif;

    get_template_part('templates/page-sidebar', 'bottom');

endwhile; endif; // posts loop

get_footer();