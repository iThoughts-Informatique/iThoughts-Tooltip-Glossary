import { Editor, ui } from 'tinymce';
type Control = ui.Control;

import { iconSvg, ns } from '@ithoughts/tooltip-glossary/back/common';
import { camelCaseToDashCase, ETipType, ITag, parseHtmlElement } from '@ithoughts/tooltip-glossary/common';
import { getClosestTipParent } from './utils';

interface IButtonsOptions {
	image: string;
	title: string;
	cmd?: string;
	onPostRender?( button: ui.Control ): void;
	onClick?(): void;
}
interface INodeChangeEvent {
	element: HTMLElement;
}
interface ITipChangeEvent extends INodeChangeEvent {
	parentTip?: HTMLElement;
	parentTipData?: ITag;
}

interface ICustomButtonsOptions extends IButtonsOptions {
	onTipChange?( button: ui.Control, { element, parentTip }: ITipChangeEvent ): void;
	onNodeChange?( button: ui.Control, { element }: INodeChangeEvent ): void;
}

/**
 * Register asynchronously a single button. The only way to retrieve the actual UI control associated with the button is to bind the `onPostRender`
 * lifecycke event, which is called with the control as `this` context.
 *
 * @param editor     - The editor to create the button into.
 * @param identifier - The name of the button (it will be namespaced).
 * @param options    - Options of the button.
 */
const registerButton = ( editor: Editor, identifier: string, options: ICustomButtonsOptions ) =>
	new Promise<Control>( resolve => {
		const { onTipChange, onNodeChange, onClick, cmd, ...addButtonOptions } = options;

		editor.addButton( ns( identifier ), {
			...addButtonOptions,

			cmd: cmd ? ns( cmd ) : undefined,

			onclick: onClick,
			onPostRender( this: Control ) {
				if ( options.onPostRender ) {
					options.onPostRender( this );
				}
				if ( onTipChange ) {
					// tslint:disable-next-line: no-inferred-empty-object-type
					editor.on( 'TipChange', args => onTipChange( this, args ) );
				}
				if ( onNodeChange ) {
					// tslint:disable-next-line: no-inferred-empty-object-type
					editor.on( 'NodeChange', args => onNodeChange( this, args ) );
				}
				return resolve( this );
			},
		} );
	} );

export const registerButtons = async ( editor: Editor ) => {
	const buttons = {
			// Add a button that opens a window for glossarytip
			addGlossarytip: {
				image: iconSvg,
				title: 'Add a glossary tip',

				cmd: 'open-glossarytip-form',
				onTipChange: ( button: ui.Control, { parentTipData }: ITipChangeEvent ) => {
					button.disabled( parentTipData && parentTipData.attributes ? parentTipData.attributes.type !== ETipType.Glossarytip : false );
				},
			},
			// Add a button that opens a window for tooltip
			addTooltip: {
				image: iconSvg,
				title: 'Add a tooltip',

				cmd: 'open-tooltip-form',
				onTipChange: ( button: ui.Control, { parentTipData }: ITipChangeEvent ) => {
					button.disabled( parentTipData && parentTipData.attributes ? parentTipData.attributes.type !== ETipType.Tooltip : false );
				},
			},
			// Add the tip delete button
			removeTip: {
				image: iconSvg,
				title: 'Remove a tip',

				onClick: () => {
					console.log( 'triggered' );
				},
				onTipChange: ( button: ui.Control, { parentTip }: ITipChangeEvent ) => {
					button.disabled( !parentTip );
				},
			},

			// Add a button for lists
			addList: {
				image: iconSvg,
				title: 'Add a glossary list',

				onClick: () => {
					console.log( 'triggered' );
				},
			},
	 };

	const createdButtons = await Promise.all( Object.entries( buttons ).map( async ( [name, options]: [string, ICustomButtonsOptions] ) => ( {
		name,
		options,

		button: await registerButton( editor, camelCaseToDashCase( name ), options ),
	} ) ) );

	// TipChange event
	let prevParentTip: HTMLElement | undefined;
	// tslint:disable-next-line: no-inferred-empty-object-type
	editor.on( 'NodeChange', ( params: {element: HTMLElement} ) => {
		const parentTip = getClosestTipParent( params.element );
		if ( prevParentTip === parentTip ) {
			return;
		}
		prevParentTip = parentTip || undefined;
		// tslint:disable-next-line: no-inferred-empty-object-type
		editor.fire( 'TipChange', { ...params, parentTip, parentTipData: parentTip ? parseHtmlElement( parentTip ) : undefined } );
	} );

	// Return new buttons dictionary
	return Object.fromEntries( createdButtons
		.map( createdButton => [createdButton.name, createdButton.button] ) ) as any as {[key in keyof typeof buttons]: ui.Control};
};
