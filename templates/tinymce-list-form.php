<?php

use \ithoughts\tooltip_glossary\Backbone as Backbone;
/**
 * @file Template file for TinyMCE "Insert a list" editor
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.6.5
 */ 



if ( ! defined( 'ABSPATH' ) ) { 
    exit; // Exit if accessed directly
}

?>
<div id="ithoughts_tt_gl-list-form-container">
    <!--<pre style="display:none;"><?php var_dump($data); ?></pre>-->
    <div id="pseudohead">
        <?php wp_print_styles("ithoughts_tooltip_glossary-tinymce_form"); ?>
        <?php wp_print_scripts("ithoughts_tooltip_glossary-utils"); ?>
        <?php wp_print_scripts("ithoughts_tooltip_glossary-tinymce_form"); ?>
    </div>
    <div aria-label="<?php _e('Insert Glossary Index', 'ithoughts-tooltip-glossary'); ?>" role="dialog" style="border-width: 1px; z-index: 999999;" class="mce-container mce-panel mce-floatpanel mce-window mce-in" hidefocus="1" id="ithoughts_tt_gl-list-form">
        <div class="mce-reset" role="application">
            <div class="mce-window-head">
                <div class="mce-title">
                    <?php _e('Insert Glossary Index', 'ithoughts-tooltip-glossary' ); ?>
                </div>
                <button aria-hidden="true" class="mce-close ithoughts_tt_gl-tinymce-discard" type="button">×</button>
            </div>


            <div class="mce-container-body mce-window-body">
                <div class="mce-container mce-form mce-first mce-last">
                    <div class="mce-container-body" style="height: 100%;">







                        <form>
                            <div style="padding:10px;flex:0 0 auto;">
                                <div class="tab-container">
                                    <ul class="tabs" role="tablist">
                                        <li class="<?php echo ("atoz" === $data['type']) ? "active" : ""; ?>" role="tab" tabindex="-1">
                                            <?php _e("A to Z", 'ithoughts-tooltip-glossary' ); ?>
                                        </li>


                                        <li class="<?php echo ("list" === $data['type']) ? "active" : ""; ?>" role="tab" tabindex="-1">
                                            <?php _e("List", 'ithoughts-tooltip-glossary' ); ?>
                                        </li>
                                    </ul>



                                    <div class="tab<?php echo ("atoz" === $data['type']) ? " active" : ""; ?>">
                                    </div>
                                    <div class="tab<?php echo ("list" === $data['type']) ? " active" : ""; ?>">
                                    </div>
                                </div>
                                <div class="mce-container mce-panel mce-abs-layout-item mce-first mce-last" hidefocus="1" tabindex="-1" style="border-width: 0px; left: 20px; top: 20px; width: 356px; height: 220px;">
                                    <div class="mce-tabs" role="tablist">
                                        <div class="mce-tab mce-active" unselectable="on" role="tab" aria-controls="mceu_66" aria-selected="true" tabindex="-1"><?php _e('List', 'ithoughts-tooltip-glossary'); ?></div>
                                        <div class="mce-tab" unselectable="on" role="tab" aria-controls="mceu_71" aria-selected="false" tabindex="-1"><?php _e('A to Z', 'ithoughts-tooltip-glossary'); ?></div>
                                    </div>
                                    <div class="mce-container-body mce-abs-layout" style="width: 356px; height: 190px;">
                                        <div class="mce-container mce-form mce-abs-layout-item mce-first" role="tabpanel" style="left: 0px; top: 0px; width: 356px; height: 190px;">
                                            <div class="mce-container-body mce-abs-layout" style="width: 356px; height: 190px;">
                                                <div class="mce-container mce-abs-layout-item mce-first mce-formitem" hidefocus="1" tabindex="-1" style="left: 20px; top: 20px; width: 316px; height: 30px;">
                                                    <div class="mce-container-body mce-abs-layout" style="width: 316px; height: 30px;">
                                                        <label class="mce-widget mce-label mce-abs-layout-item mce-first" for="mceu_67" style="line-height: 16px; left: 0px; top: 7px; width: 103px; height: 16px;"><?php _e('Letters', 'ithoughts-tooltip-glossary'); ?></label><input hidefocus="1" class="mce-textbox mce-abs-layout-item mce-last" aria-label="<?php _e('Letters to be displayed in the list. If not specified, all letters will be displayed', 'ithoughts-tooltip-glossary'); ?>" style="left: 103px; top: 0px; width: 203px; height: 28px;">
                                                    </div>
                                                </div>
                                                <div class="mce-container mce-abs-layout-item mce-formitem" hidefocus="1" tabindex="-1" style="left: 20px; top: 60px; width: 316px; height: 30px;">
                                                    <div class="mce-container-body mce-abs-layout" style="width: 316px; height: 30px;">

                                                        <label class="mce-widget mce-label mce-abs-layout-item mce-first" for="mceu_68" style="line-height: 16px; left: 0px; top: 7px; width: 103px; height: 16px;"><?php _e('Columns', 'ithoughts-tooltip-glossary'); ?></label><input hidefocus="1" class="mce-textbox mce-abs-layout-item mce-last" aria-label="<?php _e('Number of columns to show for list', 'ithoughts-tooltip-glossary'); ?>" style="left: 103px; top: 0px; width: 203px; height: 28px;">
                                                    </div>
                                                </div>
                                                <div class="mce-container mce-abs-layout-item mce-formitem" hidefocus="1" tabindex="-1" style="left: 20px; top: 100px; width: 316px; height: 30px;">
                                                    <div class="mce-container-body mce-abs-layout" style="width: 316px; height: 30px;">
                                                        <label class="mce-widget mce-label mce-abs-layout-item mce-first" for="mceu_69" style="line-height: 16px; left: 0px; top: 7px; width: 103px; height: 16px;"><?php _e('Description', 'ithoughts-tooltip-glossary'); ?></label>
                                                        <div class="mce-widget mce-btn mce-menubtn mce-listbox mce-abs-layout-item mce-last mce-btn-has-text" tabindex="-1" role="button" aria-label="<?php _e('Description mode: Full/Excerpt/None', 'ithoughts-tooltip-glossary'); ?>" aria-haspopup="true" style="left: 103px; top: 0px; width: 211px; height: 28px;"><button role="presentation" type="button" tabindex="-1" style="height: 100%; width: 100%;"><span class="mce-txt"><?php _e('None', 'ithoughts-tooltip-glossary'); ?></span> <i class="mce-caret"></i></button></div>
                                                    </div>
                                                </div>
                                                <div class="mce-container mce-abs-layout-item mce-last mce-formitem" hidefocus="1" tabindex="-1" style="left: 20px; top: 140px; width: 316px; height: 30px;">
                                                    <div class="mce-container-body mce-abs-layout" style="width: 316px; height: 30px;">
                                                        <label class="mce-widget mce-label mce-abs-layout-item mce-first" for="mceu_70" style="line-height: 16px; left: 0px; top: 7px; width: 103px; height: 16px;"><?php _e('Group', 'ithoughts-tooltip-glossary'); ?></label><input hidefocus="1" class="mce-textbox mce-abs-layout-item mce-last" aria-label="<?php _e('Group(s) to list', 'ithoughts-tooltip-glossary'); ?>" style="left: 103px; top: 0px; width: 203px; height: 28px;">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mce-container mce-form mce-abs-layout-item mce-last" role="tabpanel" style="left: 0px; top: 0px; width: 356px; height: 190px; display: none;">
                                            <div class="mce-container-body mce-abs-layout" style="width: 356px; height: 190px;">
                                                <div class="mce-container mce-abs-layout-item mce-first mce-formitem" hidefocus="1" tabindex="-1" style="left: 20px; top: 20px; width: 316px; height: 30px;">
                                                    <div class="mce-container-body mce-abs-layout" style="width: 316px; height: 30px;">
                                                        <label class="mce-widget mce-label mce-abs-layout-item mce-first" for="mceu_72" style="line-height: 16px; left: 0px; top: 7px; width: 76px; height: 16px;"><?php _e('Letters', 'ithoughts-tooltip-glossary'); ?></label><input hidefocus="1" class="mce-textbox mce-abs-layout-item mce-last" aria-label="<?php _e('Letters to be displayed in the list. If not specified, all letters will be displayed', 'ithoughts-tooltip-glossary'); ?>" style="left: 76px; top: 0px; width: 230px; height: 28px;">
                                                    </div>
                                                </div>
                                                <div class="mce-container mce-abs-layout-item mce-last mce-formitem" hidefocus="1" tabindex="-1" style="left: 20px; top: 60px; width: 316px; height: 30px;">
                                                    <div class="mce-container-body mce-abs-layout" style="width: 316px; height: 30px;">
                                                        <label class="mce-widget mce-label mce-abs-layout-item mce-first" for="mceu_73" style="line-height: 16px; left: 0px; top: 7px; width: 76px; height: 16px;"><?php _e('Group', 'ithoughts-tooltip-glossary'); ?></label><input hidefocus="1" class="mce-textbox mce-abs-layout-item mce-last" aria-label="<?php _e('Group(s) to list', 'ithoughts-tooltip-glossary'); ?>" style="left: 76px; top: 0px; width: 230px; height: 28px;">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="mce-container mce-panel mce-foot" hidefocus="1" tabindex="-1" role="group" style="border-width: 1px 0px 0px; left: 0px; top: 0px; width: 396px; height: 50px;">
                <div class="mce-container-body mce-abs-layout" style="width: 396px; height: 50px;">

                    <div class="mce-widget mce-btn mce-primary mce-abs-layout-item mce-first mce-btn-has-text" tabindex="-1" role="button" style="left: 271px; top: 10px; width: 50px; height: 28px;">
                        <button role="presentation" type="button" tabindex="-1" style="height: 100%; width: 100%;">
                            <?php _e('OK', 'ithoughts-tooltip-glossary'); ?>
                        </button>
                    </div>
                    <div class="mce-widget mce-btn mce-abs-layout-item mce-last mce-btn-has-text" tabindex="-1" role="button" style="left: 326px; top: 10px; width: 58px; height: 28px;">
                        <button role="presentation" type="button" tabindex="-1" style="height: 100%; width: 100%;">
                            <?php _e('Cancel', 'ithoughts-tooltip-glossary'); ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>



    <div style="z-index: 100100;" id="mce-modal-block" class="mce-reset mce-fade mce-in">
    </div>
</div>