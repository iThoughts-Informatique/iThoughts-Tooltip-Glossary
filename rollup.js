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
import replace from 'rollup-plugin-replace';

import _ from 'underscore';

export const camelCase = str => str.replace( /-([a-z])/g, ( [, g] ) => g.toUpperCase() );


const getVirtualModules = ({virtualModules: {modules, moduleNameFactory, globalNameFactory}}) => modules.reduce( ( acc, identifier ) => {
    acc[moduleNameFactory(identifier)] = globalNameFactory(identifier);
    return acc;
},                                                                       {} )

export const wpModuleToGlobal = module => {
    if ( module === '@wordpress/i18n' ) {
        return 'wp.i18n';
    } else {
        return `wp.${camelCase( module.replace( '@wordpress/', '' ) )}`;
    }
}
export const initConfig = config => {
    const virtualModules = getVirtualModules(config);
    const virtualModulesNames = Object.keys(virtualModules);

    const allDeps = Object.keys( require( './package.json' ).dependencies );
    const wpDeps = allDeps.concat( virtualModulesNames ).filter( dep => dep.startsWith( '@wordpress' ) );
    const external = _.reject( allDeps, dep => config.internals.includes(dep) ).concat( virtualModulesNames );
    const globals = {
        ...config.globals,

        ...virtualModules,

        ...wpDeps.reduce( ( acc, dep ) => {
            acc[dep] = wpModuleToGlobal(dep)
            return acc;
        },               {} ),
    };
    console.log( 'Using externals %j exposed as globals %j', external, globals );

    return Object.entries( config.bundlesMap ).map( ( [inFile, outFile] ) => {
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
                    namedExports: _.object(config.namedExports.map(dep => [dep, Object.keys(require(dep))])),
                    sourceMap : true,
                } ),
                scss(),
                replace({
                'process.env.NODE_ENV': JSON.stringify( config.environment ),
                }),
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
                virtual( Object.keys(virtualModules).reduce( ( acc, module ) => {
                    acc[module] = 'export default {}';
                    return acc;
                },                                       {} ) ),
                config.environment === 'production' ? terser( { sourcemap: true } ) : undefined,
                imagemin( {
                    fileName: `${base}-[name][extname]`,
                    svgo: {
                        full: true,
                        plugins: [],
                    },
                } ),
                jsonManifest( { outDir: 'assets/dist' } ),
            ].filter(v => v),
        };
    } );
}
