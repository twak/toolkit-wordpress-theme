<?php 

//Check alignment

if (get_sub_field('tiles_widget_layout') == 'right') {
    $tile_layout = 'tiles-col-right';
} else {
    $tile_layout = '';
}

// If we have tiles

    if( have_rows('tiles_widget_tile') ): 

    $tile_count = 0;
    $tile_shape = array();    
    $tile_alignment = array();

    while( have_rows('tiles_widget_tile') ) : the_row();
        $tile_count++;
    endwhile;
    
    // Tile shape statement

    if ($tile_count == 2) {        
        array_push($tile_shape, 
            "tile-shape-split", 
            ""
        );   
        if($tile_layout){
            array_push($tile_alignment, 
                "", 
                "tiles-col-right"
            );        
        }   
    } elseif($tile_count == 3) {
        array_push($tile_shape, 
            "", 
            "",
            ""
        );              
    } elseif($tile_count == 4) {
        array_push($tile_shape, 
            "", 
            "",
            "tile-shape-square tile-shape-rectangle-md tile-shape-split-md",
            "tile-shape-square tile-shape-rectangle-md tile-shape-split-md"
        );    
        if(!$tile_layout){     
            array_push($tile_alignment, 
                "", 
                "", 
                "tiles-col-1-4", 
                "tiles-col-1-4"
            );   
        } else {
            array_push($tile_alignment, 
                "", 
                "", 
                "tiles-col-1-4", 
                "tiles-col-1-4 tiles-col-right"
            );      
        }   
    } elseif(5) {
        array_push($tile_shape, 
            "", 
            "",
            "",
            "",
            "tile-shape-square tile-shape-rectangle-md tile-shape-split-md"
        );    
         
        if(!$tile_layout){     
            array_push($tile_alignment, 
                "", 
                "", 
                "", 
                "", 
                "tiles-col-1-4"
            );   
        } else {
            array_push($tile_alignment, 
                "", 
                "", 
                "", 
                "tiles-col-right", 
                "tiles-col-1-4 tiles-col-right"
            );   
            
        }       
    }

    ?>

    <div class="tiles-grid">

        <div class="tiles-col-1-2 tiles-col-1-1-sm <?php echo $tile_layout; ?>">
            <div class="tile tile-skin-nav tile-shape-rectangle">
                <div class="tile-inner">
                    <div class="content content--alt">
                        <div class="content__inner">
                            <ul>
                            <?php while( have_rows('tiles_widget_tile') ) : the_row(); ?>
                                <li><a href="#"><?php the_sub_field('tiles_widget_tile_title') ?></a></li>
                            <?php endwhile;    ?>
                            </ul>                        
                        </div>
                    </div>
                </div>
            </div>
        </div>

<?php
    $tile_count_2 = 0;
    while( have_rows('tiles_widget_tile') ) : the_row();

    //Check colour
    if(get_sub_field('tiles_widget_tile_background') == 'brand-1'): 
        $tile_color = "tile-skin-brand-1"; 
    else : 
        $tile_color = "tile-skin-brand-2"; 
    endif;    
    //Check for image
    if(get_sub_field('tiles_widget_tile_image')): 
        $tile_image  = 'tile-skin-img';
    else : 
        $tile_image  = 'tile-skin-img';
    endif;    

?>
        <div class="tiles-col-1-2 tiles-col-1-2-md tiles-col-1-1-sm <?php echo $tile_alignment[$tile_count_2];?>">
            <div class="tile tile-shape-rectangle <?php echo $tile_color .' '.$tile_image.' '. $tile_shape[$tile_count_2]; ?>">
                <?php if($tile_image){ ?>
                <span class="tile-bg" style="background-image:url('<?php the_sub_field('tiles_widget_tile_image') ?>')"></span>
                <?php } ?>
                <div class="tile-inner">
                    <div class="content">
                        <div class="content__inner">
                            <h3><?php the_sub_field('tiles_widget_tile_title') ?></h3>
                            <p><?php the_sub_field('tiles_widget_tile_content') ?></p>
                            <a href="#" class="more more-light">More</a>         
                        </div>
                    </div>
                </div>
                <a class="tile-link" href="#">Link Name</a>
            </div>
        </div> 
    <?php $tile_count_2++; ?>

<?php           
      endwhile;   
?>
    </div>
    <br/>
<?php
    endif; // end child loop    
?>

