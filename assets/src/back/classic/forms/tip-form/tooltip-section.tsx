import { Component } from 'react';
import React from 'react';
import { Editor, init } from 'tinymce';
import { isString } from 'underscore';

import { uuid } from '@ithoughts/tooltip-glossary/back/common';

import { ITip } from '../tip-form';
import { ETipType } from '../types';

export interface ITooltip {
	type: ETipType.Tooltip;
	content: string;
}
export const TOOLTIP_KEYS = ['content'];

export const isTooltip = ( props: any ): props is ITooltip =>
	props.type === ETipType.Tooltip && isString( ( props as any as ITooltip ).content );

interface IProps {
	onChangeSpecializedTip: ( props: ITooltip, placeholder?: string ) => void;
}

export const tooltipValidationMessage = ( tip: ITip & ( ITooltip | {} ) ) => {
	if ( !( tip as any ).content ||  ( tip as any ).content === '<p></p>' ) {
		return 'Please enter a tip content';
	}
};
export class TooltipSection extends Component<IProps, ITooltip> {
	private tinymce?: Editor;

	public readonly state: ITooltip = { content: '', type: ETipType.Tooltip };

	public constructor( public readonly props: IProps ) {
		super( props );
	}

	public render() {
		return <fieldset>
			<label htmlFor='tip-content'>Tooltip content</label>
			<div>
				<textarea
					ref={ e => this.initTinyMce( e ) }
					id='tip-content'
					className='form-field'></textarea>
			</div>
		</fieldset>;
	}

	public componentWillUnmount() {
		if ( this.tinymce ) {
			this.tinymce.destroy();
		}
	}

	public setState( state: ITooltip ) {
		super.setState( state );
		this.props.onChangeSpecializedTip( this.state );
	}

	private initTinyMce( element: HTMLElement | null ) {
		if ( !element ) {
			return;
		}

		if ( !element.id ) {
			element.id = uuid( 'tinymce' );
		}
		init( {
			selector:         `#${ element.id }`,
			menubar:          false,
			/*external_plugins: {
				code:      `${ itge.base_tinymce  }/code/plugin.min.js`,
				wordcount: `${ itge.base_tinymce  }/wordcount/plugin.min.js`,
			},*/
			plugins: 'wplink',
			toolbar: [
				'styleselect | bold italic underline link | bullist numlist | alignleft aligncenter alignright alignjustify | code',
			],
			min_height: 70,
			height:     70,
			resize:     false,

			setup: ed => {
				this.tinymce = ed;
				ed.on( 'change', () => {
					this.setState( { ...this.state, content: ed.getContent() } );
				} );
			},
		} );
	}
}
