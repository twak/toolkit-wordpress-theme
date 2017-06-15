/**
 * Google map - Plugin
 * Gives us a standard set of methods to call on the the google map API
 */
var toolkitMap = (function() {

    /** 
     * Default settings
     */

    var self = this,
        mapObj, // the google map obj                   
        markersArray = [], //used to store markers created
        mapTypeId = 'custom_style',
        directionsDisplay, // init directions obj 
        directionsService; // init directions obj 

    /* Default settings - overwritten by init if object passed */

    self.settings = {
        el: '#googlemap', //default element        
        iconDir: './assets/dist/img/google-map-icons', //directory for marker icons
        mapCenterLat: 53.801277,
        mapCenterLng: -1.548567,
        zoom: 15,
        markers: [ // one default marker
            {
                'id': 'defaultLeeds', // required (must be unique)
                'lat': '54.801277', // required
                'lng': '-1.548567', // required
                'title': 'University of Leeds',
                'type': 'default',
                'html': '<span>Default marker</span>',
                'icon': 'local-essentials'
            }
        ]
    };

    /**
     * Init
     */

    var init = function(settings) {
        $.extend(self.settings, settings); // Allow overriding of the default settings
        setupMap();
        mapMarkers(self.settings.markers);
    };

    /**
     * Map setup
     */

    var setupMap = function() {

        // Default API map setup
        mapObj = new google.maps.Map(document.querySelector(self.settings.el), {
            zoom: self.settings.zoom,
            scrollwheel: false,
            panControl: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: true,
            overviewMapControl: false,
            // Center of the map
            center: new google.maps.LatLng(self.settings.mapCenterLat, self.settings.mapCenterLng),
            // Type of controls on the map
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, mapTypeId]
            }
        });

        addCustomStyle();

    };

    /**
     * Map appearance
     */

    var addCustomStyle = function() {

        /* Map styles -> https://developers.google.com/maps/documentation/javascript/styling */
        // Create a new StyledMapType object, passing it an array of styles,
        // and the name to be displayed on the map type control.
        var styledMapType = new google.maps.StyledMapType(
            [{
                stylers: [{
                    saturation: -100
                }]
            }, {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{
                    color: "#7AA9DD"
                }]
            }, {
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [{
                    color: "#9CBA7F"
                }]
            }, {
                featureType: "road.highway",
                elementType: "labels",
                stylers: [{
                    visibility: "on"
                }]
            }, {
                featureType: "road.arterial",
                elementType: "labels.text",
                stylers: [{
                    visibility: "on"
                }]
            }, {
                featureType: "road.local",
                elementType: "labels.text",
                stylers: [{
                    visibility: "on"
                }]
            }, {}], {
                name: 'Styled Map'
            });

        //Associate the styled map with the MapTypeId and set it to display.
        mapObj.mapTypes.set('styled_map', styledMapType);
        mapObj.setMapTypeId('styled_map');

    };

    /**
     * Map events
     */

    var setMapCenter = function(lat, lng) {
        mapObj.setCenter(new google.maps.LatLng(lat, lng));
    };

    var setZoom = function(zoom) {
        mapObj.setZoom(zoom);
    };

    var resetMap = function() {
        setZoom(self.settings.zoom);
        setMapCenter(self.settings.mapCenterLat, self.settings.mapCenterLng);
    };

    /**
     * Map polyline ie shapes
     */

    //put coordinates into Array and loop through
    var mapPolyline = function(jsonCoordinates) {

        if (jsonCoordinates !== undefined) {

            var coords = jsonCoordinates,
                coordsArray = [];

            for (i in coords) {
                var ray = coords[i];
                var lat = coords[i]['lat'],
                    lng = coords[i]['lng'];
                coordsArray.push(new google.maps.LatLng(lat, lng));
            }

            var line = new google.maps.Polyline({
                path: coordsArray,
                strokeOpacity: 0.8,
                strokeColor: '#a97e4f',
                map: mapObj
            });

        }

        // var pathCampus = new google.maps.Polyline({
        //     path: campusOutlineCoordinates,
        //     geodesic: false,
        //     strokeColor: '#c4a480',
        //     strokeOpacity: 0.6,
        //     strokeWeight: 10,
        //     visible: true
        // });

        //pathCampus.setMap(map);

    };

    /**
     * Map polyline ie shapes
     */

    //put coordinates into Array and loop through
    var mapPolyline = function(jsonCoordinates) {

        if (jsonCoordinates !== undefined) {

            var coords = jsonCoordinates,
                coordsArray = [];

            for (i in coords) {
                var ray = coords[i];
                var lat = coords[i]['lat'],
                    lng = coords[i]['lng'];
                coordsArray.push(new google.maps.LatLng(lat, lng));
            }

            var line = new google.maps.Polyline({
                path: coordsArray,
                strokeOpacity: 0.8,
                strokeColor: '#a97e4f',
                map: mapObj
            });

             var line2 = new google.maps.Polyline({
                path: coordsArray,
                strokeOpacity: 0.5,
                strokeWeight: 10,
                strokeColor: '#c4a480',
                map: mapObj
            });
    
        }                

    };

    /**
     * Markers handling 
     */

    // Returns a marker with and info window
    var buildMarker = function(latlng, html, id, type, icon) {

        //Setup default icon
        var icon = icon || 'residence.png',
            iconObj = {
                url: self.settings.iconDir + icon,
                // This marker is 20 pixels wide by 32 pixels high.
                //size: new google.maps.Size(48, 48),
                scaledSize: new google.maps.Size(32, 32), // the new size you want to use
                // The origin for this image is (0, 0).
                //origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                //anchor: new google.maps.Point(0, 20)
            };

        //Create new marker
        var marker = new google.maps.Marker({
            position: latlng,
            map: mapObj,
            icon: iconObj
        });

        marker.set('type', type);
        marker.set('id', id);

        // Info window tied to specific marker
        createInfoWindow(marker, html);

        return marker;
    };

    // Creates a info window tied to a marker
    var createInfoWindow = function(marker, html) {

        //  Info windows: Display content (usually text or images) in a popup window above the map, at a given location. 
        infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div class="gm-info-window">' + html + '</div>');
            infowindow.open(mapObj, marker);
        });

    };

    // For each marker in markers call buildMarker and store on markersArray    
    var mapMarkers = function(markers) {

        deleteMarkers();

        for (var i = 0; i < markers.length; i++) {
            var id = markers[i]['id'],
                type = markers[i]['type'],
                lat = markers[i]['lat'],
                long = markers[i]['lng'],
                title = markers[i]['title'],
                icon = markers[i]['icon'],
                html = markers[i]['html'], // if not set
                latlong = new google.maps.LatLng(lat, long),
                markerContent = '';

            // if title or html is set add to marker content
            markerContent += (title) ? '<strong class="gm-title">' + title + '</strong>' : '';
            markerContent += (html) ? '<span class="gm-content">' + html + '</span>' : '';

            // Call buildMarker() but also and store in markersArray for other uses
            markersArray[id] = buildMarker(latlong, markerContent, id, type, icon);
        }

        //console.log(markersArray);
    };

    //Hide markers by type
    var hideMarkers = function(type) {
        for (i in markersArray) {
            if (type) {
                if (markersArray[i].type === type) {
                    //markersArray[i].setMap(null);
                    markersArray[i].setVisible(false);
                }
            } else {
                markersArray[i].setVisible(false);
            }
        }
    };

    //Show markers by type
    var showMarkers = function(type) {
        for (i in markersArray) {
            if (type) {
                if (markersArray[i].type === type) { //
                    markersArray[i].setVisible(true);
                }
            } else {
                markersArray[i].setVisible(true);
            }
        }
    };

    //Show and hide markers by type
    var toggleMarkers = function(type) {

        for (i in markersArray) {

            if (type) {
                if (markersArray[i].type === type) { //
                    if (!markersArray[i].getVisible()) {
                        markersArray[i].setVisible(true);
                    } else {
                        markersArray[i].setVisible(false);
                    }
                }
            } else { // refactor to make toggle without a type show all first then hide
                if (!markersArray[i].getVisible()) {
                    markersArray[i].setVisible(true);
                } else {
                    markersArray[i].setVisible(false);
                }
            }
        }
    };

    // Deletes all markers in the array by removing references to them.
    var deleteMarkers = function() {
        for (i in markersArray) {
            markersArray[i].setMap(null);
            //markersArray[i].setVisible(false);            
        }
        markersArray = [];
    };

    //Single marker methods

    //Centers marker on map and shows is it by ID
    var goToMarker = function(id) {
        // Set marker on map (if hidden or something)
        markersArray[id].setMap(mapObj); //Should this be just map and show or map?           
        // Set the map to the location of the marker
        setMapCenter(markersArray[id].position.lat(), markersArray[id].position.lng());
        // Set zoom to settings
        setZoom(self.settings.zoom);
    };

    // Trigger click event on marker (open info window) by ID 
    var triggerMarker = function(id) {
        google.maps.event.trigger(markersArray[id], 'click');
        goToMarker(id);
    };

    /** 
     * Map Directions
     */

    // var getRoute = function() {
    //     var dest = $('#dest').find(":selected").val().split(',');
    //     calculateAndDisplayRoute(directionsService, directionsDisplay, dest[0], dest[1]);
    // };

    var initDirections = function(travelmode, start, finish) {

        directionsDisplay = new google.maps.DirectionsRenderer;
        directionsService = new google.maps.DirectionsService;
        directionsDisplay.setMap(mapObj);

        var startLat = parseFloat(start[0]),
            startLng = parseFloat(start[1]),
            finishLat = parseFloat(finish[0]),
            finishLng = parseFloat(finish[1]);

        // console.log(start);
        // console.log(finish);

        directionsService.route({
            origin: {
                lat: startLat,
                lng: startLng
            },
            destination: {
                lat: finishLat,
                lng: finishLng
            },
            travelMode: google.maps.TravelMode[travelmode]
        }, function(response, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });

        // var selectedMode = document.getElementById('mode').value;
        // directionsService.route({
        //     origin: {
        //       lat: 53.817549,
        //       lng: -1.566720
        //     },
        //     destination: {
        //       lat: 53.817749,
        //       lng: 53.817349
        //     },
        //     travelMode: google.maps.TravelMode[selectedMode]
        // }, function(response, status) {
        //     if (status == 'OK') {
        //         directionsDisplay.setDirections(response);
        //     } else {
        //         window.alert('Directions request failed due to ' + status);
        //     }
        // });
    };

    var removeDirections = function() { 
        if(directionsDisplay !== undefined) {
            directionsDisplay.setMap(null);            
        }
    };

    /**
     * Map flyouts
     */

    var setFlyout = function(content) {

        var flyout = '<div class="gm-flyout">' +
                        '<a href="#" class="gm-flyout-close">close</a>' +
                        '<div class="gm-flyout-content">' + content +
                        '</div>' +
                    '</div>';

        $('.gm-wrapper').append(flyout);        

        // $('.gm-flyout-close').click(function() {
        //     $(this).parent().removeClass('active');
        // });

        //console.log(flyout);

    };

    var showFlyout = function(id){
        $('.gm-flyout').removeClass('active');
        $(id).addClass('active');
        $('.gm-flyout-close').click(function() {
            $(id).removeClass('active');
            return false;
        });
    };

    var toggleFlyout = function(id){        
        if(!$(id).hasClass('active')) {
            $('.gm-flyout').removeClass('active');
            $(id).addClass('active');            
        } else {
            $('.gm-flyout').removeClass('active');
            $(id).removeClass('active');
        }       
        $('.gm-flyout-close').click(function() {
            $(id).removeClass('active');
            console.log(1);
            return false;

        });
    };

    var hideFlyouts = function(id){
        $('.gm-flyout').removeClass('active');
        $(id).addClass('active');
    };

    var closeFlyout = function() {

    };

    var setIcon = function() {

    };

    var showInfoWIndow = function() { //or trigger click

    };

    return {
        init: init,
        showFlyout: showFlyout,
        toggleFlyout: toggleFlyout,
        mapMarkers: mapMarkers,
        hideMarkers: hideMarkers,
        showMarkers: showMarkers,
        toggleMarkers: toggleMarkers,
        goToMarker: goToMarker,
        triggerMarker: triggerMarker,
        initDirections: initDirections,
        removeDirections: removeDirections,
        mapPolyline: mapPolyline
        // go to marker
        // remove all markers
        // add new set of markers
    };

}());