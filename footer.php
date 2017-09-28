			</div>
			<!-- /.main-->				


			<?php get_template_part( 'templates/tweets' ); ?>

            <?php do_action('tk_footer_before') ?>
			<footer class="site-footer" role="contentinfo">	
					
				<?php get_template_part( 'templates/footer-links' ); ?>

				<?php get_template_part( 'templates/footer-middle' ); ?>

			    <div class="site-footer-lower">
			        <div class="wrapper-pd <?php if(!$GLOBALS[ 'full_width' ]){ echo "wrapper-lg"; }?>">
			        	
			            <ul class="nav pull-left">			                
			                <li>© <?php echo date("Y"); ?> University of Leeds, Leeds, LS2 9JT</li>
			                <li><a href="http://www.leeds.ac.uk/info/5000/about/238/terms_and_conditions">Terms and conditions</a></li>
			            </ul>
			            <?php tk_footer_nav(); ?>
			            
			        </div>
			    </div>
			</footer>
			<?php do_action('tk_footer_after') ?>

		</div>
		<!-- /site-container -->

		<?php wp_footer(); ?>			

	</body>
</html>
