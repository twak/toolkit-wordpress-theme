<?php
/**
 * Class TK_Widget_TArchives
 * Custom navigation widget extends standard WordPress widget:
 * https://developer.wordpress.org/reference/classes/wp_nav_menu_widget/
 */
class TK_Widget_Archives extends WP_Widget_Archives {

	/**
	 * Outputs the content for the current Archives widget instance.
	 *
	 * @since 2.8.0
	 *
	 * @param array $args     Display arguments including 'before_title', 'after_title',
	 *                        'before_widget', and 'after_widget'.
	 * @param array $instance Settings for the current Archives widget instance.
	 */
	public function widget( $args, $instance ) {
		$title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'Archives' );

		/** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

		$c = ! empty( $instance['count'] ) ? '1' : '0';
		$d = ! empty( $instance['dropdown'] ) ? '1' : '0';

		echo $args['before_widget'];

		echo '<button class="sidebar-widget-button js-widget-toggle">' . $title . ':</button>';

		if ( $title ) {
			echo $args['before_title'] . $title . $args['after_title'];
		}

		if ( $d ) {
			$dropdown_id = "{$this->id_base}-dropdown-{$this->number}";
			?>
			<label class="screen-reader-text" for="<?php echo esc_attr( $dropdown_id ); ?>"><?php echo $title; ?></label>
			<select id="<?php echo esc_attr( $dropdown_id ); ?>" name="archive-dropdown" onchange='document.location.href=this.options[this.selectedIndex].value;'>
				<?php
				/**
				 * Filters the arguments for the Archives widget drop-down.
				 *
				 * @since 2.8.0
				 * @since 4.9.0 Added the `$instance` parameter.
				 *
				 * @see wp_get_archives()
				 *
				 * @param array $args     An array of Archives widget drop-down arguments.
				 * @param array $instance Settings for the current Archives widget instance.
				 */
				$dropdown_args = apply_filters( 'widget_archives_dropdown_args', array(
					'type'            => 'monthly',
					'format'          => 'option',
					'show_post_count' => $c
				), $instance );

				switch ( $dropdown_args['type'] ) {
					case 'yearly':
						$label = __( 'Select Year' );
						break;
					case 'monthly':
						$label = __( 'Select Month' );
						break;
					case 'daily':
						$label = __( 'Select Day' );
						break;
					case 'weekly':
						$label = __( 'Select Week' );
						break;
					default:
						$label = __( 'Select Post' );
						break;
				}
				?>

				<option value=""><?php echo esc_attr( $label ); ?></option>
				<?php wp_get_archives( $dropdown_args ); ?>

			</select>
		<?php } else { ?>
			<ul class="widget-nav js-widget-content">
				<?php
				/**
				 * Filters the arguments for the Archives widget.
				 *
				 * @since 2.8.0
				 * @since 4.9.0 Added the `$instance` parameter.
				 *
				 * @see wp_get_archives()
				 *
				 * @param array $args     An array of Archives option arguments.
				 * @param array $instance Array of settings for the current widget.
				 */
				wp_get_archives( apply_filters( 'widget_archives_args', array(
					'type'            => 'monthly',
					'show_post_count' => $c
				), $instance ) );
				?>
			</ul>
			<?php
		}

		echo $args['after_widget'];
	}

	/**
	 * Outputs the settings form for the Archives widget.
	 *
	 * @since 2.8.0
	 *
	 * @param array $instance Current settings.
	 */
	public function form( $instance ) {
		$instance = wp_parse_args( (array) $instance, array( 'title' => '', 'count' => 0, 'dropdown' => '') );
		$title = sanitize_text_field( $instance['title'] );
		?>
		<p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label> <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>" /></p>
		<?php
	}

}