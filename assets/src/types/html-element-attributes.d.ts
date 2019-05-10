declare module 'html-element-attributes'{
    const attrs: {
        '*': string[];
        [key: string]: string[] | undefined;
    };
    export = attrs;
}
