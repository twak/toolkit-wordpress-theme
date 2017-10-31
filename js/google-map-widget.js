/**
 * Google maps widget javascript
 */
(function($) {
    $(document).ready(function(){
        var add_marker = function( $marker, map ) {
            // create marker
            var marker = new google.maps.Marker({
                position    : new google.maps.LatLng( $marker.data('lat'), $marker.data('lng') ),
                map         : map,
                title       : $marker.data('title'),
                icon        :'https://maps.google.com/mapfiles/ms/icons/'+$marker.data('colour')+'.png'
            });
            // add to array
            map.markers.push( marker );
            // if marker contains HTML, add it to an infoWindow
            if( $marker.html() ) {
                // create info window
                var infowindow = new google.maps.InfoWindow({
                    content     : $marker.find('.tk-infowindow').html()
                });
                // show info window when marker is clicked
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open( map, marker );
                });
            }
        },
        centre_map = function( map ) {
            var bounds = new google.maps.LatLngBounds();
            // loop through all markers and create bounds
            $.each( map.markers, function( i, marker ){
                var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );
                bounds.extend( latlng );
            });
            // only 1 marker?
            if( map.markers.length == 1 ) {
                // set center of map
                map.setCenter( bounds.getCenter() );
            } else {
                // fit to bounds
                map.fitBounds( bounds );
                fixFitBounds(map);
            }
        },
        // this waits for the initial zoom change from fitBounds (async) and resets the zoom level if neccessary
        fixFitBounds = function(map){
            // listen for zoom changes
            google.maps.event.addListener(map, 'zoom_changed', function() {
                // add the listener for bounds changes
                zoomChangeBoundsListener = google.maps.event.addListener(map, 'bounds_changed', function(event) {
                    // see if the zoom is greater than that set in the widget
                    if (this.getZoom() > this.startZoom && this.initialZoom == true) {
                        // Change max/min zoom
                        this.setZoom(this.startZoom);
                        this.initialZoom = false;
                    }
                    // remove the listener
                    google.maps.event.removeListener(zoomChangeBoundsListener);
                });
            });
        };      
        $('.tk-map').each(function(){
            // get markers
            var tkmarkers = $(this).find('.tk-marker'),
                tkzoom = $(this).data('start-zoom'),
                tktype = $(this).data('start-type'),
                tklat = $(this).data('lat'),
                tklng = $(this).data('lng');
            // create map               
            var map = new google.maps.Map( $(this)[0], {
                zoom        : tkzoom,
                center      : new google.maps.LatLng(tklat, tklng),
                mapTypeId   : google.maps.MapTypeId[tktype]
            });
    
            // add a markers reference
            map.markers = [];

            // save initial zoom level
            map.startZoom = tkzoom;
            map.initialZoom = true;

            // add markers
            tkmarkers.each(function(){
                add_marker( $(this), map );
            });
    
            // center map
            centre_map( map );
        });
    });
})(jQuery);
