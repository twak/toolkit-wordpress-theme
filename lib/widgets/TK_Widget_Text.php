<?php
/**
 * Class TK_Widget_Text
 * Custom navigation widget extends standard WordPress widget:
 * https://developer.wordpress.org/reference/classes/wp_nav_menu_widget/
 */
class TK_Widget_Text extends WP_Widget_Text {

	/**
	 * Outputs the content for the current Text widget instance.
	 *
	 * @since 2.8.0
	 *
	 * @global WP_Post $post
	 *
	 * @param array $args     Display arguments including 'before_title', 'after_title',
	 *                        'before_widget', and 'after_widget'.
	 * @param array $instance Settings for the current Text widget instance.
	 */
	public function widget( $args, $instance ) {
		global $post;

		$title = ! empty( $instance['title'] ) ? $instance['title'] : '';

		/** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

		$text = ! empty( $instance['text'] ) ? $instance['text'] : '';
		$is_visual_text_widget = ( ! empty( $instance['visual'] ) && ! empty( $instance['filter'] ) );

		// In 4.8.0 only, visual Text widgets get filter=content, without visual prop; upgrade instance props just-in-time.
		if ( ! $is_visual_text_widget ) {
			$is_visual_text_widget = ( isset( $instance['filter'] ) && 'content' === $instance['filter'] );
		}
		if ( $is_visual_text_widget ) {
			$instance['filter'] = true;
			$instance['visual'] = true;
		}

		/*
		 * Suspend legacy plugin-supplied do_shortcode() for 'widget_text' filter for the visual Text widget to prevent
		 * shortcodes being processed twice. Now do_shortcode() is added to the 'widget_text_content' filter in core itself
		 * and it applies after wpautop() to prevent corrupting HTML output added by the shortcode. When do_shortcode() is
		 * added to 'widget_text_content' then do_shortcode() will be manually called when in legacy mode as well.
		 */
		$widget_text_do_shortcode_priority = has_filter( 'widget_text', 'do_shortcode' );
		$should_suspend_legacy_shortcode_support = ( $is_visual_text_widget && false !== $widget_text_do_shortcode_priority );
		if ( $should_suspend_legacy_shortcode_support ) {
			remove_filter( 'widget_text', 'do_shortcode', $widget_text_do_shortcode_priority );
		}

		// Override global $post so filters (and shortcodes) apply in a consistent context.
		$original_post = $post;
		if ( is_singular() ) {
			// Make sure post is always the queried object on singular queries (not from another sub-query that failed to clean up the global $post).
			$post = get_queried_object();
		} else {
			// Nullify the $post global during widget rendering to prevent shortcodes from running with the unexpected context on archive queries.
			$post = null;
		}

		// Prevent dumping out all attachments from the media library.
		add_filter( 'shortcode_atts_gallery', array( $this, '_filter_gallery_shortcode_attrs' ) );

		/**
		 * Filters the content of the Text widget.
		 *
		 * @since 2.3.0
		 * @since 4.4.0 Added the `$this` parameter.
		 * @since 4.8.1 The `$this` param may now be a `WP_Widget_Custom_HTML` object in addition to a `WP_Widget_Text` object.
		 *
		 * @param string                               $text     The widget content.
		 * @param array                                $instance Array of settings for the current widget.
		 * @param WP_Widget_Text|WP_Widget_Custom_HTML $this     Current Text widget instance.
		 */
		$text = apply_filters( 'widget_text', $text, $instance, $this );

		if ( $is_visual_text_widget ) {

			/**
			 * Filters the content of the Text widget to apply changes expected from the visual (TinyMCE) editor.
			 *
			 * By default a subset of the_content filters are applied, including wpautop and wptexturize.
			 *
			 * @since 4.8.0
			 *
			 * @param string         $text     The widget content.
			 * @param array          $instance Array of settings for the current widget.
			 * @param WP_Widget_Text $this     Current Text widget instance.
			 */
			$text = apply_filters( 'widget_text_content', $text, $instance, $this );
		} else {
			// Now in legacy mode, add paragraphs and line breaks when checkbox is checked.
			if ( ! empty( $instance['filter'] ) ) {
				$text = wpautop( $text );
			}

			/*
			 * Manually do shortcodes on the content when the core-added filter is present. It is added by default
			 * in core by adding do_shortcode() to the 'widget_text_content' filter to apply after wpautop().
			 * Since the legacy Text widget runs wpautop() after 'widget_text' filters are applied, the widget in
			 * legacy mode here manually applies do_shortcode() on the content unless the default
			 * core filter for 'widget_text_content' has been removed, or if do_shortcode() has already
			 * been applied via a plugin adding do_shortcode() to 'widget_text' filters.
			 */
			if ( has_filter( 'widget_text_content', 'do_shortcode' ) && ! $widget_text_do_shortcode_priority ) {
				if ( ! empty( $instance['filter'] ) ) {
					$text = shortcode_unautop( $text );
				}
				$text = do_shortcode( $text );
			}
		}

		// Restore post global.
		$post = $original_post;
		remove_filter( 'shortcode_atts_gallery', array( $this, '_filter_gallery_shortcode_attrs' ) );

		// Undo suspension of legacy plugin-supplied shortcode handling.
		if ( $should_suspend_legacy_shortcode_support ) {
			add_filter( 'widget_text', 'do_shortcode', $widget_text_do_shortcode_priority );
		}

		echo $args['before_widget'];

		echo '<button class="sidebar-widget-button js-widget-toggle">' . $title . ':</button>';

		if ( ! empty( $title ) ) {
			echo $args['before_title'] . $title . $args['after_title'];
		}

		$text = preg_replace_callback( '#<(video|iframe|object|embed)\s[^>]*>#i', array( $this, 'inject_video_max_width_style' ), $text );

		?>
		<div class="textwidget"><?php echo $text; ?></div>
		<?php
		echo $args['after_widget'];
	}

}