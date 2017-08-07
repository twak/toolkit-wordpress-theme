<?php
/**
 * Field definitions for all pages
 */
 
if( function_exists('acf_add_local_field_group') ):

	/**
	 * Page Sidebar Toggle (Turn the sidebar on and off)
	 */
	acf_add_local_field_group(array (
	    'key' => 'group_tk_sidebar_page_option',
	    'title' => 'Sidebar Page Option',
	    'fields' => array (
	        array (
	            'key' => 'field_tk_sidebar_page_option',
	            'label' => '',
	            'name' => 'sidebar_flag',
	            'type' => 'radio',
	            'instructions' => '',
	            'required' => 0,
	            'conditional_logic' => 0,
	            'wrapper' => array (
	                'width' => '',
	                'class' => '',
	                'id' => '',
	            ),
	            'choices' => array (
	                'show' => 'Show Sidebar',
	                'hide' => 'Hide Sidebar',
	            ),
	            'other_choice' => 0,
	            'save_other_choice' => 0,
	            'default_value' => 'show',
	            'layout' => 'horizontal',
	        ),
	    ),
	    'location' => array (
	        array (
	            array (
	                'param' => 'post_type',
	                'operator' => '==',
	                'value' => 'page',
	            ),
	        ),
	    ),
	    'menu_order' => 2,
	    'position' => 'side',
	    'style' => 'default',
	    'label_placement' => 'top',
	    'instruction_placement' => 'label',
	    'hide_on_screen' => '',
	    'active' => 1,
	    'description' => '',
	));

	/**
	 * Related items selector
	 */

	acf_add_local_field_group(array (
		'key' => 'group_tk_page_related',
		'title' => 'Related content',
		'fields' => array (
			array (
				'key' => 'field_tk_page_related_items',
				'label' => 'Related items',
				'name' => 'related_items',
				'type' => 'repeater',
				'instructions' => '',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array (
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'collapsed' => '',
				'min' => 0,
				'max' => 0,
				'layout' => 'block',
				'button_label' => 'Add related item',
				'sub_fields' => array (
					array (
						'key' => 'field_tk_page_related_item',
						'label' => 'Related item',
						'name' => 'related_item',
						'type' => 'post_object',
						'instructions' => '',
						'required' => 0,
						'conditional_logic' => 0,
						'wrapper' => array (
							'width' => '',
							'class' => '',
							'id' => '',
						),
						'post_type' => array (
						),
						'taxonomy' => array (
						),
						'allow_null' => 0,
						'multiple' => 0,
						'return_format' => 'id',
						'ui' => 1,
					),
				),
			),
		),
		'location' => array (
			array (
				array (
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'page',
				),
			),
		),
		'menu_order' => 0,
		'position' => 'normal',
		'style' => 'default',
		'label_placement' => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen' => '',
		'active' => 1,
		'description' => '',
	));
endif;