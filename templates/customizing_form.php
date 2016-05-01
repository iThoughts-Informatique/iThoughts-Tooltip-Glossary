<?php

if ( ! defined( 'ABSPATH' ) ) { 
    exit; // Exit if accessed directly
}

?>
<div class="wrap">
    <div id="ithoughts-tooltip-glossary-options" class="meta-box meta-box-50 metabox-holder">
        <div class="meta-box-inside admin-help">
            <div class="icon32" id="icon-options-general">
                <br>
            </div>
            <h2><?php _e('Theme editor', 'ithoughts-tooltip-glossary' ); ?></h2>
            <div id="dashboard-widgets-wrap">
                <div id="dashboard-widgets">
                    <div style="display:flex;flex-direction:row;flex-wrap:wrap;">
                        <div id="normal-sortables" class="" style="flex:1 1 auto;"><!--Old removed classes: "meta-box-sortables ui-sortable"-->
                            <div class="postbox">
                                <h3 class="hndle"><span><?php _e('Load a theme', 'ithoughts-tooltip-glossary' ); ?></span></h3>
                                <div class="inside">
                                    <form id="ithoughts_loadtheme" method="get">
                                        <input type="hidden" name="page" value="ithought-tooltip-glossary-themes"/>
                                        <label for="themename"><?php _e('Theme to load', 'ithoughts-tooltip-glossary' ); ?></label>
                                        <?php echo $inputs["themeselect"]; ?>
                                        <button type="submit" name="action" class="button button-primary" value="load"><?php _e('Load', 'ithoughts-tooltip-glossary' ); ?></button>
                                        <button type="submit" class="button button-secondary" name="action" value="delete" onclick="var themename=gei('themename');return ((themename&&themename.value&&(themename=themename.value))?confirm('<?php _e('Are you sure you want to delete the theme %s?', 'ithoughts-tooltip-glossary'); ?>'.replace('%s', themename)):false);"><?php _e('Delete', 'ithoughts-tooltip-glossary' ); ?></button>
                                    </form>
                                </div>
                            </div>

                            <form method="get">
                                <input type="hidden" name="page" value="ithought-tooltip-glossary-themes"/>
                                <button type="submit" name="action" class="button button-secondary floatright" value="recompile" style="width:100%;margin:0 auto 25px;padding: 25px;line-height: 0;"><?php _e('Recompile all stylesheets', 'ithoughts-tooltip-glossary' ); ?></button>
                            </form>

                            <div class="postbox" id="ithoughts-tt-gl-lesseditor">
                                <h3 class="hndle"><span><?php _e('LESS editor', 'ithoughts-tooltip-glossary' ); ?></span></h3>
                                <div class="inside">
                                    <form id="LESS-form" action="<?php echo admin_url( 'admin-ajax.php' ); ?>" method="post" class="simpleajaxform" data-target="update-response">
                                        <input type="hidden" name="action" id="action"/>
                                        <?php echo $inputs["splittedHead"]; ?>
                                        <?php echo $inputs["file"]; ?>
                                        
                                        <table class="form-table stripped">
                                            <tr>
                                                <th><?php _e("Theme name", "ithoughts-tooltip-glossary"); ?></th>
                                                <td><?php echo $inputs["themename"]; ?></td>
                                            </tr>
                                            <tr>
                                                <th><?php _e("Theme content", "ithoughts-tooltip-glossary"); ?></th>
                                                <td><?php echo $inputs["content"]; ?></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <div>
                                                        <button name="actionB" value="ithoughts_tt_gl_theme_save" id="compilecss" class="alignleft button button-primary" style="display:inline-block;width:50%;text-align:center;"><?php _e("Save theme", 'ithoughts-tooltip-glossary' ); ?></button>
                                                        <button name="actionB" value="ithoughts_tt_gl_theme_preview" id="previewcss" class="alignleft button" style="display:inline-block;width:50%;text-align:center;"><?php _e("Preview", 'ithoughts-tooltip-glossary' ); ?></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <div id="update-response" class="clear confweb-update"></div>
                                                </td>
                                            </tr>
                                        </table>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div style="flex:1 1 auto;position:relative;">
                            <div id="floater" style="display:flex;flex-direction:row;width:100%;">
                                <!--<p style="flex:1 1 auto;text-align:center">
<span class="ithoughts_tt_gl-tooltip" data-tooltip-nosolo="true" data-tooltip-id="exampleActivate" data-tooltip-content="<?php echo rawurlencode(__('The <b>tooltip</b> or <b>infotip</b> or a <b>hint</b> is a common <a href="/wiki/Graphical_user_interface" title="Graphical user interface">graphical user interface</a> element. It is used in conjunction with a <a href="/wiki/Cursor_(computers)" title="Cursor (computers)" class="mw-redirect">cursor</a>, usually a <a href="/wiki/Pointer_(graphical_user_interfaces)" title="Pointer (graphical user interfaces)">pointer</a>. The user hovers the pointer over an item, without clicking it, and a tooltip may appear—a small "<a href="/wiki/Hoverbox" title="Hoverbox">hover box</a>" with information about the item being hovered over.<sup id="cite_ref-1" class="reference"><a href="#cite_note-1"><span>[</span>1<span>]</span></a></sup> <sup id="cite_ref-2" class="reference"><a href="#cite_note-2"><span>[</span>2<span>]</span></a></sup>Tooltips do not usually appear on <a href="/wiki/Mobile_operating_system" title="Mobile operating system">mobile operating systems</a>, because there is no cursor (though tooltips may be displayed when using a <a href="/wiki/Mouse_(computing)" title="Mouse (computing)">mouse</a>).', 'ithoughts-tooltip-glossary' )); ?>"><a href="javascript:void(0)" title=""><?php _e('Activate me', 'ithoughts-tooltip-glossary' ); ?></a></span>
</p>-->
                                <p style="flex:1 1 auto;text-align:center">
                                    <span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-autoshow="true" data-tooltip-theme="<?php echo $themename; ?>" data-tooltip-id="exampleStyle" data-tooltip-nosolo="true" data-tooltip-nohide="true" data-tooltip-content="<?php _e('This is an example tooltip, with content such as <a>a tag for link</a>, <em>em tag for emphasis</em>, <b>b tag for bold</b> and <i>i tag for italic</i>', 'ithoughts-tooltip-glossary' ); ?>"><a href="javascript:void(0)" title=""><?php _e('Example Tooltip', 'ithoughts-tooltip-glossary' ); ?></a></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>