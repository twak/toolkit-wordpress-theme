<!DOCTYPE html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"><![endif]-->
<!--[if IE 9]><html class="no-js ie9" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html <?php language_attributes(); ?> class="no-js"><!--<![endif]-->
	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta name="description" content="<?php bloginfo('description'); ?>">

		<title><?php wp_title(''); ?><?php if(wp_title('', false)) { echo ' :'; } ?> <?php bloginfo('name'); ?></title>

        <!-- Typekit Fonts Async -->
        <script type="text/javascript">
            if (document.getElementsByTagName("html")[0].className.indexOf("lt-ie9") == -1){
            !function(e,t,n,a,r,c,l,s,o){l=a[r],l&&(s=e.createElement("style"),s.innerHTML=l,e.getElementsByTagName("head")[0].appendChild(s),e.documentElement.className+=" wf-cached"),o=t[n],t[n]=function(e,p,u,i){if("string"==typeof p&&p.indexOf(c)>-1){try{u=new XMLHttpRequest,u.open("GET",p,!0),u.onreadystatechange=function(){try{4==u.readyState&&(i=u.responseText.replace(/url\(\//g,"url("+c+"/"),i!==l&&(a[r]=i))}catch(e){s&&(s.innerHTML="")}},u.send(null)}catch(d){}t[n]=o}return o.apply(this,arguments)}}(document,Element.prototype,"setAttribute",localStorage,"tk","https://use.typekit.net");}
                        
                (function() {
                    var config = {
                      kitId: 'vlw5ilb'
                    };
                    var d = false;
                    var tk = document.createElement('script');
                    tk.src = '//use.typekit.net/' + config.kitId + '.js';
                    tk.type = 'text/javascript';
                    tk.async = 'true';
                    tk.onload = tk.onreadystatechange = function() {
                      var rs = this.readyState;
                      if (d || rs && rs != 'complete' && rs != 'loaded') return;
                      d = true;
                      try { Typekit.load(config); } catch (e) {}
                    };
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(tk, s);
                })();    
        </script>        

        <?php

        //WP Globals setup

        //Theme layout

        if(get_field( 'tk_theme_layout', 'option' )): 
        	$THEME_LAYOUT = get_field('tk_theme_layout', 'option' );
        	if($THEME_LAYOUT == 'full_width'){
				$GLOBALS[ 'full_width' ] = 1;
        	} else {
        		$GLOBALS[ 'full_width' ] = 0;
        	}        		     	
        endif; 

        //Sidebar flag

        if(get_field('sidebar_flag') == 'show'): 
        	$GLOBALS[ 'theme_sidebar_flag' ] = 1;
        else : 
        	$GLOBALS[ 'theme_sidebar_flag' ] = 0;
        endif; 

        ?>

        <!-- Change style sheet based on theme settings page -->
        <?php $THEME_OPTION = "default"; ?>

        <?php if(get_field( "tk_theme_color", "option" )): $THEME_OPTION = get_field("tk_theme_color", "option" ); endif; ?>			

        <link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri();  ?>/dist/theme-<?php echo $THEME_OPTION; ?>/bootstrap.min.css" media="screen">
        <link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri();  ?>/dist/theme-<?php echo $THEME_OPTION; ?>/toolkit.min.css" media="screen">
        <link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri();  ?>/dist/theme-<?php echo $THEME_OPTION; ?>/print.min.css"  media="print">
					
		<?php wp_head(); ?>		

	</head>
	<body <?php //body_class(); ?>>
		<!-- Google Tag Manager -->
		<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-WT437X"
		height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','GTM-WT437X');</script>
		<!-- End Google Tag Manager -->

		<div class="site-container <?php if($GLOBALS[ 'full_width' ]){ echo "site-container-lg"; }?>">

			<nav id="quicklinks" class="quicklinks collapse" role="navigation">
			    <div class="wrapper-relative <?php if(!$GLOBALS[ 'full_width' ]){ echo "wrapper-lg"; }?>">
			        <div class="quicklinks-inner">   
				        <div class="row">
						    <div class="col-sm-6 col-md-3">
						        <ul class="quicklinks-list">
						            <li class="title">For staff</li>
						            <li><a href="http://www.leeds.ac.uk/forstaff/">For Staff</a></li>
						            <li><a href="http://www.leeds.ac.uk/forstaff/homepage/375/services">Services A-Z</a></li>
						            <li><a href="http://ses.leeds.ac.uk/">Student Education Service</a></li>
						        </ul>
						        <ul class="quicklinks-list">
						            <li class="title">For students</li>
						            <li><a href="https://leedsportal.leeds.ac.uk/uollogin/login.html">Portal</a></li>
						            <li><a href="http://it.leeds.ac.uk/mobileapps">Mobile app</a></li>
						            <li><a href="http://students.leeds.ac.uk/">For Students</a></li>
						        </ul>
						    </div>
						    <div class="col-sm-6 col-md-3">
						        <ul class="quicklinks-list">
						            <li class="title">Faculties</li>
						            <li><a href="http://www.leeds.ac.uk/arts/">Faculty of Arts</a></li>
						            <li><a href="http://www.fbs.leeds.ac.uk/">Faculty of Biological Sciences</a></li>
						            <li><a href="http://business.leeds.ac.uk/">Faculty of Business</a></li>
						            <li><a href="http://www.essl.leeds.ac.uk/">Faculty of Education, Social Sciences and Law</a></li>
						            <li><a href="http://engineering.leeds.ac.uk/">Faculty of Engineering</a></li>
						            <li><a href="http://www.environment.leeds.ac.uk/">Faculty of Environment</a></li>
						            <li><a href="http://www.maps.leeds.ac.uk/home.html">Faculty of Mathematics and Physical Sciences</a></li>
						            <li><a href="http://medhealth.leeds.ac.uk/">Faculty of Medicine and Health</a></li>
						            <li><a href="http://www.pvac.leeds.ac.uk/">Faculty of Performance, Visual Arts and Communications</a></li>
						            <li><a href="http://www.llc.leeds.ac.uk/">Lifelong Learning Centre</a></li>
						        </ul>
						    </div>
						    <div class="col-sm-6 col-md-3">
						        <ul class="quicklinks-list">
						            <li class="title">Other</li>
						            <li><a href="http://www.leeds.ac.uk/staffaz">Staff A-Z</a></li>
						            <li><a href="http://www.leeds.ac.uk/campusmap">Campus map</a></li>
						            <li><a href="http://www.leeds.ac.uk/jobs">Jobs</a></li>
						            <li><a href="http://www.alumni.leeds.ac.uk/">Alumni</a></li>
						            <li><a href="http://www.leeds.ac.uk/contact">Contacts</a></li>
						            <li><a href="http://library.leeds.ac.uk/">Library</a></li>
						            <li><a href="http://it.leeds.ac.uk/">IT</a></li>
						            <li><a href="https://video.leeds.ac.uk/">VideoLeeds</a></li>
						            <li><a href="http://www.luu.org.uk/">Leeds University Union</a></li>
						        </ul>
						    </div>
						    <div class="col-sm-6 col-md-3">
						        <ul class="quicklinks-list">
						            <li class="title">Follow us</li>
						            <li><a href="http://www.facebook.com/universityofleeds">Facebook</a></li>
						            <li><a href="http://www.twitter.com/universityleeds">Twitter</a></li>
						            <li><a href="http://www.youtube.com/universityofleeds">YouTube</a></li>
						            <li><a href="http://www.linkedin.com/edu/university-of-leeds-12706">LinkedIn</a></li>
						            <li><a href="http://instagram.com/universityofleeds/">Instagram</a></li>
						            <li><a href="http://itunes.apple.com/gb/institution/university-of-leeds/id610001825">ITunes U</a></li>
						        </ul>
						    </div>					   
						</div>    			           
			        </div>			        
			        <div class="quicklinks-close">
			            <button class="icon-font btn-icon js-quicklinks-close" data-toggle="collapse" data-target="#quicklinks">
			                <span class="tk-icon-close" aria-hidden="true"></span>
			                <span class="icon-font-text">Close quicklinks</span>
			            </button>
			        </div>
			    </div>
			</nav>

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
			                <h1><a href="<?php bloginfo('url'); ?>"><?php bloginfo( 'name' ); ?></a></h1>
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

