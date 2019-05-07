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
	return <U extends T>( constructor: U ) => {constructor; };
}
