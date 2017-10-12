<?php get_header(); 
$title = get_field('tk_404_page_title', 'option');
if ( ! $title ) {
    $title = 'Page not found';
}
$content = get_field('tk_404_page_content', 'option');
if ( ! $content ) {
    $content = 'Sorry, the page you are looking for could not be found on this site';
}
$content = apply_filters('the_content', $content);
?>

<div class="wrapper-xs wrapper-pd p-t p-b">			
	<h1 class="heading-underline"><?php echo $title; ?></h1>	
	<?php echo $content; ?>
</div>

<?php get_footer(); ?>
