import { promises as fs } from 'fs';
import { resolve as _resolve, extname, basename } from 'path';
import md5File from 'md5-file';
import { object, pairs, assign, Dictionary } from 'underscore';

const resolveFile = _resolve.bind(null, './assets/dist');
const MANIFEST = resolveFile('manifest.json');

const hashFile = (filePath: string) => new Promise((resolve, reject) => md5File(filePath, (err, hash) => {
	if(err){
		return reject(err);
	} else {
		return resolve(hash);
	}
}));
const getManifest = (): Dictionary<string> => {
	try{
		return require(MANIFEST);
	} catch {
		return {};
	}
}
const makeHashedFilename = async (filePath: string) => {
	const ext = extname(filePath);
	const baseFilename = basename(filePath, ext).replace(/^raw-/, '');
	const hash = await hashFile(filePath);
	return baseFilename + '-' + hash + ext;
}
const makeManifest = async () => {
	const allFiles = await fs.readdir(resolveFile());
	
	const rawFiles = allFiles
		.filter(file => file.startsWith('raw-') && !file.endsWith('.map'));
	const hashedFiles = allFiles
		.filter(file => !file.startsWith('raw-') && file !== 'manifest.json');
	
	const keptManifestEntries = object<Dictionary<string>>(pairs(getManifest())
		.filter(([,value]) => hashedFiles.includes(value)));
	const hashes = object(
		rawFiles.map(file => file.replace(/^raw-/, '')),
		await Promise.all(rawFiles.map(file => makeHashedFilename(resolveFile(file))))
	);

	console.log(`Adding new mappings for ${JSON.stringify(rawFiles)} to existing mappings ${JSON.stringify(Object.keys(keptManifestEntries))}`);

	await Promise.all(Object.entries(hashes).map(([file, hash]) => {
		fs.rename(resolveFile('raw-' + file), resolveFile(hash));
	}));
	const newManifest = assign({}, keptManifestEntries, hashes);
	await fs.writeFile(MANIFEST, JSON.stringify(newManifest, null, 4));
}

makeManifest();
