import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import scss from 'rollup-plugin-scss';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import imagemin from 'rollup-plugin-imagemin';
import virtual from 'rollup-plugin-virtual';
import { jsonManifest } from 'rollup-plugin-json-manifest';
import { string } from 'rollup-plugin-string';

import _ from 'underscore';
import React from 'react';
import ReactDom from 'react-dom';
import ReactDates from 'react-dates';

const camelCase = str => str.replace( /-([a-z])/g, ( [, g] ) => g.toUpperCase() );

const allDeps = Object.keys( require( './package.json' ).dependencies );
const wpDeps = allDeps.filter( dep => dep.startsWith( '@wordpress' ) );

const bundles = {
	'assets/src/front/index.ts': 'assets/tmp/front.js',
	'assets/src/common/index.ts': 'assets/tmp/common.js',
	'assets/src/back/index.ts': 'assets/tmp/back.js',
};

const backToFrontVirtualModules = ['editor-config'];
const backToFrontVirtualModuleGlobals = backToFrontVirtualModules.reduce( ( acc, identifier ) => {
	acc[`~${identifier}`] = `ithoughtsTooltipGlossary_${camelCase( identifier )}`;
	return acc;
},                                                                       {} );

const external = _.reject( allDeps, 'qtip2' ).concat( backToFrontVirtualModules );
const globals = {
	react: 'React',
	tinymce: 'tinymce',
	underscore: '_',

	...backToFrontVirtualModuleGlobals,

	...wpDeps.reduce( ( acc, dep ) => {
		if ( dep === '@wordpress/i18n' ) {
			acc[dep] = 'wp.i18n';
		} else {
			acc[dep] = `wp.${camelCase( dep.replace( '@wordpress/', '' ) )}`;
		}
		return acc;
	},               {} ),
};
console.log( 'Using externals %j exposed as globals %j', external, globals );

export default Object.entries( bundles ).map( ( [inFile, outFile] ) => {
	const base = outFile.replace( /^.*?(\/|\\)(\w+)\.js/, '$2' );
	return {
		input: inFile,
		output: {
			file: outFile,
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
				sourceMap : true,
			} ),
			string( { include: '**/*.html' } ),
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
				sourceMap : true,
			} ),
			scss(),
			postcss( {
				extract: true,
				minimize: true,
				sourceMap: true,
			} ),
			babel( {
				exclude: 'node_modules/**',
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
				sourceMap : true,
			} ),
			virtual( backToFrontVirtualModules.reduce( ( acc, module ) => {
				acc[module] = 'export default {}';
				return acc;
			},                                       {} ) ),
			terser( { sourcemap: true } ),
			imagemin( {
				fileName: `${base}-[name][extname]`,
				svgo: {
					full: true,
					plugins: [],
				},
			} ),
			jsonManifest( { outDir: 'assets/dist' } ),
		],
	};
} );
