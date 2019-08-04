declare module '@wordpress/shortcode' {
	import { Dictionary } from "underscore";
	
	type ShortcodeType = 'single' | 'closed' | 'self-closing';
	interface NextMatch {
		index: number;
		content: string;
		shortcode: Shortcode;
	}
	
	interface ShortcodeAttrs {
		named: Dictionary<string | undefined>;
		numeric: string[];
	}
	interface ShortcodeCtorParam {
		tag: string;
		content?: string;
		attrs: ShortcodeAttrs;
		type: ShortcodeType;
	}


	function shortcode(options: ShortcodeCtorParam): any;
	function next(tag: string, text: string, index?: number): NextMatch | undefined
	function stringFn(options: {
		tag: string;
		attrs: string | ShortcodeAttrs;
		formatAsSingle: boolean;
		content?: string;
	}): string;
	function replace(...args: any[]): any
	function regexp(...args: any[]): any
	function attrs(...args: any[]): any
	function fromMatch(...args: any[]): any
	
	export default class Shortcode {
		tag: string;
		attrs: ShortcodeAttrs;
		type: ShortcodeType;
		content: string | undefined;

		constructor(options: ShortcodeCtorParam);
		
		get(attr: string | number): string | undefined;
		set(attr: string | number, value: string): this;
		string(): string;
		public static readonly next: typeof next;
		public static readonly replace: typeof replace;
		public static readonly string: typeof stringFn;
		public static readonly regexp: typeof regexp;
		public static readonly attrs: typeof attrs;
		public static readonly fromMatch: typeof fromMatch;
	}
}
