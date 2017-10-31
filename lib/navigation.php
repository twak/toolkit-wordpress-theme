<?php
/**
 * Navigation functions
 */

// Header navigation
function tk_header_nav()
{
    wp_nav_menu(
        array(
            'theme_location'  => 'header-menu',
            'menu'            => '',
            'container'       => 'div',
            'container_class' => 'menu-{menu slug}-container',
            'container_id'    => '',
            'menu_class'      => 'nav-priority-inner',
            'menu_id'         => '',
            'echo'            => true,
            'fallback_cb'     => 'link_to_menu_editor',
            'before'          => '',
            'after'           => '',
            'link_before'     => '',
            'link_after'      => '',
            'items_wrap'      => '<ul class="tk-nav-list tk-nav-list-primary">%3$s</ul>',
            'depth'           => 0,
            'walker'          => ''
        )
    );
}

function tk_footer_nav()
{    
    wp_nav_menu(
        array(
            'theme_location'  => 'footer-menu',
            'menu'            => '',
            'container'       => 'div',
            'container_class' => 'menu-{menu slug}-container',
            'container_id'    => '',
            'menu_class'      => '',
            'menu_id'         => '',
            'echo'            => true,
            'fallback_cb'     => 'link_to_menu_editor',
            'before'          => '',
            'after'           => '',
            'link_before'     => '',
            'link_after'      => '',
            'items_wrap'      => '<ul class="nav">%3$s</ul>',
            'depth'           => 0,
            'walker'          => ''
        )
    );
}

/**
 * Menu fallback. Link to the menu editor if that is useful.
 *
 * @param  array $args
 * @return string
 */
function link_to_menu_editor( $args )
{
    if ( ! current_user_can( 'manage_options' ) )
    {
        return;
    }

    // see wp-includes/nav-menu-template.php for available arguments
    extract( $args );

    $link = $link_before
        . '<a href="' .admin_url( 'nav-menus.php' ) . '">' . $before . 'Add navigation +' . $after . '</a>'
        . $link_after;

    // We have a list
    if ( FALSE !== stripos( $items_wrap, '<ul' )
        or FALSE !== stripos( $items_wrap, '<ol' )
    )
    {
        $link = "<li>$link</li>";
    }

    $output = sprintf( $items_wrap, $menu_id, $menu_class, $link );
    if ( ! empty ( $container ) )
    {
        $output  = "<$container class='$container_class' id='$container_id'>$output</$container>";
    }

    if ( $echo )
    {
        echo $output;
    }

    return $output;
}


add_filter( 'wp_nav_menu_objects', 'tk_menu_set_dropdown', 10, 2 );
function tk_menu_set_dropdown( $sorted_menu_items, $args ) {
    // add dropdown classes to header menu
    if ( 'header-menu' === $args->theme_location ) {
        foreach ( $sorted_menu_items as $key => $obj ) {
            if ( in_array('menu-item-has-children', $sorted_menu_items[$key]->classes) ) {
                $sorted_menu_items[$key]->classes[] = 'tk-nav-dropdown';
            }
        }
    }
    $last_top = 0;
    foreach ( $sorted_menu_items as $key => $obj ) {
        // it is a top lv item?
        if ( 0 == $obj->menu_item_parent ) {
            // set the key of the parent
            $last_top = $key;
        } else {
            $sorted_menu_items[$last_top]->classes['nav-dropdown'] = 'tk-nav-dropdown';
        }
        // adds dropdown class - this is for menus placed in the sidebart using a widget (uses different class)
        if ( in_array('menu-item-has-children', $sorted_menu_items[$key]->classes) ) {
            $sorted_menu_items[$key]->classes[] = 'dropdown';
        }
    }
    return $sorted_menu_items;
}

/**
 * changes nav menu arguments for menus placed in sidebar
 */
add_filter('widget_nav_menu_args', 'tk_menu_in_sidebar', 10, 4 );
function tk_menu_in_sidebar( $nav_menu_args, $nav_menu, $args, $instance ) {
    $nav_menu_args['menu_class'] = 'sidebar-nav';
    return $nav_menu_args;
}




