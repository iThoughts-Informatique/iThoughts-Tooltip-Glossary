// Type definitions for @wordpress/blocks 6.0.4
// Project: https://github.com/WordPress/gutenberg
// Definitions by: Daniel Mejta <https://github.com/mejta>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


// See: https://github.com/mejta/DefinitelyTyped/blob/master/types/wordpress__blocks/index.d.ts

declare module '@wordpress/blocks'{
    import * as React from 'react';

    export interface WPElement extends JSX.Element {}
    export interface WPComponent<P = any> extends React.Component<P> {}

    export interface WPBlockAttributeSettings {
        readonly type: 'string' | 'array' | 'boolean';
        readonly source?: 'attribute' | 'text' | 'html' | 'query' | 'meta' | 'children';
        readonly selector?: string;
        readonly attribute?: string;
        readonly multiline?: string;
        readonly query?: WPBlockAttributesSettings;
        readonly meta?: string;
        readonly default?: any;
    }

    export interface WPBlockAttributesSettings {
        readonly [attribute: string]: WPBlockAttributeSettings;
    }

    export interface WPEditComponentProps<A> {
        readonly attributes: A;
        readonly setAttributes: (attributes: Partial<A>) => void;
        readonly isSelected: boolean;
        readonly className: string;
        readonly insertBlocksAfter?: Function;
    }

    export type WPEditComponent<A = {}, P = {}> = React.ComponentType<WPEditComponentProps<A> & P>;

    export interface WPSaveComponentProps<A> {
        readonly attributes: A;
        readonly className: string;
    }

    export type WPSaveComponent<A = {}> = React.ComponentType<WPSaveComponentProps<A>>;

    export type WPBlockSettings<A, P = {}> = {
        readonly title: string,
        readonly description?: string,
        readonly category: string,
        readonly icon?: string | WPElement | {
            background: string,
            foreground: string,
            src: string | WPElement,
        },
        readonly keywords?: string[],
        readonly styles?: {
            name: string,
            label: string,
            isDefault?: boolean,
        }[],
        readonly attributes?: WPBlockAttributesSettings,
        readonly transforms?: {
            from: any[],
            to: any[],
        },
        readonly parent?: string[],
        readonly supports?: {
            align?: boolean | ('left' | 'right' | 'full')[] | {
                type: string,
                default: 'left' | 'right' | 'full',
            },
            alignWide?: boolean,
            anchor?: boolean,
            customClassName?: boolean,
            className?: boolean,
            html?: boolean,
            inserter?: boolean,
            multiple?: boolean,
            reusable?: boolean,
        },
        readonly save: WPSaveComponent<A>,
        readonly edit: WPEditComponent<A, P>,
        readonly deprecated?: {
            attributes: WPBlockAttributesSettings,
            save?: WPSaveComponent<A>,
            migrate?: (attributes: A, innerBlocks: WPBlockType) => A,
        }[],
    };

    export type WPBlockType<A = any> = WPBlockSettings<A> & {
        readonly name: string,
        readonly attributes: {
            [attribute: string]: any,
        },
    };

    export function registerBlockType<A, P>(name: string, settings: WPBlockSettings<A, P>): WPBlockType<A> | null;

    export function registerBlockStyle(name: string, settings: {
        name: string,
        label: string,
        isDefault?: boolean,
    }): void;
}
