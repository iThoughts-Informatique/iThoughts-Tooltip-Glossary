'use strict';

const htmlAttrs = ['href', 'title'];

const maybePrefixAttribute = attrName => {
	// If the key is not an HTML attribute and is not `data-` prefixed, prefix it
	if ( !htmlAttrs.includes(attrName) && !attrName.startsWith('data-')) {
		return `data-${  attrName  }`;
	} else {
		return attrName;
	}
};

const extractAttrs = node => {
	const ret = {};
	Array.prototype.slice.call(node.attributes, 0).forEach(attr => {
		ret[attr.nodeName] = attr.nodeValue;
	});
	return ret;
};

const generateTakeAttr = attrs => {
	// If we received a node instead of an object, extract its attributes
	if(attrs.tagName){
		attrs = extractAttrs(attrs);
	}
	// Return the picker function
	return ( label, defaultValue, noDataPrefix = false ) => {
		if ( !noDataPrefix ) {
			label = maybePrefixAttribute(label);
		}
		if(attrs.hasOwnProperty(label)){
			const val = attrs[label];
			delete attrs[label];
			return val;
		} else {
			return defaultValue;
		}
	};
};

const get = (object, path, defaultValue) => {
	let defaulted = false;
	path.forEach(segment => {
		if(typeof object !== 'undefined' && object.hasOwnProperty(segment)){
			object = object[segment];
		} else {
			defaulted = true;
		}
	});
	if(defaulted){
		return defaultValue;
	} else {
		return object;
	}
}

const isTrueValue = val => {
	if(typeof val === 'string' && (val === '1' || val.toLowerCase() === 'true')){
		return true;
	} else if(typeof val === 'number'){
		return val > 0;
	}
	return false;
}

const htmlEncode = str => $( '<textarea />' ).text( str ).html();
const htmlDecode = str => $( '<textarea />' ).html( str ).text();

module.exports = {
	maybePrefixAttribute,
	extractAttrs,
	generateTakeAttr,
	get,
	isTrueValue,
	htmlEncode,
	htmlDecode,
};