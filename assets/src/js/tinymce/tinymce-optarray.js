'use strict';

class OptArray{
	constructor(){
		this.opts = [];
	}

	static generateAttr( label, value, specEncode ) {
		value = String( value ).trim();
		if ( !label.match( /^[\w_\-]*$/ )) {
			return null;
		}
		return `${ stripQuotes( label.trim(), true )  }="${   !isNA( specEncode ) && specEncode ? value.replace( /"/g, '&aquot;' ).replace( /\n/g, '<br/>' ) : stripQuotes( value, true )  }"`;
	}

	addOpt(label, value, specEncode = false){
		const resOpt = OptArray.generateAttr(label, value, specEncode);
		if(!isNA(resOpt)){
			this.opts.push(resOpt)
		}
	}

	maybeAddOpt(addValue, name, value){
		if ( addValue ) {
			this.addOpt( name, value);
		}
	}

	toString(){
		return this.opts.join(' ');
	}
}

module.exports = OptArray;