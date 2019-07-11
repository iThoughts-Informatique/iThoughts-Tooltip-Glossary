import autobind from 'autobind-decorator';
import React from 'react';
import ReactModal from 'react-modal';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { pick } from 'underscore';

import { Omit } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType, IGlossarytip, isGlossarytip, isTooltip, ITooltip } from '@ithoughts/tooltip-glossary/common';

import { AForm, IFormHandlers } from '../a-form';
import { mountForm } from '../utils';
import { GLOSSARYTIP_KEYS, GlossarytipSection, glossarytipValidationMessage } from './glossarytip-section';
import './tip-form.scss';
import { TOOLTIP_KEYS, TooltipSection, tooltipValidationMessage } from './tooltip-section';

export interface ITip {
	text: string;
	linkTarget?: string;
	type: ETipType;
}
const TIP_KEYS = ['type', 'text', 'linkTarget'];

export type TipFormOutput = ( ITip & {linkTarget: string} ) & ( ITooltip | IGlossarytip );
export type TipFormProps = IFormHandlers<TipFormOutput> & ( TipFormOutput | ITip );

interface IState {
	linkTargetPlaceholder: string;
	modalIsOpen: boolean;
	tip: ITip | TipFormOutput;
}

const tipTypeTabs: {[key in ETipType]: number} = {
	[ETipType.Glossarytip]: 0,
	[ETipType.Tooltip]: 1,
};

export class TipForm extends AForm<TipFormProps, IState, TipFormOutput> {
	public readonly state: IState;

	public constructor( props: TipFormProps ) {
		super( props );

		// Filter out link if it is equal to the default option, and let the placeholder be used.
		const linkTargetPlaceholder = this.getDefaultModeLinkPlaceholder( props.type );
		if ( props.linkTarget === linkTargetPlaceholder ) {
			props = { ...props, linkTarget: undefined };
		}

		this.state = {
			linkTargetPlaceholder,
			modalIsOpen: true,

			tip: props,
		};
	}

	private get isValid() {
		return typeof this.validationMessage === 'undefined';
	}

	private get validationMessage() {
		const data = this.state.tip;
		if ( !data.text || data.text.length === 0 ) {
			return 'Please enter a tip link text';
		}
		if ( data.type === ETipType.Glossarytip ) {
			return glossarytipValidationMessage( data );
		}
		if ( data.type === ETipType.Tooltip ) {
			return tooltipValidationMessage( data );
		}
		return undefined;
	}

	private get formDataNoDefault(): ( Omit<ITip & IGlossarytip, 'linkTarget'> | Omit<ITip & ITooltip, 'linkTarget'> ) & {linkTarget?: string} {
		if ( isGlossarytip( this.state.tip ) ) {
			return pick( this.state.tip, TIP_KEYS.concat( GLOSSARYTIP_KEYS ) as any ) as ITip & IGlossarytip;
		} else if ( isTooltip( this.state.tip ) ) {
			return pick( this.state.tip, TIP_KEYS.concat( TOOLTIP_KEYS ) as any ) as ITip & ITooltip;
		} else {
			throw new Error();
		}
	}

	public get formData(): TipFormOutput {
		return {
			...this.formDataNoDefault,

			linkTarget: this.formDataNoDefault.linkTarget || this.state.linkTargetPlaceholder,
		};
	}

	public static mount( props?: TipFormProps ) {
		return mountForm<TipForm, TipFormProps, IState, TipFormOutput>( TipForm, props );
	}

	public discard() {
		this.setState( { ...this.state, modalIsOpen: false } );
		super.discard();
	}

	public submit() {
		this.setState( { ...this.state, modalIsOpen: false } );
		super.submit();
	}

	private getDefaultModeLinkPlaceholder( mode: ETipType ) {
		return mode === ETipType.Tooltip ? '#' : 'Link to term'; // TODO link to term
	}

	@autobind
	private setMode( tabIndex: number ) {
		const modePair = Object.entries( tipTypeTabs ).find( ( [type, tab] ) => tab === tabIndex );
		if ( !modePair ) {
			throw new RangeError( `Unexpected tab index ${tabIndex}` );
		}
		const mode: ETipType = modePair[0] as any;
		this.setState( {
			...this.state,
			linkTargetPlaceholder: this.getDefaultModeLinkPlaceholder( mode ),
			tip: {
				...this.state.tip,
				type: mode,
			},
		} );
	}

	@autobind
	private changeSpecializedTooltipInfos( specializedProps: ITooltip | IGlossarytip, linkTargetPlaceholder?: string ) {
		this.setState( {
			...this.state,

			linkTargetPlaceholder: typeof linkTargetPlaceholder === 'string' ? linkTargetPlaceholder : this.state.linkTargetPlaceholder,
			tip: {
				...this.state.tip,

				...specializedProps,
			},
		} );
	}

	public render() {
		const modal = <ReactModal
			isOpen={this.state.modalIsOpen}
			parentSelector={() => AForm.appRoot}
			overlayClassName='modal-backdrop'
			className='modal'
			contentLabel='Tip form'>
			<header><h2>Create a tip</h2></header>
			<section>
				<form>
					<fieldset>
						<label htmlFor='text'>Trigger text</label>
						<div>
							<input
								type='text'
								id='text'
								className='form-field'
								value={this.state.tip.text}
								onChange={e => this.setState( {
									...this.state,

									tip: {
										...this.state.tip,

										text: e.target.value,
									},
								} )}/>
						</div>
					</fieldset>
					<fieldset>
						<label htmlFor='text'>Link target</label>
						<div>
							<input
								type='text'
								id='text'
								className='form-field'
								placeholder={this.state.linkTargetPlaceholder}
								value={this.state.tip.linkTarget}
								onChange={e => this.setState( {
									...this.state,

									tip: {
										...this.state.tip,

										linkTarget: e.target.value ? e.target.value : undefined,
									},
								} )}/>
						</div>
					</fieldset>
					<Tabs
						className='tabs-container'
						selectedTabClassName='active'
						selectedTabPanelClassName='active'
						defaultIndex={tipTypeTabs[this.state.tip.type]}
						onSelect={this.setMode}>
						<TabList className='tabs-header'>
							<Tab>Glossary tip</Tab>
							<Tab>Tooltip</Tab>
						</TabList>

						<TabPanel>
							<GlossarytipSection
								tip={this.state.tip}
								onChangeSpecializedTip={this.changeSpecializedTooltipInfos}/>
						</TabPanel>
						<TabPanel>
							<TooltipSection
								tip={this.state.tip}
								onChangeSpecializedTip={this.changeSpecializedTooltipInfos}/>
						</TabPanel>
					</Tabs>
				</form>
				<button onClick={() => this.discard()}>Discard</button>
				<button onClick={() => this.submit()} disabled={!this.isValid} title={this.validationMessage}>Submit</button>
			</section>
		</ReactModal>;

		return modal;
	}
}
