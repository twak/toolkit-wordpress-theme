<?php
/**
 * google maps widget
 */
$api_key = tk_get_google_api_key();
$type = get_sub_field('start_type');
$zoom = get_sub_field('start_zoom');

if( have_rows( 'locations' ) ) {
    wp_enqueue_script('google_maps_api');
    wp_enqueue_script('google_map_widget');

    print('<div class="container-row"><div class="wrapper-md wrapper-pd-md">');

    $staticmap_uri = 'https://maps.googleapis.com/maps/api/staticmap?size=640x320';
    $jsmap_div = '<div style="width:100%;height:400px;" class="tk-map"';

    $staticmap_uri .= '&maptype=' . strtolower($type);
    $jsmap_div .= ' data-start-type="' . $type . '"';
    
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
        if ( ! $marker_size ) {
            $marker_size = "normal";
        }
        $marker_colour = get_sub_field('marker_colour');
        if ( ! $marker_colour ) {
            $marker_colour = "red";
        }

        /* show link to google maps for directions? */
        $show_directions_link = get_sub_field('show_directions');

        /* construct marker in static map */
        $staticmap_uri .= '&markers=size:' . $marker_size;
        $staticmap_uri .= '%7Ccolor:' . $marker_colour;
        $staticmap_uri .= '%7Clabel:' . strtoupper( $title[0] );
        $staticmap_uri .= '%7C' . $location['lat'] . ',' . $location['lng'];
        /* get marker HTML */
        $marker_html .= sprintf('<div class="tk-marker container-row" data-lat="%s" data-lng="%s" data-title="%s" data-colour="%s">', $location['lat'], $location['lng'], esc_attr( $title ), $marker_colour );
        if ( ! empty($description) || $image ) {
            $marker_html .= '<div class="tk-infowindow card-flat skin-box-module">';
            if ( $image ) {
                $marker_html .= sprintf('<div class="card-img card-img-1-4"><img src="%s" alt="%s"></div>', $image['sizes']['thumbnail'], esc_attr( $title ) );
            }
            $marker_html .= sprintf('<div class="card-content equalize-inner"><h3>%s</h3>', $title );
            if ( ! empty($description) ) {
                $marker_html .= '<div class="description">' . $description . '</div>';
            }
            if ( $show_directions_link ) {
                $marker_html .= sprintf('<p><a class="btn btn-default btn-small" href="https://www.google.com/maps/dir/Current+Location/%s,%s" target="google_maps">Get directions</a></p>', $location['lat'], $location['lng'] );
            }
            $marker_html .= '</div></div>';
        }
        $marker_html .= '</div>';

    endwhile;

    printf('%s<img class="static-gmap" src="%s&key=%s">%s</div>', $jsmap_div, $staticmap_uri, $api_key, $marker_html);
    print('</div></div>');
}
