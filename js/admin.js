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
})(jQuery);