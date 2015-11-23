
<table class="form-table stripped">
    <thead>
        <tr>
            <td></td>
            <th><?php _e('Global', 'ithoughts_tooltip_glossary'); ?></th>
            <th><?php _e('Title Bar', 'ithoughts_tooltip_glossary'); ?></th>
            <th><?php _e('Content', 'ithoughts_tooltip_glossary'); ?></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th><?php _e('Background', 'ithoughts_tooltip_glossary'); ?></th>
            <td>
                <label for="t_bt" class="block"><?php _e('Type', 'ithoughts_tooltip_glossary'); ?>&nbsp;
                    <select name="t_bt" value="plain" id="t_bt" class="modeswitcher">
                        <option value="plain"><?php _ex('Plain', 'A plain color', 'ithoughts_tooltip_glossary'); ?></option>
                        <option value="gradient"><?php _e('Gradient', 'ithoughts_tooltip_glossary'); ?></option>
                    </select>
                </label>
                <div data-switcher-mode="plain">
                    <input autocomplete="off" type="text" value="" class="color-field" data-alpha="true" name="t_bc"/>
                </div>

                <div id="ithoughts_tt_gllossary_options_customstype" class="postbox closed" data-switcher-mode="gradient">
                    <div class="handlediv" title="Cliquer pour inverser." onclick="window.refloat();"><br></div><h3 onclick="window.refloat();" class="hndle"><span><?php _e('Gradient editor', 'ithoughts_tooltip_glossary'); ?></span></h3>
                    <div class="inside">
                        <div class="gradient-picker"></div>
                    </div>
                </div>
            </td>
            <td>
                <label for="c_bt" class="block"><?php _e('Type', 'ithoughts_tooltip_glossary'); ?>&nbsp;
                    <select name="c_bt" value="plain" id="c_bt" class="modeswitcher">
                        <option value="plain"><?php _ex('Plain', 'A plain color', 'ithoughts_tooltip_glossary'); ?></option>
                        <option value="gradient"><?php _e('Gradient', 'ithoughts_tooltip_glossary'); ?></option>
                    </select>
                </label>
                <div data-switcher-mode="plain">
                    <input autocomplete="off" type="text" value="" class="color-field" data-alpha="true" name="c_bc"/>
                </div>

                <div id="ithoughts_tt_gllossary_options_customstype" class="postbox closed" data-switcher-mode="gradient">
                    <div class="handlediv" title="Cliquer pour inverser." onclick="window.refloat();"><br></div><h3 onclick="window.refloat();" class="hndle"><span><?php _e('Gradient editor', 'ithoughts_tooltip_glossary'); ?></span></h3>
                    <div class="inside">
                        <div class="gradient-picker"></div>
                    </div>
                </div>
            </td>
            <td>
                <label for="g_bt" class="block"><?php _e('Type', 'ithoughts_tooltip_glossary'); ?>&nbsp;
                    <select name="g_bt" value="plain" id="g_bt" class="modeswitcher">
                        <option value="plain"><?php _ex('Plain', 'A plain color', 'ithoughts_tooltip_glossary'); ?></option>
                        <option value="gradient"><?php _e('Gradient', 'ithoughts_tooltip_glossary'); ?></option>
                    </select>
                </label>
                <div data-switcher-mode="plain">
                    <input autocomplete="off" type="text" value="" class="color-field" data-alpha="true" name="g_bc"/>
                </div>

                <div id="ithoughts_tt_gllossary_options_customstype" class="postbox closed" data-switcher-mode="gradient">
                    <div class="handlediv" title="Cliquer pour inverser." onclick="window.refloat();"><br></div><h3 onclick="window.refloat();" class="hndle"><span><?php _e('Gradient editor', 'ithoughts_tooltip_glossary'); ?></span></h3>
                    <div class="inside">
                        <div class="gradient-picker"></div>
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <th><?php _e('Padding', 'ithoughts_tooltip_glossary'); ?></th>
            <?php
