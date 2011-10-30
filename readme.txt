=== Plugin Name ===
Contributors: tcbarrett
Donate link: http://www.tcbarrett.com/donate/
Tags: glossary, wp-glossary, dictionary, gloss, appendix, technical terms
Requires at least: 3.0
Tested up to: 3.2.1
Stable tag: 0.1

Build a glossary on your site, and link terms in your posts to it.

== Description ==

This first version does two things:
1. Adds a glossary custom post type for storing your glossary terms.
1. Adds a glossary shortcode to allow you to link your content to your glossary terms.

Example syntax:

Display and link to glossary with post ID 4
[glossary id='4'] 

Display and link to glossary with slug 'seo'
[glossary slug='seo']

Auto search word for matching glossary term (e.g. 'seo')
[glossary]SEO[/glossary]

Apply glossary term with slug 'seo' to post content 'search engine optimisation'
[glossary slug='seo']search engine optimisation[/glossary]

== Installation ==

1. Upload `plugin-name.php` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= Can the plugin auto tag my glossary terms? =

No. But if you want it to, let me know and I'll add it.

= Can I link it to an external glossary =

Not yet, but this is another idea I have considered.

= Will there be a nice tool-tip style hover mechanism? =

Yes, that is the plan for the next release.

== Screenshots ==

None yet. It'd just be some basic post admin screen shots. It's that simple!

== Changelog ==

= 0.1 =
* Inital version. Trivial functionality.
