import { Component } from 'react';

import { ETipType } from '../types';
import { isNumber } from 'underscore';

export interface IGlossarytip {
	type: ETipType.Glossarytip;
	termId: number;
}
export const GLOSSARYTIP_KEYS = ['termId'];

export const isGlossarytip = ( props: any ): props is IGlossarytip =>
	props.type === ETipType.Glossarytip && isNumber( ( props as any as IGlossarytip ).termId );

export class GlossarytipSection extends Component<{}, {}> {

}
