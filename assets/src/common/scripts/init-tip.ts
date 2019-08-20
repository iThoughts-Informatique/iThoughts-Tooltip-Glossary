import tippy, { Options } from 'tippy.js';
import { isString } from 'underscore';

import { parseHtmlElement } from './dom-object';
import { glossaryTermRepository } from './models';
import { unescapeAttr } from './string-escaping';
import { ETipType, isGlossarytip, isTooltip } from './types';

export const initTip = ( element: HTMLAnchorElement, container: 'parent' | Element = 'parent', inEditor = false ) => {
	console.log( 'Init tip', element, container, inEditor );
	const { attributes: tipDesc } = parseHtmlElement( element );

	if ( !tipDesc ) {
		throw new Error( 'Tip has no attributes to parse' );
	}
	const type = tipDesc.tipType;
	if ( !isString( type ) ) {
		// tslint:disable-next-line: no-console
		console.warn( 'Tip desc has no type', element );
		return;
	}
	tipDesc.type = ETipType[type as any];

	const baseTippyOpts: Options = {
		animateFill: false,
		animation: 'fade' as const,
		appendTo: container,
		flipOnUpdate: true,
		interactive: !inEditor,
		sticky: false,
		onTrigger() {
			console.log( 'onTrigger', { this: this, arguments } );
		},
	};
	element.addEventListener( 'mouseenter', () => console.log( 'mouseenter', element ) );
	if ( isGlossarytip( tipDesc ) ) {
		console.log( 'Init glossarytip', tipDesc );
		tippy( element, {
			...baseTippyOpts,

			content: 'Loading...',
			onShow( instance ) {
				( async () => {
					const repository = await glossaryTermRepository.val;
					const item = await repository.getById( tipDesc.termId );
					// Update the tippy content with the term
					instance.setContent( `<h3>${item.title}</h3><div>${item.content}</div>` );
				} )()
				.catch( e => console.error( e ) );
			},
		} );
	} else if ( isTooltip( tipDesc ) ) {
		console.log( 'Init tooltip', tipDesc );
		tippy( element, {
			...baseTippyOpts,

			content: unescapeAttr( tipDesc.content ),
		} );
	} else {
		// tslint:disable-next-line: no-console
		console.warn( 'Unknown tip', tipDesc );
	}
};
