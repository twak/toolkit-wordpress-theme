<?php

if( ! current_user_can( 'manage_options' ) ) {

	// Remove 'Standard' TinyMCE Buttons
	function standard_tinymce_buttons( $buttons ) {
		//Remove the text color selector
		$remove = array( 'alignleft', 'aligncenter', 'alignright', 'wp_more', 'wp_adv' );

		return array_diff( $buttons, $remove );
	 }
	add_filter( 'mce_buttons', 'standard_tinymce_buttons' );

	// Remove 'Advanced' TinyMCE Buttons
	function advanced_tinymce_buttons( $buttons ) {
		//Remove the text color selector
		$remove = array( 'formatselect', 'forecolor', 'outdent', 'indent', 'wp_help', 'underline', 'justifyfull', 'charmap', 'undo', 'redo', 'justifyfull', 'strikethrough', 'pastetext', 'pasteword', 'removeformat', 'separator', 'hr', 'pastetext', 'pasteword' );

		return array_diff( $buttons, $remove );
	 }
	add_filter( 'mce_buttons_2', 'advanced_tinymce_buttons' );

	// Move the remaining TinyMCE buttons from 2nd row to top row
	function move_mce_buttons_to_top( $buttons ) {    

	    $buttons[] = 'hr, removeformat';

	    return $buttons;
	}
	add_filter( 'mce_buttons', 'move_mce_buttons_to_top' );

	// Hide editor tabs (no tabs needed since TinyMCE is the only one available)
	function hide_editor_tabs() {
		global $pagenow;

		// Only output the CSS if we're on the edit post or add new post screens.
		if ( ! ( 'post.php' == $pagenow || 'post-new.php' == $pagenow ) ) {
			return;
		}

	?>
	<style>
	    .wp-editor-tabs {
	        display: none;
	    }
	</style>
	<?php

	}
	//add_action( 'admin_head', 'hide_editor_tabs' );

	// Force TinyMCE to be the default editor
	function force_default_editor() {
	    return 'tinymce';
	}
	add_filter( 'wp_default_editor', 'force_default_editor' );

}

/**
 * Add TinyMCE Formats
 **/

function tk_custom_editor_formats($buttons) {
	array_unshift($buttons, 'styleselect');
	return $buttons;
}
add_filter('mce_buttons', 'tk_custom_editor_formats');

function tk_custom_editor_styles( $init_array ) {

	$style_formats = array(
		array(
			'title' => 'Summary',
			'block' => 'span',
			'classes' => 'summary',
			'wrapper' => true,
		),
		array(
			'title' => 'Drop caps',
			'inline' => 'span',
			'classes' => 'dropcaps',
			'wrapper' => true,
		),
		array(
			'title' => 'Leading paragraph',
			'block' => 'span',
			'classes' => 'lead',
			'wrapper' => true,
		),
//		array(
//			'title' => 'Call to action (CTA) link',
//			'inline' => 'a',
//			'classes' => 'btn btn-primary',
//		),
	);
	$init_array['style_formats'] = json_encode( $style_formats );

	return $init_array;

}
add_filter( 'tiny_mce_before_init', 'tk_custom_editor_styles' );

add_editor_style( get_template_directory_uri() . '/css/editor-style.css' );
