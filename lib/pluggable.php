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
        if ( 'show' === get_field('sidebar_flag') ) {
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
