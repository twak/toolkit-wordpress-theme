<?php
/**
 * Twitter
 */

/* get twitter settings from theme options */
$screen_name = get_field('screen_name', 'option');
$consumer_key = get_field('consumer_key', 'option');
$consumer_secret = get_field('consumer_secret', 'option');
$access_token = get_field('access_token', 'option');
$access_token_secret = get_field('access_token_secret', 'option');

/* make sure all the parameters are available and the tmhOauth library is loaded */
if ( $screen_name && $consumer_key && $consumer_secret && $access_token && $access_token_secret ) :

    /* get twitter OAuth library */
    require_once get_template_directory() . '/lib/tmhOAuth.php';

    $include_retweets = get_field('include_retweets', 'option');
    $avatar = get_field('twitter_avatar', 'option');
    $exclude_replies = true;
    $max = 3;
    $timeout = 600; // 10 mins
?>

<div class="footer-twitter-feed">
    <div class="wrapper-lg wrapper-padded">

        <div class="row">
            <div class='col-sm-6 col-md-3'>     
                <div class="twitter-user">
                    <span class="tk-icon-social-twitter" aria-hidden="true"></span>
                    <a href="https://twitter.com/<?php echo $screen_name; ?>">@<?php echo $screen_name; ?></a>
                    <?php
                    if ( ! empty( $avatar ) ) {
                        $avatar_url = $avatar['sizes']['thumbnail'];
                        printf('<br><a href="https://twitter.com/%s" target="_blank"><img src="%s" alt="Twitter user icon" style="width:50px;height:auto;"></a>', $screen_name, $avatar_url);
                    }
                    ?>
                </div>       
            </div>
<?php
    
    if ( false === ( $value = get_transient( 'twitter_cache' ) ) ) { //if transient not set
        
        $connection = new tmhOAuth(array('consumer_key' =>  $consumer_key,
                                         'consumer_secret' => $consumer_secret,
                                         'user_token' => $access_token,
                                         'user_secret' => $access_token_secret));

        // Retrieve more tweets than max, to allow for the fact that @replies and retweets are deducted from this total, if excluded.
        $count =  $max * 4;
        $connection->request('GET', $connection->url('1.1/statuses/user_timeline.json'),
                             array('include_rts' => $include_retweets, 'exclude_replies' => $exclude_replies, 'count' => $count, 'screen_name' => $screen_name));    

        if ($connection->response['code'] == '200') {
            $responses = json_decode($connection->response['response']);
            $tCount = 0;
            $buffer = "";

            foreach ($responses as $status) {
                $text = tk_parse_tweet( $status );
                $dateString = tk_get_tweet_date( strtotime( $status->created_at ) );

                $buffer .= "<div class='col-sm-6 col-md-3'><div class='tweet'>\n";
                $buffer .= "<p class='tweet-content'>&ldquo;" . $text . "&rdquo;</p>" . "\n";
                $buffer .= "<p class='tweet-footer'><span class='date'>" . $dateString . "</span></p>";
                $buffer .= "</div></div>";

                $tCount ++;
                if ($tCount >= $max)
                    break;

            }
           
            set_transient( 'twitter_cache', $buffer, 90 ); //set transient to expire afte 90 secs
            echo $buffer;
        }
    } else { //if transient set        
        echo get_transient( 'twitter_cache');
    }

?>

        </div>
    </div>
</div>

<?php

endif;
/**
 * parses a tweet, adding the user picture, linked username, and links in body
 */
