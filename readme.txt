=== WP Glossary ===
Contributors: tcbarrett
Donate link: http://www.tcbarrett.com/donate/
Plugin URL: http://www.tcbarrett.com/wordpress-plugins/wp-glossary/
Tags: glossary, wp-glossary, dictionary, gloss, appendix, technical terms
Requires at least: 3.0
Tested up to: 3.4.1
Stable tag: 1.0

Create your own glossary of hot-linked terms, right inside your own site!

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

1. Upload `plugin-name.php` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= Can the plugin auto tag glossary terms in my post content? =

No. However, when you add the glossary shortcode, it does it's best to find the right term. In a nice way.

= Can I link it to an external glossary =

Not yet, but this is another idea I have considered.


= Further Information =

[For further details visit my dedicated plugin landing page](http://www.tcbarrett.com/wordpress-plugins/wp-glossary/)


== Screenshots ==


1. Edit glossary term
2. Using glossary shortcode in post content
3. Viewing glossary archive


== Changelog ==

= 1.1.1 =
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

= 1.0 =
Version 0.1 rewrite flush was for dev purposes only and may have broken other re-writes. Please save your permalinks after upgrading.

== Example Syntax ==
The WordPress shortcode syntax is really simple!

= Display and link to glossary with post ID 4 =
[glossary id='4'] 

= Display and link to glossary with slug 'seo' =
[glossary slug='seo']

= Auto search word for matching glossary term (e.g. 'seo') =
[glossary]SEO[/glossary]

= Apply glossary term with slug 'seo' to post content 'search engine optimisation' =
[glossary slug='seo']search engine optimisation[/glossary]

= Display a list of all your glossary terms (alphabetical) =
[glossary_term_list]
