import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import scss from 'rollup-plugin-scss';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser';
import execute from 'rollup-plugin-execute';

import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';
import ReactDates from 'react-dates';

const allDeps = Object.keys(require('./package.json').dependencies);
const wpDeps = allDeps.filter(dep => dep.startsWith('@wordpress'));

const bundles = {
	'assets/src/front/index.ts': 'assets/dist/front.js',
	'assets/src/common/index.ts': 'assets/dist/common.js',
	'assets/src/back/index.ts': 'assets/dist/back.js',
};
const external = _.reject(allDeps, 'qtip2');
const globals = {
	react: 'React',
	
	...wpDeps.reduce((acc, dep) => {
		acc[dep] = `wp.${dep.replace('@wordpress/', '')}`;
		return acc;
	}, {})
};
console.log('Using externals %j exposed as globals %j', external, globals)


export default Object.entries(bundles).map(([inFile, outFile]) => ({
	input: inFile,
	output: {
		file: outFile.replace(/(\/|\\)(\w+\.js)/, '$1raw-$2'),
		format: 'iife',
		sourceMap : true,
		globals,
	},
	external,
	plugins: [
		resolve({
			jsnext: true,
			main: true,
			browser: true,
			extensions: ['.js', '.ts', '.tsx']
		}),
		commonjs({
			include: [
				'node_modules/**'
			],
			exclude: [
				'node_modules/process-es6/**'
			],
			namedExports: {
				'react': Object.keys(React),
				'react-dates': Object.keys(ReactDates),
				'react-dom': Object.keys(ReactDom),
				'lodash': Object.keys(_),
			}
		}),
		scss(),
		postcss({
			extract: true,
			minimize: true,
		  }),
		babel({
			exclude: 'node_modules/**',
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
		}),
		terser(),
		execute('node ./build/hash-file.js'),
	],
}));
