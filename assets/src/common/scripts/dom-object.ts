import htmlElementAttributes from 'html-element-attributes';
import { Dictionary, object } from 'underscore';
import { camelCaseToDashCase, dashCaseToCamelCase } from './string';

export type AttrVal = string | true | undefined | number;
export type AttrsHash = Dictionary<AttrVal>;
export interface ITag {
	tag: string;
	attributes?: AttrsHash;
	content?: string;
}

export const makeHtmlElement = ( { tag, content, attributes }: ITag ): HTMLElement => {
	const tagElement = document.createElement( tag );

	// Set the HTML
	tagElement.innerHTML = content || '';

	// Set attributes
	const dashCasedAttrs = convertCamelCaseToDashCaseAttrs( attributes, tag );
	Object.entries( dashCasedAttrs )
		.filter( ( keyValuePair ): keyValuePair is [string, Exclude<AttrVal, undefined>] => typeof keyValuePair[1] !== 'undefined' )
		.forEach( ( [attrName, attrVal] ) => {
			tagElement.setAttribute( attrName, attrVal === true ? '' : attrVal.toString() );
		} );

	return tagElement;
};

const getAllowedAttrs = ( tag?: string ) => {
	// Set attributes
	if ( tag === '*' ) {
		return htmlElementAttributes['*'];
	} else if ( tag ) {
		return htmlElementAttributes['*'].concat( htmlElementAttributes[tag] || [] );
	} else {
		return undefined;
	}
};
export const convertCamelCaseToDashCaseAttrs = ( attributes: AttrsHash | undefined, tag?: string ): AttrsHash => {
	// Set attributes
	const allowedAttributes = getAllowedAttrs( tag );
	const dashCasedAttrs = object<AttrsHash>( Object.entries( attributes || {} )
		.map( ( [attrName, attrValue] ) => [camelCaseToDashCase( attrName ), attrValue] as [string, Exclude<AttrVal, undefined>] )
		.map( ( [attrName, attrValue] ) => {
			if ( allowedAttributes && !attrName.startsWith( 'data-' ) && !allowedAttributes.includes( attrName ) ) {
				return [`data-${attrName}`, attrValue];
			} else {
				return [attrName, attrValue];
			}
		} ) );
	return dashCasedAttrs;
};

export const strToAttrVal = ( str: string ) => {
	if ( str.match( /^-?\d+$/ ) ) {
		return parseInt( str, 10 );
	} else if ( str.match( /^-?\d*\.\d+$/ ) ) {
		return parseFloat( str );
	} else if ( str === 'true' || str === '' ) {
		return true;
	} else {
		return str;
	}
};
export const parseHtmlElement = ( element: HTMLElement ): ITag => {
	const attributes = Array.from( element.attributes )
		.map( attr => [ attr.name, attr.value ] )
		.reduce( ( acc, [attrName, attrVal] ) => {
			const nameNoData = attrName.replace( /^data-/, '' );
			acc[dashCaseToCamelCase( nameNoData )] = strToAttrVal( attrVal );
			return acc;
		},       {} as Dictionary<string | number | true | undefined> );

	return {
		attributes: Object.keys( attributes ).length > 0 ? attributes : undefined,
		content: element.innerHTML || undefined,
		tag: element.tagName.toLowerCase(),
	};
};
