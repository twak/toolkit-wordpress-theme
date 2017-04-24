<?php
/**
 * News post type archive template
 */
get_header();
the_breadcrumb();
$title = get_field('tk_news_page_settings_title', 'option');
if ( ! $title ) {
    $title = post_type_archive_title('', false);
}

?>
<div class="wrapper-sm wrapper-pd">
    <h1 class="heading-underline"><?php echo $title; ?></h1>   

    <?php
    // news archive intro
    $intro = get_field( 'tk_news_page_settings_introduction', 'option' );
    if ( $intro ) {
        print( apply_filters( 'the_content', $intro ) );
    }

    // whether to show/hide search
    $hide_search = get_field('tk_news_page_settings_search', 'option');
    if ( ! $hide_search && have_posts() ) {
        printf('<form action="%s" role="search"><div class="island island-featured"><div class="row row-reduce-gutter">', home_url() );
        print('<div class="col-xs-12 col-sm-8 col-md-10">');
        print('<input type="hidden" name="post_type" value="news">');
        print('<label class="sr-only" for="keyword">Search</label>');
        print('<input id="keyword" type="search" name="q" placeholder="Search by keyword" value="">');
        print('</div>');
        print('<div class="col-xs-4 col-sm-4 col-md-2 pull-right">');
        print('<input type="submit" value="Search">');
        print('</div>');
        print('</div></div></form>');
    }
    if (have_posts()) : while (have_posts()) : the_post(); 
?>    
    <article id="post-<?php the_ID(); ?>" <?php post_class('flag'); ?>>                 

        <?php if ( has_post_thumbnail()) : // Check if thumbnail exists ?>
        <div class="flag-img">
            <div class="rs-img rs-img-2-1" style="background-image: url('<?php the_post_thumbnail_url('large'); ?>');">
                <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
                    <?php the_post_thumbnail('large'); // Declare pixel size you need inside the array ?>
                </a>
            </div>
        </div>              
        <?php endif; ?>

        <div class="flag-body">
            <p class="heading-related"><?php tk_post_categories(); ?> </p>
            <h4 class="heading-link"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h4>                           
            <div class="excerpt">               
                <?php the_excerpt();  ?>
            </div>
        </div>

    </article>
<?php                    
    endwhile; endif;
?>
    
<?php get_template_part('pagination'); ?>

</div>

<?php get_footer();