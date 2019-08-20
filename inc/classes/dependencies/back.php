<?php

namespace ithoughts\TooltipGlossary\Admin;

use function DI\create;
use function DI\get;

use function ithoughts\TooltipGlossary\once_flag;
use ithoughts\TooltipGlossary\MultipleCallException;
use ithoughts\TooltipGlossary\Manifest;
use ithoughts\TooltipGlossary\Admin\Menu\Manager as Menu_Manager;
use ithoughts\TooltipGlossary\Admin\PostEditor;
use ithoughts\TooltipGlossary\Controller\GlossaryTermController;
use ithoughts\TooltipGlossary\AssetRegistration\AAssetRegistration;
use ithoughts\TooltipGlossary\DependencyManager;

if ( ! defined( 'ABSPATH' ) ) {
    status_header( 403 );wp_die( 'Forbidden' );// Exit if accessed directly.
}

if(!once_flag('back-dependency-config')){
    throw new MultipleCallException('Double call to dependency injection config file.', 'back-dependency-config');
}

return [
    Manifest::class     => create()->constructor(get('assets-path'), get('assets-url')),
    Menu_Manager::class => create()->constructor(get('text-domain')),
    PostEditor::class   => create()->constructor(get(Manifest::class), get('app-namespace')),

    'asset-back-common-style'         => function(){ return AAssetRegistration::get('back-common.css'); },
    'asset-back-common'               => function(){
        return AAssetRegistration::get('back-common.js', ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-plugins', 'wp-edit-post', 'wp-data', 'wp-api', DependencyManager::get('asset-back-common-style')])
            ->add_data('ithoughtsTooltipGlossary_editorConfig', function(){
                return [
                    'manifest'            => DependencyManager::get(Manifest::class)->get_manifest(),
                    'controllerNamespace' => GlossaryTermController::namespace,
                    'shortcodeTags'       => DependencyManager::get('shortcode-tags'),
                ];
            } )
            ->as_block_type('glossarytip')
            ->as_block_type('tooltip');
    },
    'asset-back-editor-classic-style' => function(){return AAssetRegistration::get('back-editor-classic.css');},
    'asset-back-editor-classic'       => function(){
        return AAssetRegistration::get('back-editor-classic.js', [
                DependencyManager::get('asset-back-common'),
                DependencyManager::get('asset-front'),
                DependencyManager::get('asset-back-editor-classic-style'),
                'quicktags',
            ])
            ->as_tinymce_plugin(DependencyManager::get('app-namespace'), ['add-glossarytip', 'add-tooltip', 'remove-tip', 'add-list']);
    },
];
