import { isArray } from 'underscore';

export const APP_NAMESPACE = 'tooltip-glossary.ithoughts.com';

export const ns = ( symbol?: string[] | string, sep = '/' ) => [
		APP_NAMESPACE,
		...( isArray( symbol ) ? symbol : [symbol] ),
	]
	.filter( v => !!v )
	.join( sep );
