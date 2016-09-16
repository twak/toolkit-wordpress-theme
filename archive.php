<?php get_header(); ?>

<?php the_breadcrumb(); ?>

<div class="wrapper-sm wrapper-pd">
	<h1 class="heading-underline">aaaa<?php post_type_archive_title(); ?></h1>

    <form action="<?php echo home_url(); ?>" role="search">
    	<div class="island island-featured">
            <div class="row row-reduce-gutter">
                <div class="col-xs-12 col-sm-8 col-md-10">
                    <input type="hidden" name="post_type" value="<?php echo $posty_small; ?>">
                    <label class="sr-only" for="keyword">Search</label>
                    <input id="keyword" type="search" name="q" placeholder="Search by keyword" value="">
                </div>
                
                <div class="col-xs-4 col-sm-4 col-md-2 pull-right">
                    <input type="submit" value="Search">
                </div>                           
            </div>                             
        </div>
    </form>
	
    <?php get_template_part('loop-flag'); ?>
	<?php get_template_part('pagination'); ?>

</div>

<?php get_footer(); ?>
