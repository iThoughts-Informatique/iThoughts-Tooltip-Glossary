import htmlElementAttributes from 'html-element-attributes';
import { Dictionary, isArray, object } from 'underscore';
import uuidv5 from 'uuid/v5';
import { APP_NAMESPACE } from './settings';

export type TMany<T> = T | T[];
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const ensureArray = <T>( v?: TMany<T> | undefined | null ) => {
	if ( isArray( v ) ) {
		return v;
	} else if ( v === null || typeof v === 'undefined' ) {
		return [];
	} else {
		return [v];
	}
};
export function staticImplements<T>() {
	// tslint:disable-next-line: no-unused-expression
	return <U extends T>( constructor: U ) => {constructor; };
}

export const jqXhrToPromise = <T>( xhr: JQueryXHR ) =>
	new Promise<T>( ( res, rej ) => xhr.done( res ).fail( rej ) );

// From https://stackoverflow.com/a/9756789/4839162
export const escapeAttr = ( attr: string, preserveCR = false ) => {
	const crReturn = preserveCR ? '&#13;' : '\n';
	return attr /* Forces the conversion to string. */
		.replace( /&/g, '&amp;' ) /* This MUST be the 1st replacement. */
		.replace( /'/g, '&apos;' ) /* The 4 other predefined entities, required. */
		.replace( /"/g, '&quot;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' )
		/*
		You may add other replacements here for HTML only
		(but it's not necessary).
		Or for XML, only if the named entities are defined in its DTD.
		*/
		.replace( /\r\n/g, crReturn ) /* Must be before the next replacement. */
		.replace( /[\r\n]/g, crReturn );
};

// From https://stackoverflow.com/a/9756789/4839162
export const unescapeAttr = ( attr: string ) => {
	/*
	Note: this can be implemented more efficiently by a loop searching for
	ampersands, from start to end of ssource string, and parsing the
	character(s) found immediately after after the ampersand.
	*/
	/*
	You may optionally start by detecting CDATA sections (like
	`<![CDATA[` ... `]]>`), whose contents must not be reparsed by the
	following replacements, but separated, filtered out of the CDATA
	delimiters, and then concatenated into an output buffer.
	The following replacements are only for sections of source text
	found *outside* such CDATA sections, that will be concatenated
	in the output buffer only after all the following replacements and
	security checkings.

	This will require a loop starting here.

	The following code is only for the alternate sections that are
	not within the detected CDATA sections.
	*/
	/* Decode by reversing the initial order of replacements. */
	attr = attr
		.replace( /\r\n/g, '\n' ) /* To do before the next replacement. */
		.replace( /[\r\n]/, '\n' )
		.replace( /&#13;&#10;/g, '\n' ) /* These 3 replacements keep whitespaces. */
		.replace( /&#1[03];/g, '\n' )
		.replace( /&#9;/g, '\t' )
		.replace( /&gt;/g, '>' ) /* The 4 other predefined entities required. */
		.replace( /&lt;/g, '<' )
		.replace( /&quot;/g, '"' )
		.replace( /&apos;/g, "'" );
	/*
	You may add other replacements here for predefined HTML entities only
	(but it's not necessary). Or for XML, only if the named entities are
	defined in *your* assumed DTD.
	But you can add these replacements only if these entities will *not*
	be replaced by a string value containing *any* ampersand character.
	Do not decode the '&amp;' sequence here !

	If you choose to support more numeric character entities, their
	decoded numeric value *must* be assigned characters or unassigned
	Unicode code points, but *not* surrogates or assigned non-characters,
	and *not* most C0 and C1 controls (except a few ones that are valid
	in HTML/XML text elements and attribute values: TAB, LF, CR, and
	NL='\x85').

	If you find valid Unicode code points that are invalid characters
	for XML/HTML, this function *must* reject the source string as
	invalid and throw an exception.

	In addition, the four possible representations of newlines (CR, LF,
	CR+LF, or NL) *must* be decoded only as if they were '\n' (U+000A).

	See the XML/HTML reference specifications !
	*/
	/* Required check for security! */
	const found = /&[^;]*;?/.exec( attr );
	if ( found && found.length > 0 && found[0] !== '&amp;' ) {
		throw new Error( 'unsafe entity found in the attribute literal content' );
	}
	 /* This MUST be the last replacement. */
	attr = attr.replace( /&amp;/g, '&' );
	/*
	The loop needed to support CDATA sections will end here.
	This is where you'll concatenate the replaced sections (CDATA or
	not), if you have splitted the source string to detect and support
	these CDATA sections.

	Note that all backslashes found in CDATA sections do NOT have the
	semantic of escapes, and are *safe*.

	On the opposite, CDATA sections not properly terminated by a
	matching `]]>` section terminator are *unsafe*, and must be rejected
	before reaching this final point.
	*/
	return attr;
};

interface ITag {
	tag: string;
	attributes: Dictionary<string | true | undefined>;
	content: string;
}
export const camelCaseToDash = ( myStr: string ) =>
	myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();

export const makeHtmlTag = ( { tag, content, attributes }: ITag ): HTMLElement => {
	const tagElement = document.createElement( tag );

	// Set the HTML
	tagElement.innerHTML = content;

	// Set attributes
	const allowedAttributes = htmlElementAttributes['*'].concat( htmlElementAttributes[tag] || [] );
	const camelCasedAttrs = object<Dictionary<string | true>>( Object.entries( attributes )
		.filter( ( keyValuePair ): keyValuePair is [string, string|true] => typeof keyValuePair[1] !== 'undefined' )
		.map( ( [attrName, attrValue] ) => [camelCaseToDash( attrName ), attrValue] as [string, string | true] )
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

// ... using predefined DNS namespace (for domain names)
const uuidNs = uuidv5( APP_NAMESPACE, uuidv5.DNS );

// ... using a custom namespace
//
// Note: Custom namespaces should be a UUID string specific to your application!
// E.g. the one here was generated using this modules `uuid` CLI.
export const uuid = ( name: string ) => uuidv5( name, uuidNs ); // ⇨ '630eb68f-e0fa-5ecc-887a-7c7a62614681'
