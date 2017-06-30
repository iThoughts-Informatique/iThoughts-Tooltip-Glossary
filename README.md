# iThoughts Tooltip Glossary #
**Contributors:** [Gerkin](https://profiles.wordpress.org/Gerkin)  
**Donate link:** https://www.gerkindevelopment.net/en/support-ithoughts-plugins/  
**Author URI:** https://www.gerkindevelopment.net/  
**Plugin URI:** https://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/  
**Tags:** tooltip, dictionary, glossary, appendix, technical terms, popup, tooltips, infobulle, definition, definitions, définition, définitions, dictionnaire, dictionnaires, dictionnaries, precision, information, informations, widget, widgets, shortocde, shortcodes, images, image, comment, comments, index, dictionnary, ajax, custom post type, post type, documentation, database, help, jquery, quote  
**Requires at least:** 3.3  
**Tested up to:** 4.8  
**Stable tag:** 3.0.1  
**License:** GPLv3  

Create beautiful tooltips for descriptions or glossary terms, easily

## Description ##

Build a glossary on your site that link terms in your posts to it via tooltips. You can also create unlinked tooltips to bring some precision to a term or expression in a single post.

This plugin is optimized for responsive web design, SEO, usability, and more.

### Features ###

* Manage your *glossaries* on your own site
* Add tooltips with fully customizable content (*text* or *medias*)
* Several kind of lists to display your glossary terms
* Group your terms by categories
* Fully responsive tooltips, with *6 animations* and *10 themes*.
* Theme editor & easy animation customization. Keep control of your site appearance.
* Support of WPML for multilingual terms

iThoughts Tooltip Glossary works well with [iThoughts Lightbox](http://www.gerkindevelopment.net/en/portfolio/ithoughts-lightbox/), which allow you to create responsive lightboxes that includes your mediatip images.

For further information, please visit the [iThoughts Tooltip Glossary dedicated landing page](http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/).

## Installation ##

Either install through admin panel (this is the eaiest way), or:

1. Upload `ithoughts-tooltip-glossary.zip` to the `/wp-content/plugins/` directory
2. Unzip the archive
3. Activate the plugin through the 'Plugins' menu in WordPress

## Frequently Asked Questions ##

> Does this plugin create any new tables?

No. It uses custom post types and taxonomies.

> None of the details pages are working!

Please resave your rewrite rules: Settings > Permalinks > Save Changes (just click the button)

> I got an error when loading my glossary tips

It may be a permalink problem. Go to *Settings* > *Permalinks* and click *Save Changes*

> It doesn't do anything?

Check if jQuery is loaded.
For glossary terms only, you have to add the terms (Tooltip Glossary > Add New Term) and then use the appropriate TinyMCE button to link the text with that glossary term

## Further Information ##

Browse the full developer documentation on [GitHub Pages](ithoughts-informatique.github.io/iThoughts-Tooltip-Glossary/)

If you want to contribute, feel free to check the [GitHub repository](ithoughts-informatique.github.io/iThoughts-Tooltip-Glossary/)

User manual available on [gerkindevelopment.net](http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/)

For bug repports or unexpected behaviors, please see the dedicated [WordPress support forum](https://wordpress.org/support/plugin/ithoughts-tooltip-glossary)

## Screenshots ##

1. Example frontend hover glossary term/tooltip
2. Example TinyMCE glossary term form
3. Example TinyMCE tooltip form
4. jQuery based Glossary term A to Z and term list
5. Glossary index shortcodes

## Changelog ##

### 3.0.2 ###
* FIX Singleton structure

### 3.0.1 ###
* FIX Fatal error in Resource management (see [the forum thread](https://wordpress.org/support/topic/php-fatal-error-115/))
* FIX Theme Editor

### 3.0.0 ###
* NEW Exclude glossary terms from search
* NEW Automated tests, linting, docs, etc etc
* UPD Changed shortcodes for prefix *itg* instead of *ithoughts_tooltip_glossary*
* UPD Improved updater performaces
* UPD Styles & scripts refactoring
* UPD Resource management process reviewed

### 2.7.0 ###
* NEW Support of QuickTags to use plugin shortcodes even in text mode (see [ist4000 request feature](https://wordpress.org/support/topic/buttons-in-the-text-mode/))
* UPD List form now more flexible
* UPD Lists queries more performant
* FIX Form styles improved
* FIX Advanced Tooltip attributes now functionnal
* FIX Lists not doing group/alpha filters well in every situations

### 2.6.4 ###
* FIX Obsolete variable in A-to-Z js script (see [support forum](https://wordpress.org/support/topic/glossary_atoz-not-working?replies=2))

### 2.6.3 ###
* FIX Moved JS TinyMCE form data object.

### 2.6.2 ###
* UPD New version of iThoughts Wordpress Plugin Toolbox
* FIX Enforcing namespaces in JS & PHP.

### 2.6.1 ###
* FIX Removed old JS dependencies no more used
* FIX JS function "removeAccents" injected in another namespace

### 2.6.0 ###
* NEW Attributes editor for tooltip-specific configuration
* NEW Using JS namespacing to avoid conflicts
* NEW Allow setting explicit HREF on glossary term with warning message
* NEW Added in/out animations for tip + hooks for adding custom anims
* NEW Added support of comments on glossary terms if enabled in config
* UPD New version of iThoughts Plugin Toolbox with no-conflicting naming
* UPD Rename JS files for uniform naming
* UPD Increasing the number of hooks (ithoughts_tt_gl-term-content, ithoughts_tt_gl-term-excerpt)
* FIX Wrong DB query containing static string, which can produce errors

### 2.5.0 ###
* NEW Complete simplified theme editor
* UPD Fixed HTML escaped tooltip content (see [this ticket](https://wordpress.org/support/topic/tooltips-have-changed-and-dont-work))

### 2.4.2 ###
* UPD Security fixes
* UPD Plugin Core
* UPD Improved memory & CPU usage for lists, reduce generation time

### 2.4.1 ###
* FIX Glossary tooltip linked to the wrong language with WPML

### 2.4.0 ###
* NEW Full support of WPML
* UPD Style editor now saves to a file and add theme in theme dropdown
* UPD Less.css style editor
* FIX Click activation mode prevented totally to access a link

### 2.3.2 ###
* FIX Delegate register of ithoughts_aliases to parent Backbone

### 2.3.1 ###
* UPD Use of namespacing
* UPD Started documentation compliant format
* FIX Change JS aliases that were modified by iThoughts comon code

### 2.3.0 ###
* NEW Mediatips now support captions
* NEW Tips now support links href if the type allow it
* NEW Now uses minified scripts if not in WP_DEBUG mode
* UPD Updater post types
* FIX Various checks and fallbacks added

### 2.2.3 ###
* UPD new updater step to replace shortcode term's slug with term id

### 2.2.2 ###
* UPD enhance behaviour of tooltips containing quotes
* FIX Video related styles
* FIX href link attribute now overridable

### 2.2.1 ###
* UPD Better general display of videos
* FIX qTip Viewport plugin re-added
* FIX Per-tip overridable termcontent attribute

### 2.2.0 ###
* NEW Basic style editor
* UPD Utility methods (form generation, parsing shortcode attrs) mutualized with all future plugins
* UPD qTip2 v2.1.1 => v2.2.1
* FIX Webvideo unpin did not reactivate tooltip normal behaviour
* FIX overridable qtip style

### 2.1.7 ###
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

### 2.1.6 ###
* FIX PHP potential issues

### 2.1.5 ###
* FIX z-index problem with SiteOrigin page builder
* FIX List display for terms

### 2.1.4 ###
* NEW added ability to override some plugin settings (interface in dev)
* NEW Glossary spans now generated by filters
* FIX Version updater
* FIX Compat to php >= 5.3.1

### 2.1.2 ###
* FIX PHP Syntax incompatibility

### 2.1.1 ###
* UPD Added filters for glossary term excerpts
* UPD Mutualize options to improve performances
* UPD Remove useless options
* FIX Raise warn level for less errors in prod environment
* FIX Sub-TinyMCE basepaths

### 2.0.5 ###
* UPD Refactor whole plugin for better maintenability
* FIX Updater unexpected behavior
* FIX Tooltip trigger mode hover

### 2.0.4 ###
* NEW Static terms to display glossary terms without Ajax
* UPD Web video now allow mp4, YouTube and Dailymotion videos
* FIX incompatibility with PHP5.3
* FIX Force reload for new scripts

### 2.0.2 ###
* FIX Update routine

### 2.0 ###
* NEW Now support images from an URL
* NEW Support of YouTube videos
* NEW Ajax Updater
* UPD Delay hide of mediatips
* UPD Detached Tooltip form
* UPD Tooltip with custom content now use TinyMCE

### 1.1.6 ###
* FIX TinyMCE change tab detection => mode switching

### 1.1.5 ###
* UPD Change default tooltip position ([see this post](https://wordpress.org/support/topic/media-tip?replies=6#post-7650176))
* UPD Sort terms alphabetically into TinyMCE form ([see this thread](https://wordpress.org/support/topic/insert-tooltip-glossary-term-sort-alphabetically))
* FIX Added base container on top of Divi header and wpadminbar

### 1.1.4 ###
* UPD Transition to prefixed shortcodes
* UPD Changed some plugin prefixes
* FIX Renamed shortcode Tooltip for Divi compatibility [(see this issue)](https://wordpress.org/support/topic/error-displaying-tooltip?replies=10#post-7644816)
* FIX Change hook for loading TinyMCE plugin [(see this issue)](https://wordpress.org/support/topic/compatibility-with-siteorigin-page-builder?replies=8#post-7645307)

### 1.1.3 ###
* NEW Added style previews for tooltips
* UPD Added security checks on url-related options
* UPD Admin layout

### 1.1 ###
* NEW added mediatip
* FIX tooltips flickered on small screen

### 1.0.2 ###
* FIX Random Term Widget

### 1.0.1 ###
* UPD improved French translation
* UPD correction to remove an error message

### 1.0 ###
* NEW Added select for glossary terms
* UPD Inline tooltips now integrated to TinyMCE Glossary button
* UPD TinyMCE now recognize tooltips as like glossary terms
* UPD Removed "title" attribute on links with JS to allow search engine comprehension & disable double tooltips on some browsers (eg. Firefox)

### 0.2.3 ###
* NEW Added inline tooltips

### 0.2.2 ###
* NEW Add plugin basic icon
* UPD fixed dead links

### 0.2.1 ###
* UPD clean dirty release

### 0.2 ###
* NEW Added fr_FR translation
* UPD Clean old unused translations
* UPD Admin menu

### 0.1 ###
* NEW Added "Responsive" 'qtiptrigger', which is "hover"/"focus" on computers, and "click" on touch devices.
* NEW Added ability to set the main glossary page url, which is also the term prefix (http://www.yourblog.com/*whatever*/...)
* UPD Group terms in ATOZ even with accents. "ù" will be in "U" section.
* UPD Clean Theme editor improved with more flexibility. Thrown away useless theme form

### 0.0 ###
* Please see previous changes from [WP Glossary](https://wordpress.org/plugins/wp-glossary/changelog/)


## Upgrade Notice ##

### 3.0.0 ###
Now, you can exclude terms from search (see [ambertmg feature request](https://wordpress.org/support/topic/hide-glossary-terms-from-search/). This update is a preparation for incoming features

### 2.7.0 ###
Overall improvements and add support of QuickTags for text mode (see [ist4000 feature request](https://wordpress.org/support/topic/buttons-in-the-text-mode/))
### 2.6.4 ###
Minor fixes

### 2.6.1 ###
Fix missing function "removeAccents"

### 2.6.0 ###
Added attribute editor & tooltips animations

### 2.5.0 ###
Theme editor improved with more flexibility. Thrown away useless theme form

### 2.4.2 ###
This update provides heavy optimizations for lists. It prepares the future incoming of version 3.0.0, which will be much more structured to be used as a real dictionnary.

### 2.4.1 ###
Now fully compatible with WPML!

### 2.4.0 ###
WPML is now supported! Please post possible bugs or unexpected behavior on the support forum.

### 2.3.1 ###
WARNING! THIS IS AN EXPERIMENTAL UPDATE!
If you encounter an error with this version, please inform me as soon as possib$

### 2.3.0 ###
Captions and links introduced! Gain of performance expected thanks to minified scripts and styles

### 2.2.0 ###
Alpha release of qTip2 style editor, and update of qTip2.

### 2.1.7 ###
Various fixes to improve uniformity in all situations (device of user, or server environment).
Attributes are now handled fine (see [plugin page](www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/).
Lists were highly improved.

### 2.1.6 ###
Uniformization of behaviors depending on PHP versions

### 2.1.4 ###
Compatibility with older PHP versions, overridable options, refactoring for mutualization

### 2.1.1 ###
Various fixes and performance improvements

### 2.0.5 ###
Transitionnal fix, should be stable

### 2.0.4 ###
Important fix for PHP5.3, video improvements, and static terms to allow use of the glossary system without Ajax (thanks to rikengct for this suggestion)

### 2.0 ###
This update is the first of a serie to allow you to fully customize EACH of your tooltips. Thanks to Rikengct for his suggestions.

### 1.1.5 ###
Corrections for better readability of tooltips and pages

### 1.1.4 ###
Compatibility fixes

### 1.1.3 ###
See in real-time what your tooltips will look like!

### 1.1 ###
A new type of tooltip is available! The Mediatip is perfect for you if you want to show an image describing what you want. Thanks to Doremdou for the suggestion of this feature!

### 1.0.2 ###
Fixed an issue with Random Term Widget.

### 1.0.1 ###
Removed an error message that appeared sometimes in the footer

### 1.0 ###
A big improvement to glossary terms tooltips have been made, to allow you to directly select the term you wish to link. Tooltips are now editable with the same button as glossary terms.

### 0.2.3 ###
Inline tooltips are now available through shortcode [tooltip content="foo"]bar[/tooltip]. They allow you to define tooltips not linked to a specific post.

### 0.2.2 ###
Dead links killed tooltips.

### 0.2.1 ###
New version to force update from dirty release

### 0.2 ###
The menu of the plugin is now complete and clean, not dirty as it was until now. French users will be pleased to see the plugin in their language.

## Thanks to & Resources ##

TCBarrett for his [WP Glossary plugin](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/)
[Laurent Pelleray](http://lpelleray.wix.com/laurent-pelleray#!infographie/c1vmr) for graphical elements
Tammi Coles for corrections to readme description
Rikengct for a LOT of usefull suggestions
TinyMCE tooltip icon  by Darren Northcott from the [Noun Project](https://thenounproject.com/term/tooltip/82869/)
Wordpress PHP CodeSniffer ruleset https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards

## Support this plugin ##

Maintaining this plugin takes a lot of time, time that I have to share with my work and my studies. If you appreciate my work, feel free to comment, rate, or even [donate to the plugin](https://www.gerkindevelopment.net/en/support-ithoughts-plugins/). I need your help to continue maintaining the plugin, and bringing more features.
