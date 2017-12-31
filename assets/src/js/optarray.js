'use strict';

const {replaceQuotes} = iThoughtsTooltipGlossary;
const {isNA} = iThoughts.v5;

class OptArray {
	constructor( opts ) {
		this.opts = {};
		for ( const key in opts ) {
			this.addOpt( key, opts[key]);
		}
	}

	static generateAttr( label, value ) {
		return `${ label }="${ value }"`;
	}

	addOpt( label, value, specEncode = false ) {
		label = replaceQuotes( label.trim(), true );
		if ( !label.match( /^[\w_\-]*$/ )) {
			return this;
		}

		value = String( value ).trim();
		value = replaceQuotes( !isNA( specEncode ) && specEncode ? value.replace( /"/g, '&quot;' ) : value, true );

		this.opts[label] = value;
	}

	maybeAddOpt( addValue, name, value ) {
		if ( addValue ) {
			this.addOpt( name, value );
		}
	}

	toString() {
		return Object.keys( this.opts ).sort().map( key => OptArray.generateAttr( key, this.opts[key])).join( ' ' );
	}
}

module.exports = OptArray;
