<?php 

//ACF Profile page settings

//Custom title
$custom_title = get_field('tk_profiles_page_settings_title', 'option');

//Intro (Lead text)
$intro = get_field('tk_profiles_page_settings_introduction', 'option');

// Display logic
$display = get_field('tk_profile_display', 'option');

//Layout
$template = get_field('tk_profiles_page_settings_template', 'option');

//Card layout order
$order = get_field('tk_profiles_page_settings_template_categories', 'option');

?>

<?php get_header(); ?>

<div class="wrapper-pd-xs">
    <ul class="breadcrumb">
        <li><a href="<?php echo site_url();?>">Home</a></li>
        <li><?php if($custom_title): echo $custom_title; else: echo 'Profiles'; endif; ?></li>
    </ul>
</div>

<div class="wrapper-md wrapper-pd">

    <h1 class="heading-underline"><?php if($custom_title): echo $custom_title; else: echo 'Profiles'; endif; ?></h1>    

    <?php if($intro): ?>    
    <div class="wrapper-md">
        <?php echo $intro; ?>
    </div>
    <?php endif; ?>

<?php

//
if ( $display === 'by_cat' ) {
    include(dirname(__FILE__) . '/templates/loop-by-cat.php' );
} else {
    include(dirname(__FILE__) . '/templates/loop-all.php' );
}
?>

</div>

<?php get_footer(); ?>
