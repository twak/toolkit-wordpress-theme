<?php

class Sidebar_Walker extends Walker_Nav_Menu {
    
	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

		$class_names = $value = '';
		$classes = '';
		$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args ) );

		if ( $args->has_children ) {
			$class_names .= 'dropdown';
		}
		
		if ( $item->current == true ) {
			$class_names .= ' active';
		}

		$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';
		$id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args );
		$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

		$output .= $indent . '<li' . $id . $value . $class_names .'>';

		$attributes  = ! empty( $item->attr_title ) ? ' title="'  . esc_attr( $item->attr_title ) .'"' : '';
        $attributes .= ! empty( $item->target )     ? ' target="' . esc_attr( $item->target     ) .'"' : '';
        $attributes .= ! empty( $item->xfn )        ? ' rel="'    . esc_attr( $item->xfn        ) .'"' : '';
        $attributes .= ! empty( $item->url )        ? ' href="'   . '#' .'"' : '';

		$item_output = $args->before;

		$item_output .= '<a href="' . get_permalink( $item->ID ) . '" '. $attributes .'>';
		$item_output .= $args->link_before;
		$item_output .= $args->link_after;
		$item_output .= '</a>';

		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );

	 }

} // end Walker class

?>