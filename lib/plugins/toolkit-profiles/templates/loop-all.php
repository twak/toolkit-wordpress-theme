<?php


//table profile layout
$args = array(
    'post_type' => 'profiles',
    'posts_per_page' => -1,   
    'order'    => 'ASC'        
);

// profiles order
$profiles_order = get_field( 'tk_profiles_page_settings_profiles_order', 'option' );
if ( $profiles_order === 'alphabetical' || $profiles_order === 'alphabetical_category' ) {
    // order profiles by last name (alphabetical)
    $args['meta_key']  = 'tk_profiles_last_name';
    $args['orderby'] = 'meta_value';
} else {
    // order profiles by profile order
    $args['orderby'] = 'menu_order';
}
if ( is_tax( 'profile_category' ) ) {
    $term = get_queried_object();
    $args['tax_query'] = array(
        array(
            'taxonomy' => 'profile_category',
            'field'    => 'slug',
            'terms'    => $term->slug,
        )
    );
}

// new query
$loop = new WP_Query( $args );  

if ( $loop->have_posts() ) {

    // Cards or tables?
    $template = get_field('tk_profiles_page_settings_template', 'option');
    $template_name = ( $template === 'card_layout' ) ? 'cards': 'table';

    if ( $profiles_order === 'menu_order_category'  || $profiles_order === 'alphabetical_category') {

        // split the page up by category
        $profile_categories = get_terms( array(
            'taxonomy'   => 'profile_category',
            'hide_empty' => true
        ) );

        if ( count( $profile_categories ) > 1 ) {

            foreach ( $profile_categories as $profile_category ) {
?>
<div class="content-header">
    <h4 class="content-header-heading content-header-heading-underline pull-left"><?php echo $profile_category->name; ?></h4>
</div>    
<?php  
                include( dirname(__FILE__) . '/' . $template_name . '-header.php' );

                while ($loop->have_posts()) {
                    $loop->the_post();
                    if ( has_term( $profile_category->term_id, 'profile_category' ) ) {
                        include( dirname(__FILE__) . '/' . $template_name . '-row.php' );
                    }
                }
                $loop->rewind_posts();

                include( dirname(__FILE__) . '/' . $template_name . '-footer.php' );
            } // end looping through categories

        } else {

            // less than one category found
            include( dirname(__FILE__) . '/' . $template_name . '-header.php' );

            while ($loop->have_posts()) {
                $loop->the_post();
                include( dirname(__FILE__) . '/' . $template_name . '-row.php' );
            }

            include( dirname(__FILE__) . '/' . $template_name . '-footer.php' );
        }
    } else {

        // page is not split by category
        // less than one category found
        include( dirname(__FILE__) . '/' . $template_name . '-header.php' );

        while ($loop->have_posts()) {
            $loop->the_post();
            include( dirname(__FILE__) . '/' . $template_name . '-row.php' );
        }

        include( dirname(__FILE__) . '/' . $template_name . '-footer.php' );
    }
}




