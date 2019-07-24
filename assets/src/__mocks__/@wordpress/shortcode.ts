export const next = jest.fn();
export const string = jest.fn();

const mockCtor = jest.fn().mockImplementation( function( arg ) {
	return Object.assign( this, {
		...arg,
		next: next.bind( this, this ),
		string: string.bind( this, this ),
	} );
} );
export default Object.assign( mockCtor, {
	next,
	string,
} );
