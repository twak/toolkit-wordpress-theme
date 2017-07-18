<?php
// If footer left has widgets, display the footer!
if( is_active_sidebar( 'footer-left' ) ) { ?>

    <div class="site-footer-middle">       
        <div class="wrapper-lg wrapper-pd">
            <div class="tk-row">
                <div class="col-sm-6 col-md-3">
                    <?php dynamic_sidebar( 'footer-left' ); ?>
                </div>

                <div class="col-sm-6 col-md-3">
                    <?php dynamic_sidebar( 'footer-middle-left' ); ?>
                </div>
                <div class="clearfix visible-sm"></div>
                <div class="col-sm-6 col-md-3">
                    <?php dynamic_sidebar( 'footer-middle-right' ); ?>
                </div>
                <div class="col-sm-6 col-md-3">
                    <?php dynamic_sidebar( 'footer-right' ); ?>
                </div>
            </div>
        </div>
    </div>

<?php } ?>