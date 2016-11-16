<?php
/**
 * output the table header
 */

// get table fields
$table_fields = get_field('tk_table_view_fields', 'option');
if ( is_array($table_fields) && count($table_fields) ) {
    print('<table class="table table-profiles table-stripe table-bordered table-hover tablesaw tablesaw-stack" data-tablesaw-mode="stack" data-tablesaw-sortable><thead><tr>');
    foreach ( $table_fields as $field ) {
        switch( $field['value'] ) {
            // image column has no text in header row
            case 'featured_image':
                print('<th scope="col"></th>');
                break;
            // shorten Full name to Name
            case 'post_title':
                print('<th scope="col">Name</th>');
                break;
            // make first name and last name columns sortable
            case 'tk_profiles_first_name':
            case 'tk_profiles_last_name':
                printf( '<th scope="col" data-tablesaw-sortable-col>%s</th>', $field['label'] );
                break;
            default:
                printf( '<th scope="col">%s</th>', $field['label'] );
                break;
        }
    }
    print('</tr></thead><tbody>');
}
