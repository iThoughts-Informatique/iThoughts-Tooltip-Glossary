import { WPEditComponent } from "@wordpress/blocks";
import { RichTextToolbarButton } from "@wordpress/editor";
import { Dictionary } from "underscore";
import { toggleFormat, insertObject, create } from "@wordpress/rich-text";
import { TEditFormatFactory } from "../../../wp-binds";


interface WPEditFormatProps{
    readonly activeAttributes: Dictionary<any>;
    readonly isActive: boolean;
    readonly key?: any
    readonly onChange: Function
    readonly value: {
        readonly end: any
        readonly formats: any[]
        readonly start: any
        readonly text: string
    }
}

export const makeGlossaryTipEdit: TEditFormatFactory = ( title, formatName ) => ( props ) =>  {
	const onClick = () => {
        console.log( 'toggle format', formatName, props );
        props.onChange( toggleFormat(
            props.value,
            { type: formatName, attributes: {foo: 'bar'} }
        ) );
        props.onChange( insertObject(
            props.value,
            create('<sup>Hello World</sup>'),
            props.value.end
        ));
	};
	return <RichTextToolbarButton icon='editor-code' title={ title } onClick={ onClick }></RichTextToolbarButton>
}
