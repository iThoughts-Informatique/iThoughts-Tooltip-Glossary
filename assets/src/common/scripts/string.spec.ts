import { camelCaseToDashCase, dashCaseToCamelCase } from './string';

describe( 'Camel case to dash case', () => {
	it.each( [
		['foo', 'foo'],
		['fooBar', 'foo-bar'],
	] )( 'Should convert "$1" to "$2"', ( input: string, output: string ) => {
		expect( camelCaseToDashCase( input ) ).toBe( output );
	} );
} );

describe( 'Dash case to camel case', () => {
	it.each( [
		['foo', 'foo'],
		['foo-bar', 'fooBar'],
	] )( 'Should convert "$1" to "$2"', ( input: string, output: string ) => {
		expect( dashCaseToCamelCase( input ) ).toBe( output );
	} );
} );
