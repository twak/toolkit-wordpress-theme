<?php
/**
 * upgrade script for version 0.3.0
 * converts ACF page widgets to PHP definitions
 * removes the definitions in the wordpress database
 * renames the fields for the content in postmeta
 */
$tk_page_widget_fields = array(
    array(
        'old_key' => 'group_5731f1ca4cc04'
    ),
    array(
        'old_key' => 'field_5731dd3c55d96',
        'new_key' => 'field_tk_page_widgets'
    ),
    array(
        'old_key' => '5731f1ca59a31',
        'new_key' => 'field_tk_page_widgets_content'
    ),
    array(
        'old_key' => 'field_57eb8a7f1242e',
        'new_key' => 'field_tk_page_widgets_content_content_tab'
    ),
    array(
        'old_key' => 'field_5731dd5f55d97',
        'new_key' => 'field_tk_page_widgets_content_heading'
    ),
    array(
        'old_key' => 'field_5731e48e8429b',
        'new_key' => 'field_tk_page_widgets_content_content'
    ),
    array(
        'old_key' => 'field_57eb8a911242f',
        'new_key' => 'field_tk_page_widgets_content_appearance_tab'
    ),
    array(
        'old_key' => 'field_57eb8aa412430',
        'new_key' => 'field_tk_page_widgets_content_background'
    ),
    array(
        'old_key' => '57e253c8bc11e',
        'new_key' => 'field_tk_page_widgets_featured'
    ),
    array(
        'old_key' => 'field_57eb8a3358157',
        'new_key' => 'field_tk_page_widgets_featured_content_tab'
    ),
    array(
        'old_key' => 'field_57e253c8bc11f',
        'new_key' => 'field_tk_page_widgets_featured_heading'
    ),
    array(
        'old_key' => 'field_57e253f1bc121',
        'new_key' => 'field_tk_page_widgets_featured_image'
    ),
    array(
        'old_key' => 'field_57e253c8bc120',
        'new_key' => 'field_tk_page_widgets_featured_content'
    ),
    array(
        'old_key' => 'field_57ebb30e4c0fb',
        'new_key' => 'field_tk_page_widgets_featured_link_type'
    ),
    array(
        'old_key' => 'field_57e2560ea4dd8',
        'new_key' => 'field_tk_page_widgets_featured_link_internal'
    ),
    array(
        'old_key' => 'field_57ebb3754c0fc',
        'new_key' => 'field_tk_page_widgets_featured_link_external'
    ),
    array(
        'old_key' => 'field_57eb8a0358156',
        'new_key' => 'field_tk_page_widgets_featured_appearance_tab'
    ),
    array(
        'old_key' => 'field_57e2878185f7e',
        'new_key' => 'field_tk_page_widgets_featured_background'
    ),
    array(
        'old_key' => '5731f1ca5c423',
        'new_key' => 'field_tk_page_widgets_posts'
    ),
    array(
        'old_key' => 'field_5731ddef4b1d4',
        'new_key' => 'field_tk_page_widgets_posts_options'
    ),
    array(
        'old_key' => '5731fc59bed06',
        'new_key' => 'field_tk_page_widgets_banner'
    ),
    array(
        'old_key' => 'field_57e9291fb856c',
        'new_key' => 'field_tk_page_widgets_banner_content_tab'
    ),
    array(
        'old_key' => 'field_5731fc66bed07',
        'new_key' => 'field_tk_page_widgets_banner_slides'
    ),
    array(
        'old_key' => 'field_5731fce9cc84f',
        'new_key' => 'field_tk_page_widgets_banner_slide_image'
    ),
    array(
        'old_key' => 'field_5731fd2fcc850',
        'new_key' => 'field_tk_page_widgets_banner_slide_title'
    ),
    array(
        'old_key' => 'field_5731fd41cc851',
        'new_key' => 'field_tk_page_widgets_banner_slide_lead'
    ),
    array(
        'old_key' => 'field_5731fd56cc852',
        'new_key' => 'field_tk_page_widgets_banner_slide_link_type'
    ),
    array(
        'old_key' => 'field_57fbb0970a814',
        'new_key' => 'field_tk_page_widgets_banner_slide_link_text'
    ),
    array(
        'old_key' => 'field_5731feed9fe5c',
        'new_key' => 'field_tk_page_widgets_banner_slide_link_internal'
    ),
    array(
        'old_key' => 'field_5731ff1a9fe5d',
        'new_key' => 'field_tk_page_widgets_banner_slide_link_external'
    ),
    array(
        'old_key' => 'field_5733475c65383',
        'new_key' => 'field_tk_page_widgets_banner_slide_tab'
    ),
    array(
        'old_key' => 'field_57e92930b856d',
        'new_key' => 'field_tk_page_widgets_banner_appearance_tab'
    ),
    array(
        'old_key' => 'field_5746d7a18b189',
        'new_key' => 'field_tk_page_widgets_banner_size'
    ),
    array(
        'old_key' => '5732003d5056b',
        'new_key' => 'field_tk_page_widgets_cards'
    ),
    array(
        'old_key' => 'field_57e9211d9e8cb'
        'new_key' => 'field_tk_page_widgets_cards_content_tab'
    ),
    array(
        'old_key' => 'field_57e3a0cc85c29'
        'new_key' => 'field_tk_page_widgets_cards_title'
    ),
    array(
        'old_key' => 'field_57e39daff4290',
        'new_key' => 'field_tk_page_widgets_cards_lead'
    ),
    array(
        'old_key' => 'field_573200555056c',
        'new_key' => 'field_tk_page_widgets_cards_card'
    ),
    array(
        'old_key' => 'field_5732006e5056d',
        'new_key' => 'field_tk_page_widgets_cards_card_title'
    ),
    array(
        'old_key' => 'field_573d8a033e39e',
        'new_key' => 'field_tk_page_widgets_cards_card_image'
    ),
    array(
        'old_key' => 'field_573d8a2e3e39f',
        'new_key' => 'field_tk_page_widgets_cards_card_content'
    ),
    array(
        'old_key' => 'field_57e4f1aedf1e4',
        'new_key' => 'field_tk_page_widgets_cards_card_link_type'
    ),
    array(
        'old_key' => 'field_57e39dbcf4291',
        'new_key' => 'field_tk_page_widgets_cards_card_link_internal'
    ),
    array(
        'old_key' => 'field_57e4f2ae0af53',
        'new_key' => 'field_tk_page_widgets_cards_card_link_external'
    ),
    array(
        'old_key' => 'field_57e9206cc346d'
        'new_key' => 'field_tk_page_widgets_cards_appearance_tab'
    ),
    array(
        'old_key' => 'field_57e3af345ae0c',
        'new_key' => 'field_tk_page_widgets_cards_layout'
    ),
    array(
        'old_key' => 'field_57e3f310e40a7',
        'new_key' => 'field_tk_page_widgets_cards_columns'
    ),
    array(
        'old_key' => 'field_57e91fac7b696',
        'new_key' => 'field_tk_page_widgets_cards_background'
    ),
    array(
        'old_key' => 'field_57e930235de2b',
        'new_key' => 'field_tk_page_widgets_cards_image_proportion'
    ),
    array(
        'old_key' => '58ecf4772cc35',
        'new_key' => 'field_tk_page_widgets_accordion'
    ),
    array(
        'old_key' => 'field_58ecf4802cc36',
        'new_key' => 'field_tk_page_widgets_accordion_item'
    ),
    array(
        'old_key' => 'field_58ecf4ac2cc37',
        'new_key' => 'field_tk_page_widgets_accordion_item_title'
    ),
    array(
        'old_key' => 'field_58ecf4bb2cc38',
        'new_key' => 'field_tk_page_widgets_accordion_item_content'
    ),
);
function tk_update_acf( $fields )
{
    global $wpdb;
    $keys = array();
    foreach ( $fields as $field ) {
        if ( isset( $field['old_key'] ) ) {
            // remove definition from database
            $wpdb->query( $wpdb->prepare( "DELETE FROM $wpdb->posts WHERE post_name = %s;", $field['old_key'] ) );
            if ( isset( $field['new_key'] ) ) {
                // update postmeta values
                $wpdb->query( $wpdb->prepare( "UPDATE $wpdb->postmeta SET meta_value = %s WHERE meta_value = %s;", $field['new_key'], $field['old_key'] ) );
            }
        }
    }
}
tk_update_acf($tk_page_widget_fields);
