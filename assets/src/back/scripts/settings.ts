import { isArray } from 'underscore';

export const NAMESPACE = 'ithoughts-tooltip-glossary';

export const ns = ( symbol: string[] | string, sep = '/' ) => [
	NAMESPACE,
	...( isArray( symbol ) ? symbol : [symbol] ),
].join( sep );
