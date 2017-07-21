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