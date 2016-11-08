<?php
/**
 * Theme setup functions
 */

/* add favicons */
add_action( 'wp_head', 'tk_add_favicons' );
function tk_add_favicons()
{
    printf('<link rel="icon" sizes="192x192" href="%s/img/icons/touch-icon-192x192.png">', get_stylesheet_directory_uri() );
    printf('<link rel="shortcut icon" href="%s/img/icons/favicon.ico">', get_stylesheet_directory_uri() );
    printf('<link rel="apple-touch-icon-precomposed" sizes="180x180" href="%s/img/icons/apple-touch-icon-180x180-precomposed.png">', get_stylesheet_directory_uri() );
    printf('<link rel="apple-touch-icon-precomposed" sizes="152x152" href="%s/img/icons/apple-touch-icon-152x152-precomposed.png">', get_stylesheet_directory_uri() );
    printf('<link rel="apple-touch-icon-precomposed" sizes="144x144" href="%s/img/icons/apple-touch-icon-144x144-precomposed.png">', get_stylesheet_directory_uri() );
    printf('<link rel="apple-touch-icon-precomposed" sizes="120x120" href="%s/img/icons/apple-touch-icon-120x120-precomposed.png">', get_stylesheet_directory_uri() );
    printf('<link rel="apple-touch-icon-precomposed" sizes="114x114" href="%s/img/icons/apple-touch-icon-114x114-precomposed.png">', get_stylesheet_directory_uri() );
    printf('<link rel="apple-touch-icon-precomposed" sizes="76x76" href="%s/img/icons/apple-touch-icon-76x76-precomposed.png">', get_stylesheet_directory_uri() );
    printf('<link rel="apple-touch-icon-precomposed" sizes="72x72" href="%s/img/icons/apple-touch-icon-72x72-precomposed.png">', get_stylesheet_directory_uri() );
    printf('<link rel="apple-touch-icon-precomposed" href="%s/img/icons/apple-touch-icon-precomposed.png">', get_stylesheet_directory_uri() );
}

if (!isset($content_width))
{
    $content_width = 900;
}


if (function_exists('add_theme_support'))
{
    // Add Menu Support
    add_theme_support('menus');

    // Add Thumbnail Theme Support
    add_theme_support('post-thumbnails');
    add_image_size('large', 700, '', true); // Large Thumbnail
    add_image_size('medium', 250, '', true); // Medium Thumbnail
    add_image_size('small', 120, '', true); // Small Thumbnail
    add_image_size('custom-size', 700, 200, true); // Custom Thumbnail Size call using the_post_thumbnail('custom-size');
    add_image_size('profile-size', 400, '', true); //profile img
    add_image_size('featured-size', 800, '', true); //featured img
    add_image_size('banner-size-small', 1000, '', true); //banner swiper size small
    add_image_size('banner-size-large', 1400, '', true); //banner swiper size

    // Enables post and comment RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Localisation Support
    load_theme_textdomain('html5blank', get_template_directory() . '/languages');
}

// Threaded Comments
add_action('get_header', 'enable_threaded_comments'); // Enable Threaded Comments
function enable_threaded_comments()
{
    if (!is_admin()) {
        if (is_singular() AND comments_open() AND (get_option('thread_comments') == 1)) {
            wp_enqueue_script('comment-reply');
        }
    }
}

// Remove thumbnail width and height dimensions that prevent fluid images in the_thumbnail
add_filter('post_thumbnail_html', 'remove_thumbnail_dimensions', 10);
function remove_thumbnail_dimensions( $html )
{
    $html = preg_replace('/(width|height)=\"\d*\"\s/', "", $html);
    return $html;
}

// Add page slug to body class, love this - Credit: Starkers Wordpress Theme
add_filter('body_class', 'add_slug_to_body_class');
function add_slug_to_body_class($classes)
{
    global $post;
    if (is_home()) {
        $key = array_search('blog', $classes);
        if ($key > -1) {
            unset($classes[$key]);
        }
    } elseif (is_page()) {
        $classes[] = sanitize_html_class($post->post_name);
    } elseif (is_singular()) {
        $classes[] = sanitize_html_class($post->post_name);
    }

    return $classes;
}

