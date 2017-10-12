/**
 * admin javascript for toolkit theme
 */

// actions on Advanced Custom Fields
(function($){
    // ensures news and events checkboxes in the News Events and Posts widget
    // are disabled when the plugins aren't present
	var newsEventsCheckboxes = function(){
        if (tkadmin && tkadmin.news_plugin !== "1" ) {
            $('[data-name="news_events_widget_options"] input[value="news"]').prop('disabled', true);
        }
        if (tkadmin && tkadmin.events_plugin !== "1" ) {
            $('[data-name="news_events_widget_options"] input[value="events"]').prop('disabled', true);
        }
    },
    sharingCheckboxes = function(){
        // if none of the options is checked or disabled, check the hide option
        if (!$('[data-name="tk_social_media_sharing_links"] input:disabled').length && !$('[data-name="tk_social_media_sharing_links"] input:checkbox[value!="none"]').filter(':checked').length) {
            $('[data-name="tk_social_media_sharing_links"] input[value="none"]').prop('checked', true);
        }
        // if the hide checkbox is checked, disable all the others
        if ( $('[data-name="tk_social_media_sharing_links"] input[value="none"]').prop('checked')) {
            $('[data-name="tk_social_media_sharing_links"] input[value!="none"]').prop('disabled', true);
        } else {
            // if not, enable the others
            $('[data-name="tk_social_media_sharing_links"] input[value!="none"]').prop('disabled', false);
        }
    };

    $(document).ready(function(){
        if (typeof acf !== 'undefined') {
            // add selection logic to sharing checkboxes and widget checkboxes
            acf.add_action('ready', function(){
        		$('[data-name="tk_social_media_sharing_links"] input:checkbox').on('click', function(){
        			sharingCheckboxes();
        		});
        		sharingCheckboxes();
                newsEventsCheckboxes();
        	});

            // make sure news and events checkboxes are disabled when widget is added to page
            acf.add_action('append', function(){
                newsEventsCheckboxes();
            });
        }	
        // limit number of characters on title field in posts and pages
        if ($('body').hasClass('post-type-post') || $('body').hasClass('post-type-page')) {
    		var maxTitleLength = 75;

    		// Add span to the input displaying the characters remaining
    		$( '<span class="title-counter" style="position: absolute; right: 1px;top:1px; padding:.645em; width:1.5em; color: #777; background:#eee; text-rendering: optimizeLegibility;"></span>' ).insertAfter( '#title' );

            $('#titlewrap').after($('<div/>', {'id':'titleTooLongWarning','style':'color:#f33;border-left:4px solid #f33;background:#fff;padding:0 10px;'}).html('<p>Your title is <span class="title-counter"></span> characters long. Please consider using a shorter title.</p>'));
    		
            // colours the title input red and advises user when the maximum number of characters is reached
    		function titleWarning(){

                var getLength = $('#title').val().length;

    			// Give the counter a value
                var remaining = (getLength > maxTitleLength)? getLength: (maxTitleLength - getLength);
    			
                $( '.title-counter' ).text( remaining );

    			if ( getLength >= 0 ) {
                    

        			// If length is maxTitleLength characters or more, add highlight
        			if( getLength > maxTitleLength ) {

                        $('#titleTooLongWarning').show();

        				// Add the colours
        				$('#title').css({
        					'border': '1px solid red',
        					'boxShadow': '0 0 2px red'
        				});

        				$( '.title-counter' ).css({
        					'color': 'red'
        				});

        			// Otherwise remove inline styles
        			} else {
                        $('#titleTooLongWarning').hide();

        				$('#title').css({
        					'border': '',
        					'boxShadow': ''
        				});

        				$( '.title-counter' ).css({
        					'color': 'inherit'
        				});
        			}
                }
    		}

    		// watch title field
    		$(document).on('keyup', '#title', titleWarning);

    		// highlight title field
    		titleWarning();
        }

        // only allow custom menu widgets in sidebar
        $('.widget').on( 'dragcreate dragstart', function( event, ui ){
            id =  $(this).find( 'input[name="id_base"]').val();
            if( id == 'custom_menu' ){ //check if the widget is the right one
                $(this).draggable({
                    connectToSortable: '#primary-sidebar, #wp_inactive_widgets'//limit drop event only to these sidebars
                })
            }
        });
	});
})(jQuery);