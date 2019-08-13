// @ts-nocheck
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import imagemin from 'rollup-plugin-imagemin';
import virtual from 'rollup-plugin-virtual';
import { jsonManifest } from 'rollup-plugin-json-manifest';
import { string } from 'rollup-plugin-string';
import replace from 'rollup-plugin-replace';
import visualizer from 'rollup-plugin-visualizer';

import _ from 'underscore';
import { basename, extname } from 'path';
import { isString } from 'util';
import nodeSass from 'node-sass';
const settings = require('./settings.json');

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
    const external = _.reject( allDeps, dep => config.internals.includes(dep) ).concat( virtualModulesNames ).concat( config.externals );
    const globals = {
        ...config.globals,

        ...virtualModules,

        ...wpDeps.reduce( ( acc, dep ) => {
            acc[dep] = wpModuleToGlobal(dep)
            return acc;
        },               {} ),
    };
    console.log( 'Using externals %j exposed as globals %j', external, globals );

    return Object.entries( config.bundlesMap )
        .reduce( ( acc, [inFile, outFileDesc] ) => {
            let { file: bundleDest, asVirtualModule: virtualModuleName } = isString( outFileDesc ) ? { file: outFileDesc } : outFileDesc;
            if( virtualModuleName ){
                const vmn = virtualModuleName;
                const virtualModulePathSegments = virtualModuleName.split('/');
                const propsSegments = virtualModulePathSegments.slice(virtualModulePathSegments[0].startsWith('@') ? 2 : 1);
                
                virtualModuleName = 'ithoughtsTooltipGlossary_bundle_' + camelCase( propsSegments.join('-') );
                
                external.push( vmn );
                globals[vmn] = virtualModuleName;

                console.log( 'Aliasing file %s as module %s exposed as global %s', bundleDest, vmn, virtualModuleName );
            }

            const bundleFileName = basename(bundleDest);
            const bundleName = basename(bundleDest, extname(bundleDest));

            acc.push( [ inFile, { bundleDest, asVirtualModule: virtualModuleName, bundleName, bundleFileName } ] )
            return acc;
        }, [] )
        .map( ( [inFile, { bundleDest, asVirtualModule, bundleName, bundleFileName }] ) => {
            return {
                input: inFile,
                output: {
                    file: bundleDest,
                    format: 'iife',
                    sourcemap : true,
                    globals,
                    name: asVirtualModule,
                    extend: true
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
                    postcss( {
                        extract: true,
                        minimize: true,
                        sourceMap: true,
                        
                        use: [['sass', {
                            functions: {
                                'namespace()': () => {
                                    return new nodeSass.types.String( settings.cssNamespace );
                                }
                            }
                        }]]
                    } ),
                    replace({
                        'process.env.NODE_ENV': JSON.stringify( config.environment ),
                    }),
                    babel( {
                        exclude: 'node_modules/**',
                        extensions: ['.js', '.jsx', '.ts', '.tsx'],
                        sourceMap : true,
                    } ),
                    virtual( Object.keys(virtualModules)
                        .concat( [ asVirtualModule ] )
                        .filter( v => v )
                        .reduce( ( acc, module ) => {
                            acc[module] = 'export default {}';
                            return acc;
                        },                          {} ) ),
                    config.environment === 'production' ? terser( { sourcemap: true } ) : undefined,
                    imagemin( {
                        fileName: `${bundleName}-[name][extname]`,
                        svgo: {
                            full: true,
                            plugins: [],
                        },
                    } ),
                    jsonManifest( { outDir: 'assets/dist' } ),
                    visualizer({
                        filename: `./stats/${bundleName}.html`,
                        title: `Stats for ${bundleName}`,
                    })
                ].filter(v => v),
            };
        } );
}
