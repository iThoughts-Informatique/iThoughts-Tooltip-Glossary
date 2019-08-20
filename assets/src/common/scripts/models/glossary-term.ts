import { init } from '@wordpress/api';
import { Collection, Model } from 'backbone';
import { Dictionary } from 'underscore';

import { controllerNamespace } from '~config';
import { jqXhrToPromise, lazyEval } from '../utils';

export declare class GlossaryTermModel extends Model {
	public readonly attributes: {
		id: number;
		title: string;
		content: string;
		url: string;
		excerpt?: string;
	};
}
export type GlossaryTermModelItem = Model & GlossaryTermModel['attributes'];

// Extend wp.api.models.Post and wp.api.collections.Posts to load a custom post type
export const getGlossaryTermModel = lazyEval( async () => {
	const model = await new Promise<Model>( ( res, rej ) =>
		//
			init( { versionString : controllerNamespace + '/' } )
				.done( res )
				.fail( rej ) );
	const retVal = {
		...Object.fromEntries( Object.entries( model.attributes.collections as Dictionary<typeof Collection> )
			.map( ( [name, collection] ) => [
				`${name[0].toLowerCase()}${name.slice( 1 )}Collection`,
				new collection(),
			] ) ),

		collections: model.attributes.collections,
		models: model.attributes.models,
	} as {
		glossaryTermCollection: Collection<GlossaryTermModel>;
		collections: {
			GlossaryTerm: typeof Collection;
		};
		models: {
			GlossaryTerm: new( attributes?: Partial<GlossaryTermModel['attributes']>, options?: any ) =>  GlossaryTermModelItem;
		};
	};
	return retVal;
} );

export const glossaryTermRepository = lazyEval( async () => {
	const model = await getGlossaryTermModel.val;
	const collection = new model
			.collections
		.GlossaryTerm<GlossaryTermModelItem>( undefined, { comparator: 'title' } );

	return {
		async getById( id: number, useCache = true ) {
			if ( useCache ) {
				const alreadyFetched = collection.get( id );
				console.log( 'From cache', alreadyFetched );
				if ( alreadyFetched ) {
					return alreadyFetched;
				}
			}
			const modelItem = await jqXhrToPromise<GlossaryTermModelItem>( new model.models.GlossaryTerm( { id } ).fetch() );
			if ( !modelItem ) {
				throw new Error( `Unable to find glossary term ${id}` );
			}
			collection.add( modelItem );
			return modelItem;
		},
		async search( searchCriterion: any ) {
			await jqXhrToPromise( collection.fetch( {
				data: { search: searchCriterion },
			} ) );
			return collection;
		},
	} as IRepository<GlossaryTermModelItem>;
} );

export interface IRepository<TModel extends Model> {
	getById( id: number, useCache?: boolean ): Promise<TModel>;
	search( searchCriterion: any ): Promise<Collection<TModel>>;
}
