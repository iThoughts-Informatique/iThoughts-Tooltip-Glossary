const fs = require('fs').promises;
const path = require('path');
const md5File = require('md5-file');
const _ = require('lodash');

const resolveFile = path.resolve.bind(null, './assets/dist');
const MANIFEST = resolveFile('manifest.json');

const hashFile = filePath => new Promise((resolve, reject) => md5File(filePath, (err, hash) => {
	if(err){
		return reject(err);
	} else {
		return resolve(hash);
	}
}));
const getManifest = () => {
	try{
		return require(MANIFEST);
	} catch {
		return {};
	}
}
const makeHashedFilename = async filePath => {
	const ext = path.extname(filePath);
	const baseFilename = path.basename(filePath, ext).replace(/^raw-/, '');
	const hash = await hashFile(filePath);
	return baseFilename + '-' + hash + ext;
}
const makeManifest = async () => {
	const allFiles = await fs.readdir(resolveFile());
	
	const rawFiles = allFiles.filter(file => file.startsWith('raw-'));
	const hashedFiles = allFiles.filter(file => !file.startsWith('raw-') && file !== 'manifest.json');
	
	await Promise.all(hashedFiles.map(file => fs.unlink(resolveFile(file))));

	const hashes = _.zipObject(
		rawFiles.map(file => file.replace(/^raw-/, '')),
		await Promise.all(rawFiles.map(file => makeHashedFilename(resolveFile(file))))
	);

	await Promise.all(Object.entries(hashes).map(([file, hash]) => {
		fs.rename(resolveFile('raw-' + file), resolveFile(hash));
	}));
	const newManifest = _.assign({}, getManifest(), hashes);
	await fs.writeFile(MANIFEST, JSON.stringify(hashes, null, 4));
}

makeManifest();
