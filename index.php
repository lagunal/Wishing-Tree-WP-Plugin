<?php

/*
  Plugin Name: Wishing Tree
  Description: Plugin to users be able to submit a wish to the wishing tree
  Version: 1.0
  Author: Ludwing Laguna
  Author URI: https://github.com/LearnWebCode
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

function add_book_columns($columns) {
  // unset($columns['author']);
  return array_merge($columns, 
            array('content' => __('wish'),
                  'user_email' =>__( 'email')));
}
add_filter('manage_wish_posts_columns' , 'add_book_columns');

function manage_wish_columns($column, $post_id) {
  $wishData = get_post_meta($post_id, 'user_email', true);
  $wishPost = get_post($post_id);
  $content = $wishPost->post_content;
  switch($column) {
    case 'content':
      echo $content;
      break;
    case 'user_email':
      echo isset($wishData) ? $wishData : 'N/A';
      break;
    defaul:
      break;
  }
}
add_action('manage_wish_posts_custom_column','manage_wish_columns', 10, 2);

class WishingTree {
  function __construct() {
    add_action('init', array($this, 'onInit'));
    add_action('rest_api_init', [$this, 'wishEmailEndPoint']);
    //add_action('admin_init', [$this, 'wishingAdminInit']);
  }

  function wishEmailEndPoint() {
    register_rest_route('wishing-tree/v1', '/save-wish', array(
      'methods' => 'POST',
      'callback' => [$this, 'postWish'],
    ));
  }

  function onInit() {
    wp_register_script('wishingTreeScript', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
    wp_register_style('wishingTreeStyle', plugin_dir_url(__FILE__) . 'build/index.css');
    
    register_block_type('wishing-tree/wishing-tree-block', array(
      'render_callback' => array($this, 'renderCallback'),
      'editor_script' => 'wishingTreeScript',
      'editor_style' => 'wishingTreeStyle'
    ));

    register_post_type('wish', array(
      'label' => 'Wishes',
      'public' => true,
      'menu_icon' => 'dashicons-heart',
      'show_in_rest' => true,
      'supports' => array('title', 'editor','excerpt'),
      'labels' => array(
            'name' => 'Wishes',
            'add_new_item' => 'Add New Wish',
            'edit_item' => 'Edit Wish',
            'all_items' => 'All Wishes',
            'singular_name' => 'Wish'
          ), 
    ));

    // register_meta('wish', 'useremail', array(
    //   'show_in_rest' => true,
    //   'type' => 'string',
    //   'single' => false
    // ));
  }

  function postWish($data) {
      wp_insert_post(array(
        'post_type' => 'wish',
        'post_status' => 'publish',
        'post_content' => $data['content'],
        'post_title' => $data['title'],
        'post_author' => get_current_user_id(),
        'meta_input' => array(
            'user_email' => $data['email']
        )
        )); 
    
  }

  function renderCallback($attributes) {
    if (!is_admin()) {
      wp_enqueue_script('wishingFrontendScript', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'));
      wp_enqueue_style('wishingFrontendStyles', plugin_dir_url(__FILE__) . 'build/frontend.css');
    }

    ob_start(); ?>
    <div class="boilerplate-update-me"><pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre></div>
    <?php return ob_get_clean();
    
  }

  function renderCallbackBasic($attributes) {
    return '<div class="boilerplate-frontend">Hello, the sky is ' . $attributes['skyColor'] . ' and the grass is ' . $attributes['grassColor'] . '.</div>';
  }
}

$WishingTree = new WishingTree();