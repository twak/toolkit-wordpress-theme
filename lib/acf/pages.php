<?php
/**
 * Field definitions for all pages
 */
 
if( function_exists('acf_add_local_field_group') ):

	/**
	 * Page Sidebar Toggle (Turn the sidebar on and off)
     * This will show on pages using the default template
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
	            'choices' => array (
	                'show' => 'Show Sidebar',
	                'hide' => 'Hide Sidebar',
	            ),
	            'other_choice' => 0,
	            'default_value' => 'show',
	            'layout' => 'horizontal',
                'return_format' => 'value',
	        ),
	    ),
	    'location' => array (
	        array (
	            array (
	                'param' => 'post_type',
	                'operator' => '==',
	                'value' => 'page',
	            ),
                array(
                    'param' => 'page_template',
                    'operator' => '!=',
                    'value' => 'template-widgets.php',
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
     * this will show on pages using the widgets page template, and has additional options
     * for hiding the page title and breadcrumb
     */
    acf_add_local_field_group(array(
        'key' => 'group_tk_sidebar_widgets_page_option',
        'title' => 'Sidebar Page Option',
        'fields' => array(
            array(
                'key' => 'field_tk_sidebar_widgets_page_option',
                'label' => '',
                'name' => 'sidebar_flag',
                'type' => 'radio',
                'choices' => array(
                    'show' => 'Show Sidebar',
                    'hide' => 'Hide Sidebar',
                ),
                'other_choice' => 0,
                'default_value' => 'show',
                'layout' => 'horizontal',
                'return_format' => 'value',
            ),
            array(
                'key' => 'field_tk_sidebar_widgets_page_title',
                'label' => 'Output page title',
                'name' => 'output_page_title',
                'type' => 'true_false',
                'conditional_logic' => array(
                    array(
                        array(
                            'field' => 'field_tk_sidebar_widgets_page_option',
                            'operator' => '==',
                            'value' => 'hide',
                        ),
                    ),
                ),
                'default_value' => 0,
                'ui' => 1,
            ),
            array(
                'key' => 'field_tk_sidebar_widgets_page_breadcrumb',
                'label' => 'Output breadcrumb',
                'name' => 'output_breadcrumb',
                'type' => 'true_false',
                'conditional_logic' => array(
                    array(
                        array(
                            'field' => 'field_tk_sidebar_widgets_page_option',
                            'operator' => '==',
                            'value' => 'hide',
                        ),
                    ),
                ),
                'default_value' => 0,
                'ui' => 1,
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'page',
                ),
                array(
                    'param' => 'page_template',
                    'operator' => '==',
                    'value' => 'template-widgets.php',
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