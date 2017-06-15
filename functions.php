<?php
/*
 *  Author: Web Team - University of Leeds
 *  Custom functions, support, custom post types and more.
 */

/* theme admin */
require_once get_template_directory() . '/lib/admin.php';

/* plugin activation */
require_once get_template_directory() . '/lib/plugins.php';

/* ACF fields */
require_once get_template_directory() . '/lib/acf/theme-options.php';
require_once get_template_directory() . '/lib/acf/pages.php';
//require_once get_template_directory() . '/lib/acf/widgets-page-template.php';

/* Theme setup */
require_once get_template_directory() . '/lib/setup.php';

/* Wordpress cleanup */
require_once get_template_directory() . '/lib/cleanup.php';

/* Pluggable functions */
require_once get_template_directory() . '/lib/pluggable.php';

/* TinyMCE Viewable controls */
require_once get_template_directory() . '/lib/tinymce.php';



/* *
 * * Custom Walkers
 * */

// Navigation
require_once get_template_directory() . '/lib/navigation.php';

// Sidebar
require_once get_template_directory() . '/lib/custom-walkers/sidebar-walker.php';


/* Not sure if/where these are used... */

// Custom Excerpts
function html5wp_index($length) // Create 20 Word Callback for Index page Excerpts, call using html5wp_excerpt('html5wp_index');
{
    return 50; //used on flags
}

// Create 40 Word Callback for Custom Post Excerpts, call using html5wp_excerpt('html5wp_custom_post');
function html5wp_custom_post($length)
{
    return 20; // used on cards
}


// Create the Custom Excerpts callback
function html5wp_excerpt($length_callback = '', $more_callback = '')
{
    global $post;
    if (function_exists($length_callback)) {
        add_filter('excerpt_length', $length_callback);
    }
    if (function_exists($more_callback)) {
        add_filter('excerpt_more', $more_callback);
    }
    $output = get_the_excerpt();
    $output = apply_filters('wptexturize', $output);
    $output = apply_filters('convert_chars', $output);
    $output = '<p>' . $output . '</p>';
    echo $output;
}

/**
 * Remove the additional CSS section from the Customizer.
 */
function prefix_remove_customizer_sections( $wp_customize ) {
    $wp_customize->remove_section( 'custom_css' );
    $wp_customize->remove_section( 'colors' );
    $wp_customize->remove_section( 'header_image' );
    $wp_customize->remove_section( 'background_image' );
}
add_action( 'customize_register', 'prefix_remove_customizer_sections', 15 );

// Adds instruction text after the post title input
function emersonthis_edit_form_after_title() {
    $tip = '<strong>TIP:</strong> To create a single line break use SHIFT+RETURN. By default, RETURN creates a new paragraph.';
    echo '<p style="margin-bottom:0;">'.$tip.'</p>';
}
add_action( 'edit_form_after_title', 'emersonthis_edit_form_after_title' );


// Custom Comments Callback
function html5blankcomments($comment, $args, $depth)
{
	$GLOBALS['comment'] = $comment;
	extract($args, EXTR_SKIP);

	if ( 'div' == $args['style'] ) {
		$tag = 'div';
		$add_below = 'comment';
	} else {
		$tag = 'li';
		$add_below = 'div-comment';
	}
?>
    <!-- heads up: starting < for the html tag (li or div) in the next line: -->
    <<?php echo $tag ?> <?php comment_class(empty( $args['has_children'] ) ? '' : 'parent') ?> id="comment-<?php comment_ID() ?>">
	<?php if ( 'div' != $args['style'] ) : ?>
	<div id="div-comment-<?php comment_ID() ?>" class="comment-body">
	<?php endif; ?>
	<div class="comment-author vcard">
	<?php if ($args['avatar_size'] != 0) echo get_avatar( $comment, $args['180'] ); ?>
	<?php printf(__('<cite class="fn">%s</cite> <span class="says">says:</span>'), get_comment_author_link()) ?>
	</div>
<?php if ($comment->comment_approved == '0') : ?>
	<em class="comment-awaiting-moderation"><?php _e('Your comment is awaiting moderation.') ?></em>
	<br />
<?php endif; ?>

	<div class="comment-meta commentmetadata"><a href="<?php echo htmlspecialchars( get_comment_link( $comment->comment_ID ) ) ?>">
		<?php
			printf( __('%1$s at %2$s'), get_comment_date(),  get_comment_time()) ?></a><?php edit_comment_link(__('(Edit)'),'  ','' );
		?>
	</div>

	<?php comment_text() ?>

	<div class="reply">
	<?php comment_reply_link(array_merge( $args, array('add_below' => $add_below, 'depth' => $depth, 'max_depth' => $args['max_depth']))) ?>
	</div>
	<?php if ( 'div' != $args['style'] ) : ?>
	</div>
	<?php endif; ?>
<?php }

