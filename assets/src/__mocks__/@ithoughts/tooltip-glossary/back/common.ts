import { isArray } from 'underscore';

import { ECharEscapeSet, ensureArray as _ensureArray } from '../../../../back/common';

export { ECharEscapeSet };

export const APP_NAMESPACE = 'TEST-itg';

export const ns = jest.fn( ( symbol?: string[] | string, sep = '/' ) => [
		APP_NAMESPACE,
		...( isArray( symbol ) ? symbol : [symbol] ),
	]
	.filter( v => !!v )
	.join( sep ) );

export const unescapeString = jest.fn( v => v );
export const escapeString = jest.fn( v => v );
export const ensureArray = jest.fn( _ensureArray );
