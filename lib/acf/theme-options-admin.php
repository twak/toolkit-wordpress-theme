<?php
/**
 * Fields for ACF Accessible only to Network Admins
 */

add_action( 'acf/init', 'tk_add_filter_theme_option_scripts', 1 );
function tk_add_filter_theme_option_scripts()
{
    add_filter('tk_theme_options_fields', 'tk_add_theme_option_scripts', 10, 1 );
}
function tk_add_theme_option_scripts( $fields ) {
    if ( is_super_admin() ) {
        array_push( $fields, array (
            'key' => 'field_tk_tab_network_admin',
            'label' => 'Admin',
            'type' => 'tab',
        ) );         
        array_push( $fields, array (
            'key' => 'field_tk_theme_scripts',
            'label' => 'Scripts',
            'name' => 'tk_theme_scripts',
            'type' => 'repeater',
            'instructions' => 'Add custom scripts to this site',
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
                ),
                array (
                    'key' => 'field_tk_theme_script_placement',
                    'label' => 'Placement',
                    'name' => 'tk_theme_script_placement',
                    'type' => 'radio',
                    'required' => 1,
                    'choices' => array (
                        'wp_footer' => 'wp_footer',
                        'wp_head' => 'wp_head',
                    ),
                    'allow_null' => 0,
                    'layout' => 'vertical',
                    'return_format' => 'value',
                ),
            ),
        ) );
    }
    return $fields;
}
