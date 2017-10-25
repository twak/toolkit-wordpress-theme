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
	
	<div class="sidebar" role="complementary">

		<div class="sidebar-widget">
			<?php if(!function_exists('dynamic_sidebar') || !dynamic_sidebar('widget-area-posts')) ?>
		</div>

	</div>
	<?php do_action('tk_sidebar_after'); ?>
</aside>
<!-- ./column-container-secondary-->
<!-- $/SIDEBAR -->
