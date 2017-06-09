/**
 * acc-card-filter.js  
 * ------------------
 * Card filter - Filter user options and save as a cookie for when they return to the page
 * this currently utilises a cookie plugin to save the user filter options to retain
 * the state of the filters. The plugin used is: JavaScript Cookie v2.1.2 (https://github.com/js-cookie/js-cookie)
 * If this is not required, simply set useCookies to false;
 */

+ function ($) {
    'use strict';

    var useCookies = true; //change to false if you want to deactivate cookies. PLEASE NOTE: if deactivated the page won't hold the filter state

    var contains = function (needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;
        if (!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function (needle) {
                var i = -1
                    , index = -1;
                for (i = 0; i < this.length; i++) {
                    var item = this[i];
                    if ((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
        }
        return indexOf.call(this, needle) > -1;
    };

    function check() {
        var selectedOptions = {};
        //get value of the selects combination and store it in an object
        $('.card-filter select').each(function () {
            var thisKey = $(this).attr('id');
            var thisOption = $(this).val();
            selectedOptions[thisKey] = thisOption; //add the selected option to obj
            if (useCookies) {
                //set the cookie to save the serach filter
                Cookies.set('searchFilters', selectedOptions);
            }
        });

        $.fn._hasData = function () {
            return [].some.call(this[0].attributes, function (v, k) {
                return /^data-/.test(v["name"])
            })
        };

        $('.filter-list div').each(function () {
            if ($(this)._hasData()) {
                var listData = $(this).data(); //get object of data attr
                var keyList = Object.keys(listData); //get array of keys
                var keySuccess = []; //monitor the result of each comparison
                //loop through each of the keys in
                //the list to see if it matches the selected options
                for (var k in keyList) { //each key
                    var key = keyList[k];
                    var value = listData[key];
                    if (contains.call(value, ',')) { //if list data contain comma
                        var valueArray = value.split(',');
                        if (contains.call(valueArray, selectedOptions[key])) {
                            keySuccess.push(1);
                        } else if ("all" == selectedOptions[key]) {
                            keySuccess.push(1);
                        } else {
                            keySuccess.push(0);
                        }
                    } else {
                        if (value == selectedOptions[key]) { //if not match add zero
                            keySuccess.push(1);
                        } else if ("all" == selectedOptions[key]) {
                            keySuccess.push(1);
                        } else {
                            keySuccess.push(0);
                        }
                    }
                }
                var index = contains.call(keySuccess, 0); // if containes 0 retun true
                //pseudo hide the elements, so they are not visible/tabbable
                //but need to retain their display propert to allow the equalize to work
                if (!index) {
                    $(this).css({position:"relative",left:'0'});
                    $(this).find('a').removeAttr('tabindex');
                } else {
                    $(this).css({position:"absolute",left:'-10000px'});
                    $(this).find('a').attr('tabindex','-1');
                }
                keySuccess = [];
            }
        });

        $(window).trigger("resize"); //this is needed to re-equalize the columns
    }

    $(document).ready(function () {
        if (useCookies) {
            //check if the cookies exists if so set the filters accordingly
            if (Cookies.get('searchFilters') != undefined) {
                var filterObj = JSON.parse("[" + Cookies.get('searchFilters') + "]");
                for (var key in filterObj[0]) {
                    var value = filterObj[0][key];
                    $("#" + key).val(value);
                }
            }
        }
        check();
    });

    $('.card-filter select').change(function () {
        check();
    });

    $( '#roomtype' ).multipleSelect();

}(jQuery);

// /**
//  * acc-googlemaps.js  
//  */

// + function($) {
//     'use strict';

//     //put coordinates into Array and loop through
//     function addCampusOutline(map) {
//         var campusOutlineCoordinates = [
//             new google.maps.LatLng(53.81048220253582, -1.556990146636963),
//             new google.maps.LatLng(53.81034758511345, -1.5572825074195862),
//             new google.maps.LatLng(53.81002450153584, -1.55781090259552),
//             new google.maps.LatLng(53.80969824794529, -1.5581220388412476),
//             new google.maps.LatLng(53.809253208613505, -1.5583822131156921),
//             new google.maps.LatLng(53.8090869115652, -1.5584546327590942),
//             new google.maps.LatLng(53.808784407623946, -1.5586477518081665),
//             new google.maps.LatLng(53.80847081484642, -1.5589454770088196),
//             new google.maps.LatLng(53.80816355500127, -1.5592968463897705),
//             new google.maps.LatLng(53.8079814153701, -1.559557020664215),
//             new google.maps.LatLng(53.80804793602279, -1.560082733631134),
//             new google.maps.LatLng(53.808382121514086, -1.5613031387329102),
//             new google.maps.LatLng(53.80859593547831, -1.561954915523529),
//             new google.maps.LatLng(53.808733726121844, -1.562408208847046),
//             new google.maps.LatLng(53.80775017608957, -1.5631404519081116),
//             new google.maps.LatLng(53.80775017608957, -1.5631404519081116),
//             new google.maps.LatLng(53.80722433955302, -1.563604474067688),
//             new google.maps.LatLng(53.8071308920084, -1.5631887316703796),
//             new google.maps.LatLng(53.80696617040567, -1.5625423192977905),
//             new google.maps.LatLng(53.80653852476192, -1.5610000491142273),
//             new google.maps.LatLng(53.80646566618031, -1.5606620907783508),
//             new google.maps.LatLng(53.80644824345725, -1.5604743361473083),
//             new google.maps.LatLng(53.806088700192234, -1.5603777766227722),
//             new google.maps.LatLng(53.80587487344032, -1.559760868549347),
//             new google.maps.LatLng(53.80579884588794, -1.5595194697380066),
//             new google.maps.LatLng(53.805716482550594, -1.5592029690742493),
//             new google.maps.LatLng(53.805445632742696, -1.5583688020706177),
//             new google.maps.LatLng(53.80497045341343, -1.5570250153541565),
//             new google.maps.LatLng(53.80485799351738, -1.5567675232887268),
//             new google.maps.LatLng(53.80427984985376, -1.5560030937194824),
//             new google.maps.LatLng(53.804162636193816, -1.5558958053588867),
//             new google.maps.LatLng(53.80399790292865, -1.5559253096580505),
//             new google.maps.LatLng(53.80386801662864, -1.5559548139572144),
//             new google.maps.LatLng(53.80383792096512, -1.5559253096580505),
//             new google.maps.LatLng(53.80361457878714, -1.5559306740760803),
//             new google.maps.LatLng(53.80359953086711, -1.5548215806484222),
//             new google.maps.LatLng(53.80359953086711, -1.5548215806484222),
//             new google.maps.LatLng(53.803592402903114, -1.5527576208114624),
//             new google.maps.LatLng(53.80377297761759, -1.5524156391620636),
//             new google.maps.LatLng(53.80393454380818, -1.5520991384983063),
//             new google.maps.LatLng(53.80426163423893, -1.551392376422882),
//             new google.maps.LatLng(53.8045356596088, -1.5506963431835175),
//             new google.maps.LatLng(53.80467425557342, -1.550280600786209),
//             new google.maps.LatLng(53.80503777081252, -1.5487383306026459),
//             new google.maps.LatLng(53.80515814989201, -1.5488161146640778),
//             new google.maps.LatLng(53.80523853441378, -1.548871099948883),
//             new google.maps.LatLng(53.80553076847028, -1.5490923821926117),
//             new google.maps.LatLng(53.80561946783516, -1.549174189567566),
//             new google.maps.LatLng(53.80577112747516, -1.549336463212967),
//             new google.maps.LatLng(53.805946941097055, -1.5495724976062775),
//             new google.maps.LatLng(53.806023760331044, -1.5496831387281418),
//             new google.maps.LatLng(53.80623402256602, -1.549350544810295),
//             new google.maps.LatLng(53.80646764603473, -1.5490400791168213),
//             new google.maps.LatLng(53.80671235532296, -1.5488308668136597),
//             new google.maps.LatLng(53.80686123923953, -1.5486833453178406),
//             new google.maps.LatLng(53.80706397393536, -1.5489978343248367),
//             new google.maps.LatLng(53.80725364085883, -1.5493277460336685),
//             new google.maps.LatLng(53.80746983634724, -1.5497086197137833),
//             new google.maps.LatLng(53.80779848303097, -1.5502779185771942),
//             new google.maps.LatLng(53.808025762483624, -1.5506547689437866),
//             new google.maps.LatLng(53.80820592214986, -1.5509598702192307),
//             new google.maps.LatLng(53.80831837306555, -1.5511590242385864),
//             new google.maps.LatLng(53.80851357763601, -1.5516659617424011),
//             new google.maps.LatLng(53.80859791523213, -1.551874503493309),
//             new google.maps.LatLng(53.808737289666986, -1.5522070974111557),
//             new google.maps.LatLng(53.808819647069754, -1.5525028109550476),
//             new google.maps.LatLng(53.808887354236425, -1.5527066588401794),
//             new google.maps.LatLng(53.80895426939896, -1.5527763962745667),
//             new google.maps.LatLng(53.808974462711035, -1.552799865603447),
//             new google.maps.LatLng(53.8090671142536, -1.5529480576515198),
//             new google.maps.LatLng(53.80919817228245, -1.553187444806099),
//             new google.maps.LatLng(53.809306661096066, -1.5533966571092606),
//             new google.maps.LatLng(53.809454743914046, -1.5537245571613312),
//             new google.maps.LatLng(53.80955016598751, -1.5539585798978806),
//             new google.maps.LatLng(53.80963014614733, -1.5541979670524597),
//             new google.maps.LatLng(53.809729527222416, -1.5544936805963516),
//             new google.maps.LatLng(53.80979446134341, -1.5546881407499313),
//             new google.maps.LatLng(53.80987087758865, -1.5549422800540924),
//             new google.maps.LatLng(53.80994531400451, -1.555195078253746),
//             new google.maps.LatLng(53.81006251149775, -1.55550017952919),
//             new google.maps.LatLng(53.810136947573305, -1.5556497126817703),
//             new google.maps.LatLng(53.81025770794665, -1.5558233857154846),
//             new google.maps.LatLng(53.81039747279686, -1.5559836477041245),
//             new google.maps.LatLng(53.81053169412654, -1.5561351925134659),
//             new google.maps.LatLng(53.81062632188536, -1.5562444925308228),
//             new google.maps.LatLng(53.8106983813743, -1.556425541639328),
//             new google.maps.LatLng(53.81059623107308, -1.5566857159137726),
//             new google.maps.LatLng(53.810513085295305, -1.5569043159484863),
//             new google.maps.LatLng(53.81069758951244, -1.5564268827438354),
//             new google.maps.LatLng(53.810577226338424, -1.5567366778850555),
//             new google.maps.LatLng(53.81048220253582, -1.556990146636963)
//         ];

//         var line = new google.maps.Polyline({
//             path: campusOutlineCoordinates,
//             strokeOpacity: 0.8,
//             strokeColor: '#a97e4f',
//             map: map
//         });

//         var pathCampus = new google.maps.Polyline({
//             path: campusOutlineCoordinates,
//             geodesic: false,
//             strokeColor: '#c4a480',
//             strokeOpacity: 0.6,
//             strokeWeight: 10,
//             visible: true
//         });

//         pathCampus.setMap(map);


//     }






//     var style1 = [{
//         "elementType": "geometry",
//         "stylers": [{
//             "hue": "#ff4400"
//         }, {
//             "saturation": -68
//         }, {
//             "lightness": -4
//         }, {
//             "gamma": 0.72
//         }]
//     }, {
//         "featureType": "road",
//         "elementType": "labels.icon"
//     }, {
//         "featureType": "landscape.man_made",
//         "elementType": "geometry",
//         "stylers": [{
//             "hue": "#0077ff"
//         }, {
//             "gamma": 3.1
//         }]
//     }, {
//         "featureType": "water",
//         "stylers": [{
//             "hue": "#00ccff"
//         }, {
//             "gamma": 0.44
//         }, {
//             "saturation": -33
//         }]
//     }, {
//         "featureType": "poi.park",
//         "stylers": [{
//             "hue": "#44ff00"
//         }, {
//             "saturation": -23
//         }]
//     }, {
//         "featureType": "water",
//         "elementType": "labels.text.fill",
//         "stylers": [{
//             "hue": "#007fff"
//         }, {
//             "gamma": 0.77
//         }, {
//             "saturation": 65
//         }, {
//             "lightness": 99
//         }]
//     }, {
//         "featureType": "water",
//         "elementType": "labels.text.stroke",
//         "stylers": [{
//             "gamma": 0.11
//         }, {
//             "weight": 5.6
//         }, {
//             "saturation": 99
//         }, {
//             "hue": "#0091ff"
//         }, {
//             "lightness": -86
//         }]
//     }, {
//         "featureType": "transit.line",
//         "elementType": "geometry",
//         "stylers": [{
//             "lightness": -48
//         }, {
//             "hue": "#ff5e00"
//         }, {
//             "gamma": 1.2
//         }, {
//             "saturation": -23
//         }]
//     }, {
//         "featureType": "transit",
//         "elementType": "labels.text.stroke",
//         "stylers": [{
//             "saturation": -64
//         }, {
//             "hue": "#ff9100"
//         }, {
//             "lightness": 16
//         }, {
//             "gamma": 0.47
//         }, {
//             "weight": 2.7
//         }]
//     }];
//     var style2 = [{
//         "featureType": "water",
//         "elementType": "geometry",
//         "stylers": [{
//             "color": "#e9e9e9"
//         }, {
//             "lightness": 17
//         }]
//     }, {
//         "featureType": "landscape",
//         "elementType": "geometry",
//         "stylers": [{
//             "color": "#f5f5f5"
//         }, {
//             "lightness": 20
//         }]
//     }, {
//         "featureType": "road.highway",
//         "elementType": "geometry.fill",
//         "stylers": [{
//             "color": "#ffffff"
//         }, {
//             "lightness": 17
//         }]
//     }, {
//         "featureType": "road.highway",
//         "elementType": "geometry.stroke",
//         "stylers": [{
//             "color": "#ffffff"
//         }, {
//             "lightness": 29
//         }, {
//             "weight": 0.2
//         }]
//     }, {
//         "featureType": "road.arterial",
//         "elementType": "geometry",
//         "stylers": [{
//             "color": "#ffffff"
//         }, {
//             "lightness": 18
//         }]
//     }, {
//         "featureType": "road.local",
//         "elementType": "geometry",
//         "stylers": [{
//             "color": "#ffffff"
//         }, {
//             "lightness": 16
//         }]
//     }, {
//         "featureType": "poi",
//         "elementType": "geometry",
//         "stylers": [{
//             "color": "#f5f5f5"
//         }, {
//             "lightness": 21
//         }]
//     }, {
//         "featureType": "poi.park",
//         "elementType": "geometry",
//         "stylers": [{
//             "color": "#9CBA7F",
//             "visibility": "on"
//         }, {
//             "lightness": 40
//         }]
//     }, {
//         "elementType": "labels.text.stroke",
//         "stylers": [{
//             "visibility": "on"
//         }, {
//             "color": "#000"
//         }, {
//             "lightness": 1
//         }]
//     }, {
//         "elementType": "labels.text.fill",
//         "stylers": [{
//             "saturation": 36
//         }, {
//             "color": "#333333"
//         }, {
//             "lightness": 12
//         }]
//     }, {
//         "elementType": "labels.icon",
//         "stylers": [{
//             "visibility": "off"
//         }]
//     }, {
//         "featureType": "transit",
//         "elementType": "geometry",
//         "stylers": [{
//             "color": "#f2f2f2"
//         }, {
//             "lightness": 1
//         }]
//     }, {
//         "featureType": "administrative",
//         "elementType": "geometry.fill",
//         "stylers": [{
//             "color": "#fefefe"
//         }, {
//             "lightness": 20
//         }]
//     }, {
//         "featureType": "administrative",
//         "elementType": "geometry.stroke",
//         "stylers": [{
//             "color": "#fefefe"
//         }, {
//             "lightness": 17
//         }, {
//             "weight": 1.2
//         }]
//     }];


//     //
//     //=============================================================
//     //
//     // Set private defaults.
//     var Defaults = {
//         zoom: 16,
//         center: [53.81048220253582, -1.556990146636963],
//         campusOutline: false,
//         stylers: '',
//         scrollwheel: false //so when scrolling down the page the scroll doesn't get hi-jacked by the map
//             ,
//         markers: [],
//         markerArray: [],
//         routeOrigin: '',
//         multiInfoWindow : false,
//         onSuccess: function() {
//             //console.log(this.markerArray);
//         }
//     };
//     // Define the public api and its public methods.
//     var PluginApi = {
//         extend: function(name, method) {
//             PluginApi[name] = method;
//             return this;
//         },
//         init: function(PublicOptions) {
//             // Do a deep copy of the options.
//             var Options = $.extend(true, {}, Defaults, PublicOptions);
//             var mapOptions = {
//                 // How zoomed in you want the map to start at (always required)
//                 zoom: Options.zoom, // The latitude and longitude to center the map (always required)
//                 center: new google.maps.LatLng(Options.center[0], Options.center[1]), // New York
//                 // How you would like to style the map.
//                 // This is where you would paste any style found on Snazzy Maps.
//                 styles: Options.stylers,
//                 scrollwheel: Options.scrollwheel
//             };
//             return this.each(function() {
//                 // Get the HTML DOM element that will contain your map
//                 // We are using a div with id="map" seen below in the <body>
//                 var mapElement = this;
//                 // Create the Google Map using our element and options defined above
//                 var map = new google.maps.Map(mapElement, mapOptions);
//                 var infowindow = new google.maps.InfoWindow({
//                     content: ' ',
//                     pixelOffset: new google.maps.Size(0, -20) //offset the infowindow
//                 });

//                 //if campusoutline is true
//                 if (Options.campusOutline) {
//                     addCampusOutline(map);
//                 }

//                 //custom close infowindow functionality
//                 $(document).on("click", ".close-infowindow", function() {
//                     infowindow.close();
//                 });

//                 //PluginApi.initialMarker(map); //replace for a single marker
//                 PluginApi.streetViews(map);
//                 //add the markers to the map
//                 PluginApi.multiInfoWindow = Options.multiInfoWindow;
//                 PluginApi.processMarkers(map, Options.markers, Options.markerArray, infowindow);
//                 if (Options.routeOrigin != '') { //if route origin is not empty, set up ther routes
//                     PluginApi.mapRoutes(map, Options.routeOrigin);
//                 }

//                 /* Set center add reset */
//                 PluginApi.resetMap(map,Options.center[0], Options.center[1],Options.zoom);

//             });
//         },

//         resetMap : function(map,lat,lng,zoomLevel){
//           $(document).on("click", ".reset-map", function() {
//               var latLng = new google.maps.LatLng(lat, lng);
//               map.panTo(latLng);
//               map.setZoom(zoomLevel);
//           });
//         },

//         streetViews: function(map) {
//             //get the location, heading, pitch, zoom
//             var panorama = map.getStreetView();
//             $('[data-location]').click(function() {
//                 var dest = $(this).data("location").split(',');
//                 var latLng = new google.maps.LatLng(dest[0], dest[1])
//                 panorama.setPosition(latLng);
//                 panorama.setPov({
//                     heading: 45,
//                     pitch: -10,
//                     zoom: -10
//                 });
//                 panorama.setVisible(true);
//                 return false;
//             });
//         },
//         //allow user to view routes
//         mapRoutes: function(map, routeStart) {
//             this.routeStart = routeStart;
//             //set the polyline style
//             var polylineOptionsActual = new google.maps.Polyline({
//                 strokeColor: 'blue',
//                 strokeOpacity: .5,
//                 strokeWeight: 5
//             });

//             var directionsDisplay = new google.maps.DirectionsRenderer({
//                 suppressMarkers: false,
//                 polylineOptions: polylineOptionsActual
//             });
//             var directionsService = new google.maps.DirectionsService;
//             directionsDisplay.setMap(map);
//             directionsDisplay.setMap(null); //hide the initial path by default

//             //If you need an event to be fired on directions changed, use this listener/handler
//             // google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
//             //
//             // });

//             //show/hide route via toggle
//             function showPath() {
//                 if (!directionsDisplay.getMap()) {
//                     directionsDisplay.setMap(map);
//                 }
//                 //If you need to toggle the visiblity use:
//                 // if (directionsDisplay.getMap()) {
//                 //     directionsDisplay.setMap(null);
//                 // } else {
//                 //     directionsDisplay.setMap(map);
//                 // }
//             }

//             function closeInfoWinow(){
//               //get the active marker
//               for(var i = 0; i < PluginApi.getMarkerArray.length; i++){
//                 if(PluginApi.getMarkerArray[i].visible){
//                   PluginApi.getMarkerArray[i].infowindow.close();
//                 }
//               }
//             }

//             function getRoute() {
//                 var dest = $('#dest').find(":selected").val().split(',');
//                 if (dest != 0) {
//                     PluginApi.calculateAndDisplayRoute(directionsService, directionsDisplay, dest[0], dest[1]);
//                 }
//             }
//             getRoute(); //call on load

//             //on route select change calculate the route
//             document.getElementById('mode').addEventListener('change', function() {
//                 closeInfoWinow();
//                 if($('#mode').find(":selected").val() != 0){
//                   //if dest is set to 0, set it to the first destination
//                   if ($('#dest').find(":selected").val() == 0) {
//                       $("#dest").prop("selectedIndex", 1);
//                   }
//                   showPath();
//                   getRoute();
//                 }
//             });
//             document.getElementById('dest').addEventListener('change', function() {
//               closeInfoWinow();
//               //if mode is set to 0, set it to the first mode of transport to prevent error
//               if($('#mode').find(":selected").val() == 0){
//                 $("#mode").prop("selectedIndex", 1);
//               }
//                 showPath();
//                 getRoute();
//             });
//         },
//         calculateAndDisplayRoute: function(directionsService, directionsDisplay, lat, lng) {
//             var selectedMode = document.getElementById('mode').value;
//             directionsService.route({
//                 origin: {
//                     lat: this.routeStart[0],
//                     lng: this.routeStart[1]
//                 },
//                 destination: {
//                     lat: parseFloat(lat),
//                     lng: parseFloat(lng)
//                 },
//                 travelMode: google.maps.TravelMode[selectedMode]
//             }, function(response, status) {
//                 if (status == 'OK') {
//                     directionsDisplay.setDirections(response);
//                 } else {
//                     window.alert('Directions request failed due to ' + status);
//                 }
//             });
//         },
//         processMarkers: function(map, markers, markerArray, infowindow) {
//             for (var i = 0; i < markers["locations"].length; i++) {
//                 PluginApi.addMarker(map, markerArray, infowindow, markers["locations"][i]["lat"], markers["locations"][i]["lng"], markers["locations"][i]["icon"], markers["locations"][i]["label"], markers["locations"][i]["text"], markers["locations"][i]["groupType"], markers["locations"][i]["id"], markers["locations"][i]["infoWindowOpen"]);
//             }
//             //make the processed array available
//             PluginApi.getMarkerArray = markerArray;
//         },
//         getMarkerArray: function() {},
//         toggleMarkerGroup: function(thisType) {
//             var markerArray = PluginApi.getMarkerArray;
//             for (var i = 0; i < markerArray.length; i++) {
//                 if (markerArray[i].type == thisType) {
//                     if (markerArray[i].getVisible()) {
//                         markerArray[i].setVisible(false)
//                     } else {
//                         markerArray[i].setVisible(true)
//                     }
//                 }
//             }
//         },
//         addMarker: function(map, markerArray, infowindow, lat, lng, iconURL, markerTitle, markerText, markerType, markerID, infoWindowOpen) {

//             var pinImage = {
//                 url: './assets/img/accomodation/'+iconURL+'.png?v=1',
//                 size: new google.maps.Size(60, 83), // the orignal size
//                 scaledSize: new google.maps.Size(30, 42), // the new size you want to use
//                 origin: new google.maps.Point(0, 0),
//                 anchor: new google.maps.Point(0, 32) // position in the sprite
//             };

//             var marker = new mapMarker({
//                 position: new google.maps.LatLng(lat, lng),
//                 map: map,
//                 draggable: false,
//                 icon: pinImage,
//                 content: '<div class="marker" data-mapid="' + markerID + '"><img src="./assets/img/accomodation/' + iconURL + '.png?v=1" width="30" height="30"/><i class="map-icon grow"><span class="title"></span></i></div>',
//             });

//             //if multinfowindows are required
//             if(PluginApi.multiInfoWindow && infoWindowOpen){
//                infowindow = new google.maps.InfoWindow({
//                   content: ' ',
//                   //disableAutoPan : false, //prevents the initial pan around
//                   pixelOffset: new google.maps.Size(0, -20) //offset the infowindow
//               });
//             }

//             marker.set('type', markerType);
//             marker.set('id', markerID);
//             marker.set('infoWindowOpen', infoWindowOpen);
//             marker.text = "<div class='close-infowindow'>x</div><div class='marker-text'><h3 class='all-caps'>" + markerTitle + "</h3><p>" + markerText + "</p></div>";

//             google.maps.event.addListener(marker, 'click', function(markerType) {
//                 infowindow.setContent(marker.text)
//                 infowindow.open(map, marker);
//             });

//             marker.set('infowindow', infowindow); //so can access the info window outside of plugin via the marker
//             markerArray.push(marker);

//             if(PluginApi.multiInfoWindow && infoWindowOpen){
//               infowindow.setContent(marker.text)
//               infowindow.open(map, marker);
//             }
//         },
//         initialMarker: function(thisMap) {
//           //if you need to set an initial marker
//             //var marker = new google.maps.Marker({
//             //  position: new google.maps.LatLng(53.81048220253582, -1.556990146636963)
//             //  , map: thisMap
//             //  , title: ''
//             //  });
//             return this;
//         },
//     };

//     // Create the plugin name and defaults once
//     var pluginName = 'GoogleMap';
//     // Attach the plugin to jQuery namespace.
//     $.fn[pluginName] = function(method) {
//         if (PluginApi[method]) {
//             return PluginApi[method].apply(this, Array.prototype.slice.call(arguments, 1));
//         } else if (typeof method === 'object' || !method) {
//             //init()
//             return PluginApi.init.apply(this, arguments);
//         } else {
//             $.error('Method ' + method + 'does not exist');
//         }
//     };
//     //call the plugin
//     if ($('#map').length) {
//         console.log("map ready");
//         var createMap = $('#map').GoogleMap({
//             stylers: style2,
//             zoom: 16,
//             campusOutline: true,
//             markers: maplocations,
//             multiInfoWindow : true,
//             center : [53.805568, -1.554319]
//             // routeOrigin: [53.817549, -1.566720] //uncommment this line if you are using route calculations
//         });
//     }

//     /*
//         ACCOMODATION SPECIFIC PLUGIN EXTEND:
//     */
//     //If is the main residence location center and open the infowindow
//     $('#map').GoogleMap('extend', 'setMarkerVisibility', function() {
//         var markerArray = PluginApi.getMarkerArray;
//         for (var i = 0; i < markerArray.length; i++) {
//           /*
//             set the visibility of the icon
//           */
//             if (markerArray[i].type != 'residence') {
//                 markerArray[i].setVisible(false);
//                 if(markerArray[i].infoWindowOpen === true){
//                   markerArray[i].setVisible(true);
//                 }
//             } else {
//                 //markerArray[i].map.setCenter(new google.maps.LatLng(markerArray[i].position.lat(), markerArray[i].position.lng()));
//                 //if is the residence marker
//                 markerArray[i].infowindow.setContent(markerArray[i].text)
//                 markerArray[i].infowindow.open(markerArray[i].map, markerArray[i]);
//             }
//         }
//     }).GoogleMap('setMarkerVisibility');

//     //OVERWRITE the toggleMarkerGroup functionality for accommodation specific requirements
//     $('#map').GoogleMap('extend', 'toggleMarkerGroup', function(groupName) {
//         var markerArray = PluginApi.getMarkerArray;
//         for (var i = 0; i < markerArray.length; i++) {
//             if (groupName !== 'residence') {
//                 if (markerArray[i].type == groupName) {
//                     if (markerArray[i].getVisible()) {
//                         markerArray[i].setVisible(false);
//                         //if the currently open info window belongs to a marker to be hidden, close the infowindow
//                         if(markerArray[i].infowindow.position != undefined){
//                           if (markerArray[i].infowindow.position.lat() == markerArray[i].position.lat()) {
//                               markerArray[i].infowindow.close();
//                           }
//                         }

//                     } else {
//                         markerArray[i].setVisible(true);
//                     }
//                 }
//             } else {
//                 if (groupName == 'residence' && markerArray[i].type == 'residence') {
//                     //If it is the residence marker do not hide it, but trigger the info window
//                     var thisMarker = markerArray[i];
//                     setTimeout(function() {
//                         google.maps.event.trigger(thisMarker, 'click');
//                     }, 10);
//                 }
//             }
//         }
//     }).GoogleMap('toggleMarkerGroup');

//     //bind class to toggle groups on/off to the .togglegroup class
//     $('.toggleMarkergroup').click(function() {
//         var groupType = $(this).data('group');
//         PluginApi.toggleMarkerGroup(groupType);
//         //If it is not the main residence, toggle the button active class
//         if (groupType != 'residence') {
//             $(this).toggleClass('active');
//         }

//         // var groupTitle = $(this).data('title');
//         // var groupText = $(this).data('text');
//         //$(window).trigger('resize');
//     });



// }(jQuery);

// /**
//  * acc-responsive-tabs.js  
//  */

// + function ($) {
//     'use strict';

//     //TEUXDEUX FIX THIS RESPONSIVE TABS

//     /**
//      * Responsive tabs - Compares the width of the tabs to the width of the screen and switches to a drop down depending on the available space
//      get the initial max width? won't work if font re-sizes then the max on larger screens won't be calcultaed on initial load
//      */

//     function createDropDown() {
//         //dynamically create dropdown from responsive-tabs
//         var i = 0;
//         var dropDown = '<div class="select_wrapper hide p-l p-r"><select class="select-dark">';
//         $(".nav-tabs-responsive").children('li').each(function (index, value) {
//             var thisTitle = $(this).find('a').html();
//             var thisLink = $(this).find('a').attr('href');
//             $(this).attr('tabindex', i + 1);
//             dropDown += '<option value="' + thisLink + '">' + thisTitle + '</option>';
//         });
//         dropDown += '</select></div>';
//         $('.tabs-header').append(dropDown);
//     }

//     if ($('.nav-tabs-responsive').length) {
//         createDropDown();
//         switchNavigation();
//     };

//     $('.select_wrapper select').on('change', function () {
//         var selected = $(this).val();
//         $('a[href$="' + selected + '"]').trigger("click");
//     });

//     //Check when it is the end of user resizing
//     var rtime;
//     var timeout = false;
//     var delta = 200;
//     $(window).resize(function () {
//         rtime = new Date();
//         if (timeout === false) {
//             timeout = true;
//             setTimeout(resizeend, delta);
//         }
//     });

//     function resizeend() {
//         if (new Date() - rtime < delta) {
//             setTimeout(resizeend, delta);
//         } else {
//             //Done resizing
//             timeout = false;
//             switchNavigation();
//         }
//     }

//     //if the tabs exceed the screen width, convert to select list
//     function switchNavigation() {
//         var listWidth = $('.nav-tabs-responsive').innerWidth();
//         if (!$('.nav-tabs-responsive').hasClass('hide') && listWidth >= window.innerWidth) {
//             $('.select_wrapper').removeClass('hide');
//             //hide visually only so the size can be calculated
//             $('.nav-tabs-responsive').css('display','none');
//         } else {
//             $('.select_wrapper').addClass('hide');
//             $('.nav-tabs-responsive').css('display','block');
//         }
//     }

// }(jQuery);
