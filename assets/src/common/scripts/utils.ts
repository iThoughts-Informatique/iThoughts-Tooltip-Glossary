import { Dictionary, isEqual } from 'underscore';

export const uniqueObjects = <T extends object>( items: T[] ) =>
	items.filter( ( element, index ) => {
		// tests if the element has a duplicate in the rest of the array
		for ( index += 1; index < items.length; index += 1 ) {
			if ( isEqual( element, items[index] ) ) {
				return false;
			}
		}
		return true;
	} );

export const lazyEval = <T>( cb: () => T ) => {
	let val: T;
	return {
		get val() {
			if ( typeof val === 'undefined' ) {
				val = cb();
			}
			return val;
		},
	};
};
export type LazyEvaluator<T> = {readonly val: T};

export type Nullable<T> = T | null | undefined;
export const isNotNil = <T>( v: Nullable<T> ): v is T => typeof v !== 'undefined' && v !== null;
export const isNil = <T>( v: Nullable<T> ): v is null | undefined => !isNotNil( v );

export const _throw = ( m: any ) => { throw m; };

export const cleanObject = <T>( obj: Dictionary<T | undefined> ) => Object.entries( obj )
	.filter( ( kvp: [string, Nullable<T>] ): kvp is [string, T] => isNotNil( kvp[1] ) )
	.reduce( ( acc, [k, v] ) => {
		acc[k] = v;
		return acc;
	},       {} as Dictionary<T> );

export const jqXhrToPromise = <T>( xhr: JQueryXHR ) =>
	new Promise<T>( ( res, rej ) => xhr.done( res ).fail( rej ) );
