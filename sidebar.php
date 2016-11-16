 <?php 

    $this_page_id = get_the_ID();    
    
    $parents = array_reverse(get_post_ancestors($this_page_id)); //Get Top Level Parent   
    
    $first_parent = get_page($parents[0]);    
    
    $first_parent_id = $first_parent->ID;    
  
    $args = array(
        'sort_order' => 'ASC',
        'sort_column' => 'menu_order',
        'hierarchical' => 1,
        'exclude' => '',
        'include' => '',
        'meta_key' => '',
        'meta_value' => '',
        'authors' => '',
        'child_of' => 0,
        'parent' => -1,
        'exclude_tree' => '',
        'number' => '',
        'offset' => 0,
        'post_type' => 'page',
        'post_status' => 'publish'
    ); 

    $pages = get_pages($args); 

    // echo'<pre>';
    // print_r($pages);
    // echo'</pre>';

    function renderTree($pages, $this_page_id, $ul_count = 0, $parent_id = "", $dropdown_status = true) {

        $parent_page = get_post($parent_id); //parent info
        $reoccursion_end = false; //monitor if we end the reoccursion 
        $result = "";       

        if($ul_count < 1):
            if($GLOBALS[ 'full_width' ]){ //if full width 
                $result .= '<ul class="sidebar-nav sidebar-nav-fw" id="sidebarNav">';
            } else {
                $result .= '<ul class="sidebar-nav" id="sidebarNav">';
            }
        else:
            $result .= '<ul id="' . $parent_id . '">';        
        endif;    

        if($dropdown_status): //
            if($parent_page->ID == $this_page_id){
                $result .= '<li class="active"><a href="'.$parent_page->guid.'">Overview</a></li>';
            } else {
                $result .= '<li><a href="'.$parent_page->guid.'">Overview</a></li>';
            }
            $reoccursion_end = true;  
        endif;        

        foreach ($pages as $item) :
            $ul_count++;        
            $children_count = count(get_pages('child_of='.$item->ID));

            if ($item->post_parent == $parent_id) : //loop through pages and if this is a direct child page...

                if($children_count):
                    $result .= '<li class="dropdown">';                                   
                    $dropdown_status = true;               
                elseif($item->ID == $this_page_id):
                    $result .= '<li class="active">';                     
                    $dropdown_status = false;  
                else:
                    $result .= '<li>';        
                    $dropdown_status = false;              
                endif;     

                $result .= '<a href="'.$item->guid.'">';            
                $result .= $item->post_title;
                $result .= '</a>';
                $result .= renderTree($pages, $this_page_id, $ul_count, $item->ID, $dropdown_status);                                
                $result .= '</li>';

                $reoccursion_end = true;                         

            endif;
        endforeach;

        $result .= '</ul>'; 

        if($reoccursion_end): return $result; endif;
        //if(1): return $result; endif;
       
    }

?>

<!-- $SIDEBAR -->
<aside class="column-container-secondary role="complementary">
   
<!-- $TEMPLATE: SIDEBAR NAV -->
    <button class="sidebar-button js-sidebar-trigger">In this section: <?php echo $first_parent->post_title; ?></button>           

    <div class="sidebar-container <?php if($GLOBALS[ 'full_width' ]){ echo "sidebar-container-fw"; }?>">

        <h4 class="sidebar-heading heading-related">In this section</h4> 
    
        <?php echo renderTree($pages, $this_page_id, 0, $first_parent_id); ?>
       
<!-- 
        <h4 class="heading-related sidebar-heading">University Links</h4>
        <ul class="sidebar-list sidebar-contact">
            <li><a href="#"><span class="tk-icon-triangle-right"></span>Campus life</a>
            </li>            
            <li><a href="#"><span class="tk-icon-triangle-right"></span>International students</a></li>
        </ul>    
       
        <ul class="sidebar-list sidebar-cta">
            <li><a href="#"><span class="tk-icon-download"></span>Downloads</a>
            </li>
            <li><a href="#"><span class="tk-icon-chevron-right"></span>Open days</a></li>
            <li><a href="#"><span class="tk-icon-search"></span>Course search</a></li>
        </ul>      
        
        <h4 class="heading-related sidebar-heading">Contact</h4>
        <ul class="sidebar-list sidebar-contact">
            <li><a href="#"><span class="tk-icon-phone"></span>+44 (0)113 343 2149</a>
            </li>            
            <li><a href="#"><span class="tk-icon-mail"></span>ugmech@leeds.ac.uk</a></li>
        </ul>        -->

    </div>
	
	<div class="sidebar" role="complementary">		

		<div class="sidebar-widget">
			<?php if(!function_exists('dynamic_sidebar') || !dynamic_sidebar('widget-area-1')) ?>
		</div>

	</div>

</aside>
<!-- ./column-container-secondary-->
<!-- $/SIDEBAR -->
