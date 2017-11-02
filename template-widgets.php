<?php
/* Template Name: Widgets Page Template */ 
get_header(); 


if (have_posts()): while (have_posts()) : the_post();

if( ! $GLOBALS['full_width']) { 
    the_breadcrumb();
}

if( ! $GLOBALS['theme_sidebar_flag']) {
    //close wrapper
    print('</div>');
} else {
    // print sidebar
    ?>
    <div class="column-container <?php if($GLOBALS[ 'full_width' ]){ echo "column-container-fw"; }?>">
    <?php get_sidebar(); ?>
    <div class="column-container-primary">  
    <?php if($GLOBALS[ 'full_width' ]){ the_breadcrumb(); } ?>
        <header class="wrapper-padded wrapper-sm">  
            <h1 class="heading-underline"><?php the_title(); ?></h1>
        </header>                   
    <?php
}
	
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
endwhile; endif; // posts loop

if( $GLOBALS['theme_sidebar_flag'] ) {
    print('</div></div>');
} else {
    print('<div>');
}
get_footer();