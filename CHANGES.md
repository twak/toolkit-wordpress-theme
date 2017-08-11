ChangeLog
=========

### 0.2.17 (Upcoming release)

 * Drop Caps added to TinyMCE
 * Styles added to editor-styles.css
 * ‘Fat footer’ added from toolkit. Now supports large footer menus
 * WordPress specific SCSS to include breakpoints
 * Quicklinks moved to separate include
 * Fixed rendering order to parent theme CSS is loaded before child theme
 * Quicklinks now support child-theme overriding
 * Typekit moved to separate file
 * Splitting out header into separate template files
 * Fixed social icon sizes in the footer

### 0.2.16 (17/07/2017)

 * Moved comments callback to comments template from functions.php
 * Refactored cleanup.php and add customiser functions from functions.php. Admins can now change theme CSS

### 0.2.15 (13/07/2017)

 * Minor update to make some plugins independent from the main theme

### 0.2.14 (13/07/2017)

 * All bundled plugins updated to latest version
 * Featured image size changes for better load times
 * Network admins have access to all dashboard features (previously, dashboard JS was too restrictive)
 * Updated Readme
 * Body classes added
 * Removed blocking scripts to make site migration easier

### 0.2.13 (20/06/2017)

 * Merge of several branches into core theme
 * Moved plugins from lib folder into their own repositories
 * Updated roadmap

### 0.2.11 (15/06/2017)

 * Quick fix as page title text was too large

### 0.2.10 (15/06/2017)

 * Dashboard JS now shows a character limit countdown on page titles
 * Some theme customiser options removed. Help text added below titles
 * Removed TinyMCE buttons for some users on the dashboard
 * Updated WordPress Roadmap
 * Dashboard JS fixes on page submit
 * Update to latest toolkit CSS and JS
 * Added filter for theme options fields (so it plays nice with child themes)
 * Caption support added for the gallery shortcode
 * Dashboard JS restrictions to just pages and posts (not custom post types)
 * Added featherlight.js to the gallery shortcode for touch detection support

### 0.2.9 (17/05/2017)

 * Theme settings added to customiser
 * SEO added to theme files (instead of a plugin)
 * Updated CSS and JS to latest toolkit version

### 0.2.8 (16/05/2017)

 * Social Media accounts added to the WordPress Customiser
 * GPL Licence update
 * Bug fixes in the dashboard javascript

### 0.2.7 (12/05/2017)

 * Banner widget fix

### 0.2.6 (12/05/2017)

 * Code added to prevent normal users from editing CSS in WordPress Customiser
 * Download file shortcode added
 * Upgrade to all JS and CSS

### 0.2.5 (11/05/2017)

 * IE fix for image widths (SVG)
 * Fixed sidebar bug
 * Gallery shortcode added to shortcode plugin
 * Character restrictions for some ACF widgets
 * Added author support for events plugin
 * CSS added so the footer extends to the bottom of the page on very short pages

### 0.2.4 (3/05/2017)

 * Updated CSS and JS
 * Updated accordion widget

### 0.2.3 (2/05/2017)

 * Added google analytics and tag manage to theme options
 * Updated documentation for updating the theme in README

### 0.2.2 (27/04/2017)

 * More bugfixes in Events plugin

### 0.2.1 (27/04/2017)

 * Bugfixes in events plugin
 * Fixes for date and Category display on News and Posts pages

### 0.2.0 (25/04/2017)

 * Fixed sidebar and added custom walker for page navigation
 * Fixed breadcrumb
 * Updated plugins

### 0.1.9 (24/04/2017)

 * Refactored Events plugin and switched to using custom taxonomies
 * Fixed bugs in events plugin relating to date selection
 * Refactored theme files, placing templates and separate files for functions in subdirectories

### 0.1.8 (11/04/2017)

 * Added accordion widget
 * Updated all CSS and JS

###  0.1.7 (16/2/2017)

 * Release to push changes to profiles plugin

### 0.1.6 (16/02/2017)

 * Added purple option to theme colours

### 0.1.5 (2/02/2017)

 * Fixed default for show_sidebar
 * Wrapped footer widget area
 * Updated acf pro and profiles plugins
 * Removed tiles widget

### 0.1.4 (9/12/2016)

 * Added Changelog and Roadmap
 * Added an option to include twitter avatar (via image upload)

### 0.1.3 (18/11/2016)

 * Re-factored twitter styles
 * Improve featured image format

### 0.1.2 (16/11/2016)

 * Re-factored profiles to allow selection of layouts, fields to include in table view, and use its own taxonomy
 * Fixed some bugs in ordering of posts/events

### 0.1.1 (8/11/2016)

 * Added twitter back into theme with options in ACF theme options
 * Moved Theme options page under Appearance
 * Added gulp to compile style.css and include values from package.json
 * Split out ACF functions, plugin activation functions, theme setup, wordpress cleanup and navigation to files in lib/ (from functions.php)
 * Added apple touch icons

### 0.1.0 (1/11/2016)

 * Initial release