<?php 

//ACF Profile page settings

//Custom title
if(get_field('tk_profiles_page_settings_title', 'option')): 
    $custom_title = get_field('tk_profiles_page_settings_title', 'option');
endif;

//Intro (Lead text)
if(get_field('tk_profiles_page_settings_introduction', 'option')): 
    $intro = get_field('tk_profiles_page_settings_introduction', 'option');
endif;

//Layout
if(get_field('tk_profiles_page_settings_template', 'option')):
    $template = get_field('tk_profiles_page_settings_template', 'option');
endif;

//Card layout order
if(get_field('tk_profiles_page_settings_template_categories', 'option')):
    $order = get_field('tk_profiles_page_settings_template_categories', 'option');
endif;

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
if($template == 'card_layout'):
    if($order == 'alphabetical'):
        include_once(dirname(__FILE__) . '/loop-card-alphabetical.php' );
    else:
        include_once(dirname(__FILE__) . '/loop-card-category.php' );
    endif;
else:
    include_once(dirname(__FILE__) . '/loop-table.php' );
endif;

?>

</div>

<?php get_footer(); ?>
