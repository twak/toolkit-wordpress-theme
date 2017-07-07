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
            /* ensure content width variable is set */
            add_action( 'template_redirect', array( __CLASS__, 'set_content_width' ) );

            /* add favicons */
            add_action( 'wp_head', array( __CLASS__, 'add_favicons' ) );

            /* add SEO stuff */
            add_action( 'wp_head', array( __CLASS__, 'add_seo' ) );

            /* add theme support for various features */
            add_action( 'after_setup_theme', array( __CLASS__, 'add_theme_support' ) );

            /* add custom image sizes */
            add_action( 'after_setup_theme', array( __CLASS__, 'add_image_sizes' ) );

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

            /* Remove thumbnail width and height dimensions */
            add_filter( 'post_thumbnail_html', array( __CLASS__, 'remove_thumbnail_dimensions' ), 10 );

            /* Add page slug to body class */
            add_filter( 'body_class', array( __CLASS__, 'add_slug_to_body_class' ) );

            /* Change search query string 's' work with 'q' for corporate search */
            add_filter( 'query_vars', array( __CLASS__, 'change_search_query' ) );

            /* Custom View Article link to Post */
            add_filter( 'excerpt_more', array( __CLASS__, 'excerpt_more' ) );

            /* Drop caps setting */
            add_action( 'plugins_loaded', array( __CLASS__, 'drop_cap_settings' ) );

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
         * sets the content_width global variable
         * @see https://codex.wordpress.org/Content_Width
         * @see https://core.trac.wordpress.org/ticket/21256 
         * TRAC ticket which gives example of setting it dynamically
         */
        public static function set_content_width()
        {
            global $content_width;
            $content_width = 900;
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
                    "rel" => "shortcut icon"
                ),
                array(
                    "filename" => "apple-touch-icon-180x180-precomposed.png",
                    "sizes" => "180x180",
                    "rel" => "apple-touch-icon-precomposed"
                ),
                array(
                    "filename" => "apple-touch-icon-152x152-precomposed.png",
                    "sizes" => "152x152",
                    "rel" => "apple-touch-icon-precomposed"
                ),
                array(
                    "filename" => "apple-touch-icon-144x144-precomposed.png",
                    "sizes" => "144x144",
                    "rel" => "apple-touch-icon-precomposed"
                ),
                array(
                    "filename" => "apple-touch-icon-120x120-precomposed.png",
                    "sizes" => "120x120",
                    "rel" => "apple-touch-icon-precomposed"
                ),
                array(
                    "filename" => "apple-touch-icon-114x114-precomposed.png",
                    "sizes" => "114x114",
                    "rel" => "apple-touch-icon-precomposed"
                ),
                array(
                    "filename" => "apple-touch-icon-76x76-precomposed.png",
                    "sizes" => "76x76",
                    "rel" => "apple-touch-icon-precomposed"
                ),
                array(
                    "filename" => "apple-touch-icon-72x72-precomposed.png",
                    "sizes" => "72x72",
                    "rel" => "apple-touch-icon-precomposed"
                ),
                array(
                    "filename" => "apple-touch-icon-precomposed.png",
                    "rel" => "apple-touch-icon-precomposed"
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
                    $rel_attr = ( isset( $icon["rel"] ) ) ? sprintf(' rel="%s"', esc_attr( $icon["rel"] ) ): "";
                    printf("<link%s%s href=\"%s\">\n", $rel_attr, $sizes_attr, $uri );
                }
            }
        }

        /**
         * adds SEO stuff to header
         */
        public static function add_seo()
        {
            $post_id = get_queried_object_id();
            $sitename_attr = esc_attr( get_bloginfo('name') );
            $title_attr = esc_attr( get_bloginfo('name') );
            $description_attr = esc_attr( get_bloginfo('description') );
            $thumbnail_attr = '';
            $url = home_url();
            /* see if the request is for a single page or other post type */
            if ( ! is_front_page() && $post_id && ( is_single( $post_id ) || is_page ( $post_id ) ) ) {
                $title_attr = esc_attr( get_the_title( $post_id ) ) . ' | ' . $title_attr;
                $description_attr = esc_attr( trim( strip_tags( get_the_excerpt( $post_id ) ) ) );
                if ( has_post_thumbnail( $post_id ) ) {
                    $thumbnail_attr = esc_attr( get_the_post_thumbnail_url( $post_id ) );
                }
                $url = wp_get_canonical_url( $post_id );
            }
            if ( is_post_type_archive() ) {
                $post_type = get_post_type();
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
            print("\n<!-- Canonical URL -->\n");
            printf('<link rel="canonical" href="%s" />', $url );
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
         * adds custom image sizes
         */
        public static function add_image_sizes()
        {
            // Large Thumbnail
            add_image_size( 'large', 700, '', true );

            // Medium Thumbnail
            add_image_size( 'medium', 250, '', true );

            // Small Thumbnail
            add_image_size( 'small', 120, '', true );

            // Profile image
            add_image_size( 'profile-size', 400, '', true );

            // Featured image
            add_image_size( 'featured-size', 800, 400, true );

            // Banner swiper size small 
            add_image_size( 'banner-size-small', 1000, 500, true );

            // Banner swiper size large
            add_image_size( 'banner-size-large', 1400, 700, true );
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
            wp_register_style(
                'style', 
                get_template_directory_uri() . '/style.css', 
                array(), 
                tk_admin::$version, 
                'all'
            );
            wp_enqueue_style('style');

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
            if( $post_type == 'post' || $post_type == 'page' ) {
                wp_register_script(
                    'tk-admin-js', 
                    get_template_directory_uri() . '/js/admin.js', 
                    array('jquery'), 
                    tk_admin::$version,
                    true
                );
                wp_enqueue_script('tk-admin-js');
            }
        }

        /**
         * adds google analytics to footer
         */
        public static function analytics_footer()
        {
            print("<script>\n");
            print("(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n");
            print("(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n");
            print("m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n");
            print("})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n");
            print("ga('create', 'UA-12466371-3', 'auto', 'leedstracker');\n");
            print("ga('leedstracker.send', 'pageview');\n");
            if ( have_rows('tk_google_analytics', 'option') ) {
                while ( have_rows('tk_google_analytics', 'option') ) : the_row();
                    $code = get_sub_field('tk_google_analytics_code');
                    $label = strtolower(preg_replace('/[^a-zA-Z0-9]*/', '', $code));
                    if ( ! empty($code) && ! empty($label) ) {
                        printf("ga('create', '%s', 'auto', '%s');\n", $code, $label);
                        printf("ga('%s.send', 'pageview');\n", $label);
                    }
                endwhile;
            }
            print("</script>\n");
        }

        /**
         * Change seperator from WordPress default - to : in the <title> tag
         */
        public static function change_separator()
        {
            return ':';
        }

        /**
         * Remove thumbnail width and height dimensions that prevent fluid images in the_thumbnail
         */
        public static function remove_thumbnail_dimensions( $html )
        {
            $html = preg_replace('/(width|height)=\"\d*\"\s/', "", $html);
            return $html;
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

        public static function drop_cap_settings()
        {
            /* drop caps on posts - controlled by theme option */
            if ( function_exists('get_field') && get_field( 'tk_content_settings_dropcap', 'option' ) ) {
                add_filter( 'the_content', array( __CLASS__, 'add_drop_caps' ), 30 );
                add_filter( 'the_excerpt', array( __CLASS__, 'add_drop_caps' ), 30 );
            }
        }

        /**
         * adds summary class and drop cap to first paragraph
         */
        public static function add_drop_caps($content)
        {
            global $post;

            //only posts
            if ( ! empty($post) && $post->post_type == "post")
            {
                if ( preg_match("/\<p\>[A-Z]/i", $content, $matches ) ) {
                    $match = $matches[0];
                    if ( ! empty($match) ) {
                        $letter = str_replace("<p>", "", $match);
                        $dropcap = '<p class="summary"><span class="dropcaps">' . $letter . '</span>';
                        $firstChar = strpos($content, $match);
                        if ($firstChar !== false) {
                            $beforeStr = substr($content, 0, $firstChar);
                            $afterStr = substr($content, $firstChar + strlen($match) );
                            $content = $beforeStr . $dropcap . $afterStr;
                        }
                    }
                }
            }
            return $content;
        }

        /**
         * add excerpt support for pages
         */
        public static function add_excerpts_to_pages()
        {
            add_post_type_support( 'page', 'excerpt' );
        }
    }
    tk_setup::register();
}