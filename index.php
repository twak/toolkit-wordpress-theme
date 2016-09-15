<?php get_header(); ?>

<?php the_breadcrumb(); ?>

<div class="wrapper-sm wrapper-pd">

	<h1 class="heading-underline">Blog</h1>

    <form action="<?php echo home_url(); ?>" role="search">
        <div class="island island-featured">
            <div class="row row-reduce-gutter">   
                <div class="col-sm-8 col-md-10">                                        
                    <label class="sr-only" for="keyword">Search</label>
                    <input id="keyword" type="search" name="q" placeholder="Search by keyword" value="">
                    <input type="hidden" name="post_type" value="post">
                </div>
               
                <div class="col-xs-4 col-sm-4 col-md-2 pull-right">
                    <input type="submit" value="Search">
                </div>
            </div>
        </div>          
    </form>    

    <?php 
        get_template_part('loop-flag'); 
        get_template_part('pagination');  
    ?>		

</div>

<?php get_footer(); ?>
