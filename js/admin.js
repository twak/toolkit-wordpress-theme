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

		// set maxlength attribute on title input if the contents are less than maxTitleLength characters
		// if contents are more than maxTitleLength characters, this may cause titles to be truncated(?)
		if ( $('#title').val().length < maxTitleLength ) {
			$('#title').attr( "maxlength", maxTitleLength );
		}

		// colours the title input red when the maximum number of characters is reached
		function titleWarning(){

			var getLength = $('#title').val().length;

			// If length is maxTitleLength characters or more, add highlight
			if( getLength >= maxTitleLength) {
				$('#title').css({
					'border': '1px solid red',
					'boxShadow': '0 0 6px red'
				});

			// Otherwise remove inline styles
			} else {
				$('#title').css({
					'border': '',
					'boxShadow': ''
				});
				// make sure the maxlength attribute is set
				$('#title').attr( "maxlength", maxTitleLength );
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