Toolkit Wordpress Theme
=======================

Wordpress theme for the University of Leeds toolkit, based on [Bootstrap](https://getbootstrap.com/).

 * [Theme Wiki]
 * [View demo site](http://leeds.wpengine.com/toolkit/)
 * [View documentation](http://toolkit.leeds.ac.uk/)
 * [View Changelog](CHANGES.md)
 * [View Roadmap](ROADMAP.md)

Updating the theme
------------------

1. Checkout the `develop` branch
2. Edit the version number in `package.json`
3. Run `gulp bump` to update the vesion number in different files in the theme
4. Commit changes to the `develop` branch and push
4. Checkout the `master` branch
5. Merge changes from `develop` to `master` by running `git merge develop`
6. Commit changes to the master branch and push
7. Tag the new version using `git tag [version number]`
8. Push the new tag using `git push --tags`
9. Navigate to sites using the theme, and update the theme (uses the [GitHub Updater](https://github.com/afragen/github-updater) plugin)

Updating plugins
----------------

Plugins are packaged in the theme using the [TGM-Plugin-Activation](http://tgmpluginactivation.com/) class.

1. Checkout the `develop` branch
2. Edit the version number of the plugin in the `init.php` file for the plugin
3. Edit the minimum required version of the plugin in `lib/plugins.php` to correspond to the new version
3. Run `gulp package-plugins` to zip up the plugin files
4. Commit changes to the `develop` branch and push
4. To trigger updates to plugins, the theme must be bumped to a new version - follow the steps outlined above
9. Navigate to sites using the theme, and update the theme (uses the [GitHub Updater](https://github.com/afragen/github-updater) plugin) - this will also prompt you to update the plugins.

Filters
-------

### tk_icons

This filter can be used to change the icon set output in the head of the theme. The filter is passed an array of associative arrays with each member having three possible keys:

* `filename` - the filename of the image (required)
* `sizes` - the sizes attribute for the icon (optional)
* `rel` - the rel attribute for the icon (optional)

All icons should be stored in the img/icons folder (or a subfolder) in the theme/child theme.

#### Usage

```php
// this will substitute all icons with a single favicon.ico
function my_substitute_site_icons( $icons ) {
	$icons = array(
		array(
            "filename" => "favicon.ico",
            "rel" => "shortcut icon"
		)
	);
	return $icons;
}
add_filter( 'tk_icons', 'my_substitute_site_icons' );

// this will remove icons which have certain values in certain keys
function my_remove_apple_icons( $icons ) {
	return array_filter( $icons, function($icon) {
		return ! ( isset( $icon["rel"] ) && $icon["rel"] === "apple-touch-icon-precomposed" );
	});
}
add_filter( 'tk_icons', 'my_substitute_site_icons' );
```