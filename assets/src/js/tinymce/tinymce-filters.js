'use strict';

const OptArray = require( '../optarray' );
const utils = require( './tinymce-utils' );

const attrsMatcher = /(data-)?([\w\d\-]+?)="(.+?)"/g;


const attributesToOpts = ( attrs, inner ) => {
	let attrMatched;
	const handleOpt = maybePrefixOpt( attrs );
	do {
		attrMatched = attrsMatcher.exec( inner );
		if ( attrMatched ) {
			handleOpt( attrMatched );
		}
	} while ( attrMatched );
};

const maybePrefixOpt = opt => {
	return match => {
		let key = utils.maybePrefixAttribute( match[1] + match[2]);
		const value = match[3];
		if ( 'data-type' === key ) {
			return;
		}
		opt.addOpt( key, value );
	};
};

module.exports = {
	replace: {
		glossary: content => { // For [glossary]
			return content.replace( /\[(?:itg-)?(glossary|tooltip|mediatip)(?!_)(.*?)\](.*?)\[\/(?:itg-)?(glossary|tooltip|mediatip)\]/g, ( all, tag, inner, text ) => {
				const attrs	= new OptArray();
				attrs.addOpt( 'data-type', `ithoughts-tooltip-glossary-${  {
					glossary: 'term',
					tooltip:  'tooltip',
					mediatip: 'mediatip',
				}[tag] }` );
				attributesToOpts( attrs, inner );
				return `<a ${ attrs.toString() }>${  text  }</a>`;
			});
		},
		list: content => { // For [glossary_(term_list|atoz)]
			return content.replace( /\[(?:glossary_|itg-)(term_?list|atoz)(?:\s+(.*?))\/\]/g, ( all, tag, inner ) => {
				const attrs	= new OptArray();
				tag = {
					termlist:  'termlist',
					term_list: 'termlist',
					atoz:      'atoz',
				}[tag];
				attrs.addOpt( 'data-type', `ithoughts-tooltip-glossary-${ tag }` );
				attributesToOpts( attrs, inner );
				return `<span ${ attrs.toString()  }>Glossary ${  ( 'termlist' === tag ) ? 'List' : 'A-to-Z'  }</span>`;
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
				attributesToOpts( attrs, inner );
				return `[${ tag } ${ attrs.toString() }]${  text  }[/${ tag }]`;
			});
		},
		list: content => { // For [glossary_(term_list|atoz)]
			return content.replace( /<span\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term_list|atoz)")(.*?)>.*?<\/span>/g, ( all, type, inner ) => {
				const attrs	= new OptArray();
				const tag = `itg-${ type }`;
				attributesToOpts( attrs, inner );
				return `[${ tag } ${ attrs.toString() }/]`;
			});
		},
	},
};
