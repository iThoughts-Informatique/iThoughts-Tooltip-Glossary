// Type definitions for @wordpress/components 7.0.4
// Project: https://github.com/WordPress/gutenberg
// Definitions by: Daniel Mejta <https://github.com/mejta>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// https://raw.githubusercontent.com/mejta/DefinitelyTyped/e0bb9a457bf1be4de760dad326e1c35e4b3c2bee/types/wordpress__components/index.d.ts

declare module '@wordpress/components'{
    import * as React from 'react';
    
    export interface FormFileUploadProps {
        readonly accept: string;
        readonly onChange: Function;
        readonly multiple?: boolean;
        readonly icon?: string;
    }
    
    class FormFileUpload extends React.Component<FormFileUploadProps> {}
    
    export interface ButtonProps {
        readonly href?: string;
        readonly isPrimary?: boolean;
        readonly isLarge?: boolean;
        readonly isSmall?: boolean;
        readonly isTertiary?: boolean;
        readonly isToggled?: boolean;
        readonly isBusy?: boolean;
        readonly isDefault?: boolean;
        readonly isLink?: boolean;
        readonly isDestructive?: boolean;
        readonly className?: string;
        readonly disabled?: boolean;
        readonly onClick?: Function;
    }
    
    class Button extends React.Component<ButtonProps> {}
    
    export interface TextControlProps {
        readonly label?: string;
        readonly help?: string;
        readonly type?: string;
        readonly value: string | number;
        readonly className?: string;
        readonly onChange: Function;
    }
    
    class TextControl extends React.Component<TextControlProps> {}
    
    class Spinner extends React.Component<{}> {}
    
    export interface IconButtonProps {
        readonly icon: string;
        readonly label: string;
        readonly tooltip?: string;
        readonly shortcut?: string;
        readonly labelPosition?: number;
        readonly [prop: string]: any;
    }
    
    class IconButton extends React.Component<IconButtonProps> {}
    
    export interface ToolbarProps {
        readonly controls?: {
            icon: string | JSX.Element;
            title: string;
            subscript?: string;
            onClick: Function;
            isActive: boolean;
            isDisabled?: boolean;
        }[];
        readonly className?: string;
        readonly isCollapsed?: boolean;
        readonly icon?: string | JSX.Element;
    }
    
    class Toolbar extends React.Component<ToolbarProps> {}
    class PanelBody extends React.Component<{}> {}
    
    export interface DashiconProps {
        readonly icon: string,
        readonly size?: number,
        readonly className?: string,
    }
    
    class Dashicon extends React.Component<DashiconProps> {}
    
    export interface ToolbarContainerProps {
        readonly className?: string;
    }
    
    class ToolbarContainer extends React.Component<ToolbarContainerProps> {}
    
    export interface ToolbarButtonContainerProps {
        readonly className?: string;
    }
    
    class ToolbarButtonContainer extends React.Component<ToolbarButtonContainerProps> {}
    
    export interface ServerSideRenderProps {
        readonly block: string;
        readonly attributes?: {
            [attribute: string]: any;
        };
    }
    
    class ServerSideRender extends React.Component<ServerSideRenderProps> {}
    
    export interface SelectControlProps {
        readonly label?: string;
        readonly help?: string;
        readonly multiple?: boolean;
        readonly options?: {
            label: string,
            value: any,
        }[];
        readonly value?: any;
        readonly onChange: Function;
    }
    
    class SelectControl extends React.Component<SelectControlProps> {}
    
    class Disabled extends React.Component<any> {}
}
