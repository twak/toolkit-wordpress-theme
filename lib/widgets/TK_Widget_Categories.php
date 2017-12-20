<?php
/**
 * Class TK_Widget_Categories
 * Custom categories widget extends standard WordPress widget:
 * https://developer.wordpress.org/reference/classes/wp_widget_categories/
 */
class TK_Widget_Categories extends WP_Widget_Categories {

	/**
     * Outputs the content for the current Categories widget instance.
	 *
     * @since 2.8.0
     *
     * @staticvar bool $first_dropdown
     *
	 * @param array $args     Display arguments including 'before_title', 'after_title',
	 *                        'before_widget', and 'after_widget'.
	 * @param array $instance Settings for the current Categories widget instance.
	 */
	public function widget( $args, $instance ) {
		static $first_dropdown = true;

		$title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'Categories' );

		/** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

		$c = ! empty( $instance['count'] ) ? '1' : '0';
		$h = ! empty( $instance['hierarchical'] ) ? '1' : '0';
		$d = ! empty( $instance['dropdown'] ) ? '1' : '0';

		echo $args['before_widget'];

		if ( $title ) {
			echo '<button class="sidebar-widget-button js-widget-toggle">' . $title . ':</button>' . $args['before_title'] . $title . $args['after_title'];
		}

		$cat_args = array(
			'orderby'      => 'name',
			'show_count'   => $c,
			'hierarchical' => $h,
		);

		if ( $d ) {
			echo sprintf( '<form action="%s" method="get">', esc_url( home_url() ) );
			$dropdown_id = ( $first_dropdown ) ? 'cat' : "{$this->id_base}-dropdown-{$this->number}";
			$first_dropdown = false;

			echo '<label class="screen-reader-text" for="' . esc_attr( $dropdown_id ) . '">' . $title . '</label>';

			$cat_args['show_option_none'] = __( 'Select Category' );
			$cat_args['id'] = $dropdown_id;

			/**
			 * Filters the arguments for the Categories widget drop-down.
			 *
			 * @since 2.8.0
			 * @since 4.9.0 Added the `$instance` parameter.
			 *
			 * @see wp_dropdown_categories()
			 *
			 * @param array $cat_args An array of Categories widget drop-down arguments.
			 * @param array $instance Array of settings for the current widget.
			 */
			wp_dropdown_categories( apply_filters( 'widget_categories_dropdown_args', $cat_args, $instance ) );

			echo '</form>';
			?>

			<script type='text/javascript'>
				/* <![CDATA[ */
                (function() {
                    var dropdown = document.getElementById( "<?php echo esc_js( $dropdown_id ); ?>" );
                    function onCatChange() {
                        if ( dropdown.options[ dropdown.selectedIndex ].value > 0 ) {
                            dropdown.parentNode.submit();
                        }
                    }
                    dropdown.onchange = onCatChange;
                })();
				/* ]]> */
			</script>

			<?php
		} else {
			?>
			<ul class="sidebar-nav sidebar-nav--widget js-widget-content">
				<?php
				$cat_args['title_li'] = '';

				/**
				 * Filters the arguments for the Categories widget.
				 *
				 * @since 2.8.0
				 * @since 4.9.0 Added the `$instance` parameter.
				 *
				 * @param array $cat_args An array of Categories widget options.
				 * @param array $instance Array of settings for the current widget.
				 */
				wp_list_categories( apply_filters( 'widget_categories_args', $cat_args, $instance ) );
				?>
			</ul>
			<?php
		}

		echo $args['after_widget'];
	}

}