foreach($prefixs as $prefix){
            ?>
            <td><input autocomplete="off" type="text" value="" name="<?php echo $prefix; ?>_pd" pattern="^((\d*(\.\d+)?(r?em|px|%|ex|pt|(c|m)m|in|pc|v(h|w|min|max)) ?){1,4}|initial|inherit|)$" data-pattern-infos="<?php _e('Valid font-size value: inherit, initial, or 1 to 4 values in rem, em, px, %, ex, pt, cm, mm, in, pc, vh, vw, vmin, or vmax', 'ithoughts_tooltip_glossary'); ?>"/></td>
            <?php
}
            ?>
        </tr>
        <tr>
            <th><?php _e('Shadow', 'ithoughts_tooltip_glossary'); ?></th>
            <td colspan="3">
                <table style="margin:0px auto;">
                    <tr>
                        <td style="padding:0;">
                            <input autocomplete="off" type="number" name="sh_w" />
                        </td>
                        <td style="padding:0;">
                        </td>
                        <td style="padding:0;">
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
                            <input autocomplete="off" type="number" name="sh_h" />
                        </td>
                        <td style="padding:0;">
                            <label for="sh_s">
                                <?php _e('Shadow spread', 'ithoughts_tooltip_glossary'); ?>
                                <input autocomplete="off" type="number" id="sh_s" name="sh_s" />
                            </label><br/>
                            <label for="sh_c">
                                <?php _e('Shadow color', 'ithoughts_tooltip_glossary'); ?>
                                <input autocomplete="off" type="text" id="sh_c" value="" class="color-field" data-alpha="true" name="sh_c"/>
                            </label>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <th><?php _e('Outline border', 'ithoughts_tooltip_glossary'); ?></th>
            <td colspan="3"></td>
        </tr>
        <tr class="new-section">
            <th><?php _e('Text size', 'ithoughts_tooltip_glossary'); ?></th>
            <?php
foreach($prefixs as $prefix){
            ?>
            <td><input autocomplete="off" type="text" value="" name="<?php echo $prefix; ?>_ts" pattern="^(medium|xx-small|x-small|small|large|x-large|xx-large|smaller|larger|\d*(\.\d+)?(r?em|px|%|ex|pt|(c|m)m|in|pc|v(h|w|min|max))|initial|inherit|)$" data-pattern-infos="<?php _e('Valid font-size value: xx-small, x-small, smaller, small, medium, large, larger, x-large, xx-large, or a value in rem, em, px, %, ex, pt, cm, mm, in, pc, vh, vw, vmin, or vmax', 'ithoughts_tooltip_glossary'); ?>"/></td>
            <?php
}
            ?>
        </tr>
        <tr>
            <th><?php _e('Text color', 'ithoughts_tooltip_glossary'); ?></th>
            <?php
foreach($prefixs as $prefix){
            ?>
            <td><input autocomplete="off" type="text" value="" class="color-field" data-alpha="true" name="<?php echo $prefix; ?>_tc"/></td>
            <?php
}
            ?>
        </tr>
        <tr>
            <th><?php _e('Text align', 'ithoughts_tooltip_glossary'); ?></th>
            <?php
foreach($prefixs as $prefix){
            ?>
            <td>
                <select name="<?php echo $prefix; ?>_ts">
                    <option value="left"><?php _e('Left', 'ithoughts_tooltip_glossary'); ?></option>
                    <option value="right"><?php _e('Right', 'ithoughts_tooltip_glossary'); ?></option>
                    <option value="center"><?php _e('Center', 'ithoughts_tooltip_glossary'); ?></option>
                    <option value="justify"><?php _e('Justify', 'ithoughts_tooltip_glossary'); ?></option>
                </select>
            </td>
            <?php
}
            ?>
        </tr>
        <tr>
            <th><?php _e('Text font', 'ithoughts_tooltip_glossary'); ?></th>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>