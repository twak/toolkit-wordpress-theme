			</div>
			<!-- /.wrapper-lg-->
			</main>	

			<?php //include_once( 'tweets.php' ); ?>				

			<footer class="site-footer" role="contentinfo">	
					
				<?php if(!function_exists('dynamic_sidebar') || !dynamic_sidebar('widget-area-2')) ?>
						  			            				
			    <div class="site-footer-lower">
			        <div class="wrapper-pd <?php if(!$GLOBALS[ 'full_width' ]){ echo "wrapper-lg"; }?>">
			        	<?php tk_footer_nav(); ?>
			           <!--  <ul class="nav">
			                
			                <li><a href="//www.leeds.ac.uk/termsandconditions">Terms &amp; Conditions</a></li>
			                <li><a href="//www.leeds.ac.uk/accessibility">Accessibility</a></li>
			                <li><a href="<?php echo site_url(); ?>/privacy/">Privacy</a></li>
			                <li><a href="//www.leeds.ac.uk/foi">Freedom of information</a></li>
			                <li><a href="#">Equality and inclusion</a></li>
			            </ul> -->
			        </div>
			    </div>
			</footer>

		</div>
		<!-- /site-container -->

		<?php wp_footer(); ?>			

	</body>
</html>
