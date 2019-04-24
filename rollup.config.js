import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import scss from 'rollup-plugin-scss';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import imagemin from 'rollup-plugin-imagemin';
import virtual from 'rollup-plugin-virtual';

import _ from 'underscore';
import React from 'react';
import ReactDom from 'react-dom';
import ReactDates from 'react-dates';
import { spawnSync } from 'child_process';

const camelCase = str => str.replace( /-([a-z])/g, ( [, g] ) => g.toUpperCase() );

const allDeps = Object.keys( require( './package.json' ).dependencies );
const wpDeps = allDeps.filter( dep => dep.startsWith( '@wordpress' ) );

const bundles = {
	'assets/src/front/index.ts': 'assets/dist/front.js',
	'assets/src/common/index.ts': 'assets/dist/common.js',
	'assets/src/back/index.ts': 'assets/dist/back.js',
};
const backToFrontModules = ['editor-config'];
const backToFrontVirtualModuleToGlobalAliases = backToFrontModules.reduce( ( acc, identifier ) => {
	acc[`~${identifier}`] = `ithoughtsTooltipGlossary_${camelCase( identifier )}`;
	return acc;
},                                                                         {} );
const backToFrontVirtualModules = Object.keys( backToFrontVirtualModuleToGlobalAliases );
const external = _.reject( allDeps, 'qtip2' ).concat( backToFrontVirtualModules );
const globals = {
	react: 'React',
	underscore: '_',

	...backToFrontVirtualModuleToGlobalAliases,

	...wpDeps.reduce( ( acc, dep ) => {
		if ( dep === '@wordpress/i18n' ) {
			acc[dep] = 'wp.i18n';
		} else {
			acc[dep] = `wp.${camelCase( dep.replace( '@wordpress/', '' ) )}`;
		}
		return acc;
	},                {} ),
};
console.log( 'Using externals %j exposed as globals %j', external, globals );

export default Object.entries( bundles ).map( ( [inFile, outFile] ) => {
	const base = outFile.replace( /^.*?(\/|\\)(\w+)\.js/, '$2' );
	return {
		input: inFile,
		output: {
			file: outFile.replace( /(\/|\\)(\w+\.js)/, '$1raw-$2' ),
			format: 'iife',
			sourcemap : true,
			globals,
		},
		external,
		plugins: [
			resolve( {
				jsnext: true,
				main: true,
				browser: true,
				preferBuiltins: false,
				extensions: ['.js', '.ts', '.tsx'],
			} ),
			json(),
			commonjs( {
				include: [
					'node_modules/**',
				],
				exclude: [
					'node_modules/process-es6/**',
				],
				namedExports: {
					'react': Object.keys( React ),
					'react-dom': Object.keys( ReactDom ),
				},
			} ),
			scss(),
			postcss( {
				extract: true,
				minimize: true,
			} ),
			babel( {
				exclude: 'node_modules/**',
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			} ),
			virtual( backToFrontVirtualModules.reduce( ( acc, module ) => {
				acc[module] = 'export default {}';
				return acc;
			},                                         {} ) ),
			terser(),
			imagemin( {
				fileName: `raw-${base}-[name][extname]`,
				svgo: {
					full: true,
					plugins: [],
				},
			} ),
			{
				writeBundle() {
					const process  = spawnSync( 'ts-node', ['./build/make-manifest.ts'] );
					const err = process.stderr.toString();
					if ( err ) {
						console.error( '[make-manifest]: ' + err );
					}
					console.log( '[make-manifest]: ' + process.stdout.toString() );
				},
			},
		],
	};
} );
