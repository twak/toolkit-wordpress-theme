<?php // Used for the Archived category to display events already gone

get_header(); ?>

<?php the_breadcrumb(); ?>

<div class="wrapper-sm wrapper-pad">
	<h1 class="heading-underline">Archived events</h1>
	<ul class="list-nav">	    
	    <li><a href="<?php echo $url = get_bloginfo('url'); ?>/events/"><span class="tk-icon tk-icon-chevron-left"></span> Back to events</a></li>        
	</ul>	

	<?php 

	$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
	$archived_id = get_cat_ID('archived-events'); //acrhived cat ID

	query_posts(array(
        'post_type' => 'events',                 
        'meta_key'  => 'event_start_date',
        'orderby' => 'meta_value_num',
        'order'  => 'ASC',        
        'cat' => $archived_id,
        'paged' => $paged
    ));

	?>

	<?php get_template_part('loop-flag'); ?>
	<?php get_template_part('pagination'); ?>

</div>

<?php get_footer(); ?>

