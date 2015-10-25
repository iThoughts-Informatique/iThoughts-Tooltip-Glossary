=== iThoughts Tooltip Glossary ===
Contributors: Gerkin, tcbarrett
Plugin URL: http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/
Original Plugin URL: http://www.tcbarrett.com/wordpress-plugins/wp-glossary/
Tags: tooltip, dictionary, glossary, appendix, technical terms, popup, tooltips, infobulle, definition, definitions, définition, définitions, dictionnaire, dictionnaires, dictionnaries, precision, information, informations, 
Requires at least: 3.0
Tested up to: 4.3.1
Stable tag: 0.2.3
License: GPLv2 or later

Create beautiful tooltips for descriptions or glossary terms easily

== Description ==

This plugin is a fork from the inactive plugin "WP Glossary v3.1.1.2" by tcbarrett. The whole base plugin is from him, I just did some improvements. For any bugs, please post on my blog's [iThoughts Tooltip Glossary page](http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/), as I'll be able to bring corrections and improvements.

Build a glossary on your site, and link terms in your posts to it with tooltips.

Reasons for using ithoughts-tooltip-glossary plugin:

* External glossary sites don't have all the words and terms you need.
* You want to keep your visitors on your site (not send them to an external glossary site).
* You don't want the adverts that the external site popups come with.

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

Yes. As of version 1.2 you can add a reference title and link.

= None of the details pages are working! =

Please resave your rewrite rules: Settings > Permalinks > Save Changes (just click the button)

= It doesn't do anything? =

You have to add the terms (Glossary Terms > Add New Term) and then use the appropriate TinyMCE button.

= Further Information =

[For further details visit my dedicated plugin landing page](http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/)
[Or see the original plugin landing page](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/)


== Screenshots ==

1. Example frontend hover tooltip
2. Adding glossary term to page content using shortcode
3. Editing a glossary term itself
4. jQuery based Glossary term A to Z
5. Default Glossary term archive
6. Glossary term list front end (full)
7. Backend adding term list with shortcode


== Changelog ==

= 0.2.3 =
_

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

= 0.2.3 =
_

= 0.2.3 =
Inline tooltips are now available through shortcode [tooltip content="foo"]bar[/tooltip]. They allow you to define tooltips not linked to a specific post.

= 0.2.2 =
Dead links killed tooltips.

= 0.2.1 =
New version to force update from dirty release

= 0.2 =
The menu of the plugin is now complete and clean, not dirty as it was until now. French users will be pleased to see the plugin in their language.

== Example Syntax ==

The WordPress shortcode syntax is really simple!

= Display and link to glossary with slug 'seo' =
[glossary slug='seo' /]

= Auto search word for matching glossary term (e.g. 'seo') =
[glossary]SEO[/glossary]

= Apply glossary term with slug 'seo' to post content 'search engine optimisation' =
[glossary slug='seo']search engine optimisation[/glossary]

= Display a list of all your glossary terms (alphabetical) =
[glossary_term_list /]

= Display list of glossary terms beginning with a, b or c =
[glossary_term_list alpha='a,b,c' /]

= Display a jQuery-powered A to Z list of your glossary terms =
[glossary_atoz /]

= Further Examples =
See the [dedicated website section](http://www.gerkindevelopment.net/en/portfolio/ithoughts-tooltip-glossary/)
