import React from 'react';
import ReactModal from 'react-modal';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { AForm, IFormHandlers } from './a-form';
import './tip-form.scss';
import { ETipType } from './types';
import { mountForm } from './utils';

interface ITip {
	text: string;
	linkTarget?: string;
	type: ETipType;
}
interface IState {
	modalIsOpen: boolean;
	tip: ITip;
}
type Props = ITip & IFormHandlers<ITipFormOutput>;
export interface ITipFormOutput extends ITip {}

export class TipForm extends AForm<Props, IState, ITipFormOutput> {
	public readonly state: IState = {
		modalIsOpen: true,
		tip: {
			text: '',
			type: ETipType.Glossarytip,
		},
	};

	public constructor( props: Props ) {
		super( props );
		this.state = {
			...this.state,

			tip: {
				...this.state.tip,

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

	public get formData(): ITipFormOutput {
		return this.state.tip;
	}

	public static mount( props?: Props ) {
		return mountForm<TipForm, Props, IState, ITipFormOutput>( TipForm, props );
	}

	public discard() {
		this.setState( { ...this.state, modalIsOpen: false } );
		super.discard();
	}

	public submit() {
		this.setState( { ...this.state, modalIsOpen: false } );
		super.submit();
	}
	public render() {
		return <ReactModal
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

						<TabPanel></TabPanel>
						<TabPanel></TabPanel>
					</Tabs>
				</form>
				<button onClick={() => this.discard()}>Discard</button>
				<button onClick={() => this.submit()}>Submit</button>
			</section>
		</ReactModal>;
	}
}
