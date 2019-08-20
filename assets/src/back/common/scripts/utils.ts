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

// ... using predefined DNS namespace (for domain names)
const uuidNs = uuidv5( APP_NAMESPACE, uuidv5.DNS );

// ... using a custom namespace
//
// Note: Custom namespaces should be a UUID string specific to your application!
// E.g. the one here was generated using this modules `uuid` CLI.
export const uuid = ( name: string ) => uuidv5( name, uuidNs ); // ⇨ '630eb68f-e0fa-5ecc-887a-7c7a62614681'
