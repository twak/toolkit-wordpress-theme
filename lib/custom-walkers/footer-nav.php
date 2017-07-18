<?php

	/*
		FOOTER NAV WALKER
	*/

	class footer_navwalker extends Walker_Nav_Menu {

		public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

			$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		}

		public function display_element( $element, &$children_elements, $max_depth, $depth, $args, &$output ) {

			if ( ! $element ) {
				return;
			}

	        $id_field = $this->db_fields['id'];
	        // Display this element.
	        if ( is_object( $args[0] ) ) {
	        	$args[0]->has_children = ! empty( $children_elements[ $element->$id_field ] );
	        }
	        parent::display_element( $element, $children_elements, $max_depth, $depth, $args, $output );

		}

		public static function fallback( $args ) {
			if ( current_user_can( 'manage_options' ) ) {
				extract( $args );
				$fb_output = null;
				if ( $container ) {
					$fb_output = '<' . $container;
					if ( $container_id )
						$fb_output .= ' id="' . $container_id . '"';
					if ( $container_class )
						$fb_output .= ' class="' . $container_class . '"';
					$fb_output .= '>';
				}
				$fb_output .= '<ul';
				if ( $menu_id )
					$fb_output .= ' id="' . $menu_id . '"';
				if ( $menu_class )
					$fb_output .= ' class="' . $menu_class . '"';
				$fb_output .= '>';
				$fb_output .= '<li><a href="' . admin_url( 'nav-menus.php' ) . '">Add a menu</a></li>';
				$fb_output .= '</ul>';
				if ( $container )
					$fb_output .= '</' . $container . '>';
				echo $fb_output;
			}
		}

	}

?>