=== iThoughts Tooltip Glossary ===
Contributors: Gerkin, tcbarrett
Plugin URL: http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Original Plugin URL: http://www.tcbarrett.com/wordpress-plugins/wp-glossary/
Tags: tooltip, dictionary, glossary, appendix, technical terms, popup, tooltips, infobulle, definition, definitions, définition, définitions, dictionnaire, dictionnaires, dictionnaries, precision, information, informations, 
Requires at least: 3.0
Tested up to: 4.3.1
Stable tag: 1.0.2.1
License: GPLv2 or later

Create beautiful tooltips for descriptions or glossary terms easily

== Description ==

This plugin is a fork from the inactive plugin "WP Glossary v3.1.1.2" by tcbarrett. The whole base plugin is from him, I just did some improvements. For further informations, please visit my blog's [iThoughts Tooltip Glossary page](http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/).

Build a glossary on your site, and link terms in your posts to it with tooltips. You can also create unlinked tooltips, to bring some precision to a term or expression in a single post.

Reasons for using ithoughts-tooltip-glossary plugin:

* External glossary sites don't have all the words and terms you need.
* You want to keep your visitors on your site (not send them to an external glossary site).
* You don't want the adverts that the external site popups come with.
* You have to be optionnaly more precise for some of your readers

[For further details visit my dedicated plugin landing page](http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/)

== Installation ==

Either install through admin panel (this is the eaiest way), or:

1. Upload `ithoughts-tooltip-glossary.zip` to the `/wp-content/plugins/` directory
2. Unzip the archive
3. Activate the plugin through the 'Plugins' menu in WordPress

If you create your own single template for glossary terms, don't forget to remove the reference filter.

== Frequently Asked Questions ==

= Does this plugin create any new tables? =

No. It uses custom post types and taxonomies.

= Can I link it to an external glossary =

Yes. It is a feature from WP Glossary since version 1.2, so it is still present.

= None of the details pages are working! =

Please resave your rewrite rules: Settings > Permalinks > Save Changes (just click the button)

= It doesn't do anything? =

You have to add the terms (Tooltip Glossary > Add New Term) and then use the appropriate TinyMCE button to link the post with that glossary term

= Further Information =

[For further details visit my dedicated plugin landing page](http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/)
[Or see the original plugin landing page](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/)


== Screenshots ==

1. Example frontend hover glossary term/tooltip
2. Example TinyMCE glossary term form
3. Example TinyMCE tooltip form
4. jQuery based Glossary term A to Z and term list
5. Glossary index shortcodes


== Changelog ==

= 1.0.2.1 =
* FIX Kick out parasyte option

= 1.0.2 =
Re

= 1.0.2 =
* FIX Random Term Widget

= 1.0.1 =
* UPD improved French translation
* UPD correction to remove an error message

= 1.0 =
* NEW Added select for glossary terms
* UPD Inline tooltips now integrated to TinyMCE Glossary button
* UPD TinyMCE now recognize tooltips as like glossary terms
* UPD Removed "title" attribute on links with JS to allow search engine comprehension & disable double tooltips on some browsers (eg. Firefox)

= 0.2.3 =
* NEW Added inline tooltips

= 0.2.2 =
* NEW Add plugin basic icon
* UPD fixed dead links

= 0.2.1 =
* UPD clean dirty release

= 0.2 =
* NEW Added fr_FR translation
* UPD Clean old unused translations
* UPD Admin menu

= 0.1 =
* NEW Added "Responsive" 'qtiptrigger', which is "hover"/"focus" on computers, and "click" on touch devices.
* NEW Added ability to set the main glossary page url, which is also the term prefix (http://www.yourblog.com/*whatever*/...)
* UPD Group terms in ATOZ even with accents. "ù" will be in "U" section.
* UPD Clean some useless files

= 0.0 =
* Please see previous changes from the old plugin [here](https://wordpress.org/plugins/wp-glossary/changelog/)


== Upgrade Notice ==

= 1.0.2.1 =
Fixed parasite option

= 1.0.2 =
Re

= 1.0.2 =
Fixed an issue with Random Term Widget.

= 1.0.1 =
Removed an error message that appeared sometimes in the footer

= 1.0 =
A big improvement to glossary terms tooltips have been made, to allow you to directly select the term you wish to link. Tooltips are now editable with the same button as glossary terms.

= 0.2.3 =
Inline tooltips are now available through shortcode [tooltip content="foo"]bar[/tooltip]. They allow you to define tooltips not linked to a specific post.

= 0.2.2 =
Dead links killed tooltips.

= 0.2.1 =
New version to force update from dirty release

= 0.2 =
The menu of the plugin is now complete and clean, not dirty as it was until now. French users will be pleased to see the plugin in their language.

== Thanks to & Resources ==

Icon from [allur.co](http://allur.co/minimalist-edit-icon-tooltip-psd-ai/)
TCBarrett for his [WP Glossary plugin](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/)
[Laurent Pelleray](http://lpelleray.wix.com/laurent-pelleray#!infographie/c1vmr) for graphical elements