<!-- page-sidebar-bottom -->
<?php

$show_sidebar = tk_sidebar();
$page_template = basename( get_page_template() );


if ( $show_sidebar ) :
    print('</div></div>');
else :
    if ( $page_template === "template-widgets.php" ) :
        // re-open wrapper
        print('<div>');
    endif;
endif;
?>
<!-- #page-sidebar-bottom -->