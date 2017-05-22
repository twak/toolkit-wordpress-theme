/**
 * admin javascript for toolkit theme
 */

// actions on Advanced Custom Fields
(function($){
	acf.add_action('ready', function(){
		
		function sharingCheckboxes()
		{
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
		}
		$('[data-name="tk_social_media_sharing_links"] input:checkbox').on('click', function(){
			sharingCheckboxes();
		});
		sharingCheckboxes();
	});

	// limit number of characters on title field
	$(document).ready(function(){

		var maxTitleLength = 75;

		// Add span to the input displaying the characters remaining
		$( '<span class="title-counter" style="position: absolute; right: 0; padding: 11px; color: #777; text-rendering: optimizeLegibility;"></span>' ).insertAfter( '#title' );

		// Give the counter a value
		$( '.title-counter' ).html( maxTitleLength - $('#title').val().length );

		// If title length is more than 75 characters, disable button and add colours
		if( $('#title').val().length > maxTitleLength ) {

			// disable the publish button
    		$( '#publish' ).prop( 'disabled', true );

            // And prevent form submit
            $( 'form' ).on( 'submit', function( event ) {
                event.preventDefault();
            });

            // Prevent submit on pressing Enter key
            $( 'form' ).keypress( function ( event ) {
                var key = event.which;

                if( key === 13 ) {
                    event.preventDefault();
                }
            });

    		// Add the colours
    		$('#title').css({
    			'border': '1px solid red',
    			'boxShadow': '0 0 2px red'
    		});

    		$( '.title-counter' ).css({
    			'color': 'red'
    		});
		}

		// colours the title input red when the maximum number of characters is reached
		function titleWarning(){

			// Give the counter a value
			$( '.title-counter' ).html( maxTitleLength - $('#title').val().length );

			if ( $('#title').val().length >= 0 ) {
                var getLength = $('#title').val().length;

    			// If length is maxTitleLength characters or more, add highlight
    			if( getLength > maxTitleLength) {

    				// disable the publish button
    				$( '#publish' ).prop( 'disabled', true );

                    // And prevent form submit
                    $( 'form' ).on( 'submit', function( event ) {
                        event.preventDefault();
                    });

                    // Prevent submit on pressing Enter key
                    $( 'form' ).keypress( function ( event ) {
                        var key = event.which;

                        if( key === 13 ) {
                            event.preventDefault();
                        }
                    });

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

    				// Enable the publish button
    				$( '#publish' ).prop( 'disabled', false );

    				$('#title').css({
    					'border': '',
    					'boxShadow': ''
    				});

    				$( '.title-counter' ).css({
    					'color': '#777'
    				});
    			}
            }
		}

		// watch title field
		$(document).on('keyup', '#title', titleWarning);

		// highlight title field
		titleWarning();

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