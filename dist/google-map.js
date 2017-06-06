
// on window load init our toolkit map -> https://developers.google.com/maps/documentation/javascript/events#DomEvents
// google.maps.event.addDomListener(window, 'load', toolkitMap.init({
// 	//mapCenterLat : 7.823426,
//     //mapCenterLng : 21.893232,
//     zoom : 2
          
// }));
     
// $(function(){

// 	var intro = "Different types of study abroad programme offer different destinations. Use the map to explore each partner institution. Please note that school destinations are added when you choose a faculty."

// 	//toolkitMap.openFlyout(intro);

// 	var arrayMarkers = (function() {
// 	    var json = null;
// 	    $.ajax({
// 	        'async': false,
// 	        'global': false,
// 	        'url': './json/map-markers.json',
// 	        'dataType': 'json',
// 	        'success': function (data) {
// 	            json = data;
// 	        }
// 	    });
// 	    return json;
// 	})();   	
	
// 	toolkitMap.mapMarkers(arrayMarkers);

// 	toolkitMap.hideMarkers('default');

// });

// /* Triggers */	

// $('.map-markers').click(function(){

// 	var arrayMarkers = (function() {
// 	    var json = null;
// 	    $.ajax({
// 	        'async': false,
// 	        'global': false,
// 	        'url': './json/map-markers.json',
// 	        'dataType': 'json',
// 	        'success': function (data) {
// 	            json = data;
// 	        }
// 	    });
// 	    return json;
// 	})();   	
	
// 	toolkitMap.mapMarkers(arrayMarkers);
	
// 	return false;

// });

// $('.map-markers2').click(function(){

// 	var arrayMarkers2 = (function() {
// 	    var json = null;
// 	    $.ajax({
// 	        'async': false,
// 	        'global': false,
// 	        'url': './json/map-markers2.json',
// 	        'dataType': 'json',
// 	        'success': function (data) {
// 	            json = data;
// 	        }
// 	    });
// 	    return json;
// 	})();   	
	
// 	toolkitMap.mapMarkers(arrayMarkers2);
	
// 	return false;

// });

// $('.go-to-marker').click(function(){

// 	var thisText = $(this).text();		

// 	toolkitMap.goToMarker(thisText);
	
// 	return false;

// });

// $('.show-markers').click(function(){
	
// 	toolkitMap.showMarkers();
	
// 	return false;

// });

// $('.clear-markers').click(function(){
	
// 	toolkitMap.hideMarkers();
	
// 	return false;

// });

// $('.show-some-markers').click(function(){
	
// 	toolkitMap.showMarkers('default');
	
// 	return false;

// });

// $('.clear-some-markers').click(function(){
	
// 	toolkitMap.hideMarkers('default');
	
// 	return false;

// });






/*------------------------------------*\

   $MAP

\*------------------------------------*/

var bigscreen = 1600;
var smallScreen = 570;

//Detect iOS
var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),
iOSversion = false;

if( iOS === true){
    //$('html').addClass('iOS');
}

//create persistent footer
// $('.wrapper--fixed').after('<div class="persistent-footer"><span class="close-map">&lt; Return to University List</span></div>');




    // var hash = window.location.hash.split('-');
    // var tabnumber = hash[1];





$(document).on('click', '.uni-details', function(event) {
    // var uniDetails = $(".uni-title:contains('" + $(this).data('name') + "')").next('div').html();
    // $('.info-window').html(
    //     '<div class="close close--map"></div>' +
    //     '<h2 class="heading heading--overview-main">' + $(this).data('name') + '</h2>' +
    //     uniDetails
    // ).fadeIn(200, function() {
    //     $(this).addClass('active');
    // });
    // positionInfoBox();
    
    

});

$('.uni-title').click(function(){
	
});

// $(document).on('click', '#googlemap', function(event) {
//     if ($('.info-window').hasClass('active')) {
//         closeMapInfo();
//     }
// });

// function clearOverlays() {
//     if (gMarkers) {
//         for (i in gMarkers) {
//             gMarkers[i].setMap(null);
//         }
//     }
//     locations = [];
// }

// function availableHeight() {
//     var availableHeight = $(window).height() - 150;
//     return availableHeight;
// }

// function setInfoHeight() {
//     $('.info-window').css({
//         height: availableHeight()
//     });
// }

// $(document).on('click', '.list-group ul li', function(event) {
//     closeMapInfo();