// Register Navigation
add_action('init', 'register_tk_menu');
function register_tk_menu()
{
    register_nav_menus(array(
        'header-menu'   => 'Header Menu', // Main Navigation
        'footer-menu'   => 'Footer Menu' // Footer links
    ));
}


// Remove the <div> surrounding the dynamic navigation to cleanup markup
add_filter('wp_nav_menu_args', 'tk_wp_nav_menu_args'); // Remove surrounding <div> from WP Navigation
function tk_wp_nav_menu_args($args = '')
{
    $args['container'] = false;
    return $args;
}


// If Dynamic Sidebar Exists
if (function_exists('register_sidebar'))
{
    // Define Sidebar Widget Area 1
    register_sidebar(array(
        'name' => __('Widget Sidebar', 'html5blank'),
        'description' => __('Main sidebar', 'html5blank'),
        'id' => 'widget-area-1',
        'before_widget' => '<div id="%1$s" class="%2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3>',
        'after_title' => '</h3>'
    ));

	// Define Sidebar Widget Area Posts
	register_sidebar(array(
		'name' => __('Widget Sidebar: Posts', 'html5blank'),
		'description' => __('Sidebar for posts, past category pages, etc', 'html5blank'),
		'id' => 'widget-area-posts',
		'before_widget' => '<div id="%1$s" class="%2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h3>',
		'after_title' => '</h3>'
	));

    // Define Sidebar Widget Area 2
    register_sidebar(array(
        'name' => 'Widget Footer',
        'description' => 'Footer widgets', 'html5blank',
        'id' => 'widget-area-2',
        'before_widget' => '<div id="%1$s" class="%2$s col-sm-6 col-md-3">',
        'after_widget' => '</div>',
        'before_title' => '<h3>',
        'after_title' => '</h3>'
    ));

    // Footer Left
    register_sidebar( array(
        'name'          => __( 'Footer left', 'theme_text_domain' ),
        'id'            => 'footer-left',
        'description'   => '',
        'class'         => '',
        'before_widget' => '<ul class="quicklinks-list">',
        'after_widget'  => '</ul>',
        'before_title'  => '<li class="title">',
        'after_title'   => '</li>' 
    ));

    // Footer Middle Left
    register_sidebar( array(
        'name'          => __( 'Footer Middle Left', 'theme_text_domain' ),
        'id'            => 'footer-middle-left',
        'description'   => '',
        'class'         => '',
        'before_widget' => '<ul class="quicklinks-list">',
        'after_widget'  => '</ul>',
        'before_title'  => '<li class="title">',
        'after_title'   => '</li>' 
    ));

    // Footer Middle Right
    register_sidebar( array(
        'name'          => __( 'Footer Middle Right', 'theme_text_domain' ),
        'id'            => 'footer-middle-right',
        'description'   => '',
        'class'         => '',
        'before_widget' => '<ul class="quicklinks-list">',
        'after_widget'  => '</ul>',
        'before_title'  => '<li class="title">',
        'after_title'   => '</li>' 
    ));

    // Footer Right
    register_sidebar( array(
        'name'          => __( 'Footer Right', 'theme_text_domain' ),
        'id'            => 'footer-right',
        'description'   => '',
        'class'         => '',
        'before_widget' => '<ul class="quicklinks-list">',
        'after_widget'  => '</ul>',
        'before_title'  => '<li class="title">',
        'after_title'   => '</li>' 
    ));
}

// Unregister unwanted widgets
 function unregister_default_widgets() {
    unregister_widget('WP_Widget_Calendar');
    unregister_widget('WP_Widget_Meta');
    unregister_widget('WP_Widget_Search');
    unregister_widget('WP_Widget_RSS');
    unregister_widget('WP_Widget_Tag_Cloud');
    unregister_widget('Twenty_Eleven_Ephemera_Widget');
    unregister_widget('WP_Widget_Media_Audio');
    unregister_widget('WP_Widget_Media_Video');
    unregister_widget('WP_Widget_Media_Image');
 }
 add_action('widgets_init', 'unregister_default_widgets', 11);

/**
 * $CUSTOM BREADCRUMBS
 */

