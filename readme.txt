=== iThoughts Tooltip Glossary ===
Contributors: Gerkin
Plugin URL: http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Original Plugin URL: http://www.tcbarrett.com/wordpress-plugins/wp-glossary/
Tags: tooltip, dictionary, glossary, appendix, technical terms, popup, tooltips, infobulle, definition, definitions, définition, définitions, dictionnaire, dictionnaires, dictionnaries, precision, information, informations, widget, widgets, shortocde, shortcodes, images, image, comment, comments
Requires at least: 3.3
Tested up to: 4.4.1
Stable tag: 2.3.1
License: GPLv2 or later

Create beautiful tooltips for descriptions or glossary terms easily

== Description ==

Build a glossary on your site that link terms in your posts to it via tooltips. You can also create unlinked tooltips to bring some precision to a term or expression in a single post.

This plugin is a fork of the inactive plugin "WP Glossary v3.1.1.2" by tcbarrett. The whole base plugin is his; I just made some improvements for responsive web design, SEO, usability, and more. 

Reasons for using iThoughts Tooltip Glossary plugin:

* You use the old and unsupported WP Glossary plugin from TCBarrett
* External glossary sites don't have all the words and terms you need.
* You want to keep your visitors on your site, not send them to an external glossary site.
* You don't want the adverts that external site popups come with.
* You need greater precision for some of your readers.

