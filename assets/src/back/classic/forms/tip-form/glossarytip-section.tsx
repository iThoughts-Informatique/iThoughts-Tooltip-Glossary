import autobind from 'autobind-decorator';
import { Collection } from 'backbone';
import { debounce } from 'debounce';
import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { isNumber, pick } from 'underscore';

import { getGlossaryTermModel, GlossaryTermModel, jqXhrToPromise } from '@ithoughts/tooltip-glossary/back/common';

import { ITip } from '../tip-form';
import { ETipType } from '../types';

export interface IGlossarytip {
	type: ETipType.Glossarytip;
	termId: number;
}
export const GLOSSARYTIP_KEYS = ['termId'];

export const isGlossarytip = ( props: any ): props is IGlossarytip =>
	props.type === ETipType.Glossarytip && isNumber( ( props as any as IGlossarytip ).termId );

interface IProps {
	onChangeSpecializedTip: ( props: IGlossarytip, placeholder?: string ) => void;
}
interface IAutocomplete{
	title: string;
	excerpt: string;
	url: string;
	id: number;
}
interface IState {
	tipData: IGlossarytip;
	autocompleteSearch: string;
	selectedTerm?: IAutocomplete;
	autocompletes: IAutocomplete[];
}

export const glossarytipValidationMessage = ( tip: ITip & ( IGlossarytip | {} ) ) => {
	if ( !( tip as any ).termId || ( tip as any ).termId < 1 ) {
		return 'Please select a glossary term';
	}
};

export class GlossarytipSection extends Component<IProps, IState> {
	public readonly state: IState = {
		autocompleteSearch: '',
		autocompletes: [],
		tipData: { termId: 0, type: ETipType.Glossarytip },
	};
	private readonly glossaryTermsCollection: Promise<Collection<GlossaryTermModel>>;

	public constructor( public readonly props: IProps ) {
		super( props );

		this.glossaryTermsCollection = getGlossaryTermModel()
			.then( model => new model
				.collections
				.GlossaryTerm<GlossaryTermModel>( undefined, { comparator: 'title' } ) )
			.then( collection => {
				this.doSearch();
				return Promise.resolve( collection );
			 } )
			// tslint:disable-next-line: no-console
			.catch( e => {
				throw e;
			 } );
	}

	public render() {
		return <fieldset>
			<label htmlFor='glossary-term'>Glossary term</label>
			<div>
				<Autocomplete
					value={this.state.autocompleteSearch}
					inputProps={{ id: 'glossary-term', className: 'form-field' }}
					items={this.state.autocompletes}
					getItemValue={item => item.id.toString()}
					renderItem={( item, isHighlighted ) =>
						<div
							key={item.id}
							className={'autocomplete-item ' + ( isHighlighted ? 'active' : '' )}>
							<p className='title'><b>{item.title}</b></p>
							<small dangerouslySetInnerHTML={{ __html: item.excerpt }}></small>
						</div>
					}
					onChange={this.onTermSearchChanged}
					onSelect={this.onTermSelected}
					/>
				<span className='loader'></span>
			</div>
		</fieldset>;
	}

	public setState( state: IState, callback?: ( () => void ) | undefined ) {
		super.setState( state, callback );
		this.props.onChangeSpecializedTip( state.tipData, state.selectedTerm ? state.selectedTerm.url : undefined );
	}

	@autobind
	private onTermSearchChanged( { target: { value: search }}: React.ChangeEvent<HTMLInputElement> ) {
		this.setState( {
			...this.state,
			autocompleteSearch: search,
		} );
		this.doSearch( search );
	}

	@autobind
	private onTermSelected( termIdStr: string ) {
		const termId = parseInt( termIdStr, 10 );
		const term = this.state.autocompletes.find( autocomplete => autocomplete.id === termId );
		if ( !term ) {
			throw new ReferenceError( 'Could not find a term once selected.' );
		}
		this.setState( {
			...this.state,
			autocompleteSearch: term.title,
			selectedTerm: term,
			tipData: { ...this.state.tipData, termId },
		} );
	}

	// #region Search/filtering
	private doSearch( maybeSearch?: string ) {
		const search = maybeSearch ? maybeSearch : this.state.autocompleteSearch;
		this.setState( { ...this.state, autocompleteSearch: search }, () => {
			// tslint:disable-next-line: no-floating-promises
			this.ajaxFetchDebounced( search );
			this.filterResults( search );
		} );
	}

	private filterResults( maybeSearch?: string ) {
		const search = maybeSearch ? maybeSearch : this.state.autocompleteSearch;
		this.setState( {
			...this.state,
			autocompletes: this.state.autocompletes.filter( d => d.excerpt.toLowerCase().includes( search ) ||
				d.title.toLowerCase().includes( search ) ||
				d.id.toString().includes( search ) ),
		} );
	}

	private async ajaxFetch( maybeSearch?: string ) {
		const search = maybeSearch ? maybeSearch : this.state.autocompleteSearch;

		const collection = await this.glossaryTermsCollection;
		await jqXhrToPromise<void>( collection.fetch( {
			data: { search },
		} ) );
		this.setState( {
			...this.state,

			autocompletes: collection.models
				.map( term => ( {
					excerpt: term.attributes.content.slice( 0, 100 ),

					...pick( term.attributes, ['excerpt', 'id', 'title', 'url'] ) as Pick<( typeof term )['attributes'], 'excerpt' | 'id' | 'title' | 'url'>,
				} ) ),
		},             this.filterResults );
	}
	private readonly ajaxFetchDebounced = debounce( this.ajaxFetch, 500 );
	// #endregion
}