// Breadcrumbs
function the_breadcrumb() {
       
    // Settings
    $separator          = '';
    $breadcrums_id      = 'breadcrumb';
    $breadcrums_class   = 'breadcrumb';
    $home_title         = 'Home';
      
    // Get the query & post information
    global $post,$wp_query;
       
    // Do not display on the homepage
    if ( !is_front_page() ) {

	    do_action('tk_breadcrumb_before');
       
        // Build the breadcrums
        echo '<div class="wrapper-pd-xs"><ul id="' . $breadcrums_id . '" class="' . $breadcrums_class . '">';
           
        // Home page
        echo '<li class="item-home"><a class="bread-link bread-home" href="' . get_home_url() . '" title="' . $home_title . '">' . $home_title . '</a></li>';
        //echo '<li class="separator separator-home"> ' . $separator . ' </li>';

        if ( is_search() ) {           
            // Search results page
            echo '<li class="item-current item-current-' . get_search_query() . '"><strong class="bread-current bread-current-' . get_search_query() . '" title="Search results for: ' . get_search_query() . '">Search results for: ' . get_search_query() . '</strong></li>';          
           
        } else if ( is_archive() && !is_tax() && !is_category() && !is_tag() ) {
              
            $title = get_field('tk_' . get_post_type() . '_page_settings_title', 'option');
            if ( ! $title ) {
                $title = post_type_archive_title(false, false);
            }
            echo '<li class="item-current item-archive"><strong class="bread-current bread-archive">' . $title . '</strong></li>';
              
        } else if ( is_archive() && is_tax() && !is_category() && !is_tag() ) {
              
            // If post is a custom post type
            $post_type = get_post_type();

            // display name and link
            $title = get_field('tk_' . $post_type . '_page_settings_title', 'option');
            if ( ! $title ) {
                $title = post_type_archive_title(false, false);
                if ( ! $title && $post_type = 'post' ) {
                    $title = "Blog";
                }
            }
            $post_type_archive = get_post_type_archive_link($post_type);
      
            echo '<li class="item-cat item-custom-post-type-' . $post_type . '"><a class="bread-cat bread-custom-post-type-' . $post_type . '" href="' . $post_type_archive . '" title="' . esc_attr($title) . '">' . $title . '</a></li>';
              
            $custom_tax_name = get_queried_object()->name;
            echo '<li class="item-current item-archive"><strong class="bread-current bread-archive">' . $custom_tax_name . '</strong></li>';
              
        } else if ( is_single() ) {
              
            // If post is a custom post type
            $post_type = get_post_type();
            $post_type_obj = get_post_type_object($post_type);

            // display name and link
            $title = get_field('tk_' . $post_type . '_page_settings_title', 'option');
            if ( ! $title ) {
                $title = $post_type_obj->labels->name;
                if ( $post_type == 'post' ) {
                    $title = "Blog";
                }
            }
            $post_type_archive = get_post_type_archive_link($post_type);
          
            echo '<li class="item-cat item-custom-post-type-' . $post_type . '"><a class="bread-cat bread-custom-post-type-' . $post_type . '" href="' . $post_type_archive . '" title="' . esc_attr($title) . '">' . $title . '</a></li>';
              
        } else if ( is_category() ) {
            if ( get_option( 'show_on_front' ) == 'page' ) {
                // blog is assigned to a page
                $title = get_field('tk_post_page_settings_title', 'option');
                if ( ! $title ) {
                    $title = 'Blog';
                }
                $url = get_permalink(get_option( 'page_for_posts' ));
                echo '<li class="item-posts-page"><strong class="bread-posts"><a class="bread-posts" href="' . $url . '" title="' . esc_attr($title) . '">' . $title . '</a></strong></li>';
            }             

            // Category page
            echo '<li class="item-current item-cat"><strong class="bread-current bread-cat">' . single_cat_title('', false) . '</strong></li>';
               
        } else if ( is_page() ) {
               
            // Standard page
            if( $post->post_parent ){
                   
                $parents = '';

                // If child page, get parents 
                $anc = get_post_ancestors( $post->ID );
                   
                // Get parents in the right order
                $anc = array_reverse($anc);
                   
                // Parent page loop
                foreach ( $anc as $ancestor ) {
                    $parents .= '<li class="item-parent item-parent-' . $ancestor . '"><a class="bread-parent bread-parent-' . $ancestor . '" href="' . get_permalink($ancestor) . '" title="' . get_the_title($ancestor) . '">' . get_the_title($ancestor) . '</a></li>';
                    //$parents .= '<li class="separator separator-' . $ancestor . '"> ' . $separator . ' </li>';
                }
                   
                // Display parent pages
                echo $parents;
                   
                // Current page
                echo '<li class="item-current item-' . $post->ID . '"><strong title="' . get_the_title() . '"> ' . get_the_title() . '</strong></li>';
                   
            } else {
                // Just display current page if not parents
                echo '<li class="item-current item-' . $post->ID . '"><strong class="bread-current bread-' . $post->ID . '"> ' . get_the_title() . '</strong></li>';
                   
            }
               
        } else if ( is_tag() ) {
               
            if ( get_option( 'show_on_front' ) == 'page' ) {
                // blog is assigned to a page
                $title = get_field('tk_post_page_settings_title', 'option');
                if ( ! $title ) {
                    $title = 'Blog';
                }
                $url = get_permalink(get_option( 'page_for_posts' ));
                echo '<li class="item-posts-page"><strong class="bread-posts"><a class="bread-posts" href="' . $url . '" title="' . esc_attr($title) . '">' . $title . '</a></strong></li>';
            }             
            // Tag page
               
            // Get tag information
            $term_id        = get_query_var('tag_id');
            $taxonomy       = 'post_tag';
            $args           = 'include=' . $term_id;
            $terms          = get_terms( $taxonomy, $args );
            $get_term_id    = $terms[0]->term_id;
            $get_term_slug  = $terms[0]->slug;
            $get_term_name  = $terms[0]->name;
               
            // Display the tag name
            echo '<li class="item-current item-tag-' . $get_term_id . ' item-tag-' . $get_term_slug . '"><strong class="bread-current bread-tag-' . $get_term_id . ' bread-tag-' . $get_term_slug . '">' . $get_term_name . '</strong></li>';
           
        } elseif ( is_day() ) {
               
            // Day archive
               
            // Year link
            echo '<li class="item-year item-year-' . get_the_time('Y') . '"><a class="bread-year bread-year-' . get_the_time('Y') . '" href="' . get_year_link( get_the_time('Y') ) . '" title="' . get_the_time('Y') . '">' . get_the_time('Y') . ' Archives</a></li>';
            //echo '<li class="separator separator-' . get_the_time('Y') . '"> ' . $separator . ' </li>';
               
            // Month link
            echo '<li class="item-month item-month-' . get_the_time('m') . '"><a class="bread-month bread-month-' . get_the_time('m') . '" href="' . get_month_link( get_the_time('Y'), get_the_time('m') ) . '" title="' . get_the_time('M') . '">' . get_the_time('M') . ' Archives</a></li>';
            //echo '<li class="separator separator-' . get_the_time('m') . '"> ' . $separator . ' </li>';
               
            // Day display
            echo '<li class="item-current item-' . get_the_time('j') . '"><strong class="bread-current bread-' . get_the_time('j') . '"> ' . get_the_time('jS') . ' ' . get_the_time('M') . ' Archives</strong></li>';
               
        } else if ( is_month() ) {
               
            // Month Archive
               
            // Year link
            echo '<li class="item-year item-year-' . get_the_time('Y') . '"><a class="bread-year bread-year-' . get_the_time('Y') . '" href="' . get_year_link( get_the_time('Y') ) . '" title="' . get_the_time('Y') . '">' . get_the_time('Y') . ' Archives</a></li>';
            //echo '<li class="separator separator-' . get_the_time('Y') . '"> ' . $separator . ' </li>';
               
            // Month display
            echo '<li class="item-month item-month-' . get_the_time('m') . '"><strong class="bread-month bread-month-' . get_the_time('m') . '" title="' . get_the_time('M') . '">' . get_the_time('M') . ' Archives</strong></li>';
               
        } else if ( is_year() ) {
               
            // Display year archive
            echo '<li class="item-current item-current-' . get_the_time('Y') . '"><strong class="bread-current bread-current-' . get_the_time('Y') . '" title="' . get_the_time('Y') . '">' . get_the_time('Y') . ' Archives</strong></li>';
               
        } else if ( is_author() ) {
               
            // Auhor archive
               
            // Get the author information
            global $author;
            $userdata = get_userdata( $author );
               
            // Display author name
            echo '<li class="item-current item-current-' . $userdata->user_nicename . '"><strong class="bread-current bread-current-' . $userdata->user_nicename . '" title="' . $userdata->display_name . '">' . 'Author: ' . $userdata->display_name . '</strong></li>';
           
        } else if ( get_query_var('paged') ) {
               
            // Paginated archives
            echo '<li class="item-current item-current-' . get_query_var('paged') . '"><strong class="bread-current bread-current-' . get_query_var('paged') . '" title="Page ' . get_query_var('paged') . '">'.__('Page') . ' ' . get_query_var('paged') . '</strong></li>';
               
        } else if ( is_home() ) {
            //Blog index
            $title = get_field('tk_post_page_settings_title', 'option');
            if ( ! $title ) {
                $title = 'Blog';
            }
            echo '<li class="item-current item-current-blog"><strong class="bread-current">' . $title . '</strong></li>';
                 
        } elseif ( is_404() ) {
               
            // 404 page
            echo '<li>' . 'Error 404' . '</li>';
        }
       
        echo '</ul></div>';

	    do_action('tk_breadcrumb_after');
           
    } else { // leave space
        echo "";
    }
       
}

