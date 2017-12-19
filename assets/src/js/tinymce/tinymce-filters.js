'use strict';

const OptArray = require( '../optarray' );
const utils = require( './tinymce-utils' );
const comon = require( '../comon' );

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
		let key = comon.maybePrefixAttribute( match[1] + match[2]);
		const value = match[3];
		if ( 'data-type' === key ) {
			return;
		}
		opt.addOpt( key, value );
	};
};

module.exports = {
	replace: {
		tip: content => { // For [glossary]
			return content.replace( /\[itg-(gloss|tooltip|mediatip)(?!_)(.*?)\](.*?)\[\/itg-\1\]/g, ( all, tag, inner, text ) => {
				const attrs	= new OptArray();
				attrs.addOpt( 'data-type', `ithoughts-tooltip-glossary-${ tag }` );
				attributesToOpts( attrs, inner );
				return `<a ${ attrs.toString() }>${  text  }</a>`;
			});
		},
		list: content => { // For [glossary_(term_list|atoz)]
			return content.replace( /\[itg-(glossary|atoz)(?:\s+(.*?))\/\]/g, ( all, tag, inner ) => {
				const attrs	= new OptArray();
				attrs.addOpt( 'data-type', `ithoughts-tooltip-glossary-${ tag }` );
				attributesToOpts( attrs, inner );
				return `<span ${ attrs.toString()  }>${ 'glossary' === tag ? 'Glossary' : 'A-to-Z' }</span>`;
			});
		},
	},
	restore: {
		tip: content => { // For [itg-gloss]
			return content.replace( /<a\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(gloss|tooltip|mediatip)")(.*?)>(.*?)<\/a>/g, ( all, type, inner, text ) => {
				const attrs	= new OptArray();
				const tag = `itg-${ type }`;
				attributesToOpts( attrs, inner );
				return `[${ tag } ${ attrs.toString() }]${  text  }[/${ tag }]`;
			});
		},
		list: content => { // For [glossary_(term_list|atoz)]
			return content.replace( /<span\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(glossary|atoz)")(.*?)>.*?<\/span>/g, ( all, type, inner ) => {
				const attrs	= new OptArray();
				const tag = `itg-${ type }`;
				attributesToOpts( attrs, inner );
				return `[${ tag } ${ attrs.toString() }/]`;
			});
		},
	},
};
