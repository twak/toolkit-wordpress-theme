ChangeLog
=========

### 0.3.11 (18/01/2018)

 * Hotfix release for bug in default template without sidebar (title and breadcrumb hidden by default when should be shown)

### 0.3.10 (18/01/2018)

 * Hotfix release for bug in text widget

### 0.3.9 (18/01/2018)

 * Hotfix release for bug in styles loader

### 0.3.8 (17/01/2018)

 * Added field to show or hide page title and breadcrumb for widgets page template when sidebar is hidden.
 * Re-factored sidebars and created new widgets to use in them which contain the correct CSS classes
 * Moved all GTM code to body.
 * Re-factored styles inclusion scripts and added Typekit CSS - removed Typekit JS
 * Added environment settings to prevent GTM loading in non-production environments
 * Added an option to Post Settings to show the full post or excerpt on archive pages

### 0.3.7 (28/11/2017)

 * Removed SEO output from the main theme as this was interfering with SEO plugins (hotfix)

### 0.3.6 (27/11/2017)

 * Refactored posts list widget to separate logic from template
 * Added new corporate Google Tag Manager code and removed other GA codes
 * Added ACF filters to allow child themes to extend theme options and page widgets

### 0.3.5 (02/11/2017)

 * Another bugfix release – new posts lists widget was polluting the global namespace and halting page rendering

### 0.3.4 (01/11/2017)

 * Bugfix release (excerpts not showing on post archives)
 * Refactored widgets page template inclusions to make adding new templates for new widgets easier
 * Corrected instructions on new columns page widget

### 0.3.3 (31/10/2017)

 * Added columns widget
 * Added google API key to theme settings for use with google maps widget
 * Moved Post settings to their own settings page
 * Added sidebar for posts
 * Added option to display square images in featured posts widget
 * Added character limits on tabs and link text in banner widget to ensure consistent display
 * Added classes to menu items so they display correctly when a menu is added to a sidebar in a widget

### 0.3.2 (16/10/2013)

 * Removed length restriction on cards to ensure backward compatibility.
 * Fixed a bug in the title length restriction script
 * Removed tgmpa configuration for toolkit plugins (now managed via GitHub Updater only)
 
### 0.3.1 (13/10/2017)

 * Added configurable text and title for 404 page to theme options
 * Added video option to featured content widget and added responsive embed code to media
 * Refactored page widget ACF definitions to be added using filters
 * Added Google Maps widget

### 0.3.0 (28/09/2017)

 * Advanced Custom Fields for page widgets taken out of UI configuration
 * Quicklinks moved to separate include
 * Fixed rendering order to parent theme CSS is loaded before child theme
 * Quicklinks now support child-theme overriding
 * Typekit moved to separate file
 * Splitting out header into separate template files
 * Fixed social icon sizes in the footer

### 0.2.17 (07/08/2017)

 * Bugfix release for 404 page (removed page listing)

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