/**
 * $CUSTOM PAGINATION 
 */

if ( !function_exists( 'wpex_pagination' ) ) {
    
    function tk_pagination() {
        
        $prev_arrow = '<span class="tk-icon-chevron-left"></span>';
        $next_arrow = '<span class="tk-icon-chevron-right"></span>';
        
        global $wp_query;

        $total = $wp_query->max_num_pages;
        $big = 999999999; // need an unlikely integer
        if( $total > 1 )  {
             if( !$current_page = get_query_var('paged') )
                 $current_page = 1;
             if( get_option('permalink_structure') ) {
                 $format = 'page/%#%/';
             } else {
                 $format = '&paged=%#%';
             }

            $return = paginate_links(array(
                'base'          => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
                'format'        => $format,
                'current'       => max( 1, get_query_var('paged') ),
                'total'         => $total,
                'mid_size'      => 3,
                'type'          => 'list',
                'prev_text'     => $prev_arrow,
                'next_text'     => $next_arrow,
             ) );

            echo strtr( $return, array(
                "page-numbers" => "pagination",
                "current" => "active"                
            ));
        }
    }
    
}

add_filter('get_the_terms', 'tk_modify_term_list', 1, 3);
function tk_modify_term_list($terms, $post_id, $tax)
{
    if ( ! is_admin() && 'category' === $tax ) {
        foreach( $terms as $term_index => $term_object ) {
            if ( $term_object->name == 'Uncategorized' ) {
                unset($terms[$term_index]);
            }
        }
    }
    return $terms;
}

