<!-- page-sidebar-top -->
<?php
// get some variables
$full_width = tk_full_width();
$is_widget_template = ( basename( get_page_template() ) === "template-widgets.php" );
$show_breadcrumb = $is_widget_template ? get_field('output_breadcrumb'): true;
$show_title = $is_widget_template ? get_field('output_page_title'): true;
$show_sidebar = tk_sidebar();

// showing sidebar
if ( $show_sidebar ) :
    // using full width layout
    if ( $full_width ) : ?>
        <div class="column-container column-container-fw">
        <?php get_sidebar(); ?>
        <div class="column-container-primary">  
        <?php 
            the_breadcrumb(); ?>
            <header class="wrapper-padded wrapper-sm">
                <?php do_action('tk_title_before'); ?> 
                <h1 class="heading-underline"><?php the_title(); ?></h1>
                <?php do_action('tk_title_after'); ?>
            </header>
        <?php
    else :
        the_breadcrumb(); ?>
        <div class="column-container">
        <?php get_sidebar(); ?>
        <div class="column-container-primary">
            <header class="wrapper-padded wrapper-sm">
                <?php do_action('tk_title_before'); ?> 
                <h1 class="heading-underline"><?php the_title(); ?></h1>
                <?php do_action('tk_title_after'); ?>
            </header>                   
    <?php
    endif;
else :
    if ( $show_breadcrumb ) :
        the_breadcrumb();
    endif;
    if ( $show_title ) : ?>
    <header class="wrapper-padded wrapper-sm">
        <?php do_action('tk_title_before'); ?> 
        <h1 class="heading-underline"><?php the_title(); ?></h1>
        <?php do_action('tk_title_after'); ?>
    </header>                   
    <?php endif;
    if ( $is_widget_template ) :
        //close wrapper if on widgets page template
        print('</div>');
    endif;
endif;
?>
<!-- #page-sidebar-top -->