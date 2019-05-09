declare module '~editor-config'{
    import { Dictionary } from "underscore";
    const editorConfig: {
        controllerNamespace: string;
        manifest: Dictionary<string | undefined>;
    };
    export default editorConfig;
}