//     var uniTitle = $(this).find('.uni-title').html();
//     google.maps.event.trigger(gmarkers[uniTitle], 'click');
//     map.setZoom(3);

//     for (var i = 0; i < locations.length; i++) {
//         if (locations[i][2] == uniTitle) {
//             var lat = locations[i][0];
//             var lng = locations[i][1];
//         }
//     }

//     map.setCenter(new google.maps.LatLng(lat, lng));

//     $(window).trigger('resize');
//     if ($('body').hasClass('small-screen')) {
//         setInfoHeight();
//         openMap();
//         //calculate the height of the overlay
//     } else {
//         $('html,body').animate({
//             scrollTop: $('#googlemap').offset().top - 200
//         }, 'slow');
//     }

//     if (iOS === true) {
//         if (!$(window).width() <= smallScreen) {
//             scroller1.scrollToElement('#googlemap', 500, 0, -200);
//             if ($('body').hasClass('small-screen')) {
//                 scroller1.disable();
//             }
//         }
//     }
//     return false;
// });

// $(document).on('click', '.close--map', function(event) {
//     closeMapInfo();
// });

// function setMobileMap() {
//     if ($(window).width() <= smallScreen) {
//         var mapHeight = $(window).height();
//         $('#googlemap, .map-wrapper').css('height', mapHeight);
//     } else {
//         $('.map-wrapper').css('height', 465);
//         $('#googlemap').css('height', 500);
//         $('body').removeClass('map-open');
//     }
// }

// if ($('body').hasClass('small-screen')) {
//     setMobileMap();
// }

// $(window).resize(function() {
//     setMobileMap();
// });

// function closeMapInfo() {
//     $('.info-window').fadeOut(200, function() {
//         $('.info-window').removeClass('active start');
//     });
// }

// function positionInfoBox() {
//     if (!$(window).width() <= smallScreen) {
//         positionBoxLarge();
//     }
// }

// $(window).resize(function() {
//     positionInfoBox();
// });

// function positionBoxLarge() {
//     var winHeight = $("#googlemap").height(),
//         navHeight = $('.info-window').height(),
//         navTop = (winHeight - navHeight) / 2;
//     if (winHeight <= navHeight + 60) {
//         $('.info-window').css('top', '20px');
//     } else {
//         $('.info-window').css('top', '20px');
//     }
//     $('.info-window').css('top', (navTop - 55));

//     if (navTop <= 25) {
//         $('.info-window').css('top', 5);
//     }
// }

// positionInfoBox();

// //mobile map funcionality

// function closeMap() {
//     closeMapInfo();
//     $('body').removeClass('map-open');
//     if (iOS === true) {
//         scroller1.enable();
//         scroller1.refresh();
//     }
// }

// function setScreenClass() {
//     if ($(window).width() <= smallScreen) {
//         $('body').addClass('small-screen');
//     } else {
//         $('body').removeClass('small-screen');
//     }
// }

// $(window).resize(function() {
//     setScreenClass();
// });

// setScreenClass();

// function openMap() {
//     $('body').addClass('map-open');
// }

// function zoomIn() {
//     map.setZoom(2);
// }

// function getZoomLevel() {
//     return map.getZoom();
// }

// $('.close-map').click(function() {
//     closeMap();
//     if (iOS === true) {
//         scroller1.enable();
//     }
// });

// $('#zoom-in').click(function() {
//     var newZoomLevel = getZoomLevel() + 1;
//     map.setZoom(newZoomLevel);
// });

// $('#zoom-out').click(function() {
//     var newZoomLevel = getZoomLevel() - 1;
//     map.setZoom(newZoomLevel);
// });






