<?php
// WP Globals setup

// Theme layout
$GLOBALS['full_width'] = tk_full_width();

// Sidebar flag
$GLOBALS['theme_sidebar_flag'] = tk_sidebar();

// Change style sheet based on theme settings page
$GLOBALS['colour'] = tk_colour();

?><!DOCTYPE html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"><![endif]-->
<!--[if IE 9]><html class="no-js ie9" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html <?php language_attributes(); ?> class="no-js"><!--<![endif]-->
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <meta name="copyright" content="Copyright (c)<?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All Rights Reserved." />

		<?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?>>
	<?php if ( get_field('tk_google_tagmanager', 'option') ) : ?>
		<!-- Google Tag Manager -->
		<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-WT437X"
		height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','GTM-WT437X');</script>
		<!-- End Google Tag Manager -->
	<?php endif; ?>
		<div class="site-container <?php if($GLOBALS[ 'full_width' ]){ echo "site-container-lg"; }?>">

			<?php get_template_part('templates/global-quicklinks'); ?>

			<header class="masthead" role="banner">
			    <div class="<?php if(!$GLOBALS[ 'full_width' ]){ echo "wrapper-lg"; }?>">
			        <!-- Open button -->
			        <div class="masthead-links">
			            <button class="masthead-link masthead-link-quicklinks js-quicklinks-toggle" data-toggle="collapse" data-target="#quicklinks">Quicklinks</button>
			        </div>
			        <div class="navicon">
                        <button class="btn-icon" data-state="body-state" data-class="state-navicon-active">Menu</button>
                    </div>
			        <div class="site-logo">
			            <a href="http://www.leeds.ac.uk/"><img src="<?php echo get_template_directory_uri(); ?>/img/logo.svg" alt="University of Leeds"></a>
			        </div>
			    </div>
			</header>

			<div id="sitesearch" class="site-search collapse">
			    <div class="wrapper-pd <?php if(!$GLOBALS[ 'full_width' ]){ echo "wrapper-lg"; }?>">
			        <form id="header_form" class="site-search-inner" autocomplete="off" method="get" action="<?php echo home_url(); ?>" role="search">
			            <label class="sr-only" for="searchInput">Search</label>
			            <input id="searchInput" class="site-search-input" type="search" name="q" placeholder="Search" autocomplete="off">
			            <label class="sr-only" for="searchOption">Destination</label>
			            <select id="searchOption" class="site-search-select js-action-toggle" name="searchOption">
			                <option value="searchSite" selected data-action="<?php echo home_url(); ?>"><?php bloginfo( 'name' ); ?> site</option>
			                <option value="searchAll" data-action="http://www.leeds.ac.uk/site/scripts/search_results.php">All leeds.ac.uk sites</option>
			            </select>
			            <input class="site-search-submit btn btn-primary" type="submit" value="Search">
			        </form>
			    </div>
			</div>

			<div class="local-header">
			    <div class="wrapper-pd-xs <?php if(!$GLOBALS[ 'full_width' ]){ echo "wrapper-lg"; }?>">
			        <div class="local-header-inner">
			            <div class="local-header-title">
			                <a href="<?php bloginfo('url'); ?>"><?php bloginfo( 'name' ); ?></a>
			            </div>
			            <div class="local-header-search">
			                <button class="icon-font sm-toggle-search btn-icon js-site-search-toggle" data-toggle="collapse" data-target="#sitesearch">
			                    <span class="site-search-btn" aria-hidden="true"></span>
			                    <span class="icon-font-text">Search</span>
			                </button>
			            </div>
			        </div>
			    </div>
			</div>

			<nav class="tk-nav tk-nav-priority" role="navigation">
			    <div class="wrapper-relative <?php if(!$GLOBALS[ 'full_width' ]){ echo "wrapper-lg"; }?>">
			        <div class="tk-nav-header">
			            <button class="btn-icon" data-state="body-state" data-class="state-navicon-active">Close</button>
			        </div>
			        <div class="tk-nav-inner">
						<?php tk_header_nav(); ?>
					</div>
				</div>
			</nav>


            <div class="main <?php if(!$GLOBALS[ 'full_width' ]){ echo "wrapper-lg"; }?>">
