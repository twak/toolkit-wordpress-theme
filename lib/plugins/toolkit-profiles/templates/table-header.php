<?php
/**
 * output the table header
 */
?>
<table class="table table-profiles table-stripe table-bordered table-hover tablesaw tablesaw-stack" data-tablesaw-mode="stack" data-tablesaw-sortable>
    <thead>
        <tr>
            <?php if($flag_show_images):  ?>
            <th scope="col"></th>
            <?php endif; ?>                             
            <th scope="col">Name</th>
            <th scope="col">Email</th>   
            <th scope="col">Telephone</th>                
            <th scope="col">Job title</th>                
        </tr>
    </thead>
    <tbody>
