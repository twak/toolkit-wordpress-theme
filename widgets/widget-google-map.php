<?php
/**
 * google maps widget
 */

if( have_rows( 'locations' ) ) {

    print('<div class="container-row"><div class="wrapper-md wrapper-pd-md">');

    $staticmap_uri = 'https://maps.googleapis.com/maps/api/staticmap?size=640x320';
    $jsmap_div = '<div class="tk-map"';

    $type = get_field('start-type');
    $staticmap_uri .= '&maptype=' . strtolower($type);
    $jsmap_div .= ' data-start-type="' . $type . '"';

    $zoom = get_field('start-zoom');
    $staticmap_uri .= '&zoom=' . $zoom;
    $jsmap_div .= ' data-start-zoom="' . $zoom . '"';

    $firstmarker = true;
    $marker_html = '';

    while ( have_rows( 'locations' ) ) : the_row();
        $location = get_sub_field('location');
        if ( $firstmarker ) {
            $staticmap_uri .= '&center=' . $location['lat'] . ',' . $location['lng'];
            $jsmap_div .= ' data-lat="'  . $location['lat'] . '" data-lng="' . $location['lng'] . '">';
            $firstmarker = false;
        }

        /* get content of infowindow */
        $title = get_sub_field('title');
        $image = get_sub_field('image');
        if ( trim( get_sub_field('description') ) !== '' ) {
            $description = wpautop( wptexturize( trim( get_sub_field('description') ) ) );
        } else {
            $description = '';
        }

        /* marker style */
        $marker_size = get_sub_field('marker_size');
        $marker_colour = get_sub_field('marker_colour');

        /* show link to google maps for directions? */
        $show_directions_link = get_sub_field('show_directions');

        /* construct marker in static map */
        $staticmap_uri .= '&markers=size:' . $marker_size;
        $staticmap_uri .= '%7Ccolor:' . $marker_colour;
        $staticmap_uri .= '%7Clabel:' . strtoupper( $title[0] );
        $staticmap_uri .= '%7C' . $location['lat'] . ',' . $location['lng'];

        /* get marker HTML */
        $marker_html .= sprintf('<div class="tk-marker" data-lat="%s" data-lng="%s" data-title="%s">', $location['lat'], $location['lng'], esc_attr( $title ) );
        if ( ! empty($description) || $image ) {
            $marker_html .= '<div class="tk-infowindow">';
            if ( $image ) {
                $marker_html .= sprintf('<img src="%s" alt="%s">', $image['sizes']['thumbnail'], esc_attr( $title ) );
                }
            }
            $marker_html .= sprintf('<h3>%s</h3>', $title );
            if ( ! empty($description) ) {
                $marker_html .= $description;
            }
            if ( $show_directions_link ) {
                $marker_html .= sprintf('<p><a href="https://www.google.com/maps/dir/Current+Location/%s,%s" target="google_maps">Get directions</a></p>', $location['lat'], $location['lng'] );
            }
            $marker_html .= '</div>';
        }
        $marker_html .= '</div>';

    endwhile;

    printf('%s<img src="%s">%s</div>', $jsmap_div, $staticmap_uri, $markers_html);
    print('</div></div>');
}

