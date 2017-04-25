<?php
/**
 * pluggable functions
 */

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
		$description = esc_attr( get_the_excerpt() );

		// this allows child themes to alter the array of icons for social sharing
		$social_links_fmt = array(
			'twitter' => '<a href="#" data-type="twitter" data-url="%1$s" data-description="%2$s" data-via="twitter" class="js-pretty-social"><span class="icon-font-text">Twitter</span><span class="tk-icon-social-twitter"></span></a>',
			'facebook' => '<a href="#" data-type="facebook" data-url="%1$s" data-title="%2$s" data-description="%3$s" data-media="%4$s" class="js-pretty-social"><span class="icon-font-text">Facebook</span><span class="tk-icon-social-facebook"></span></a>',
			'google' => '<a href="#" data-type="googleplus" data-url="%1$s" data-description="%2$s" class="js-pretty-social"><span class="icon-font-text">Google+</span><span class="tk-icon-social-google"></span></a>',
			'linkedin' => '<a href="#" data-type="linkedin" data-url="%1$s" data-title="%2$s" data-description="%3$s" data-via="linkedin" data-media="%4$s" class="js-pretty-social"><span class="icon-font-text">Linkedin</span><span class="tk-icon-social-linkedin"></span></a>'
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
		printf('</div><hr></div>', $hr );
	}
}
