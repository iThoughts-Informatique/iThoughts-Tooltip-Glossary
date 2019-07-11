import htmlElementAttributes from 'html-element-attributes';
import { Dictionary, object } from 'underscore';
import { camelCaseToDashCase, dashCaseToCamelCase } from './string';

export interface ITag {
	tag: string;
	attributes: Dictionary<string | true | undefined | number>;
	content: string;
}

export const makeHtmlElement = ( { tag, content, attributes }: ITag ): HTMLElement => {
	const tagElement = document.createElement( tag );

	// Set the HTML
	tagElement.innerHTML = content;

	// Set attributes
	const allowedAttributes = htmlElementAttributes['*'].concat( htmlElementAttributes[tag] || [] );
	const camelCasedAttrs = object<Dictionary<string | true>>( Object.entries( attributes )
		.filter( ( keyValuePair ): keyValuePair is [string, string|true] => typeof keyValuePair[1] !== 'undefined' )
		.map( ( [attrName, attrValue] ) => [camelCaseToDashCase( attrName ), attrValue] as [string, string | true] )
		.map( ( [attrName, attrValue] ) => {
			if ( !attrName.startsWith( 'data-' ) && !allowedAttributes.includes( attrName ) ) {
				return [`data-${attrName}`, attrValue];
			} else {
				return [attrName, attrValue];
			}
		} ) );
	Object.entries( camelCasedAttrs )
		.forEach( ( [attrName, attrVal] ) => {
			tagElement.setAttribute( attrName, attrVal === true ? '' : attrVal );
		} );

	return tagElement;
};

const strToVal = ( str: string ) => {
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
export const parseHtmlElement = ( element: HTMLElement ): ITag =>
	( {
		attributes: Array.from( element.attributes )
			.map( attr => [ attr.name, attr.value ] )
			.reduce( ( acc, [attrName, attrVal] ) => {
				const nameNoData = attrName.replace( /^data-/, '' );
				acc[dashCaseToCamelCase( nameNoData )] = strToVal( attrVal );
				return acc;
			},       {} as Dictionary<string | number | true | undefined> ),
		content: element.innerHTML,
		tag: element.tagName.toLowerCase(),
	} );
