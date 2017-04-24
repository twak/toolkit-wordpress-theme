<?php
    // Sidebar
?>
<aside class="column-container-secondary role="complementary">
   
<!-- $TEMPLATE: SIDEBAR NAV -->
    <!--<button class="sidebar-button js-sidebar-trigger">In this section: <?php echo $first_parent->post_title; ?></button>-->

    <div class="sidebar-container <?php if($GLOBALS[ 'full_width' ]){ echo "sidebar-container-fw"; }?>">

        <h4 class="sidebar-heading heading-related">In this section</h4>

        <ul class="sidebar-nav" id="sidebarNav">

        <?php

        wp_list_pages( array(
            'title_li' => '',
            'child_of' => $post->post_parent,
            'walker'   => new Sidebar_Walker()
        ) );
        ?>

        </ul>

    </div>
	
	<div class="sidebar" role="complementary">		

		<div class="sidebar-widget">
			<?php if(!function_exists('dynamic_sidebar') || !dynamic_sidebar('widget-area-1')) ?>
		</div>

	</div>

</aside>
<!-- ./column-container-secondary-->
<!-- $/SIDEBAR -->
