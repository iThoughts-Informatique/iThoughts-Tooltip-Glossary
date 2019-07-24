import { ITag } from '@ithoughts/tooltip-glossary/common';

import { EShortcodeFormat, IShortcodeSearchResult, ShortcodeType } from './shortcode-type';

export class EditorDocumentType {
	public constructor( protected readonly shortcodeTypes: ShortcodeType[] ) {}

	public convert( content: string, formatFrom: EShortcodeFormat, formatTo: EShortcodeFormat ): string {
		const allShortcodes = this.shortcodeTypes
			.flatMap( type => type.getAllShortcodes( content, formatFrom, formatTo ) )
			.sort( ( a, b ) => a.start - b.start );
		const results = allShortcodes
			.reduce( ( { newContent, previousShortcode }, shortcode ) => {
				const junction = content.slice( previousShortcode ? previousShortcode.end : 0, shortcode.start );
				return {
					newContent: newContent + junction + shortcode.tag.toString(),
					previousShortcode: shortcode,
				};
			},       { newContent: '' } as {newContent: string; previousShortcode?: IShortcodeSearchResult<ITag>} );
		const tail = content.slice( results.previousShortcode ? results.previousShortcode.end : 0 );
		return results.newContent + tail;
	}
}
