<?php
/**
 * footer links template (sponsor logos, social media links)
 */

if ( have_rows('tk_social_media_links', 'option') || have_rows('tk_sponsor_logos', 'option') ) {
    print('<div class="site-footer-upper"><div class="wrapper-lg wrapper-pd">');
    if ( have_rows('tk_sponsor_logos', 'option') ) {
        print('<div class="site-footer-upper-logos">');
        while ( have_rows('tk_sponsor_logos', 'option') ) : the_row();
            $sponsor_image = get_sub_field('tk_sponsor_image');
            if ( $sponsor_image ) {
                // get field values
                $image_url = $sponsor_image['sizes']['medium'];
                $sponsor_name = get_sub_field('tk_sponsor_name');
                $sponsor_url = get_sub_field('tk_sponsor_url');
                // set variables for title attribute and alt
                if ( ! $sponsor_name ) {
                    $sponsor_title_attr = sprintf(' title="%s"', esc_attr( $image['title'] ) );
                    $sponsor_alt = esc_attr($image['alt']);
                } else {
                    $sponsor_title_attr = sprintf(' title="%s"', esc_attr( $sponsor_name ) );
                    $sponsor_alt = sprintf('%s logo', esc_attr( $sponsor_name ) );
                }
                // link image if URL is present
                if ( $sponsor_url ) {
                    printf('<a href="%s"%s><img alt="%s" src="%s"></a>', $sponsor_url, $sponsor_title_attr, $sponsor_alt, $image_url );
                } else {
                    printf('<img%s alt="%s" src="%s">', $sponsor_title_attr, $sponsor_alt, $image_url );
                }
            }
        endwhile;
        print('</div>');
    }
    if ( have_rows('tk_social_media_links', 'option') ) {
        print('<div class="footer-social">');
        while ( have_rows('tk_social_media_links', 'option') ) : the_row();
            $service_url = get_sub_field('tk_social_media_url');
            if ( $service_url ) {
                $service = get_sub_field('tk_social_media_site');
                printf('<a href="%s"><span class="icon-font-text">%s</span><span class="tk-icon-social-%s"></span></a>', $service_url, $service['label'], $service['value'] );
            }
        endwhile;
        print('</div>');
    }
    print('</div></div>');
}
