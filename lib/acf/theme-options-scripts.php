<?php
/**
 * Theme scripts fields for ACF
 * Accessible only to Network Admins
 */

if( function_exists('acf_add_local_field_group') && function_exists('acf_add_options_page') ):

	/**
	 * Theme Scripts Page
	 */
	acf_add_options_page(array( //Theme options
		'page_title'    => 'Theme Scripts',
		'menu_title'    => 'Theme Scripts',
		'menu_slug'     => 'theme-scripts-settings',
		'parent_slug'   => 'themes.php',
		'capability'    => 'manage_network',
		'redirect'      => false
	));

	/**
	 * Theme Scripts fields
	 */
	acf_add_local_field_group(array (
		'key' => 'group_tk_theme_scripts',
		'title' => 'Theme scripts (Network Admin only)',
		'location' => array (
			array (
				array (
					'param' => 'options_page',
					'operator' => '==',
					'value' => 'theme-scripts-settings',
				),
			),
		),
		'fields' => array (
			array (
				'key' => 'field_tk_theme_scripts',
				'label' => 'Scripts',
				'name' => 'tk_theme_scripts',
				'type' => 'repeater',
				'instructions' => 'Add custom scripts to this site',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array (
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'collapsed' => '',
				'min' => '',
				'max' => '',
				'layout' => 'table',
				'button_label' => 'Add Script',
				'sub_fields' => array (
					array (
						'key' => 'field_tk_theme_script',
						'label' => 'Script',
						'name' => 'tk_theme_script',
						'type' => 'textarea',
						'instructions' => 'Include &lt;script&gt;&lt;/script&gt; tags',
						'required' => 1,
						'conditional_logic' => 0,
						'wrapper' => array (
							'width' => '',
							'class' => '',
							'id' => '',
						),
						'default_value' => '',
						'placeholder' => '',
						'maxlength' => '',
						'rows' => '',
						'new_lines' => 'wpautop',
					),
					array (
						'key' => 'field_tk_theme_script_placement',
						'label' => 'Placement',
						'name' => 'tk_theme_script_placement',
						'type' => 'radio',
						'instructions' => '',
						'required' => 1,
						'conditional_logic' => 0,
						'wrapper' => array (
							'width' => '',
							'class' => '',
							'id' => '',
						),
						'choices' => array (
							'wp_footer' => 'wp_footer',
							'wp_head' => 'wp_head',
						),
						'allow_null' => 0,
						'other_choice' => 0,
						'save_other_choice' => 0,
						'default_value' => '',
						'layout' => 'vertical',
						'return_format' => 'value',
					),
				),
			),
		),
	));

endif;