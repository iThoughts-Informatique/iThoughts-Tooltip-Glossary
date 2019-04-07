declare module '@wordpress/plugins'{
    export function registerPlugin( name: string, config: {
        icon: JSX.Element;
        render(): JSX.Element;
    } ): void;
}
