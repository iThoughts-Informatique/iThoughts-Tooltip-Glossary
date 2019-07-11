import { isNumber, isString } from 'underscore';

export interface IGlossarytip {
	type: ETipType.Glossarytip;
	termId: number;
}
export const isGlossarytip = ( props: any ): props is IGlossarytip =>
	props.type === ETipType.Glossarytip && isNumber( ( props as any as IGlossarytip ).termId );


export interface ITooltip {
	type: ETipType.Tooltip;
	content: string;
}
export const isTooltip = ( props: any ): props is ITooltip =>
	props.type === ETipType.Tooltip && isString( ( props as any as ITooltip ).content );


export enum ETipType {
	Glossarytip = 'Glossarytip',
	Tooltip = 'Tooltip',
}
