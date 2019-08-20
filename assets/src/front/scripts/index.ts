import { initTip } from '@ithoughts/tooltip-glossary/common';

document.addEventListener( 'DOMContentLoaded', () => {
	Array.from( document.querySelectorAll<HTMLAnchorElement>( 'a.itg-tip' ) ).forEach( node => {
		initTip( node );
	} );
} );
