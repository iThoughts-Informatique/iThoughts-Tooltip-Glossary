import { init } from '@wordpress/api';
import { Collection, Model } from 'backbone';
import { Dictionary, object } from 'underscore';
import editorConfig from '~editor-config';

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
export const getGlossaryTermModel = async () => {
	const model = await new Promise<Model>( ( res, rej ) =>
		//
			init( { versionString : editorConfig.controllerNamespace + '/' } )
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
	console.log( model, retVal );
	return retVal;
};
