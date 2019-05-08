import autobind from 'autobind-decorator';
import { debounce } from 'debounce';
import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { isNumber } from 'underscore';

import { ETipType } from '../types';

export interface IGlossarytip {
	type: ETipType.Glossarytip;
	termId: number;
}
export const GLOSSARYTIP_KEYS = ['termId'];

export const isGlossarytip = ( props: any ): props is IGlossarytip =>
	props.type === ETipType.Glossarytip && isNumber( ( props as any as IGlossarytip ).termId );

interface IProps {
	onChangeSpecializedTip: ( props: IGlossarytip ) => void;
}
interface IState {
	tipData: IGlossarytip;
	autocompleteSearch: string;
	autocompletes: Array<{
		title: string;
		excerpt: string;
		id: number;
	}>;
}

const dataset = [
	{ title: 'apple', excerpt: 'A apple', id: 1 },
	{ title: 'banana', excerpt: 'A banana', id: 2 },
	{ title: 'pear', excerpt: 'A pear', id: 3 },
];
export class GlossarytipSection extends Component<IProps, IState> {
	public readonly state: IState = {
		tipData: { termId: 0, type: ETipType.Glossarytip },
		autocompleteSearch: '',
		autocompletes: dataset,
	};

	public constructor( public readonly props: IProps ) {
		super( props );
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
							style={{ background: isHighlighted ? 'lightgray' : 'white' }}>{item.title}</div>
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
		this.props.onChangeSpecializedTip( state.tipData );
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
			tipData: { ...this.state.tipData, termId },
		} );
	}

	private doSearch( search: string ) {
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
			autocompletes: dataset.filter( d => d.excerpt.toLowerCase().includes( search ) ||
				d.title.toLowerCase().includes( search ) ||
				d.id.toString().includes( search ) ),
		} );
	}
	private async ajaxFetch( maybeSearch?: string ) {
		const search = maybeSearch ? maybeSearch : this.state.autocompleteSearch;
		const matchingAjax = dataset.filter( d => d.excerpt.toLowerCase().includes( search ) ||
				d.title.toLowerCase().includes( search ) ||
				d.id.toString().includes( search ) );
		await new Promise<void>( res => setTimeout( res, 0 ) );
		this.setState( {
			...this.state,

			autocompletes: matchingAjax,
		},             this.filterResults );
	}
	private readonly ajaxFetchDebounced = debounce( this.ajaxFetch, 500 );
}
