import { isArray } from 'underscore';
import uuidv5 from 'uuid/v5';

import escapeStringRegexp from 'escape-string-regexp';
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

type CharsEscapeSet = Array<[string, string]>;
export enum ECharEscapeSet {
	Wp,
	Html,
}
const wpCharsEscape: CharsEscapeSet = [
	['&', '&amp;'], /* This MUST be the 1st replacement. */
	['"', '&quot;'], /* Quotes inside quotes in wp attrs should not be escaped. */
];
const charsEscapes: {[key in ECharEscapeSet]: CharsEscapeSet} = {
	[ECharEscapeSet.Html]: [
		...wpCharsEscape,
		["'", '&apos;'], /* The 3 other predefined entities, required. */
		['<', '&lt;'],
		['>', '&gt;'],
	],
	[ECharEscapeSet.Wp]: wpCharsEscape,
};

export const escapeString = ( str: string, set: ECharEscapeSet ) => charsEscapes[set]
	.reduce( ( s, [from, to] ) => s.replace( new RegExp( escapeStringRegexp( from ), 'g' ), to ), str );
export const unescapeString = ( str: string, set: ECharEscapeSet ) => charsEscapes[set]
	.reverse()
	.reduce( ( s, [to, from] ) => s.replace( new RegExp( escapeStringRegexp( from ), 'g' ), to ), str );

// From https://stackoverflow.com/a/9756789/4839162
export const escapeAttr = ( attr: string, preserveCR = false ) => {
	const crReturn = preserveCR ? '&#13;' : '\n';
	return escapeString( attr, ECharEscapeSet.Html )
		/*
		You may add other replacements here for HTML only
		(but it's not necessary).
		Or for XML, only if the named entities are defined in its DTD.
		*/
		.replace( /\r\n/g, crReturn ) /* Must be before the next replacement. */
		.replace( /[\r\n]/g, crReturn );
};

// From https://stackoverflow.com/a/9756789/4839162
export const unescapeAttr = ( attr: string, restoreCR = false ) => {
	const crReturn = restoreCR ? '&#13;' : '\n';
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
	attr = unescapeString(
		attr.replace( crReturn, '\n' ), /* To do before the next replacement. */
		ECharEscapeSet.Html );
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
	// attr = attr.replace( /&amp;/g, '&' );
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

// ... using predefined DNS namespace (for domain names)
const uuidNs = uuidv5( APP_NAMESPACE, uuidv5.DNS );

// ... using a custom namespace
//
// Note: Custom namespaces should be a UUID string specific to your application!
// E.g. the one here was generated using this modules `uuid` CLI.
export const uuid = ( name: string ) => uuidv5( name, uuidNs ); // ⇨ '630eb68f-e0fa-5ecc-887a-7c7a62614681'