/**
 * Class used to implement the Navigation Menu widget.#
 * replaces WP_Nav_Menu_Widget
 */
class tk_Nav_Menu_Widget extends WP_Widget {

    /**
     * Sets up a new Navigation Menu widget instance.
     */
    public function __construct() {
        $widget_ops = array(
            'description' => 'Add a navigation menu to your sidebar.',
            'customize_selective_refresh' => true,
        );
        parent::__construct( 'nav_menu', 'Navigation Menu', $widget_ops );
    }

    /**
     * Outputs the content for the current Navigation Menu widget instance.
     */
    public function widget( $args, $instance ) {
        // Get menu
        $nav_menu = ! empty( $instance['nav_menu'] ) ? wp_get_nav_menu_object( $instance['nav_menu'] ) : false;

        if ( ! $nav_menu ) {
            return;
        }

        $title = ! empty( $instance['title'] ) ? $instance['title'] : '';

        /** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
        $title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

        echo $args['before_widget'];

        if ( $title ) {
            echo $args['before_title'] . $title . $args['after_title'];
        }

        $nav_menu_args = array(
            'fallback_cb' => '',
            'menu'        => $nav_menu,
            ''
        );

        /**
         * Filters the arguments for the Navigation Menu widget.
         *
         * @since 4.2.0
         * @since 4.4.0 Added the `$instance` parameter.
         *
         * @param array    $nav_menu_args {
         *     An array of arguments passed to wp_nav_menu() to retrieve a navigation menu.
         *
         *     @type callable|bool $fallback_cb Callback to fire if the menu doesn't exist. Default empty.
         *     @type mixed         $menu        Menu ID, slug, or name.
         * }
         * @param WP_Term  $nav_menu      Nav menu object for the current menu.
         * @param array    $args          Display arguments for the current widget.
         * @param array    $instance      Array of settings for the current widget.
         */
        wp_nav_menu( apply_filters( 'widget_nav_menu_args', $nav_menu_args, $nav_menu, $args, $instance ) );

        echo $args['after_widget'];
    }

