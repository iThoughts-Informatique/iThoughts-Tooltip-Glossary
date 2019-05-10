import { isArray } from 'underscore';
import settings from '../../../../../settings.json';

export const APP_NAMESPACE = settings.appNamespace;

export const ns = ( symbol?: string[] | string, sep = '/' ) => [
		APP_NAMESPACE,
		...( isArray( symbol ) ? symbol : [symbol] ),
	]
	.filter( v => !!v )
	.join( sep );

export const CSS_NAMESPACE = settings.cssNamespace;
