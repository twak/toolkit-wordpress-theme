<?php


//table profile layout
$args = array(
    'post_type' => 'profiles',
    'posts_per_page' => -1,   
    'order'    => 'ASC'        
);
// get categories
$profile_categories = get_terms( array(
    'taxonomy'   => 'profile_category',
    'hide_empty' => true
) );

// set the requested (or default) term
$term = false;
if ( is_tax( 'profile_category' ) ) {
    // term is specified
    $term = get_queried_object();
} else {
    if ( have_rows( 'tk_profile_display_by_category', 'option' ) ) {
        // get all rows from the repeater
        $cats = get_field('tk_profile_display_by_category', 'option' );
        $category_id = $cats[0]['profile_category'];
        $term = get_term($category_id);
    }
}


if ( $term ) {

    $args['tax_query'] = array(
        array(
            'taxonomy' => 'profile_category',
            'field'    => 'term_id',
            'terms'    => $term->term_id,
        )
    );

    $category_tabs = array();

    // set profiles order and layout per category, and build tab navigation
    if ( have_rows( 'tk_profile_display_by_category', 'option' ) ) {
        while ( have_rows('tk_profile_display_by_category', 'option' ) ) {
            the_row();
            // see if this rule applies to the selected category
            $category_id = get_sub_field('profile_category');

            if ( $category_id == $term->term_id ) {

                // set order for this category
                $profiles_order = get_sub_field('category_order');
                if ( $profiles_order === 'alphabetical' ) {
                    // order profiles by last name (alphabetical)
                    $args['meta_key']  = 'tk_profiles_last_name';
                    $args['orderby'] = 'meta_value';
                } else {
                    // order profiles by profile order
                    $args['orderby'] = 'menu_order';
                }
                
                // set layout for this category
                $template = get_sub_field('category_layout');
                $template_name = ( $template === 'card_layout' ) ? 'cards': 'table';

            }

            // make a tab
            $tabclass = ( $term->term_id == $category_id ) ? ' class="active"': '';
            $category = get_term($category_id);
            $category_tabs[] = sprintf('<li%s><a href="%s">%s</a></li>', $tabclass, get_term_link($category), $category->name );
        }
    }

    // if there are no settings for categories, set a default
    if ( ! isset( $args['orderby'] ) ) {
        $args['meta_key']  = 'tk_profiles_last_name';
        $args['orderby'] = 'meta_value';
        $template_name = 'table';
        $flag_show_images = false;
    }

    // new query
    $loop = new WP_Query( $args );  

    if ( $loop->have_posts() ) {

        // only output headings if there is more than one category
        if ( count( $category_tabs ) > 1 ) {
            ?>
                <div class="tk-tabs-header" style="margin-bottom:1em;">
                    <ul class="nav nav-tabs tk-nav-tabs pull-left">
            <?php
            foreach ( $category_tabs as $tab ) {
                print( $tab );
            }
            ?>
                    </ul>
                </div>
            <?php
        }
        include( dirname(__FILE__) . '/' . $template_name . '-header.php' );

        while ($loop->have_posts()) {
            $loop->the_post();
            include( dirname(__FILE__) . '/' . $template_name . '-row.php' );
        }
        include( dirname(__FILE__) . '/' . $template_name . '-footer.php' );
    }
} else {

    // no term set
}
