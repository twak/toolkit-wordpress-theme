<?php get_header(); ?>

<?php the_breadcrumb(); ?>

<?php 

    //Used instead of standard loop for filter by keyword and category
    //e.g. index.php search and archive search

    function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }    
    
    $post_type = "all"; // define variables and set to empty values    
    
    if (!empty($_GET['post_type'])):   
        $post_type = test_input($_GET['post_type']);        
    endif;

?>

<div class="wrapper-sm wrapper-pd">

	<h1 class="heading-underline">Search Results <?php if($post_type != 'all'){echo 'for '.ucfirst($post_type);} ?></h1>

	<form action="<?php echo home_url(); ?>" role="search">        
        <div class="island island-featured">
            <div class="row row-reduce-gutter">   

                <div class="col-sm-8 col-md-10">
                    <label class="sr-only" for="searchInput">Search</label>
                    <input id="searchInput" type="search" name="q" placeholder="Search" value="<?php if($_GET['q']){ echo $_GET['q'];} ?>">                    
                    <!-- <input type="hidden" name="cat" value="20"> -->
                </div>                

                <div class="col-sm-8 col-md-5">
                    <select class="js-action-toggle" name="post_type">
                        <option <?php if($post_type == 'all'){ echo 'selected'; }?> value="all">All content</option>                        
                        <option <?php if($post_type == 'post'){ echo 'selected'; }?> value="post">Posts</option>                        
                    </select>
                </div>     

                <div class="col-sm-8 col-md-5">
                    <select class="js-action-toggle" name="searchOption">
                        <option value="searchSite" selected data-action="<?php echo home_url(); ?>">This site</option>
                        <option value="searchAll" data-action="http://www.leeds.ac.uk/site/scripts/search_results.php">All leeds.ac.uk sites</option>
                    </select>
                </div>      
               
                <div class="col-xs-4 col-sm-4 col-md-2 pull-right">
                    <input type="submit" value="Search">
                </div>
            </div>
        </div>          
    </form>

    <p class="m-b-0"><?php echo sprintf( __( '%s Search Results for ', 'html5blank' ), $wp_query->found_posts ); echo '<strong>&#8220;'.get_search_query().'&#8221;</strong>' ?></span></p>
    <hr class="m-t-0">

	<?php get_template_part('loop-search'); ?>
	<?php get_template_part('pagination'); ?>

</div>


<?php get_footer(); ?>
