import { promises as fs } from 'fs';
// tslint:disable-next-line: no-implicit-dependencies
import md5File from 'md5-file';
import { basename, extname, resolve as _resolve } from 'path';
import { assign, Dictionary, object, pairs } from 'underscore';

const resolveFile = _resolve.bind( null, './assets/dist' );
const MANIFEST = resolveFile( 'manifest.json' );

const hashFile = ( filePath: string ) => new Promise<string>( ( resolve, reject ) => md5File( filePath, ( err, hash ) => {
	if ( err ) {
		return reject( err );
	} else {
		return resolve( hash );
	}
} ) );
const getManifest = (): Dictionary<string> => {
	try {
		return require( MANIFEST );
	} catch {
		return {};
	}
};
const makeHashedFilename = async ( filePath: string ) => {
	const ext = extname( filePath );
	const baseFilename = basename( filePath, ext ).replace( /^raw-/, '' );
	const hash = await hashFile( filePath );
	return `${baseFilename}-${hash}${ext}`;
};
const makeManifest = async () => {
	const allFiles = await fs.readdir( resolveFile() );

	const rawFiles = allFiles
		.filter( file => file.startsWith( 'raw-' ) && !file.endsWith( '.map' ) );
	const hashedFiles = allFiles
		.filter( file => !file.startsWith( 'raw-' ) && file !== 'manifest.json' );

	const keptManifestEntries = object<Dictionary<string>>( pairs( getManifest() )
		.filter( ( [, value] ) => hashedFiles.includes( value ) ) );
	const hashes = object<Dictionary<string>>(
		rawFiles.map( file => file.replace( /^raw-/, '' ) ),
		await Promise.all( rawFiles.map( file => makeHashedFilename( resolveFile( file ) ) ) ),
	);

// tslint:disable-next-line: no-console
	console.log( `Adding new mappings for ${JSON.stringify( rawFiles )} to existing mappings ${JSON.stringify( Object.keys( keptManifestEntries ) )}` );

	await Promise.all( Object.entries( hashes )
		.map( ( [file, hash] ) => fs.rename( resolveFile( 'raw-' + file ), resolveFile( hash ) ) ) );
	const newManifest = assign( {}, keptManifestEntries, hashes );
	await fs.writeFile( MANIFEST, JSON.stringify( newManifest, null, 4 ) );
};

// tslint:disable-next-line: no-floating-promises
makeManifest();
