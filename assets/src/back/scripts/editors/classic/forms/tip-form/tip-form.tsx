import autobind from 'autobind-decorator';
import React from 'react';
import ReactModal from 'react-modal';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { pick } from 'underscore';
import { AForm, IFormHandlers } from '../a-form';
import { ETipType } from '../types';
import { mountForm } from '../utils';
import { GLOSSARYTIP_KEYS, GlossarytipSection, IGlossarytip, isGlossarytip } from './glossarytip-section';
import './tip-form.scss';
import { isTooltip, ITooltip, TOOLTIP_KEYS, TooltipSection } from './tooltip-section';

export interface ITip {
	text: string;
	linkTarget?: string;
	type: ETipType;
}
const TIP_KEYS = ['type', 'text', 'linkTarget'];

export type TipFormOutput = ITip & ( ITooltip | IGlossarytip );
type Props = IFormHandlers<TipFormOutput> & TipFormOutput;

interface IState {
	modalIsOpen: boolean;
	tip: ITip | TipFormOutput;
}

export class TipForm extends AForm<Props, IState, TipFormOutput> {
	public readonly state: IState;

	private readonly tooltipSectionRef = React.createRef<TooltipSection>();
	private readonly glossarytipSectionRef = React.createRef<GlossarytipSection>();

	public constructor( props: Props ) {
		super( props );
		this.state = {
			modalIsOpen: true,

			tip: {
				...{
					text: '',
					type: ETipType.Glossarytip,
				},

				linkTarget: props.linkTarget,
				text: props.text,
				type: props.type,
			},
		};
	}

	private get linkTargetPlaceholder() {
		if ( this.state.tip.type === ETipType.Tooltip ) {
			return '#';
		}
		return 'javascript:void';
	}

	public get formData(): TipFormOutput {
		if ( isGlossarytip( this.state.tip ) ) {
			return pick( this.state.tip, TIP_KEYS.concat( GLOSSARYTIP_KEYS ) ) as ITip & IGlossarytip;
		} else if ( isTooltip( this.state.tip ) ) {
			return pick( this.state.tip, TIP_KEYS.concat( TOOLTIP_KEYS ) ) as ITip & ITooltip;
		} else {
			throw new Error();
		}
	}

	public static mount( props?: Props ) {
		return mountForm<TipForm, Props, IState, TipFormOutput>( TipForm, props );
	}

	public discard() {
		this.setState( { ...this.state, modalIsOpen: false } );
		super.discard();
	}

	public submit() {
		this.setState( { ...this.state, modalIsOpen: false } );
		super.submit();
	}

	@autobind
	private changeSpecializedTooltipInfos( specializedProps: ITooltip | IGlossarytip ) {
		this.setState( { ...this.state, tip: {
			...this.state.tip,

			...specializedProps,
		} } );
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
								placeholder={this.linkTargetPlaceholder}
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
						defaultIndex={this.state.tip.type}
						onSelect={idx => void ( this.state.tip.type = idx )}>
						<TabList className='tabs-header'>
							<Tab>Glossary tip</Tab>
							<Tab>Tooltip</Tab>
						</TabList>

						<TabPanel>
							<fieldset>
								<label htmlFor='glossary-term'></label>
								<div>
									<input
										type='text'
										id='glossary-term'
										className='form-field'/>
								</div>
							</fieldset>
						</TabPanel>
						<TabPanel>
							<TooltipSection onChangeSpecializedTip={this.changeSpecializedTooltipInfos}/>
						</TabPanel>
					</Tabs>
				</form>
				<button onClick={() => this.discard()}>Discard</button>
				<button onClick={() => this.submit()}>Submit</button>
			</section>
		</ReactModal>;

		return modal;
	}
}
