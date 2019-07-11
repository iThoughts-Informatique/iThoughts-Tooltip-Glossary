export const camelCaseToDashCase = ( str: string ) =>
	str.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
export const dashCaseToCamelCase = ( str: string ) =>
	str.replace( /-(\w)/g, ( _allMatch, firstLetter: string ) => firstLetter.toUpperCase() );
