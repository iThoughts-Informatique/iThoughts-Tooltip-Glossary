'use strict';

const OptArray = require('./tinymce-optarray');

const attrsMatcher = /(data-)?([\w\d\-]+?)="(.+?)"/g;

const maybePrefixOpt = opt => {
	return match => {
		let key = match[1] + match[2];
		const value = match[3];
		// If the key is not an HTML attribute and is not `data-` prefixed, prefix it
		if ( !htmlAttrs.contains(key) && !i.contains( 'data-' )) {
			key = ` data-${  key  }`;
		}
		opt.addOpt(key, value);
	}
};

module.exports = {
	replace: {
		glossary: content => { // For [glossary]
			return content.replace( /\[(?:itg-)?(glossary|tooltip|mediatip)(?!_)(.*?)\](.*?)\[\/(?:itg-)?(glossary|tooltip|mediatip)\]/g, ( all, tag, inner, text ) => {
				const attrs	= new OptArray();
				attrs.addOpt('data-type', `ithoughts-tooltip-glossary-${  {
					glossary: 'term',
					tooltip:  'tooltip',
					mediatip: 'mediatip',
				}[tag] }`);
				const attrsMatches = attrsMatcher.exec( inner );
				if(attrsMatches){
					attrsMatches.forEach(maybePrefixOpt(attrs));
				}
				return `<a ${ attrs.toString() }>${  text  }</a>`;
			});
		},
		list: content => { // For [glossary_(term_list|atoz)]
			return content.replace( /\[glossary_(term_list|atoz)(.*?)\/\]/g, ( all, type, inner ) => {
				const attrs	= new OptArray();
				attrs.addOpt('data-type', `ithoughts-tooltip-glossary-${ type }`);
				const attrsMatches = attrsMatcher.exec( inner );
				if(attrsMatches){
					attrsMatches.forEach(maybePrefixOpt(attrs));
				}
				return `<span ${ attrs.toString()  }>Glossary ${  ( 'term_list' === type ) ? 'List' : 'A-to-Z'  }</span>`;
			});
		},
	},
	restore: {
		glossary: content => { // For [glossary]
			return content.replace( /<a\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term|tooltip|mediatip)")(.*?)>(.*?)<\/a>/g, ( all, type, inner, text ) => {
				const attrs	= new OptArray();
				const tag = `itg-${ {
					term:     'glossary',
					tooltip:  'tooltip',
					mediatip: 'mediatip',
				}[type] }`;
				const attrsMatches = attrsMatcher.exec( inner );
				if(attrsMatches){
					attrsMatches.forEach(maybePrefixOpt(attrs));
				}
				return `[${ tag } ${attrs.toString()}]${  text  }[/${ tag }]`;
			});
		},
		list: content => { // For [glossary_(term_list|atoz)]
			return content.replace( /<span\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term_list|atoz)")(.*?)>.*?<\/span>/g, ( all, type, attrStr ) => {
				const attrs	= new OptArray();
				const tag = `glossary-${ type }`;
				const attrsMatches = attrsMatcher.exec( inner );
				if(attrsMatches){
					attrsMatches.forEach(maybePrefixOpt(attrs));
				}
				return `${ tag } ${attrs.toString()}/]`;
			});
		},
	},
}