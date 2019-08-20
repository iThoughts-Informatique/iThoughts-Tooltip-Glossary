declare module '~editor-config'{
	import { Dictionary } from "underscore";
	
	import { ETipType } from "@ithoughts/tooltip-glossary/common";
	
	export const manifest: Dictionary<string | undefined>;
	export const shortcodeTags: {[key in ETipType]: string[]}
}
