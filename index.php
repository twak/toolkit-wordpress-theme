<?php
/**
 * main index template
 */

/* die when bots request this file directly */
if ( ! function_exists('get_header') ) {
     die();
}
get_header();
the_breadcrumb();
$post_type = get_post_type();
if ( ! $post_type ) {
    $post_type = 'post';
}
$title = get_field('tk_' . $post_type . '_page_settings_title', 'option');
if ( ! $title ) {
    $title = post_type_archive_title(false, false);
    if ( ! $title && $post_type == 'post' ) {
        $title = "Blog";
    }
}

printf('<div class="wrapper-sm wrapper-pd"><h1 class="heading-underline">%s</h1>', $title );

$hide_search = get_field('tk_' . $post_type . '_page_settings_search', 'option');
if ( ! $hide_search ) {
    printf('<form action="%s" role="search"><div class="island island-featured"><div class="row row-reduce-gutter">', home_url() );
    print('<div class="col-xs-12 col-sm-8 col-md-10">');
    printf('<input type="hidden" name="post_type" value="%s">', $post_type );
    print('<label class="sr-only" for="keyword">Search</label>');
    print('<input id="keyword" type="search" name="q" placeholder="Search by keyword" value="">');
    print('</div>');
    print('<div class="col-xs-4 col-sm-4 col-md-2 pull-right">');
    print('<input type="submit" value="Search">');
    print('</div>');
    print('</div></div></form>');
}

get_template_part('loop-flag'); 
get_template_part('pagination');  

print('</div>');

get_footer();