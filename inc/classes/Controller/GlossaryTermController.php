<?php

namespace ithoughts\TooltipGlossary\Controller;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

if(!class_exists( __NAMESPACE__ . '\\GlossaryTermController' )){
    /**
     * @see https://developer.wordpress.org/rest-api/extending-the-rest-api/controller-classes/
     */
    class GlossaryTermController {
        public const namespace = 'ithoughts-tooltip-glossary/v1';
        private const resource_name = 'glossary-term';
        
        public function __construct(){
            //var_dump("Init");
        }

        public static function get_url(): string {
            return self::namespace . '/' . self::resource_name;
        }
        
        // Register our routes.
        public function register() {
            //var_dump("register ".$this->get_url());
            register_rest_route( self::namespace, '/'.self::resource_name, [
                // Here we register the readable endpoint for collections.
                [
                    'methods'   => 'GET',
                    'callback'  => [ $this, 'get_items' ],
                    'args'      => [
                        'search' => [
                            'description'       => esc_html__( 'String to search in glossary terms.', 'my-textdomain' ),
                            'type'              => 'string',
                            'validate_callback' => function($param, $request, $key) {
                                return $param !== NULL && is_string($param);
                            },
                            'sanitize_callback' => function($param, $request, $key) {
                                return trim($param);
                            },
                        ],
                        'page' => [
                            'description'       => esc_html__( 'Page index of the search.', 'my-textdomain' ),
                            'type'              => 'integer',
                            'default'           => 1,
                            'validate_callback' => function($param, $request, $key) {
                                return $param !== NULL && is_numeric($param);
                            },
                            'sanitize_callback' => 'absint',
                        ],
                        'per_page' => [
                            'description'       => esc_html__( 'Number of items to return per page.', 'my-textdomain' ),
                            'type'              => 'integer',
                            'default'           => 25,
                            'validate_callback' => function($param, $request, $key) {
                                return $param !== NULL && is_numeric($param);
                            },
                            'sanitize_callback' => 'absint',
                        ],
                    ],
                    'permission_callback' => [ $this, 'get_items_permissions_check' ],
                ],
                // Register our schema callback.
                'schema' => [ $this, 'get_item_schema' ],
            ] );
            register_rest_route( self::namespace, '/'.self::resource_name . '/(?P<id>[\d]+)', [
                // Notice how we are registering multiple endpoints the 'schema' equates to an OPTIONS request.
                [
                    'methods'   => 'GET',
                    'callback'  => [ $this, 'get_item' ],
                    'args'      => [
                        'id' => [
                            'description'       => esc_html__( 'ID of the glossary term to fetch.', 'my-textdomain' ),
                            'type'              => 'integer',
                            'required'          => true,
                            'validate_callback' => function($param, $request, $key) {
                                return $param !== NULL && is_numeric($param);
                            },
                            'sanitize_callback' => 'absint',
                        ],
                    ],
                    'permission_callback' => [ $this, 'get_item_permissions_check' ],
                ],
                // Register our schema callback.
                'schema' => [ $this, 'get_item_schema' ],
             ] );
        }
        
        // #region Authorization

        /**
         * Check permissions for the posts.
         *
         * @param WP_REST_Request $request Current request.
         */
        public function get_items_permissions_check( \WP_REST_Request $request ) {
            /*var_dump(get_post_type_capabilities('post'));
            if ( ! current_user_can( 'read_post' ) ) {
                return new \WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the post resource.' ), [ 'status' => $this->authorization_status_code() ) );
            }*/
            return true;
        }
        
        /**
         * Check permissions for the posts.
         *
         * @param WP_REST_Request $request Current request.
         */
        public function get_item_permissions_check( \WP_REST_Request $request ) {
            /*
            if ( ! current_user_can( 'read' ) ) {
                return new \WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the post resource.' ), [ 'status' => $this->authorization_status_code() ) );
            }
            */
            return true;
        }
        
        // #endregion
        
        // #region Endpoints
        
        /**
         * Get our sample schema for a post.
         *
         * @param WP_REST_Request $request Current request.
         */
        public function get_item_schema( \WP_REST_Request $request = NULL ) {
            $schema = [
                // This tells the spec of JSON Schema we are using which is draft 4.
                '$schema'              => 'http://json-schema.org/draft-04/schema#',
                // The title property marks the identity of the resource.
                'title'                => 'glossary',
                'type'                 => 'object',
                // In JSON Schema you can specify object properties in the properties attribute.
                'properties'           => [
                    'id' => [
                        'description'  => esc_html__( 'Unique identifier for the object.', 'my-textdomain' ),
                        'type'         => 'integer',
                        'context'      => [ 'view', 'edit', 'embed' ],
                        'readonly'     => true,
                    ],
                    'content' => [
                        'description'  => esc_html__( 'The content for the object.', 'my-textdomain' ),
                        'type'         => 'string',
                    ],
                    'title' => [
                        'description'  => esc_html__( 'The title for the object.', 'my-textdomain' ),
                        'type'         => 'string',
                    ],
                    'excerpt' => [
                        'description'  => esc_html__( 'The excerpt for the object.', 'my-textdomain' ),
                        'type'         => 'string',
                    ],
                ],
            ];
            
            return $schema;
        }

        /**
         * Grabs the five most recent posts and outputs them as a rest response.
         *
         * @param WP_REST_Request $request Current request.
         */
        public function get_items( \WP_REST_Request $request ) {
            $search = $request->get_param('search');
            $per_page = intval($request->get_param('per_page') ?? '25');
            $page = intval($request->get_param('page') ?? '1');

            $args = [
                'offset'         => ($page - 1) * $per_page,
                'posts_per_page' => $per_page,
                'post_type'      => 'glossary',
                's'              => $search,
            ];
            $posts = get_posts( $args );
            
            $data = [];
            
            if ( empty( $posts ) ) {
                return rest_ensure_response( $data );
            }
            
            foreach ( $posts as $post ) {
                $data[] = $this->glossary_post_to_json( $post, $request );
            }
            
            // Return all of our comment response data.
            return rest_ensure_response( $this->prepare_response_for_collection( rest_ensure_response( $data ) ) );
        }
        
        /**
         * Grabs the five most recent posts and outputs them as a rest response.
         *
         * @param WP_REST_Request $request Current request.
         */
        public function get_item( \WP_REST_Request $request ) {
            $id = intval($request->get_param( 'id' ));
            $post = get_post( $id );
            
            if ( empty( $post ) || $post->post_type !== 'glossary' ) {
                $response = rest_ensure_response( NULL );
                $response->set_status( 404 );
                return $response;
            }
            
            $response = $this->glossary_post_to_json( $post, $request );
            
            // Return all of our post response data.
            return rest_ensure_response( $response );
        }

        // #endregion
        
        // #region Transformations

        /**
         * Matches the post data to the schema we want.
         *
         * @param WP_Post $post The comment object whose response is being prepared.
         * @param WP_REST_Request $request Current request.
         */
        private function glossary_post_to_json( \WP_Post $post, \WP_REST_Request $request ) {
            $post_data = [];
            
            $schema = $this->get_item_schema( $request );
            
            // We are also renaming the fields to more understandable names.
            if ( isset( $schema['properties']['id'] ) ) {
                $post_data['id'] = (int) $post->ID;
            }

            if ( isset( $schema['properties']['content'] ) ) {
                $post_data['content'] = apply_filters( 'the_content', $post->post_content, $post );
            }
            
            if ( isset( $schema['properties']['excerpt'] ) ) {
                $excerpt = apply_filters( 'the_excerpt', $post->post_excerpt, $post );
                if ( $excerpt ) {
                    $post_data['excerpt'] = $excerpt;
                }
            }
            
            if ( isset( $schema['properties']['title'] ) ) {
                $post_data['title'] = apply_filters( 'the_title', $post->post_title, $post );
            }
            
            return $post_data;
        }
        
        /**
         * Prepare a response for inserting into a collection of responses.
         *
         * This is copied from WP_REST_Controller class in the WP REST API v2 plugin.
         *
         * @param WP_REST_Response $response Response object.
         * @return array Response data, ready for insertion into collection data.
         */
        private function prepare_response_for_collection( \WP_REST_Response $response ) {
            if ( ! ( $response instanceof WP_REST_Response ) ) {
                return $response;
            }
            
            $data = (array) $response->get_data();
            $server = rest_get_server();
            var_dump($data);
            
            if ( method_exists( $server, 'get_compact_response_links' ) ) {
                $links = call_user_func( [ $server, 'get_compact_response_links' ], $response );
            } else {
                $links = call_user_func( [ $server, 'get_response_links' ], $response );
            }
            
            if ( ! empty( $links ) ) {
                $data['_links'] = $links;
            }
            
            return $data;
        }

        // #endregion
    }
}
