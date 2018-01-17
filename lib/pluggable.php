<?php
/**
 * pluggable functions
 */


/**
 * 20 Word Callback for Custom Post Excerpts
 * call using tk_get_excerpt('tk_card_length');
 */
if ( ! function_exists( 'tk_card_length' ) ) {
    function tk_card_length( $length ) {
        return 20;
    }
}
/**
 * 20 Word Callback for Custom Post Excerpts
 * call using tk_get_excerpt('tk_index_length');
 */
if ( ! function_exists( 'tk_index_length' ) ) {
    function tk_index_length( $length ) {
        return 50;
    }
}

/**
 * Custom Excerpts callback
 * @return string HTML excerpt
 */
if ( ! function_exists( 'tk_get_excerpt' ) ) {
    function tk_get_excerpt($length_callback = '', $more_callback = '')
    {
        global $post;
        if (function_exists($length_callback)) {
            add_filter('excerpt_length', $length_callback);
        }
        if (function_exists($more_callback)) {
            add_filter('excerpt_more', $more_callback);
        }
        $show = get_field( 'tk_post_page_settings_excerpt', 'option' );
        if ( $post->post_type == 'post' && 'full' === $show ) {
            $output = apply_filters( 'the_content', get_the_content('Continue reading...') );
        } else {
            $output = get_the_excerpt();
            $output = apply_filters('wptexturize', $output);
            $output = apply_filters('convert_chars', $output);
            $output = '<p>' . $output . '</p>';
        }
        return $output;
    }
}
/**
 * this is used to determine whether the layout is full width, by retrieving the tk_theme_layout option
 * @return boolean
 */
if ( ! function_exists( 'tk_full_width' ) ) {
	function tk_full_width()
	{
        if ( 'full_width' === get_field('tk_theme_layout', 'option' ) ) {
        	return true;
        }
        return false;
	}
}

/**
 * this is used to determine whether the sidebar is shown, by retrieving the sidebar_flag option
 * @return boolean
 */
if ( ! function_exists( 'tk_sidebar' ) ) {
	function tk_sidebar()
	{
        $flag = get_field('sidebar_flag');
        if ( ! $flag || 'show' === get_field('sidebar_flag') ) {
        	return true;
        } 
        return false;
    }
}

/**
 * this is used to retrieve the theme colour option
 * @return string
 */
if ( ! function_exists( 'tk_colour' ) ) {
	function tk_colour()
	{
		$colour = 'default';
		if ( get_field( "tk_theme_color", "option" ) ) {
			$colour = get_field( "tk_theme_color", "option" );
		}
		return $colour;
	}
}

/**
 * this is used to retrieve the google API key
 * @return string
 */
if ( ! function_exists( 'tk_get_google_api_key' ) ) {
    function tk_get_google_api_key()
    {
        $api_key = false;
        if ( function_exists( 'get_field' ) ) {
            $api_key = get_field( 'tk_google_api_key', 'option' );
        }
        if ( ! $api_key ) {
            $api_key = 'AIzaSyBBUKSi1deZSSGaOvXaR-3p4pkwHzZO0s0';
        }
        return $api_key;
    }
}

/**
 * this outputs the social sharing icons
 * @param string suffix for contaner ID attribute (needs different ones for multiple instances)
 * @return void
 */
if ( ! function_exists( 'tk_social_links' ) ) {
	function tk_social_links( $suffix = '', $rule = 'below' )
	{
		// get selected social media links from options
		$social_links = get_field('tk_social_media_sharing_links', 'option');
		if ( ! $social_links ) {
			// none selected (maybe theme options not saved?) use defaults
			$social_links = array('twitter','facebook','google','linkedin');
		} elseif ( in_array('none', $social_links) ) {
			return '';
		}
		$url = get_permalink();
		$title = esc_attr( get_the_title() );
		$media = ( has_post_thumbnail() ) ? get_the_post_thumbnail_url(): '';
		$description = esc_attr( tk_get_excerpt('tk_card_length') );

		// this allows child themes to alter the array of icons for social sharing
		$social_links_fmt = array(
			'twitter' => '<a href="#" data-type="twitter" data-url="%1$s" data-description="%2$s" data-via="twitter" class="js-pretty-social"><span class="icon-font-text">Twitter</span><span class="tk-icon-social-twitter"></span></a>',
			'facebook' => '<a href="#" data-type="facebook" data-url="%1$s" data-title="%2$s" data-media="%4$s" class="js-pretty-social"><span class="icon-font-text">Facebook</span><span class="tk-icon-social-facebook"></span></a>',
			'google' => '<a href="#" data-type="googleplus" data-url="%1$s" data-description="%2$s" class="js-pretty-social"><span class="icon-font-text">Google+</span><span class="tk-icon-social-google"></span></a>',
			'linkedin' => '<a href="#" data-type="linkedin" data-url="%1$s" data-title="%2$s" data-via="linkedin" data-media="%4$s" class="js-pretty-social"><span class="icon-font-text">Linkedin</span><span class="tk-icon-social-linkedin"></span></a>'
		);

		// start output
		$hr = ( $rule === 'above' || $rule === 'both' ) ? '<hr>': '';
		printf('<div class="social-share" id="social-share%s">%s', $suffix, $hr );
		printf('<button class="btn-icon social-toggle" data-toggle="toggle" data-target="#social-share%s">Share</button>', $suffix );
		print('<div class="social-links">');
		foreach( $social_links as $link ) {
			printf( $social_links_fmt[$link], $url, $title, $description, $media );
		}
		$hr = ( $rule === 'below' || $rule === 'both' ) ? '<hr>': '';
		printf('</div>%s</div>', $hr );
	}
}

/**
 * $POST CATEGORIES - Spits out lists of categories of post (used in the loop)
 */

if ( !function_exists( 'tk_post_categories' ) ) {

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

/**
 * whether or not to display featured images on the single post template
 */
if ( !function_exists( 'tk_display_featured_image' ) ) {

    function tk_display_featured_image( $post_id = false )
    {
        if ( false === $post_id ) {
            $post_id = get_queried_object_id();
        }
        if ( class_exists( 'tk_media' ) && method_exists('tk_media', 'show_featured_image' ) ) {
            return tk_media::show_featured_image( $post_id );
        } else {
            $field_value = get_post_meta( $post_id, 'tk_show_featured_image', true );
            // make sure the return value is numeric rather than boolean
            return ($field_value === "1")? true: false;
        }
    }
}
