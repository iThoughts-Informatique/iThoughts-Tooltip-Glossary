import { isArray } from 'underscore';

export const APP_NAMESPACE = 'TEST-itg';

export const ns = jest.fn( ( symbol?: string[] | string, sep = '/' ) => [
		APP_NAMESPACE,
		...( isArray( symbol ) ? symbol : [symbol] ),
	]
	.filter( v => !!v )
	.join( sep ) );
