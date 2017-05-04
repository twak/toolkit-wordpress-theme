function setTitleLimit() {
	// Get the target
	var titleId = document.querySelector( '#title' );

	// Set the HTML attribute
	titleId.setAttribute( "maxlength", "75" );

	document.addEventListener( "keydown", function() {
		
		// Get character amount from input
		var getLength = titleId.value.length;

		console.log( getLength );

		// If length is exactly 75 characters
		if( getLength === 75) {
			titleId.style.border = "1px solid red";
			titleId.style.boxShadow = "0 0 6px red";

		// Otherwise remove inline styles
		} else {
			titleId.style.border = "";
			titleId.style.boxShadow = "";
		}
	});
}

// Start the function on window load
window.onload = setTitleLimit;