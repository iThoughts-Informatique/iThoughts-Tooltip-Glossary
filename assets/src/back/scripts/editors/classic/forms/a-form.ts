import $ from 'jquery';
import { Component, ComponentClass } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import { ns } from '../../../settings';

export abstract class AForm<P, S> extends Component<P, S>{
	protected static appRootId = `${ns( 'form-container', '-' )}`;
	protected static appRoot = $( $.parseHTML( `<div id="${AForm.appRootId}"></div>` )[0] as HTMLElement )
		.appendTo( document.body ).get( 0 );

	public static selfMount<T extends ComponentClass<P, S> & typeof AForm, P extends {}, S extends {}>( this: T, props?: P ): JSX.Element {
		ReactModal.setAppElement( this.appRoot );
		const form = React.createElement( this, props );
		ReactDOM.render( form, AForm.appRoot );
		return form;
	}
}
