/**
 * @see https://jbworld.com/customize-wordpress-text-editor/
 */
declare module '@wordpress/qtags'{
	class QTags{
		static addButton(
			id: string,
			display: string,
			startOrCb: string | (() => void),
			end?: string,
			accessKey?: string,
			title?: string,
			priority?: number,
			instance?: QTags): void
		static insertContent(content: string): void;
	}
	export default QTags;
}
