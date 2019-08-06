import { ETipType } from '@ithoughts/tooltip-glossary/common';

import { ITip, TipForm, TipFormOutput, TipFormProps } from '../../forms';
import { AShortcode } from './a-shortcode';
import { IInOutShortcodeTransforms, IShortcodeTypeDescriptor, ShortcodeFactory, ShortcodeType } from './shortcode-type';

export interface IInOutShortcodeFormTransforms<TShortcode extends AShortcode> {
	from: ( this: ShortcodeTypeTip<TShortcode>, shortcode: TShortcode | undefined ) => TipFormProps | ITip;
	to: ( this: ShortcodeTypeTip<TShortcode>, formOutput: TipFormOutput ) => TShortcode;
}

export class ShortcodeTypeTip<TShortcode extends AShortcode> extends ShortcodeType<TShortcode> {
	public constructor(
		public readonly type: ETipType,
		desc: Partial<IShortcodeTypeDescriptor>,
		factory: ShortcodeFactory<TShortcode>,
		private readonly formTransforms: IInOutShortcodeFormTransforms<TShortcode>,
		shortcodeTransforms: Partial<IInOutShortcodeTransforms> = { from: [], to: [] },
	) {
		super( type, desc, factory, shortcodeTransforms );
	}

	public async doPromptForm( shortcode?: TShortcode ): Promise<TShortcode | undefined> {
		const props = this.formTransforms.from.call( this, shortcode );
		console.log({props})
		const out = await new Promise<TipFormOutput | undefined>( ( res, rej ) => {
			const form = TipForm.mount( {
				...props,

				onClose: ( isSubmit: boolean, data?: TipFormOutput ) => {
					if ( !isSubmit ) {
						return res( undefined );
					} else if ( data ) {
						return res( data );
					}
				},
			} );
		} );

		if ( !out ) {
			return undefined;
		} else {
			return this.formTransforms.to.call( this, out );
		}
	}
}
