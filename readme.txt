=== WP Glossary ===
Contributors: tcbarrett
Donate link: http://www.tcbarrett.com/donate/
Plugin URL: http://www.tcbarrett.com/wordpress-plugins/wp-glossary/
Tags: glossary, wp-glossary, dictionary, gloss, appendix, technical terms
Requires at least: 3.0
Tested up to: 3.6
Stable tag: 3.1
License: GPLv2 or later

Create your own glossary of hot-linked terms, inside your own site!

== Description ==

Build a glossary on your site, and link terms in your posts to it.

Reasons for using wp-glossary plugin:

* External glossary sites don't have all the words and terms you need.
* You want to keep your visitors on your site (not send them to an external glossary site).
* You don't want the adverts that the external site popups come with.

Keep your visitors on your site, keep their experience consistent and pleasant using *your* theme.

Once activated you add glossary terms (custom post type) and link to those terms from inside your own content using the powerful WordPress shortcode functionality.

[For further details visit my dedicated plugin landing page](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/)

== Installation ==

Either install through admin panel (this is the eaiest way), or:

1. Upload `wp-glossary.zip` to the `/wp-content/plugins/` directory
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

You have to add the terms (Glossary Terms > Add New Term) and then use [shortcodes](http://codex.wordpress.org/Shortcode).
I've listed a bunch on my website: [WP Glossary - Basic Shortcde Usage](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/wp-glossary-basic-usage-of-the-glossary-shortcode/)

= Further Information =

[For further details visit my dedicated plugin landing page](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/)


== Screenshots ==

1. Example frontend hover tooltip
2. Adding glossary term to page content using shortcode
3. Editing a glossary term itself
4. jQuery based Glossary term A to Z
5. Default Glossary term archive
6. Glossary term list front end (full)
7. Backend adding term list with shortcode


== Changelog ==

= 3.1 =
* NEW Option 'qtiptrigger' hover/click
* UPD Updated to qTip 2.1.1
* UPD Tidied admin

= 3.0.1 =
* FIX Options menu

= 3.0 =
* NEW Now using qTip2
* NEW Tooltips AJAX powered
* NEW Support for private terms
* NEW Support for overriding options with shortcode atts for list and atoz
* FIX Handle nested shortcode terms
* UPD Minor markup updates

= 2.4.1 =
* NEW Language: French (Thank you Walid)
* FIX Glossary tooltip 'off' (props Epema)
* FIX Code warnings

= 2.4 =
* NEW Glossary term dropdown selector in editor (TinyMCE)
* UPD Languages: Spanish (Thank you Joose) & Portugese (Thank you Gwyneth)
* FIX Iterative usage loop in tooltips that reference glosary terms

= 2.3.3 =
* FIX glossary post content in tooltip

= 2.3.2 =
* FIX Recursive loop-referencing glossary terms

= 2.3.1 =
* FIX Taxonomy archive check

= 2.3 =
* NEW Glossary term usage (experimental)
* NEW qTranslate compatibility (experimental)
* NEW Glossary Term taxonomy admin columns added
* NEW Content filter args to ignore in widget
* UPD Taxonomy archive also alphabetical
* UPD Glossary group taxonomy rewrite updated
* FIX Shortcode anchor link
* FIX Version check

= 2.2 =
* NEW Snazzy banner for plugin (thanks Gwyneth Llewelyn!)
* NEW Link attribute option (from shortcode to details page): normal/disable/newtab
* NEW General options can be over-written in shortcode
* UPD Improved jQuery extenstion
* UPD Language support improved [again!] (lot of thanks Gwyneth Llewelyn)
* FIX Slug language rewrite

TRANSLATIONS:

* Portugese (by Gwyneth Llewelyn)
* German (by Gwyneth Llewelyn)

= 2.1.1 =
* FIX Glossary term url without tooltip (thanks Gwyneth Llewelyn and stephen451)

= 2.1 =
* NEW Now uses qTip library for tooltips (http://craigsworks.com/projects/qtip/)
* NEW Sidebar Widget: Random Term
* NEW Glossary CSS can be completely over-written with theme file
* UPD Default tooltip CSS updated
* FIX Inifinite loop when term name misses in shortcode

= 2.0 =
* NEW - Groups option added to glossary_atoz shortcode
* NEW - Groups option added to glossary_term_list shortcode
* NEW - Option to add excerpt and full description to atoz and term_list shortcodes
* NEW - Columns added to term_list (this might change, depending on feedback)
* UPD - AtoZ jQuery modified slightly
* TECH - Rewritten to use classes (keep it tidier and avoid name collisions)

= 1.5.1 =
* FIX - Debug statement removed

= 1.5 =
* NEW - Glossary Groups taxonomy
* NEW - Glossary options: tooltips + alphabetical archive

= 1.4.2 =
* FIX - At last - i18n works! Thanks Otto.

= 1.4.1 =
* FIX - Closing title tag

= 1.4 =
* NEW - Support for excerpt

= 1.3.3 =
* NEW - Text domain and pot file
* NEW - Support for i18n
* NEW - A to Z range filter added
* NEW - Version check hook

= 1.2 =
* NEW - A to Z shortcode (inspired by Brandon Sawyer)
* NEW - Reference meta (title + link)
* NEW - Author support
* UPDATE - Tooltip size updated
* UPDATE - Restrict term list to specific letters
* FIX - Tooltip overflow css

= 1.1.3 =
* Made tooltip js conditionally load (only when shortcode used)

= 1.1.2 =
* Fixed some WordPress function syntax (dev)
* Updated shortcode name to something sensible

= 1.1 = 
* Added basic jquery-tooltip based tooltip system
* Added glossaries shortcode (makes an alphabetical list of terms)

= 1.0 =
* Fix rewrite flush
* Add archive
* Fix readme
* Added screenshots
* Supported by [dedicated website section](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/)

= 0.1 =
* Inital version. Trivial functionality.


== Upgrade Notice ==

= 3.0 =
* Tooltips handled very differently

= 2.3 =
* Glossary term details page now displays term usage.
* Glossary group taxonomy slug changed (make sure your permalinks are saved).

= 2.1 =
Changes the default tooltip style (now used qTip)

= 1.2 =
Adds a the_content filter to glossary term single page

= 1.0 =
Version 0.1 rewrite flush was for dev purposes only and may have broken other re-writes. Please save your permalinks after upgrading.


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
See the [dedicated website section](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/)
