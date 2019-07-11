import { Editor } from 'tinymce';

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
