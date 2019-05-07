import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import { ensureArray } from '../../../utils';
import { AForm, IFormHandlers } from './a-form';

export const mountForm = <
	TForm extends AForm<TProps, TState, TOut>,
	TProps extends IFormHandlers<TOut>,
	TState,
	TOut
>( formCtor: {new( props: TProps ): TForm; appRoot: HTMLElement}, props?: TProps ) => {
	ReactModal.setAppElement( formCtor.appRoot );
	const form = React.createElement( formCtor, {
		...props,

		onClose: [...ensureArray( props ? props.onClose : [] ), () => {
			ReactDOM.unmountComponentAtNode( formCtor.appRoot );
		}],
	} as any );
	ReactDOM.render( form, formCtor.appRoot );
	return form;
};
