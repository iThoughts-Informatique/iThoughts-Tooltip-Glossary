import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import { ensureArray } from '@ithoughts/tooltip-glossary/back/common';

import { AForm, IFormHandlers } from './a-form';

export const mountForm = <
	TForm extends AForm<TProps, TState, TOut>,
	TProps extends IFormHandlers<TOut>,
	TState,
	TOut
>( formCtor: {new( props: TProps ): TForm; appRoot: HTMLElement}, props?: TProps ) => {
	const root = formCtor.appRoot;
	ReactModal.setAppElement( root );
	const form = React.createElement( formCtor, {
		...props,

		onClose: [...ensureArray( props ? props.onClose : [] ), () => {
			ReactDOM.unmountComponentAtNode( root );
		}],
	} as any );
	ReactDOM.render( form, root );
	return form;
};
