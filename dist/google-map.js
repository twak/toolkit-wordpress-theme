
     
$(function(){

	var intro = "Different types of study abroad programme offer different destinations. Use the map to explore each partner institution. Please note that school destinations are added when you choose a faculty."

	toolkitMap.openFlyout(intro);

});

/* Triggers */	

$('.map-markers').click(function(){

	var arrayMarkers = (function() {
	    var json = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': './json/map-markers.json',
	        'dataType': 'json',
	        'success': function (data) {
	            json = data;
	        }
	    });
	    return json;
	})();   	
	
	toolkitMap.mapMarkers(arrayMarkers);
	
	return false;

});

$('.map-markers2').click(function(){

	var arrayMarkers2 = (function() {
	    var json = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': './json/map-markers2.json',
	        'dataType': 'json',
	        'success': function (data) {
	            json = data;
	        }
	    });
	    return json;
	})();   	
	
	toolkitMap.mapMarkers(arrayMarkers2);
	
	return false;

});

$('.go-to-marker').click(function(){

	var thisText = $(this).text();		

	toolkitMap.goToMarker(thisText);
	
	return false;

});

$('.show-markers').click(function(){
	
	toolkitMap.showMarkers();
	
	return false;

});

$('.clear-markers').click(function(){
	
	toolkitMap.hideMarkers();
	
	return false;

});

$('.show-some-markers').click(function(){
	
	toolkitMap.showMarkers('default');
	
	return false;

});

$('.clear-some-markers').click(function(){
	
	toolkitMap.hideMarkers('default');
	
	return false;

});






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

// $(document).on('click', '#map', function(event) {
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
//             scrollTop: $('#map').offset().top - 200
//         }, 'slow');
//     }

//     if (iOS === true) {
//         if (!$(window).width() <= smallScreen) {
//             scroller1.scrollToElement('#map', 500, 0, -200);
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
//         $('#map, .map-wrapper').css('height', mapHeight);
//     } else {
//         $('.map-wrapper').css('height', 465);
//         $('#map').css('height', 500);
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
//     var winHeight = $("#map").height(),
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
    	map, // the map 	        	        	
    	markersArray = [], //used to store markers but for other uses
    	mapTypeId = 'custom_style';        	

    self.settings = {
        el : '#map',             
        iconDir : '/assets/img/',
        mapCenterLat : 53.801277,
        mapCenterLng : -1.548567,
        zoom : 15,            
        markers : [ //default marker
			{
				'id' : 'defaultLeeds', // required fields
		        'lat': '54.801277', // required
		        'lng': '-1.548567', // required
		        'title': 'University of Leeds',
		        'type' : 'default',
		        'html' : '<span>Default marker</span>'
		    }	    
		]   			
    };

    /**
     * Init
     */

    function init(settings) {			
		$.extend( self.settings, settings ); // Allow overriding of the default settings
	    setupMap();			  			  			 			  			    
	    mapMarkers(self.settings.markers);		   		   		    
	}        

    /**
     * Map setup
     */		
    	   	               	
    function setupMap(){

    	// Default API map setup
    	map = new google.maps.Map(document.querySelector(self.settings.el), {
	        zoom: self.settings.zoom,
	        scrollwheel: false,
	        panControl: false,
	        zoomControl: true,
	        mapTypeControl: false, 
	        scaleControl: false,
	        streetViewControl: false,
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

    function addCustomStyle(){

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
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');
    }

    /**
     * Markers handling 
     */
	
	// Returns a marker with and info window
	function addMarker(latlng, html, id, type) {			

		//Default icon
		var icon = icon || 'residence.png';

		//Create new marker
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: self.settings.iconDir + icon
        });

        marker.set('type',type);
        marker.set('id', id);

        // Info window tied to specific marker
       	createInfoWindow(marker, html);

        return marker;
    }

    // Creates a info window tied to a marker
    function createInfoWindow(marker, html){

    	// Info windows
		// Display content (usually text or images) in a popup window above the map, at a given location. 
        infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div class="gm-info-window">' + html + '</div>');
            infowindow.open(map, marker);
        });

    }
	
	// For each marker in markers call addMarker and store on markersArray  	
    function mapMarkers(markers){ 	 

    	deleteMarkers();

    	for (var i = 0; i < markers.length; i++) {
    		var id = markers[i]['id'],
    			type = markers[i]['type'],
    			lat = markers[i]['lat'],
    			long = markers[i]['lng'],	    			
    			title = markers[i]['title'],
    			html = markers[i]['html'], // if not set
    			latlong = new google.maps.LatLng(lat, long),
    			markerContent = '';

    			// if title or html is set add to marker content
    			markerContent += (title) ? '<strong class="title">' + title + '</strong>' : '';
    			markerContent += (html) ? '<span class="content">' + html + '</span>' : '';	    				    		

    			// Call addMarker() but also and store in markersArray for other uses
	        	markersArray[id] = addMarker(latlong, markerContent, id, type);
	    }

	    //console.log(markersArray);
    }		   

    function hideMarkers(type) {	    
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

	function showMarkers(type) {				
	    for (i in markersArray) {
	    	if(type) {
		    	if (markersArray[i].type === type) {
		            markersArray[i].setVisible(true);
		        }
		    } else {
	       		markersArray[i].setVisible(true);
	    	}     
	    } 
	}

	// Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
    	for (i in markersArray) {        	
        	markersArray[i].setMap(null);
        	//markersArray[i].setVisible(false);            
        }	
    	markersArray = [];
    }

    /**
     * Map events
     */

    function goToMarker(id){	   
    	//Trigger click event (opne info window)
    	google.maps.event.trigger(markersArray[id], 'click'); 	
    	// Set marker on map (if hidden or something)
    	markersArray[id].setMap(map);	    	
    	// Set the map to the location of the marker
    	setMapCenter(markersArray[id].position.lat(), markersArray[id].position.lng());	    	
    }

    function setMapCenter(lat,lng){
		map.setCenter(new google.maps.LatLng(lat, lng));	    	
    }

    function setZoom(zoom){
		map.setZoom(zoom);
    }

    /**
     * Map flyouts
     */

    function openFlyout(content){

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

    function closeFlyout(){

    }	  
	
	return {
		init : init,
		openFlyout : openFlyout,
		goToMarker : goToMarker,
		hideMarkers : hideMarkers,
		mapMarkers : mapMarkers,
		showMarkers : showMarkers,		   		   		    
		// go to marker
		// remove all markers
		// add new set of markers
	};

}());


// on window load init our toolkit map -> https://developers.google.com/maps/documentation/javascript/events#DomEvents
google.maps.event.addDomListener(window, 'load', toolkitMap.init({
	//mapCenterLat : 7.823426,
    //mapCenterLng : 21.893232,
    zoom : 2
          
}));

