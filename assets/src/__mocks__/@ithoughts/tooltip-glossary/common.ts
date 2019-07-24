import {
	camelCaseToDashCase as _camelCaseToDashCase,
	dashCaseToCamelCase as _dashCaseToCamelCase,
	ITag,
	strToAttrVal as _strToAttrVal,
} from '../../../common';

export const makeHtmlElement = jest.fn( () => document.createElement( 'div' ) );
export const parseHtmlElement = jest.fn( () => ( { tag: '', attributes: {}, content: '' } as ITag ) );
export const dashCaseToCamelCase = jest.fn( _dashCaseToCamelCase );
export const camelCaseToDashCase = jest.fn( _camelCaseToDashCase );
export const strToAttrVal = jest.fn( _strToAttrVal );
export { ETipType } from '../../../common';