// Add Theme Scripts and Stylesheet
add_action('wp_enqueue_scripts', 'tk_scripts_styles');
function tk_scripts_styles()
{
    wp_register_style('style', get_template_directory_uri() . '/style.css', array(), '1.0', 'all');
    wp_enqueue_style('style'); // Enqueue it!
    wp_register_script('modernizr', 'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js', array()); // Modernizr
    wp_enqueue_script('modernizr'); // Enqueue it!

    wp_register_script(
    	'tkscripts', 
    	get_template_directory_uri() . '/dist/script.min.js',
    	array('jquery'),
    	'1.0',
    	true
    );
    wp_enqueue_script('tkscripts'); // Enqueue it!

}

// Allow shortcodes in Dynamic Sidebar
add_filter('widget_text', 'do_shortcode');

// Allows Shortcodes to be executed in Excerpt (Manual Excerpts only)
add_filter('the_excerpt', 'do_shortcode'); 

// Custom View Article link to Post
add_filter('excerpt_more', 'tk_view_article');
function tk_view_article($more)
{
    return '...';
}

// Remove <p> tags from Excerpt altogether
remove_filter('the_excerpt', 'wpautop');

/**
 * CHANGE SEARCH QUERY STRING - Change search query string 's' work with 'q' for corporate search
 */
add_filter( 'query_vars', 'tk_query_vars' );
function tk_query_vars( $public_query_vars ) {
    if ( isset( $_GET['q'] ) && ! empty( $_GET['q'] ) ) {
        $_GET['s'] = $_GET['q'];
    }

    return $public_query_vars;
}

/**
 * $DROPCAP & SUMMARY -  first letter and summary of each post (used on news)
 */

add_filter('the_content', 'add_drop_caps', 30);
add_filter('the_excerpt', 'add_drop_caps', 30);
function add_drop_caps($content) {
    global $post;
    
    //only posts
    if(!empty($post) && $post->post_type == "post")
    {
        //find first p tag with a letter following it
        $match = getMatches("/\<p\>[A-Z]/i", $content, true);               
        if(!empty($match))
        {
            $letter = str_replace("<p>", "", $match);
            $dropcap = '<p class="summary"><span class="dropcaps">' . $letter . '</span>';
            $content = str_replace_once($match, $dropcap, $content);
        }       
    }
    
    return $content;
}

// Helper for Getting RegExp Matches

function getMatches($p, $s, $firstvalue = FALSE, $n = 0) {
    $ok = preg_match_all($p, $s, $matches);     
        
    if(!$ok)
        return false;
    else
    {       
        if($firstvalue)
            return $matches[$n][0];
        else
            return $matches[$n];
    }
}

// Replace a string once. From: http://php.net/manual/en/function.str-replace.php#86177

function str_replace_once($search, $replace, $subject) {
    $firstChar = strpos($subject, $search);
    if($firstChar !== false) {
        $beforeStr = substr($subject,0,$firstChar);
        $afterStr = substr($subject, $firstChar + strlen($search));
        return $beforeStr.$replace.$afterStr;
    } else {
        return $subject;
    }
}

/**
 * $POST CATEGORIES - Spits out lists of categories of post (used in the loop)
 */

if ( !function_exists( 'tk_post_categories();' ) ) {
    
    function tk_post_categories() {

        echo get_post_type(); 
                
        $count_cat = 0;
        foreach((get_the_category()) as $category) {
            if(strtolower($category->cat_name) != 'uncategorised' && strtolower($category->cat_name) != 'uncategorized'){ // ignore uncategorised        
           
                if($count_cat == 0){
                    echo ' in ';
                }                       
                if($count_cat > 0){
                    echo ',';
                }
                $count_cat++;
                echo ' <a href="' . get_category_link( $category->term_id ) . '">' . $category->name.'</a> ';
            }
        }                        
    }
}