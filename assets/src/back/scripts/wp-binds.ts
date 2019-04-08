import { __ as ___ } from '@wordpress/i18n';
import { registerBlockType as registerBlockTypeWp, WPBlockSettings, WPBlockType, WPEditComponent, WPElement } from '@wordpress/blocks';
import { registerFormatType as registerFormatTypeWp, WPFormatSettings, WPFormatType, FormatProps } from '@wordpress/rich-text';

import { NAMESPACE } from "./settings";
import { debug } from "./logger";
import { omit } from 'underscore';

export const __ = ( text: string ): string =>___( text, NAMESPACE );
export const registerBlockType = <T>(name: string, opts: WPBlockSettings<T>): WPBlockType<T> => {
    debug(`Registering block type ${name}`, opts);
    return registerBlockTypeWp(`${NAMESPACE}/${name}`, opts);
}






type TOmit<T, K extends keyof T> =
    Pick<T, Exclude<keyof T, K>>;

export type TEditFormatFactory<A = {}, P extends FormatProps = FormatProps> =
    (title: string, formatName: string) => WPEditComponent<A, P>;
export interface IFormatOverloads<A, P extends FormatProps> extends TOmit<WPFormatSettings<A, P>, 'edit'> {
    editFactory: TEditFormatFactory<A, P>;
}
const transformFormatOverload = <A, P>(formatName: string, opts: IFormatOverloads<A, P>) => ({
    ...omit(opts, ['editFactory']),
    edit: opts.editFactory(opts.title, formatName),
})
export const registerFormatType = <A, P extends FormatProps>(
    name: string,
    opts: WPFormatSettings<A, P> | IFormatOverloads<A, P>
): WPFormatType<A, P> => {
    debug(`Registering format type ${name}`, opts);
    const formatName = `${NAMESPACE}/${name}`;
    const finalOpts = (((opts: any): opts is IFormatOverloads<A, P> => !!opts.editFactory)(opts)) ?
        transformFormatOverload(formatName, opts) :
        opts;
    const editElement = ((opts: any): opts is IFormatOverloads<A, P> => !!opts.editFactory)(opts) ?
        opts.editFactory(opts.title, formatName) :
        opts.edit;
    return registerFormatTypeWp(formatName, finalOpts);
}
