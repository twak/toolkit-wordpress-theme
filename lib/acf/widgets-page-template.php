<?php
/**
 * Field definitions for widget page template
 */

if( function_exists('acf_add_local_field_group') ):

	/**
	 * Pinned widget for template widgets
	 */
	acf_add_local_field_group(array (
	    'key' => 'group_tk_pinned_widget',
	    'title' => 'Pinned Widget',
	    'fields' => array (
	        array (
	            'key' => 'field_tk_pinned_widget',
	            'name' => 'widget_top',
	            'type' => 'checkbox',
	            'instructions' => 'Pin first widget to the top when the page has a sidebar',
	            'choices' => array (
	                'active' => 'Active',
	            ),
	            'layout' => 'vertical',
	            'toggle' => 0,
	            'return_format' => 'value',
	        ),
	    ),
	    'location' => array (
	        array (
	            array (
	                'param' => 'page_template',
	                'operator' => '==',
	                'value' => 'template-widgets.php',
	            ),
	        ),
	    ),
	    'menu_order' => 1,
	    'position' => 'side',
	    'style' => 'default',
	    'label_placement' => 'top',
	    'instruction_placement' => 'label',
	    'hide_on_screen' => '',
	    'active' => 1,
	    'description' => '',
	));

	/**
	 * Flexible content fields for page content widgets
	 */
	acf_add_local_field_group(array (
		'key' => 'group_5731f1ca4cc04',
		'title' => 'Page Widgets',
		'fields' => array (
			array (
				'key' => 'field_5731dd3c55d96',
				'label' => 'Widgets',
				'name' => 'widgets',
				'type' => 'flexible_content',
				'instructions' => 'Add any combination of widgets, drag and drop.',
				'button_label' => 'Add Widget',
				'layouts' => array (
					array (
						'key' => '5731f1ca59a31',
						'name' => 'content_widget',
						'label' => 'Content Widget',
						'display' => 'row',
						'sub_fields' => array (
							array (
								'key' => 'field_57eb8a7f1242e',
								'label' => 'Content',
								'type' => 'tab',
								'placement' => 'top',
							),
							array (
								'key' => 'field_5731dd5f55d97',
								'label' => 'Heading',
								'name' => 'content_widget_heading',
								'type' => 'text',
								'formatting' => 'html',
							),
							array (
								'key' => 'field_5731e48e8429b',
								'label' => 'Content',
								'name' => 'content_widget_content',
								'type' => 'wysiwyg',
								'tabs' => 'all',
								'toolbar' => 'full',
								'media_upload' => 1,
							),
							array (
								'key' => 'field_57eb8a911242f',
								'label' => 'Appearance',
								'type' => 'tab',
								'placement' => 'top',
							),
							array (
								'key' => 'field_57eb8aa412430',
								'label' => 'Background',
								'name' => 'content_widget_background',
								'type' => 'select',
								'choices' => array (
									'white' => 'White',
									'grey' => 'Grey',
								),
								'default_value' => array (
									0 => 'white',
								),
								'return_format' => 'value',
							),
						),
					),
					array (
						'key' => '57e253c8bc11e',
						'name' => 'featured_content_widget',
						'label' => 'Featured Content Widget',
						'display' => 'row',
						'sub_fields' => array (
							array (
								'key' => 'field_57eb8a3358157',
								'label' => 'Content',
								'type' => 'tab',
								'placement' => 'top',
							),
							array (
								'key' => 'field_57e253c8bc11f',
								'label' => 'Heading',
								'name' => 'featured_content_widget_heading',
								'type' => 'text',
							),
							array (
								'key' => 'field_57e253f1bc121',
								'label' => 'Image',
								'name' => 'featured_content_widget_image',
								'type' => 'image',
								'return_format' => 'url',
								'preview_size' => 'thumbnail',
								'library' => 'all',
							),
							array (
								'key' => 'field_57e253c8bc120',
								'label' => 'Content',
								'name' => 'featured_content_widget_content',
								'type' => 'wysiwyg',
								'instructions' => 'Recommended 75 characters or less',
								'tabs' => 'all',
								'toolbar' => 'full',
							),
							array (
								'key' => 'field_57ebb30e4c0fb',
								'label' => 'Link',
								'name' => 'featured_content_widget_link_option',
								'type' => 'radio',
								'layout' => 'horizontal',
								'choices' => array (
									'no-link' => 'No link',
									'internal' => 'Internal link',
									'external' => 'External link',
								),
								'return_format' => 'value',
							),
							array (
								'key' => 'field_57e2560ea4dd8',
								'label' => 'Internal link',
								'name' => 'featured_content_widget_internal_link',
								'type' => 'page_link',
								'conditional_logic' => array (
									array (
										array (
											'field' => 'field_57ebb30e4c0fb',
											'operator' => '==',
											'value' => 'internal',
										),
									),
								),
								'allow_archives' => 1,
							),
							array (
								'key' => 'field_57ebb3754c0fc',
								'label' => 'External link',
								'name' => 'featured_content_widget_external_link',
								'type' => 'url',
								'conditional_logic' => array (
									array (
										array (
											'field' => 'field_57ebb30e4c0fb',
											'operator' => '==',
											'value' => 'external',
										),
									),
								),
							),
							array (
								'key' => 'field_57eb8a0358156',
								'label' => 'Appearance',
								'type' => 'tab',
								'placement' => 'top',
							),
							array (
								'key' => 'field_57e2878185f7e',
								'label' => 'Background',
								'name' => 'featured_content_widget_background',
								'type' => 'select',
								'choices' => array (
									'white' => 'White',
									'grey' => 'Grey',
								),
								'return_format' => 'value',
							),
						),
					),
					array (
						'key' => '5731f1ca5c423',
						'name' => 'news_events_widget',
						'label' => 'News, Events and Posts Widget',
						'display' => 'row',
						'sub_fields' => array (
							array (
								'key' => 'field_5731ddef4b1d4',
								'label' => 'Options',
								'name' => 'news_events_widget_options',
								'type' => 'checkbox',
								'layout' => 'horizontal',
								'choices' => array (
									'news' => 'Show News',
									'events' => 'Show Events',
									'posts' => 'Show Blog Posts',
								),
								'return_format' => 'value',
							),
						),
					),
					array (
						'key' => '5731fc59bed06',
						'name' => 'banner_widget',
						'label' => 'Banner Widget',
						'display' => 'block',
						'sub_fields' => array (
							array (
								'key' => 'field_57e9291fb856c',
								'label' => 'Content',
								'type' => 'tab',
								'placement' => 'top',
							),
							array (
								'key' => 'field_5731fc66bed07',
								'label' => 'Slides',
								'name' => 'banner_widget_slide',
								'type' => 'repeater',
								'min' => 0,
								'max' => 4,
								'layout' => 'row',
								'button_label' => 'Add Slide',
								'collapsed' => '',
								'sub_fields' => array (
									array (
										'key' => 'field_5731fce9cc84f',
										'label' => 'Image',
										'name' => 'banner_widget_slide_image',
										'type' => 'image',
										'return_format' => 'array',
										'preview_size' => 'thumbnail',
										'library' => 'all',
									),
									array (
										'key' => 'field_5731fd2fcc850',
										'label' => 'Title',
										'name' => 'banner_widget_slide_title',
										'type' => 'text',
									),
									array (
										'key' => 'field_5731fd41cc851',
										'label' => 'Lead sentence',
										'name' => 'banner_widget_slide_lead',
										'type' => 'textarea',
										'new_lines' => 'br',
									),
									array (
										'key' => 'field_5731fd56cc852',
										'label' => 'Link',
										'name' => 'banner_widget_slide_link',
										'type' => 'radio',
										'layout' => 'horizontal',
										'choices' => array (
											'no-link' => 'No Link',
											'internal' => 'Internal Link',
											'external' => 'External Link',
										),
										'return_format' => 'value',
									),
									array (
										'key' => 'field_57fbb0970a814',
										'label' => 'Link text',
										'name' => 'banner_widget_slide_link_text',
										'type' => 'text',
										'conditional_logic' => array (
											array (
												array (
													'field' => 'field_5731fd56cc852',
													'operator' => '!=',
													'value' => 'no-link',
												),
											),
										),
										'default_value' => 'More',
									),
									array (
										'key' => 'field_5731feed9fe5c',
										'label' => 'Link internal',
										'name' => 'banner_widget_slide_link_internal',
										'type' => 'page_link',
										'conditional_logic' => array (
											array (
												array (
													'field' => 'field_5731fd56cc852',
													'operator' => '==',
													'value' => 'internal',
												),
											),
										),
										'allow_archives' => 1,
									),
									array (
										'key' => 'field_5731ff1a9fe5d',
										'label' => 'Link external',
										'name' => 'banner_widget_slide_link_external',
										'type' => 'url',
										'instructions' => 'Add the full url including \'http://\'.',
										'conditional_logic' => array (
											array (
												array (
													'field' => 'field_5731fd56cc852',
													'operator' => '==',
													'value' => 'external',
												),
											),
										),
									),
									array (
										'key' => 'field_5733475c65383',
										'label' => 'Tab title',
										'name' => 'banner_widget_slide_tab_title',
										'type' => 'text',
										'default_value' => 'Tab',
									),
								),
							),
							array (
								'key' => 'field_57e92930b856d',
								'label' => 'Appearance',
								'type' => 'tab',
								'placement' => 'top',
							),
							array (
								'key' => 'field_5746d7a18b189',
								'label' => 'Banner size',
								'name' => 'banner_widget_size',
								'type' => 'select',
								'choices' => array (
									'default' => 'Default banner',
									'large' => 'Large banner',
									'small' => 'Small banner',
								),
								'return_format' => 'value',
							),
						),
					),
					array (
						'key' => '5732003d5056b',
						'name' => 'cards_widget',
						'label' => 'Cards Widget',
						'display' => 'block',
						'sub_fields' => array (
							array (
								'key' => 'field_57e9211d9e8cb',
								'label' => 'Content',
								'type' => 'tab',
								'placement' => 'top',
							),
							array (
								'key' => 'field_57e3a0cc85c29',
								'label' => 'Title',
								'name' => 'cards_widget_title',
								'type' => 'text',
								'instructions' => 'Add a title and lead sentence to the top of the card widget (optional)',
							),
							array (
								'key' => 'field_57e39daff4290',
								'label' => 'Lead',
								'name' => 'cards_widget_lead',
								'type' => 'textarea',
								'new_lines' => 'br',
							),
							array (
								'key' => 'field_573200555056c',
								'label' => 'Cards',
								'name' => 'cards_widget_card',
								'type' => 'repeater',
								'instructions' => 'Build this widget by adding card',
								'layout' => 'row',
								'button_label' => 'Add Card',
								'collapsed' => 'field_573d8a033e39e',
								'sub_fields' => array (
									array (
										'key' => 'field_5732006e5056d',
										'label' => 'Title',
										'name' => 'cards_widget_card_title',
										'type' => 'text',
									),
									array (
										'key' => 'field_573d8a033e39e',
										'label' => 'Image',
										'name' => 'cards_widget_card_image',
										'type' => 'image',
										'return_format' => 'url',
										'preview_size' => 'thumbnail',
										'library' => 'all',
									),
									array (
										'key' => 'field_573d8a2e3e39f',
										'label' => 'Content',
										'name' => 'cards_widget_card_content',
										'type' => 'wysiwyg',
										'tabs' => 'all',
										'toolbar' => 'basic',
										'media_upload' => 0,
									),
									array (
										'key' => 'field_57e4f1aedf1e4',
										'label' => 'Link option',
										'name' => 'cards_widget_card_link_option',
										'type' => 'radio',
										'layout' => 'horizontal',
										'choices' => array (
											'no-link' => 'No link',
											'internal' => 'Internal link',
											'external' => 'External link',
										),
										'return_format' => 'value',
									),
									array (
										'key' => 'field_57e39dbcf4291',
										'label' => 'Internal link',
										'name' => 'cards_widget_card_internal_link',
										'type' => 'page_link',
										'conditional_logic' => array (
											array (
												array (
													'field' => 'field_57e4f1aedf1e4',
													'operator' => '==',
													'value' => 'internal',
												),
											),
										),
										'allow_archives' => 1,
									),
									array (
										'key' => 'field_57e4f2ae0af53',
										'label' => 'External link',
										'name' => 'cards_widget_card_external_link',
										'type' => 'url',
										'conditional_logic' => array (
											array (
												array (
													'field' => 'field_57e4f1aedf1e4',
													'operator' => '==',
													'value' => 'external',
												),
											),
										),
									),
								),
							),
							array (
								'key' => 'field_57e9206cc346d',
								'label' => 'Appearance',
								'type' => 'tab',
								'placement' => 'top',
							),
							array (
								'key' => 'field_57e3af345ae0c',
								'label' => 'Layout',
								'name' => 'cards_widget_layout',
								'type' => 'radio',
								'layout' => 'horizontal',
								'choices' => array (
									'flat' => 'Flat cards',
									'stacked' => 'Stacked cards',
								),
								'return_format' => 'value',
							),
							array (
								'key' => 'field_57e3f310e40a7',
								'label' => 'Columns',
								'name' => 'cards_widget_columns',
								'type' => 'radio',
								'conditional_logic' => array (
									array (
										array (
											'field' => 'field_57e3af345ae0c',
											'operator' => '==',
											'value' => 'stacked',
										),
									),
								),
								'layout' => 'horizontal',
								'choices' => array (
									2 => '2 columns',
									3 => '3 columns',
									4 => '4 columns',
								),
								'return_format' => 'value',
							),
							array (
								'key' => 'field_57e91fac7b696',
								'label' => 'Background colour',
								'name' => 'cards_widget_background',
								'type' => 'radio',
								'layout' => 'horizontal',
								'choices' => array (
									'white' => 'White',
									'grey' => 'Grey',
								),
								'return_format' => 'value',
							),
							array (
								'key' => 'field_57e930235de2b',
								'label' => 'Image proportion',
								'name' => 'cards_widget_image_proportion',
								'type' => 'radio',
								'layout' => 'horizontal',
								'choices' => array (
									'rectangle' => 'Rectangle',
									'square' => 'Square',
								),
								'return_format' => 'value',
							),
						),
					),
					array (
						'key' => '58ecf4772cc35',
						'name' => 'accordion_widget',
						'label' => 'Accordion Widget',
						'display' => 'block',
						'sub_fields' => array (
							array (
								'key' => 'field_58ecf4802cc36',
								'label' => 'Accordion Item',
								'name' => 'accordion_item',
								'type' => 'repeater',
								'instructions' => 'Add an accordion item to build this widget',
								'layout' => 'row',
								'button_label' => 'Add Accordion Item',
								'sub_fields' => array (
									array (
										'key' => 'field_58ecf4ac2cc37',
										'label' => 'title',
										'name' => 'accordion_title',
										'type' => 'text',
									),
									array (
										'key' => 'field_58ecf4bb2cc38',
										'label' => 'content',
										'name' => 'accordion_content',
										'type' => 'wysiwyg',
										'tabs' => 'all',
										'toolbar' => 'full',
										'media_upload' => 1,
									),
								),
							),
						),
					),
				),
			),
		),
		'location' => array (
			array (
				array (
					'param' => 'page_template',
					'operator' => '==',
					'value' => 'template-widgets.php',
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
	));


endif;