//IFEE 
var toolkitMap = (function(){       

    /** 
     * Default settings
     */

    var self = this,
    	mapObj, // the google map obj      	        	
    	markersArray = [], //used to store markers created
    	mapTypeId = 'custom_style';  

    /* Default settings - overwritten by init if object passed */        	

    self.settings = {
        el : '#googlemap', //default element        
        iconDir : './assets/dist/img/', //directory for marker icons
        mapCenterLat : 53.801277,
        mapCenterLng : -1.548567,
        zoom : 15,            
        markers : [ // one default marker
			{
				'id' : 'defaultLeeds', // required (must be unique)
		        'lat': '54.801277', // required
		        'lng': '-1.548567', // required
		        'title': 'University of Leeds',
		        'type' : 'default',
		        'html' : '<span>Default marker</span>',
                'icon' : 'local-essentials'
		    }	    
		]   			
    };

    /**
     * Init
     */

    var init = function(settings) {			
		$.extend( self.settings, settings ); // Allow overriding of the default settings
	    setupMap();			  			        
	    mapMarkers(self.settings.markers);		   		   		            
	}        

    /**
     * Map setup
     */		
    	   	               	
    var setupMap = function(){

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
	   
    }

    var addCustomStyle = function(){

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
			}, {}],
            {name: 'Styled Map'});		    

	   	//Associate the styled map with the MapTypeId and set it to display.
        mapObj.mapTypes.set('styled_map', styledMapType);
        mapObj.setMapTypeId('styled_map');
    }

    /**
     * Map polyline ie shapes
     */

        //put coordinates into Array and loop through
    var mapPolyline = function(jsonCoordinates) {

        if(jsonCoordinates !== undefined){

            var coords = jsonCoordinates,
                coordsArray = [];
               
            for(i in coords){
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

    }



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

        marker.set('type',type);
        marker.set('id', id);

        // Info window tied to specific marker
       	createInfoWindow(marker, html);

        return marker;
    }

    // Creates a info window tied to a marker
    var createInfoWindow = function(marker, html){
    	
		//  Info windows: Display content (usually text or images) in a popup window above the map, at a given location. 
        infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div class="gm-info-window">' + html + '</div>');
            infowindow.open(mapObj, marker);
        });

    }
	
	// For each marker in markers call buildMarker and store on markersArray  	
    var mapMarkers = function(markers){ 	 

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
    }		   


    //Hide markers by type
    var hideMarkers = function(type) {	    
        for (i in markersArray) {
        	if(type) {
	        	if (markersArray[i].type === type) {
	            	//markersArray[i].setMap(null);
	            	markersArray[i].setVisible(false);
	            }
	        } else {
	        	markersArray[i].setVisible(false);
	        }
        }	    	    
	}

    //Show markers by type
	var showMarkers = function(type) {
	    for (i in markersArray) {
	    	if(type) {
		    	if (markersArray[i].type === type) { //
		            markersArray[i].setVisible(true);
		        }
		    } else {
	       		markersArray[i].setVisible(true);
	    	}     
	    } 
	}

    //Show and hide markers by type
    var toggleMarkers = function(type){

        for (i in markersArray) {

            if(type) {
                if (markersArray[i].type === type) { //
                    if(!markersArray[i].getVisible()){
                        markersArray[i].setVisible(true);
                    } else {
                        markersArray[i].setVisible(false);
                    }
                }
            } else { // refactor to make toggle without a type show all first then hide
                if(!markersArray[i].getVisible()){
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
    }

    //Single marker methods

    //Centers marker on map and shows is it by ID
    var goToMarker = function(id){    
              
        // Set marker on map (if hidden or something)
        markersArray[id].setMap(mapObj); //Should this be just map and show or map?           
        // Set the map to the location of the marker
        setMapCenter(markersArray[id].position.lat(), markersArray[id].position.lng());         
        // Set zoom to settings
        setZoom(self.settings.zoom);
    }

    // Trigger click event on marker (open info window) by ID 
    var triggerMarker = function(id){ 
        google.maps.event.trigger(markersArray[id], 'click');     
        goToMarker(id);
    };

    /**
     * Map events
     */

    var setMapCenter = function(lat,lng){
		mapObj.setCenter(new google.maps.LatLng(lat, lng));	    	
    }

    var setZoom = function(zoom){
		mapObj.setZoom(zoom);
    }

    /**
     * Map flyouts
     */

    var showFlyout = function(content){

    	var flyout = '<div class="gm-flyout">'+
          '<a href="#" class="gm-flyout-close">close</a>'+
          '<div class="gm-flyout-content">'+ content +               
          '</div>'+
        '</div>';

        $('.gm-wrapper').append(flyout);

        //console.log(flyout);

        $('.gm-flyout-close').click(function(){
        	$(this).parent().remove();
        });

    }

    var closeFlyout = function(){

    }	  

    var setIcon = function(){

    };

    var showInfoWIndow = function(){ //or trigger click

    };
	
	return {
		init : init,
		showFlyout : showFlyout,
        mapMarkers : mapMarkers,		
		hideMarkers : hideMarkers,		
		showMarkers : showMarkers,		   		   		    
        toggleMarkers : toggleMarkers,
        goToMarker : goToMarker,
        triggerMarker : triggerMarker,
        mapPolyline : mapPolyline
		// go to marker
		// remove all markers
		// add new set of markers
	};

}());