function tk_parse_tweet($tweet, $options = array())
{
    $text = '';
    $is_retweet = false;
    /*if ( ! isset( $tweet->user ) ) {
        return '';
    }
    if ( $tweet->user->profile_image_url ) {
        $text .= sprintf( '<a href="https://twitter.com/%1$s" title="View @%1$s on twitter"><img src="%2$s" alt="%3$s" class="profile-image"/></a>', $tweet->user->screen_name, $tweet->user->profile_image_url, esc_attr( $tweet->user->name ) );
    } else {
        $text .= sprintf( '<a href="https://twitter.com/%1$s" title="View @%1$s on twitter">@%1$s</a>', $tweet->user->screen_name );
    }*/

    /* if this is a retweet, use the original tweet for parsing */
    if (isset($tweet->retweeted_status)) {
        $tweet = $tweet->retweeted_status;
        $is_retweet = true;
    }

    // Number of UTF-8 characters in plain tweet.
    $textlen = mb_strlen( $tweet->text ); 

    // array of characters in tweet
    $ChAr = array();

    // add each character of the tweet to the $ChAr array
    for ( $i = 0; $i < $textlen; $i++ ) {
        $ch = mb_substr($tweet->text, $i, 1);
        if ( $ch <> "\n" ) {
            $ChAr[] = $ch;
        } else {
            $ChAr[] = "\n<br/>"; // Keep new lines in HTML tweet.
        }
    }

    // go through the tweet replacing entities
    if ( isset( $tweet->entities ) ) {
        // link to user mentions
        if ( isset( $tweet->entities->user_mentions ) ) {
            foreach ( $tweet->entities->user_mentions as $entity ) {
                $ChAr[$entity->indices[0]] = "<a href='https://twitter.com/" . $entity->screen_name . "' class='user'>" . $ChAr[$entity->indices[0]];
                $ChAr[$entity->indices[1] -1] .= "</a>";
            }
        }
        // links to hashtags
        if ( isset( $tweet->entities->hashtags ) ) {
            foreach ( $tweet->entities->hashtags as $entity ) {
                $ChAr[$entity->indices[0]] = "<a href='https://twitter.com/search?q=%23" . $entity->text . "'>" . $ChAr[$entity->indices[0]];
                $ChAr[$entity->indices[1] - 1] .= "</a>";
            }
        }
        if ( isset( $tweet->entities->urls ) ) {
            foreach ( $tweet->entities->urls as $entity ) {
                $ChAr[$entity->indices[0]] = "<a href='" . $entity->expanded_url . "'>" . $entity->display_url . "</a>";
                for ($i = $entity->indices[0] + 1; $i < $entity->indices[1]; $i++ ) {
                    $ChAr[$i] = '';
                }
            }
        }
        if ( isset( $tweet->entities->media ) ) {
            foreach ( $tweet->entities->media as $entity ) {
                $ChAr[$entity->indices[0]] = "<a href='" . $entity->expanded_url . "'>" . $entity->display_url . "</a>";
                for ( $i = $entity->indices[0] + 1; $i < $entity->indices[1]; $i++) {
                    $ChAr[$i] = '';
                }
            }
        }
        $text .= implode('', $ChAr); // HTML tweet.
    } else {
        $text .= htmlentities(strip_tags($tweet->text, '<br><p>'));
    }
    if ($is_retweet) {
        $text = sprintf('RT <a class="user" href="http://twitter.com/%1$s">@%1$s</a>: %2$s', $tweet->user->screen_name, $text );
    }
    return $text;
}

/**
 * formats dates for tweets as
 * "just now" (less than 60 seconds)
 * "n minute(s) ago" (less than 1 hour)
 * "n hour(s) ago" (less than 1 day)
 * "n day(s) ago" (less than 1 week)
 * "n week(s) ago" (more than 1 week)
 * "on January 1st, 1971" (more than one month)
 */
function tk_get_tweet_date($timestamp)
{
    $diff = time() - $timestamp;
    $day_diff = floor($diff / 86400);
    if ($day_diff >= 31) {
        return 'on ' . date('F jS, Y', $timestamp);
    } else {
        if ($diff < 60) {
            return "just now";
        } elseif ($diff < 120) {
            return "1 minute ago";
        } elseif ($diff < 3600) {
            return floor( $diff / 60 ) . " minutes ago";
        } elseif ($diff < 7200) {
            return "1 hour ago";
        } elseif ($diff < 86400) {
            return floor( $diff / 3600 ) . " hours ago";
        } elseif ($day_diff == 1) {
            return "Yesterday";
        } elseif ($day_diff < 7) {
            return $day_diff . " days ago";
        } elseif ( $day_diff < 11 ) {
            return "about 1 week ago";
        } else {
            return ceil( $day_diff / 7 ) . " weeks ago";
        }
    }
}