iThoughts Tooltip Glossary works well with [iThoughts Lightbox](http://www.gerkindevelopment.net/en/portfolio/ithoughts-lightbox/), which allow you to create responsive lightboxes that includes your mediatip images.

For further information, please visit the [iThoughts Tooltip Glossary dedicated landing page](http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/).

** Please, don't annoy TCBarrett with questions about iThoughts Tooltip Glossary. I mention him only to give him credits and give you some infos, but all of the new code don't concern him. You can read, but you should not post. **

== Installation ==

Either install through admin panel (this is the eaiest way), or:

1. Upload `ithoughts-tooltip-glossary.zip` to the `/wp-content/plugins/` directory
2. Unzip the archive
3. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= Does this plugin create any new tables? =

No. It uses custom post types and taxonomies.

= Can I link it to an external glossary =

Yes. It is a feature from WP Glossary since version 1.2, so it is still present.

= None of the details pages are working! =

Please resave your rewrite rules: Settings > Permalinks > Save Changes (just click the button)

= It doesn't do anything? =

Check if jQuery is loaded.
For glossary terms only, you have to add the terms (Tooltip Glossary > Add New Term) and then use the appropriate TinyMCE button to link the text with that glossary term

= Further Information =

** Please, don't annoy TCBarrett with questions about that plugin. The original plugin links given are for reading ONLY **
[For further details visit my dedicated plugin landing page](http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/)
[Or see the original plugin landing page](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/)
For bug repports or unexpected behaviors, please see the dedicated [WordPress support forum](https://wordpress.org/support/plugin/ithoughts-tooltip-glossary)

== Screenshots ==

1. Example frontend hover glossary term/tooltip
2. Example TinyMCE glossary term form
3. Example TinyMCE tooltip form
4. jQuery based Glossary term A to Z and term list
5. Glossary index shortcodes


== Changelog ==

= 2.3.1 =
* UPD Use of namespacing
* UPD Started documentation compliant format
* FIX Change JS aliases that were modified by iThoughts comon code

= 2.3.0 =
* NEW Mediatips now support captions
* NEW Tips now support links href if the type allow it
* NEW Now uses minified scripts if not in WP_DEBUG mode
* UPD Updater post types
* FIX Various checks and fallbacks added

= 2.2.3 =
* UPD new updater step to replace shortcode term's slug with term id

= 2.2.2 =
* FIX Video related styles
* FIX href link attribute now overridable
* UPD enhance behaviour of tooltips containing quotes

= 2.2.1 =
* FIX qTip Viewport plugin re-added
* FIX Per-tip overridable termcontent attribute
* UPD Better general display of videos

= 2.2.0 =
* UPD Utility methods (form generation, parsing shortcode attrs) mutualized with all future plugins
* FIX Webvideo unpin did not reactivate tooltip normal behaviour
* UPD qTip2 v2.1.1 => v2.2.1
* NEW Basic style editor
* FIX overridable qtip style

= 2.1.7 =
* NEW Add attributes filtering & appending to plugin generated HTML
* NEW Display compiled shortcodes into tooltip
* NEW Filtering JS Mediatips to prepare compatibility with iThoughts Lightbox
* UPD Remove versionning on resources when useless to improve browser caching capability 
* UPD Remove obsolete & uncompatible trigger option "mouseenter"
* UPD Tooltip links now overlined & underlined by default, to be easily recognized
* UPD List display split in columns more intuitive
* UPD General code cleaning
* UPD Corrections in reference link values
* UPD Reduce globals usage
* FIX Remove trailing `\` before `'` in tooltip content
* FIX Modification in selection of alphas in list & A-to-Z display modes
* FIX Change handling of static terms for uniformized PHP behavior
* FIX Various z-index issues
* FIX Several A-to-Z now can work together without interacting with others
* FIX iOS specific responsiveness compatibility

= 2.1.6 =
* FIX PHP potential issues

= 2.1.5 =
* FIX z-index problem with SiteOrigin page builder
* FIX List display for terms

= 2.1.4 =
* NEW added ability to override some plugin settings (interface in dev)
* FIX Version updater
* FIX Compat to php >= 5.3.1
* NEW Glossary spans now generated by filters

= 2.1.2 =
* FIX PHP Syntax incompatibility

= 2.1.1 =
* FIX Raise warn level for less errors in prod environment
* FIX Sub-TinyMCE basepaths
* UPD Added filters for glossary term excerpts
* UPD Mutualize options to improve performances
* UPD Remove useless options

= 2.0.5 =
* FIX Updater unexpected behavior
* FIX Tooltip trigger mode hover
* UPD Refactor whole plugin for better maintenability

= 2.0.4 =
* FIX incompatibility with PHP5.3
* UPD Web video now allow mp4, YouTube and Dailymotion videos
* FIX Force reload for new scripts
* NEW Static terms to display glossary terms without Ajax

= 2.0.2 =
* FIX Update routine

= 2.0 =
* NEW Now support images from an URL
* NEW Support of YouTube videos
* UPD Delay hide of mediatips
* UPD Detached Tooltip form
* UPD Tooltip with custom content now use TinyMCE
* NEW Ajax Updater

= 1.1.6 =
* FIX TinyMCE change tab detection => mode switching

= 1.1.5 =
* UPD Change default tooltip position ([see this post](https://wordpress.org/support/topic/media-tip?replies=6#post-7650176))
* FIX Added base container on top of Divi header and wpadminbar
* UPD Sort terms alphabetically into TinyMCE form ([see this thread](https://wordpress.org/support/topic/insert-tooltip-glossary-term-sort-alphabetically))

= 1.1.4 =
* FIX Renamed shortcode Tooltip for Divi compatibility [(see this issue)](https://wordpress.org/support/topic/error-displaying-tooltip?replies=10#post-7644816)
* UPD Transition to prefixed shortcodes
* UPD Changed some plugin prefixes
* FIX Change hook for loading TinyMCE plugin [(see this issue)](https://wordpress.org/support/topic/compatibility-with-siteorigin-page-builder?replies=8#post-7645307)

= 1.1.3 =
* UPD Added security checks on url-related options
* NEW Added style previews for tooltips
* UPD Admin layout

= 1.1 =
* NEW added mediatip
* FIX tooltips flickered on small screen

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

= 2.3.1 =
WARNING! THIS IS AN EXPERIMENTAL UPDATE! 
If you encounter an error with this version, please inform me as soon as possib$

= 2.3.0 =
Captions and links introduced! Gain of performance expected thanks to minified scripts and styles

= 2.2.0 =
Alpha release of qTip2 style editor, and update of qTip2.

= 2.1.7 =
Various fixes to improve uniformity in all situations (device of user, or server environment).
Attributes are now handled fine (see [plugin page](www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/).
Lists were highly improved.

= 2.1.6 =
Uniformization of behaviors depending on PHP versions

= 2.1.4 =
Compatibility with older PHP versions, overridable options, refactoring for mutualization

= 2.1.1 =
Various fixes and performance improvements

= 2.0.5 =
Transitionnal fix, should be stable

= 2.0.4 =
Important fix for PHP5.3, video improvements, and static terms to allow use of the glossary system without Ajax (thanks to rikengct for this suggestion)

= 2.0 =
This update is the first of a serie to allow you to fully customize EACH of your tooltips. Thanks to Rikengct for his suggestions.

= 1.1.5 =
Corrections for better readability of tooltips and pages

= 1.1.4 =
Compatibility fixes

= 1.1.3 =
See in real-time what your tooltips will look like!

= 1.1 =
A new type of tooltip is available! The Mediatip is perfect for you if you want to show an image describing what you want. Thanks to Doremdou for the suggestion of this feature!

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
Tammi Coles for corrections to readme description
Rikengct for a LOT of usefull suggestions

https://github.com/23r9i0/wp-color-picker-alpha
http://codologic.com/page/gradx-jquery-javascript-gradient-selector-library