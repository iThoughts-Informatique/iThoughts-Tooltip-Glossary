// Type definitions for @wordpress/editor 9.0.6
// Project: https://github.com/WordPress/gutenberg
// Definitions by: Daniel Mejta <https://github.com/mejta>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// https://raw.githubusercontent.com/mejta/DefinitelyTyped/e0bb9a457bf1be4de760dad326e1c35e4b3c2bee/types/wordpress__editor/index.d.ts

declare module '@wordpress/editor'{
    import * as React from 'react';
    


    export interface RichTextToolbarButtonProps {
        readonly icon: string;
        readonly title: string;
        readonly onClick?: Function;
    }
    export class RichTextToolbarButton extends React.Component<RichTextToolbarButtonProps> {}


    export interface AlignmentToolbarProps {
        value: string;
        onChange: Function;
    }
    class AlignmentToolbar extends React.Component<AlignmentToolbarProps> {}
    export interface RichTextProps {
        readonly value: string;
        readonly onChange: (value: string) => void;
        readonly tagName?: string;
        readonly placeholder?: string;
        readonly multiline?: boolean | string;
        readonly onReplace?: (blocks: any[]) => void;
        readonly onMerge?: (forward: boolean) => void;
        readonly onRemove?: (forward: boolean) => void;
        readonly formattingControls?: ('bold' | 'italic' | 'strikethrough' | 'link')[];
        readonly isSelected?: boolean;
        readonly keepPlaceholderOnFocus?: boolean;
        readonly autocompleters?: any[];
        readonly className?: string;

        readonly style?: {[key: string]: any};
    }
    
    class RichText extends React.Component<RichTextProps> {
        static readonly Content: React.ComponentType<RichTextProps>;
    }
    
    class MediaUploadCheck extends React.Component {}
    
    export interface MediaUploadProps {
        readonly allowedTypes?: string[];
        readonly multiple?: boolean;
        readonly value?: number | number[];
        readonly onSelect: Function;
        readonly title?: string;
        readonly modalClass?: string;
        readonly render: (props: { open: Function }) => JSX.Element | JSX.Element[];
    }
    
    class MediaUpload extends React.Component<MediaUploadProps> {}
    
    class BlockControls extends React.Component {}
    
    export interface InnerBlocksProps {
        readonly allowedBlocks?: string[];
        readonly template?: any[][];
        readonly templateInsertUpdatesSelection?: boolean;
        readonly templateLock?: string | boolean;
    }
    
    class InnerBlocks extends React.Component<InnerBlocksProps> {
        static readonly Content: React.ComponentType;
    }
    
    export interface URLInputProps {
        readonly value: string;
        readonly onChange: (url: string, post?: any) => void;
        readonly autofocus?: boolean;
    }
    
    class URLInput extends React.Component<URLInputProps> {}
    
    export interface URLInputButtonProps {
        readonly url: string;
        readonly onChange: (url: string, post?: any) => void;
    }
    
    class URLInputButton extends React.Component<URLInputButtonProps> {}

    
    export interface PlainTextProps {
        readonly value: string;
        readonly onChange: Function;
        readonly className?: string;
        readonly [prop: string]: any;
    }
    
    class PlainText extends React.Component<PlainTextProps> {}
    
    export interface BlockAlignmentToolbarProps {
        isCollapsed?: boolean;
        value: string;
        onChange: Function;
        controls?: string[];
        wideControlsEnabled?: boolean;
    }
    
    class BlockAlignmentToolbar extends React.Component<BlockAlignmentToolbarProps> {}
}
