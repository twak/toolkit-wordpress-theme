<?php
    // Sidebar
if ($post->post_parent) {
    $ancestors = get_post_ancestors($post->ID);
    $first_parent = get_the_title( end($ancestors) );
} else {
    $first_parent = '';
}
?>

<aside class="column-container-secondary" role="complementary">
	<?php do_action('tk_sidebar_before'); ?>
    <button class="sidebar-button js-sidebar-trigger">In this section: <?php echo $first_parent; ?></button>

    <div class="sidebar-container <?php if($GLOBALS[ 'full_width' ]){ echo "sidebar-container-fw"; }?>">

        <h4 class="sidebar-heading heading-related">In this section</h4>

        <ul class="sidebar-nav" id="sidebarNav">

        <?php

        if( !$post->post_parent ) {

            // Echo the list item with active class
            echo '<li class="active"><a href="'. get_permalink( $post->ID ) .'">Overview</a></li>';

            // Will display the subpages of this top level page.
            $children = wp_list_pages( array(
                'title_li' => '',
                'child_of' => $post->ID,
                'walker'   => new Sidebar_Walker()
            ) );

        } elseif ( $post->ancestors ) {

            // Get the ancestors for all pages (multiple depths)
            $ancestors = get_post_ancestors( $post->ID );

            // Get the URL of the root-level page (always last in array, hence end())
            echo '<li><a href="'. get_permalink( end( $ancestors ) ) .'">Overview</a></li>';

            // Display the subpages from the root-level page down.
            $children  = wp_list_pages( array(
                'title_li' => '',
                'child_of' => end( $ancestors ),
                'walker'   => new Sidebar_Walker()
            ) );

        }

        if( $children ) : ?>

            <?php 
            echo $children; 
            ?>

        <?php endif; ?>

        </ul>

    </div>
	
	<div class="sidebar" role="complementary">		

		<div class="sidebar-widget">
			<?php if(!function_exists('dynamic_sidebar') || !dynamic_sidebar('widget-area-1')) ?>
		</div>

	</div>
	<?php do_action('tk_sidebar_after'); ?>
</aside>
<!-- ./column-container-secondary-->
<!-- $/SIDEBAR -->
