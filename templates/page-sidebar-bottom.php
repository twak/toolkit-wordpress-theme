<!-- page-sidebar-bottom -->
<?php

$show_sidebar = tk_sidebar();
$is_widget_template = ( basename( get_page_template() ) === "template-widgets.php" );


if ( $show_sidebar ) :
    print('</div></div>');
else :
    if ( $is_widget_template ) :
        // re-open wrapper
        print('<div>');
    endif;
endif;
?>
<!-- #page-sidebar-bottom -->