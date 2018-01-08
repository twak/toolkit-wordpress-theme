<?php
/**
 * Theme setup functions
 */

if ( ! class_exists( 'tk_setup' ) ) {
    class tk_setup
    {
        /**
         * registers all hooks and filters
         */
        public static function register()
        {
            /* add favicons */
            add_action( 'wp_head', array( __CLASS__, 'add_favicons' ) );

            /* add SEO stuff */
            add_action( 'wp_head', array( __CLASS__, 'add_seo' ) );

            /* add GTM */
            add_action( 'tk_after_body', array( __CLASS__, 'add_gtm_script' ), 1 );

            /* add webmaster tools meta */
            add_action( 'wp_head', array( __CLASS__, 'webmaster_tools_meta' ) );

            /* add theme support for various features */
            add_action( 'after_setup_theme', array( __CLASS__, 'add_theme_support' ) );

            /* Threaded Comments script inclusion */
            add_action( 'get_header', array( __CLASS__, 'enable_threaded_comments' ) );

            /* Add Theme Scripts and Stylesheet */
            add_action( 'wp_enqueue_scripts', array( __CLASS__, 'scripts_styles' ) );

            /* Add scripts for back-end */
            add_action( 'admin_enqueue_scripts', array( __CLASS__, 'admin_scripts' ) );

            /* Add analytics in the footer */
            add_action( 'wp_footer', array( __CLASS__, 'analytics_footer' ) );

            /* change separator character for titles */
            add_filter( 'document_title_separator', array( __CLASS__, 'change_separator' ) );

            /* Add page slug to body class */
            add_filter( 'body_class', array( __CLASS__, 'add_slug_to_body_class' ) );

            /* Change search query string 's' work with 'q' for corporate search */
            add_filter( 'query_vars', array( __CLASS__, 'change_search_query' ) );

            /* Custom View Article link to Post */
            add_filter( 'excerpt_more', array( __CLASS__, 'excerpt_more' ) );

            /* remove hash from more link */
            add_filter( 'the_content_more_link', array( __CLASS__, 'remove_more_link_scroll' ) );        

            /* Allow shortcodes in Dynamic Sidebar */
            add_filter( 'widget_text', 'do_shortcode' );

            /* Allow shortcodes in Excerpt (Manual Excerpts only) */
            add_filter( 'the_excerpt', 'do_shortcode' );

            /* Remove <p> tags from excerpt */
            remove_filter( 'the_excerpt', 'wpautop' );

            /* adds support for excerpts on pages */
            add_action( 'init', array( __CLASS__, 'add_excerpts_to_pages' ) );

        }

        /**
         * adds icons to the head using the wp_head action
         */
        public static function add_favicons()
        {
            /**
             * icons can be added to the set using the tk_favicons filter
             * icons is an array of associative arrays with each member having three possible keys:
             *   filename - the filename of the image
             *   sizes - the sizes attribute for the icon
             *   rel - the rel attribute for the icon
             * all icons should be stored in the img/icons folder (or a subfolder) in the theme/child theme
             */
            $icons = apply_filters( 'tk_favicons', array(
                array(
                    "filename" => "touch-icon-192x192.png",
                    "sizes" => "192x192",
                    "rel" => "icon"
                ),
                array(
                    "filename" => "favicon.ico",
                    "rel" => "icon"
                ),
                array(
                    "filename" => "apple-touch-icon-180x180-precomposed.png",
                    "sizes" => "180x180",
                    "rel" => "apple-touch-icon"
                ),
                array(
                    "filename" => "apple-touch-icon-152x152-precomposed.png",
                    "sizes" => "152x152",
                    "rel" => "apple-touch-icon"
                ),
                array(
                    "filename" => "apple-touch-icon-144x144-precomposed.png",
                    "sizes" => "144x144",
                    "rel" => "apple-touch-icon"
                ),
                array(
                    "filename" => "apple-touch-icon-120x120-precomposed.png",
                    "sizes" => "120x120",
                    "rel" => "apple-touch-icon"
                ),
                array(
                    "filename" => "apple-touch-icon-114x114-precomposed.png",
                    "sizes" => "114x114",
                    "rel" => "apple-touch-icon"
                ),
                array(
                    "filename" => "apple-touch-icon-76x76-precomposed.png",
                    "sizes" => "76x76",
                    "rel" => "apple-touch-icon"
                ),
                array(
                    "filename" => "apple-touch-icon-72x72-precomposed.png",
                    "sizes" => "72x72",
                    "rel" => "apple-touch-icon"
                ),
                array(
                    "filename" => "apple-touch-icon-precomposed.png",
                    "rel" => "apple-touch-icon"
                )
            ));
            foreach ( $icons as $icon ) {
                $uri = false;
                if ( isset( $icon["filename"] ) ) {
                    if ( file_exists( get_stylesheet_directory() . '/img/icons/' . $icon["filename"] ) ) {
                        $uri = get_stylesheet_directory_uri() . '/img/icons/' . $icon["filename"];
                    } elseif ( file_exists( get_template_directory() . '/img/icons/' . $icon["filename"] ) ) {
                        $uri = get_template_directory_uri() . '/img/icons/' . $icon["filename"];
                    }
                }
                if ( $uri ) {
                    $sizes_attr = ( isset( $icon["sizes"] ) ) ? sprintf(' sizes="%s"', esc_attr( $icon["sizes"] ) ): "";
                    $rel_attr = ( isset( $icon["rel"] ) ) ? sprintf(' rel="%s"', esc_attr( $icon["rel"] ) ): ' rel="icon"';
                    printf("<link%s%s href=\"%s\">\n", $rel_attr, $sizes_attr, $uri );
                }
            }
        }

        /**
         * adds SEO stuff to header
         */
        public static function add_seo()
        {
            /*
             * removed 28/11/2017
             * Users reported some SEO and twitter card plugins were not functioning - this was due to 
             * the output here coming after the output of those plugins (and thereby overwriting them)
             * also, the logic in getting the description, image and title can result in empty attributes
             * it would probably be better defining custom fields for each post/page to make these values
             * configurable on a post-by-post basis, then store defaults in the theme options. In any case,
             * this functionality should be optional so it can be switched off when other plugins are used
             * Peter Edwards <p.l.edwards@leeds.ac.uk>
             */
            
            /*
            $post_id = get_queried_object_id();
            $sitename_attr = esc_attr( get_bloginfo('name') );
            $title_attr = esc_attr( get_bloginfo('name') );
            $description_attr = esc_attr( get_bloginfo('description') );
            $thumbnail_attr = '';
            $url = home_url();

            if ( ! is_front_page() && $post_id && ( is_single( $post_id ) || is_page ( $post_id ) ) ) {
                $title_attr = esc_attr( get_the_title( $post_id ) ) . ' | ' . $title_attr;
                $description_attr = esc_attr( trim( strip_tags( get_the_excerpt( $post_id ) ) ) );
                if ( has_post_thumbnail( $post_id ) ) {
                    $thumbnail_attr = esc_attr( get_the_post_thumbnail_url( $post_id ) );
                }
                $url = wp_get_canonical_url( $post_id );
            }
            if ( is_post_type_archive() ) {
                global $wp_query;
                $post_type = isset($wp_query->query['post_type']) ? $wp_query->query['post_type']: false;
                if ( $post_type ) {
                    $post_type_obj = get_post_type_object($post_type);
                    $title = get_field('tk_' . $post_type . '_page_settings_title', 'option');
                    if ( ! $title ) {
                        $title = $post_type_obj->labels->name;
                        if ( $post_type == 'post' ) {
                            $title = "Blog";
                        }
                    }
                    $title_attr = esc_attr( $title );
                    $description = get_field('tk_' . $post_type . '_page_settings_introduction', 'option');
                    if ( $description ) {
                        $description_attr = esc_attr( trim( strip_tags( $description ) ) );
                    }
                    $url = get_post_type_archive_link($post_type);
                }
            }
            print("<!-- SEO -->\n");
            printf('<meta name="description" content="%s" />', $description_attr );
            print("\n<!-- Open Graph -->\n");
            print('<meta property="og:locale" content="en_GB" /><meta property="og:type" content="website" />');
            printf('<meta property="og:title" content="%s" />', $title_attr );
            if ( $thumbnail_attr ) {
                printf('<meta property="og:image" content="%s" />', $thumbnail_attr );
            }
            printf('<meta property="og:url" content="%s" />', $url );
            printf('<meta property="og:site_name" content="%s" />', $sitename_attr );
            printf('<meta property="og:description" content="%s" />', $description_attr );
            print("\n<!-- Twitter -->\n");
            print('<meta name="twitter:card" content="summary" />');
            printf('<meta name="twitter:title" content="%s" />', $title_attr );
            if ( $thumbnail_attr ) {
                printf('<meta name="twitter:image" content="%s" />', $thumbnail_attr );
            }
            printf('<meta name="twitter:description" content="%s" />', $description_attr );
            */
            $url = wp_get_canonical_url();
            if ( false === $url ) {
                $url = home_url();
            }
            print("\n<!-- Canonical URL -->\n");
            printf("<link rel=\"canonical\" href=\"%s\">\n", $url );
        }

        /**
         * Adds <noscript> part of GTM include - called by tk_after_body
         */
        public static function add_gtm_script()
        {
            if ( apply_filters( 'include_corporate_gtm', true ) ) {
            ?>
            <!-- Google Tag Manager -->
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WJPZM2T');</script>
            <!-- End Google Tag Manager -->
            <!-- Google Tag Manager (noscript) -->
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WJPZM2T"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->
            <?php
            }
        }

        /**
         * adds <meta> tags to validate site with google and bing
         */
        public static function webmaster_tools_meta()
        {
            $google_meta = self::validate_meta_tag( get_field( 'tk_google_search_console_meta', 'option' ) );
            if ( $google_meta ) {
                echo $google_meta;
            }
            $bing_meta = self::validate_meta_tag( get_field( 'tk_bing_webmaster_tools_meta', 'option' ) );
            if ( $bing_meta ) {
                echo $bing_meta;
            }
        }

        private static function validate_meta_tag( $tag )
        {
            if ( $tag ) {
                $tag = trim($tag);
                if ( preg_match( '/^<meta[^>]*>$/', $tag ) ) {
                    return $tag;
                }
            }
            return false;
        }

        /**
         * adds theme support for various features
         */
        public static function add_theme_support()
        {
            // Add Menu Support
            add_theme_support('menus');

            // Add Title Tag support as per the WordPress specification: https://codex.wordpress.org/Title_Tag
            add_theme_support( 'title-tag' );

            // Add Thumbnail Theme Support
            add_theme_support('post-thumbnails');

            // Enables post and comment RSS feed links to head
            add_theme_support('automatic-feed-links');
        }

        /**
         * Enable Threaded Comments by including default script
         */
        public static function enable_threaded_comments()
        {
            if (!is_admin()) {
                if (is_singular() AND comments_open() AND (get_option('thread_comments') == 1)) {
                    wp_enqueue_script('comment-reply');
                }
            }
        }

        /**
         * enqueues scripts and styles for front end
         */
        public static function scripts_styles()
        {

            wp_register_script(
                'modernizr', 
                'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js'
            ); 
            wp_enqueue_script('modernizr');

            wp_register_script(
                'tkscripts',
                get_template_directory_uri() . '/dist/script.min.js',
                array('jquery'),
                tk_admin::$version,
                true
            );
            wp_enqueue_script('tkscripts');
        }

        /**
         * enqueue scripts for wordpress admin area
         */
        public static function admin_scripts() 
        {
            global $post_type;
            /* add some javascript variables to indicate activation status of plugins */
            $admin_vars = array(
                'news_plugin' => post_type_exists('news'),
                'events_plugin' => post_type_exists('events'),
                'profiles_plugin' => post_type_exists('profiles')
            );
            wp_register_script(
                'tk-admin-js', 
                get_template_directory_uri() . '/js/admin.js', 
                array('jquery'), 
                tk_admin::$version,
                true
            );
            wp_localize_script(
                'tk-admin-js',
                'tkadmin',
                $admin_vars
            );
            wp_enqueue_script('tk-admin-js');
        }

        /**
         * adds google analytics to footer
         */
        public static function analytics_footer()
        {
            if ( have_rows('tk_google_analytics', 'option') ) :
            	?>

					<script>
					(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
					    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
					    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
					})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                    <?php
                        while ( have_rows('tk_google_analytics', 'option') ) : the_row();

		                    $code = get_sub_field('tk_google_analytics_code');
		                    $label = strtolower(preg_replace('/[^a-zA-Z0-9]*/', '', $code));

                            if ( ! empty($code) && ! empty($label) ) {
	                            echo "ga('create', '{$code}', 'auto', '{$label}');";
	                            echo "ga('{$label}.send', 'pageview');";
                            }
                        endwhile;
                    ?>

					</script>

				<?php

            endif;
        }

        /**
         * Change seperator from WordPress default - to : in the <title> tag
         */
        public static function change_separator()
        {
            return ':';
        }

        /**
         * Adds page slug to body class
         */
        public static function add_slug_to_body_class($classes)
        {
            global $post;
            if (is_home()) {
                $key = array_search('blog', $classes);
                if ($key > -1) {
                    unset($classes[$key]);
                }
            } elseif (is_page()) {
                $classes[] = sanitize_html_class($post->post_name);
            } elseif (is_singular()) {
                $classes[] = sanitize_html_class($post->post_name);
            }

            return $classes;
        }

        /**
         * Change search query string 's' work with 'q' for corporate search
         */
        public static function change_search_query( $public_query_vars ) {
            if ( isset( $_GET['q'] ) && ! empty( $_GET['q'] ) ) {
                $_GET['s'] = $_GET['q'];
            }

            return $public_query_vars;
        }

        /**
         * change excerpt more link
         */
        public static function excerpt_more($more)
        {
            return '...';
        }

        /**
         * removes the hash from the more link
         * to prevent scrollingh of page
         */
        public static function remove_more_link_scroll( $link )
        {
            $link = preg_replace( '|#more-[0-9]+|', '', $link );
            return $link;
        }

        /*
         * add excerpt support for pages
         */
        public static function add_excerpts_to_pages()
        {
            add_post_type_support( 'page', 'excerpt' );
        }
    }
    tk_setup::register();
}