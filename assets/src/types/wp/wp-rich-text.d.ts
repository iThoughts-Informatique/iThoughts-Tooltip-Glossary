declare module '@wordpress/rich-text'{
    import { WPElement, WPEditComponent } from "@wordpress/blocks";

    type FormatArea = {
        readonly text: string;
        readonly formats: string[];
        readonly replacements: any[];
        readonly start?: number;
        readonly end?: number;
    };
    type FormatProps = {
        readonly value: FormatArea;
        readonly onChange?: Function;
    }

    export type WPFormatSettings<A, P extends FormatProps> = {
        readonly title: string,
        readonly className: string | null;
        readonly tagName: string,
        readonly description?: string,
        readonly icon?: string | WPElement | {
            readonly background: string,
            readonly foreground: string,
            readonly src: string | WPElement,
        },
        readonly keywords?: string[],
        readonly parent?: string[],
        readonly edit: WPEditComponent<A, P>,
    };

    export type WPFormatType<A, P extends FormatProps> = WPFormatSettings<A, P> & {
        readonly name: string,
        readonly attributes: {
            [attribute: string]: any,
        },
    };

    export function registerFormatType<A, P extends FormatProps>(
        name: string,
        settings: WPFormatSettings<A, P>
    ): WPFormatType<A, P> | null;

    export type Format = {
        /**
         * The name of the format to toggle
         */
        readonly type: string
    };
    export function toggleFormat(area: FormatArea, format: Format): () => void;
    export function insert(area: FormatArea, valueToInsert: string | Object, startIndex?: number, endIndex?: number): any;
}