    /**
     * Handles updating settings for the current Navigation Menu widget instance.
     *
     * @since 3.0.0
     *
     * @param array $new_instance New settings for this instance as input by the user via
     *                            WP_Widget::form().
     * @param array $old_instance Old settings for this instance.
     * @return array Updated settings to save.
     */
    public function update( $new_instance, $old_instance ) {
        $instance = array();
        if ( ! empty( $new_instance['title'] ) ) {
            $instance['title'] = sanitize_text_field( $new_instance['title'] );
        }
        if ( ! empty( $new_instance['nav_menu'] ) ) {
            $instance['nav_menu'] = (int) $new_instance['nav_menu'];
        }
        return $instance;
    }

    /**
     * Outputs the settings form for the Navigation Menu widget.
     *
     * @since 3.0.0
     *
     * @param array $instance Current settings.
     * @global WP_Customize_Manager $wp_customize
     */
    public function form( $instance ) {
        global $wp_customize;
        $title = isset( $instance['title'] ) ? $instance['title'] : '';
        $nav_menu = isset( $instance['nav_menu'] ) ? $instance['nav_menu'] : '';

        // Get menus
        $menus = wp_get_nav_menus();

        // If no menus exists, direct the user to go and create some.
        ?>
        <p class="nav-menu-widget-no-menus-message" <?php if ( ! empty( $menus ) ) { echo ' style="display:none" '; } ?>>
            <?php
            if ( $wp_customize instanceof WP_Customize_Manager ) {
                $url = 'javascript: wp.customize.panel( "nav_menus" ).focus();';
            } else {
                $url = admin_url( 'nav-menus.php' );
            }
            ?>
            <?php echo sprintf( __( 'No menus have been created yet. <a href="%s">Create some</a>.' ), esc_attr( $url ) ); ?>
        </p>
        <div class="nav-menu-widget-form-controls" <?php if ( empty( $menus ) ) { echo ' style="display:none" '; } ?>>
            <p>
                <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ) ?></label>
                <input type="text" class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo esc_attr( $title ); ?>"/>
            </p>
            <p>
                <label for="<?php echo $this->get_field_id( 'nav_menu' ); ?>"><?php _e( 'Select Menu:' ); ?></label>
                <select id="<?php echo $this->get_field_id( 'nav_menu' ); ?>" name="<?php echo $this->get_field_name( 'nav_menu' ); ?>">
                    <option value="0"><?php _e( '&mdash; Select &mdash;' ); ?></option>
                    <?php foreach ( $menus as $menu ) : ?>
                        <option value="<?php echo esc_attr( $menu->term_id ); ?>" <?php selected( $nav_menu, $menu->term_id ); ?>>
                            <?php echo esc_html( $menu->name ); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </p>
            <?php if ( $wp_customize instanceof WP_Customize_Manager ) : ?>
                <p class="edit-selected-nav-menu" style="<?php if ( ! $nav_menu ) { echo 'display: none;'; } ?>">
                    <button type="button" class="button"><?php _e( 'Edit Menu' ) ?></button>
                </p>
            <?php endif; ?>
        </div>
        <?php
    }
}











