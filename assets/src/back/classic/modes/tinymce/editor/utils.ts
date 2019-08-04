import { Editor } from 'tinymce';

import { CSS_NAMESPACE } from '@ithoughts/tooltip-glossary/back/common';

export function getEditorTip( editor: Editor ): HTMLAnchorElement[];
export function getEditorTip( editor: Editor, uuid: string ): HTMLAnchorElement;
export function getEditorTip( editor: Editor, uuid?: string ): HTMLAnchorElement | HTMLAnchorElement[] {
	( window as any ).itg_editor = editor;
	const selector = uuid ? `a[data-tip-uuid="${uuid}"]` : 'a[data-tip-uuid]';
	const tips = editor.getBody().querySelectorAll<HTMLAnchorElement>( selector );
	if ( uuid ) {
		return tips[0];
	} else {
		return Array.from( tips );
	}
}

export const baseTipClass = `${CSS_NAMESPACE}-tip`;
export const getClosestTipParent = ( element: HTMLElement | null | undefined ): HTMLElement | null => {
	while ( element && !element.classList.contains( baseTipClass ) ) {
		element = element.parentElement;
	}
	return element || null;
};
// Try to find the closest tip
export const getEditorTipUnderCursor = ( editor: Editor ): HTMLElement | null =>
	getClosestTipParent( editor.selection.getRng( true ).commonAncestorContainer.parentElement );
