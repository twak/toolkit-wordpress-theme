<?php

class Sidebar_Walker extends Walker_Page {
    
	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		$id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args );
		$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

		if( $args->has_children ) {
			$output .= $indent . '<li class="dropdown" ' . $id . '>';
		} else {
			$output .= $indent . '<li' . $id . '>';
		}

		$atts = array();
		$atts['title']  = ! empty( $item->title )	? $item->title	: '';
		$atts['target'] = ! empty( $item->target )	? $item->target	: '';
		$atts['rel']    = ! empty( $item->xfn )		? $item->xfn	: '';
		$atts['href'] = ! empty( $item->url ) ? $item->url : '';
		
		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args );
		$attributes = '';
		foreach ( $atts as $attr => $value ) {
			if ( ! empty( $value ) ) {
				$value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
				$attributes .= ' ' . $attr . '="' . $value . '"';
			}
		}

		$item_output = $args->before;

		$item_output .= '<a href="' . get_permalink( $item->ID ) . '" '. $attributes .'>';
		$item_output .= $args->link_before;
		$item_output .= apply_filters( 'the_title', $item->post_title, $item->ID );
		$item_output .= $args->link_after;
		$item_output .= '</a>';

		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );

	 }

} // end Walker class

?>