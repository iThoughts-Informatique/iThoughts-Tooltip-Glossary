import { isArray } from 'underscore';

export type TMany<T> = T | T[];
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
