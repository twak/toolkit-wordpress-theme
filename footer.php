			</div>
			<!-- /.main-->				


			<?php get_template_part( 'templates/tweets' ); ?>				

			<footer class="site-footer" role="contentinfo">	
					
				<?php  if ( is_active_sidebar( 'widget-area-2' ) ) { ?>
				<div class="site-footer-upper">
					<div class="wrapper-pd <?php if(!$GLOBALS[ 'full_width' ]){ echo "wrapper-lg"; }?>">
					    <div class="row">
						<?php
						dynamic_sidebar('widget-area-2');
						?>
						</div>
					</div>
				</div>
				<?php
				}
				?>

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

		</div>
		<!-- /site-container -->

		<?php wp_footer(); ?>			

	</body>
</html>
