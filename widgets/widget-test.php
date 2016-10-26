<?php 

//Tiles array example
$tiles = array (	
	'tiles_widget_title' => 'Campus life',
	'tiles_widget_lead' => 'Blah blah',
	'tiles_widget_layout' => 'left', //left or right
	'tiles_widget_tile' => 
	array (
	    0 => array (
			'tiles_widget_tile_title' => 'Accomodation',
			'tiles_widget_tile_image' => 'http://toolkit-wordpress.local:8888/wp-content/uploads/2016/10/8.jpeg',
			'tiles_widget_tile_content' => 'We offer a wide choice of University accommodation in great locations',
			'tiles_widget_tile_link_option' => 'internal', //internal or external
			'tiles_widget_tile_internal_link' => 'http://www.leeds.ac.uk/',
			'tiles_widget_tile_external_link' => 'http://www.google.com/',
			'tiles_widget_tile_background' => 'brand-1', //brand-1 or brand-2
	    ),
	    1 => array (
			'tiles_widget_tile_title' => 'Students union',
			'tiles_widget_tile_image' => false,
			'tiles_widget_tile_content' => 'Right at the heart of campus offering you amazing events, services and opportunities, all designed ensure you love your time at Leeds',
			'tiles_widget_tile_link_option' => 'external',
			'tiles_widget_tile_internal_link' => NULL,
			'tiles_widget_tile_external_link' => 'http://www.google.com',
			'tiles_widget_tile_background' => 'brand-1',
	    ),
	    2 => array (
			'tiles_widget_tile_title' => 'Sport and fitness',
			'tiles_widget_tile_image' => 'http://toolkit-wordpress.local:8888/wp-content/uploads/2016/10/9.jpeg',
			'tiles_widget_tile_content' => 'Whatever your level of fitness, we provide excellent opportunities to keep active',
			'tiles_widget_tile_link_option' => 'external',
			'tiles_widget_tile_internal_link' => NULL,
			'tiles_widget_tile_external_link' => 'http://www.google.com/2',
			'tiles_widget_tile_background' => 'brand-1',
	    ),
	    3 => array (
			'tiles_widget_tile_title' => 'City life',
			'tiles_widget_tile_image' => 'http://toolkit-wordpress.local:8888/wp-content/uploads/2016/10/10.jpeg',
			'tiles_widget_tile_content' => 'Leeds is a vibrant city renowned as a centre for arts, sport, leisure, entertainment and nightlife',
			'tiles_widget_tile_link_option' => 'external',
			'tiles_widget_tile_internal_link' => NULL,
			'tiles_widget_tile_external_link' => 'http://www.google.com/3',
			'tiles_widget_tile_background' => 'brand-1',
	    ),
	    4 => array (
			'tiles_widget_tile_title' => 'Campus map',
			'tiles_widget_tile_image' => false,
			'tiles_widget_tile_content' => '',
			'tiles_widget_tile_link_option' => 'external',
			'tiles_widget_tile_internal_link' => NULL,
			'tiles_widget_tile_external_link' => 'http://www.google.com',
			'tiles_widget_tile_background' => 'brand-2',
	    ),
	),  
);

$tile_count = 0;
$tile_shape = array();    
$tile_alignment = array();
$tile_single = $tiles['tiles_widget_tile'];

//Left or right alignment
if ($tiles['tiles_widget_layout'] == 'right') {
    $tile_layout = 'tiles-col-right';
} else {
    $tile_layout = '';
}

//Count tiles
foreach ($tile_single as $tile) {
	$tile_count++;
}

//Create class names array
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

<div class="wrapper-lg">

<?php if($tiles['tiles_widget_title'] || $tiles['tiles_widget_lead'] ) { //Title and lead of widget ?>

	 <div class="wrapper-pd">

    <?php if($tiles['tiles_widget_title']) { ?>

        <h3 class="h2-lg heading-underline"><?php echo $tiles['tiles_widget_title']; ?></h3>

    <?php } ?>

    <?php if($tiles['tiles_widget_lead']) { ?>

        <p><?php echo $tiles['tiles_widget_lead']; ?></p>

    <?php } ?>

    </div>

<?php } ?>

	<div class="tiles-grid">

        <div class="tiles-col-1-2 tiles-col-1-1-sm <?php echo $tile_layout; ?>">
            <div class="tile tile-skin-nav tile-shape-rectangle">
                <div class="tile-inner">
                    <div class="content content--alt">
                        <div class="content__inner">
                            <ul>
                            <?php 
                            	foreach ($tile_single as $tile) { //tiles list nav 
                            		if($tile['tiles_widget_tile_link_option'] == 'external'){
                            			$tile_link = $tile['tiles_widget_tile_external_link'];
                            		} else {
                            			$tile_link = $tile['tiles_widget_tile_internal_link'];
                            		}
                            ?>	
                                <li><a href="<?php echo $tile_link; ?>"><?php echo $tile['tiles_widget_tile_title']; ?></a></li>
                            <?php } ?>
                            </ul>                        
                        </div>
                    </div>
                </div>
            </div>
        </div>

<?php
    $tile_count_2 = 0;
    foreach ($tile_single as $tile) {

	    //Check colour
	    if($tile['tiles_widget_tile_background'] == 'brand-1'){
	        $tile_color = "tile-skin-brand-1"; 
	    } else {
	        $tile_color = "tile-skin-brand-2"; 
	    }
	      
	    //Check for image
	    if($tile['tiles_widget_tile_image']){
	        $tile_image  = 'tile-skin-img';
	        $tile_image_flag  = 1;
	    } else { 
	        $tile_image  = 'tile-skin-no-img';
	        $tile_image_flag  = 0;
	    }  

	    //Internal or external link
	    if($tile['tiles_widget_tile_link_option'] == 'external'){
			$tile_link = $tile['tiles_widget_tile_external_link'];
		} else {
			$tile_link = $tile['tiles_widget_tile_internal_link'];
		}
?>
        <div class="tiles-col-1-2 tiles-col-1-2-md tiles-col-1-1-sm <?php echo $tile_alignment[$tile_count_2]; ?>">
            <div class="tile tile-shape-rectangle <?php echo $tile_color .' '.$tile_image.' '. $tile_shape[$tile_count_2]; ?>">
                <?php if($tile_image_flag){ ?>
                <span class="tile-bg" style="background-image:url('<?php echo $tile['tiles_widget_tile_image']; ?>')"></span>
                <?php } ?>
                <div class="tile-inner">
                    <div class="content">
                        <div class="content__inner">
                            <h3><?php echo $tile['tiles_widget_tile_title']; ?></h3>
                            <p><?php echo $tile['tiles_widget_tile_content']; ?></p>
                            <a href="<?php echo $tile_link; ?>" class="more more-light">More</a>         
                        </div>
                    </div>
                </div>
                <a class="tile-link" href="<?php echo $tile_link; ?>">More</a>
            </div>
        </div> 
    <?php $tile_count_2++; ?>

<?php           
    }
?>

	</div><!-- .tiles-grid -->
</div><!-- .wrapper -->
<br/>