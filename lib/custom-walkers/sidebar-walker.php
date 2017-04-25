<?php

class Sidebar_Walker extends Walker_Page {
    
	public function start_el( &$output, $page, $depth = 0, $args = array(), $id = 0 ) {

		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		$css_class = array( 'page_item', 'page-item-' . $page->ID );
 
    	if ( isset( $args['pages_with_children'][ $page->ID ] ) ) {
        	$css_class[] = 'dropdown';
    	}

    	if ( ! empty( $current_page ) ) {
	        $_current_page = get_post( $current_page );
	        if ( $_current_page && in_array( $page->ID, $_current_page->ancestors ) ) {
	            $css_class[] = 'current_page_ancestor';
	        }
	        if ( $page->ID == $current_page ) {
	            $css_class[] = 'current_page_item';
	        } elseif ( $_current_page && $page->ID == $_current_page->post_parent ) {
	            $css_class[] = 'current_page_parent';
	        }
	    } elseif ( $page->ID == get_option('page_for_posts') ) {
	        $css_class[] = 'current_page_parent';
	    }

	    /**
	     * Filters the list of CSS classes to include with each page item in the list.
	     *
	     * @since 2.8.0
	     *
	     * @see wp_list_pages()
	     *
	     * @param array   $css_class    An array of CSS classes to be applied
	     *                              to each list item.
	     * @param WP_Post $page         Page data object.
	     * @param int     $depth        Depth of page, used for padding.
	     * @param array   $args         An array of arguments.
	     * @param int     $current_page ID of the current page.
	     */
	    $css_classes = implode( ' ', apply_filters( 'page_css_class', $css_class, $page, $depth, $args, $current_page ) );

		$output .= $indent . sprintf(
	        '<li class="%s"><a href="%s">%s%s%s</a>',
	        $css_classes,
	        get_permalink( $page->ID ),
	        $args['link_before'],
	        /** This filter is documented in wp-includes/post-template.php */
	        apply_filters( 'the_title', $page->post_title, $page->ID ),
	        $args['link_after']
	    );

	 }

} // end Walker class

?>