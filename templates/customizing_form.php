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

                            <div class="postbox" id="ithoughts-tt-gl-styleeditor">
                                <h3 class="hndle"><span><?php _e('Theme editor', 'ithoughts-tooltip-glossary' ); ?></span></h3>
                                <div class="inside">
                                    <form id="customizing-form" action="<?php echo admin_url( 'admin-ajax.php' ); ?>" method="post" class="simpleajaxform" data-target="update-response">
                                        <table class="form-table stripped">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <label for="theme_name"><?php _e('Theme name', 'ithoughts-tooltip-glossary' ); ?></label>
                                                    </th>
                                                    <td colspan="2">
                                                        <?php echo $inputs["themename"]; ?>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <th><?php _e('Title Bar', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <th><?php _e('Content', 'ithoughts-tooltip-glossary' ); ?></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th rowspan="2"><?php _e('Background', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td colspan="2">
                                                        <label for="global[background]"><?php _e("Global background color", 'ithoughts-tooltip-glossary' ); ?>: </label><?php echo $inputs["global"]["background"]; ?>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <?php echo $inputs["title"]["background"]; ?>
                                                    </td>
                                                    <td>
                                                        <?php echo $inputs["content"]["background"]; ?>
                                                    </td>
                                                    <?php
                                                    /*foreach($prefixs as $prefix){
                                                    ?>
                                                        <!--<label for="<?php echo $prefix; ?>_bt" class="block"><?php _e('Type', 'ithoughts-tooltip-glossary' ); ?>&nbsp;
<select name="<?php echo $prefix; ?>_bt" value="plain" id="<?php echo $prefix; ?>_bt" class="modeswitcher">
<option value="plain"><?php _ex('Plain', 'A plain color', 'ithoughts-tooltip-glossary' ); ?></option>
<option value="gradient"><?php _e('Gradient', 'ithoughts-tooltip-glossary' ); ?></option>
</select>
</label>-->
                                                        <div data-switcher-mode="plain">
                                                            <input autocomplete="off" type="text" value="<?php echo $prefix === "g" ? "#fff" : "rgba(255,255,255,0)"; ?>" class="color-field" data-alpha="true" name="<?php echo $prefix; ?>_plain"/>
                                                        </div>

                                                        <!--<div data-switcher-mode="gradient">
<select name="<?php echo $prefix; ?>_grad_dir" value="t_b" id="<?php echo $prefix; ?>_grad_dir">
<option value="t_b"><?php _e('Top to bottom', 'ithoughts-tooltip-glossary' ); ?></option>
<option value="b_t"><?php _e('Bottom to top', 'ithoughts-tooltip-glossary' ); ?></option>
<option value="l_r"><?php _e('Left to right', 'ithoughts-tooltip-glossary' ); ?></option>
<option value="r_l"><?php _e('Right to left', 'ithoughts-tooltip-glossary' ); ?></option>
</select>
<input type="text" name="<?php echo $prefix; ?>_grad" style="width:100%;" placeholder="rgba(255,255,255,1) 0%, rgba(0,0,0,1) 100%"/>
</div>-->
                                                    </td>
                                                    <?php
                                                    }*/
                                                    ?>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Padding', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td><?php echo $inputs["title"]["padding"]; ?></td>
                                                    <td><?php echo $inputs["content"]["padding"]; ?></td>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Shadow', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td colspan="2">
                                                        <table style="margin:0px auto;width:100%">
                                                            <tr>
                                                                <td style="padding:0;" rowspan="2">
                                                                    <label for="sh-e">
                                                                        <?php _e('Enable box-shadow', 'ithoughts-tooltip-glossary' ); ?>:&nbsp;
                                                                        <input type="checkbox" value="enabled" checked id="sh-e" name="sh-e" data-child-form-controled="shadow"/>
                                                                    </label>
                                                                </td>
                                                                <td style="padding:0;">
                                                                    <label for="sh-w">
                                                                        <?php _e("Horizontal", 'ithoughts-tooltip-glossary' ); ?>&nbsp;&#8660;
                                                                        <?php echo $inputs["global"]["box-shadow"]["horizontal"]; ?>
                                                                    </label>
                                                                </td>
                                                                <td style="padding:0;">
                                                                </td>
                                                                <td style="padding:0;" rowspan="2">
                                                                    <label for="sh-s">
                                                                        <?php _e('Shadow blur', 'ithoughts-tooltip-glossary' ); ?><br />
                                                                        <?php echo $inputs["global"]["box-shadow"]["blur"]; ?>
                                                                    </label><br/>
                                                                    <label for="sh-s">
                                                                        <?php _e('Shadow spread', 'ithoughts-tooltip-glossary' ); ?><br />
                                                                        <?php echo $inputs["global"]["box-shadow"]["spread"]; ?>
                                                                    </label><br/>
                                                                    <label for="sh_c">
                                                                        <?php _e('Shadow color', 'ithoughts-tooltip-glossary' ); ?><br />
                                                                        <?php echo $inputs["global"]["box-shadow"]["color"]; ?>
                                                                    </label><br/>
                                                                    <label for="sh-i">
                                                                        <?php _e("Inset", 'ithoughts-tooltip-glossary' ); ?>:&nbsp;
                                                                        <?php echo $inputs["global"]["box-shadow"]["inset"]; ?>
                                                                    </label>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding:0;">
                                                                    <div style="border:1px solid #ddd;width:230px;height: 125px;position:relative;">
                                                                        <div style="border:1px solid #ddd;width:130px;height:25px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td style="padding:0;">
                                                                    <label for="sh-h">
                                                                        <?php _e("Vertical", 'ithoughts-tooltip-glossary' ); ?>&nbsp;&#8661;<br/>
                                                                        <?php echo $inputs["global"]["box-shadow"]["vertical"]; ?>
                                                                    </label>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Outline border', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td colspan="2">
                                                        <table class="form-table">
                                                            <tr>
                                                                <td>
                                                                    <label for="global[border][width]">
                                                                        <?php _e("Border width", 'ithoughts-tooltip-glossary' ); ?>:&nbsp;
                                                                        <?php echo $inputs["global"]["border"]["width"]; ?>
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <label for="global[border][style]">
                                                                        <?php _e("Border style", 'ithoughts-tooltip-glossary' ); ?>:&nbsp;
                                                                        <?php echo $inputs["global"]["border"]["style"]; ?>
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <label for="global[border][color]">
                                                                        <?php _e("Border color", 'ithoughts-tooltip-glossary' ); ?>:&nbsp;
                                                                        <?php echo $inputs["global"]["border"]["color"]; ?>
                                                                    </label>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr class="new-section">
                                                    <th><?php _e('Font size', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td><?php echo $inputs["title"]["font-size"]; ?></td>
                                                    <td><?php echo $inputs["content"]["font-size"]; ?></td>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Line height', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td><?php echo $inputs["title"]["line-height"]; ?></td>
                                                    <td><?php echo $inputs["content"]["line-height"]; ?></td>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Text color', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td><?php echo $inputs["title"]["color"]; ?></td>
                                                    <td><?php echo $inputs["content"]["color"]; ?></td>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Links color', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td colspan="2"><?php echo $inputs["global"]["link"]["color"]; ?></td>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Text styles', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td>
                                                        <label><?php _e('Weight', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo $inputs["title"]["font-weight"]; ?></label><br/>
                                                        <label><?php _e('Style', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo $inputs["title"]["font-style"]; ?></label><br/>
                                                        <label><?php _e('Text decoration', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo $inputs["title"]["text-decoration"]; ?></label>
                                                    </td>
                                                    <td>
                                                        <label><?php _e('Weight', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo $inputs["content"]["font-weight"]; ?></label><br/>
                                                        <label><?php _e('Style', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo $inputs["content"]["font-style"]; ?></label><br/>
                                                        <label><?php _e('Text decoration', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo $inputs["content"]["text-decoration"]; ?></label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Links styles', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td colspan="2">
                                                        <label><?php _e('Weight', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo $inputs["title"]["font-weight"]; ?></label><br/>
                                                        <label><?php _e('Style', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo $inputs["title"]["font-style"]; ?></label><br/>
                                                        <label><?php _e('Text decoration', 'ithoughts-tooltip-glossary' ); ?>&nbsp;<?php echo $inputs["title"]["text-decoration"]; ?></label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Text align', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td><?php echo $inputs["title"]["text-align"]; ?></td>
                                                    <td><?php echo $inputs["content"]["text-align"]; ?></td>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Text font', 'ithoughts-tooltip-glossary' ); ?></th>
                                                    <td><?php echo $inputs["title"]["font-family"]; ?></td>
                                                    <td><?php echo $inputs["content"]["font-family"]; ?></td>
                                                </tr>
                                                <tr>
                                                    <th><?php _e('Other custom CSS', 'ithoughts-tooltip-glossary' ); ?> <span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-nosolo="true" data-tooltip-content="<?php echo __('Following CSS rules will be copied to output compiled CSS for that part of the tooltip. Use selectors to select childs.', 'ithoughts-tooltip-glossary' ); ?>"><a href="javascript:void(0)">(<?php _e('infos', 'ithoughts-tooltip-glossary' ); ?>)</a></span></th>
                                                    <td>
                                                        <textarea id="title[custom]" class="ace-editor" name="title[custom]"></textarea>
                                                    </td>
                                                    <td>
                                                        <textarea id="content[custom]" class="ace-editor" name="content[custom]"></textarea>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="3">
                                                        <input type="hidden" name="action" id="action"/>
                                                        <button name="actionB" value="ithoughts_tt_gl_theme_save" id="compilecss" class="alignleft button button-primary" style="display:inline-block;width:50%;text-align:center;"><?php _e("Save theme", 'ithoughts-tooltip-glossary' ); ?></button>
                                                        <button name="actionB" value="ithoughts_tt_gl_theme_preview" id="previewcss" class="alignleft button" style="display:inline-block;width:50%;text-align:center;"><?php _e("Preview", 'ithoughts-tooltip-glossary' ); ?></button>
                                                        <div id="update-response" class="clear confweb-update"></div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                </div>
                            </div>

                            <div class="postbox" id="ithoughts-tt-gl-lesseditor">
                                <h3 class="hndle"><span><?php _e('LESS editor', 'ithoughts-tooltip-glossary' ); ?></span></h3>
                                <div class="inside">
                                    <form id="LESS-form" action="<?php echo admin_url( 'admin-ajax.php' ); ?>" method="post" class="simpleajaxform" data-target="update-response">
                                        <input type="hidden" name="action" id="action"/>
                                        <button name="actionB" value="ithoughts_tt_gl_theme_save" id="compilecss" class="alignleft button button-primary" style="display:inline-block;width:50%;text-align:center;"><?php _e("Save theme", 'ithoughts-tooltip-glossary' ); ?></button>
                                        <button name="actionB" value="ithoughts_tt_gl_theme_preview" id="previewcss" class="alignleft button" style="display:inline-block;width:50%;text-align:center;"><?php _e("Preview", 'ithoughts-tooltip-glossary' ); ?></button>
                                        <div id="update-response" class="clear confweb-update"></div>
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
                                    <span class="ithoughts_tooltip_glossary-tooltip" data-tooltip-autoshow="true" data-tooltip-id="exampleStyle" data-tooltip-nosolo="true" data-tooltip-nohide="true" data-tooltip-content="<?php _e('This is an example tooltip, with content such as <a>a tag for link</a>, <em>em tag for emphasis</em>, <b>b tag for bold</b> and <i>i tag for italic</i>', 'ithoughts-tooltip-glossary' ); ?>"><a href="javascript:void(0)" title=""><?php _e('Example Tooltip', 'ithoughts-tooltip-glossary' ); ?></a></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>